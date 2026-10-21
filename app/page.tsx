import PricingSimulator from "./components/PricingSimulator";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-[640px]">
        <header className="mb-10 text-center">
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase mb-3">
            Portfolio / Next.js Demo
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            料金シミュレーター
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Web制作のコーディング費用を、属性（エンドユーザー／制作会社パートナー）や
            制作内容に応じて概算できるツールです。
            <br />
            Next.js（App Router）・React・TypeScriptで実装し、Vercelにデプロイしています。
          </p>
        </header>

        <PricingSimulator />

        <footer className="mt-12 text-center text-xs text-white/40 leading-relaxed">
          <p>
            Built with Next.js, React, TypeScript — developed with Claude Code.
          </p>
          <p className="mt-2">
            <a
              href="https://luolyweb.com/"
              className="underline hover:text-white/70 transition-colors"
            >
              L&apos;uoly Web ポートフォリオへ戻る
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
