var $currentBody, $currentForm, $currentBtn, $submitBtn, pid;

//1. 對所指定 ID 的表單進行欄位檢核機制初始化。
//2. 鏈結功能鍵與特定按鈕，包括 F1 說明、F2 新增、F3 更新、F4 刪除、F5 處理、F6 查詢、F7 列印、SF1 清除、SF12 新增、ESC 離開。
//3. 建立當按鈕被設定為作用中時，在執行回傳結果前設為 disabled 狀態，並在狀態列中以藍色文字顯示等待訊息，
//4. 待 Action 回傳並更新頁面後，即恢復為 enabled 狀態的機制。

function initialize( $pageBody, $dataForm ) {
	$currentBody = $pageBody;
	$currentForm = $dataForm;
	
	// ex: $statusMsg.resetStatusMsg()
	$.fn.resetStatusMsg = function() {
		if( $(this).length > 0 )
			$(this).val( '' ).css( 'color' );
	};
	
	bindAllDateTextWithDatePicker( $currentForm );
	initAllReadOnlyText( $currentForm );
	bindAllTextBlurEventToTrim( $currentForm );
	bindAllTextBlurEventToUpperCase( $currentForm );
	bindKeydownHandler( $currentBody );
	initialValidation( $currentForm );
	
	//設定 field validation i18n message
	$(':hidden[for]', $currentForm).each(
		function () {
			var elementId = $(this).attr('for');
			var i18nMsg = $(this).attr('value');
			$('#'+elementId, $currentForm).attr('alt', i18nMsg);
		}
	);
	
	var tempFormId = $currentBody.attr('id') + '_metaTempForm';
	var $metaTempForm = $( '#'+tempFormId );
	if( $metaTempForm.length == 0 ){
		$metaTempForm = $( '<form id="'+tempFormId+'"></form>' );
		$currentBody.append( $metaTempForm );
		$( ':input[pk=true]:not([type=hidden])', $currentForm ).each( function(){
			var $pkEle = $( '<input type="hidden" id="' + $(this).attr( 'id' ) + '_pk' + '" value="' + $(this).val() + '" />' );
			$metaTempForm.append( $pkEle );
		});
	}
	else
		alert('form id : ['+tempFormId+'] 與系統檢查PK時所需用的 id 衝突！');
	
	$(':submit', $currentForm).click( function () {
		$currentBtn = $(this);
		var buttonName = $currentBtn.attr('name');
		if ( "btn_sf1" == $currentBtn.attr('id') 
				&& ( $.type(buttonName) == 'null' || $.type(buttonName) == 'undefined' || $.type(buttonName).length == 0 ) ) {
			cleanStatusMsg( $currentBody );
			$(':submit[id=btn_f3]', $currentForm).attr('disabled', 'true');
			$(':text[reset!=false]', $currentForm).each(function () {
				$(this).val('');
			});
			$('select option:selected', $currentForm).attr('selected', false);
			$(':checkbox', $currentForm).attr('checked', false);
			$(':radio', $currentForm).attr('checked', false);
		} 
		else if ( $currentBtn.attr('name').length > 0 ) {
			$submitBtn = $currentBtn;
			setActive( $submitBtn );
		}
	});
	
	$currentForm.submit(function() {
		if ( $submitBtn == null )
			return false;
		
		if ( $currentBtn.attr('id') != $submitBtn.attr('id') ) 
			return false;
		
		$submitBtn.attr('disabled', 'true');
		
		if ( ! $(this).valid()) {
			$submitBtn.removeAttr('disabled');
			return false;
		}
		
		if ( 'btn_f3' == $submitBtn.attr('id') ) {
			if ( ! checkPKValue($(this)) ) {
				$submitBtn.removeAttr('disabled');
				return false;
			}
		}
		
		setActiveMessage( $currentBody );
		return true;
	});
	
	if ( $('#statusMsg', $currentBody).val().length == 0)
		$('#btn_f3').attr('disabled', 'true');
	
}

function bindAllDateTextWithDatePicker( $currentForm ) {
	$('input.datePicker', $currentForm).datepicker( {
        dateFormat: 'yyy/mm/dd',
        duration: 'fast',
        hideIfNoPrevNext: true
    });
	
	$('input.datePicker', $currentForm).each(function () {
		formatDate($(this));
	});
}

function initAllReadOnlyText( $currentForm ) {
	$('input.read', $currentForm).attr('readonly', 'true');
}

function bindAllTextBlurEventToTrim( $currentForm ) {
	$(':text:not(.read)', $currentForm).blur(function () {
		$(this).val( $.trim( $(this).val() ) );
	});
}

function bindAllTextBlurEventToUpperCase( $currentForm ) {
	$(':text:not(.read)', $currentForm).blur(function () {
		$(this).val( $(this).val().toUpperCase() );
	});
}

function setAllTextValueToUpperCase( $currentForm ) {
	$(':text:not(.read)', $currentForm).each(function () {
		$(this).val( $(this).val().toUpperCase() );
	});
}

function checkPKValue( $dataForm ) {
	var valid = true;
	$( ':input[pk=true]', $dataForm ).each( function(){
		var $ele = $(this);
		var $pkEle = $( '#' + $ele.attr( 'id' ) + '_pk' );
		if( $pkEle.val().length > 0 && $ele.val() != $pkEle.val() ){
			cleanStatusMsg( $currentBody );
			appendMsgToStatusField( $ele.attr( 'alt' ) + ':' + '為 PK 欄位,不可修改' );
			setColorForStatusField( 'red' );
			valid = false;
		}
	});
	return valid;
}

