
var $currentBody, $currentForm, $submitBtn, $tabbedPannel;
var selectedTab = 0;

// 提供 Grid 元件中 gridColumn 的 editoptions 屬性來指定日期選取元件
var datePick = function(elem) {
	$(elem).datepicker();
	$('#ui-datepicker-div').css("z-index", 2000);
};

$( function(){
	
	// ex: $dataForm.printReport()
	$.fn.printReport = function( printUrl ) {
		if( ! this.is('form') ) {
			alert('必須是 form 物件才能使用 printReport 方法！');
			return;
		}
		
		if( $.type( printUrl ) == 'undefined' || $.type( printUrl ) == 'null' 
			|| $.type( printUrl ) != 'string' || printUrl.length == 0 ) {
			alert('無效的 printUrl 字串！');
			return;
		}
		
		doBeforeValidationByPrint( this );
		
		if( ! this.valid() )
			return;
		
		if( ! doBeforePrint( this ) )
			return;
		
		var url = getContextPath() + '/' + printUrl;
		$.post( url, this.serialize(), function( data ){
			showStatusMsg( data.status, data.msg );
			if( data.status == 'ok' ){
				var pidString = printUrl.split( '!', 1 );
				var $dialog = $('#'+pidString+'_blankMetaDialog');
				if( $dialog.length == 0 ) {
					$dialog = $( '<sj:dialog id="'+pidString+'_blankMetaDialog" resizable="false" autoOpen="false" width="750" height="400" modal="true" onCloseTopics="dialogClose"></sj:dialog>' );
					$dialog.append( '<iframe id="'+pidString+'_blankMetaFrame" frameborder="0" width="100%" height="100%"></iframe>' ).appendTo( 'body' );
				}
				var $frame = $('#'+pidString+'_blankMetaFrame');
				$frame.attr( 'src', "<s:url action='"+pidString+"!forwardBlank'/>");
				$dialog.dialog('open');
				$dialog.dialog('close');
				$frame.hide();
				
				doAfterPrint( this );
			}
		});
	};
	
	// ex: $statusMsg.resetStatusMsg()
	$.fn.resetStatusMsg = function() {
		if( $.type(this.attr('type')) == 'null' 
			|| $.type(this.attr('type')) == 'undefined' 
			|| this.attr('type') != 'text' ) {
			alert('必須是 input:text 物件才能使用 printReport 方法！');
			return;
		}
		if( this.length > 0 )
			this.val( '' ).css( 'color' );
	};
	
	// ex: $statusMsg.addError()
	$.fn.addError = function( message ) {
		if( $.type(this.attr('type')) == 'null' 
			|| $.type(this.attr('type')) == 'undefined' 
			|| this.attr('type') != 'text' ) {
			alert('必須是 input:text 物件才能使用 printReport 方法！');
			return;
		}
		if( this.length > 0 ) {
			var msg = this.val();
			this.val( msg + '['+message+']' ).css( 'color', 'red' );
		}
	};
	
	// ex: $statusMsg.addMessage()
	$.fn.addMessage = function( message ) {
		if( $.type(this.attr('type')) == 'null' 
			|| $.type(this.attr('type')) == 'undefined' 
			|| this.attr('type') != 'text' ) {
			alert('必須是 input:text 物件才能使用 printReport 方法！');
			return;
		}
		if( this.length > 0 ) {
			var msg = this.val();
			this.val( msg + '['+message+']' ).css( 'color', 'blue' );
		}
	};
	
	// ex: $textField.setValidation()
	$.fn.setValidation = function( validation ) {
		if( $.type(this.attr('type')) == 'null' 
			|| $.type(this.attr('type')) == 'undefined' 
			|| this.attr('type') != 'text' ) {
			alert('必須是 input:text 物件才能使用 printReport 方法！');
			return;
		}
		if( this.length > 0 )
			this.attr('class', validation);
	};
	
	// ex: $form.bindKeydownHandler() or $div.bindKeydownHandler() or $body.bindKeydownHandler()
	$.fn.bindKeydownHandler = function() {
		if( this.length > 0 )
			bindKeydownHandlerOn( this );
	};
	
	// ex: $form.bindKeydownHandler() or $div.bindKeydownHandler() or $body.bindKeydownHandler()
	$.fn.resetValue = function( isTriggerChangeEvent ) {
		if( $.type(this) == 'null' 
				|| $.type(this) == 'undefined' 
				|| this.length == 0 
				|| ! this.is('form')) {
			alert('無任何 form 元件可使用 resetValue 方法！');
			return;
		}
		resetValue( this, isTriggerChangeEvent );
	};
	
} );

