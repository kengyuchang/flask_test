/*
 * 取得字串長度
 */
String.prototype.getBytes = function() {
    // 不會被編碼的字元
    var re = /[\w!'\(\)\*\-\.~]/;
    
    // 不會被encodeURIComponent編碼的字元數*2
    var j = 0;
    
    for(var i = 0; i < this.length; i++){
        if (re.test(this.charAt(i))) {
            // 計算有多少個字不會被編碼
            j += 2; 
        }
    }
    return (encodeURIComponent(this).length + j) / 3;
}

/*
 * 擷取字串長度
 */
String.prototype.cutTextValue = function(field, maxLength) {
    var length = 0;
    var lastIndex;
    
    for (var i = 0; i < field.value.length; i++) { 
        if (field.value.charCodeAt(i) > 128) {
            length += 3; 
        } else { 
            length ++;
        }
        
        if (length > maxLength) {
            field.value = field.value.substring(0, i);
            break;
        }
    }
}

/************* 刪除字串前後的空白 *************/
function strTrim() {
    for( var begin = 0; begin < this.length; begin++ )
        if(this.charAt(begin) != ' ') break; 
    for( var end = this.length; end > 0; end-- )
        if(this.charAt(end - 1) != ' ') break; 
    return this.slice( begin, end );  
}

String.prototype.trim = strTrim;


/************* 刪除字串內所有的空白 *************/
function cleanSpace(str)
{
   var ostr='', len = str.length;

   for (var i=0; i < len; i++ )
      ostr += (str.charAt(i) != ' ') ? str.charAt(i) : '';
   return ostr;
}


/************* 判斷是否為英文字 *************/
function isEnglish(str) //
{
    str = str.toLowerCase();
    var alphabet = "qwertyuiopasdfghjklzxcvbnm";
    var check = 0;
    for (var i=0; i<str.length; i++)
    {
        for (var j=0; j<alphabet.length; j++)
        {
            if (str.charAt(i) == alphabet.charAt(j))
            {
                check++;
            }
        }
    }
    
    if (check != str.length)    
    {
        alert("只允許輸入英文字");
        return false;
    }
    else
    {
        return true;
    }
    
}





/************* 檢查身分證字號 *************/
function checkId(field)
{    
    var Id = field.value.charAt(0).toUpperCase();
    var Falg = "";
    /*
    //測試用
    if(field.value == '9999999999')
    {
        return true;   
    }
    */
         
    if(field.value.length != 10)
    {
        alert('身分證必須十個字母');
        field.focus();
        return false;
    }
          
    if (Id >= 'A' && Id <= 'Z')
    {}
    else
    {
        alert('身分證第一個字母必須為英文字母');
        field.focus();
        return false;                      
    }

    if (parseInt(field.value.charAt(1))=='1' || parseInt(field.value.charAt(1))=='2') 
    {}
    else 
    {
        alert('身分證第二碼請輸入1或2');
        field.focus();
        return false;    
    }

    var val = new Array(11);     

    for ( i=1; i<=9; i++)
    {
        val[i+1] = parseInt(field.value.charAt(i));
    }
            
    if (Id=='A'){ 
        val[0]=1;
        val[1]=0;
    }else if (Id=='B'){ 
        val[0]=1;
        val[1]=1;
    }else if (Id=='C'){ 
        val[0]=1;
        val[1]=2;
    }else if (Id=='D'){ 
        val[0]=1;
        val[1]=3;
    }else if (Id=='E'){ 
        val[0]=1;
        val[1]=4;
    }else if (Id=='F'){ 
        val[0]=1;
        val[1]=5;
    }else if (Id=='G'){ 
        val[0]=1;
        val[1]=6;
    }else if (Id=='H'){ 
        val[0]=1;
        val[1]=7;
    }else if (Id=='I'){ 
        val[0]=3;
        val[1]=4;
    }else if (Id=='J'){ 
        val[0]=1;
        val[1]=8;
    }else if (Id=='K'){ 
        val[0]=1;
        val[1]=9;
    }else if (Id=='L'){ 
        val[0]=2;
        val[1]=0;
    }else if (Id=='M'){ 
        val[0]=2;
        val[1]=1;
    }else if (Id=='N'){ 
        val[0]=2;
        val[1]=2;
    }else if (Id=='O'){ 
        val[0]=3;
        val[1]=5;
    }else if (Id=='P'){ 
        val[0]=2;
        val[1]=3;
    }else if (Id=='Q'){ 
        val[0]=2;
        val[1]=4;
    }else if (Id=='R'){ 
        val[0]=2;
        val[1]=5;
    }else if (Id=='S'){ 
        val[0]=2;
        val[1]=6;
    }else if (Id=='T'){ 
        val[0]=2;
        val[1]=7;
    }else if (Id=='U'){ 
        val[0]=2;
        val[1]=8;
    }else if (Id=='V'){ 
        val[0]=2;
        val[1]=9;
    }else if (Id=='W'){ 
        val[0]=3;
        val[1]=2;
    }else if (Id=='X'){ 
        val[0]=3;
        val[1]=0;
    }else if (Id=='Y'){ 
        val[0]=3;
        val[1]=1;
    }else if (Id=='Z'){ 
        val[0]=3;
        val[1]=3;
    }

    var check = 0;
    check = (val[1]*9+val[0])%10;
    for( i=2; i<=9; i++)
    {
        check += val[i] * (10-i);
    }
    //check += val[0];
    var remainder = check % 10;
    remainder = remainder + val[10];
    if ( (remainder % 10)  == 0)
    {
        return true;
    }
    else
    {
        alert("身分證不正確");
        field.focus();
        return false;
    }
} 


/************* 檢查統一編號 *************/
function checkBan(field)
{    
    var Ban  =   field.value;
    var temp1 = 0;
    var temp2 = 0;
    var temp3 = 0;
    var temp4 = 0;
    var Flag  = "";
    //alert(Math.abs(Ban.value));
    if(isNaN(Math.abs(field.value))) 
    {
           alert("請輸入數字");
        field.focus();
           return false;
    }
    if(field.value.length != 8)
    {
       alert('統一編號必須輸滿八個數字');
       field.focus();
       return false;
    }
    for ( i=1; i<=8; i++)
    {
        if ((i%2)>0) 
        {
            if (i==7) 
            {
                   temp1 = Math.abs(Ban.substring(i-1,i)) * 4;
                   if (Math.abs(Ban.substring(i-1,i))==7) 
                      temp3 = temp1;
               }
            else 
            {
                temp1 = Math.abs(Ban.substring(i-1,i));
               }    
        } 
        else 
        {
               if (i==8) 
            {
                   temp1 = Math.abs(Ban.substring(i-1,i));
               }
            else 
            {        
                temp1 = Math.abs(Ban.substring(i-1,i)) * 2;
            }    
        }       
        if (temp1>=10) 
        {
            temp4 = temp1 + "";
               temp2 = temp2 + Math.abs(temp4.substring(0,1))+Math.abs(temp4.substring(1,2));  
        } 
        else 
        {
               temp2 = temp2 + temp1;      
        }      
    }
    if ((temp2 % 10) > 0) 
    {
        if (temp3>0) 
        {
            if (temp3>10 ) 
            {
                temp4 = temp3 + "";
                temp2 =  Math.abs(temp4.substring(0,1))+Math.abs(temp4.substring(1,2));
                if ((temp2 % 10) >0)
                {
                   Flag = "Y";   
                }   
            }
            else 
            {
                Flag = "Y";
            }    
        } 
        else 
        {
           Flag = "Y";
        }
    }
    if (Flag=="Y") 
    {
        alert("統一編號不正確");
        field.focus();
        return false;
    }   
}
//======消除字串中的空白與斷行等…===============================================
function trimString(inString) 
{
    var outString;
    var startPos;
    var endPos;
    var ch;

    // where do we start?
    startPos = 0;
    test = 0;
    ch = inString.charAt(startPos);
    while ((ch == " ") || (ch == "\b") || (ch == "\f") || (ch == "\n") || (ch == "\r") || (ch == "\n")) {
        startPos++;
        if ( ch==" " ) {
            test++;
        }    
        ch = inString.charAt(startPos);
    }
     if  ( test==inString.length ) 
         flag = true;
     else
         flag = false;
    endPos = inString.length - 1;
    ch = inString.charAt(endPos);
    while ((ch == " ") || (ch == "\b") || (ch == "\f") || (ch == "\n") || (ch == "\r") || (ch == "\n")) {
        endPos--;
        ch = inString.charAt(endPos);
    }

    // get the string
    outString = inString.substring(startPos, endPos + 1);
    if ( flag==true ) 
        return "";
    else    
        return outString;
}

function getTextLength(textStr){
    var n = 0;
    textStr=trimString(textStr);
    for (b=0; b<=textStr.length; b++){
        j=escape(textStr.charAt(b));
        //alert(textStr.charAt(b)+":"+j);
        if(j.length>0){
            if (j.length>3){
                n=n+2;
            }else if(j!='%0D' && j!='%0A'){
                n++;
            }
        }
    }
    return n;
}

function Blength(textStr){    
    var arr = textStr.match(/[^\x00-\xff]/ig);
    var strLen=arr==null?this.length : this.length+arr.length;
    return strLen;
}