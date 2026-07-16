"use client";

import { useMutation, useQuery } from "convex/react";
import { Mic, PhoneOff, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

import type { InterviewDuration, SkillLevel } from "@iqlify-spark/domain";
import { calculateEarningsMon } from "@iqlify-spark/domain";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/components/providers/profile-provider";
import { ClaimRewardButton } from "@/components/interview/claim-reward-button";
import { api, type Id } from "@/lib/convex";
import { toast } from "sonner";
import {
  DURATION_OPTIONS,
  SKILL_OPTIONS,
} from "@/lib/interview/config";
import {
  getTechnicalAssistantId,
  isVapiEnabled,
  VapiService,
} from "@/lib/vapi/client";
import {
  appendLiveTranscript,
  extractCallIdFromMessage,
  fetchCallTranscript,
  isUuid,
  transcriptWordCount,
} from "@/lib/vapi/transcript";
import { formatMonAmount } from "@/lib/utils/format";

type BoothPhase = "setup" | "live" | "grading" | "results";

export function InterviewBooth() {
  const { isConnected } = useAccount();
  const { user } = useProfile();

  const createInterview = useMutation(api.interviews.createInterview);
  const updateInterview = useMutation(api.interviews.updateInterview);

  const [skillLevel, setSkillLevel] = useState<SkillLevel>(
    user?.skillLevel ?? "intermediate",
  );
  const [durationKey, setDurationKey] =
    useState<InterviewDuration>("standard");
  const [phase, setPhase] = useState<BoothPhase>("setup");
  const [interviewId, setInterviewId] = useState<Id<"interviews"> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<number | null>(null);
  const callIdRef = useRef<string | null>(null);
  const liveTranscriptRef = useRef("");

  const interview = useQuery(
    api.interviews.getInterview,
    interviewId ? { interviewId } : "skip",
  );

  useEffect(() => {
    if (user?.skillLevel) setSkillLevel(user.skillLevel);
  }, [user?.skillLevel]);

  const durationMinutes =
    DURATION_OPTIONS.find((d) => d.value === durationKey)?.minutes ?? 10;

  const gradeInterview = useCallback(
    async (id: Id<"interviews">, level: SkillLevel) => {
      try {
        const callId = callIdRef.current;
        let transcript = liveTranscriptRef.current.trim();

        // Vapi often finishes writing the artifact a few seconds after call-end.
        if (callId && isUuid(callId)) {
          await new Promise((r) => setTimeout(r, 1200));
          const remote = await fetchCallTranscript(callId, {
            attempts: 6,
            delayMs: 1500,
          });
          if (transcriptWordCount(remote) > transcriptWordCount(transcript)) {
            transcript = remote;
          }
        }

        if (transcriptWordCount(transcript) < 8) {
          const overall = 0;
          const mon = 0;
          const emptyFeedback =
            "We couldn't recover enough of the conversation to grade this session. Try again, speak clearly after the interviewer finishes, and keep the tab open until grading completes.";

          await updateInterview({
            interviewId: id,
            status: "completed",
            score: overall,
            feedback: emptyFeedback,
            earnings: mon,
            completedAt: Date.now(),
            vapiCallId: callId ?? undefined,
          });

          setScore(overall);
          setFeedback(emptyFeedback);
          setEarnings(mon);
          setPhase("results");
          toast.message("Interview completed", {
            description: "Not enough conversation to grade this session.",
          });
          return;
        }

        const analyzeRes = await fetch("/api/vapi/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript,
            skillLevel: level,
            interviewType: "technical",
          }),
        });

        const result = await analyzeRes.json();
        if (!analyzeRes.ok) {
          throw new Error(result.error || "Grading failed");
        }

        const overall = Number(result.overall) || 0;
        const mon = calculateEarningsMon(overall, level);

        await updateInterview({
          interviewId: id,
          status: "completed",
          score: overall,
          feedback: result.feedback || "No feedback generated.",
          earnings: mon,
          completedAt: Date.now(),
          vapiCallId: callId ?? undefined,
        });

        setScore(overall);
        setFeedback(result.feedback || null);
        setEarnings(mon);
        setPhase("results");
        toast.success("Interview graded", {
          description: `Score ${overall}/100 · ${formatMonAmount(mon)} MON earned`,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Grading failed";
        setError(message);
        await updateInterview({ interviewId: id, status: "failed" });
        setPhase("setup");
        toast.error(message);
      }
    },
    [updateInterview],
  );

  const startInterview = useCallback(async () => {
    if (!user?._id || !isConnected) {
      setError("Connect your wallet and set up your profile first");
      return;
    }
    if (!isVapiEnabled()) {
      setError("Vapi is disabled. Set NEXT_PUBLIC_VAPI_ENABLED=true");
      return;
    }

    setError(null);
    callIdRef.current = null;
    liveTranscriptRef.current = "";

    try {
      const id = await createInterview({
        userId: user._id as Id<"users">,
        type: "live",
        skillLevel,
        interviewType: "technical",
        duration: durationMinutes,
      });
      setInterviewId(id);
      setPhase("live");

      const assistantId = getTechnicalAssistantId();
      const vapi = VapiService.getInstance();

      const startedCallId = await vapi.startCall({
        assistantId,
        durationMinutes,
        skillLevel,
        onCallId: (vapiCallId) => {
          callIdRef.current = vapiCallId;
          void updateInterview({
            interviewId: id,
            status: "in_progress",
            vapiCallId,
          });
        },
        onCallStart: () => {
          void updateInterview({
            interviewId: id,
            status: "in_progress",
            ...(callIdRef.current ? { vapiCallId: callIdRef.current } : {}),
          });
        },
        onMessage: (message) => {
          const fromMsg = extractCallIdFromMessage(message);
          if (fromMsg) callIdRef.current = fromMsg;
          liveTranscriptRef.current = appendLiveTranscript(
            liveTranscriptRef.current,
            message,
          );
        },
        onCallEnd: () => {
          void (async () => {
            setPhase("grading");
            await updateInterview({ interviewId: id, status: "grading" });
            await gradeInterview(id, skillLevel);
          })();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Vapi call failed");
          setPhase("setup");
          vapi.endCall();
        },
      });

      if (startedCallId) {
        callIdRef.current = startedCallId;
        void updateInterview({
          interviewId: id,
          vapiCallId: startedCallId,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start interview");
      setPhase("setup");
    }
  }, [
    createInterview,
    durationMinutes,
    gradeInterview,
    isConnected,
    skillLevel,
    updateInterview,
    user?._id,
  ]);

  function endCall() {
    VapiService.getInstance().endCall();
  }

  if (!isConnected) {
    return (
      <Card className="iqlify-card border-accent/20">
        <CardHeader>
          <CardTitle className="iqlify-accent-text">Connect wallet</CardTitle>
          <CardDescription>
            Connect a Monad wallet before starting an interview.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (phase === "live") {
    return (
      <Card className="iqlify-card border-accent/25">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-accent/15">
            <Mic className="size-8 animate-pulse text-accent" />
          </div>
          <CardTitle className="iqlify-accent-text">Interview live</CardTitle>
          <CardDescription>
            Speak clearly. The session ends automatically or when you hang up.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive"
            onClick={endCall}
          >
            <PhoneOff className="size-4" />
            End interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "grading") {
    return (
      <Card className="iqlify-card border-accent/20">
        <CardContent className="flex flex-col items-center gap-3 py-10">
          <Loader2 className="size-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">
            Grading your interview with Gemini…
          </p>
        </CardContent>
      </Card>
    );
  }

  if (phase === "results" && interviewId) {
    return (
      <Card className="iqlify-card border-accent/20">
        <CardHeader>
          <CardTitle className="iqlify-accent-text">Results</CardTitle>
          <CardDescription>
            Score {score ?? interview?.score ?? "—"} / 100 · Earn{" "}
            {formatMonAmount(earnings ?? interview?.earnings)} MON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {feedback ?? interview?.feedback}
          </p>
          <ClaimRewardButton interviewId={interviewId} />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setPhase("setup");
              setInterviewId(null);
              setScore(null);
              setFeedback(null);
              setEarnings(null);
            }}
          >
            Practice again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="iqlify-card border-accent/20">
      <CardHeader>
        <CardTitle className="iqlify-accent-text">Technical interview</CardTitle>
        <CardDescription>
          One voice session with AI. Get graded, then claim MON rewards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Skill level</label>
          <Select
            value={skillLevel}
            onValueChange={(v) => v && setSkillLevel(v as SkillLevel)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <Select
            value={durationKey}
            onValueChange={(v) =>
              v && setDurationKey(v as InterviewDuration)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          className="iqlify-button-primary h-11 w-full rounded-xl"
          onClick={() => void startInterview()}
        >
          <Mic className="size-4" />
          Start interview
        </Button>
      </CardContent>
    </Card>
  );
}
