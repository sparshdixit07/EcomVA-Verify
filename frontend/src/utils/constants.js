export const USER_ROLES = {
  CLIENT: 'client',
  VA: 'va',
  ADMIN: 'admin'
};

export const ACCOUNT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated'
};

export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

export const REQUIREMENT_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
  CANCELLED: 'cancelled'
};

export const TRIAL_TASK_STATUS = {
  DRAFT: 'draft',
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  PASSED: 'passed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

export const HIRING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ENGAGEMENT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REVISION: 'revision',
  CANCELLED: 'cancelled'
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const ASSESSMENT_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const NOTIFICATION_TYPES = {
  HIRING_REQUEST: 'hiring_request',
  HIRING_STATUS: 'hiring_status',
  TRIAL_TASK: 'trial_task',
  TRIAL_SUBMISSION: 'trial_submission',
  TASK_ASSIGNED: 'task_assigned',
  TASK_SUBMITTED: 'task_submitted',
  TASK_APPROVED: 'task_approved',
  TASK_REVISION: 'task_revision',
  REVIEW: 'review',
  VERIFICATION: 'verification',
  MESSAGE: 'message',
  SYSTEM: 'system'
};

export const ECOM_PLATFORMS = [
  { value: 'amazon', label: 'Amazon' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'both', label: 'Both Amazon & Shopify' }
];

export const SKILL_CATEGORIES = [
  { value: 'listing', label: 'Product Listing' },
  { value: 'store_management', label: 'Store Management' },
  { value: 'customer_support', label: 'Customer Support' },
  { value: 'inventory', label: 'Inventory Management' },
  { value: 'order_returns', label: 'Order & Return Handling' },
  { value: 'ppc', label: 'PPC / Ads' },
  { value: 'creative', label: 'Creative / Design' }
];

export const ENGLISH_LEVELS = [
  { value: 'basic', label: 'Basic' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'professional', label: 'Professional' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'native', label: 'Native' }
];

export const TIMEZONES = [
  'Asia/Manila',
  'Asia/Jakarta',
  'Asia/Bangkok',
  'Asia/Ho_Chi_Minh',
  'Asia/Kuala_Lumpur',
  'Asia/Singapore',
  'Asia/Yangon',
  'Asia/Phnom_Penh',
  'Asia/Vientiane',
  'Asia/Kathmandu'
];

export const PAGE_SIZE = 12;