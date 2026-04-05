import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } now available in every route
    next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

export default authenticate;