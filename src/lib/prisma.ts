import path from "node:path";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma";

function databaseUrlToSqlitePath(databaseUrl: string): string {
  const withoutScheme = databaseUrl.replace(/^file:/, "");
  if (path.isAbsolute(withoutScheme)) {
    return withoutScheme;
  }
  return path.join(process.cwd(), withoutScheme.replace(/^\.\//, ""));
}

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({
  url: databaseUrlToSqlitePath(databaseUrl),
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
