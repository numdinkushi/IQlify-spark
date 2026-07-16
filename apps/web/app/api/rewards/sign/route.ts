import { NextRequest, NextResponse } from "next/server";
import { Wallet } from "ethers";

import {
  CLAIM_TYPED_DATA,
  EIP712_DOMAIN_NAME,
  EIP712_DOMAIN_VERSION,
  ZERO_REFERRAL_TAG,
} from "@iqlify-spark/monad-rewards";

import { getActiveRewardConfig } from "@/lib/rewards/config";

export async function POST(req: NextRequest) {
  try {
    const signerKey = process.env.REWARD_SIGNER_PRIVATE_KEY;
    const { contractAddress, chainId } = getActiveRewardConfig();

    if (!signerKey) {
      return NextResponse.json(
        { error: "Missing REWARD_SIGNER_PRIVATE_KEY" },
        { status: 500 },
      );
    }
    if (!contractAddress) {
      return NextResponse.json(
        { error: "Missing reward contract address" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { user, amount, nonce, deadline, referralTag } = body as {
      user: string;
      amount: string | number;
      nonce: number;
      deadline: number;
      referralTag?: string;
    };

    if (!user) {
      return NextResponse.json({ error: "Missing user" }, { status: 400 });
    }

    let amountBn: bigint;
    try {
      amountBn = BigInt(amount);
    } catch {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (typeof nonce !== "number" || typeof deadline !== "number") {
      return NextResponse.json(
        { error: "Invalid nonce/deadline" },
        { status: 400 },
      );
    }

    const domain = {
      name: EIP712_DOMAIN_NAME,
      version: EIP712_DOMAIN_VERSION,
      chainId,
      verifyingContract: contractAddress,
    };

    const value = {
      user,
      amount: amountBn,
      nonce,
      deadline,
      referralTag: (referralTag || ZERO_REFERRAL_TAG) as `0x${string}`,
    };

    const signer = new Wallet(signerKey);
    const signature = (await signer.signTypedData(
      domain,
      CLAIM_TYPED_DATA,
      value,
    )) as `0x${string}`;

    const r = signature.slice(0, 66) as `0x${string}`;
    const s = (`0x${signature.slice(66, 130)}`) as `0x${string}`;
    const v = parseInt(signature.slice(130, 132), 16);

    return NextResponse.json({ v, r, s });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
