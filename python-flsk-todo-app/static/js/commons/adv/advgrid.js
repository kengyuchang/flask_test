/*
 * Advanced Configuration On Document for Grid 網格元件的處理程式庫
 * 版本: 0.4.11
 * 
 * 
 * 條件置於 HTML 中任何位置的 <div class="acod">{網格條件}</div> 之中
 *
 * grid:{cmd1};{cmd2};..;{cmdN};
 * 
 * cmd 可以為
 *   table(x) 必要，顯示資料的網格
 *   tmpl(x) 必要，顯示資料的樣本網格
 *   fixrow(x) 固定顯示列標題的網格
 *   desc(x) 說明，用於錯誤訊息
 *   fpg(x) 切到第一頁的元件
 *   ppg(x) 切到前一頁的元件
 *   spg(x) 直接選擇頁數的元件
 *   spgn(x) 直接選擇頁數的元件, 但是不會觸發換頁事件
 *   npg(x) 切到下一頁的元件
 *   lpg(x) 切到下一頁的元件
 *   pgcnt(x) 顯示總頁數的元件
 *   rowcnt(x) 顯示總筆數的元件
 *   qrycnt(x) 顯示查詢筆數的元件
 *   add(x) 新增資料的元件
 *   rst(x) 回覆目前頁面為原始資料的元件
 *   head(x) 標題列數，如果未指定則視樣版中的 tr 數。樣版中有兩個 tr 以上則 head 為 1 否則為 0
 *   pgrow(x) 每頁顯示的資料筆數，必需在 table 之後
 *   maxrow(x) 最大保存筆數，適用於被動 grid
 *   dblclick(func,arg) 雙擊事件，func 為呼叫函數名稱，arg 為傳入參數。函數格式為
 *     func(x, arg, data, col) x 為表格名稱, arg 為指定訊息，data 為雙擊所在列的資料內容，col 為所在列數(zero base)
 *     Note: 指定欄位的 dblclick 必需置於 <td> 之後，只針對此欄有雙擊功能
 *           指定整個 table 時，應置於 table 或 tmpl 的設定中，對於沒有指定欄位 dblclick 的其它欄位，才會執行
 *   sort 資料排序，需設定在樣版的標題 td 之後，表示可以用此欄位內容排序
 *   view(a,b,c) 設定顯示欄位為 a,b,c
 *   attr(x) 特定屬性 reqAll, fullPage
 *     reqAll 被動模式發送內容時，產生全部資料的 request，不考慮資料是否異動。只針對被動 grid
 *     fullPage 每次顯示時都會顯示一整頁
 *     hover 鼠標移到某一列上時，該列會變色
 *     select 單擊某列時，設定為選擇列
 *
 * to:{scenario1};{scenario2};...
 *   當傳送時，會傳送 table 中有異動的資料，必需在 table 之後，僅適用於被動 grid
 * fr:{scenario1};{scenario2};...
 *   fr(x) 當接收時，會將資料置於 table，必需在 table 之後，僅適用於被動 grid
 * bi:{scenario1};{scenario2};...
 *   等同於 to(x) + fr(x)
 * 在 tmpl 的欄位中亦可指定 bi，但僅提供設置屬性，scenario 無意義，設為 to,fr 也等效於 bi
 * 如: bi:x(value,read) 表示要傳送 value 及 readonly 屬性
 * 
 * mod:{scenario1};{scenario2};...
 * 	 檢查網格內容是否有異動，僅適用於被動 grid
 * 
 */

var advGridTable = {};
var advGridRequestScenario = {};
var advGridResponseScenario = {};
var advGridModScenario = {};
var advGridData = {};
/*
 * name 名稱
 * head 樣版中標題列數
 * content 樣版中資料內容列數
 * baseConf 欄位資料的列表
 * queryCount 查詢時的筆數
 * totalCount 資料總筆數
 * totalPage 資料總頁數
 * keepBegin 保存資料第一筆對應實際資料，以 page 為單位
 * keepPage 保存資料大小，以 page 為單位
 * keepCount 保存資料大小，以 row 為單位
 * newBegin 讀取後的保存資料第一筆對應實際資料，以 page 為單位
 * newPage 讀取後的保存資料大小，以 page 為單位
 * viewAt 顯示資料第一筆對應實際資料，以 page 為單位
 * showCol 檢視的欄位編號
 * showColNdx showCol 的 hash 格式
 * sortCols 可以排序的欄位
 * sortBy 目前排序欄位
 * build 載入完成後是否需要 build table
 * loading 正在載入資料
 */

function advGridGetNameSkipArray(name) {
	// private 取得沒有 [?] 的欄位名稱
	var p = name.indexOf('[');
	if (p > 0)
		name = name.substring(0, p);
	return name;
}

function advGridFindCol(jrow, name) {
	// prviate 在 row 中依 name 尋找 column
	var col = jrow.find("[name='" + name + "']");
	// 找不到再找 array[?];
	if (col.length == 0)
		col = jrow.find("[name^='" + name + "[']");
	// 找不到再依 id 找尋
	if (col.length == 0)
		col = jrow.find("#" + name);
	// 還沒有就沒辦法了
	if (col.length == 0)
		return null;
	return col;
}

function advGridGetTmplRow(grid, type) {
	// private 從 template 中取得 head 或 content
	// type 為 "head" 或 "content"
	//var row = null;
	var tmpl = $(grid["tmpl"]);
	if (type == "head" && grid["head"] > 0)
		row = tmpl.find("tr:lt(" + grid["head"] + ")");
	else if (type == "content") {
		var fr = grid["head"] - 1;
		row = fr >= 0 ? tmpl.find("tr:gt(" + fr + "):lt(" + grid["content"] + ")") : tmpl.find("tr.lt(" + grid["content"] + ")");
	}
	return row;
}

function advGridGetTableRow(grid, ndx) {
	// private 從 table 中取得 row
	var head = grid["head"];
	if (grid["fixrow"])
		head = 0;
	var content = grid["content"];
	var table = $(grid["table"]);
	var pos = ndx * content + head - 1;
	var row = pos >= 0 ? table.find("tr:gt(" + pos + "):lt(" + content + ")") : table.find("tr:lt(" + content + ")");
	return row;
}

function advGridGetDataRec(grid, ndx, org) {
	// private 從保存資料中取得一筆
	// org 為 true 時，強制取得原始資料
	var data = null;
	var keep = advGridData[grid["name"]];
	if (keep) {
		data = keep["new"][ndx];
		if (!data || org)
			data = keep["org"][ndx];
	}
	return data;
}

function advGridSetDataRec(grid, ndx, data, org) {
	// private 將資料存入保存區
	// org 為 true 時，強制存入原始資料
	var keep = advGridData[grid["name"]];
	if (keep) {
		if (org)
			keep["org"][ndx] = data;
		else {
			// 比較與原內容是否一致
			var mod = false;
			var orgdata = keep["org"][ndx];
			if (orgdata) {
				$.each(orgdata, function(key, value) {
					if (!mod && (data[key] != value))
						mod = true;
				});
			}
			// 如果原內容一致，就刪掉新內容；否則將新內容保存起來
			if (mod || !orgdata)
				keep["new"][ndx] = data;
			else
				delete keep["new"][ndx];
		}
	}
	return data;
}

