
/************* 檢查浮點數格式是否正確 *************/
function isRightFloat(checkField,checkLeftLen,checkRightLen,szWarning)
{
    if (isNaN(Math.abs(checkField.value))) 
    {
   	    alert(szWarning+"請輸入數字");
   	    checkField.focus();
   	    checkField.value="";
   	    return false;
    }
    var Maxvalue="";
    for (i=1;i<=Math.abs(checkLeftLen);i++)
        Maxvalue= Maxvalue+"9";
    if(parseFloat(checkField.value) > Math.abs(parseFloat(Maxvalue))) {
          alert( szWarning + "的整數值超過");  
          checkField.focus();
   	    checkField.value="";    	
	return false;
    }
    if(checkField.value.indexOf(".") != -1 )
    {
        var len1 = checkField.value.substring(0,checkField.value.indexOf("."));
        var len2 = checkField.value.substring(checkField.value.indexOf(".")+1,checkField.value.length);
        if(len1.length > checkLeftLen) {
        	alert( szWarning + "的只能有 " + checkLeftLen + " 個整數位");  
        	checkField.focus();
   	        //checkField.value="";
        	return false;
        }
        if(len2.length > checkRightLen)
        {
            alert( szWarning + "的小數點後只能有 " + checkRightLen + " 個位數");  
            checkField.focus();
   	        //checkField.value="";
            return false;  
        }
    }
    return true;
}


/************* 刪除千分號 *************/
function cleanComma(str)
{
    var pos=0;
    var oring = str;
    pos=oring.indexOf(",");

    while (pos !=-1)
    {
        oring=(oring).replace(",","");
        pos=oring.indexOf(",");
    }   

    return oring;
}



/**************************************
以下是直接從js.js 與 util.jsp 複製過來的
**************************************/


// ==========================  瘋狂千分號開始 =============================== 


//=======加上千分號=========================================================
function changeStr(T1,tmCOUNT,tmDESCRIPT)
{
    c="";
    var oring = T1.value
    var t1v1  = T1.value
    var t1v2  = "";
    var t1v3  = "1";
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
    if (isNaN(Math.abs(T1.value))) 
    {
 	   alert(tmDESCRIPT+"請輸入數字");
            T1.focus();
   	    return oring;
    }   	
    
    if(T1.value.length == 0)
        return oring;
  
    T1.value= Math.abs(T1.value);    
    t1v1  = T1.value
    
    
    if((pos=t1v1.indexOf(".")) != -1) 
    {
        len = (T1.value).substring((T1.value).indexOf(".")+1,T1.value.length);
        if(len.length > Math.abs(tmCOUNT))
        {
 	       alert(tmDESCRIPT+"小數只能"+tmCOUNT+"位");	
            T1.focus();
            return oring;  
        }
        T1.value = eval(T1.value);
    }
    if((pos=t1v1.indexOf(".")) != -1) 
    {
        t1v2 = t1v1.substring(pos,((T1.value).length));
        t1v1 = t1v1.substring(0,pos);
    }    
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
    pos=oring.indexOf(",")
    if (pos==-1) 
    { 
        var len   = t1v1.length;
        a=Math.floor(len % 3)
        b=Math.floor(len / 3 -1)
        if(a !=0 && b >= 0)        
            oring = t1v1.substring(0,a) + ",";
        else if(b<0)
                oring = t1v1
             else 
                oring = "";
        for(i=0;i<b;i++)
        {
            oring += t1v1.substring(a,a+3) + ",";
            a += 3;
        } // end of for
    
        oring += t1v1.substring(a,len);
    
        if (c == "-" ) 
        {
            oring="-"+oring;
        }	
        if(t1v2 != "")
            oring += t1v2;
    
        return oring;
     }
     return true;
}



//=======加上千分號=========================================================
function changeThousStr(T1){
    c="";
    var oring = ""+T1;
    var t1v1  = ""+T1;
    var t1v2  = "";
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (isNaN(Math.abs(T1)))
    {
   	    alert("請輸入數字");
   	    return oring;
    }else{
        if (eval(T1) < 0 )
            c="-";
    }

    if(T1.length == 0)
        return oring;
    if(Math.abs(T1) == 0)
        return oring;

    T1= Math.abs(T1);
    t1v1  = ""+T1;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    pos=oring.indexOf(",",0);
    if (pos==-1)
    {
        var len   = t1v1.length;
        a=Math.floor(len % 3);
        b=Math.floor(len / 3 -1);
        if(a !=0 && b >= 0)
            oring = t1v1.substring(0,a) + ",";
        else if(b<0)
                oring = t1v1;
             else
                oring = "";
        for(i=0;i<b;i++)
        {
            oring += t1v1.substring(a,a+3) + ",";
            a += 3;
        } // end of for

        oring += t1v1.substring(a,len);

        if (c == "-" )
        {
            oring="-"+oring;
        }
        if(t1v2 != "")
            oring += t1v2;

        return oring;
     }
}





//=======加上千分號=========================================================
function changeStr9(T1)
{
    c="";
    var oring = changeVal(T1);
    var t1v1  = changeVal(T1);
    var t1v2  = "";
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       if (isNaN(Math.abs(oring)))
    {
   	    alert("請輸入數字");
   	    return false;
    }else{
        if (eval(oring) < 0 )
            c="-";
    }
    oring= Math.abs(oring);
    t1v1  = oring;

    if((T1.value).indexOf(".") != -1 )
    {
            alert("不可輸入小數點");
            return false;
     }
    return true;
}


