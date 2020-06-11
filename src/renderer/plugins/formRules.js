
  export default{
    numberRule
  }
  const numberRule = (rule, value, callback) => {
    if (!value) {
      callback(new Error('不能为空'))
    }
    value = Number(value)
    let reg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9][1-9]*[0-9]*))$");
    if (typeof value === 'number' && !isNaN(value)) {
      if (!reg.test(value)) {
        callback(new Error('必须是正浮点数'))
      } else {
        callback()
      }
    } else {
      callback(new Error('必须为数字'))
    }
  }