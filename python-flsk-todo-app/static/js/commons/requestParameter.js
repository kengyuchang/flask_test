				
var debug = false;

var requestHeader = [];				

function setRequestHeader(beanName, rowData){
	
	if(debug)alert('requestHeader.length='+requestHeader.length);
	
	requestHeader = [];
	
	if(rowData != null){
		
		$.each(rowData, function(index, values){
			
			var javaWords = beanName + "." +toJavaWord( index );
			
			if(typeof(values)=='undefined'||typeof(values)=='object'){			
			}else{
//			alert(javaWords.indexOf("Date"));
				if((javaWords.indexOf("dateTime")<0 && javaWords.indexOf("date")>=0)
						||(javaWords.indexOf("DateTime")<0 && javaWords.indexOf("Date")>=0)
				){
					requestHeader.push({name: javaWords+"Time",value: toRocDate(values)});
				//financialCenter1stdateTime
				}else if(javaWords.indexOf("financialCenter1stdateTime")>=0){
					requestHeader.push({name: "exzhawdBean.financialCenter1stdate",value: toRocDate(values)});
				}else if(javaWords.indexOf("financialCenter2nddateTime")>=0){
					requestHeader.push({name: "exzhawdBean.financialCenter2nddate",value: toRocDate(values)});
				}else{				
					requestHeader.push({name: javaWords,value: values});		
				}
			}
			
		});
	}
	
//	var outObj = $.param(requestHeader);
	
	if(debug)alert('setRequestHeader|beanName='+beanName
			
			+',requestHeader='+requestHeader);
	
	return requestHeader;
	
}

function setRequestHeaderWithoutToJavaWord(beanName, rowData){
	
	if(debug)alert('requestHeader.length='+requestHeader.length);
	
	requestHeader = [];
	
	$.each(rowData, function(index, values){
		
		var javaWords = beanName + "." + index ;
		
		if((javaWords.indexOf("dateTime")<0 && javaWords.indexOf("date")>=0)
				||(javaWords.indexOf("DateTime")<0 && javaWords.indexOf("Date")>=0)
				){
			requestHeader.push({name: javaWords+"Time",value: toRocDate(values)});
		}else if(javaWords.indexOf("financialCenter1stdateTime")>=0){
			requestHeader.push({name: "exzhawdBean.financialCenter1stdate",value: toRocDate(values)});
		}else if(javaWords.indexOf("financialCenter2nddateTime")>=0){
			requestHeader.push({name: "exzhawdBean.financialCenter2nddate",value: toRocDate(values)});
		}else{				
			requestHeader.push({name: javaWords,value: values});		
		}
		
	});
	
//	var outObj = $.param(requestHeader);
	
	if(debug)alert('setRequestHeader|beanName='+beanName
			
			+',requestHeader='+requestHeader);
	
	return requestHeader;
	
}

function getRequestHeader(){
	
	if(debug)alert('getRequestHeader|requestHeader='+requestHeader);
	
	return requestHeader;
	
}

function toJavaWord(underLineWord){
	
	var javaWord = "";
	
	var wordArray = underLineWord.toLowerCase().split('_');
	
	$.each(wordArray, function(index, value){
		if(index==0){
			javaWord += value;
		}else{
			javaWord += value.toString().substring(0, 1).toUpperCase()+value.toString().substring(1);
		}
		
	});
	
	if(debug)alert(underLineWord+'--change->'+javaWord+',');
	
	return javaWord;
}

/**
 * 把rowData裡面的Key轉成javaWord
 * @param rowData
 * @returns {Array}
 */
function toJavaWordKey(rowData){
	
	var param = {};
	
	$.each(rowData, function(index, value){
		var keyString = toJavaWord(index);
		var valueString = value;
		param[keyString] = valueString;
	});
	
	return param;
}

/**
 * 把DataObject的資料，用Keys, Values包起來進行array的設定。
 * @param dataObject
 * @returns {Array}
 */
function getKeyValueJsonFromDataObject(dataObject){
	var param = {};
	
	if(typeof dataObject == 'undefined' || typeof dataObject.keys == 'undefined' || dataObject.keys.length == 0){
		//do nothing
	}else{
		var len = dataObject.keys.length;
		for(var idx = 0; idx < len; idx++){
			var keys = dataObject.keys[idx];
			var values = dataObject.values[idx];
//			alert(keys +":"+ values);
			param[keys]=values;
		}
	}
	
	return param;
}

function toUnderLineRowData(rowData){
	
	var rowValue = [];
	
	var length = rowData.keys.length;
	
	for(var index = 0; index<length; index++){
		rowValue.push(rowData.keys[index], rowData.values[index]);
	}
	
	if(debug)alert('toUnderLineRowData|rowValue='+$.makeArray ( rowValue )   );
	
	return $.makeArray ( rowValue );
}

function toUnderLineWord(javaWord){
	
	var underLineWord = "";
	
	javaWord= trimWord(javaWord);
	
	var javaWordArray = javaWord.split('');
	
	$.each(javaWordArray, function(index, value){
		if(value.charCodeAt()>=65 && value.charCodeAt()<=95){
			underLineWord+='_'+value;
		}else{
			underLineWord+=value;
		}
	});
	
	return underLineWord.toUpperCase();
}

/**
 * 重複性的過慮文字
 * @param str
 * @returns str.slice(start, end + 1);
 */
function trimWord(str){
	var start = -1,
	end = str.length;
	while (str.charCodeAt(--end) < 33);
	while (str.charCodeAt(++start) < 33);
	return str.slice(start, end + 1);
}
	
