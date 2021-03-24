
/*
 * Advanced Configuration On Document for Selection DeclNo, MAWB/HAWB 選擇報單號碼，主分號程式庫
 * 版本: 0.2.0.3
 *  
 * 修正點選報單號碼後自動查詢。by tony。 
 * 修正<tr>、<td> 不連動卷軸。by tony。 
 * 20160217  by tony  不要使用session了
 */

	var advDeclDataMap;
	var adv_Ctrl_Flag = false; 

	// key 說明
	//   curType: declNo, mhawb 目前選擇報單號碼或主分號
	//   declNo:  使用過的報單號碼列表
	//   mhawb:   使用過的主分號列表

$(document).bind("keydown",(function(event){

	// 13 / 108 enter => decl_no 
	if ( ( event.keyCode == 13 || event.keyCode == 108 ) && adv_Ctrl_Flag )
	{   
		if ( $("input[name='_advSelDataType_']:checked").val() == "declNo" )
		{
			var data = $("input[name=advCode]:checked").val(); 
			if ( data != "" )
				advDeclAssignData(data);
		}
		else if ( $("input[name='_advSelDataType_']:checked").val() == "mhawb" )
		{
			var data = $("input[name=advCodeM]:checked").val(); 
			if ( data != "" )
				advDeclAssignData(data);
		}
	//  37 左  39 右
	}else if ( (event.keyCode == 37 || event.keyCode == 39 ) && adv_Ctrl_Flag )
		$("input[name='_advSelDataType_']:checked").focus(); 
	//  38 上  40 下
	else if ( (event.keyCode == 38 || event.keyCode == 40 ) && adv_Ctrl_Flag )
	{
		if ( $("input[name='_advSelDataType_']:checked").val() == "declNo" )
			$("input[name='advCode']:checked").focus(); 
		else 
			$("input[name='advCodeM']:checked").focus(); 
	}
}));

/*function advDeclHover(evt) {
	// private 滑鼠移進移出事件
	var mode = evt.data["mode"];
	var jrow = evt.data["row"];
	jrow.parent().find("tr").removeClass("hoverRow");
	if (mode == "i")
		jrow.addClass("hoverRow");
}*/

/*function advDeclKeyMoveUp(evt) {

	// private 操作者按了向上鍵
	var jrowList = $("#_advSelDataDlg_ table tr");
	var pos;
	for (pos = 0; pos < jrowList.length; pos++)
		if ($(jrowList[pos]).hasClass("hoverRow"))
			break;
	if (pos > 0) {
		$(jrowList[pos]).removeClass("hoverRow");
		$(jrowList[pos - 1]).addClass("hoverRow");
	}

	window.event.keyCode = 0;
	window.event.returnValue = false;
	return false;
}*/

/*function advDeclKeyMoveDown(evt) {

	// private 操作者按了向下鍵
	var jrowList = $("#_advSelDataDlg_ table tr");
	var pos;

	for (pos = 0; pos < jrowList.length; pos++)
		if ($(jrowList[pos]).hasClass("hoverRow"))
			break;
	if (pos + 1 < jrowList.length) {
		$(jrowList[pos]).removeClass("hoverRow");
		$(jrowList[pos + 1]).addClass("hoverRow");
	}

	window.event.keyCode = 0;
	window.event.returnValue = false;
	return false;
}*/

function advDeclKeySel(evt) {
	// private 操作者按了選擇鍵
	var jdlg = $("#_advSelDataDlg_");
	jdlg.dialog("close");
	var type = advDeclDataMap["curType"];
	var data = "";
	if (type == "declNo")
		data = jdlg.find("table tr.hoverRow [name='declNo']").val();
	else if (type == "mhawb") {
		jrow = jdlg.find("table tr.hoverRow");
		data = jrow.find("td:eq(0)").text() + ";" + jrow.find("td:eq(1)").text();
	}
	advDeclAssignData(data);

	window.event.keyCode = 0;
	window.event.returnValue = false;
	return false;
}

function advDeclClickData(evt) {
	// private 使用者選擇一個資料之事件
	$("#_advSelDataDlg_").dialog("close");
	var data = evt.data["data"];
	advDeclAssignData(data);
}

