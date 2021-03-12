
var selectedTab, $activeButton, currentButtonId;

function initializeByForm( pageName ) {
	initialize( pageName, '' );
}

function initializeByGrid1( pageName ) {
	initialize( pageName, '1' );
}

function initializeByGrid2( pageName ) {
	initialize( pageName, '2' );
}

function initializeByGrid3( pageName ) {
	initialize( pageName, '3' );
}

function initializeByGrid4( pageName ) {
	initialize( pageName, '4' );
}

function initialize( pageName, mode ) {
	
	var bodyId = pageName + '_body';
	var dataFormId = pageName + '_dataForm' + mode;
	var gridConditionId = pageName + '_gridCondition' + mode;
	var gridId = pageName + '_grid' + mode;
	
	checkId( mode, bodyId, dataFormId, gridConditionId, gridId );
	var $formElem = $( '#'+dataFormId );
	
	bindDatePickerInForm( dataFormId );
	formatTextField( $formElem );
	bindKeydownHandler( mode, pageName );
	bindSubmitFormByEvent( $formElem, pageName, mode );
	
	if( mode == '' )
		initSimpleForm( $formElem, pageName, bodyId );
	
	setI18NMsg( $formElem );
//	focusOnForm( $formElem );
	var $tabbedPannel = $('[id$=_tabbedPannel]');
}

function initSimpleForm( $formElem, pageName, bodyId ) {
	initialValidation( $formElem );
	copyPKFieldToTempForm( $formElem, pageName, bodyId );
	if( $( '#'+pageName+'_metaForm' ).length == 0 )
		$( '#'+pageName+'_updateButton', $formElem ).attr( 'disabled', 'true' );
}

function formatTextField( $formElem ) {
	$('input.read', $formElem).attr('readonly', 'true');
	$('input.trim', $formElem).blur(function () {
		$(this).val( $.trim( $(this).val() ) );
	});
	$(':text:not(.read)', $formElem).blur(function () {
		$(this).val( $(this).val().toUpperCase() );
	});
}

