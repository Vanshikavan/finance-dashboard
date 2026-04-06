import * as service from './transaction.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const create = async (req, res, next) => {
  try {
    const tx = await service.create(req.body, req.user.id);
    res.status(201).json(new ApiResponse(201, tx, 'Transaction created'));
  } catch (err) { next(err); }
};

export const getAll = async (req, res, next) => {
  try {
    const result = await service.getAll(req.query, req.user.id, req.user.role);
    res.json(new ApiResponse(200, result));
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const tx = await service.update(req.params.id, req.body);
    res.json(new ApiResponse(200, tx, 'Transaction updated'));
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json(new ApiResponse(200, null, 'Transaction deleted'));
  } catch (err) { next(err); }
};