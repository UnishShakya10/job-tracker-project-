import { body } from 'express-validator';

const JOB_TYPES = ['Internship', 'Full-time', 'Part-time'] as const;
const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

export const createValidators = [
  body('company_name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters'),
  body('job_title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required'),
  body('job_type')
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(', ')}`),
  body('status')
    .isIn(STATUSES)
    .withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('applied_date')
    .isDate()
    .withMessage('Applied date must be a valid date (YYYY-MM-DD)'),
  body('notes')
    .optional({ nullable: true })
    .isString()
    .withMessage('Notes must be a string'),
];

export const updateValidators = [
  body('company_name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters'),
  body('job_title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job title cannot be empty'),
  body('job_type')
    .optional()
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(', ')}`),
  body('status')
    .optional()
    .isIn(STATUSES)
    .withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('applied_date')
    .optional()
    .isDate()
    .withMessage('Applied date must be a valid date (YYYY-MM-DD)'),
  body('notes')
    .optional({ nullable: true })
    .isString()
    .withMessage('Notes must be a string'),
];
