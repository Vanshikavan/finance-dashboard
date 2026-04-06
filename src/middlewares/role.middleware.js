import { ApiError } from '../utils/ApiError.js';

// authorize('ADMIN') or authorize('ADMIN', 'ANALYST')
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Not authenticated'));

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Requires: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
};

export default authorize;