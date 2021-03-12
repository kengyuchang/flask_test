/**
 * Calendar
 */
var _date_cal = null;
function showCalendar(elementName) {
    if (_date_cal == null) {
        _date_cal = new Epoch('_date_cal','popup', document.getElementById(elementName));
    }
    var element = elementName;
    if (typeof elementName == "string") {
        element = document.getElementById(elementName);
    }
    _date_cal.setTarget(element);
    _date_cal.show();

}

function setToday(elementId){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    if (month < 10){
        month = "0"+month;
    }
    var day = today.getDate();
    if (day < 10){
        day = "0"+day;
    }
    var formatedDate = year+""+month+""+day;
    document.getElementById(elementId).value = formatedDate;
}

function checkDate(date){
    if(date!=""){
        if(isNaN(date)|| date.length!=8){
            return true;
        }
    }
    return false;
}

function checkHour(hour){
    if(hour!=""){
        if(isNaN(hour) || hour > 23|| hour < 0){
            return true;
        }
    }
    return false;
}

function checkMin(min){
    if(min!=""){
        if(isNaN(min)|| min > 59|| min < 0){
            return true;
        }
    }
    return false;
}

/************* 日期檢查 *************
 1.日期字串格式必須為 yyyymmdd.
 2.必須搭配 isLeap() 來判斷閏年.
*************************************/
function dateValidate(dateStr)
{
    if(dateStr<0 || isNaN(dateStr) || (dateStr.length != 8))
	{
	    alert("日期格式錯誤, 請用yyyymmdd");
		return false;
	}

    var leap = 28;
    if (isLeap(parseInt(dateStr.substring(0,4))))
        leap = 29;
    var mtmp = parseInt(dateStr.substring(4,6))
    if (dateStr.substring(4,6) == '08')
        mtmp = 8;
    if (dateStr.substring(4,6) == '09')
        mtmp = 9;

    if (mtmp < 1 || mtmp > 12)
    {
	    alert("月錯誤");
	    return false;
	}
    var dayInMonth = new Array(12);
    dayInMonth[1] = 31;
    dayInMonth[2] = leap;
    dayInMonth[3] = 31;
    dayInMonth[4] = 30;
    dayInMonth[5] = 31;
    dayInMonth[6] = 30;
    dayInMonth[7] = 31;
    dayInMonth[8] = 31;
    dayInMonth[9] = 30;
    dayInMonth[10] = 31;
    dayInMonth[11] = 30;
    dayInMonth[12] = 31;

    var dtmp = parseInt(dateStr.substring(6));
	if (dateStr.substring(6) == '08')
        dtmp = 8;
    if (dateStr.substring(6) == '09')
        dtmp = 9;
    if(dtmp < 1 || dtmp > dayInMonth[mtmp])
    {
	    alert("日錯誤");
	    return false;
	}
	return true;
}


/************* 閏年判斷 **************/
function isLeap (Year)
{
    if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0))
        return true;
    else
        return false;
}


/************* 字串轉日期 *************
 1.日期字串格式必須為 yyyymmdd.
 2.必須搭配 dateValidate(), isLeap() 來先判斷日期是否正確.
*************************************/
function str2Date(str)
{
    if(dateValidate(str))
	{
	    var yyyy = str.substring(0, 4);
	    var mm = str.substring(4, 6)-1;
	    var dd = str.substring(6, 8);
		return new Date(yyyy, mm, dd);
	}
	else
	{
	    return false;
	}
}


/************* 日期轉字串 *************
 1.傳入的日期格式必須為 Date.
 2.產生的日期字串格式為 yyyymmdd.
*************************************/
function date2Str(date)
{
    var yyyy = date.getFullYear();
	var mm = date.getMonth()+1;
	if (mm < 10)
	    mm = "0"+mm;
	var dd = date.getDate();
	if (dd < 10)
	    dd = "0"+dd;
	return yyyy+""+mm+""+dd;
}


/************* 加減月份 *************
 1.必須搭配 dateValidate(), isLeap(), date2Str 來先判斷日期是否正確.
 2.日期字串格式必須為 yyyymmdd.
 3.產生的日期字串格式為 yyyymmdd.
*************************************/
function addMonth(baseDateStr, addedMonthNum)
{
    if(dateValidate(baseDateStr))
	{
	    var yyyy = baseDateStr.substring(0, 4);
	    var mm = baseDateStr.substring(4, 6)-1-(-addedMonthNum);
	    var dd = baseDateStr.substring(6, 8);
		var addedMonthDate = new Date(yyyy, mm, dd);
		return date2Str(addedMonthDate);
	}
	else
	{
	    return false;
	}
}



