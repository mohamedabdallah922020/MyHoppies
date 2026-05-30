import "dotenv/config";

import { hash } from "bcryptjs";

import { prisma } from "../src/lib/prisma";

async function main() {
  const email =
    process.env.SEED_USER_EMAIL?.trim().toLowerCase() ??
    "dev@myhoppies.local";
  const password = process.env.SEED_USER_PASSWORD ?? "devpassword123";
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      name: "Dev User",
    },
    update: {
      passwordHash,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
