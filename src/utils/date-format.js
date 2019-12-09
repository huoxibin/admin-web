const format = date => {
  // 年
  const year = date.getFullYear();
  // 月
  const month = date.getMonth() + 1;
  // 日
  const day = date.getDate();
  // 时
  const hour = date.getHours();
  // 分
  const minute = date.getMinutes();
  // 秒
  const second = date.getSeconds();

  const fn = time => {
    if (time >= 1 && time <= 9) {
      return `0${time}`;
    } else {
      return time;
    }
  };
  const currentdate = `${fn(year)}-${fn(month)}-${fn(day)} ${fn(hour)}:${fn(minute)}:${fn(second)}`;
  return currentdate;
};

export default format;