function advGridDblClickCol(evt) {
	// private 雙擊 row 或 column 時觸發事件
	var evtdata = evt["data"];
	var grid = advGridTable[evtdata["name"]];
	var func = evtdata["func"];
	var arg = evtdata["arg"];
	var col = evtdata["col"];
	var ndx = evtdata["ndx"];
	var data = advGridGetDataRec(grid, ndx);
	// 複製一份，以免 event trigger 改到資料內容
	data = $.extend({}, data);
	// 呼叫使用者定義的 function
	var cmd = func + "('" + grid["name"] + "', '" + arg + "', data, '" + col + "');";
	eval(cmd);
}

function advGridBindCellDblClick(grid, jrow, jrowTmpl, ndx) {
	// private 在樣版中指定了 dblclick 事件，或 grid 中指定 dblclick 時，處理 bind event
	var jcols = jrow.find("td");
	var jcolsTmpl = jrowTmpl.find("td");
	for (var i = 0; i < jcolsTmpl.length; i++) {
		var jcol = $(jcols[i]);
		var jcolTmpl = $(jcolsTmpl[i]);
		// 如果 td 有定 id 則以 id 為主，沒定就用 column index
		var id = jcol.attr("id");
		if (!id)
			id = i;
		var jelem = jcolTmpl.find("div[class='acod']");
		var bindCol = false;
		if (jelem.length > 0) {
			var condList = jelem.text().split(/\s+/);
			for (var j = 0; j < condList.length; j++) {
				var dirCmd = condList[j].match(/(\w+):(.+)/);
				if (dirCmd) {
					var dir = dirCmd[1];
					var cmd = dirCmd[2];
					if (dir == "grid") {
						// 找到陣列定義內容
						var cmdList = cmd.split(/;/);
						for (var k = 0; k < cmdList.length; k++) {
							var headArgs = cmdList[k].match(/(\w+)(\(([#!\/\w,]+)\))?/);
							if (headArgs) {
								var head = headArgs[1];
								var args = headArgs[3];
								if (head == "dblclick") {
									var argList = args.split(/,/);
									var data = {};
									data["name"] = grid["name"];
									data["func"] = argList[0];
									data["arg"] = argList[1];
									data["col"] = id;
									data["ndx"] = ndx;
									// bind column
									jcol.bind("dblclick", data, advGridDblClickCol);
									bindCol = true;
								}
							}
						}
					}
				}
			}
		}
		if (!bindCol && grid["dblclick"]) {
			// 如果沒有針對 column 的設定，就設 table 的
			var data = {};
			data["name"] = grid["name"];
			data["func"] = grid["dblclick"][0];
			data["arg"] = grid["dblclick"][1];
			data["col"] = id;
			data["ndx"] = ndx;
			jcol.bind("dblclick", data, advGridDblClickCol);
		}
	}
}

function advGridHoverRow(evt) {
	// private 鼠標移進或移出 row 的觸發
	//var grid = evt.data["grid"];
	var mode = evt.data["mode"];
	var jrow = $(evt.target);
	while (jrow.length > 0 && jrow[0].tagName != "TR")
		jrow = jrow.parent();
	if (mode == "i") {
		jrow.addClass("hoverRow");
		jrow.find("*").addClass("hoverRow");
	}
	else if (mode == "o") {
		jrow.removeClass("hoverRow");
		jrow.find("*").removeClass("hoverRow");
	}
}

function advGridBindRowHover(grid, jrow) {
	// private 在 row 上加入鼠標移入及移出事件
	jrow.bind("mouseenter", { "grid": grid, "mode": "i" } , advGridHoverRow);
	jrow.bind("mouseleave", { "grid": grid, "mode": "o" } , advGridHoverRow);
}

function advGridSelectRow(evt) {
	// private 鼠標點選 row 時觸發
	var grid = evt.data["grid"];
	var jrow = $(evt.target);
	while (jrow.length > 0 && jrow[0].tagName != "TR")
		jrow = jrow.parent();
	jrow.parent().parent().find("*").removeClass("selectedRow");
	jrow.addClass("selectedRow");
	jrow.find("*").addClass("selectedRow");
	// 在 ie 上很神奇，設個 class 居然欄位就變大了，只好再補設大小
	advGridBuildTableFixColWidth(grid, true, true);
}

function advGridBindRowSelect(grid, jrow) {
	// private 在 row 上加入鼠標選擇事件
	jrow.bind("click", { "grid": grid } , advGridSelectRow);
}


function advGridSortEvent(evt) {
	// private 當操作者執行欄位排序時呼叫此函數
	var evtdata = evt["data"];
	var grid = evtdata["grid"];
	var name = evtdata["name"];
	var totalCount = grid["totalCount"];
	// 將畫面資料取回
	advGridTakeTable(grid);
	// 準備資料
	var data = new Array(totalCount);
	for (var i = 0; i < totalCount; i++)
		data[i] = advGridGetDataRec(grid, i);
	// 決定昇降序
	var order = "a";
	if (grid["sortBy"] && grid["sortBy"].substring(1) == name)
		order = grid["sortBy"].substring(0, 1) == "a" ? "d" : "a";
	grid["sortBy"] = order + name;
	// 排序
	data.sort(function (a, b) {
		if (a[name] < b[name])
			return order == "a" ? -1 : 1;
		if (a[name] > b[name])
			return order == "a" ? 1 : -1;
		return 0;
	});
	// 寫回
	for (var i = 0; i < totalCount; i++)
		advGridSetDataRec(grid, i, data[i]);
	// 重建 table
	advGridBuildTable(grid);
}

function advGridBuildTableShowCol(grid, jrow) {
	// private 有指定顯示欄位時，就隱藏不顯示欄位
	var colsNdx = grid["showColNdx"];
	if (colsNdx) {
		var colList = jrow.find("td,th");
		colList.css("display", "none");
		for (var i = 0; i < colList.length; i++)
			if (colsNdx[i])
				$(colList[i]).css("display", "inline");
	}
}

function advGridBuildTableFixColWidth(grid, force, setColWidth) {
	// private 設定 fixrow 的欄位寬度
	if (!grid["fixrow"])
		return;
	var jfixrow = $(grid["fixrow"]);
	var jtable = $(grid["table"]);
	// 只有第一個 row 加進來時要設
	if (jtable.find("tr").length > 1 && !force)
		return;
	// 設定外框 div 的大小
	jfixrow.parent().width(jtable.parent().width() - 16);
	// 設定 table 的大小
	jfixrow.width(jtable[0].scrollWidth);
	var jfirstRow = jtable.find("tr:first");
	// 設定欄位的大小
	if (jfirstRow.length > 0 && setColWidth) {
		var jfixColList = jfixrow.find("td,th");
		var jcolList = jfirstRow.find("td,th");
		for (var i = 0; i < jcolList.length && i < jfixColList.length; i++) {
			var jcol = $(jcolList[i]);
			var jfixCol = $(jfixColList[i]);
			jfixCol.width(jcol.width());
		}
	}
}

function advGridBuildTableCol(grid, jrow, key, data, ndx) {
	// private 在建立 table 時，將資料填入欄位
	// 找尋欄位
	var jcol = advGridFindCol(jrow, key);
	if (!jcol)
		return;
	// 看找到什麼元件，再決定怎麼設值
	var tag = jcol[0].tagName;
	if (tag == "DIV" || tag == "SPAN" || tag == "TD" || tag == "LABEL") {
		var value = data[key];
		if (jcol.hasClass("acodConfigCm3"))
			value = advConfigTransCm3(value);
		else if (jcol.hasClass("acodConfigDeclno"))
			value = advConfigTransDeclno(value);
		else if (jcol.hasClass("acodConfigFeememono"))
			value = advConfigTransFeememono(value);
		jcol.text(value);
	}
	else {
		// 如果遇到 radio 元件, 必需先改名稱
		if (tag == "INPUT" && jcol.attr("type") && jcol.attr("type").toLowerCase() == "radio")
			jcol.attr("name", jcol.attr("name") + "[" + ndx + "]");
		var list = grid["baseConf"]["*"][key];
		advAjaxSetResponseField(data, list[0], jcol, list);
	}
}

function advGridBuildTableRow(grid, jrow, data, ndx, jrowTmpl) {
	// private 在建立 table 時，將資料填入列
	advGridBuildTableShowCol(grid, jrow);
	// 進階設定項目
	advConfigRegister(jrow);
	if ((jrowTmpl && jrowTmpl.find("div[class='acod']")).length > 0 || grid["dblclick"]) {
		// 在 table 或是 column 中是否有指定雙擊事件
		advGridBindCellDblClick(grid, jrow, jrowTmpl, ndx);
	}
	// 加入鼠標游移列效果
	if (grid["attr"]["hover"])
		advGridBindRowHover(grid, jrow);
	// 加入鼠標選擇列效果
	if (grid["attr"]["select"])
		advGridBindRowSelect(grid, jrow);
	// 填入序號
	advGridBuildTableCol(grid, jrow, "seq", { "seq": ndx + 1 }, ndx);
	// 填入內容
	if (data) {
		$.each(grid["baseConf"]["*"], function (key, value) {
			advGridBuildTableCol(grid, jrow, key, data, ndx);
		});
	}
}

function advGridBuildTable(grid) {
	// private 建立 table 內容
	var jfixrow = $(grid["fixrow"]);
	var jtable = $(grid["table"]);
	// 清除 table
	if (jfixrow.length > 0)
		jfixrow.empty();
	jtable.empty();
	// 將 template 的標題列轉入 table
	if (grid["head"] > 0) {
		var jhead = advGridGetTmplRow(grid, "head").clone();
		advGridBuildTableShowCol(grid, jhead);
		// 如果設定可排序欄位，就結合 dblclick 事件
		var sortColNdx = grid["sortCols"]; 
		if (sortColNdx) {
			var jcolList = jhead.find("td,th");
			for (var i = 0; i < jcolList.length; i++) {
				if (!sortColNdx[i])
					continue;
				var data = {};
				data["colAt"] = i;
				data["name"] = advGridGetNameSkipArray(sortColNdx[i]);
				data["grid"] = grid;
				$(jcolList[i]).bind("dblclick", data, advGridSortEvent);
			}
		}
		// 如果有獨立的 fixrow，則標題顯示在 fixrow 上
		if (jfixrow.length > 0)
			jfixrow.append(jhead);
		else
			jtable.append(jhead);
		advGridBuildTableFixColWidth(grid);
	}
	// 轉入資料
	var pgrow = grid["pgrow"];
	var begin = grid["viewAt"] * pgrow;
	var rowTmpl = advGridGetTmplRow(grid, "content");
	for (var i = 0; i < pgrow; i++) {
		var data = advGridGetDataRec(grid, begin + i);
		if (!data)
			break;
		var row = rowTmpl.clone();
		advGridBuildTableRow(grid, row, data, begin + i, rowTmpl);
		// 附加到 table
		jtable.append(row);
		advGridBuildTableFixColWidth(grid);
	}
}

function advGridTakeTableCol(grid, jrow, key, data, chkMod) {
	// private 在取得 table 內容時，將資料從元件中取出
	// chkMod 為 true 時，僅比較 data 內容與畫面欄位是否一致
	// return true 表示資料有異動
	var colsNdx = grid["showColNdx"];
	if (colsNdx && !colsNdx[key])
		return;
	var mod = false;
	// 找尋欄位
	var jcol = advGridFindCol(jrow, key);
	if (!jcol)
		return;
	// 看找到什麼元件，再決定怎麼設值
	//var tag = jcol[0].tagName;
	var list = grid["baseConf"]["*"][key];
	if (chkMod) {
		// 僅檢查是否異動
		var ndata = {};
		advAjaxGetRequestField(ndata, list[0], jcol, list);
		$.each(ndata, function(key, value) {
			if (!mod) {
				mod = (!data && value) || (data && data[key] != value);
			}
		});
	}
	else
		advAjaxGetRequestField(data, list[0], jcol, list);
	return mod;
}

function advGridTakeTableRow(grid, jrow, data, chkMod) {
	// private 在取得 table 內容時，將資料從元件中取出
	// chkMod 為 true 時，僅比較 data 內容與畫面欄位是否一致
	var mod = false;
	$.each(grid["baseConf"]["*"], function (key, col) {
		if (!chkMod || !mod)
			if (advGridTakeTableCol(grid, jrow, key, data, chkMod))
				mod = true;
	});
	return mod;
}

function advGridTakeTable(grid, chkMod) {
	// private 從 table 取得內容
	// chkMod 為 true 時，僅比較 data 內容與畫面欄位是否一致
	var pgrow = grid["pgrow"];
	// 從 table 轉出資料
	var begin = grid["viewAt"] * pgrow;
	var totalCount = grid["totalCount"];
	var fullPage = grid["attr"]["fullPage"];
	var mod = false;
	for (var i = 0; i < pgrow && (fullPage || begin + i < totalCount) && (!chkMod || !mod); i++) {
		var row = advGridGetTableRow(grid, i);
		// 先比對舊資料
		//var data = advGridGetDataRec(grid, begin + i, true);
		// Bernie 2012/11/30 百思不解為什麼這兒要比對舊的, 所以先改新的試試
		var data = advGridGetDataRec(grid, begin + i);
		if (advGridTakeTableRow(grid, row, data, true)) {
			// 有異動
			mod = true;
			if (!chkMod) {
				// 取得新內容存入
				data = {};
				advGridTakeTableRow(grid, row, data);
				advGridSetDataRec(grid, begin + i, data);
				// 如果在 totalCount 的後面，要加 totalCount
				if (totalCount <= begin + i)
					totalCount = grid["totalCount"] = begin + i + 1;
			}
		}
	}
	return mod;
}

function advGridGetRequestRow(request, data, colsNdx, cnameLead, ndx) {
	// private 將保存資料整理為 reuqest 格式
	$.each(data, function (key, value) {
		if (!colsNdx || colsNdx[key]) {
			// 要放到 request 的，要用 array
			var cname = cnameLead + key.substring(0, 1).toUpperCase() + key.substring(1) + "[" + ndx + "]";
			request[cname] = value;
		}
	});
}

function advGridFillFullPage(grid, force) {
	// private 如果 grid 有設 fullPage 就將資料補滿
	if (grid["attr"]["fullPage"]) {
		var pgrow = grid["pgrow"];
		var fill = pgrow - (grid["totalCount"] % pgrow);
		if (grid["totalCount"] > 0 && fill == pgrow && !force)
			return;
		var row = advGridGetTmplRow(grid, "content");
		for (var i = 0; i < fill; i++) {
			var data = {};
			advGridTakeTableRow(grid, row, data);
			advGridSetDataRec(grid, grid["totalCount"] + i, data);
			grid["keepCount"]++;
		}
	}
}

function advGridSetSelectPage(grid) {
	// private 如果 spg 元件是 select，依所有頁數設定 select list
	var totalPage = grid["totalPage"];
	// 沒內容就顯示一頁
	if (totalPage == 0)
		totalPage = 1;
	var list = grid["spgl"];
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var elem = $(list[i]);
			var tag = elem[0].tagName;
			if (tag != "SELECT")
				continue;
			elem.empty();
			for (var p = 1; p <= totalPage; p++)
				elem.append("<option value='" + p + "'>" + p + "</option>");
		}
	}
}

function advGridShowTotal(grid, func) {
	// private 設定總頁數至 pgcnt，或是 rowcnt, 或是 qrycnt
	// func 為 "pgcnt", "rowcnt", 或 "qrycnt"
	var total;
	if (func == "pgcnt")
		total = grid["totalPage"] == 0 ? 1 : grid["totalPage"];
	else if (func == "rowcnt")
		total = grid["totalCount"];
	else if (func == "qrycnt")
		total = grid["queryCount"];
	else
		return;
	var list = grid[func];
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var elem = $(list[i]);
			var tag = elem[0].tagName;
			if (tag == "INPUT") {
				var type = $elem.attr("type").toLowerCase();
				if (type == "text" || type == "password" || type == "hidden")
					elem.val(total);
			}
			else if (tag == "TEXTAREA")
				elem.val(total);
			else if (tag == "DIV" || tag == "SPAN" || tag == "LABEL")
				elem.text(total);
		}
	}
}

function advGridShowViewAt(grid, pageNo) {
	// private 顯示目前所在頁數
	var list = grid["spgl"];
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var elem = $(list[i]);
			if (elem.length == 0)
				continue;
			var tag = elem[0].tagName;
			if (tag == "SELECT" || tag == "INPUT")
				elem.val(pageNo + 1);
			else if (tag == "DIV" || tag == "SPAN" || tag == "LABEL")
				elem.text(pageNo + 1);
		}
	}
}

