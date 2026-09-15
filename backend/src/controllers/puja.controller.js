import Puja from '../models/Puja.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── Public Endpoints ──────────────────────────────────────────

/**
 * @desc    Get all pujas (public catalog)
 * @route   GET /api/v1/pujas?category=&locationType=&search=
 * @access  Public
 */
export const getAllPujas = asyncHandler(async (req, res) => {
  const { category, locationType, search } = req.query;

  const filter = {};

  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }

  if (locationType && ['home', 'temple', 'both'].includes(locationType)) {
    // Show pujas that support this location type OR support 'both'
    filter.$or = [{ locationType }, { locationType: 'both' }];
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const pujas = await Puja.find(filter).sort({ category: 1, name: 1 });

  new ApiResponse(200, 'Pujas retrieved successfully', {
    count: pujas.length,
    pujas,
  }).send(res);
});

/**
 * @desc    Get single puja by ID
 * @route   GET /api/v1/pujas/:id
 * @access  Public
 */
export const getPujaById = asyncHandler(async (req, res) => {
  const puja = await Puja.findById(req.params.id);

  if (!puja) {
    throw new ApiError(404, 'Puja not found');
  }

  new ApiResponse(200, 'Puja retrieved', { puja }).send(res);
});

// ─── Admin CRUD ─────────────────────────────────────────────────

/**
 * @desc    Create a new puja (admin catalog management)
 * @route   POST /api/v1/admin/pujas
 * @access  Private (admin only)
 */
export const createPuja = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    durationMinutes,
    requiredMaterials,
    priceRange,
    locationType,
    category,
  } = req.body;

  const puja = await Puja.create({
    name,
    description,
    durationMinutes,
    requiredMaterials,
    priceRange,
    locationType,
    category,
  });

  new ApiResponse(201, 'Puja created successfully', { puja }).send(res);
});

/**
 * @desc    Update a puja
 * @route   PUT /api/v1/admin/pujas/:id
 * @access  Private (admin only)
 */
export const updatePuja = asyncHandler(async (req, res) => {
  const puja = await Puja.findById(req.params.id);

  if (!puja) {
    throw new ApiError(404, 'Puja not found');
  }

  const allowedFields = [
    'name',
    'description',
    'durationMinutes',
    'requiredMaterials',
    'priceRange',
    'locationType',
    'category',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      puja[field] = req.body[field];
    }
  });

  await puja.save();

  new ApiResponse(200, 'Puja updated successfully', { puja }).send(res);
});

/**
 * @desc    Delete a puja
 * @route   DELETE /api/v1/admin/pujas/:id
 * @access  Private (admin only)
 */
export const deletePuja = asyncHandler(async (req, res) => {
  const puja = await Puja.findById(req.params.id);

  if (!puja) {
    throw new ApiError(404, 'Puja not found');
  }

  await puja.deleteOne();

  new ApiResponse(200, 'Puja deleted successfully', null).send(res);
});
