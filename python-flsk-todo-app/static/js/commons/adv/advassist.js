/*
 * Advanced Configuration On Document for ���U�d��
 * ����: 0.0.9
 *
 * <2013/12/24> by tony �ץ���L�� keyCode
 * <2014/09/19> by tony �@�~�N����5�X
 * <2015/03/01> by matt ����C��
 * <2015/03/12> by tony �t�X�i�f�W�[ CB011�BIBS53
 * <2015/11/05> by tony �t�X�i�f�W�[ IG86
 */

var advAssistScenario = [];
var advAssistAction;
var advAssistProcId;
var advAssistBackColor = "#FFFF33";
$(document).bind("keydown",(function(event){
	if ( event.keyCode == 13 && advAssistAction )
		advAssistInquire();
	else if ( event.keyCode == 108 && advAssistAction )
		advAssistInquire();
	else if ( (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) && advAssistAction )
		advAssistProcKeyEvt(event.keyCode);
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
	
	//�S��ݨD(EI15)
	if ( transId == "EI15" )
	{
		keep['vslRegNo']   =  $('#vslRegNo').val();
		keep['qryOrgSoNo'] =  $('#soNo').val();
		keep['orgSoNoEnd'] =  $('#soNo').val();
	}
	else if ( transId == "EA01" )//�S��ݨD(EA01)	
	{
		if ( $("[name='transTypeCd']").val() ==  '�ŹB' )
		{
			keep['mawb'] =  $('#mawb').val();
			keep['hawb'] =  $('#hawb').val();
			
		}else if ( $("[name='transTypeCd']").val() == '���B' && $("[name='declNo']").val().length == 14 )
		{
			keep['declCustCd'] =  $("[name='declNo']").val().substring( 0, 2 );
			keep['exCustCd']   =  $("[name='declNo']").val().substring( 2, 4 );
			keep['vslRegNo']   =  $('#vslRegNo').val();
			keep['soNo']       =  $('#soNo').val();
		}
	}
	else if ( transId == "EK01" || transId == "EK03")
		keep['qryDeclNo'] = $("[name='declNo']").val();
	else if ( transId == "CB011" )
	{
		var url = "/APCS/CB011?qban=" + $("input[name='dutyPayerBan']").val();
		
		window.open( url ,"CB011");	
		return;
	}else if ( transId == "IBS53" )
    {
        keep['qryVslRegNo']   =  $("[name='vslRegNo']").val();
        keep['qryMftNo']      =  $("[name='mftNo']").val();
        keep['qryMawb']       =  $("[name='mawb']").val();
        keep['qryHawb']       =  $("[name='hawb']").val();
	}else if ( transId == "IG86" )
    {
        keep['dutyPayerBan']   =  $("[name='dutyPayerBan']").val();
    }

	//�q�έ�h
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
			" value=\""+ advAssistScenario.substring(  0, 5  ).trim() +"\"";
			
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
		
		//Focus�Ĥ@��
		$("div.myAssist").find("table tr:eq(0)").css("background-color", advAssistBackColor);
		$("div.myAssist").find("table tr:eq(0)").addClass("trSelected");
		$("div.myAssist").find("table tr").bind({
			click : function(){
				$(this).css("background-color", advAssistBackColor);
				$(this).addClass("trSelected");
				$(this).siblings().css("background-color", "");
				$(this).siblings().removeClass("trSelected");
			},
		});
	}
}

function advAssistProcKeyEvt(keyCode){
	//4�Ӥ�V�䳣�|���ܳQ�襤��radio
	if (keyCode == '37' || keyCode == '40'){
		var isLastTr = $("div.myAssist tr:last").hasClass("trSelected");
		var tr = isLastTr ? $("div.myAssist tr:first") : $("div.myAssist tr.trSelected").next();
		var sibTr = tr.siblings();
		tr.addClass("trSelected")
		  .css("background-color", advAssistBackColor);
		$("div.myAssist tr.trSelected").find(":radio").attr("checked", true);
		sibTr.removeClass("trSelected")
			 .css("background-color", "");
	}
	else if (keyCode == '39' || keyCode == '38'){
		var isFirstTr = $("div.myAssist tr:first").hasClass("trSelected");
		var tr = isFirstTr ? $("div.myAssist tr:last") : $("div.myAssist tr.trSelected").prev();
		var sibTr = tr.siblings();
		tr.addClass("trSelected")
		  .css("background-color", advAssistBackColor);
		$("div.myAssist tr.trSelected").find(":radio").attr("checked", true);
		sibTr.removeClass("trSelected")
			 .css("background-color", "");
	}
}