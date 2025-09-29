export const formatSupabaseError = (error) => {
  if (!error) return null;
  
  // Supabase помилки часто мають message в error
  if (error.message) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    };
  }
  
  // Мережеві помилки
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return {
      message: 'Проблема з підключенням до сервера',
      code: 'NETWORK_ERROR'
    };
  }
  
  return {
    message: 'Сталася невідома помилка',
    code: 'UNKNOWN_ERROR'
  };
};

export const getErrorMessage = (error) => {
  if (!error) return '';
  
  // Специфічні повідомлення для різних кодів помилок
  const errorMessages = {
    '23505': 'Цей запис вже існує',
    '42501': 'У вас немає прав для цієї операції',
    '42P01': 'Помилка бази даних',
    'NETWORK_ERROR': 'Перевірте підключення до інтернету',
    'UNKNOWN_ERROR': 'Щось пішло не так'
  };
  
  return errorMessages[error.code] || error.message || 'Сталася помилка';
};