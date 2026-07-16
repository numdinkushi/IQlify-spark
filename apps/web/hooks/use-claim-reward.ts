"use client";

import { useMutation, useQuery } from "convex/react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useCallback, useState } from "react";

import {
  REWARD_DISTRIBUTOR_ABI,
  ZERO_REFERRAL_TAG,
  isRewardContractConfigured,
} from "@iqlify-spark/monad-rewards";

import { api, type Id } from "@/lib/convex";
import { getActiveRewardConfig } from "@/lib/rewards/config";
import { activeChain } from "@/lib/wagmi/chains";
import { toast } from "sonner";
import { formatMonAmount } from "@/lib/utils/format";

type ClaimState =
  | "idle"
  | "signing"
  | "confirming"
  | "pending"
  | "success"
  | "error";

export function useClaimReward(interviewId: Id<"interviews"> | undefined) {
  const { address } = useAccount();
  const interview = useQuery(
    api.interviews.getInterview,
    interviewId ? { interviewId } : "skip",
  );
  const markClaimed = useMutation(api.interviews.markInterviewClaimed);
  const { writeContractAsync } = useWriteContract();

  const [state, setState] = useState<ClaimState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const { contractAddress } = getActiveRewardConfig();
  const configured = isRewardContractConfigured({
    contractAddress,
    chainId: activeChain.id,
  });

  const claim = useCallback(async () => {
    if (!interview || !address || !interviewId) return;
    if (!interview.earnings || interview.earnings <= 0) {
      const message = "No earnings to claim";
      setError(message);
      setState("error");
      toast.error(message);
      return;
    }
    if (!configured || !contractAddress) {
      const message = "Reward contract not deployed yet";
      setError(message);
      setState("error");
      toast.error(message);
      return;
    }
    if (interview.claimed) {
      const message = "Already claimed";
      setError(message);
      setState("error");
      toast.error(message);
      return;
    }

    setError(null);
    setState("signing");
    const toastId = toast.loading("Preparing claim…");

    try {
      // Avoid float dust so EIP-712 amount matches onchain wei cleanly
      const amountWei = parseEther(Number(interview.earnings).toFixed(4));
      const nonce = Math.floor(Date.now() / 1000);
      const deadline = nonce + 10 * 60;

      const signRes = await fetch("/api/rewards/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: address,
          amount: amountWei.toString(),
          nonce,
          deadline,
          referralTag: ZERO_REFERRAL_TAG,
        }),
      });

      const signed = await signRes.json();
      if (!signRes.ok) {
        throw new Error(signed.error || "Signing failed");
      }

      toast.loading("Confirm in your wallet…", { id: toastId });
      setState("confirming");
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: REWARD_DISTRIBUTOR_ABI,
        functionName: "claimWithSignature",
        args: [
          amountWei,
          BigInt(nonce),
          BigInt(deadline),
          ZERO_REFERRAL_TAG,
          signed.v,
          signed.r,
          signed.s,
        ],
        chainId: activeChain.id,
      });

      setTxHash(hash);
      setState("pending");
      toast.loading("Claim submitted…", { id: toastId });
      await markClaimed({ interviewId, txHash: hash });
      setState("success");
      toast.success(
        `Claimed ${formatMonAmount(interview.earnings)} MON`,
        { id: toastId },
      );
    } catch (err) {
      setState("error");
      const message = err instanceof Error ? err.message : "Claim failed";
      setError(message);
      toast.error(message, { id: toastId });
    }
  }, [
    address,
    configured,
    contractAddress,
    interview,
    interviewId,
    markClaimed,
    writeContractAsync,
  ]);

  return {
    claim,
    state: waiting ? "pending" : isSuccess && state === "pending" ? "success" : state,
    error,
    txHash,
    configured,
    alreadyClaimed: Boolean(interview?.claimed),
    earnings: interview?.earnings ?? 0,
  };
}
