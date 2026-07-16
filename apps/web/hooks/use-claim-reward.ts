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
import { activeChain } from "@/lib/wagmi/chains";

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

  const contractAddress = process.env
    .NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS as `0x${string}` | undefined;
  const configured = isRewardContractConfigured({
    contractAddress,
    chainId: activeChain.id,
  });

  const claim = useCallback(async () => {
    if (!interview || !address || !interviewId) return;
    if (!interview.earnings || interview.earnings <= 0) {
      setError("No earnings to claim");
      setState("error");
      return;
    }
    if (!configured || !contractAddress) {
      setError("Reward contract not deployed yet");
      setState("error");
      return;
    }
    if (interview.claimed) {
      setError("Already claimed");
      setState("error");
      return;
    }

    setError(null);
    setState("signing");

    try {
      const amountWei = parseEther(String(interview.earnings));
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
      await markClaimed({ interviewId, txHash: hash });
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Claim failed");
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
