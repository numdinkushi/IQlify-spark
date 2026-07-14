# IQlify

**Practice interviews. Get graded. Earn on Monad.**

IQlify is an AI voice interview practice app with onchain reward claims — rebuilt on Monad for the [Spark hackathon](https://buildanything.so/hackathons/spark?tab=overview) on BuildAnything.

This repo uses the **Goalaxify monorepo style** (npm workspaces, shared packages, root-level Convex) while targeting the **IQlify product flow** (Vapi interviews, Gemini grading, reward claims).

---

## Monorepo structure

```
iqlify-spark/
├── apps/
│   ├── web/                 # Next.js app (UI + API routes)
│   └── contracts/           # Hardhat workspace for Monad contracts
├── convex/                  # Convex schema and backend functions
├── packages/
│   ├── config/              # Monad network constants
│   ├── domain/              # Shared interview/reward types
│   └── monad-rewards/       # Reward distributor client helpers
├── scripts/                 # Setup and deployment scripts
└── docs/                    # Architecture and build plan
```

---

## Prerequisites

- Node.js 20+
- npm
- Convex account
- Monad testnet MON ([faucet](https://faucet.monad.xyz))
- Vapi account (added in a later feature step)
- Google Gemini API key (added in a later feature step)

---

## Getting started

```bash
cd iqlify-spark
npm install
cp .env.example .env
```

### Convex

```bash
npm run convex:dev
```

Copy the deployment URL into `.env` as `NEXT_PUBLIC_CONVEX_URL`.

### Run the web app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Compile contracts (placeholder workspace)

```bash
npm run contracts:compile
```

---

## Environment variables

See [`.env.example`](.env.example). Key groups:

| Group | Purpose |
|-------|---------|
| **Convex** | Backend database and functions |
| **Vapi** | Voice interview booth |
| **Gemini** | Interview transcript grading |
| **Monad** | Network, RPC, reward contract address |
| **Cloudinary** | Profile image uploads (later) |

---

## Build plan (step by step)

1. **Scaffold** — monorepo, Next.js shell, Convex schema placeholder
2. **Wallet** — Monad wallet connection (RainbowKit + wagmi)
3. **Profile** — user onboarding and Convex profile sync
4. **Interview booth** — Vapi voice session flow
5. **Grading** — Gemini scoring and feedback
6. **Rewards** — deploy `RewardDistributor` on Monad testnet + claim flow
7. **Polish** — demo video, README, submission assets

See [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) for details.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build all workspaces |
| `npm run typecheck` | Typecheck all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run convex:dev` | Start Convex dev deployment |
| `npm run contracts:compile` | Compile Hardhat contracts |

---

## Hackathon alignment

- **Personal problem:** interview practice is inconsistent and mock interviews are costly
- **Onchain component:** MON rewards distributed via signed claims on Monad
- **One real feature first:** complete one interview and claim a reward before adding extras

---

## License

MIT
