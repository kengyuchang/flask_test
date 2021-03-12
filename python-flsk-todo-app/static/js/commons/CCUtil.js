    
	function suppress(){
		event.keyCode = 0; 
		event.returnValue = false;
		return false;
	}

	function clickHandler(event){
        event.stopPropagation();
        event.preventDefault();            
    }
	
	/*顯示訊息*/
	function showMsg(msg,show){
		if(show)
			alert(msg);
	} 
	
	/*顯示失敗訊息(狀態列)*/
	function showErrorMsg(tmpStr){
		$("#statusMsg").val(tmpStr);
    	$("#statusMsg").attr("style","color:red");
    	//$("#textmsg").html(json.message.replace("]","]<br/>"));
	}
	
	/*顯示成功訊息(狀態列)*/
	function showSuccessMsg(tmpStr){
		$("#statusMsg").val(tmpStr);
    	$("#statusMsg").attr("style","color:blue");
	}
	
	/*function showCustMsg(tmpStr,color){
		$(".msgText").val(tmpStr);
    	$(".msgText").attr("style","color:"+color);
	}*/
	
	/*function addComma(inNum){
		var intResult = Number(inNum);
		if( isNaN(intResult) ) {
			return "0";
		}

		var re = /^-?\d+$/;
		if (!re.test(inNum)){
			inNum = inNum == "" ? "0" : addComma(inNum.replace("-", ""));  
			return inNum;
		}

		var signStr = "";
		var floatStr = "";
		var numStr = "" + inNum;

		 判斷是否為負數 
		if(numStr.indexOf("-") != -1){
			numStr = numStr.substring(1, numStr.length);
			signStr = "-";
		}
		
		 判斷是否為小數 
		if(numStr.indexOf(".") != -1){
			floatStr = numStr.substring(numStr.indexOf("."), numStr.length);
			numStr = numStr.substring(0, numStr.indexOf("."));
		}

		 加入逗號 
		var size = numStr.length;
		var theTempNum = "";
		var jIndex = 1;
		for(iIndex=size-1; iIndex>=0; iIndex--){
			theTempNum += numStr.substring(iIndex, iIndex+1);
			if(jIndex%3 == 0 && iIndex != 0){
				theTempNum += ",";
			}
			jIndex++;
		}
		size = theTempNum.length;
		var theNewNum = "";
		for(iIndex=size-1; iIndex>=0; iIndex--){
			theNewNum += theTempNum.substring(iIndex, iIndex+1);
		}

		theNewNum = signStr + theNewNum + floatStr;
		return theNewNum;
	}*/
	
	/*function removeComma(inNum){
		var re = /^-?\d{1,3}(,\d\d\d)*$/;
		if (!re.test(inNum)){
		  return inNum;
		}
		
		 拿掉逗號 
		while(inNum.indexOf(",") != -1){
		  inNum = inNum.replace(",", "");
		}
		return inNum;
	}*/
	
	function sortSecondCol(a,b){
		aFtaNo=a.ftaCountry=='LDCs'?1:a.ftaCountry=='PA'?2:a.ftaCountry=='GT'?3:a.ftaCountry=='NI'?4:a.ftaCountry=='SV'?5:a.ftaCountry=='HN'?6:a.ftaCountry=='CN'?7:9;
		bFtaNo=b.ftaCountry=='LDCs'?1:b.ftaCountry=='PA'?2:b.ftaCountry=='GT'?3:b.ftaCountry=='NI'?4:b.ftaCountry=='SV'?5:b.ftaCountry=='HN'?6:b.ftaCountry=='CN'?7:9;
		
		if(a.rateQty>b.rateQty){
			//alert('1: '+a.rateQty+';'+b.rateQty);
			return 1;
		}else if(a.rateQty==b.rateQty && a.ratePrice>b.ratePrice){
			//alert('2: '+a.ratePrice+';'+b.ratePrice);
			return 1;
		}else if(a.rateQty==b.rateQty && a.ratePrice==b.ratePrice && aFtaNo<bFtaNo){
			//alert('3: '+aFtaNo+a.ftaCountry+';'+bFtaNo+b.ftaCountry);
			return 1;
		}else{
			return -1;
		}
	}
	
	/*稅率整合字串處理*/
	function composeTariff(gridId, tableItem, hsNo8, expiryDate, prjCode, hsNoYear, hsVersion){
		$.ajax({
		    url: 'GetData!queryTariff',
		    type: "POST",
		    data:{"tableItem":tableItem,"hsNo8":hsNo8,"expiryDate":expiryDate,"prjCode":prjCode,"hsNoYear":hsNoYear,"hsVersion":hsVersion},
		    dataType: "json",
		    error: function() {
		    	showMsg('連線異常，請嘗試重新登入。',true);
		    	return false;
		    },
		    success: function(data, status) {
		    	//alert('!!! '+data.jsonData.tariff);
		    	$("#TARIFF1").val(data.jsonData.tariff1);
		    	$("#TARIFF2").val(data.jsonData.tariff2);
		    	$("#TARIFF3").val(data.jsonData.tariff3);

		    	var id = $("#"+gridId).jqGrid('getGridParam','selrow');
		        if (id) {
					$("#"+gridId).jqGrid('setRowData', id, {TARIFF1: data.jsonData.tariff1, TARIFF2: data.jsonData.tariff2, TARIFF3: data.jsonData.tariff3});
		        }
		    }
		});
	}
	
	/*機動稅率整合字串處理*/
	function composeMTariff(gridId, tableItem, hsNo8, expiryDate, prjCode, hsNoYear, hsVersion){
		$.ajax({
		    url: 'GetData!queryTariff',
		    type: "POST",
		    data:{"tableItem":tableItem,"hsNo8":hsNo8,"expiryDate":expiryDate,"prjCode":prjCode,"hsNoYear":hsNoYear,"hsVersion":hsVersion},
		    dataType: "json",
		    error: function() {
		    	showMsg('連線異常，請嘗試重新登入。',true);
		    	return false;
		    },
		    success: function(data, status) {
		    	//alert('!!! '+data.jsonData.tariff);
		    	$("#M1").val(data.jsonData.tariff1);
		    	$("#M2").val(data.jsonData.tariff2);
		    	$("#M3").val(data.jsonData.tariff3);

		    	var id = $("#"+gridId).jqGrid('getGridParam','selrow');
		        if (id) {
					$("#"+gridId).jqGrid('setRowData', id, {M1: data.jsonData.tariff1, M2: data.jsonData.tariff2, M3: data.jsonData.tariff3});
		        }
		    }
		});
	}
	
	/*稅率檢核*/
	function validateTariff(){
		result=false;hasQty=false;
		errorMsg='';
		if($("#RATE_QTY1").val()==''&&$("#RATE_PRICE1").val()==''){
			errorMsg+='[一欄稅率從量與從價請擇一填寫。]';
		}
		if($("#RATE_QTY3").val()==''&&$("#RATE_PRICE3").val()==''){
			errorMsg+='[三欄稅率從量與從價請擇一填寫。]';
		}
		if(($("#RATE_QTY3").val()!=''&&$("#RATE_QTY1").val()!=''&&Number($("#RATE_QTY3").val())<Number($("#RATE_QTY1").val()))||($("#RATE_PRICE3").val()!=''&&$("#RATE_PRICE1").val()!=''&&Number($("#RATE_PRICE3").val())<Number($("#RATE_PRICE1").val()))){
			errorMsg+='[三欄稅率應大於等於一欄稅率。]';
		}
		if($("#RATE_QTY1").val()!=''||$("#RATE_QTY3").val()!=''){
			hasQty=true;
		}
		for(var i=0;i<ccRowIndex;i++){
			if($("#RATE_QTY2"+i)[0]){
				if($("#RATE_QTY2"+i).val()==''&&$("#RATE_PRICE2"+i).val()==''){
					errorMsg+='[二欄稅率從量與從價請擇一填寫。]';
				}
				if(($("#RATE_QTY1").val()!=''&&$("#RATE_QTY2"+i).val()!=''&&Number($("#RATE_QTY1").val())<Number($("#RATE_QTY2"+i).val()))||($("#RATE_PRICE1").val()!=''&&$("#RATE_PRICE2"+i).val()!=''&&Number($("#RATE_PRICE1").val())<Number($("#RATE_PRICE2"+i).val()))){
					errorMsg+='[一欄稅率應大於等於二欄稅率。]';
				}
				if($("#RATE_QTY2"+i).val()!=''){
					hasQty=true;
				}
			}
		}
		if(hasQty&&$("#SPEC_UNIT").val()==''){
			errorMsg+='[有填寫從量稅率請填寫從量單位。]';
		}
		
		if(errorMsg!=''){
			showErrorMsg(errorMsg);
			result=false;
		}else{
			result=true;
		}
		
		return result;
	}
	
	/*機動稅率檢核*/
	function validateMTariff(){
		result=false;hasQty=false;
		errorMsg='';
		if($("#M_RATE_QTY1").val()==''&&$("#M_RATE_PRICE1").val()==''){
			errorMsg+='[一欄稅率從量與從價請擇一填寫。]';
		}
		if($("#M_RATE_QTY3").val()==''&&$("#M_RATE_PRICE3").val()==''){
			errorMsg+='[三欄稅率從量與從價請擇一填寫。]';
		}
		if(($("#M_RATE_QTY3").val()!=''&&$("#M_RATE_QTY1").val()!=''&&Number($("#M_RATE_QTY3").val())<Number($("#M_RATE_QTY1").val()))||($("#M_RATE_PRICE3").val()!=''&&$("#M_RATE_PRICE1").val()!=''&&Number($("#M_RATE_PRICE3").val())<Number($("#M_RATE_PRICE1").val()))){
			errorMsg+='[三欄稅率應大於等於一欄稅率。]';
		}
		if($("#M_RATE_QTY1").val()!=''||$("#M_RATE_QTY3").val()!=''){
			hasQty=true;
		}
		for(var i=0;i<ccRowIndex;i++){
			if($("#M_RATE_QTY2"+i)[0]){
				if($("#M_RATE_QTY2"+i).val()==''&&$("#M_RATE_PRICE2"+i).val()==''){
					errorMsg+='[二欄稅率從量與從價請擇一填寫。]';
				}
				if(($("#M_RATE_QTY1").val()!=''&&$("#M_RATE_QTY2"+i).val()!=''&&Number($("#M_RATE_QTY1").val())<Number($("#M_RATE_QTY2"+i).val()))||($("#M_RATE_PRICE1").val()!=''&&$("#M_RATE_PRICE2"+i).val()!=''&&Number($("#M_RATE_PRICE1").val())<Number($("#M_RATE_PRICE2"+i).val()))){
					errorMsg+='[一欄稅率應大於等於二欄稅率。]';
				}
				if($("#M_RATE_QTY2"+i).val()!=''){
					hasQty=true;
				}
			}
		}
		if(hasQty&&$("#SPEC_UNIT").val()==''){
			errorMsg+='[有填寫從量稅率請填寫從量單位。]';
		}
		
		if(errorMsg!=''){
			showErrorMsg(errorMsg);
			result=false;
		}else{
			result=true;
		}
		
		return result;
	}
	
	/*變動國家別連帶影響其他國家別清單*/
	function changeFta(){
		selectFtas='';
		for(var i=0;i<ccRowIndex;i++){
			if($("#FTA_COUNTRY2"+i)[0]&&$("#FTA_COUNTRY2"+i).val()!='')
				selectFtas+=','+$("#FTA_COUNTRY2"+i).val();
		}
		selectFtas=selectFtas.length>0?selectFtas.substring(1,selectFtas.length):'';
		for(var i=0;i<ccRowIndex;i++){
			processItem(i,selectFtas);
		}
	}
	
	/*將重覆的國家移除*/
	function processItem(index,selectFtas){
		if(selectFtas!=''){
			for(var i=0;i<ccRowIndex;i++){
				if($("#FTA_COUNTRY2"+i)[0]){
					var selectValue=$("#FTA_COUNTRY2"+i).val();
					
					//不處理變動的項目
					if(index!=i){
		
						$("#FTA_COUNTRY2"+i+" option").remove();
						ii=0;
						for(var j=0;j<countryAry.length;j++){
							
							//將原本選擇的值、不重覆的項目跟預設選項加上
							if(selectValue==countryAry[j].CODE.trim()||selectFtas.indexOf(countryAry[j].CODE.trim())==-1||j==0){
								var varItem = new Option(countryAry[j].CODE_CHINESE, countryAry[j].CODE); 
								$("#FTA_COUNTRY2"+i)[0].options.add(varItem);
								
								//將原本的選擇項目指定
								if(selectValue==countryAry[j].CODE){
									$("#FTA_COUNTRY2"+i)[0].selectedIndex=ii;
								}
								ii++;
							}
						}
					}
				}
			}
		}
	}
	
	function dateKeyUp(obj){
		showMsg(obj.value.length,false);
		if(obj.value.length==3){
			if(obj.value=='000'){
				obj.value='000/00/00';
			}else if(obj.value=='999'){
				obj.value='999/99/99';
			}else if(!isNaN(obj.value)){
				obj.value+='/';
			}
		}else if(obj.value.length==6){
			//if(!isNaN(obj.value)){
				obj.value+='/';
			//}
		}
	}
	
	function ishsNoLength(val){
		var check = (val.length == 2)||(val.length == 4)||(val.length == 6)||(val.length == 8)||(val.length == 10); 
		if(!check){
			appendMsgToStatusField( "稅號長度應為2、4、6、8或10碼"  );
			setColorForStatusField( 'red' );
		}
		return check;
	}
	
