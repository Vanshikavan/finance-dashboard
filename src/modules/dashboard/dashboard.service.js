import prisma from '../../config/db.js';

const buildWhere = (userId, role) => {
  const where = { deletedAt: null };
  if (role !== 'ADMIN') where.userId = userId;
  return where;
};

export const getSummary = async (userId, role) => {
  const where = buildWhere(userId, role);

  const [income, expense, total] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpenses = expense._sum.amount || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalTransactions: total,
    incomeCount: income._count,
    expenseCount: expense._count,
  };
};

export const getByCategory = async (userId, role) => {
  const where = { ...buildWhere(userId, role), type: 'EXPENSE' };

  const result = await prisma.transaction.groupBy({
    by: ['category'],
    where,
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
  });

  return result.map((r) => ({
    category: r.category,
    total: r._sum.amount || 0,
  }));
};

export const getMonthlyTrends = async (userId, role) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const where = {
    ...buildWhere(userId, role),
    date: { gte: sixMonthsAgo },
  };

  const transactions = await prisma.transaction.findMany({
    where,
    select: { amount: true, type: true, date: true },
  });

  // Group by month in JS — more readable than complex SQL
  const monthly = {};
  for (const tx of transactions) {
    const key = tx.date.toISOString().slice(0, 7); // "2025-03"
    if (!monthly[key]) monthly[key] = { month: key, income: 0, expenses: 0 };
    if (tx.type === 'INCOME') monthly[key].income += tx.amount;
    else monthly[key].expenses += tx.amount;
  }

  return Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));
};

export const getRecent = async (userId, role) => {
  const where = buildWhere(userId, role);

  return prisma.transaction.findMany({
    where,
    take: 10,
    orderBy: { date: 'desc' },
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
    },
  });
};

export const getInsights = async (userId, role) => {
  const where = buildWhere(userId, role);

  const [byCategory, summary] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['category'],
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    }),
    prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _avg: { amount: true },
    }),
  ]);

  return {
    highestSpendingCategory: byCategory[0]
      ? { category: byCategory[0].category, amount: byCategory[0]._sum.amount }
      : null,
    averageTransactionAmount: summary._avg.amount || 0,
  };
};