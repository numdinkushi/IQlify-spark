import { getMonadNetworkConfig, resolveMonadNetwork } from "@iqlify-spark/config";

export default function Page() {
  const network = resolveMonadNetwork(process.env.NEXT_PUBLIC_MONAD_NETWORK);
  const networkConfig = getMonadNetworkConfig(network);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-8 px-6 py-12">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Spark Hackathon
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">IQlify</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Practice interviews with voice AI, get graded instantly, and claim
          rewards onchain. Project scaffold is ready — features ship step by
          step.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">
          Monorepo status
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>apps/web — Next.js shell</li>
          <li>apps/contracts — Hardhat workspace</li>
          <li>packages/config — Monad network constants</li>
          <li>packages/domain — shared interview types</li>
          <li>packages/monad-rewards — reward client helpers</li>
          <li>convex — backend schema placeholder</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        <p>
          Target network:{" "}
          <span className="font-medium text-foreground">
            {networkConfig.name}
          </span>{" "}
          (chain {networkConfig.chainId})
        </p>
        <p className="mt-2">
          Next up: wallet connection, Vapi interview booth, grading, and reward
          claims.
        </p>
      </section>
    </main>
  );
}
