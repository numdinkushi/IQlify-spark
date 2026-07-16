"use client";

import { useMutation } from "convex/react";
import { Camera, Copy, Loader2, Star, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import type { SkillLevel } from "@iqlify-spark/domain";

import { MonadNetworkRow } from "@/components/wallet/monad-network-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useProfileImageUpload } from "@/hooks/use-profile-image-upload";
import { useProfile } from "@/components/providers/profile-provider";
import { api } from "@/lib/convex";
import { formatFriendlyDate, shortWalletAddress } from "@/lib/utils/format";
import { toast } from "sonner";

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function ProfileDetailsTab() {
  const { address } = useAccount();
  const { user } = useProfile();
  const updateProfile = useMutation(api.users.updateProfile);
  const { copied, copy } = useCopyToClipboard();
  const {
    inputRef,
    uploading,
    error: uploadError,
    previewUrl,
    openPicker,
    onFileChange,
  } = useProfileImageUpload();

  const [displayName, setDisplayName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("intermediate");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName ?? "");
    setSkillLevel(user.skillLevel ?? "intermediate");
  }, [user]);

  const displayLabel = displayName.trim() || shortWalletAddress(address, 4);
  const imageUrl = previewUrl || user?.profileImage;

  async function saveProfile() {
    if (!address) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        walletAddress: address,
        displayName: displayName.trim(),
        skillLevel,
      });
      toast.success("Profile saved");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save profile";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="iqlify-card border-accent/20">
        <CardContent className="space-y-5 p-5">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(event) => void onFileChange(event)}
              />
              <button
                type="button"
                onClick={openPicker}
                disabled={uploading || !address}
                aria-label="Upload profile picture"
                className="group relative size-24 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-muted/40 outline-none transition-opacity disabled:opacity-60"
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center bg-brand-gradient text-brand-ink">
                    <UserRound className="size-10" />
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {uploading ? (
                    <Loader2 className="size-5 animate-spin text-white" />
                  ) : (
                    <Camera className="size-5 text-white" />
                  )}
                </span>
              </button>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-lg font-semibold text-foreground">
                {displayLabel}
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                {shortWalletAddress(address, 6)}
              </p>
              <p className="text-xs text-muted-foreground">
                {uploading
                  ? "Uploading…"
                  : "Tap the photo to upload a profile image"}
              </p>
              {uploadError ? (
                <p className="text-xs text-destructive">{uploadError}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="display-name"
              className="text-sm font-medium text-foreground"
            >
              Username
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Choose a display name"
              maxLength={48}
              className="h-11 w-full rounded-xl border border-border/70 bg-muted/30 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="skill-level"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Star className="size-4 text-accent" />
              Skill level
            </label>
            <Select
              value={skillLevel}
              onValueChange={(value) => {
                if (value) setSkillLevel(value as SkillLevel);
              }}
            >
              <SelectTrigger id="skill-level" className="h-11 w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Wallet address</p>
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/30 p-3">
              <p className="min-w-0 flex-1 break-all font-mono text-xs leading-relaxed text-muted-foreground">
                {address}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => address && void copy(address)}
              >
                <Copy className="size-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl bg-muted/40 p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Wallet app</span>
              <span className="font-medium">Injected</span>
            </div>
            <MonadNetworkRow compact />
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">
                {formatFriendlyDate(user?.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Interviews completed</span>
              <span className="font-medium">{user?.totalInterviews ?? 0}</span>
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="button"
            className="iqlify-button-primary h-11 w-full rounded-xl"
            disabled={saving || !displayName.trim()}
            onClick={() => void saveProfile()}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
