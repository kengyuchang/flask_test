/**
 * Grid Util(PACM/src/webapp/js/commons/GridUtil.js)
 * 每個人都copy一份過去自己的專案跑，現在已經有非常多版本了。
 * 現在這邊重新放一個版本。(我只處理上面有這串字的~~)
 * 2013.01.18
 */

/**
 * 提供Grid中文設定參數，於頁面載入時設定。
 * 須確保repository的檔案已經擁有中文對應檔。
 * 原先的struts2-jquery-grid-plugin-2.4.1.jar
 * 當中並無中文設定檔，已經提供中文檔給peter重新製作jar檔。
 * 
 * 若要更新的話，請到下面路徑把該黨刪除，並重新執行PACI，
 * 該jar檔會重新下載。
 * 
 * ....路徑為.m2\repository\com\jgeppert\struts2\jquery\struts2-jquery-grid-plugin
 */

//發現問題=>路徑會因專案無法對應~先註解處理
/*
$(document).ready(function(){ 
	jQuery.scriptPath = "<%=request.getContextPath()%>/struts/";
	jQuery.struts2_jquery.local = "zh-TW";
	jQuery.struts2_jquery.gridLocal = "zh-TW";
	jQuery.ajaxSettings.traditional = true;
	jQuery.ajaxSetup({
		cache: false
	});
});
*/

/**
 *            
 * 使用範例:
 * 一般使用情境=>
 * $("#btnQuerySerNo").click(function(){
		$("#button").val("btnQuerySerNo");
		queryGrid("RP10!querySerNo", "#gridtableA");
	});

 * 指定頁面或狀態列使用情境=>
	//btnRefresh
	$("#btnRefresh").click(function(){
		$("#button").val("btnQuerySerNo");
		//call updaet... add...
		queryGrid("RP10!querySerNo", "#gridtableA", {page:$("input[class=ui-pg-input]").val(), msgId:".errText"});
	});
	
 * queryGrid說明:
 * @param: urlString => 指定此Grid的url屬性，會根據此屬性進行查詢。
 *                      (Action 方法 ex: RP10!querySerNo)
 *         gridTableId => 指定要呈現的GridTable String 
 *         				  (Selector ex: "#gridtableA")
 *         param(option) => 提供兩個屬性:
 *            				page : 查詢後以該頁呈現(指定頁面更新，預設第一頁。)
 *            				rows : 指定查詢時要使用的查詢筆數。
 *            				msgId : 可指定狀態列顯示(可指定狀態列，預設以'.msgText'顯示)
 *            				({msgId : '.msgText', 
 *            					page:$("input[class='ui-pg-input']" ).val(),
 *            					rows:$("select[class='ui-pg-selbox']" ).val(),
 *            					lastUrl:"RP01!queryGrid",
 *            					showMsg:false(預設會顯示~可關閉),
 *            					showGrid:false(預設會顯示~可關閉),
 *            					async:true(預設會false~可true)
 *            				})
 */
