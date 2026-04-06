import prisma from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';

export const create = async (data, userId) => {
  return prisma.transaction.create({
    data: { ...data, userId, date: new Date(data.date) },
  });
};

export const getAll = async (filters, userId, role) => {
  const where = { deletedAt: null };

  // Admins see everyone's; others see only their own
  if (role !== 'ADMIN') where.userId = userId;

  if (filters.type) where.type = filters.type;
  if (filters.category) {
    where.category = { contains: filters.category, mode: 'insensitive' };
  }
  if (filters.from || filters.to) {
    where.date = {};
    if (filters.from) where.date.gte = new Date(filters.from);
    if (filters.to) where.date.lte = new Date(filters.to);
  }

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.transaction.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const update = async (id, updateData) => {
  const tx = await prisma.transaction.findFirst({ where: { id, deletedAt: null } });
  if (!tx) throw new ApiError(404, 'Transaction not found');

  return prisma.transaction.update({
    where: { id },
    data: {
      ...updateData,
      ...(updateData.date && { date: new Date(updateData.date) }),
    },
  });
};

export const remove = async (id) => {
  const tx = await prisma.transaction.findFirst({ where: { id, deletedAt: null } });
  if (!tx) throw new ApiError(404, 'Transaction not found');

  // Soft delete — we never truly delete financial records
  return prisma.transaction.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};