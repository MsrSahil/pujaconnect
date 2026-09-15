import { body } from 'express-validator';

export const createBookingValidator = [
  body('panditId')
    .notEmpty()
    .withMessage('Pandit ID is required')
    .isMongoId()
    .withMessage('Invalid Pandit ID'),

  body('pujaId')
    .notEmpty()
    .withMessage('Puja ID is required')
    .isMongoId()
    .withMessage('Invalid Puja ID'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required'),

  body('timeSlot.startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in HH:MM format'),

  body('timeSlot.endTime')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in HH:MM format'),

  body('locationType')
    .notEmpty()
    .withMessage('Location type is required')
    .isIn(['home', 'temple'])
    .withMessage('Location type must be either home or temple'),

  body('address')
    .if(body('locationType').equals('home'))
    .notEmpty()
    .withMessage('Address is required for home-based pujas')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),
];
