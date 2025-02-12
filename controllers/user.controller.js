// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// // Register User
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Get All Users (Admin Only)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import validator from 'validator'; // For email and password validation

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ name, email, password});
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Set cookies
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('userId', user._id.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('role', user.role, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with stored password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Set cookies
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('userId', user._id.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('role', user.role, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Send response
    res.json({
      message: 'User logged in successfully',
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
    res.clearCookie('userId', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
    res.clearCookie('role', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

    // Send response
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'An error occurred during logout' });
  }
};
