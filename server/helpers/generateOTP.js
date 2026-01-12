module.exports.generateOTP = () => {
  const part = Math.floor(100 + Math.random() * 900); // 3 digits
  return `${part}${part}`;
};
