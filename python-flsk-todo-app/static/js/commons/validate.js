function numberRequired(field, fieldLabel, isTextRequired){
    cleanSpace(field);
    if (isTextRequired){
        if (field.value == "" || field.value==null){
            field.focus();
            return "請輸入["+fieldLabel+"]\n";
        }
    }

    if (isNaN(field.value)){
        field.focus();
        return "["+fieldLabel+"]必須為數字\n";
    }else{
        return "";
    }
}

function textRequired(field, fieldLabel){
    var cField = cleanSpace(field.value);
    if (cField == "" || cField==null){
        field.focus();
        return "請輸入["+fieldLabel+"]\n";
    }else{
        return "";
    }
}

/*
 * check textBox's value.
 */
function _textRequired(field, errorMessage) {
    var hasInput = false;
    
    if (checkElement(field)) {
        if (field.length == undefined) {
            if (trim(field.value) != "") {
                hasInput = true;
            }        
        } else {
            for (var i = 0; i < field.length; i++) {
                if (trim(field[i].value) != "") {
                    hasInput = true;
                    break;
                } 
            }
        }
    }

    if (!hasInput) {
        alert("請輸入[" + errorMessage + "]!");
        if (field.length == undefined) {
            field.focus();
        } else {
        	if(field.length > 0) {
            	field[0].focus();
            }
        }
    }
    return hasInput;
}

/*
 * check value's length is larger then max length or not.
 */
function checkMaxLength(field, maxLength, errorMessage, cutTextValue) {
    if (checkElement(field)) {
        if (cutTextValue == undefined) {
            cutTextValue = false;
        }
        if (field.value.getBytes() > maxLength) {
            alert("[" + errorMessage + "]長度不可超過" + maxLength +"!");
            field.focus();
            if (cutTextValue) {
                field.value.cutTextValue(field, maxLength);
            }
            return false;
        }
    }
    return true;
}

/*
 * * check value's length is smaller then min length or not.
 */
function checkMinLength(field, minLength, errorMessage) {
    if (checkElement(field)) {
        if (field.value.getBytes() < minLength) {
        	alert("[" + errorMessage + "]長度至少 "+ minLength+ "位!");
            field.focus();
            return false;
        }
    }
    return true;
}

/*
 * check checkbox is checked or not
 */
function checkBoxRequired(field, errorMessage) {
    var hasCheck = false;
    if (checkElement(field)) {
        if (field.length == undefined) {
            if (field.checked) {
                hasCheck = true;
            }
        } else {
            for (var i = 0; i < field.length; i ++) {
                if (field[i].checked) {
                    hasCheck = true;
                    break;
                }
            }
        }
    }
    
    if (!hasCheck) {
        alert("請選擇[" + errorMessage + "]!");
    }
    
    return hasCheck;
}

/*
 * check field's value is number or not.
 */
function numberRequired(field, errorMessage) {
    if (checkElement(field)) {
        if (isNaN(field.value)) {
            alert("[" + errorMessage + "]必需為數字!");
            field.focus();
            return false;
        }
    }
    return true;
}

/*
 * check field is undefined or not.
 */
function checkElement(field, type) {
    if (field == undefined) {
        alert("This is an undefined field.");
        return false;
    }
    return true;
}

/*
 * check field's value by regular expression.
 */
function checkByRE(field, pattern, errorMessage) {
    if (checkElement(field)) {
        re = pattern;
        if (re.test(field.value)) {
            alert(errorMessage);
            field.focus();
            return false;
        }
    }
    return true;
}

function domTextRequired(field, fieldLabel){
    if (field != undefined){
        if(field.length == undefined){
            if(field.value==null || field.value==''){
                field.focus();
                return "請輸入["+fieldLabel+"]\n";
            }
        }
        else{
            var len = new Number(0);
            for ( len = 0; len < field.length ; len++ ){
                if( field[len].value=='' || field[len].value==null){
                    field[len].focus();
                    return "請輸入["+fieldLabel+"]\n";
                }
            }
        }
    }
    return "";
}


