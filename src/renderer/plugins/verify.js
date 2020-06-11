const rule = {
  card:
  {
    reg:'^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$',
    bak:'请填写正确的身份证号'
  },
  digit:{
    reg:'^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9][1-9]*[0-9]*))$',
    bak:'请填正数'
  },
  number:{
    reg:'^[1-9]\d*|0$',
    bak:'请填写正整数'
  },
  mobile:{
    reg:'^1(3|4|5|6|7|8|9)\d{9}$',
    bak:'请填写正确的手机号'
  }
}

const regVerify = (type,value)=>{
  if (!value) {
    throw new Error('不能为空')
  }
  if(!new RegExp(rule[type]).test(value)){
    throw new Error(rule[type].bak)
  }else{
    return;
  }
}
const filter = (type,value)=>{
  switch (type){
    case 'charemach':
      // 过滤特殊字符泊位
      value = value.replace(/[`～*~!@#$%^&*()_\+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘'，。、]/g, '');
      return value;
      break;
    case 'chareBO':
      // 过滤特殊字符泊位
      value = value.replace(/[`～*~!$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g, '');
      return value;
      break;
    case 'chareOperation':
      // 过滤特殊字符操作过程
      value = value.replace(/[`～*~!$%^&*()_\-+=<>?:"{}|,.;'\\[\]·~！@￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g, '');
      return value;
      break;
    case 'char':
      // 过滤特殊字符
      value = value.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g, '');
      return value;
      break;
    case 'spaceChar':
      // 过滤特殊字符 包括空格
      value = value.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、 ]/g, '');
      return value;
      break;
    case 'chineseOnly':
      // 只能中文输入
      value.replace(/[^\u4E00-\u9FA5]/g, '');
      break;
    case 'number':
      // 只能数字输入
      value = value.replace(/[^0-9]/g, '');
      return value;
      break;
    case 'numChinese':
      // 只能输入数字和中文
      value = value.replace(/[^0-9|^\u4E00-\u9FA5]/g, '');
      return value;
      break;
    case 'cardNum':
      // 只能输入身份证数字和xX
      value = value.replace(/[^0-9|x|X]/g, '');
      return value;
      break;
    case 'latin':
      // 只能输入大小写字母下划线
      value = value.replace(/[^a-z|A-Z|0-9|\-|_|\.]/g, '');
      return value;
      break;
    case 'digit':
      // 只能输入正数
      value = value.replace(/[^0-9|^\.]/g, '');
      var tmp = value.split('.');
      var first = tmp[0];
      tmp.shift();
      value = tmp.length > 0 ? first +'.'+ tmp.join(''):first;
      return value;
      break;
    default:
      break;
  }
}
export default {
  regVerify,
  filter
}