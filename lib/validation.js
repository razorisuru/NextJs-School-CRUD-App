// Validation utilities for student data

export function validateStudentData(data) {
  const errors = {}
  
  // Student ID validation
  if (!data.studentId || data.studentId.trim() === '') {
    errors.studentId = 'Student ID is required'
  } else if (data.studentId.length < 3) {
    errors.studentId = 'Student ID must be at least 3 characters'
  } else if (data.studentId.length > 20) {
    errors.studentId = 'Student ID must be less than 20 characters'
  } else if (!/^[A-Za-z0-9-_]+$/.test(data.studentId)) {
    errors.studentId = 'Student ID can only contain letters, numbers, hyphens, and underscores'
  }

  // Name validation
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Full name is required'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters'
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.name.trim())) {
    errors.name = 'Name can only contain letters, spaces, apostrophes, and hyphens'
  }

  // Email validation
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email address is required'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address'
    } else if (data.email.trim().length > 255) {
      errors.email = 'Email address is too long'
    }
  }

  // Phone validation
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = 'Phone number is required'
  } else {
    const cleanPhone = data.phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits'
    } else if (cleanPhone.length > 15) {
      errors.phone = 'Phone number must be less than 15 digits'
    } else if (!/^[\d\s\-\(\)\+]+$/.test(data.phone.trim())) {
      errors.phone = 'Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function sanitizeStudentData(data) {
  return {
    studentId: data.studentId?.trim() || '',
    name: data.name?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    phone: data.phone?.trim() || ''
  }
}