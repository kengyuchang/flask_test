
/*
 * Advanced Configuration On Document for Switch Pane 變更主動視窗處理程式庫
 * 版本: 0.5.6
 *
 * 異動紀錄：
 * <2012/11/14> by sam 增加直接轉換作業或按選單時須清除轉換作業資訊。
 *
 * 條件置於 HTML 中引導欄位 (helpler) 之後，格式為 <div class="acod">{主動視窗條件}</div>
 *
 * pane:{cmd1};{cmd2};..;{cmdN};
 *
 * cmd 可以為
 *   pane(x,y,...) 指定切換的視窗名稱
 *	 ret(x) 指定返回按鈕的名稱
 *   has(x) 指定判斷是否有內容的函式名稱
 *   url(x) 指定去遠端取得 pane 的 url
 */

var advPaneMainPanes;
var advPaneList = {};

/*
 * field 輸入切換用的欄位
 * paneNames 視窗的名稱 array
 * panes 視窗 array
 * valid 有效的 pane
 */

function advPaneSetActive(panes) {
	// private 將重疊的視窗中挑出一個顯示
	// pane 為要顯示的視窗名稱或 id
	$("div.pane").css("display", "none");
	if (window.advBtnDisableHotkey)
		advBtnDisableHotkey();
	for (var i = 0; i < panes.length; i++) {
		var pane = $(panes[i]);
		pane.css("display", "block");
		if (window.advBtnEnableHotkey)
			advBtnEnableHotkey(pane);
	}
}

function advPaneShowHasContent(jfield, hasContent) {
	// private 如果視窗中有內容，則顯示在欄位中
	// fieldName 顯示是否有內容的欄位名稱
	// hasContent 是否有內容
	jfield.val(hasContent ? "**" : "");
}

function advPaneHasContent(paneName) {
	// private 檢查視窗中是否有內容
	// paneName 檢查視窗名稱
	var jpane = $(advConfigGetSelector(paneName));
	// 確定 input text 是否有內容
	var hasContent = false;
	if (!hasContent) {
		// 檢查 text field
		$.each(jpane.find("input,textarea,select"), function(key, field) {
			var jfield = $(field);
			var value = jfield.val();
			if (!jfield.hasClass("noContent") && value && value.length > 0)
				hasContent = true;
		});
	}
	return hasContent;
}

function advPaneEvalHasContent(jfield, paneList, hasFunc) {
	// private 以 hasFunc 判斷 jpane 中是否有內容
	var hasContent = false;
	for (var i = 0; i < paneList.length && !hasContent; i++) {
		var id = '#' + $(paneList[i]).attr("id");
		var cmd = "if (window." + hasFunc + ") hasContent = " + hasFunc + "('" + id + "');";
		eval(cmd);
	}
	advPaneShowHasContent(jfield, hasContent);
}

function advPaneDblClickField(evt) {
	// private 當欄位被雙擊時呼叫
	var data = evt["data"];
	if (!data["valid"])
		return;
	if (!data["panes"] && data["url"]) {
		// 尚未註冊應下載 pane 內容
		$.post(data["url"], {}, function (response, status) {
			if (status == "success") {
				//advConfigShowErrorMessage("下載數量：" + response.length);
				// 下載的 html 找出 pane 的部份
				var newPart = $(response);
				var parent = $(advPaneMainPanes[0]).parent();
				var paneNames = data["paneNames"];
				for (var i = 0; i < paneNames.length; i++) {
					var jpane = newPart.find(advConfigGetSelector(paneNames[i]));
					if (jpane.length > 0) {
						// 把找到的部份，加掛在 advPaneMainPanes 的 parent
						parent.append(jpane);
						advConfigRegister(jpane);
						if (window.advAjaxRegister)
							window.advAjaxRegister(jpane);
						if (window.advGridRegister)
							window.advGridRegister(jpane);
					}
				}
				advPaneRegisterPane(data["paneNames"]);
				advPaneSetActive(panes);
			}
			else
				data["valid"] = false;
		}, "html");
	}
	else
		// 否則直接設定
		advPaneSetActive(data["panes"]);
}

