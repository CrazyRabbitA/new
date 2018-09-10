export function formatDate(date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = ('0' + month).slice(-2);
  day = ('0' + day).slice(-2);
  return year + '-' + month + '-' + day;
}

export function isSameDay(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}

export function formatDateTime(date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  let dateStr = formatDate(date);
  let timeStr = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  return dateStr + ' ' + timeStr;
}

export function dateSubtract(date, day) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  date.setDate(date.getDate() - day);
  return formatDate(date);
}

export function minusDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() - days);
  var m = d.getMonth() + 1;
  m = ('0' + m).slice(-2);
  return d.getFullYear() + '-' + m + '-' + ('0' + d.getDate()).slice(-2);
}