function advDeclAssignData(data) {

	if ( data == undefined )
		return;

	// private 選擇某一筆資料，將此資料設定到畫面上
	var type = advDeclDataMap["curType"];
	if (type == "declNo") {
		var jfieldList = $("input.advDeclNo");
		if (jfieldList.attr("readonly")){
			advConfigShowErrorMessage('請將輸入欄位切換至報單號碼。',-1);
			return;
		}
		else
			advConfigShowErrorMessage('');
		for (var i = 0; i < jfieldList.length; i++) {
			var jfield = $(jfieldList[i]);
			jfield.val(data);
			jfield.change();
			// 點選報單號碼後自動查詢 by tony
			$("[name='btn_F6']").trigger('click');
		}
	}
	else if (type == "mhawb") {
		var p = data.indexOf(';');
		var mawb = p >= 0 ? data.substring(0, p) : data;
		var hawb = p >= 0 ? data.substring(p + 1) : "";
		var jfieldList = $("input.advMawb");
		if (jfieldList.attr("readonly")){
			advConfigShowErrorMessage('請將輸入欄位切換至主分號。',-1);
			return;
		}
		if ( mawb.trim() == "" || hawb.trim() == "" )
			return;

		for (var i = 0; i < jfieldList.length; i++) {
			var jfield = $(jfieldList[i]);
			jfield.val(mawb);
			jfield.change();
		}
		jfieldList = $("input.advHawb");
		for (var i = 0; i < jfieldList.length; i++) {
			var jfield = $(jfieldList[i]);
			jfield.val(hawb);
			jfield.change();
		}
	}
}

function advDeclChoose() {
	// private 顯示資料選擇視窗
	var type = advDeclDataMap["curType"];
	var jdlg = $("#_advSelDataDlg_");

	if ( type == undefined )
		type = "declNo";

	jdlg.find("[name='_advSelDataType_'][value='" + type + "']").attr("checked", true);
	var jtbl = jdlg.find("table");
	jtbl.empty();
	adv_Ctrl_Flag = true;
	if (type == "declNo") 
	{
		var list = advDeclDataMap["declNo"];
		var _checked = true;
		for (var i = 0; i < list.length; i++) 
		{
			/*var line = "<tr><td style='width: 300px;' nowrap align='center'>" + advConfigTransDeclno(list[i])
					 + "<input type='hidden' name='declNo' value='" + list[i] + "' /></td></tr>";*/

			if ( advConfigTransDeclno( list[i] ).trim() == "" )
				continue;

			/* 20160224 取消序號 by tony
			var space = i + 1 + "";
			if ( space.length == 1 )
				space = "&nbsp&nbsp&nbsp" + space;
			else if ( space.length == 2 ) 
				space = "&nbsp&nbsp" + space;
			else if ( space.length == 3 ) 
				space = "&nbsp" + space;*/
			var space = "";

			var line = "<tr><td>&nbsp" + space + "&nbsp<input type=\"radio\" name=\"advCode\" id=\"advCode"+ i + "\" value=\""+ list[i] +"\"";

			if ( _checked )
			{
				line =  line + " checked='checked' ";
				_checked = false;
			}

			line =  line +" ></input>"+"&nbsp&nbsp<label for=\"advCode"+ i +"\" >" + advConfigTransDeclno( list[i] ) + "</label></td></tr> ";
			var jrow = $(line);

			jrow.bind("dblclick", { data: list[i] }, advDeclClickData);
			//jrow.bind("click", { data: list[i] }, advDeclClickData);
			//jrow.bind("mouseenter", { row: jrow, mode: "i" }, advDeclHover);
			jtbl.append(jrow);
		}
	}
	else if (type == "mhawb") {
		var list = advDeclDataMap["mhawb"];
		var _checked = true;
		for (var i = 0; i < list.length; i++) {
			var p = list[i].indexOf(';');
			var mawb = p >= 0 ? list[i].substring(0, p) : list[i];
			var hawb = p >= 0 ? list[i].substring(p + 1) : "*";

			/*var line = "<tr><td style='width: 150px;' nowrap align='left'>" + mawb + "</td>" + 
						"<td style='width: 150px;' nowrap align='left'>" + hawb + "</td></tr>";*/

			if ( mawb.trim() == "" )
				continue;

			var space = i + 1 + "";
			if ( space.length == 1 )
				space = "&nbsp&nbsp&nbsp" + space;
			else if ( space.length == 2 ) 
				space = "&nbsp&nbsp" + space;
			else if ( space.length == 3 ) 
				space = "&nbsp" + space;

			var line = "<tr><td>&nbsp" + space + "&nbsp<input type=\"radio\" name=\"advCodeM\" id=\"advCodeM"+ i + "\" value=\""+ list[i] +"\"";

			if ( _checked )
			{
				line = line + " checked='checked' ";
				_checked = false;
			}

			line =  line +" ></input>"+"&nbsp&nbsp<label for=\"advCodeM"+ i +"\" >" + mawb + "  /  " + hawb + "</label></td></tr> ";

			var jrow = $(line);
			jrow.bind("dblclick", { data: list[i] }, advDeclClickData);
			//jrow.bind("click", { data: list[i] }, advDeclClickData);
			//jrow.bind("mouseenter", { row: jrow, mode: "i" }, advDeclHover);

			jtbl.append(jrow);
		}
	}
	//jtbl.find("tr:eq(0)").addClass("hoverRow");
}

