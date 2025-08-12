const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@gmail.com"; // <-- Change this
  const plainPassword = "dikapd12f"; // <-- Change this

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  // Delete existing admin if they exist
  await prisma.user.delete({ where: { email: adminEmail } }).catch(() => {});

  // Create the new admin user in the 'User' table
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      hashedPassword: hashedPassword,
      name: "Admin User",
    },
  });
  console.log("Admin user created successfully in 'User' table:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());