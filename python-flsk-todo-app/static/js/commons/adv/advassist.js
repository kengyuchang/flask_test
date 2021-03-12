/*
 * Advanced Configuration On Document for 輔助查詢
 * 版本: 0.0.6
 *
 * <2013/12/24> by tony 修正鍵盤鍵 keyCode
 */

var advAssistScenario = [];
var advAssistAction;
var advAssistProcId;

$(document).bind("keydown",(function(event){
	if ( event.keyCode == 13 && advAssistAction )
		advAssistInquire();
	else if ( event.keyCode == 108 && advAssistAction )
		advAssistInquire();
}));

$(function() 
{
	$( "#dialogAssist"  ).dialog(
	{   
		autoOpen: false,
		modal: true,
		
		close: function( click, ui ) { advAssistAction = ""; }	
	});

});

function advAssistInquire()	
{
	var send = advAjaxGetRequest("send");
	var keep = send;
	var transId = $('input[name=typeCode]:checked').val();
	
	//特殊需求(EI15)
	if ( transId == "EI15" )
	{
		keep['vslRegNo']   =  $('#vslRegNo').val();
		keep['qryOrgSoNo'] =  $('#soNo').val();
	}
	else if ( transId == "EA01" )//特殊需求(EA01)	
	{
		if ( $("[name='transTypeCd']").val() ==  '空運' )
		{
			keep['mawb'] =  $('#mawb').val();
			keep['hawb'] =  $('#hawb').val();
			
		}else if ( $("[name='transTypeCd']").val() == '海運' && $("[name='declNo']").val().length == 14 )
		{
			keep['declCustCd'] =  $("[name='declNo']").val().substring( 0, 2 );
			keep['exCustCd']   =  $("[name='declNo']").val().substring( 2, 4 );
			keep['vslRegNo']   =  $('#vslRegNo').val();
			keep['soNo']       =  $('#soNo').val();
		}
	}
	else if ( transId == "EK01" || transId == "EK03"){
		keep['qryDeclNo'] = $("[name='declNo']").val();
	}	

	//通用原則
	keep['declNo'] = $("[name='declNo']").val();

	advPaneRedirect( transId , send, advAssistProcId, keep);
}

function advAssistShow()
{
	advAssistAction = "1";
	$( "#dialogAssist"  ).dialog( "open" );
}

function advAssistInit(procId)
{
	advAssistProcId = procId;
	
	if ( advAssistScenario.length != 0 ) 
	{
		advAssistScenario = advAssistScenario + ",";
		
		var tokenStr = advAssistScenario.indexOf(",");
		var tokenIdx = 1;
		var buildStr = "";
		
		while( tokenStr > 0 )
		{					
			buildStr =  buildStr + 
			"<tr><td><input type=\"radio\" name=\"typeCode\" id=\"typeCode"+ tokenIdx +"\""+ 
			" value=\""+ advAssistScenario.substring(  0, 4  )+"\"";
			
			if ( tokenIdx == 1 )
				buildStr =  buildStr + "checked='true'";
			
			buildStr =  buildStr +" style=\"-moz-opacity:0;filter:alpha(opacity:0);opacity:0;\"></input>"+
			"<label for=\"typeCode"+ tokenIdx +"\" ondblclick=\"advAssistInquire()\">" +
			advAssistScenario.substring(  0, tokenStr ) + "</label></td></tr> ";
			
			advAssistScenario = advAssistScenario.substring(  tokenStr+1, advAssistScenario.length );
			tokenStr = advAssistScenario.indexOf(",");
			tokenIdx++;
		}
		$("div.myAssist").append( "<table>"+ buildStr +"</table>" );
	}
}
