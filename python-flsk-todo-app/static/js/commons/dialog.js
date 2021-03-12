var t_DiglogX,t_DiglogY,t_DiglogW,t_DiglogH;    

function Browser(){    
  var ua, s, i;    
  this.isIE = false;    
  this.isNS = false;    
  this.isOP = false;    
  this.isSF = false;    
  ua = navigator.userAgent.toLowerCase();    
  s = "opera";    
  if ((i = ua.indexOf(s)) >= 0){    
    this.isOP = true;return;    
  }    
  s = "msie";    
  if ((i = ua.indexOf(s)) >= 0) {    
    this.isIE = true;    
    return;    
  }    
  s = "netscape6/";    
  if ((i = ua.indexOf(s)) >= 0) {    
    this.isNS = true;    
    return;    
  }    
  s = "gecko";    
  if ((i = ua.indexOf(s)) >= 0) {    
    this.isNS = true;    
    return;    
  }    
  s = "safari";    
  if ((i = ua.indexOf(s)) >= 0) {    
    this.isSF = true;    
    return;    
  }    
}    
   
function ShowDialog(showdata, w, h){    
  var objDialog = document.getElementById("DialogMove");    
  if (!objDialog)     
    objDialog = document.createElement("div");    
  t_DiglogW = w;    
  t_DiglogH = h;    
 
  DialogLoc();    
  objDialog.id = "DialogMove";    
  var oS = objDialog.style;    
  oS.display = "block";    
  oS.top = t_DiglogY + "px";    
  oS.left = t_DiglogX + "px";    
  oS.margin = "0px";    
  oS.padding = "0px";    
  oS.width = w + "px";    
  oS.height = h + "px";    
  oS.position = "absolute";    
  oS.zIndex = "5";    
  oS.background = "#FFF";    
  oS.border = "solid #000 1px";    
  objDialog.innerHTML = showdata;    
  document.body.appendChild(objDialog);    
}    
   
function CloseDialog(){    
  ScreenClean();    
  var objDialog = document.getElementById("DialogMove");    
  if (objDialog)    
    objDialog.style.display = "none";    
}    
   
function DialogLoc(){    
  var dde = document.documentElement;
  
  if (document.body.scrollTop) {
    var ww = document.body.offsetWidth;
    var wh = document.body.offsetHeight;    
    var bgX = document.body.scrollLeft;    
    var bgY = document.body.scrollTop;
  } else if (window.innerWidth) {    
    var ww = window.innerWidth;    
    var wh = window.innerHeight;    
    var bgX = window.pageXOffset;    
    var bgY = window.pageYOffset;    
  }else{    
    var ww = dde.offsetWidth;    
    var wh = dde.offsetHeight;    
    var bgX = dde.scrollLeft;    
    var bgY = dde.scrollTop;    
  }    
  t_DiglogX = (bgX + ((ww - t_DiglogW)/2));    
  t_DiglogY = (bgY + ((wh - t_DiglogH)/2));    
}    
   
function ScreenConvert(){    
  var browser = new Browser();    
  var objScreen = document.getElementById("ScreenOver");    
  if(!objScreen)     
    var objScreen = document.createElement("div");    
  var oS = objScreen.style;    
  objScreen.id = "ScreenOver";    
  oS.display = "block";    
  oS.top = oS.left = oS.margin = oS.padding = "0px";
  
  if (document.body.scrollHeight) { 
    var wh = document.body.scrollHeight + "px"; 
  } else if (document.body.clientHeight)   {
    var wh = document.body.clientHeight + "px";
  } else if (window.innerHeight){    
    var wh = window.innerHeight + "px";
  }else{    
    var wh = "100%";    
  } 
   
  oS.width = "100%";    
  oS.height = wh;    
  oS.position = "absolute";    
  oS.zIndex = "3";    
  if ((!browser.isSF) && (!browser.isOP)){    
    oS.background = "#cccccc";    
  }else{    
    oS.background = "#cccccc";    
  }    
  oS.filter = "alpha(opacity=50)";    
  oS.opacity = 40/100;    
  oS.MozOpacity = 40/100;    
  document.body.appendChild(objScreen);    
  var allselect = document.getElementsByTagName("select");    
  for (var i=0; i<allselect.length; i++)     
    allselect[i].style.visibility = "hidden";    
}    
   
function ScreenClean(){    
  var objScreen = document.getElementById("ScreenOver");    
  if (objScreen)    
    objScreen.style.display = "none";    
  var allselect = document.getElementsByTagName("select");    
  for (var i=0; i<allselect.length; i++)     
    allselect[i].style.visibility = "visible";    
}    
