import { Request, Response } from 'express';
import { pool } from '../config/db';
import { asyncHandler } from '../middleware/asyncHandler';

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Super Admin)
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a category name');
  }

  // Check if category already exists
  const [existingCategories] = await pool.query(
    'SELECT * FROM Categories WHERE name = ?',
    [name]
  );

  if (Array.isArray(existingCategories) && existingCategories.length > 0) {
    res.status(400);
    throw new Error('Category with this name already exists');
  }

  // Create new category
  const [result] = await pool.query(
    'INSERT INTO Categories (name) VALUES (?)',
    [name]
  );

  if ('insertId' in result) {
    const [newCategory] = await pool.query(
      'SELECT * FROM Categories WHERE category_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: Array.isArray(newCategory) ? newCategory[0] : newCategory
    });
  } else {
    res.status(400);
    throw new Error('Failed to create category');
  }
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const [categories] = await pool.query('SELECT * FROM Categories ORDER BY name');
  
  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private (Super Admin)
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const [categories] = await pool.query(
    'SELECT * FROM Categories WHERE category_id = ?',
    [req.params.id]
  );

  if (!Array.isArray(categories) || categories.length === 0) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json({
    success: true,
    data: categories[0]
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Super Admin)
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a category name');
  }

  // Check if category exists
  const [categories] = await pool.query(
    'SELECT * FROM Categories WHERE category_id = ?',
    [req.params.id]
  );

  if (!Array.isArray(categories) || categories.length === 0) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if new name already exists
  const [existingCategories] = await pool.query(
    'SELECT * FROM Categories WHERE name = ? AND category_id != ?',
    [name, req.params.id]
  );

  if (Array.isArray(existingCategories) && existingCategories.length > 0) {
    res.status(400);
    throw new Error('Category with this name already exists');
  }

  // Update category
  await pool.query(
    'UPDATE Categories SET name = ? WHERE category_id = ?',
    [name, req.params.id]
  );

  const [updatedCategory] = await pool.query(
    'SELECT * FROM Categories WHERE category_id = ?',
    [req.params.id]
  );

  res.status(200).json({
    success: true,
    data: Array.isArray(updatedCategory) ? updatedCategory[0] : updatedCategory
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Super Admin)
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  // Check if category exists
  const [categories] = await pool.query(
    'SELECT * FROM Categories WHERE category_id = ?',
    [req.params.id]
  );

  if (!Array.isArray(categories) || categories.length === 0) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Delete category
  await pool.query('DELETE FROM Categories WHERE category_id = ?', [req.params.id]);

  res.status(200).json({
    success: true,
    data: {}
  });
}); 