$(function(){
	/*for Libra */
	$("#libraCopy").val("");
	var form = $('form[id$="_dataForm"]').serialize();
	form = form.replace(new RegExp("%2F","gm"),"/");
	form = form.replace(new RegExp("%2C","gm"),",");
	$("#libraCopy").val(form);
});
function queryGrid(urlString, gridTableId, param){
	var fromString = "form";
	var jsonData;
	var showMsg = true;
	var showGrid = true;
	var asyncFlag = false;
	var msgId = '#statusMsg'; //下方狀態列
	var msgWinId = '#window'; //彈跳視窗
	var formData = $(fromString).serializeArray();
	var lastUrl = urlString;
	var gridParam = jQuery.param(formData);
	var index;
	if (typeof param !='undefined') {
		//msgId defaultValue = "#statusMsg" (can Change)
		if (param['msgId'] != null && param['msgId'].lenght>0) {
			msgId = param['msgId'];
		}
//		alert('1.value='+param['form']+',length='+param['form'].lenght);
		
		//重新變更form的ID
		if (param['form'] != null && param['form']!="" && typeof param['form'] != 'undefined') {
//			alert('2.'+param['form']);
			formData = $(param['form']).serializeArray();
			gridParam = jQuery.param(formData);;
		}
		
		//lastUrl defaultValue = urlString; (can Change)
		if (param['lastUrl'] != null && param['lastUrl'].lenght>0) {
			lastUrl = param['lastUrl'];
		}
		
		//showMsg defaultValue = true (can Change)
		if (param['showMsg'] != null) {
			showMsg = param['showMsg'];
		}
		
		//showGrid defaultValue = true (can Change)
		if (param['showGrid'] != null) {
			showGrid = param['showGrid'];
		}
		
		//page added for formData
		if (param['page'] != null && param['page']>0) {
			// Find and replace `msgId` if there
			for (index = 0; index < formData.length; ++index) {
			    if (formData[index].name == "page") {
			    	formData[index].value = param['page'];
			        break;
			    }
			}
			// Add it if it wasn't there
			if (index >= formData.length) {
				formData.push({
			        name: "page",
			        value: param['page']
			    });
			}
		}
		//rows added for formData
		if (param['rows'] != null && param['rows']>0) {
			// Find and replace `rows` if there
			for (index = 0; index < formData.length; ++index) {
			    if (formData[index].name == "rows") {
			    	formData[index].value = param['rows'];
			        break;
			    }
			}
			// Add it if it wasn't there
			if (index >= formData.length) {
				formData.push({
			        name: "rows",
			        value: param['rows']
			    });
			}
		}
		//sidx added for formData
		if (param['sidx'] != null && param['sidx']>0) {
			// Find and replace `rows` if there
			for (index = 0; index < formData.length; ++index) {
			    if (formData[index].name == "sidx") {
			    	formData[index].value = param['sidx'];
			        break;
			    }
			}
			// Add it if it wasn't there
			if (index >= formData.length) {
				formData.push({
			        name: "sidx",
			        value: param['sidx']
			    });
			}
		}
		//sord added for formData
		if (param['sord'] != null && param['sord']>0) {
			// Find and replace `rows` if there
			for (index = 0; index < formData.length; ++index) {
			    if (formData[index].name == "sord") {
			    	formData[index].value = param['sord'];
			        break;
			    }
			}
			// Add it if it wasn't there
			if (index >= formData.length) {
				formData.push({
			        name: "sord",
			        value: param['sord']
			    });
			}
		}
		//async defaultValue = false (can Change)
		if (param['async'] != null) {
			asyncFlag = param['async'];
		}
		
	}
	formData = jQuery.param(formData);

	$.ajax({
		url: urlString, //"RP10!querySerNo",
		type: "POST",
		data: formData,
		async: asyncFlag,
		//dataType: "json",
		success: function(json, status) {
			if (typeof json == 'string') {
				var errMsg = $(json).find("#jsonMsg").html();
				$(msgWinId).html(errMsg);
				$(msgWinId).attr("style","color:red");
				var errString = "";
				listMsg = $(json).find("#jsonMsg").children("li");
				for(var i = 0; i<listMsg.size();i++){
					errString += listMsg.eq(i).html();
				}
				$(msgId).val(errString);
				$(msgId).attr("style","color:red");
			} else {
				jsonData={
					'page':json.page, 'records' :json.records,
					'rows':json.rows, 'total' :json.total,
					'gridModel':json.gridModel
				};//GridBean only
				//if showGrid is true, then showGrid.
				if(showGrid){
					$(gridTableId)[0].addJSONData(jsonData);
				}
				$(gridTableId).jqGrid( 'setGridParam', {
					url:lastUrl+ '?'+gridParam
				}); //.trigger("reloadGrid");
				if(urlString != lastUrl){
					$(gridTableId).jqGrid( 'setGridParam', {
						url:lastUrl+'?'+gridParam
					}).trigger("reloadGrid");
				}
				if(showMsg==true){
					//處理message or msg(廢棄)
					if(typeof json.msg != 'undefined'){
						$(msgId).val(json.msg);
						$(msgWinId).html(json.msg.replace("]", "]<br/>"));
					}else if(typeof json.message != 'undefined'){
						$(msgId).val(json.message);
						$(msgWinId).html(json.message.replace("]", "]<br/>"));
					}
					//處理status or success(廢棄)
					if(typeof json.status != 'undefined'){
						if(json.status.toUpperCase().indexOf('OK')>=0){
							$(msgId).attr("style","color:blue");//has effect
							$(msgWinId).attr("style","color:black");
						}else{
							$(msgId).attr("style","color:red");
							$(msgWinId).attr("style","color:red");
						}
					}else if(typeof json.success != 'undefined'){
						if(json.success.toUpperCase().indexOf('OK')>=0){
							$(msgId).attr("style","color:blue");//has effect
							$(msgWinId).attr("style","color:black");
						}else{
							$(msgId).attr("style","color:red");
							$(msgWinId).attr("style","color:red");
						}
					}
				}
				jsonData=json;//GridBean only

			}
		},
		error: function(xhrInstance, status, xhrException) {
			message='發生伺服器例外錯誤';
 			$(msgId).val(message);
 			$(msgWinId).html(message+"<br/>");
 			$(msgId).attr("style","color:red");
 			$(msgWinId).attr("style","color:red");
 		}
	});
	$.ajax({async: true});
	return jsonData;
}
/**
 * @param gridtableId 將資料塞到grid第一筆當中
 * @param data 塞入的資料 {keyA:valueB, keyB:valuB, ... }
 * @return null
 */
function appendGrid(gridtableId, data){
    var $gridtable = $( '#'+gridtableId);
    var ids = $gridtable.jqGrid( 'getDataIDs');
    for( var i=0; i < ids.length; i++){
          if(i==ids.length-1){
//             alert( 'ids[i]='+ids[i]);
             $gridtable.jqGrid( 'delRowData', ids[i]);
         }
    }
    var recordsT = $gridtable.jqGrid( 'getGridParam', 'records');
    $gridtable.jqGrid( 'addRowData', recordsT, data, 'first');
    var top_rowid = $('#mygrid tbody:first-child tr:first').attr('id');
    $gridtable.jqGrid( 'setSelection', top_rowid);
}
