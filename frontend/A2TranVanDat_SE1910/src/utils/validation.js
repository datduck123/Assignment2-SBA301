export const validateLogin = ({ email, password }) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Invalid email address format';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateAccount = (data, isUpdate = false) => {
  const errors = {};
  if (!isUpdate) {
    if (!data.id && data.id !== 0) errors.id = 'Account ID is required';
    if (!data.password) errors.password = 'Password is required';
  }
  if (!data.name || !data.name.trim()) errors.name = 'Name is required';
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Invalid email format';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateCategory = (data) => {
  const errors = {};
  if (!data.name || !data.name.trim()) {
    errors.name = 'Category Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateNews = (data, isUpdate = false) => {
  const errors = {};
  if (!isUpdate && (!data.id || !data.id.trim())) {
    errors.id = 'News Article ID is required';
  }
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters';
  }
  if (!data.categoryId) errors.categoryId = 'Please select a Category';
  if (!data.content || !data.content.trim()) errors.content = 'Content is required';

  return { isValid: Object.keys(errors).length === 0, errors };
};