function advPaneReturn(evt) {
	// private 當視窗的返回鍵被按下時
	// mainPaneSelector 返迴視窗選擇器
	advPaneSetActive(advPaneMainPanes);
	advPaneEvalHasContent($(evt.data["field"]), evt.data["panes"], evt.data["has"]);
}

function advPaneRegisterPane(paneNames) {
	// private 註冊切換的 pane
	var data = advPaneList[paneNames[0]];
	if (!data)
		return;
	// 已經註冊過了，避免重覆註冊
	if (!data["valid"] || data["panes"])
		return;
	var panes = [];
	for (var i = 0; i < paneNames.length; i++) {
		// 將 pane 名稱轉為 pane 元件
		var jpane = $(advConfigGetSelector(paneNames[i]));
		if (jpane.length == 0) {
			// 無效的 pane
			data["valid"] = false;
			return;
		}
		panes.push(jpane[0]);
	}
	data["panes"] = panes;
	// 將 return button 設定完成
	for (var i = 0; i < panes.length; i++) {
		var jpane = $(panes[i]);
		var jbutton = jpane.find(advConfigGetSelector(data["ret"]));
		if (jbutton.length == 0)
			jbutton = jpane.find("button[type='button'].return");
		if (jbutton.length > 0)
			jbutton.bind("click", data, advPaneReturn);
		else
			jbutton = jpane.find(advConfigGetSelector("btn_ESC"));
				if(jbutton.length > 0)
					jbutton.bind("click", data, advPaneReturn);
	}
}