function advGridPageEvent(evt) {
	// private 頁面切換事件 
	var func = evt.data["func"];
	var grid = evt.data["grid"];
	// 避免在載入資料時處理
	var pg = null;
	if (func == "spg")
		pg = parseInt($(evt.target).val(), 10);
	advGridEventFunc(grid["name"], func, pg);
}

function advGridScrollEvent(evt) {
	var grid = evt.data;
	var jtable = $(grid["table"]);
	var jfixrow = $(grid["fixrow"]);
	var x = jtable.parent().scrollLeft();
	jfixrow.parent().scrollLeft(x);
}

function advGridProcessData(grid, response) {
	// private 處理從 ap server 收到的資料
	var name = grid["name"];
	var count = response[name + "Count"];
	var totalCount = response[name + "Total"];
	var pgrow = grid["pgrow"];
	// 如果查詢筆數改變，則重新顯示
	if (grid["queryCount"] != totalCount) {
		grid["queryCount"] = totalCount;
		advGridShowTotal(grid, "qrycnt");
	}
	// 如果總筆數改變，則重新顯示
	if (grid["totalCount"] != totalCount) {
		grid["totalCount"] = totalCount;
		advGridShowTotal(grid, "rowcnt");
	} 
	var totalPage = parseInt((grid["totalCount"] + pgrow - 1) / pgrow);
	// 如果總頁數改變，則重新顯示
	if (grid["totalPage"] != totalPage) {
		grid["totalPage"] = totalPage;
		advGridSetSelectPage(grid);
		advGridShowTotal(grid, "pgcnt");
	}
	// 整理要顯示的欄位名稱
	if (response[name + "View"])
		advGridParseShowCol(grid, response[name + "View"]);
	var keep;
	advGridData[name]["new"] = {};
	advGridData[name]["org"] = {};
	keep = advGridData[name]["org"];
	// 將資料存回保存區
	var beginRow = grid["newBegin"] * pgrow;
	var cnameLead = name + "Col";
	$.each(response, function (key, data) {
		if (key.length > cnameLead.length && key.substring(0, cnameLead.length) == cnameLead) {
			var cname = key.substring(cnameLead.length);
			cname = cname.substring(0, 1).toLowerCase() + cname.substring(1);
			for (var i = 0; i < count; i++) {
				if (!keep[beginRow + i])
					keep[beginRow + i] = {};
				keep[beginRow + i][cname] = data[i] != null ? data[i] : "";
			}
		}
	});
	advGridFillFullPage(grid);
	grid["newPage"] = parseInt((count + pgrow - 1) / pgrow);
	grid["keepBegin"] = grid["newBegin"];
	grid["keepPage"] = grid["newPage"];
	if (grid["attr"]["fullPage"]) {
		if (grid["keepPage"] == 0)
			grid["keepPage"] = 1;
		grid["keepCount"] = grid["keepPage"] * pgrow;
	}
	else
		grid["keepCount"] = count;
}