function formatDate($dateElem) {
	$dateElem.blur(function(){
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

function setValidation( dataFormId, fieldId, validation ) {
	$( '#'+fieldId, '#'+dataFormId ).attr( 'class', validation );
}

function setDateRangeValidation( dataFormId, startDateId, endDateId ) {
	$( '#'+startDateId, '#'+dataFormId ).attr( 'dateRange', '#' + dataFormId + ' #' + endDateId );
}

function cleanStatusMsg() {
	var $statsMsg = $( '#statusMsg' );
	if( $statsMsg.length != 0 )
		$statsMsg.val( '' ).css( 'color' );
}

function setActiveMessage() {
	cleanStatusMsg();
	$( '#statusMsg' ).val( $activeButton.attr('alt') );
	setColorForStatusField( 'blue' );
}

function focusOnForm( $formElem ) {
	$( ':input:not(.datePicker):not(:hidden)', $formElem ).first().focus();
}

function bindSubmitFormByEvent( $formElem, pageName, mode ) {
	var $submitButton = $(':submit', $formElem);
	$submitButton.each(function () {
		var resetButtonId = pageName+"_resetButton"+mode;
		if( mode == '' ) {
			if ( typeof( $(this).attr('name') ) == "undefined" && resetButtonId == $(this).attr('id') ) {
				$(this).click(function (event) {
					currentButtonId = $(this).attr('id');
					cleanStatusMsg();
					$(':text[reset!=false]', $formElem).each(function () {
						$(this).val('');
					});
					var $optionEle = $( 'option[selected=selected]', $( 'select[reset!=false]', $formElem ) );
					$optionEle.replaceWith('<option value="' + $optionEle.val() + '">' + $optionEle.text() + '</option>');
					$(':checkbox[reset!=false]', $formElem).removeAttr('checked');
					$(':radio[reset!=false]', $formElem).removeAttr('checked');
				});
			}
		}
		if ( typeof( $(this).attr('name') ) != "undefined" && $(this).attr('name').length > 0 ) {
			$(this).click(function (event) {
				currentButtonId = $(this).attr('id');
				setActive( $(this), $formElem, pageName );
			});
		}
		
	});
	
	$formElem.submit(function() {
		if ( $activeButton == null 
				|| $activeButton.length < 1
				|| currentButtonId != $activeButton.attr('id') )
			return false;
		
		$activeButton.attr('disabled', 'true');
		
		$(':text:not(.read)', $formElem).each(function () {
			$(this).val( $(this).val().toUpperCase() );
		});
		
		if ( ! $(this).valid() ) {
			$activeButton.removeAttr('disabled');
			return false;
		}
		
		if ( pageName+'_searchButton' == $activeButton.attr('id') )
			copyPKFieldToTempForm( $formElem );
		else if ( pageName+'_updateButton' == $activeButton.attr('id') && ! checkPKValue( $(this) ) )
			return false;
		
		setActiveMessage();
		return true;
	});
}

function checkPKValue( $dataForm ) {
	var valid = true;
	$( ':input[pk=true]', $dataForm ).each( function(){
		var $ele = $(this);
		var $pkEle = $( '#' + $ele.attr( 'id' ) + '_pk' );
		if( $pkEle.val().length > 0 && $ele.val() != $pkEle.val() ){
			cleanStatusMsg();
			appendMsgToStatusField( $ele.attr( 'alt' ) + ':' + '為 PK 欄位,不可修改' );
			setColorForStatusField( 'red' );
			valid = false;
		}
	});
	return valid;
}

function setActive( $button, $formElem, pageName ) {
	$activeButton = $button;
	var pid = pageName.split('_', 1);
	var $actionMethod = $button.attr('name');
	if ( typeof( $actionMethod ) != "undefined" && $actionMethod.length > 0 ) {
		if ( $button.attr('id') == pageName+'_exitButton' )
			$formElem.attr( 'action', $actionMethod );
		else
			$formElem.attr( 'action', pid + '!' + $actionMethod );
	}
}

function copyPKFieldToTempForm( $formElem, pageName, bodyId ) {
	var $pkFields = $( ':input[pk=true]', $formElem );
	if( $pkFields.length > 0 ) {
		var $metaForm = $( '#'+pageName+'_metaForm' );
		if( $metaForm.length > 0 )
			$metaForm.remove();
		
		$metaForm = $( '<form id="'+pageName+'_metaForm"></form>' );
		$( '#'+bodyId ).append($metaForm);
		$pkFields.each( function() {
			var $ele = $(this);
			var $pkEle = $( '<input type="hidden" id="' + $ele.attr( 'id' ) + '_pk' + '" value="' + $ele.val() + '" />' );
			$metaForm.append($pkEle);
		});
	}
}

function setI18NMsg( $formElem ) {
	//設定 field validation i18n message
	$(':hidden[for]', $formElem).each(
		function () {
			var elementId = $(this).attr('for');
			var i18nMsg = $(this).attr('value');
			$('#'+elementId, $formElem).attr('alt', i18nMsg);
		}
	);
}

function checkId( mode, bodyId, dataFormId, gridConditionId, gridId ) {
	if( $('#'+bodyId).length < 1 )
		alert('body[id='+bodyId+'] not exist !');
	
	if( $('#'+dataFormId).length < 1 )
		alert('dataForm[id='+dataFormId+'] not exist !');
	
	if( mode != '' ) {
		if( $('#'+gridConditionId).length < 1 )
			alert('gridCondition[id='+gridConditionId+'] not exist !');
		
		if( $('#'+gridId).length < 1 )
			alert('grid[id='+gridId+'] not exist !');
	}
}

function bindDatePickerInForm( dataFormId ) {
	var dateElems = $( 'input.datePicker', '#'+dataFormId );
	dateElems.datepicker( {
        dateFormat: 'yyy/mm/dd',
        duration: 'fast',
        hideIfNoPrevNext: true
    });
	
	dateElems.each(function () {
		formatDate($(this));
	});
}

function removeDatePicker( dataFormId, dateElemId ) {
	$( '#'+dateElemId, '#'+dataFormId ).datepicker({
		beforeShow: function() {
			$(this).datepicker.destroy();
		}
	});
}

function bindKeydownHandler( mode, pageName ) {
	
    $('*').bind('keydown','f2',
  		function(event) {
   	 		doClick( $('#'+pageName+'_addButton'+mode) );
   	 		return suppress();
	});
	 	
    $('*').bind('keydown','f3',
  		function(event) {
   	 		doClick( $('#'+pageName+'_updateButton'+mode) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f4',
  		function(event) {
   	 		doClick( $('#'+pageName+'_deleteButton'+mode) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f6',
  		function(event) {
   	 		doClick( $('#'+pageName+'_searchButton'+mode) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f7',
  		function(event) {
   	 		doClick( $('#'+pageName+'_printButton'+mode) );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f8',
  		function(event) {
   	 		doClick( $('#'+pageName+'_btn_f8') );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f9',
  		function(event) {
   	 		doClick( $('#'+pageName+'_btn_f9') );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f10',
  		function(event) {
   	 		doClick( $('#'+pageName+'_btn_f10') );
   	 		return suppress();
	});
    
    $('*').bind('keydown','f11',
  		function(event) {
   	 		doClick( $('#'+pageName+'_btn_f11') );
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
	   	 	doClick( $('#'+pageName+'_resetButton'+mode) );
	   	 	return suppress();
	});
	
	$('*').bind('keydown','f12',
		function(event) {
			return suppress();
	});

	$('*').bind('keydown','Shift+f12',
		function(event) {
			doClick( $('#'+pageName+'_toAddButton') );
			return suppress();
	});
	
	$('*').bind('keydown','esc',
		function(event) {
			doClick( $('#'+pageName+'_exitButton') );
			return suppress();
	});
	
	$('*').bind('keydown','Ctrl+1',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 1 );
//			$("#tab1 a").click();
	});
	
	$('*').bind('keydown','Ctrl+2',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 2 );
//			$("#tab2 a").click();
	});
	
	$('*').bind('keydown','Ctrl+3',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 3 );
//			$("#tab3 a").click();
	});
	
	$('*').bind('keydown','Ctrl+4',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 4 );
//			$("#tab4 a").click();
	});
	
	$('*').bind('keydown','Ctrl+5',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 5 );
//			$("#tab5 a").click();
	});
	
	$('*').bind('keydown','Ctrl+6',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 6 );
//			$("#tab6 a").click();
	});
	
	$('*').bind('keydown','Ctrl+7',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 7 );
//			$("#tab7 a").click();
	});
	
	$('*').bind('keydown','Ctrl+8',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 8 );