/************* 加減天數 *************
 1.必須搭配 dateValidate(), isLeap(), date2Str 來先判斷日期是否正確.
 2.日期字串格式必須為 yyyymmdd.
 3.產生的日期字串格式為 yyyymmdd.
*************************************/
function addDay(baseDateStr, addedDayNum)
{
    if(dateValidate(baseDateStr))
	{
	    var yyyy = baseDateStr.substring(0, 4);
	    var mm = baseDateStr.substring(4, 6)-1;
	    var dd = baseDateStr.substring(6, 8)-(-addedDayNum);
		var addedMonthDate = new Date(yyyy, mm, dd);
		return date2Str(addedMonthDate);
	}
	else
	{
	    return false;
	}
}


/************* 兩個日期的差距(也可當做檢查起迄日期) *************
 1.必須搭配 dateValidate(), isLeap(), str2Date 來先判斷日期是否正確.
 2.日期字串格式必須為 yyyymmdd.
 3.回傳的單位為"天"(dateStr2減dateStr1).
*************************************/
function daysDistance(dateStr1, dateStr2)
{
    if(dateValidate(dateStr1) && dateValidate(dateStr2))
	{
	    var date1 = Date.parse(str2Date(dateStr1));
		var date2 = Date.parse(str2Date(dateStr2));
		return Math.ceil((date2-date1)/(24*60*60*1000));
	}
	else
	{
	    return false;
	}
}


/************* 民國年的日期轉為西元年的日期(yyyymmdd) *************
1.日期字串格式必須為 yymmdd, (yy為民國年)6碼或
					  yyymmdd, (yyy為民國年)7碼

2.回傳的格式為yyyymmdd.
*************************************/
function twDate2Ad(dateStr)
{
    if( dateStr == undefined || dateStr == null || dateStr == '' ) {
			return "";
	}else{
		var yy,mm,dd = null;

		if ( dateStr.length === 6 ) {
			yy = dateStr.substring( 0, 2 ) - ( -1911 );
			mm = dateStr.substring( 2, 4 );
			dd = dateStr.substring( 4 );

		} else {
			yy = dateStr.substring( 0, 3 ) - ( -1911 );
			mm = dateStr.substring( 3, 5 );
			dd = dateStr.substring( 5 );
		}

		return yy + "" + mm + "" + dd;

	}

}


/************* 西元年的日期(yyyymmdd)轉為民國年 *************
 1.日期字串格式必須為 yyyymmdd.
 2.回傳的格式為 yymmdd, (yy為民國年).
*************************************/
function ad2TwDate(dateStr)
{
     if( dateStr == undefined || dateStr == null || dateStr == '' ) {
		return "";

	}else{
		var yyyy = dateStr.substring(0, 4)-1911;
		var mm = dateStr.substring(4, 6);
		var dd = dateStr.substring(6);
		return yyyy+"/"+mm+"/"+dd;

	}

}

/************* 西元年的日期(yyyy-mm-dd)轉為民國年 *************
1.日期字串格式必須為 yyyy-mm-dd.
2.回傳的格式為 yymmdd, (yy為民國年).
*************************************/
function toTwDate(dateStr)
{
	if(dateStr != null){
		var yyyy = dateStr.substring(0, 4)-1911;
		if(yyyy>=0)
			yyyy = pad(yyyy,3);
		else
			yyyy = '-' + pad(yyyy*(-1),3);
		var mm = dateStr.substring(5, 7);
		var dd = dateStr.substring(8, 10);
		return yyyy+"/"+mm+"/"+dd;
	}
	else
		return "";
}


/************* 西元年的日期(yyyy-mm-dd hh:mm:ss)轉為民國年 *************
1.日期字串格式必須為 yyyy-mm-dd hh:mm:ss.
2.回傳的格式為 yymmdd hh:mm:ss, (yy為民國年).
*************************************/
function toTwDateTime(dateStr)
{
	if(dateStr != null)
		return toTwDate(dateStr.substring(0, 10)) + " " + dateStr.substring(11, dateStr.length);
	else
		return "";
}

/************* json grid column date format *************
*************************************/
function dateFormatter( value, opts, rowObject ){
    if( value == undefined || value == null || value == '' )
        return '&nbsp;';
    else if( value.length == 9 )
		return value;
    else
    	return toTwDate( value );

}