function advGridLoadData(grid) {
	// private 讀取 grid data
	if (!grid["valid"])
		return;
	var pgrow = grid["pgrow"];
	var begin, count;
	if (grid["newBegin"] < grid["keepBegin"]) {
		// 讀取資料在前面
		begin = grid["newBegin"];
		count = grid["keepBegin"] - grid["newBegin"];
		if (count > grid["newPage"])
			count = grid["newPage"];
	}
	else {
		// 讀取資料在後面
		begin = grid["keepBegin"] + grid["keepPage"];
		if (begin < grid["newBegin"]) {
			begin = grid["newBegin"];
			count = grid["newPage"];
		}
		else
			count = grid["newPage"] - (begin - grid["newBegin"]);
	}
	var request = {};
	request[grid["name"] + "Type"] = "load";
	request[grid["name"] + "Begin"] = begin;
	request[grid["name"] + "Count"] = count * pgrow;
	grid["loading"] = true;
	$.post(grid["act"], request, function (response, status) {
		if (status == "success") {
			advGridProcessData(grid, response["jsonModel"]);
			// 如果需要就建立 table
			if (grid["build"])
				advGridBuildTable(grid);
			grid["build"] = false;
		}
		grid["loading"] = false;
	}, "json");
}

function advGridParseShowCol(grid, view) {
	// private 指定顯示欄位
	var colList = view ? view.split(/,/) : null;
	var colsNdx = colList ? {} : null;
	if (colList)
		for (var i = 0; i < colList.length; i++) {
			var colName = advGridGetNameSkipArray(colList[i]);
			colsNdx[colName] = i + 1;
		}
	grid["showCol"] = colList;
	grid["showColNdx"] = colsNdx;
}

