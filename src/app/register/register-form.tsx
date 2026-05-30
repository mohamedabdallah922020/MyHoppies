"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  AuthMobileBrandHeader,
  AuthMobilePills,
  AuthShowcasePanel,
} from "@/components/auth/auth-showcase-panel";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validations/register";

const inputClassName =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 shadow-sm outline-none ring-teal-600/30 transition placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-stone-800 dark:text-zinc-200";

const errorClassName = "mt-1.5 text-xs text-red-600 dark:text-red-400";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue =
    useWatch({ control: form.control, name: "password", defaultValue: "" }) ??
    "";

  async function handleRegister(data: RegisterFormValues) {
    setServerError(null);
    setSuccessMessage(null);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    if (!response.ok) {
      setServerError(
        payload.error ??
          "Something went wrong while creating your account. Please try again.",
      );
      return;
    }

    setSuccessMessage(
      "Your account was created successfully. Redirecting you to sign in…",
    );

    window.setTimeout(() => {
      router.push("/login?registered=1");
    }, 1800);
  }

  return (
    <div className="flex min-h-full flex-1">
      <AuthShowcasePanel
        headline={
          <>
            Start tracking
            <br />
            what you love.
          </>
        }
        description="Join MyHoppies to organize your hobbies, set goals, and celebrate progress in one place."
      />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:max-w-[480px] lg:px-14">
        <AuthMobileBrandHeader />

        <div className="mb-8 hidden w-full max-w-sm lg:block">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Sign up to start tracking your hobbies
          </p>
        </div>

        <div className="w-full max-w-sm">
          {serverError ? (
            <p
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-200"
              role="alert"
            >
              {serverError}
            </p>
          ) : null}

          {successMessage ? (
            <p
              className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-200"
              role="status"
            >
              {successMessage}
            </p>
          ) : null}

          <form
            className="space-y-5"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit(handleRegister)(event);
            }}
          >
            <div>
              <label htmlFor="name" className={labelClassName}>
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                className={inputClassName}
                disabled={!!successMessage}
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p className={errorClassName}>{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="register-email" className={labelClassName}>
                Email
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClassName}
                disabled={!!successMessage}
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className={errorClassName}>
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="register-password" className={labelClassName}>
                Password
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={inputClassName}
                disabled={!!successMessage}
                {...form.register("password")}
              />
              <PasswordStrengthIndicator password={passwordValue} />
              {form.formState.errors.password ? (
                <p className={errorClassName}>
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="confirm-password" className={labelClassName}>
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={inputClassName}
                disabled={!!successMessage}
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword ? (
                <p className={errorClassName}>
                  {form.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={form.formState.isSubmitting || !!successMessage}
              className="w-full rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition hover:from-teal-600 hover:to-teal-700 disabled:opacity-60 dark:from-teal-600 dark:to-teal-700 dark:hover:from-teal-500 dark:hover:to-teal-600"
            >
              {form.formState.isSubmitting
                ? "Creating account…"
                : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-900 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
            >
              Sign in
            </Link>
          </p>

          <AuthMobilePills />
        </div>
      </div>
    </div>
  );
}
