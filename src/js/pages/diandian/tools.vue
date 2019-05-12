<script>

const timeFormat = function (tamp) {
  var time = new Date(tamp * 1000);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '年' + add0(m) + '月' + add0(d) + '日 ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

const add0 = function (m) {
  return m<10?'0'+m:m;
}

const zc_0 = function() {
  var result = Vue.prototype.$storage.getSync('account')
  return (parseInt(result.phone) * 12345).toString()
}

// 只保留2位小数，如：2，会在2后面补上00.即2.00 
function toDecimal2(x) { 
  var f = parseFloat(x); 
  if (isNaN(f)) { 
    return false; 
  } 
  var f = Math.round(x*100)/100; 
  var s = f.toString(); 
  var rs = s.indexOf('.'); 
  if (rs < 0) { 
    rs = s.length; 
    s += '.'; 
  } 
  while (s.length <= rs + 2) { 
    s += '0'; 
  } 
  return s; 
} 

export default {
  timeFormat,
  zc_0,
  toDecimal2
}

</script>