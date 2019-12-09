// 正则验证表

// 电话验证
const isValidPhone = str => {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
  return reg.test(str);
};

// 邮箱验证
const isValidEmali = str => {
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  return reg.test(str);
};
// 正整数验证
const isValidNumber = str => {
  const reg = /^\+?[0-9][0-9]*$/;
  return reg.test(str);
};
// 五位正整数验证
const isValidFiveNumber = str => {
  const reg = /^[1-9]\d{0,4}$/;
  return reg.test(str);
};
// 五位正整数验证 + 0
const isValidFiveNumberZero = str => {
  const reg = /^[0-9]\d{0,4}$/;
  return reg.test(str);
};
// 六位正整数验证
const isValidSexNumber = str => {
  const reg = /^[1-9]\d{0,5}$/;
  return reg.test(str);
};
// 六位正整数验证加0
const isValidSexNumberZero = str => {
  const reg = /^[0-9]\d{0,5}$/;
  return reg.test(str);
};
// 价格验证
const isValidPrice = str => {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  return reg.test(str);
};
// 1-99正整数正则
const isValidFrequency = str => {
  const reg = /^[1-9][0-9]{0,1}$/;
  return reg.test(str);
};
// 1-31正整数正则
const isValidMonth = str => {
  const reg = /^(([1-2][0-9]{0,1})|30|31)$/;
  return reg.test(str);
};
// 0-99正整数正则
const isValidScore = str => {
  const reg = /^([1-9]\d|\d)$/;
  return reg.test(str);
};
// 0和正整数正则
const isValidNumScore = str => {
  const reg = /^((0{1}\.\d+)|([1-9]\d*\.{1}\d+)|([1-9]+\d*)|0)$/;
  return reg.test(str);
};
//验证身份证号码
const isValidCardNumber = str => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(str);
};
// 0.01 - 9999.99
const isValidMoney = str => /^(?!0{1,4})(\d{1,4}|10{4}|0)$/.test(str);

// 中文
const isText = str => /^[\u4e00-\u9fa5]+$/.test(str);

export {
  isValidPhone,
  isValidEmali,
  isValidNumber,
  isValidFiveNumber,
  isValidFiveNumberZero,
  isValidSexNumber,
  isValidSexNumberZero,
  isValidPrice,
  isValidFrequency,
  isValidMonth,
  isValidScore,
  isValidNumScore,
  isValidCardNumber,
  isValidMoney,
  isText
};
