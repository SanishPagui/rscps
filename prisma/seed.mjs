import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  // Example seed data
  await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: "securepassword",
    },
  });
}

main()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  });