function doBeforeValidationByPrint( $dataForm ) {}
function doBeforePrint( $dataForm ) { return true; }
function doAfterPrint( $dataForm ) {}

function initGridForm( $pagebody, $dataForm ) {
	$currentBody = $pagebody;
	$currentForm = $dataForm;
	$tabbedPannel = $('#mytabs');
	bindAllDateTextWithDatePicker();
	initAllReadOnlyText();
	bindAllTextBlurEventToTrim();
	bindAllTextBlurEventToUpperCase();
	$pagebody.bindKeydownHandler();
}

function bindAllDateTextWithDatePicker() {
	var $dateEle = $('input.datePicker');
	$dateEle.datepicker( {
        dateFormat: 'yyy/mm/dd',
        duration: 'fast',
        hideIfNoPrevNext: true
    });
	
	$dateEle.each(function () {
		formatDate($(this));
	});
}

function initAllReadOnlyText() {
	$('input.read').attr('readonly', 'readonly');
}

function bindAllTextBlurEventToTrim() {
	$(':text:not([readonly=readonly])').blur(function () {
		if( $.type($(this).val()) == 'string' &&  $(this).val().length > 0 )
			$(this).val( $.trim( $(this).val() ) );
	});
	
	$('textarea:not([readonly=readonly])').blur(function () {
		if( $.type($(this).val()) == 'string' &&  $(this).val().length > 0 )
			$(this).text( $.trim( $(this).val() ) );
	});
}

function bindAllTextBlurEventToUpperCase() {
	$(':text:not([readonly=readonly])').blur(function () {
		if( $.type($(this).val()) == 'string' &&  $(this).val().length > 0 )
			$(this).val( $(this).val().toUpperCase() );
	});
	
	$('textarea:not([readonly=readonly])').blur(function () {
		if( $.type($(this).val()) == 'string' &&  $(this).val().length > 0 )
			$(this).text( $(this).val().toUpperCase() );
	});
}

function setAllTextValueToUpperCaseAndTrim() {
	$(':text:not([readonly=readonly])').each(function () {
		if( $.type($(this).val()) == 'string' && $(this).val().length > 0 ) {
			$(this).val( $.trim( $(this).val() ) );
			$(this).val( $(this).val().toUpperCase() );
		}
	});
	
	$('textarea:not([readonly=readonly])').each(function () {
		if( $.type($(this).val()) == 'string' && $(this).val().length > 0 ) {
			$(this).text( $(this).val().toUpperCase() );
			$(this).text( $.trim( $(this).val() ) );
		}
	});
}

function appendHtmlToEle( $divEle ) {
	
	if ( $divEle.length > 0 
			&& $.type($divEle.attr('url')) != "undefined"
			&& $.type($divEle.attr('url')) != "null"
			&& $divEle.attr('url').length > 0
			&& $( 'td:first', $divEle ).length > 0) {
		
		$.ajax({
			type: 'GET',
			url: $divEle.attr('url'),
			dataType: 'html',
			success: function (html, textStatus) {
				$divEle.append(html);
				$divEle.attr( 'loaded', 'true' );
				$('.statusRow', $divEle).remove();
				var $button = $( ':button', $divEle );
				if( $button.length > 0 )
					$button.first().focus();
			},
			error: function (xhr, textStatus, errorThrown) {
				alert('['+urlString+']載入頁面發生錯誤！'+ ( errorThrown ? errorThrown : xhr.status ));
			}
		});
	}
	
}

function submitForm($dataForm, urlString){
	var url = getContextPath() + '/' + urlString;
	$.ajaxSetup({async:false});
	$.post( url, $dataForm.serialize(), function( callback ){
		$.ajaxSetup({async:true});
		$('#statusMsg').resetStatusMsg();
		showStatusMsg( callback.status, callback.msg );
	});
}

function initTabbedPanel($currentTabbedPannel) {
	$tabbedPannel = $currentTabbedPannel;
	
	if ( $.type($tabbedPannel) == 'null' 
			|| $.type($tabbedPannel) == 'undefined' 
			|| $tabbedPannel.length == 0 ) {
		
		alert('指定的 tabbedPannel 元件不存在！');
		return;
	}
	
	if( ! $tabbedPannel.is('div') ) {
		alert('必須是 div 物件才能使用 initTabbedPanel 方法！');
		return;
	}
	
	$tabbedPannel.bind( "tabsselect", function( event, ui ) {
		var tabIndex = ui.index;
		selectedTab = tabIndex + 1;
		$('#statusMsg').resetStatusMsg();
		var $divEle = $( 'div[id$=_tabContent'+selectedTab+']:first', $(this) );
		if ( $divEle.length > 0 ) {
			if ( $.type($divEle.attr('loaded')) == "undefined" 
				|| $.type($divEle.attr('loaded')) == "null" 
				|| $divEle.attr('loaded') != "true" ) {
				
				appendHtmlToEle( $divEle );
			}
			$tabbedPannel.bindKeydownHandler();
		}
		
		switch(tabIndex)
		{
		case 0:
			doAfterClickTab1();
			break;
		case 1:
			doAfterClickTab2();
			break;
		case 2:
			doAfterClickTab3();
			break;
		case 3:
			doAfterClickTab4();
			break;
		case 4:
			doAfterClickTab5();
			break;
		case 5:
			doAfterClickTab6();
			break;
		case 6:
			doAfterClickTab7();
			break;
		case 7:
			doAfterClickTab8();
			break;
		case 8:
			doAfterClickTab9();
			break;
		case 9:
			doAfterClickTab10();
			break;
		default:
			alert( 'no funciton' );
		}
		
	});
	
}

