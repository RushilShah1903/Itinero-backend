import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  const token = authorizationHeader ? authorizationHeader.split(' ')[1] : req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Get the userId from the cookie
    const userIdFromCookie = req.cookies.userId;

    // Ensure both userId's are compared as strings
    if (decoded.userId.toString() !== userIdFromCookie) {
      return res.status(401).json({ message: 'User ID in token does not match the user ID in the cookie' });
    }

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if the user is an Admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Error in admin authentication:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};