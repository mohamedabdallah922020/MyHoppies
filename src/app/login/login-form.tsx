"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  AuthMobileBrandHeader,
  AuthMobilePills,
  AuthShowcasePanel,
} from "@/components/auth/auth-showcase-panel";
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

const inputClassName =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 shadow-sm outline-none ring-teal-600/30 transition placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const registered = searchParams.get("registered") === "1";
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

  async function handleLogin(data: LoginFormValues) {
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
  }

  return (
    <div className="flex min-h-full flex-1">
      <AuthShowcasePanel
        headline={
          <>
            Track what
            <br />
            you love.
          </>
        }
        description="MyHoppies brings all your hobbies together in one beautiful dashboard — so you never lose track of what inspires you."
      />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:max-w-[480px] lg:px-14">
        <AuthMobileBrandHeader />

        <div className="mb-8 hidden w-full max-w-sm lg:block">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Sign in to explore your hobbies
          </p>
        </div>

        <div className="w-full max-w-sm">
          {registered ? (
            <p
              className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-200"
              role="status"
            >
              Account created successfully. Sign in with your new credentials.
            </p>
          ) : null}

          {authError ? (
            <p
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-200"
              role="alert"
            >
              {authError}
            </p>
          ) : null}

          <form
            className="space-y-5"
            noValidate
            onFocus={handleFirstInteraction}
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit(handleLogin)(event);
            }}
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
                className={inputClassName}
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
                className={inputClassName}
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

          <AuthMobilePills />
        </div>
      </div>
    </div>
  );
}