function advGridRegisterItem(jdiv, head, args) {
	// private 註冊單一 grid 元件
	var field = jdiv.prev()[0];
	var tag = field.tagName;
	var type = tag == "INPUT" ? field.attr("type") : null;
	if (((head == "table" || head == "tmpl" || head == "fixrow") && tag == "TABLE") ||
		((head == "spg" || head == "spgn") && (tag == "SELECT" || tag == "INPUT" || tag == "DIV" || tag == "SPAN" || tag == "LABEL")) ||
		((head == "fpg" || head == "ppg" || head == "npg" || head == "lpg" || head == "add" || head == "rst") && (tag == "IMG" || tag == "BUTTON")) ||
		((head == "rowcnt" || head == "qrycnt" || head == "pgcnt") && (tag == "DIV" || tag == "SPAN" || (tag == "INPUT" && type == "text") || tag == "LABEL"))) {
		if (!advGridTable[args])
			advGridTable[args] = {};
		if (head == "table" || head == "tmpl" || head == "fixrow")
			// table, tmpl, fixrow 只能為單筆
			advGridTable[args][head] = field;
		else {
			// 其它可以為多筆
			if (!advGridTable[args][head])
				advGridTable[args][head] = [];
			advGridTable[args][head].push(field);
			if (head == "spg" || head == "spgn") {
				if (!advGridTable[args]["spgl"])
					advGridTable[args]["spgl"] = [];
				advGridTable[args]["spgl"].push(field);
			}
		}
	}
}

function advGridRegisterBind(grid, func, list) {
	// private 將網格附屬元件 bind 事件
	if (!list)
		return;
	for (var i = 0; i < list.length; i++) {
		var elem = $(list[i]);
		if (func == "fpg" || func == "ppg" || func == "npg" || func == "lpg" || func == "add" || func == "rst")
			elem.bind("click", { "grid": grid, "func": func }, advGridPageEvent);
		if (func == "spg")
			elem.bind("change", { "grid": grid, "func": func }, advGridPageEvent);
	}
}

function advGridRegisterBaseConf(grid) {
	// private 將 grid 樣版中欄位有個別指定 to, fr, bi 者，分解出待傳屬性
	jtmpl = $(grid["tmpl"]);
	var baseConf = grid["baseConf"] = {};
	$.each(jtmpl.find("input,select,textarea,label,textfield"), function (key, field) {
		var jfield = $(field);
		if (jfield.attr("name")) {
			var name = advGridGetNameSkipArray(jfield.attr("name"));
			advAjaxRegisterField(jfield, name, baseConf, null, "*");
		}
		if (jfield.attr("id")) {
			var name = advGridGetNameSkipArray(jfield.attr("id"));
			advAjaxRegisterField(jfield, name, baseConf, null, "*");
		}
	});
}

function advGridRegisterColsSort(grid) {
	// private 將 grid 樣版中欄位有個別指定 grid:sort 者，分解出待傳屬性
	jrowTmpl = advGridGetTmplRow(grid, "content");
	grid["sortCols"] = {};
	grid["sortBy"] = null;
	$.each(jtmpl.find("div,label,input,select,textarea"), function (key, field) {
		var jfield = $(field);
		var nextElem = jfield.next();
		if (nextElem.length > 0 && nextElem[0].tagName == "DIV" && nextElem.hasClass("acod")) {
			var wholeCond = nextElem.text().split(/\s+/);
			for (var i = 0; i < wholeCond.length; i++) {
				// 分解出一段條件
				var singleCond = wholeCond[i];
				if (singleCond.length == 0)
					continue;
				var cond = singleCond.match(/(\w+):(.*)/);
				if (cond) {
					var dir = cond[1];
					var cmd = cond[2];
					if (dir == "grid") {
						var cmdList = cmd.split(/;/);
						for (var j = 0; j < cmdList.length; j++) {
							if (cmdList[j] == "sort") {
								var name = jfield.attr("name");
								// 找出來 jfield 是在第幾個欄位
								var colAt = -1;
								// 先找到 parent td
								var parent = jfield.parent();
								while (parent.length > 0 && parent[0].tagName != 'TD')
									parent = parent.next();
								// 再往前找到沒有更多的 td 為止
								for (var prior = parent; prior.length > 0; prior = prior.prev())
									if (prior[0].tagName == 'TD')
										colAt++;
								if (name && colAt >= 0)
									grid["sortCols"][colAt] = name;
							}
						}
					}
				}
			}
		}
	});
}


function advGridSyncRequest(scenario, data) {
	// protected 僅提供 advajax 呼叫，當送出 request 至 ap server 時，一併送出 grid
	if (advGridRequestScenario[scenario]) {
		$.each(advGridRequestScenario[scenario], function (name, grid) {
			if (grid && grid["valid"]) {
				// 先把目前畫面上內容的取出
				advGridTakeTable(grid);
				advGridGetRequest(name, data);
			}
		});
	}
}

function advGridSyncResponse(scenario, data) {
	// protected 僅提供 advajax 呼叫，當收到 ap server 回應時，將資料置於 grid 中
	if (advGridResponseScenario[scenario]) {
		$.each(advGridResponseScenario[scenario], function (name, grid) {
			if (grid && grid["valid"]) {
				grid["newBegin"] = data[name + "Begin"];
				advGridProcessData(grid, data);
				if (grid["viewAt"] == grid["newBegin"])
					advGridBuildTable(grid);
				else {
					if (grid["totalPage"] > 0)
						advGridChangePage(grid["name"], grid["newBegin"]);
					else
						advGridBuildTable(grid);
				}
			}
		});
	}
}

function advGridModReset(scenario) {
	// protected 僅提供 advconfig 呼叫，重置網格內容異動部份
	if (advGridModScenario[scenario]) {
		$.each(advGridModScenario[scenario], function (name, grid) {
			// 處理屬於這個劇本的所有 grid
			if (grid && grid["valid"]) {
				advGridTakeTable(grid);
				var pgrow = grid["pgrow"];
				var begin = grid["keepBegin"] * pgrow;
				var count = grid["keepCount"];
				var data = advGridData[grid["name"]];
				// 重建整個 mod
				var modData = data["mod"] = {};
				for (var i = 0; i < count; i++) {
					// 重製資料副本
					modData[begin + i] = $.extend({}, advGridGetDataRec(grid, begin + i));
				}
			}
		});
	}
}

