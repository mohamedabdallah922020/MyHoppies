"use client";

import {
  getPasswordStrength,
  strengthBarColor,
  type PasswordStrengthLevel,
} from "@/lib/password-strength";

type PasswordStrengthIndicatorProps = {
  password: string;
};

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = getPasswordStrength(password);

  if (strength.level === "empty") {
    return null;
  }

  const activeColor = strengthBarColor(strength.level);

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" role="meter" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={strength.maxScore} aria-label={`Password strength: ${strength.label}`}>
        {Array.from({ length: strength.maxScore }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < strength.score ? activeColor : "bg-stone-200 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
        Password strength:{" "}
        <span className={strengthLabelClass(strength.level)}>{strength.label}</span>
      </p>
    </div>
  );
}

function strengthLabelClass(level: PasswordStrengthLevel): string {
  switch (level) {
    case "weak":
      return "font-medium text-red-600 dark:text-red-400";
    case "fair":
      return "font-medium text-amber-600 dark:text-amber-400";
    case "good":
      return "font-medium text-teal-700 dark:text-teal-400";
    case "strong":
      return "font-medium text-emerald-700 dark:text-emerald-400";
    default:
      return "";
  }
}