/**
 * 安全的加入name and Value 到 param當中。
 * @param param
 * @param name
 * @param value
 */
function addParamSafty(param, key, value){
	var index = 0;
	if (typeof param !='undefined') {
		//page added for formData
		for (index = 0; index < param.length; ++index) {
		    if (param[index].name == key) {
		    	param[index].value = value;
		        break;
		    }
		}
		// Add it if it wasn't there
		if (index >= param.length) {
			param.push({	name: key, value: value	});
		}
	}
	return param;
}
	
/**
 * 把西元年轉換成民國年
 * @param adDate
 * @returns
 */
function toRocDate(adDate){
	if(!isUndefinedOrNull(adDate) && typeof adDate != 'boolean'){
		console.log('requestParameter.toRocDate|adDate is not undefined or null. adDate='+adDate +', typeof adDate='+typeof adDate);

		var index = Math.max(adDate.indexOf("/"), adDate.indexOf("-"));
//		alert(index);
		if(index>=4){
			var year = adDate.substring(0, index);
			var dateString = adDate.substring(index);
			year -= 1911;
			adDate = year+dateString;
//		alert(adDate.length);
			if(adDate.length>16){
				adData = adDate.substring(0, 15);
			}
			if(adDate.length<10){
				adDate = adDate+" 00:00";
			}
		}
		if(index==3){
			if(adDate.length<10){
				adDate += " 00:00";
			}
			if(adDate.length>16){
				adDate = adDate.substring(0, 15);
			}
		}
//		alert(adDate);
	}else{
		console.log('requestParameter.toRocDate|adDate is undefined or null. adDate='+adDate +', typeof adDate='+typeof adDate);
	}
	return adDate;
}

/**
 * 把rowData裡面有關於Date的資料統一轉成RocDateTime。
 * 然後回傳rowData出去
 * @param rowData
 */
function toRocDateRow(rowData){
	var msg = '';
	$.each(rowData, function(index, value){
		msg += ',index='+index+',value='+value;
		if(		(index.indexOf('date')>=0 && index.indexOf('dateTime')<0)
			||	(index.indexOf('Date')>=0 && index.indexOf('DateTime')<0)
			||	(index.indexOf('financialCenter1stdatetime')>=0)
			||	(index.indexOf('financialCenter2nddatetime')>=0)
				){			
			index = index+'Time';
			value = toRocDateTTT(value);
		}
	});
	console.log(msg);
	return rowData;
}

/**
 * filterCommonArray 說明：把String用逗號格開，並且取得逗號格開後的字串。 <br>
 * @param arrayString
 * @return <br>
 * @author game<br>
*/
function filterCommonArray(arrayString, index, defaultValue){
	var ans = defaultValue;
	if(arrayString==null || arrayString==""){
	}else{
		var temp = arrayString.split(",");
		if(temp.length>index){
			ans = temp[index];
		}
	}
	return ans;
}

/**
 * 依照提供的訊息顯示錯誤訊息
 * @param msg
 * @returns {Boolean}
 */
function showChecker(msg){
	if(isUndefinedOrNull(msg)){
		return true;
	}else{
		showStatusMsg('ng', msg);
		return false;
	}
}


/**測試用(未來將移至公用區)*/
/**
 * 給定一個className，會去掃描相關的className下的欄位，進行設定。
 * 需考慮textfield and dropDownList and radio button
 * 
 * TODO: radio button 尚未測試成功 [select OK!!]
 * 
 * @param $fieldEle
 * @param beanName
 * @param rowData
 */
function setFieldFromJson($fieldEle, beanName, rowData){
//	alert('set...');
	$.each(rowData, function(index, value){
		var $tmpEle = $fieldEle.find("#"+beanName+"_"+index);
		$tmpEle.val(value); 
		
		$filterTmp = $("option", $tmpEle).filter(function(){
			if($(this).text().indexOf(value)>=0){
				return $(this);
			}
		});
		$filterTmp.attr("selected", true);
		
	});
}

/**
 * 把整個rowData內部的值做個轉換
 * @param rowData
 */
function getADStringFromRocDateStringByRowData(rowData){
	
	var param = {};
	 
	var msg = "";
	$.each(rowData, function (index, value) {
		var keyString = index;
		var valueString = value;
		param[keyString] = getADStringFromRocDateString(valueString);
		msg += index+"="+value+',';
	});
//	alert(msg);
	return param;
}

/**
 * getADStringFromRocDateString 說明： 依照傳入的rocDateString以"/"切成String[]<br>
 * 若切割有問題會進行空字串回傳。若接收到空字串需要進來修正....<br>
 * @param rocDateString
 * @return String rocDateString=>代表有問題；2012/01/01=>代表正確<br>
 * @author game<br>
*/
function getADStringFromRocDateString(rocDateString){
//	alert(rocDateString);
	var ans = rocDateString;
	var ansYear = "";
	var ansMonth = "";
	var ansDay = "";
	var inString = rocDateString.split("/");
	
//	alert(rocDateString);
	
	if(inString.length == 3){
		ansYear = inString[0];
		ansMonth = inString[1];
		ansDay = inString[2];
		
		var intYear = 0;//ansYear%1911;
		ansYear = intYear+1911;
		
		if(!isUndefinedOrNull(ansMonth) && ansMonth.length==1){
			ansMonth = '0'+ansMonth;
		}
		
		if(!isUndefinedOrNull(ansDay) && ansMonth.length==1){
			ansDay = '0'+ansDay;
		}
		
		ans = ansYear + "/" +  ansMonth + "/" + ansDay;
	}			
	
//	alert(ans);
	
	return ans;
}