/**
 * 清除狀態列的訊息
 */
function cleanStatusMsg( $currentBody ){
	var $statsMsg = $( '#statusMsg', $currentBody );
	if( $statsMsg.length != 0 )
		$statsMsg.val( '' ).css( 'color' );
}

function setActiveMessage( $currentBody ){
	cleanStatusMsg( $currentBody );
	$('#statusMsg', $currentBody).val($submitBtn.attr('alt'));
	setColorForStatusField('blue');
}

function setActive( $button ) {
	$submitBtn = $button;
	$actionMethod = $submitBtn.attr('name');
	if ( $actionMethod.length > 0 ) {
		if ( $submitBtn.attr('id') == 'btn_esc' ) {
			$currentForm.attr('action', $submitBtn.attr('name'));
		} 
		else {
			$currentForm.attr('action', $('#pid').val() + '!' + $actionMethod);
		}
	}
}

function setValidation( $field, validation ) {
	$field.attr('class', validation);
}

function setDateRangeValidation( $startDate, formId, endDateId ) {
	$startDate.attr('dateRange', '#' + formId + ' #' + endDateId);
}

function formatDate( $date ) {
	 $date.blur(function(){
        var value = $(this).val();
        if (value.indexOf('/') >= 0 ) {
            var dateArray = value.split('/');
            var displayDate = '';
            for (var i=0;i<dateArray.length;i++) {
            	if (i == 1 && dateArray[i].toString().length < 2) {
            		displayDate = displayDate + '0' + dateArray[i] + '/';
            	}
            	else if (i == 2 && dateArray[i].toString().length < 2) {
            		displayDate = displayDate + '0' + dateArray[i];
            	}
            	else if (i == 0 && dateArray[i].toString().length < 3) {
                	displayDate = displayDate + '0' + dateArray[i] + '/';
                }
            	else {
                	if (!(i == 2)) {
                		displayDate = displayDate + dateArray[i] + '/';
                	}
                	else {
                		displayDate = displayDate + dateArray[i];
                	}
            	}
            }
            $(this).val(displayDate);
        }
        else {
        	var length = value.toString().length;
            if (length == 6 || length == 7){
            	if (length == 6) {
            		value = '0' + $(this).val();
            	}
                var year = value.substring(0,3);
                var month = value.substring(3,5);
                var day = value.substring(5,7);
                $(this).val(year + '/' + month + '/' + day);
            } 
        }
    });
}

function bindDatePicker( fieldId ) {
	var $field = $('#'+fieldId);
	$field.datepicker();
	formatDate($field);
}

function bindKeydownHandler( $currentBody ) {
	
	$('*').bind('keydown','Shift+f1',
	   	function(event) {
			document.onhelp = function() {return false;};
	    	window.onhelp = function() {return false;};
	    	$( '#statusMsg', $currentBody ).resetStatusMsg();
	    	doClick( $('#btn_sf1', $currentBody) );
	   	 	return suppress();
	});
	$('*').bind('keydown','f2',
  		function(event) {
			setAllTextValueToUpperCase( $currentForm );
   	 		doClick( $('#btn_f2', $currentBody) );
   	 		return suppress();
	});
	 	
    $('*').bind('keydown','f3',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
    		doClick( $('#btn_f3', $currentBody) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f4',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
    		doClick( $('#btn_f4', $currentBody) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f6',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
    		doClick( $('#btn_f6', $currentBody) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f7',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
    		doClick( $('#btn_f7', $currentBody) );
   	 		return suppress();
	});
    
	$('*').bind('keydown','Shift+f12',
		function(event) {
			doClick( $('#btn_sf12', $currentBody) );
			return suppress();
	});
	
	$('*').bind('keydown','esc',
		function(event) {
			doClick( $('#btn_esc', $currentBody) );
			return suppress();
	});
	
	// new keydown 2012/11/15 - BEGIN
	
    $('*').bind('keydown','f2',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
   	 		doClick( $(':input[id$=_addButton]', $currentBody) );
   	 		return suppress();
	});
	 	
    $('*').bind('keydown','f3',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
   	 		doClick( $(':input[id$=_updateButton]', $currentBody) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f4',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
   	 		doClick( $(':input[id$=_deleteButton]', $currentBody) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f6',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
   	 		doClick( $(':input[id$=_searchButton]', $currentBody) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f7',
  		function(event) {
    		setAllTextValueToUpperCase( $currentForm );
   	 		doClick( $(':input[id$=_printButton]', $currentBody) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f1',
		function(event) {
	    	document.onhelp = function() {return false;};
	    	window.onhelp = function() {return false;};
    		return suppress();
	});
    
	$('*').bind('keydown','Shift+f1',
	   	function(event) {
			document.onhelp = function() {return false;};
	    	window.onhelp = function() {return false;};
	   	 	doClick( $(':input[id$=_resetButton]', $currentBody) );
	   	 	return suppress();
	});
	
	$('*').bind('keydown','f12',
		function(event) {
			return suppress();
	});

	$('*').bind('keydown','Shift+f12',
		function(event) {
			doClick( $(':input[id$=_toAddButton]', $currentBody) );
			return suppress();
	});
	
	$('*').bind('keydown','esc',
		function(event) {
			doClick( $(':input[id$=_exitButton]', $currentBody) );
			return suppress();
	});
	
	// new keydown 2012/11/15 - END
}

function doClick( $button ) {
	if($button.length > 0)
		$button.click();
}

function suppress(){
	event.keyCode = 0; 
	event.returnValue = false;
	return false;
}