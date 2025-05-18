import jwt from 'jsonwebtoken';

const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

export default generateToken; 