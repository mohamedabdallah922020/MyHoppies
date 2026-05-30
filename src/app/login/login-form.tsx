"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { loginFormSchema, type LoginFormValues } from "@/lib/validations/login";

type ChimeType = "welcome" | "success" | "error";

function playChime(ctx: AudioContext, type: ChimeType) {
  const sequences: { freq: number; time: number; dur: number }[] =
    type === "welcome"
      ? [
          { freq: 523.25, time: 0, dur: 0.5 },
          { freq: 659.25, time: 0.14, dur: 0.5 },
          { freq: 783.99, time: 0.28, dur: 0.65 },
        ]
      : type === "success"
      ? [
          { freq: 659.25, time: 0, dur: 0.3 },
          { freq: 783.99, time: 0.12, dur: 0.3 },
          { freq: 1046.5, time: 0.24, dur: 0.65 },
        ]
      : [
          { freq: 330, time: 0, dur: 0.3 },
          { freq: 277.18, time: 0.18, dur: 0.45 },
        ];

  sequences.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = ctx.currentTime + time;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  });
}

function getOrCreateAudioCtx(ref: React.MutableRefObject<AudioContext | null>) {
  if (!ref.current) {
    ref.current = new AudioContext();
  }
  if (ref.current.state === "suspended") {
    ref.current.resume();
  }
  return ref.current;
}

const HOBBY_ITEMS = [
  { icon: "🎨", label: "Art",          top: "6%",  left: "6%",  delay: "0s",    rotate: "-8deg" },
  { icon: "📚", label: "Reading",      top: "11%", left: "54%", delay: "0.7s",  rotate: "5deg"  },
  { icon: "🎵", label: "Music",        top: "36%", left: "3%",  delay: "1.2s",  rotate: "-4deg" },
  { icon: "📷", label: "Photography",  top: "26%", left: "60%", delay: "0.3s",  rotate: "6deg"  },
  { icon: "🌿", label: "Gardening",    top: "67%", left: "5%",  delay: "1.5s",  rotate: "-6deg" },
  { icon: "🎮", label: "Gaming",       top: "74%", left: "53%", delay: "0.9s",  rotate: "4deg"  },
  { icon: "✈️", label: "Travel",       top: "83%", left: "27%", delay: "1.8s",  rotate: "-3deg" },
  { icon: "🍳", label: "Cooking",      top: "54%", left: "59%", delay: "0.5s",  rotate: "7deg"  },
];

const HOBBY_TAGS = ["Painting", "Music", "Reading", "Travel", "Gaming", "Cooking"];

const MOBILE_PILLS = [
  { icon: "🎨", label: "Art" },
  { icon: "🎵", label: "Music" },
  { icon: "📚", label: "Reading" },
  { icon: "✈️", label: "Travel" },
  { icon: "🎮", label: "Gaming" },
  { icon: "🍳", label: "Cooking" },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [authError, setAuthError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const welcomedRef = useRef(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  function handleFirstInteraction() {
    if (welcomedRef.current) return;
    welcomedRef.current = true;
    try {
      const ctx = getOrCreateAudioCtx(audioCtxRef);
      playChime(ctx, "welcome");
    } catch {}
  }

  const onSubmit = form.handleSubmit(async (data) => {
    setAuthError(null);
    const result = await signIn("credentials", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      rememberMe: data.rememberMe ? "true" : "false",
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      try {
        const ctx = getOrCreateAudioCtx(audioCtxRef);
        playChime(ctx, "error");
      } catch {}
      setAuthError("Invalid email or password. Please try again.");
      return;
    }

    try {
      const ctx = getOrCreateAudioCtx(audioCtxRef);
      playChime(ctx, "success");
    } catch {}

    router.replace(result?.url ?? callbackUrl);
    router.refresh();
  });

  return (
    <div className="flex min-h-full flex-1">
      {/* ── Left panel: hobby showcase ── */}
      <div
        className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-center"
        style={{
          background:
            "linear-gradient(135deg, #0f766e 0%, #1d4ed8 55%, #312e81 100%)",
        }}
      >
        {/* Ambient blobs */}
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

        {/* Floating hobby cards */}
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

        {/* Center hero text */}
        <div className="relative z-10 px-12 py-16">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-xl backdrop-blur-sm">
            <span className="text-3xl leading-none">🎯</span>
          </div>

          <h2 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-white">
            Track what<br />you love.
          </h2>
          <p className="mt-4 max-w-[280px] text-base leading-relaxed text-white/65">
            MyHoppies brings all your hobbies together in one beautiful
            dashboard — so you never lose track of what inspires you.
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

      {/* ── Right panel: login form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:max-w-[480px] lg:px-14">
        {/* Mobile brand header */}
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

        {/* Desktop brand header */}
        <div className="mb-8 hidden w-full max-w-sm lg:block">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Sign in to explore your hobbies
          </p>
        </div>

        <div className="w-full max-w-sm">
          {authError ? (
            <p
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-200"
              role="alert"
            >
              {authError}
            </p>
          ) : null}

          <form
            onSubmit={onSubmit}
            className="space-y-5"
            noValidate
            onFocus={handleFirstInteraction}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-stone-800 dark:text-zinc-200"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 shadow-sm outline-none ring-teal-600/30 transition placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-stone-800 dark:text-zinc-200"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-teal-700 hover:text-teal-900 hover:underline underline-offset-4 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 shadow-sm outline-none ring-teal-600/30 transition placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 select-none">
              <input
                type="checkbox"
                className="size-4 rounded border-stone-400 text-teal-700 ring-teal-600/30 focus-visible:ring-2 dark:border-zinc-500 dark:bg-zinc-900"
                {...form.register("rememberMe")}
              />
              <span className="text-sm text-stone-600 dark:text-zinc-400">
                Remember me for 30 days
              </span>
            </label>

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition hover:from-teal-600 hover:to-teal-700 disabled:opacity-60 dark:from-teal-600 dark:to-teal-700 dark:hover:from-teal-500 dark:hover:to-teal-600"
            >
              {form.formState.isSubmitting ? "Signing in…" : "Sign in to MyHoppies"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            New to MyHoppies?{" "}
            <Link
              href="/register"
              className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-900 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
            >
              Create an account
            </Link>
          </p>

          {/* Mobile hobby pills */}
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
        </div>
      </div>
    </div>
  );
}
