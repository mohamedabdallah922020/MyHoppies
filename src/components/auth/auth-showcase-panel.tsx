import type { ReactNode } from "react";

const HOBBY_ITEMS = [
  { icon: "🎨", label: "Art", top: "6%", left: "6%", delay: "0s", rotate: "-8deg" },
  { icon: "📚", label: "Reading", top: "11%", left: "54%", delay: "0.7s", rotate: "5deg" },
  { icon: "🎵", label: "Music", top: "36%", left: "3%", delay: "1.2s", rotate: "-4deg" },
  { icon: "📷", label: "Photography", top: "26%", left: "60%", delay: "0.3s", rotate: "6deg" },
  { icon: "🌿", label: "Gardening", top: "67%", left: "5%", delay: "1.5s", rotate: "-6deg" },
  { icon: "🎮", label: "Gaming", top: "74%", left: "53%", delay: "0.9s", rotate: "4deg" },
  { icon: "✈️", label: "Travel", top: "83%", left: "27%", delay: "1.8s", rotate: "-3deg" },
  { icon: "🍳", label: "Cooking", top: "54%", left: "59%", delay: "0.5s", rotate: "7deg" },
];

const HOBBY_TAGS = ["Painting", "Music", "Reading", "Travel", "Gaming", "Cooking"];

type AuthShowcasePanelProps = {
  headline: ReactNode;
  description: string;
};

export function AuthShowcasePanel({
  headline,
  description,
}: AuthShowcasePanelProps) {
  return (
    <div
      className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-center"
      style={{
        background:
          "linear-gradient(135deg, #0f766e 0%, #1d4ed8 55%, #312e81 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-teal-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-indigo-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/3 right-1/4 size-48 rounded-full bg-cyan-400/10 blur-2xl"
        aria-hidden
      />

      {HOBBY_ITEMS.map((item) => (
        <div
          key={item.label}
          className="hobby-float pointer-events-none absolute"
          style={{ top: item.top, left: item.left, animationDelay: item.delay }}
          aria-hidden
        >
          <div
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 shadow-lg backdrop-blur-sm"
            style={{ transform: `rotate(${item.rotate})` }}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-sm font-medium text-white/90">{item.label}</span>
          </div>
        </div>
      ))}

      <div className="relative z-10 px-12 py-16">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-xl backdrop-blur-sm">
          <span className="text-3xl leading-none">🎯</span>
        </div>

        <h2 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-white">
          {headline}
        </h2>
        <p className="mt-4 max-w-[280px] text-base leading-relaxed text-white/65">
          {description}
        </p>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {HOBBY_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const MOBILE_PILLS = [
  { icon: "🎨", label: "Art" },
  { icon: "🎵", label: "Music" },
  { icon: "📚", label: "Reading" },
  { icon: "✈️", label: "Travel" },
  { icon: "🎮", label: "Gaming" },
  { icon: "🍳", label: "Cooking" },
];

export function AuthMobilePills() {
  return (
    <div className="mt-10 lg:hidden">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-stone-400">
        Track your hobbies
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {MOBILE_PILLS.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
          >
            <span>{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AuthMobileBrandHeader() {
  return (
    <div className="mb-8 text-center lg:hidden">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-teal-800/20 bg-teal-50 shadow-md dark:border-teal-200/15 dark:bg-teal-950/50">
        <span className="text-2xl leading-none">🎯</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
        MyHoppies
      </h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Your personal hobbies dashboard
      </p>
    </div>
  );
}
