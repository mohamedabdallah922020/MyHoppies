export type PasswordStrengthLevel =
  | "empty"
  | "weak"
  | "fair"
  | "good"
  | "strong";

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  label: string;
  score: number;
  maxScore: number;
};

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { level: "empty", label: "", score: 0, maxScore: 4 };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const capped = Math.min(score, 4);

  if (capped <= 1) {
    return { level: "weak", label: "Weak", score: capped, maxScore: 4 };
  }
  if (capped === 2) {
    return { level: "fair", label: "Fair", score: capped, maxScore: 4 };
  }
  if (capped === 3) {
    return { level: "good", label: "Good", score: capped, maxScore: 4 };
  }
  return { level: "strong", label: "Strong", score: capped, maxScore: 4 };
}

export function strengthBarColor(level: PasswordStrengthLevel): string {
  switch (level) {
    case "weak":
      return "bg-red-500";
    case "fair":
      return "bg-amber-500";
    case "good":
      return "bg-teal-500";
    case "strong":
      return "bg-emerald-500";
    default:
      return "bg-stone-200 dark:bg-zinc-700";
  }
}
