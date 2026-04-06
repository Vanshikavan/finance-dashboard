import * as userService from './user.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(new ApiResponse(200, users));
  } catch (err) { next(err); }
};

export const updateRole = async (req, res, next) => {
  try {
    const user = await userService.updateRole(req.params.id, req.body.role);
    res.json(new ApiResponse(200, user, 'Role updated'));
  } catch (err) { next(err); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const user = await userService.updateStatus(req.params.id, req.body.status);
    res.json(new ApiResponse(200, user, 'Status updated'));
  } catch (err) { next(err); }
};