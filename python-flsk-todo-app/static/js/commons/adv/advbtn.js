/*
 * Advanced Configuration On Document for hotKey 快捷鍵設置
 * 版本: 0.0.9
 * 快捷鍵設置:
 * 	需在Button的Tag上新增name屬性
 *  名稱為btn_+需設置的HotKey名稱
 *  複合式HotKey btn_+S(or C)+需設置的HotKey名稱
 *  範例:<button name='btn_F2' /> <input type='button' name='btn_F2'>
 *  	<button name='btn_SF1' /> <input type='button' name='btn_SF1'>
 *  
 *  若畫面為無pane(子頁面)之畫面，請在最底下加入
 *  <script type="text/javascript">advBtnEnableHotkey();</script>
 *  啟動快捷鍵設置
 *  
 *  新增上下控制鍵、HOME、END。by tony。
 *  << 33:'LPG',  34:'PPG', 35:'NPG', 36:'FPG'  >>
 *  
 *  新增Q。by tony。
 */

	var keyMap = {};
	var keyCodeMap = { 13:'ENT', 80:'P', 81:'Q', 27:'ESC', 112:'F1', 113:'F2', 114:'F3', 115:'F4', 116:'F5', 
			117:'F6', 118:'F7', 119:'F8', 120:'F9', 121:'F10', 122:'F11', 123:'F12',
			33:'LPG',  34:'PPG', 35:'NPG', 36:'FPG' 
	};

$(document).bind("keydown", function(event){

	var keyName = keyCodeMap[event.keyCode];
	if (keyName == "F1") {
		window.onhelp = function () {     
 			return false;
		};
	}
	
	//輸入報單完畢，按entr 比照f6查詢。
	if (keyName == "ENT") {
		if($('#declNo1').val().length != 2 ) return;
		if($('#declNo3').val().length != 2 ) return;
		if($('#declNo4').val().length != 3 ) return;
		if($('#declNo5').val().length != 5 ) return;
		
		var tmp;
		var fc = $(':focus').attr('name');
		var declNo2 = $('#declNo2').val();
		
		if( declNo2.length == 0 )
			declNo2 = "  ";
		tmp = $('#declNo1').val();
		tmp += declNo2;
		tmp += $('#declNo3').val();
		tmp += $('#declNo4').val();
		tmp += $('#declNo5').val();
		tmp = tmp.toUpperCase();
		
		
		if( tmp != $('#declNo').val() )
		{
			$('#declNo').val(tmp);
			$("[name='btn_F6']").trigger('click');
		}else if ( fc == "declNo1" || fc == "declNo2" ||
				   fc == "declNo3" || fc == "declNo4" ||
				   fc == "declNo5" )
		{
			$('#declNo').val(tmp);
			$("[name='btn_F6']").trigger('click');
		}else
		{
			window.event.keyCode = 13;
			window.event.returnValue = true;	
		    return true;
		}
	}

	
	
	if (keyName) {
		if (event.shiftKey)
			keyName = "S" + keyName;
		if (event.ctrlKey)
			keyName = "C" + keyName;
		if (keyName == "P" || keyName == "Q" || keyName == "SP")
			return true;
		var jbutton = keyMap[keyName];
		if (jbutton && jbutton.length > 0 && !jbutton.attr("disabled")) {
			//列印網頁畫面報表
			
			jbutton.focus();
			jbutton.click();
		}
		//畫面切換歷程呼叫
		//if (keyName == "CF11")
		//	advPaneSelHist();
		//報單號碼歷程呼叫
		//if (keyName == "CF12")
		//	advDeclSel();
		
		window.event.keyCode = 0;
		window.event.returnValue = false;	
	    return false;
	}
});

function advBtnEnableHotkey(pane) {
	// public 啟動快捷鍵
	// pane 應被啟動快捷鍵畫面的 panel
	if (!pane)
		pane = $(document);
	var jbuttonList = pane.find("button,input[type='button']");
	for (var i = 0; i < jbuttonList.length; i++) {
		var jbutton = $(jbuttonList[i]);
		if (jbutton.css("display") == "none")
			continue;
		//if (jbutton.attr("disabled"))
			//continue;
		var name = jbutton.attr("name");
		if (!name || name.length <= 4 || name.substring(0, 4) != 'btn_')
			continue;
		if (name == "btn_status")
			continue;
		name = name.substring(4);
		keyMap[name] = jbutton;
	}
}

function advBtnDisableHotkey() {
	// public 停止熱鍵
	keyMap = {};
}
