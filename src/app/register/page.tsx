import Link from "next/link";

export default function RegisterPlaceholderPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
        Registration / Sign-up
      </h1>
      <p className="mt-3 text-stone-600 dark:text-stone-400">
        This page will be implemented in{" "}
        <a
          href="https://github.com/mohamedabdallah922020/MyHoppies/issues/2"
          className="font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          Issue #2 — User Story: Registration / Sign-up page
        </a>
        .
      </p>
      <p className="mt-6">
        <Link
          href="/login"
          className="font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-400"
        >
          Back to login
        </Link>
      </p>
    </div>
  );
}