function advPaneRegisterField(jfield) {
	// private 註冊選擇 pane 用的 textfield
	var nextElem = advConfigGetNextAcod(jfield);
	if (nextElem) {
		var data = { "field": jfield[0] };
		var wholeCond = nextElem.text().split(/\s+/);
		for (var i = 0; i < wholeCond.length; i++) {
			// 依條件類別分別塞入個別限制中
			var cond = wholeCond[i].match(/pane:(.*)/);
			if (cond) {
				var cmdList = cond[1].split(/;/);
				for (var j = 0; j < cmdList.length; j++) {
					var headArgs = cmdList[j].match(/(\w+)(\(([#\w]+)\))?/);
					if (headArgs) {
						var head = headArgs[1];
						var args = headArgs[3];
						if (head == "pane")
							data["paneNames"] = args.split(/,/);
						else if (head == "ret" || head == "has" || head == "url")
							data[head] = args;
					}
				}
			}
		}

		// 沒有 pane 名稱，就是無效的設定
		if (!data["paneNames"])
			return;
		// 保留資料
		data["valid"] = true;
		advPaneList[data["paneNames"][0]] = data;
		// 如果沒有指定 has 函數，就預設為 advPaneHasContent
		if (!data["has"])
			data["has"] = "advPaneHasContent";
		// 如果沒有指定 ret 按鈕，預設為 return
		if (!data["ret"])
			data["ret"] = "return";
		// 如果有指定 url，就改成在選擇時才設定
		if (!data["url"])
			advPaneRegisterPane(data["paneNames"]);
		// 設定 field 的切換
		jfield.bind("dblclick", data, advPaneDblClickField);
	}
}

function advPaneCheckContent() {
	// public 判斷所有的視窗是否有內容
	$.each(advPaneList, function (id, data) {
		advPaneEvalHasContent($(data["field"]), $(data["panes"]), data["has"]);
	});
}

function advPaneActive(paneIds) {
	// public 設定顯示的視窗
	var paneIdList = paneIds.split(/,/);
	var jpanes = [];
	for (var i = 0; i < paneIdList.length; i++) {
		var jpane = $("#" + paneIdList[i]);
		if (jpane.length > 0)
			jpanes.push(jpane[0]);
	}
	if (jpanes.length > 0)
		advPaneSetActive(jpanes);
}

function advPaneBackup(localAction, data) {
	// private 備份此作業轉出後，下次要回復目前狀況的資訊
	// localAction 此作業的 url
	// data 回復用資訊
	var jbackup = $("input[type='hidden'][name='_advPaneBackup_']");
	if (jbackup.length > 0) {
		// 如果是採用 acis 的結構，備份資料放在 _advPaneBackup_ 欄位中
		var text = jbackup.val();
		var backupList = text ? JSON.parse(text) : [];
		var thisData = { "action": localAction, "keep": data, "restoring": false };
		backupList.push(thisData);
		text = JSON.stringify(backupList);
		jbackup.val(text);
	}
	else if (top.frames["menu"]) {
		// 如果是採用 aerp 的 frame set 結構，備份畫面的點放在 menu frameset 中
		var jbody = $("body", top.frames['menu'].document);
		if (!jbody)
			return;
		// 如果前一次的內容沒有取走，就把所有資訊都刪掉
		var jorgBackup = jbody.find("div[name='_advPaneBackup_']:last");
		if (jorgBackup.length > 0 && jorgBackup.attr("title") == "restoring")
			jbody.find("div[name='_advPaneBackup_']").remove();
		jbody.append("<div name='_advPaneBackup_' style='display: none;'><div></div><div></div></div>");
		var jbackup = jbody.find("div[name='_advPaneBackup_']:last");
		jbackup.find("div:eq(0)").text(localAction);
		var jsonData = JSON.stringify(data);
		jbackup.find("div:eq(1)").text(jsonData);
	}
}

function advPaneHover(evt) {
	// private 滑鼠移進移出事件
	var mode = evt.data["mode"];
	var jrow = evt.data["row"];
	if (mode == "i") {
		jrow.addClass("hoverRow");
		jrow.find("*").addClass("hoverRow");
	}
	else if (mode == "o") {
		jrow.removeClass("hoverRow");
		jrow.find("*").removeClass("hoverRow");
	}
}

function advPaneClickHist(evt) {
	// private 使用者選擇一歷程之事件
	var jdlg = evt.data["dlg"];
	jdlg.dialog("close");
	var ndx = evt.data["ndx"];

	var jbackup = $("input[type='hidden'][name='_advPaneBackup_']");
	var text = jbackup.val();
	var backupList = text ? JSON.parse(text) : [];
	// 拿掉跳過的歷程
	if (ndx < backupList.length - 1)
		backupList.splice(ndx + 1, backupList.length - ndx - 1);
	// 找回當初作業的 action
	var action = backupList[ndx]["action"];
	// 設定為預備回復狀態
	backupList[ndx]["restoring"] = true;
	jbackup.val(JSON.stringify(backupList));
	// 轉回指定的視窗
	advPaneRedirect(action, backupList[ndx]["keep"], "_advPaneGoBack_");
}

function advPaneSelHist() {
	// private 打開歷程選擇視窗並選擇直接跳入
	var text = $("input[type='hidden'][name='_advPaneBackup_']").val();
	if (!text)
		return;
	var backupList = JSON.parse(text);
	var jdlg = $("#_advHistDlg_");
	var jtbl = jdlg.find("table");
	jtbl.empty();
	for (var i = 0; i < backupList.length; i++) {
		var line = "<tr><td style='width: 100px;' nowrap align='center'>" + backupList[i]["action"] + "</td></tr>";
		var jrow = $(line);
		jrow.bind("click", { dlg: jdlg, ndx: i }, advPaneClickHist);
		jrow.bind("mouseenter", { row: jrow, mode: "i" }, advPaneHover);
		jrow.bind("mouseleave", { row: jrow, mode: "o" }, advPaneHover);
		jtbl.append(jrow);
	}
	jdlg.dialog("open");
}

function advPaneBindKey(doBind) {
	// public 將選擇歷程加入/移除 F11 事件
	if (doBind == "Y"){
		$(document).bind("keydown", function(event){
			if( event.keyCode == 122)
				advPaneSelHist();
		});
	}
		//$(document).bind("keydown", "ctrl+f11", advPaneSelHist);
	else
		$(document).unbind("keydown", "ctrl+f11");
}

function advPaneRedirect(action, request, localAction, localData) {
	// public 轉換至新作業
	// action 為啟動新作業的 url
	// request 為傳入新作業的內容
	// localAction 目前作業的 url（如果要保留未來用 advPaneGoBack 回復，才需傳此一參數）
	// localData 目前作業的回復資訊（如果要保留未來用 advPaneRestore 回復，才需傳此一參數）
	if (localAction && localData)
		// 有提供回復資訊，就先儲存
		advPaneBackup(localAction, localData);
	else if (localAction != "_advPaneGoBack_") {
		// 如果直接轉到新作業就把所有回復資訊都刪掉
		var jbackup = $("input[type='hidden'][name='_advPaneBackup_']");
		if (jbackup.length > 0)
			// 如果是 acis 的結構
			jbackup.val("");
		else if (top.frames["menu"])
			// 如果是 aerp 結構
			$("div[name='_advPaneBackup_']", top.frames['menu'].document).remove();
	}
	var jform = $("<form method='post' action='" + action + "'></form>");
	// for IE bug，form 一定要掛在元件上才能 submit
	$("body").append(jform);
	if (request) {
		$.each(request, function (key, value) {
			if (value && value instanceof Array) {
				// 如果內容為 array。參數最多支援一階 array，所以不需要額外用遞迴處理
				for (var i = 0; i < value.length; i++)
					jform.append("<input type='hidden' name='" + key + "[" + i + "]' value='" + value[i] + "' />");

			}
			else
				jform.append("<input type='hidden' name='" + key + "' value='" + value + "' />");
		});
	}
	var jbackup = $("input[type='hidden'][name='_advPaneBackup_']");
	if (jbackup.length > 0) {
		var jformBackup = $("<input type='hidden' name='_advPaneBackup_' />");
		jformBackup.val(jbackup.val());
		jform.append(jformBackup);
	}
	jform.submit();
}

function advPaneGoBack(chk) {
	// public 轉換回前一個作業
	// chk 為 true 表示僅檢查是否可以轉回前一個作業，並回傳前一個作業的名稱
	var action;
	var jbackup = $("input[type='hidden'][name='_advPaneBackup_']");
	if (jbackup.length > 0) {
		// 如果是採用 acis 結構
		var text = jbackup.val();
		var backupList = text ? JSON.parse(text) : [];
		if (backupList.length > 0) {
			var lastBackup = backupList[backupList.length - 1];
			if (chk) {
				// 本次已是待回復，所以要檢查是否還有再前一筆
				if (lastBackup["restoring"])
					lastBackup = backupList.length > 1 ? backupList[backupList.length - 2] : {};
				action = lastBackup["action"];
				return action;
			}
			// 如果前一次的內容沒有取走，就把所有資訊都刪掉
			if (lastBackup["restoring"]) {
				jbackup.val("");
			}
			// 找回當初作業的 action
			var action = lastBackup["action"];
			// 設定為預備回復狀態
			lastBackup["restoring"] = true;
			var text = JSON.stringify(backupList);
			jbackup.val(text);
			// 轉回原本的視窗
			advPaneRedirect(action, lastBackup["keep"], "_advPaneGoBack_");
		}
	}
	else if (top.frames["menu"]) {
		// 如果是採用 aerp 結構
		action = null;
		var jbody = $("body", top.frames['menu'].document);
		var jbackup = jbody.find("div[name='_advPaneBackup_']:last");
		if (jbackup.length == 0)
			return action;
		// 僅檢查，就直接回覆有原作業記錄存在
		if (chk) {
			// 本次已是待回復，所以要檢查是否還有再前一筆
			if (jbackup.attr("title") == "restoring") {
				jbackup = jbackup.prev();
				if (jbackup.length > 0 && jbackup[0].tagName == "DIV" && jbackup.attr("name") == "_advPaneBackup_")
					action = jbackup.find("div:eq(0)").text();
			}
			return action;
		}
		// 如果前一次的內容沒有取走，就把所有資訊都刪掉
		if (jbackup.attr("title") == "restoring") {
			jbody.find("div[name='_advPaneBackup_']").remove();
			jbackup = jbody.find("div[name='_advPaneBackup_']:last");
		}
		// 找回當初作業的 action
		var jaction = jbackup.find("div:eq(0)");
		var action = jaction.text();
		// 設定為預備回復狀態
		jbackup.attr("title", "restoring");
		// 轉回原本的視窗
		advPaneRedirect(action, null, "_advPaneGoBack_");
	}
}

function advPaneRestore(localAction) {
	// public 取回要回復作業的資訊
	// localAction 此作業的 url
	// return 回復作業用的資訊，或是 nul（沒有可回復的資訊時）
	var jbackup = $("input[type='hidden'][name='_advPaneBackup_']");
	if (jbackup.length > 0) {
		// 如果是採用 acis 結構
		var text = jbackup.val();
		var backupList = text ? JSON.parse(text) : [];
		if (backupList.length > 0 && backupList[backupList.length - 1]["restoring"]) {
			// 檢查 action 是否一致
			var lastBackup = backupList[backupList.length - 1];
			var action = lastBackup["action"];
			if (localAction == action) {
				// 取得回復資訊
				var data = lastBackup["keep"];
				// 刪除此一回復資訊
				backupList.splice(backupList.length - 1, 1);
				text = JSON.stringify(backupList);
				jbackup.val(text);
				return data;
			}
			// 內容不合，將所有資料刪除
			jbackup.val("");
		}
	}
	else if (top.frames["menu"]) {
		// 如果是採用 aerp 結構
		var jbody = $("body", top.frames['menu'].document);
		var jbackup = jbody.find("div[name='_advPaneBackup_']:last");
		// 確定是否有備份畫面，並確定是否要回復備份畫面
		if (jbackup.length > 0 && jbackup.attr("title") == "restoring") {
			// 檢查 action 是否一致
			var jaction = jbackup.find("div:eq(0)");
			var action = jaction.text();
			if (localAction == action) {
				// 取得回復資訊
				var jdata = jbackup.find("div:eq(1)");
				var jsonData = jdata.text();
				var data = eval("(" + jsonData + ")");
				// 刪除此一回復資訊
				jbackup.remove();
				return data;
			}
			// 內容不合，將所有資料刪除
			jbody.find("div[name='_advPaneBackup_']").remove();
		}
	}
	return null;
}

/*
function advPaneRedirect(action, request, localAction) {
	// public 轉換至新畫面
	// action 為啟動新畫面的 url
	// request 為傳入新畫面的內容
	// localAction 本身頁面的 url，如果有給值，表示要備份目前的畫面
	if (localAction)
		advPaneBackup(localAction, true);
	var jform = $("<form method='post' action='" + action + "'></form>");
	// for IE bug，form 一定要掛在元件上才能 submit
	$("body").append(jform);
	if (request) {
		$.each(request, function (key, value) {
			if (value && value instanceof Array) {
				// 如果內容為 array。參數最多支援一階 array，所以不需要額外用遞迴處理
				for (var i = 0; i < value.length; i++)
					jform.append("<input type='hidden' name='" + key + "[" + i + "]' value='" + value[i] + "' />");

			}
			else
				jform.append("<input type='hidden' name='" + key + "' value='" + value + "' />");
		});
	}
	jform.submit();
}

function advPaneRestore(chk) {
	// public 還原最後一次 advPaneBackup 的畫面
	// chk 為 true 時，僅檢查是否有 backup 的畫面。return: true 表示有 backup 畫面; false 表示沒有
	if (top.frames["menu"]) {
		// 如果是採用官帽的 frame set 結構
		var jbackup = $("div[name='_advPaneBackup_']:last", top.frames['menu'].document);
		if (jbackup.length == 0)
			return false;
		// 僅檢查，就直接回覆有備份畫面存在
		if (chk)
			return true;
		// 找回當初作業的 action
		var jaction = jbackup.find("div:first");
		if (jaction.attr("name") != "_advPaneBackupAction_")
			return false;
		var action = jaction.text();
		jaction.remove();
		// 設定為預備回復狀態
		jbackup.attr("title", "restoring");
		// 轉回原本的視窗
		advPaneRedirect(action);
	}
}

function advPaneBackup(localAction, noClone) {
	// public 將目前的畫面內容存入堆疊中
	if (top.frames["menu"]) {
		// 如果是採用官帽的 frame set 結構，備份畫面的點放在 menu frameset 中
		var jbody = $("body", top.frames['menu'].document);
		if (!jbody)
			return;
		jbody.append("<div name='_advPaneBackup_' style='display: none;'><div name='_advPaneBackupAction_'>" + localAction + "</div></div>");
		var jbackup = jbody.find("div[name='_advPaneBackup_']:last");
		var jmainChlds = $("#main").children();
		jmainChlds = jmainChlds.filter(function (ndx) { return jmainChlds[ndx].tagName != "SCRIPT"; });
		if (noClone)
			jbackup.append(jmainChlds);
		else {
			for (var i = 0; i < jmainChlds.length; i++)
				jbackup.append($(jmainChlds[i]).clone());
		}
	}
}
*/



function advPaneReset() {
	// public 將轉換作業資訊清除
	var jbackup = $("input[type='hidden'][name='_advPaneBackup_']");
	if (jbackup.length > 0) {  // acis 結構
		jbackup.val("");
	}
	if (top.frames["menu"]) {	// aerp 結構
		jbody.find("div[name='_advPaneBackup_']").remove();
	}
}

function advPaneRegister(root) {
	// public 啟動程序

	/*
	// 還原畫面
	if (top.frames["menu"]) {
		// 如果是採用官帽的 frame set 結構
		var jbackup = $("div[name='_advPaneBackup_']:last", top.frames['menu'].document);
		// 確定是否有備份畫面，並確定是否要回復備份畫面
		if (jbackup.length > 0 && jbackup.attr("title") == "restoring") {
			// 將主畫面中非 script 部份刪除
			var jmain = $("#main");
			var jmainChlds = jmain.children();
			for (var i = jmainChlds.length - 1; i >= 0; i--)
				if (jmainChlds[i].tagName != "SCRIPT")
					$(jmainChlds[i]).remove();
			// 將備份畫面放上主畫面
			var jallElem = jbackup.children();
			jmain.append(jallElem);
			// 移除備份畫面
			jbackup.remove();
			// for IE bug, 重新 bind 事件處理
			var evts = [ 'onclick', 'ondblclick', 'onblur', 'onchange', 'onfocus', 'onreset', 'onselect', 'onsubmit',
			             'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup',
			             'onkeydown', 'onkeypress', 'onkeyup',
			             'onabort', 'onerror', 'onload', 'onresize', 'onscroll', 'onunload'
			            ];
			var jelems = jmain.find("*");
			for (var i = 0; i < jelems.length; i++) {
				var jelem = $(jelems[i]);
				for (var j = 0; j < evts.length; j++) {
					var func = jelem.attr(evts[j]);
					if (func)
						jelem.attr(evts[j], func);
				}
			}

			// 重新呼叫
			advConfigRegister();
			if (window.advAjaxRegister)
				advAjaxRegister();
			if (window.advGridRegister)
				advGridRegister();
		}
		// 如果有備份畫面，且主畫面中有 restore 的按鈕，就把它改 display: inline
		if (advPaneRestore(true)) {
			jbutton = $("button[type='button'][name='restore']");
			jbutton.css("display", "inline");
			jbutton.click(function (evt) { advPaneRestore(); });
		}
	}
	*/
	// 如果有備份畫面，且主畫面中有 goback 的按鈕，就把它改 display: inline

	if (advPaneGoBack(true)) {
		jbutton = $("button[type='button'][name='goback'],button[type='button'].goback");
		jbutton.css("display", "inline");
		jbutton.unbind();
		jbutton.click(function (evt) { advPaneGoBack(); });
	}

	// root 一般狀況下不用傳值
	if (!root) {
		root = $(document);
		if (!advPaneMainPanes) {
			// 如果未知 main pane，則找尋
			advPaneMainPanes = [];
			$.each($("div[class='pane']"), function(key, pane) {
				if ($(pane).css("display") == "block")
					advPaneMainPanes.push(pane);
			});
			advPaneSetActive(advPaneMainPanes);
		}
		// 初始化
		advPaneList = {};

		// 歷程選單
		var jmain = root.find("#main");
		var jhistDlg = $("<div id='_advHistDlg_' title='選擇歷程'><table class='ctv'></table></div>");
		jmain.append(jhistDlg);
		//jhistDlg.dialog({ autoOpen: false, modal: true, width: 160, height: 200 });
		advPaneBindKey("Y");
	}
	// 找不到主視窗就結束啟動程序
	if (advPaneMainPanes.length == 0)
		return;

	$.each(root.find("input[type='text']"), function(key, field) {
		advPaneRegisterField($(field));
	});
	advPaneCheckContent();
}

