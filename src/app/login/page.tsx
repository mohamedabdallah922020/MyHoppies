import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";

function LoginFallback() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16 text-stone-600 dark:text-zinc-400">
      Loading…
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
