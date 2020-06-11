function formatDate(date,format) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    let myHours = date.getHours()
    let myMinutes = date.getMinutes()
    let mySeconds = date.getSeconds()

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    if (myHours < 10) {
        myHours = "0" + myHours;
    }
    if (myMinutes < 10) {
        myMinutes = "0" + myMinutes;
    }
    if (mySeconds < 10) {
        mySeconds = "0" + mySeconds;
    }
    let dayNames = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
    let weekday = dayNames[date.getDay()]

    switch(format){
        case 'yyyy-MM-DD' : return (myyear + "-" + mymonth + "-" + myweekday);
        break;
        case 'yyyy-MM-DD HH:mm:ss' : return (myyear + "-" + mymonth + "-" + myweekday + " " + myHours + ":" + myMinutes + ":" + mySeconds);
        break;
        case 'HH:mm:ss' : return (myHours + ":" + myMinutes + ":" + mySeconds);
        break;
        case 'getDay' : return weekday;
        break
    }
}

export { formatDate }