//			$("#tab8 a").click();
	});
	
	$('*').bind('keydown','Ctrl+9',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 9 );
//			$("#tab9 a").click();
	});
	
	$('*').bind('keydown','Ctrl+0',
		function(event) {
			clickTab( $('#'+pageName+'_tabbedPannel'), 10 );
//			$("#tab10 a").click();
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

function initTabbedPanel($tabbedPannel) {
	
	if ($tabbedPannel.length < 1) {
		alert('指定的 tabbedPannel 元件不存在！');
		return;
	}
	
	$tabbedPannel.bind( "tabsselect", function( event, ui ) {
		var tabIndex = ui.index;
		selectedTab = tabIndex + 1;
		var $divEle = $( 'div[id$=_tabContent'+selectedTab+']:first', $(this) );
		
		if ( $divEle.length > 0 ) {
			cleanMsgForStatusField();
			if ( typeof($divEle.attr('loaded')) == "undefined" )
				appendHtmlToEle( $divEle );
			
			switch(tabIndex)
			{
			case 0:
				doAfterClickTab1( event, $divEle );
				break;
			case 1:
				doAfterClickTab2( event, $divEle );
				break;
			case 2:
				doAfterClickTab3( event, $divEle );
				break;
			case 3:
				doAfterClickTab4( event, $divEle );
				break;
			case 4:
				doAfterClickTab5( event, $divEle );
				break;
			case 5:
				doAfterClickTab6( event, $divEle );
				break;
			case 6:
				doAfterClickTab7( event, $divEle );
				break;
			case 7:
				doAfterClickTab8( event, $divEle );
				break;
			case 8:
				doAfterClickTab9( event, $divEle );
				break;
			case 9:
				doAfterClickTab10( event, $divEle );
				break;
			default:
				alert( 'no funciton' );
			}
		}
		else {
			alert('指定的 div 元件不存在！');
		}
		
	});
	
}

function appendHtmlWithoutStatus( $divEle ) {
	
	if ( $divEle.length > 0 
			&& typeof($divEle.attr('url')) != "undefined"
			&& $divEle.attr('url').length > 0
			&& $( 'td:first', $divEle ).length > 0) {
		
		$.ajax({
			type: 'GET',
			url: $divEle.attr('url'),
			dataType: 'html',
			success: function (html, textStatus) {
				$divEle.append(html);
				$divEle.attr( 'loaded', 'true' );
				$('.status', $divEle).remove();
			},
			error: function (xhr, textStatus, errorThrown) {
				alert('['+urlString+']載入頁面發生錯誤！'+ ( errorThrown ? errorThrown : xhr.status ));
			}
		});
	}
	
}

function appendHtmlWithStatus( $divEle ) {
	
	if ( $divEle.length > 0 
			&& typeof($divEle.attr('url')) != "undefined"
			&& $divEle.attr('url').length > 0
			&& $( 'td:first', $divEle ).length > 0) {
		
		$.ajax({
			type: 'GET',
			url: $divEle.attr('url'),
			dataType: 'html',
			success: function (html, textStatus) {
				$divEle.append(html);
				$divEle.attr( 'loaded', 'true' );
			},
			error: function (xhr, textStatus, errorThrown) {
				alert('['+urlString+']載入頁面發生錯誤！'+ ( errorThrown ? errorThrown : xhr.status ));
			}
		});
	}
	
}


function clickTab( $tabbedPannel, idx ) {
	$tabbedPannel.tabs( 'select', idx - 1 );
}

function doAfterClickTab1( event ){};
function doAfterClickTab2( event ){};
function doAfterClickTab3( event ){};
function doAfterClickTab4( event ){};
function doAfterClickTab5( event ){};
function doAfterClickTab6( event ){};
function doAfterClickTab7( event ){};
function doAfterClickTab8( event ){};
function doAfterClickTab9( event ){};
function doAfterClickTab10( event ){};
