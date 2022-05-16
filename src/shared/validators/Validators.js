export const emailValidator = (email) => {
  // const re = /\S+@\S+\.\S+/;
  let re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; /* eslint-disable-line */

  if (!email || email.length <= 0) return 'Field cannot be empty.';
  if (!re.test(email)) return 'Oops! We need a valid email address.';

  return '';
};

export const TextValidator = (name) => {
  if (!name || name.length <= 0) return 'Field cannot be empty.';
  if (name.length < 3) return ' cannot be less the 3 characters.';

  return '';
};

export const NumberValidator = (CNIC) => {
  if (!CNIC || CNIC.length <= 0) return 'Field cannot be empty.';
  if (isNaN(CNIC)) return 'Should be in number format';
  if (CNIC < 1 || CNIC > 1000) return 'Please enter the number between 1-1000.';
  return '';
};

export const passwordValidator = (password) => {
  const letters = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!password || password.length <= 0) return 'Field cannot be empty.';
  if (password.length > 30 || password.length < 6)
    return 'Password limit is between 6-30 characters.';
  if (!letters.test(password)) return 'Password must contain a special characters and a number';
  return '';
};

export const confirmPasswordValidator = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.length <= 0) return 'Field cannot be empty.';
  if (confirmPassword.length > 30) return 'Password limit is 30 characters.';
  if (password !== confirmPassword) return "Passwords don't match";
  return '';
};