function advDeclTypeChanged(src) {
	// private 變更選擇類型
	var type = $(src).val();
	advDeclDataMap["curType"] = type;
	advDeclChoose();
	/* 20160217  by tony  不要使用session了
	 * 這裡只是存入選擇的資料類型
	var url = "SelDeclNo!setCurType";
	var request = { type: type };
	$.post(url, request, function (response, status) { }, "json");*/
}

function advDeclClose() {
	// private 關閉選擇視窗
	//$(document).unbind("keydown", advDeclKeyMoveUp);
	//$(document).unbind("keydown", advDeclKeyMoveDown);
	$(document).unbind("keydown", advDeclKeySel);
	adv_Ctrl_Flag = false;
}

function advDeclOpen() {
	// private 開啟選擇視窗
	advDeclChoose();
	var jdlg = $("#_advSelDataDlg_");
	jdlg.bind("dialogclose", advDeclClose);
	jdlg.dialog("open");
	jdlg.find("input[type='radio'][name='_advSelDataType_'][value='" + advDeclDataMap["curType"] + "']").focus();
	//$(document).bind("keydown", "up", advDeclKeyMoveUp);
	//$(document).bind("keydown", "down", advDeclKeyMoveDown);
	$(document).bind("keydown", "return", advDeclKeySel);
}

function advDeclSel() {
	// public 開啟選擇報單號碼對話盒
	// if (advDeclDataMap && advDeclDataMap["load"])
	//	 advDeclOpen(); 
	// else {

	// 20160217  by tony  不要使用session了
	var _$historySelector = {};

	 if ( window.top.header ) {
		 _$historySelector =  $( "#historyArea", window.top.header.document );
	 } else if ( window.opener ) { //由menu點右鍵開啟的
		 if ( window.opener.top.header )
			 _$historySelector = $( "#historyArea", window.opener.top.header.document );
	 }
	 
	 try 
	 {
		 advDeclDataMap = JSON.parse( _$historySelector.text() );
	 } catch( e )
	 {
		 advDeclDataMap = {};
		 advDeclDataMap[ "load" ] = true;
		 advDeclDataMap[ "curType" ] = "declNo";
		 advDeclDataMap[ "declNo" ] = [];
		 advDeclDataMap[ "mhawb" ] =  [];
	 }

	 advDeclOpen();
	 
	/* 20160217  by tony  不要使用session了
		var url = "SelDeclNo!loadData";
		var request = {};
		$.post(url, request, function (response, status) {
			if (status == "success") {
				advDeclDataMap = {};
				advDeclDataMap["load"] = true;
				advDeclDataMap["curType"] = response["model"]["type"];
				advDeclDataMap["declNo"] = response["model"]["declNoList"];
				advDeclDataMap["mhawb"] = response["model"]["mhawbList"];
				advDeclOpen();
			}
		}, "json");*/
	// } 
}