function doAfterClickTab1(){}
function doAfterClickTab2(){}
function doAfterClickTab3(){}
function doAfterClickTab4(){}
function doAfterClickTab5(){}
function doAfterClickTab6(){}
function doAfterClickTab7(){}
function doAfterClickTab8(){}
function doAfterClickTab9(){}
function doAfterClickTab10(){}

function clickTab( idx ){
	
	if ( $.type($tabbedPannel) == 'null' 
		|| $.type($tabbedPannel) == 'undefined' 
		|| $tabbedPannel.length == 0 ) {
	
		alert('指定的 tabbedPannel 元件不存在！');
		return;
	}
	
	$tabbedPannel.tabs( 'select', idx - 1 );
}

function setStatusMessage(message, color) {
	cleanStatusMsg();
	setColorForStatusField(color);
	$('#statusMsg').val(message);
}

/**
 * 清除狀態列的訊息
 */
function cleanStatusMsg(){
	var $statsMsg = $( '#statusMsg', $currentBody );
	if( $statsMsg.length != 0 )
		$statsMsg.val( '' ).css( 'color' );
}

function formatDate($date) {
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

function getContextPath() {
  var contextPath = "/" + location.pathname.split("/")[1];
  return contextPath;
}

function bindKeydownHandlerOn( $sourceEle ) {
	$('*').unbind( 'keydown' );
	var $targetElements = $('*', $sourceEle);
    $targetElements.bind( 'keydown','f2', function() {
    	setAllTextValueToUpperCaseAndTrim();
    	doClick( $(':button[id*=_addButton]', $sourceEle) );
    	return suppress();
    });
    $targetElements.bind( 'keydown','f3', function() {
    	setAllTextValueToUpperCaseAndTrim();
    	doClick( $(':button[id*=_updateButton]', $sourceEle) );
    	return suppress();
    });
    $targetElements.bind( 'keydown','f4', function() {
    	setAllTextValueToUpperCaseAndTrim();
    	doClick( $(':button[id*=_deleteButton]', $sourceEle) );
    	return suppress();
    });
    $targetElements.bind( 'keydown','f6', function () {
    	setAllTextValueToUpperCaseAndTrim();
    	doClick( $(':button[id*=_searchButton]', $sourceEle) );
    	return suppress();
    });
    $targetElements.bind( 'keydown','f7', function() {
    	setAllTextValueToUpperCaseAndTrim();
    	doClick( $(':button[id*=_printButton]', $sourceEle) );
    	return suppress();
    });
    $targetElements.bind( 'keydown','f1', function() {
    	document.onhelp = function() {return false;};
    	window.onhelp = function() {return false;};
    	return suppress();
    });
	$targetElements.bind( 'keydown','Shift+f1', function() {
		document.onhelp = function() {return false;};
		window.onhelp = function() {return false;};
		var $searchResetButton = $(':button[id*=_searchResetButton]', $sourceEle);
		var $resetButton = $(':button[id*=_resetButton]', $sourceEle);
		if( $.type($searchResetButton) != 'null' 
			&& $.type($searchResetButton) != 'undefined'
			&& $searchResetButton.length > 0 ){
			doClick( $searchResetButton );
		}
		else if( $.type($resetButton) != 'null' 
				&& $.type($resetButton) != 'undefined'
				&& $resetButton.length > 0 ){
					doClick( $resetButton );
		}
	 	return suppress();
	});
	$targetElements.bind( 'keydown','f12', function() {
	 	return suppress();
	});
	$targetElements.bind( 'keydown','Shift+f12', function() {
		doClick( $(':button[id*=_toAddButton]', $sourceEle) );
		return suppress();
	});
	$targetElements.bind( 'keydown','esc', function() {
		doClick( $(':button[id*=_exitButton]', $sourceEle) );
		return suppress();
	});
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