function advGridModCheck(scenario) {
	// protected 僅提供 advconfig 呼叫，如果網格內容有異動，則傳回有異動的網格 desc，否則就傳回 null
	var modDesc = [];
	if (advGridModScenario[scenario]) {
		$.each(advGridModScenario[scenario], function (name, grid) {
			// 處理屬於這個劇本的所有 grid
			if (grid && grid["valid"]) {
				advGridTakeTable(grid);
				var pgrow = grid["pgrow"];
				var begin = grid["keepBegin"] * pgrow;
				var count = grid["keepCount"];
				var modData = advGridData[grid["name"]]["mod"];
				var mod = false;
				for (var i = 0; i < count && !mod; i++) {
					// 依序比較每一筆內容
					var data = advGridGetDataRec(grid, begin + i);
					if (!mod && !modData[begin + i])
						mod = true;
					if (!mod) {
						$.each(modData[begin + i], function (key, value) {
							if (!mod && data[key] != value)
								mod = true;
						});
					}
				}
				// 如果有異動，就加入網格說明
				if (mod)
					modDesc.push(grid["desc"]);
			}
		});
	}
	if (modDesc.length == 0)
		return null;
	return modDesc;
}


function advGridEventFunc(name, func, pg) {
	// public 按鈕處理程序
	// name 網格名稱
	// func 功能名稱
	// pg 跳至頁數 (1..n)
	var grid = advGridTable[name];
	if (!grid)
		return;
	if (func == "fpg") {
		if (grid["viewAt"] > 0) {
			advGridTakeTable(grid);
			advConfigShowErrorMessage(null);
			advGridChangePage(grid["name"], 0);
		}
	}
	else if (func == "ppg") {
		if (grid["viewAt"] > 0) {
			advGridTakeTable(grid);
			advConfigShowErrorMessage(null);
			advGridChangePage(grid["name"], grid["viewAt"] - 1);
		}
	}
	else if (func == "spg") {
		if (!isNaN(pg) && pg >= 1 && pg <= grid["totalPage"] && pg != grid["viewAt"] + 1) {
			advGridTakeTable(grid);
			advConfigShowErrorMessage(null);
			advGridChangePage(grid["name"], pg - 1);
		}
	}
	else if (func == "npg") {
		if (grid["viewAt"] < grid["totalPage"] - 1) {
			advGridTakeTable(grid);
			advConfigShowErrorMessage(null);
			advGridChangePage(grid["name"], grid["viewAt"] + 1);
		}
	}
	else if (func == "lpg") {
		if (grid["viewAt"] < grid["totalPage"] - 1) {
			advGridTakeTable(grid);
			advConfigShowErrorMessage(null);
			advGridChangePage(grid["name"], grid["totalPage"] - 1);
		}
	}
	else if (func == "add") {
		err = advGridAddRow(grid["name"]);
		if (err)
			advConfigShowErrorMessage(err);
		else {
			advConfigShowErrorMessage("網格[" + grid["desc"] + "]新增資料列");
			advConfigShowErrorMessage(null);
		}
	}
	else if (func == "rst") {
	}
	
}

function advGridGetProp(name, prop) {
	// public 取得網格的屬性
	// prop 可以為
	//   queryCount 查詢時的筆數
	//   totalCount 目前的筆數
	//   totalPage 目前的頁數
	//   viewAt 目前正在查詢的頁數
	var grid = advGridTable[name];
	if (!grid)
		return;
	if (prop in { "queryCount":"", "totalCount":"", "totalPage":"", "viewAt":"" })
		return grid[pop];
}

function advGridGetRec(name, ndx) {
	// public 取得網格資料內容
	var grid = advGridTable[name];
	if (!grid)
		return;
	return $.extend({}, advGridGetDataRec(grid, ndx));
}

function advGridSetRec(name, ndx, data) {
	// public 設定網格資料內容
	var grid = advGridTable[name];
	if (!grid)
		return;
	advGridSetDataRec(grid, ndx, data);
}

function advGridFixedRowResize(name) {
	// public 網格的固定標題列重整大小
	// name 網格名稱
	var grid = advGridTable[name];
	if (!grid || !grid["valid"])
		return;
	advGridBuildTableFixColWidth(grid, true);
}

function advGridRefresh(name) {
	// public 重建網格中的內容
	// name 網格名稱
	var grid = advGridTable[name];
	if (!grid || !grid["valid"])
		return;
	if (grid["attr"]["fullPage"]) {
		// 建立一整頁
		advGridFillFullPage(grid, true);
		advGridBuildTable(grid);
	}
	advGridSetSelectPage(grid);
	advGridShowViewAt(grid, grid["viewAt"]);
	advGridShowTotal(grid, "rowcnt");
	advGridShowTotal(grid, "qrycnt");
	advGridBuildTable(grid);
}

function advGridGetSelectedIndex(name) {
	// public 取得網格目前選定的列數 0-base
	// name 網格名稱
	// return -1 表示目前沒有選定的資料列
	var grid = advGridTable[name];
	if (!grid || !grid["valid"])
		return;
	var jrowList = $(grid["table"]).find("tr");
	var i;
	for (i = jrowList.length - 1; i >= 0; i--)
		if ($(jrowList[i]).hasClass("selectedRow"))
			break;
	return i;
}

function advGridEmpty(name) {
	// public 清除網格中的內容
	// name 網格名稱
	var grid = advGridTable[name];
	if (!grid || !grid["valid"])
		return;
	grid["viewAt"] = 0;
	grid["totalPage"] = 0;
	grid["keepPage"] = 0;
	grid["keepCount"] = 0;
	grid["totalCount"] = 0;
	advGridData[name]["new"] = {};
	advGridData[name]["org"] = {};
	if (grid["attr"]["fullPage"]) {
		// 建立一整頁
		advGridFillFullPage(grid, true);
		advGridBuildTable(grid);
		grid["totalCount"] += grid["pgrow"];
	}
	advGridSetSelectPage(grid);
	advGridShowViewAt(grid, grid["viewAt"]);
	advGridShowTotal(grid, "rowcnt");
	advGridShowTotal(grid, "qrycnt");
	advGridBuildTable(grid);
}

