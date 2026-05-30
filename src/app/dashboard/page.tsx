import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-1 flex-col gap-8 px-4 py-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Signed in as{" "}
          <span className="font-medium text-stone-800 dark:text-zinc-200">
            {session.user.email}
          </span>
          . This placeholder will be expanded in Issue #9 (home dashboard).
        </p>
      </header>
      <div className="flex gap-4">
        <SignOutButton />
      </div>
    </div>
  );
}