function datetimeFormatter(value, opts, rowObject) {
	var reg1 = /^(0|1)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01]) ([0-5][0-9]):([0-5][0-9])$/;
	var reg2 = /^(0|1)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01]) ([0-5][0-9]):([0-5][0-9]):([0-5][0-9])$/;
    if (value == undefined ||value == null || value == '') {
        return '&nbsp;';
    }
    else if( reg1.test( value )|| reg2.test( value ))
		return value;
    else {
    	var rocDateTimeStr = toTwDateTime(value);

		if( parseInt( rocDateTimeStr.replace( /\//g, '') ) < 0 ) {
			if (opts &&
					opts.colModel.formatoptions  &&
					opts.colModel.formatoptions.isShowWhenYearLessThenZero == false ) {
				return '';
			}
		}

		return rocDateTimeStr;
    }
}

function yearFormatter(value, opts, rowObject){
	if (value == undefined ||value == null || value == '') {
		return '&nbsp;';
    }
    else {
		if(value.length == 4){
			return parseInt(value) - 1911;
		}
		else{
			return value;
		}

    }
}

function datetimeNSFormatter( value, opts, rowObject ) {
	if( value == undefined || value == null || value == '' )
        return '&nbsp;';
    else if( value.length == 15 )
		return value;
    else
    	return toTwDateTime( value.substring( 0, 16 ) );
}

function all9DateFormatter(value, opts, rowObject){

	var twDate = toTwDate(value);
	if( value == undefined || value == null || value == '' )
        return '&nbsp;';
    else if(twDate == "8088/12/31"){
		return "999/99/99";
	}
    else if( value.length == 9 )
		return value;
    else
    	return twDate;
}

/************* 日期區間檢查 *************
檢查兩個日期是否為有效區間
*************************************/
function isValidDateRange(date1, date2) {
	if (parseInt(date2.substring(0,4)) < parseInt(date1.substring(0,4))){
		//alert(parseInt(date2.substring(0,4))+'<'+parseInt(date1.substring(0,4)));
		return false;
	}
	else if (parseInt(date2.substring(4,6)) < parseInt(date1.substring(4,6))) {
		//alert(parseInt(date2.substring(4,6))+'<'+parseInt(date1.substring(4,6)));
		return false;
	}
	else if (parseInt(date2.substring(6,8)) < parseInt(date1.substring(6,8))) {
		//alert(parseInt(date2.substring(6,8))+'<'+parseInt(date1.substring(6,8)));
		return false;
	}
	return true;
}

/**
 * 再處理一次~民國年轉西元年~
 * @param rocDateString
 * @return
 */
function appendGridDateFormatter(rocDateString, param){
	//alert('rocDateString='+rocDateString);
	var year;
	var month;
	var day;
	if(rocDateString!=null && rocDateString.length>=8 && rocDateString.indexOf('undefined')<0){
		var yEndPoint = rocDateString.indexOf('-')>0?rocDateString.indexOf('-'):rocDateString.indexOf('/');
		var mEndPoint = rocDateString.indexOf('-', yEndPoint+1)>0?rocDateString.indexOf('-', yEndPoint+1):rocDateString.indexOf('/', yEndPoint+1);
		var dEndPoint = rocDateString.indexOf('T')>0?rocDateString.indexOf('T'):rocDateString.length;
		//alert('yEndPoint='+yEndPoint+'mEndPoint='+mEndPoint+'dEndPoint='+dEndPoint);

		year = Number(rocDateString.toString().substring(0, yEndPoint));
		if(typeof param != 'undefined'){
			year = Number(year)+Number(param);
		}else{
			//alert(param == "undefined!");
		}
		month = rocDateString.toString().substring(yEndPoint,mEndPoint);
		day = rocDateString.toString().substring(mEndPoint,dEndPoint);
		//alert('year='+year+', month='+month+', day='+day);
	}else{
		year = "";
		month = "";
		day = "";
	}
	//alert('year+month+day='+year+month+day);
	return year+month+day;
}

function toAdDate(value)
{
	var reg1 = /^(0|1)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
	if (value == undefined ||value == null || value == '') {
        return '';
    }
    else if( reg1.test( value ))
		return value;
    else
    	return value.substring(0, 10).replace(/\-/g,"/");
}

function adDateFormatter(value, opts, rowObject) {
	var reg1 = /^(0|1)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
	if (value == undefined ||value == null || value == '') {
        return '&nbsp;';
    }
    else if( reg1.test( value ))
		return value;
    else {
    	return toAdDate(value);
    }
}

function adDatetimeNSFormatter(value, opts, rowObject) {
	var reg1 = /^(0|1)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01]) ([0-5][0-9]):([0-5][0-9])$/;
	var reg2 = /^(0|1)\d\d\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01]) ([0-5][0-9]):([0-5][0-9]):([0-5][0-9])$/;
    if (value == undefined ||value == null || value == '') {
        return '&nbsp;';
    }
    else if( reg1.test( value )|| reg2.test( value ))
		return value;
    else {
    	return toAdDate(value) + " " + value.substring(11, 16);
    }
}