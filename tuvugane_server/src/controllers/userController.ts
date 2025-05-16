import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/db';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone } = req.body;

  try {
    // Check if user exists
    const existingUsers = await query('SELECT * FROM Users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await query(
      'INSERT INTO Users (name, email, password, phone, is_anonymous) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, 0]
    );

    if (result.insertId) {
      const [user] = await query('SELECT * FROM Users WHERE user_id = ?', [result.insertId]);
      
      res.status(201).json({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user.user_id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const users = await query('SELECT * FROM Users WHERE email = ?', [email]);

    if (users.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const user = users[0];

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user.user_id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
}; 