export const generateOtp = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

export const otpExpiry = (minutes = 1) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
