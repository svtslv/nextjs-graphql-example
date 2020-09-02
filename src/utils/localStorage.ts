export const setItem = (key, value) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
};

export const getItem = (key) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
};

export const removeItem = (key) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
};