function advGridAddRow(name, rowData) {
	// public 在網格中加入一筆資料
	// name 網格名稱
	// rowData 為新增資料內容，如果沒傳入值，則以樣版內容代規
	// return null 表示成功，否則為錯誤訊息
	var grid = advGridTable[name];
	var desc = grid["desc"];
	if (!grid || !grid["valid"])
		return "網格[" + desc + "]不存在";
	if (grid["loading"])
		return "網格[" + desc + "]正在與伺服機交換資料";
	if (grid["viewAt"] + 1 < grid["totalPage"])
		return "網格[" + desc + "]需停留在最後一頁，才能新增資料";
	var table = $(grid["table"]);
	var rowCnt = parseInt((table.find("tr").length - grid["head"]) / grid["content"]);
	if (isNaN(rowCnt))
		rowCnt = 0;
	if (grid["maxrow"] && grid["keepCount"] >= grid["maxrow"])
		return "網格[" + desc + "]已達最大筆數，無法新增資料";
	var pgrow = grid["pgrow"];
	if (rowCnt >= pgrow) {
		advGridTakeTable(grid);
		// 如果本頁無空間則新增一頁
		grid["viewAt"]++;
		grid["totalPage"]++;
		grid["keepPage"]++;
		advGridSetSelectPage(grid);
		advGridShowTotal(grid, "pgcnt");
		advGridShowViewAt(grid, grid["viewAt"]);
		advGridBuildTable(grid);
	}
	if (grid["attr"]["fullPage"]) {
		// 建立一整頁
		if (rowData) {
			// 取得樣版內容
			var rowTmpl = advGridGetTmplRow(grid, "content");
			var row = rowTmpl.clone();
			var data = {};
			advGridTakeTableRow(grid, row, data);
			// 有指定資料，就先新增指定資料
			$.each(data, function(key, value) {
				data[key] = key in rowData ? rowData[key] : value;
			});
			// 新增指定至保存資料
			advGridSetDataRec(grid, grid["totalCount"], data);
			grid["totalCount"]++;
		}
		grid["totalCount"] = parseInt((grid["totalCount"] + pgrow - 1) / pgrow) * pgrow;
		advGridFillFullPage(grid, true);
		advGridBuildTable(grid);
		grid["totalCount"] += pgrow;
	}
	else {
		// 取得樣版內容
		var rowTmpl = advGridGetTmplRow(grid, "content");
		var row = rowTmpl.clone();
		var data = {};
		advGridTakeTableRow(grid, row, data);
		// 有指定資料，就先新增指定資料
		if (rowData) {
			$.each(data, function(key, value) {
				data[key] = key in rowData ? rowData[key] : value;
			});
		}
		// 新增一筆至保存資料
		advGridSetDataRec(grid, grid["totalCount"], data);
		// 建立表格新內容
		advGridBuildTableRow(grid, row, data, grid["totalCount"], rowTmpl);
		$(grid["table"]).append(row);
		advGridBuildTableFixColWidth(grid);
		grid["totalCount"]++;
		grid["keepCount"]++;
	}
	advGridShowTotal(grid, "rowcnt");
	return null;
}

function advGridGetRequest(name, request) {
	// public 取得網格中變動的資料內容，構成 request
	// name 網格名稱
	// data request 初始內容
	if (!request)
		request = {};
	var grid = advGridTable[name];
	if (!grid || !grid['valid'] || grid['loading'])
		return data;
	var pgrow = grid["pgrow"];
	var colsNdx = grid["showColNdx"];
	var cnameLead = grid["name"] + "Col";
	advGridTakeTable(grid);
	var begin = grid["keepBegin"] * pgrow;
	var count = 0;
	if (grid["attr"]["reqAll"]) {
		// 全部都要傳
		count = grid["keepCount"];
		for (var i = 0; i < count; i++) {
			var data = advGridGetDataRec(grid, begin + i);
			advGridGetRequestRow(request, data, colsNdx, cnameLead, i);
		}
	}
	else {
		// 只傳異動部份
		var totalCount = grid["totalCount"];
		$.each(advGridData[name]["new"], function (key, data) {
			if (key < totalCount) {
				advGridGetRequestRow(request, data, colsNdx, cnameLead, count);
				count++;
			}
		});
	}
	request[name + "Begin"] = grid["keepBegin"];
	request[name + "Count"] = count;
}

function advGridChangePage(name, pageNo) {
	// public 切換頁面
	// name 網格名稱
	// pageNo 要切至的頁數，0 為第一頁
	var grid = advGridTable[name];
	if (!grid || !grid["valid"])
		return;
	if (pageNo < 0 || pageNo >= grid["totalPage"] || pageNo == grid["viewAt"])
		return;
	// 顯示目前頁數
	advGridShowViewAt(grid, pageNo);
	// 檢查是否超過邊界
	var pgkeep = grid["pgkeep"];
	if (grid["act"] && 
		( (pageNo < grid["keepBegin"] + grid["pgmrg"] && grid["keepBegin"] > 0) ||
		  (pageNo >= grid["keepBegin"] + pgkeep - grid["pgmrg"] && grid["keepBegin"] + pgkeep < grid["totalPage"]) ) ) {
		// 需要重新讀取
		if (grid["loading"])
			return;
		grid["viewAt"] = pageNo;
		// 將 pageNo 視為新中點，計算需讀取範圍
		var beginPage = pageNo - parseInt((pgkeep - 1) / 2);
		if (beginPage > grid["totalPage"] - pgkeep)
			beginPage = grid["totalPage"] - pgkeep;
		if (beginPage < 0)
			beginPage = 0;
		grid["newBegin"] = beginPage;
		grid["newPage"] = pgkeep;
		// 如果要顯示的資料已超過現有資料，則需要在讀取後再顯示
		grid["build"] = pageNo < grid["keepBegin"] || pageNo >= grid["keepBegin"] + grid["keepPage"];
		if (!grid["build"])
			advGridBuildTable(grid);
		// 讀取資料
		advGridLoadData(grid);
	}
	else {
		// 不需要重新讀取，直接換頁
		grid["viewAt"] = pageNo;
		advGridBuildTable(grid);
	}
}

