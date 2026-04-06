import * as service from './dashboard.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const getSummary = async (req, res, next) => {
  try {
    const data = await service.getSummary(req.user.id, req.user.role);
    res.json(new ApiResponse(200, data));
  } catch (err) { next(err); }
};

export const getByCategory = async (req, res, next) => {
  try {
    const data = await service.getByCategory(req.user.id, req.user.role);
    res.json(new ApiResponse(200, data));
  } catch (err) { next(err); }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await service.getMonthlyTrends(req.user.id, req.user.role);
    res.json(new ApiResponse(200, data));
  } catch (err) { next(err); }
};

export const getRecent = async (req, res, next) => {
  try {
    const data = await service.getRecent(req.user.id, req.user.role);
    res.json(new ApiResponse(200, data));
  } catch (err) { next(err); }
};

export const getInsights = async (req, res, next) => {
  try {
    const data = await service.getInsights(req.user.id, req.user.role);
    res.json(new ApiResponse(200, data));
  } catch (err) { next(err); }
};