//=======加上千分號  IRCWeb=========================================================
function StrThousand(T1)
{
    c="";
    var oring = ""+T1;
    var t1v1  = ""+T1;
    var t1v2  = "";
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if(T1.length == 0)
        return oring;
    if(Math.abs(T1) == 0)
        return oring;

    T1= Math.abs(T1);
    t1v1  = T1

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    pos=oring.indexOf(",")
    if (pos==-1) {
		t1v1 = ""+t1v1;
        var len   = t1v1.length;
        a=Math.floor(len % 3)
        b=Math.floor(len / 3 -1)
        if(a !=0 && b >= 0)
            oring = t1v1.substring(0,a) + ",";
        else if(b<0)
                oring = t1v1
             else
                oring = "";


        for(i=0;i<b;i++)
        {
            oring += t1v1.substring(a,a+3) + ",";

            a += 3;
        } // end of for
        oring += t1v1.substring(a,len);

        if (c == "-" )
        {
            oring="-"+oring;

        }
        if(t1v2 != "")
            oring += t1v2;

        return oring
     }
}

//=======加上千分號=========================================================

function changeStr1(T1,tmCOUNT,tmCOUNT1,tmDescript)
{
    c="";
    var oring = T1.value
    var t1v1  = T1.value
    var t1v2  = "";
    var t1v3  = "1";
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (isNaN(Math.abs(T1.value)))
    {
   	    alert("請輸入數字");
   	    return oring;
    }else{
        if (eval(T1.value) < 0 )
            c="-";
    }

    if(T1.value.length == 0)
        return oring;
    if(Math.abs(T1.value) == 0)
        return oring;

  //===============================================
   for (Count=1;Count<=Math.abs(tmCOUNT1);Count++) {
   	t1v3 = t1v3 + "0";

   }
   if(eval(oring) > Math.abs(t1v3))
     {
           alert(tmDescript+"不可大於 "+t1v3);
           return oring;
   }
   //===============================================

    T1.value= Math.abs(T1.value);
    t1v1  = T1.value


    if((pos=t1v1.indexOf(".")) != -1)
    {
        len = (T1.value).substring((T1.value).indexOf(".")+1,T1.value.length);
        if(len.length > Math.abs(tmCOUNT))
        {
            alert("小數點後只能有 "+tmCOUNT+" 個位數");
            return oring;
        }
        T1.value = eval(T1.value);
    }
    if((pos=t1v1.indexOf(".")) != -1)
    {
        t1v2 = t1v1.substring(pos,((T1.value).length));
        t1v1 = t1v1.substring(0,pos);
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    pos=oring.indexOf(",")
    if (pos==-1)
    {
        var len   = t1v1.length;
        a=Math.floor(len % 3)
        b=Math.floor(len / 3 -1)
        if(a !=0 && b >= 0)
            oring = t1v1.substring(0,a) + ",";
        else if(b<0)
                oring = t1v1
             else
                oring = "";
        for(i=0;i<b;i++)
        {
            oring += t1v1.substring(a,a+3) + ",";
            a += 3;
        } // end of for

        oring += t1v1.substring(a,len);

        if (c == "-" )
        {
            oring="-"+oring;
        }
        if(t1v2 != "")
            oring += t1v2;

        return oring
     }
}
//=======加上千分號=========================================================
function changeStr8(T1,tmCOUNT,tmCOUNT1,tmDescript)
{
    c="";
    var oring = changeVal(T1);
    var t1v1  = changeVal(T1);
    var t1v2  = "";
    var t1v3  = "1";
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       if (isNaN(Math.abs(oring)))
    {
   	    alert("請輸入數字");
   	    return false;
    }else{
        if (eval(oring) < 0 )
            c="-";
    }
  //===============================================
   for (Count=1;Count<=Math.abs(tmCOUNT1);Count++) {
   	t1v3 = t1v3 + "0";

   }
   if(eval(oring) > Math.abs(t1v3))
     {
           alert(tmDescript+"不可大於 "+t1v3);
           return false;
   }
   //===============================================


    oring= Math.abs(oring);
    t1v1  = oring;

    if((T1.value).indexOf(".") != -1 )
    {

        len = (T1.value).substring((T1.value).indexOf(".")+1,T1.value.length);
        if(len.length > Math.abs(tmCOUNT))
        {
            alert("小數點後只能有 "+tmCOUNT+" 個位數");
            return false;
        }
     }
    return true;
}


// ==========================  瘋狂千分號結束 =============================== 

function money_format(inputVal)
{

	var result = inputVal;
    if (! isNaN(result)) {
        result = result.toString() ;
		var sRegExp =/(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
        result=result.replace(sRegExp,"$1,");
	}

	return result;

}

//=======判斷是否為欄位值數字=========================================================
function checkNum(T1)
{
   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   var n = cleanComma(T1.value);
   
    if (isNaN(Math.abs(n)))
    {
   	    alert("請輸入數字");
   	    T1.focus();
   	    return false;
    }
	if (eval(n)<0) {
   	    alert("請輸正整數");
   	    T1.focus();
   	    return false;
    }
    return true;

}
