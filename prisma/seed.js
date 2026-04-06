import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaClient } from './generated/client/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';



const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping'];

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zorvyn.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@zorvyn.com', password: hash, role: 'ADMIN' },
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@zorvyn.com' },
    update: {},
    create: { name: 'Analyst User', email: 'analyst@zorvyn.com', password: hash, role: 'ANALYST' },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@zorvyn.com' },
    update: {},
    create: { name: 'Viewer User', email: 'viewer@zorvyn.com', password: hash, role: 'VIEWER' },
  });

  const txData = [];
  const users = [admin.id, analyst.id, viewer.id];

  for (let i = 0; i < 60; i++) {
    const isIncome = i % 5 === 0;
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(i / 10));
    date.setDate(Math.floor(Math.random() * 28) + 1);

    txData.push({
      amount: isIncome
        ? parseFloat((Math.random() * 5000 + 2000).toFixed(2))
        : parseFloat((Math.random() * 500 + 50).toFixed(2)),
      type: isIncome ? 'INCOME' : 'EXPENSE',
      category: isIncome ? 'Salary' : categories[Math.floor(Math.random() * categories.length)],
      date,
      notes: isIncome ? 'Monthly salary' : 'Regular expense',
      userId: users[i % 3],
    });
  }

  await prisma.transaction.createMany({ data: txData });
  console.log('✅ Seed complete!');
  console.log('   admin@zorvyn.com / password123');
  console.log('   analyst@zorvyn.com / password123');
  console.log('   viewer@zorvyn.com / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());