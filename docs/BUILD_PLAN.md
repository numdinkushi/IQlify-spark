# Build Plan

Step-by-step delivery for the Spark hackathon submission.

## Phase 0 — Scaffold (this commit)

- [x] Goalaxify-style monorepo layout
- [x] Next.js shell with placeholder home page
- [x] Convex schema placeholder (`users` table)
- [x] Hardhat workspace for Monad contracts
- [x] Shared packages: `config`, `domain`, `monad-rewards`

## Phase 1 — Wallet + profile

- [ ] RainbowKit + wagmi configured for Monad testnet
- [ ] Connect wallet button and network display
- [ ] Create/update Convex user on wallet connect
- [ ] Basic profile page (display name, skill level)

## Phase 2 — Interview booth

- [ ] Vapi client integration
- [ ] Interview setup flow (skill level, type, duration)
- [ ] Equipment check (mic/audio)
- [ ] Live voice session with one assistant type (technical first)
- [ ] Vapi webhook → Convex interview record

## Phase 3 — Grading

- [ ] Gemini transcript analysis
- [ ] Score breakdown and written feedback
- [ ] Interview results page
- [ ] Reward amount calculation from score

## Phase 4 — Onchain rewards

- [ ] Port `RewardDistributorV2` to Monad (`apps/contracts`)
- [ ] Deploy to Monad testnet
- [ ] Server-side EIP-712 claim signing
- [ ] Claim button in UI with transaction feedback

## Phase 5 — Submission polish

- [ ] README with setup instructions
- [ ] Demo video (≤ 3 min)
- [ ] Public GitHub repo + hosted URL
- [ ] Social post for viral prize track
- [ ] Contract verification on Monad explorer

## Definition of done (MVP)

A judge can:

1. Connect a wallet on Monad testnet
2. Complete one voice interview
3. See a real AI-generated score and feedback
4. Claim MON rewards onchain
5. Understand the personal problem in under 3 minutes