function domNumberRequired(field, fieldLabel, isTextRequired){
    if (isTextRequired){
        if (field != undefined){
            if(field.length == undefined){
                if(field.value==null || field.value==''){
                    field.focus();
                    return "請輸入["+fieldLabel+"]\n";
                }
            }
            else{
                var len = new Number(0);
                for ( len = 0; len < field.length ; len++ ){
                    if( field[len].value=='' || field[len].value==null){
                        field[len].focus();
                        return "請輸入["+fieldLabel+"]\n";
                    }
                }
            }
        }
    }
    if (field != undefined){
        if(field.length == undefined){
            if(isNaN(field.value)){
                field.focus();
                return "["+fieldLabel+"]必須為數字\n";
            }
        }
        else{
            var len = new Number(0);
            for ( len = 0; len < field.length ; len++ ){
                if( isNaN(field[len].value)){
                    field[len].focus();
                    return "["+fieldLabel+"]必須為數字\n";
                }
            }
        }
    }
    return "";
}


function dojoSelectRequired(fieldId, fieldLabel){
    var field = dojo.widget.byId(fieldId);
    if (field.getValue() == "" || field.getValue()==null){
        return "請選擇["+fieldLabel+"]\n";
    }else{
        return "";
    }
}

function emailRequired(field, fieldLabel){
    if(field.length == undefined)
    {
        var jsGenEmail_emailLen = field.value.length;
        var jsGenEmail_tempAt = field.value.indexOf('@');
        var jsGenEmail_tempDoc = field.value.indexOf('.');
        var jsGenEmail_tempDoc2 = field.value.lastIndexOf('.');
        if(jsGenEmail_tempAt>1 && jsGenEmail_tempDoc>0)
        {
            if((jsGenEmail_emailLen-jsGenEmail_tempAt) > 1 )
            {
	               if(jsGenEmail_emailLen-jsGenEmail_tempDoc<=1)
	               {
                    return "您輸入的["+fieldLabel+"]不正確\n";
	               }
	               else if((jsGenEmail_tempDoc2-1) == jsGenEmail_emailLen)
	               {
                    return "您輸入的["+fieldLabel+"]不正確\n";
	               }
            }
            else
            {
                return "您輸入的["+fieldLabel+"]不正確\n";
            }
        }
        else
        {
            return "您輸入的["+fieldLabel+"]不正確\n";
        }
    }
    else
    {
        var len = new Number(0);
        for ( len = 0; len < field.length ; len++ )
        {
            var jsGenEmail_emailLen = field[len].value.length;
            var jsGenEmail_tempAt = field[len].value.indexOf('@');
            var jsGenEmail_tempDoc = field[len].value.indexOf('.');
            var jsGenEmail_tempDoc2 = field[len].value.lastIndexOf('.');
            if(jsGenEmail_tempAt>1 && jsGenEmail_tempDoc>0)
            {
                if((jsGenEmail_emailLen-jsGenEmail_tempAt) > 1 )
                {
	                   if(jsGenEmail_emailLen-jsGenEmail_tempDoc<=1)
	                   {
                        return "您輸入的["+fieldLabel+"]不正確\n";
	                   }
	                   else if((jsGenEmail_tempDoc2-1) == jsGenEmail_emailLen)
	                   {
                        return "您輸入的["+fieldLabel+"]不正確\n";
	                   }
                }
                else
                {
                    return "您輸入的["+fieldLabel+"]不正確\n";
                }
            }
            else
            {
                return "您輸入的["+fieldLabel+"]不正確\n";
            }
        }
    }
    return "";
}

 Validator = {
	Require : /.+/,
	Email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	Phone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
	Mobile : /^((\(\d{3}\))|(\d{3}\-))?13\d{9}$/,
	Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	IdCard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
	Currency : /^\d+(\.\d+)?$/,
	Number : /^\d+$/,
	Zip : /^[1-9]\d{5}$/,
	QQ : /^[1-9]\d{4,8}$/,
	Integer : /^[-\+]?\d+$/,
	Double : /^[-\+]?\d+(\.\d+)?$/,
	English : /^[A-Za-z]+$/,
	Chinese :  /^[\u0391-\uFFE5]+$/,
	UnSafe : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	IsSafe : function(str){return !this.UnSafe.test(str);},
	SafeString : "this.IsSafe(value)",
	Limit : "this.limit(value.length,getAttribute('min'),  getAttribute('max'))",
	LimitB : "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
	Date : "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
	Repeat : "value == document.getElementsByName(getAttribute('to'))[0].value",
	Range : "getAttribute('min') < value && value < getAttribute('max')",
	Compare : "this.compare(value,getAttribute('operator'),getAttribute('to'))",
	Custom : "this.Exec(value, getAttribute('regexp'))",
	Group : "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
	ErrorItem : [document.forms[0]],
	ErrorMessage : ["以下原因導致送出失敗：\t\t\t\t"],
	Validate : function(theForm, mode){
		var obj = theForm || event.srcElement;
		var count = obj.elements.length;
		this.ErrorMessage.length = 1;
		this.ErrorItem.length = 1;
		this.ErrorItem[0] = obj;
		for(var i=0;i<count;i++){
			with(obj.elements[i]){
				var _dataType = getAttribute("dataType");
				if(typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined")  continue;				this.ClearState(obj.elements[i]);
				if(getAttribute("require") == "false" && value == "") continue;
				switch(_dataType){
					case "Date" :
					case "Repeat" :
					case "Range" :
					case "Compare" :
					case "Custom" :
					case "Group" : 
					case "Limit" :
					case "LimitB" :
					case "SafeString" :
						if(!eval(this[_dataType]))	{
							this.AddError(i, getAttribute("msg"));
						}
						break;
					default :
						if(!this[_dataType].test(value)){
							this.AddError(i, getAttribute("msg"));
						}
						break;
				}
			}
		}
		if(this.ErrorMessage.length > 1){
			mode = mode || 1;
			var errCount = this.ErrorItem.length;
			switch(mode){
			case 2 :
				for(var i=1;i<errCount;i++)
					this.ErrorItem[i].style.color = "red";
			case 1 :
				alert(this.ErrorMessage.join("\n"));
				this.ErrorItem[1].focus();
				break;
			case 3 :
				for(var i=1;i<errCount;i++){
				try{
					var span = document.createElement("SPAN");
					span.id = "__ErrorMessagePanel";
					span.style.color = "red";
					this.ErrorItem[i].parentNode.appendChild(span);
					span.innerHTML = this.ErrorMessage[i].replace(/\d+:/,"*");
					}
					catch(e){alert(e.description);}
				}
				this.ErrorItem[1].focus();
				break;
			default :
				alert(this.ErrorMessage.join("\n"));
				break;
			}
			return false;
		}
		return true;
	},
	limit : function(len,min, max){
		min = min || 0;
		max = max || Number.MAX_VALUE;
		return min <= len && len <= max;
	},
	LenB : function(str){
		return str.replace(/[^\x00-\xff]/g,"**").length;
	},
	ClearState : function(elem){
		with(elem){
			if(style.color == "red")
				style.color = "";
			var lastNode = parentNode.childNodes[parentNode.childNodes.length-1];
			if(lastNode.id == "__ErrorMessagePanel")
				parentNode.removeChild(lastNode);
		}
	},
	AddError : function(index, str){
		this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
		this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + ":" + str;
	},
	Exec : function(op, reg){
		return new RegExp(reg,"g").test(op);
	},
	compare : function(op1,operator,op2){
		switch (operator) {
			case "NotEqual":
				return (op1 != op2);
			case "GreaterThan":
				return (op1 > op2);
			case "GreaterThanEqual":
				return (op1 >= op2);
			case "LessThan":
				return (op1 < op2);
			case "LessThanEqual":
				return (op1 <= op2);
			default:
				return (op1 == op2);            
		}
	},
	MustChecked : function(name, min, max){
		var groups = document.getElementsByName(name);
		var hasChecked = 0;
		min = min || 1;
		max = max || groups.length;
		for(var i=groups.length-1;i>=0;i--)
			if(groups[i].checked) hasChecked++;
		return min <= hasChecked && hasChecked <= max;
	},
	IsDate : function(op, formatString){
		formatString = formatString || "ymd";
		var m, year, month, day;
		switch(formatString){
			case "ymd" :
				m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
				if(m == null ) return false;
				day = m[6];
				month = m[5]--;
				year =  (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
				break;
			case "dmy" :
				m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
				if(m == null ) return false;
				day = m[1];
				month = m[3]--;
				year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
				break;
			default :
				break;
		}
		if(!parseInt(month)) return false;
		month = month==12 ?0:month;
		var date = new Date(year, month, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate());
		function GetFullYear(y){return ((y<30 ? "20" : "19") + y)|0;}
	}
 }
 

/*
 * 檢查條碼
 */
function checkCvcit(cvcit) {
  // 必需為數字
  if(isNaN(cvcit.value)) {
    alert("條碼必須為數字");
    return false;
  }
  
  // 不足13碼則前面補滿零
  var number = cvcit.value;
  if (number.length < 13) {
    var size = 13 - number.length;
    var append;
    for (var i = 0; i < size; i++) {
      append += "0";
    }
    number = append + number;
  }
  
  // 偶位數相加, 奇數相加
  var even = 0;
  var odd = 0;
  var checkNum = number.charAt(12);
  for (var i = 0; i < number.length; i++) {
    if (i != 12) {
      if ((i%2) == 0) {
        odd += parseInt(number.charAt(i).toString());
      } else {
        even += parseInt(number.charAt(i).toString());
      }
    }
  }

  // (偶位數相加後*3 + 奇數相加後), 取個位數, 以10減個位數
  var num = (even*3 + odd) % 10;
  var checkNumber = 10 - num;
  
  // 若是相減剛好等於最後一位則為合法條碼
  if (checkNum == checkNumber || checkNumber == 10) {
    return true;
  } else {
    return false;
  }
} 

/* 
 * 檢查輸入資料
 */
function checkInput(field, defaultValue, label, isFocus) {
    if (field.value == defaultValue) {
        alert(label);
        if (isFocus) {
            field.focus();
        }
        return false;
    }
    return true;
}

/*
 * 檢查輸入資料長度
 */
function checkInputLength(field, defaultLength, label, isFocus) {
    if (getLength(field.value) > defaultLength) {
        alert(label);
        if (isFocus) {
            field.focus();
        }
        return false;
    }
    return true;
}

/*
 * 檢查輸入資料數字大小
 */
function checkInputNumber(field, max, min, label, isFocus) {
    if (field == undefined) {
        return false;
    }
    
    var value = field.value;
    if (isNaN(value)) {
        return false;
    }
    
    if (parseFloat(value) < min || parseFloat(value) > max) {
        alert(label);
        if (isFocus) {
            field.focus();
        }
        return false;
    }
    
    return true;
}

/*************中文及其他字母長度計算**************************/
function getLength(szWord) {
   var I,cnt=0;
   for(i=0;i<szWord.length;i++) {
      if(escape(szWord.charAt(i)).length >=4) 
         cnt +=2;
      else
         cnt++;
   }
   return cnt;       
}

// 中英文長度限制檢查(限制中文長度x個字 則英文長度2x個字)
function checkChEnLen(obj,limit,msg) {
    var x=0;
    var cut;
    for (i=0; i<obj.value.length; i++) {
        if(obj.value.charCodeAt(i) > 128){
            x=x+2;
        }else{  
            x=x+1;
        }
        
        if (x>limit) {
            cut=i;
            break;
        }
    }
    
    if (x>limit) {
        alert(msg);
        obj.value=obj.value.substring(0,cut);
        return false;
    }
	return true;
}

// regular expression
function regCheck(pattern, field, label, isFocus) {
    if (field != undefined && field.value != "") {
        re = pattern;
        if (re.test(field.value)) {
            alert(label);
            if (isFocus) {
                field.focus();
            }
            return false;
        }
    }
    return true;
}