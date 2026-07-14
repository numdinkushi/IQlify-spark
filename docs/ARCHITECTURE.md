# Architecture

IQlify ports the interview-and-reward loop from Celo to Monad, using Goalaxify's monorepo conventions.

## Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| UI | `apps/web` | Next.js routes, interview UX, wallet flows |
| API | `apps/web/app/api` | Vapi webhooks, grading, reward signing |
| Backend | `convex/` | Users, interviews, transactions, leaderboard |
| Onchain | `apps/contracts` | Reward distributor on Monad testnet |
| Shared types | `packages/domain` | Interview and reward domain models |
| Network config | `packages/config` | Monad RPC, chain IDs, explorer URLs |
| Reward client | `packages/monad-rewards` | Claim helpers and contract bindings |

## Core user flow (target)

```mermaid
flowchart LR
  User[User] --> Wallet[Monad Wallet]
  Wallet --> Booth[Vapi Interview Booth]
  Booth --> Grade[Gemini Grading]
  Grade --> Sign[Server-signed Claim]
  Sign --> Chain[RewardDistributor on Monad]
  Grade --> Convex[Convex Records]
  Chain --> Convex
```

## Reference projects

- **IQlify (reference only):** interview types, grading model, reward claim pattern
- **Goalaxify (structure):** npm workspaces, package boundaries, Convex at repo root

## Intentionally deferred

These IQlify features are out of scope for the initial scaffold:

- Leaderboards
- Challenges and entry fees
- Multi-language UI (add after core loop works)
- Certificates and PDF exports
- MiniPay-specific integrations

Ship the core loop first: **interview → grade → claim**.