function advDeclBindKey(doBind) {
	// public 將選擇報單加入/移除 F12 事件
	$(document).unbind("keydown", advDeclSel);
	if (doBind == "Y"){
		$(document).bind("keydown", function(event){
			if( event.keyCode == 123)
				advDeclSel();
		});
	}
}

function advDeclAdd(data, type) {
	// public 將資料加入
	// type 為 declNo 或 mhawb
	// 為了相容原程式，沒有改 type 時視為給 declNo
	if (!type)
		type = "declNo";

	if (!advDeclDataMap)
		advDeclDataMap = { curType: "declNo", load: false };
		//advDeclDataMap = { type: "declNo", load: false };
	if (!advDeclDataMap[type])
	{
		// advDeclDataMap[type] = [];
		// 轉換作業也要 initial 
		// 20160217  by tony  不要使用session了
		var _$historySelector = {};

		 if ( window.top.header ) {
			 _$historySelector =  $( "#historyArea", window.top.header.document );
		 } else if ( window.opener ) { //由menu點右鍵開啟的
			 if ( window.opener.top.header )
				 _$historySelector = $( "#historyArea", window.opener.top.header.document );
		 }
		 
		 try 
		 {
			 advDeclDataMap = JSON.parse( _$historySelector.text() );
		 } catch( e )
		 {
			 advDeclDataMap = {};
			 advDeclDataMap[ "load" ] = true;
			 advDeclDataMap[ "curType" ] = "declNo";
			 advDeclDataMap[ "declNo" ] = [];
			 advDeclDataMap[ "mhawb" ] =  [];
		 }
	}

	// 從原列表中移除相同的報單
	var list = advDeclDataMap[type];
	for (var i = 0; i < list.length; i++)
		if (data == list[i]) {
			// 如果剛好是第一筆，則無需後續處理
			if (i == 0)
				return;
			list.splice(i, 1);
			break;
		}
	// 將新增資料放在最前面
	list.splice(0, 0, data);

	// 20160217  by tony  不要使用session了
	//加到第一個，如果存在就刪除
	if ( type == "declNo" ) { // 報單號碼
		advDeclDataMap["declNo"] = _.without( advDeclDataMap["declNo"], data );
		advDeclDataMap["declNo"].unshift( data );
	}else if ( type == "mhawb" ) { //海空運別
		advDeclDataMap["mhawb"] = _.without( advDeclDataMap["mhawb"], data );
		advDeclDataMap["mhawb"].unshift( data );
	}

	var _historyArea = JSON.stringify( advDeclDataMap );

	if ( window.top.header ) {
	    $( "#historyArea", window.top.header.document ).text( _historyArea );
	} else if ( window.opener ) { //由menu點右鍵開啟的
	if ( window.opener.top.header )
	    $( "#historyArea", window.opener.top.header.document ).text( _historyArea );
	}

	/* 20160217  by tony  不要使用session了
	var url = "SelDeclNo!addData";
	var request = { type: type, data: data };
	$.post(url, request, function (response, status) { }, "json");*/
}

function advDeclRegister(root) {
	// public 啟動程序

	// root 一般狀況下不用傳值
	if (!root) {
		root = $(document);
		advDeclBindKey("Y");

		var jmain = root.find("#main");

		var html = "<div id='_advSelDataDlg_' title='選擇資料' style=\"overflow:hidden;\">"
				 + "資料類別：<input type='radio' name='_advSelDataType_' value='declNo' onclick='advDeclTypeChanged(this);'/>報單號碼"
				 + "<input type='radio' name='_advSelDataType_' value='mhawb' onclick='advDeclTypeChanged(this);'/>主分號"
				 //+ "<table class='ctv'></table>"
				 + "<div style=\"height:240px;overflow:auto;\"><table></table></div>"
				 + "</div>";

		var jselDlg = $(html);
		jmain.append(jselDlg);
		jselDlg.dialog({ autoOpen: false, modal: true, width: 350, height: 300 });
	}
}

