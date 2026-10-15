export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

export const isStrongPassword = (v) =>
  typeof v === 'string' &&
  v.length >= 8 &&
  /[A-Za-z]/.test(v) &&
  /[0-9]/.test(v);

export function validateLogin(values) {
  const errors = {};
  if (!values.email) errors.email = 'Email is required';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email';
  if (!values.password) errors.password = 'Password is required';
  return errors;
}

export function validateRegister(values, role) {
  const errors = {};
  if (!values.firstName?.trim()) errors.firstName = 'First name is required';
  if (!values.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email';
  if (!values.password) errors.password = 'Password is required';
  else if (!isStrongPassword(values.password))
    errors.password = 'Min 8 chars with at least one letter and one number';
  if (values.password !== values.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  if (role === 'client' && !values.companyName?.trim())
    errors.companyName = 'Company or store name is required';
  if (role === 'va') {
    if (!values.headline?.trim()) errors.headline = 'Headline is required';
    if (!values.country?.trim()) errors.country = 'Country is required';
  }
  if (!values.acceptTerms) errors.acceptTerms = 'You must accept the terms';
  return errors;
}

export function validateRequirement(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Title is required';
  if (!values.platform) errors.platform = 'Platform is required';
  if (!values.description?.trim()) errors.description = 'Description is required';
  if (!Array.isArray(values.requiredSkills) || values.requiredSkills.length === 0)
    errors.requiredSkills = 'Select at least one skill';
  const min = Number(values.budgetMin);
  const max = Number(values.budgetMax);
  if (values.budgetMin !== '' && Number.isNaN(min)) errors.budgetMin = 'Invalid number';
  if (values.budgetMax !== '' && Number.isNaN(max)) errors.budgetMax = 'Invalid number';
  if (!Number.isNaN(min) && !Number.isNaN(max) && min > max)
    errors.budgetMax = 'Max must be ≥ min';
  return errors;
}

export function validateTrialTask(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Title is required';
  if (!values.brief?.trim()) errors.brief = 'Brief is required';
  if (!values.vaId) errors.vaId = 'Select a VA';
  const deadline = values.deadline ? new Date(values.deadline) : null;
  if (!deadline || Number.isNaN(deadline.getTime())) errors.deadline = 'Deadline is required';
  return errors;
}

export function validateTask(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Title is required';
  if (!values.description?.trim()) errors.description = 'Description is required';
  if (!values.deadline) errors.deadline = 'Deadline is required';
  return errors;
}

export function validateReview(values) {
  const errors = {};
  const rating = Number(values.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5)
    errors.rating = 'Rating must be between 1 and 5';
  if (!values.comment?.trim()) errors.comment = 'Comment is required';
  return errors;
}

export function validateProfile(values) {
  const errors = {};
  if (!values.firstName?.trim()) errors.firstName = 'First name is required';
  if (!values.lastName?.trim()) errors.lastName = 'Last name is required';
  return errors;
}