function advGridRegister(root) {
	// public 啟動程序
	// root 一般狀況下不用傳值
	if (!root) {
		root = $(document);
		advGridTable = {};
		advGridRequestScenario = {};
		advGridResponseScenario = {};
		advGridData = {};
	}

	// 尋找含有 grid 內容的 acod
	$.each(root.find("div[class='acod']"), function(key, div) {
		var jdiv = $(div);
		var condList = jdiv.text().split(/\s+/);
		var name = null;
		for (var i = 0; i < condList.length; i++) {
			var dirCmd = condList[i].match(/(\w+):(.+)/);
			if (dirCmd) {
				var dir = dirCmd[1];
				var cmd = dirCmd[2];
				if (dir == "grid") {
					// 找到陣列定義內容
					var cmdList = cmd.split(/;/);
					for (var j = 0; j < cmdList.length; j++) {
						var headArgs = cmdList[j].match(/(\w+)(\(([#!\/\w,]+)\))?/);
						if (headArgs) {
							var head = headArgs[1];
							var args = headArgs[3];
							if (head in { "table":"", "tmpl":"", "fixrow":"", "fpg":"", "ppg":"", "spg":"", "spgn":"", "npg":"", "lpg":"",
										"add":"", "rst":"", "rowcnt":"", "qrycnt":"", "pgcnt":"" }) {
								name = args;
								// name 必需依賴 table, tmpl ... 等欄位取得
								advGridRegisterItem(jdiv, head, args);
							}
							else if (head in { "desc":"", "pgrow":"", "pgkeep":"", "head":"", "pgmrg":"", "maxrow":"", "view":"" }) {
								if (name && advGridTable[name])
									advGridTable[name][head] = args;
							}
							else if (head == "dblclick") {
								if (name && advGridTable[name]) {
									var argList = args.split(/,/);
									if (argList.length >= 2) {
										advGridTable[name][head] = argList;
									}
								}
							}
							else if (head == "attr") {
								if (name && advGridTable[name]) {
									if (!advGridTable[name][head])
										advGridTable[name][head] = {};
									var attrList = args.split(/,/);
									for (var k = 0; k < attrList.length; k++)
										advGridTable[name][head][attrList[k]] = true;
								}
							}
						}
					}
				}
				if (name && (dir == "to" || dir == "bi")) {
					var cmdList = cmd.split(/;/);
					for (var j = 0; j < cmdList.length; j++) {
						// 加入 ajax 的劇本
						var scenario = cmdList[j];
						if (!advGridRequestScenario[scenario])
							advGridRequestScenario[scenario] = {};
						advGridRequestScenario[scenario][name] = advGridTable[name];
					}
				}
				if (name && (dir == "fr" || dir == "bi")) {
					var cmdList = cmd.split(/;/);
					for (var j = 0; j < cmdList.length; j++) {
						// 加入 ajax 的劇本
						var scenario = cmdList[j];
						if (!advGridResponseScenario[scenario])
							advGridResponseScenario[scenario] = {};
						advGridResponseScenario[scenario][name] = advGridTable[name];
					}
				}
				if (name && (dir == "mod")) {
					var cmdList = cmd.split(/;/);
					for (var j = 0; j < cmdList.length; j++) {
						// 加入 mod 檢查劇本
						var scenario = cmdList[j];
						if (!advGridModScenario[scenario])
							advGridModScenario[scenario] = {};
						advGridModScenario[scenario][name] = advGridTable[name];
					}
				}
			}
		}
	});
	
	// 檢查 table 是否有效，並補上預設值
	$.each(advGridTable, function (name, grid) {
		if (grid["table"] && grid["tmpl"]) {
			grid["valid"] = true;
			grid["name"] = name;
			// 建立保存區
			advGridData[name] = {};
			advGridData[name]["org"] = {};
			advGridData[name]["new"] = {};
			advGridData[name]["mod"] = {};
			// 預設每頁筆數
			if (grid["pgrow"])
				grid["pgrow"] = parseInt(grid["pgrow"], 10);
			if (grid["pgrow"] == 0)
				grid["pgrow"] = 10000;
			if (!grid["pgrow"] || isNaN(grid["pgrow"]))
				grid["pgrow"] = 10;
			// 預設資料保留頁數
			if (grid["pgkeep"])
				grid["pgkeep"] = parseInt(grid["pgkeep"], 10);
			if (!grid["pgkeep"] || isNaN(grid["pgkeep"]))
				grid["pgkeep"] = 1;
			var tmplRow = $(grid["tmpl"]).find("tr").length; 
			if (!grid["head"] || isNaN(grid["head"]))
				grid["head"] = tmplRow > 1 ? 1 : 0;
			grid["content"] = tmplRow - grid["head"];
			if (grid["content"] <= 0)
				grid["valid"] = false;
			// 預設邊界頁數
			if (grid["pgmrg"])
				grid["pgmrg"] = parseInt(grid["pgmrg"], 10);
			if (!grid["pgmrg"] || isNaN(grid["pgmrg"]))
				grid["pgmrg"] = 0;
			else if (grid["pgmrg"] >= (grid["pgkeep"] - 1) / 2)
				grid["pgmrg"] = (grid["pgkeep"] - 1) / 2;
			// 最大筆數
			if (grid["maxrow"])
				grid["maxrow"] = parseInt(grid["maxrow"], 10);
			if (isNaN["maxrow"])
				delete grid["maxrow"];
			// 說明
			if (!grid["desc"])
				grid["desc"] = grid["name"];
			// 顯示欄位
			advGridParseShowCol(grid, grid["view"]);
			// 屬性
			if (!grid["attr"])
				grid["attr"] = {};
			grid["totalCount"] = 0;
			grid["queryCount"] = 0;
			grid["totalPage"] = 0;
			grid["keepBegin"] = 0;
			grid["keepPage"] = 0;
			grid["keepCount"] = 0;
			grid["viewAt"] = 0;
			grid["showCol"] = [];
			grid["loading"] = false;
			// bind 換頁處理
			advGridRegisterBind(grid, "fpg", grid["fpg"]);
			advGridRegisterBind(grid, "ppg", grid["ppg"]);
			advGridRegisterBind(grid, "spg", grid["spg"]);
			advGridRegisterBind(grid, "npg", grid["npg"]);
			advGridRegisterBind(grid, "lpg", grid["lpg"]);
			advGridRegisterBind(grid, "add", grid["add"]);
			advGridRegisterBind(grid, "rst", grid["rst"]);
			// bind 捲動處理
			if (grid["fixrow"]) {
				var jtable = $(grid["table"]);
				var jfixrow = $(grid["fixrow"]);
				if (jtable.parent().length > 0 && jtable.parent()[0].tagName == "DIV" && 
					jfixrow.parent().length > 0 && jfixrow.parent()[0].tagName == "DIV")
					jtable.parent().bind("scroll", grid, advGridScrollEvent);
			}
			// 加入 ajax 傳送接收欄位及屬性設定
			advGridRegisterBaseConf(grid);
			// 加入 sort 欄位設定
			advGridRegisterColsSort(grid);
			// 刪掉在 advAjax 中加入的 template 欄位
			advAjaxUnregisterField($(grid["tmpl"]).find("input,select,textarea"));
			// 隱藏 template
			$(grid["tmpl"]).css("display", "none");
			$(grid["table"]).css("display", "block");
			if (grid["fixrow"])
				$(grid["fixrow"]).css("display", "block");
			if (grid["attr"]["fullPage"]) {
				// 如果每頁筆數太多，則取消 fullPage 屬性
				if (grid["pgrow"] >= 100)
					delete grid["attr"]["fullPage"];
				else {
					// 初始化時展開第一頁
					advGridFillFullPage(grid);
					//grid["totalCount"] = grid["pgrow"];
					grid["keepCount"] = grid["pgrow"];
					advGridBuildTable(grid);
					grid["totalPage"] = 1;
					grid["viewAt"] = 0;
				}
			}
			else if (grid["head"] > 0) { 
				// 放入標題列
				advGridBuildTable(grid);
			}
			// 初始化筆數及頁面元件
			advGridSetSelectPage(grid);
			advGridShowViewAt(grid, grid["viewAt"]);
			advGridShowTotal(grid, "pgcnt");
			advGridShowTotal(grid, "rowcnt");
		}
	});
}
