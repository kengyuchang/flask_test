/**
 * get XMLHttpRequest object
 */
function getXMLHttpRequest() {
    var http_request = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari,...
      http_request = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
        http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          http_request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
      }
    }
    return http_request;
}

function displayLink(linkUrl, targetDiv, loadingMsg, errorMsg, async) {

	 var targetElement;
     if (typeof targetDiv == 'string') {
        targetElement = document.getElementById(targetDiv);
     } else {
        targetElement = targetDiv;
     }
     
	 if (typeof loadingMsg != "undefined") {
	 	targetElement.innerHTML = loadingMsg;
	 }
     var params = {'targetDiv':targetDiv, 'linkUrl':linkUrl};
     if (typeof errorMsg != 'undefined') {
        params['errorMsg'] = errorMsg;
     }
     var asynchronized = false;

     if (typeof async != 'undefined') {
        asynchronized = async;
     }
	 var result = doHttpRequest(linkUrl, 'GET', '', asynchronized, 'displayInnerHtml', params);
     //alert(asynchronized);
     if ( ! asynchronized) {
        if (result.status < 400) {
            targetElement.innerHTML=result.responseText;
         } else {
             if (typeof params['errorMsg'] != "undefined") {
                targetElement.innerHTML = errorMsg;
             } else {
                targetElement.innerHTML = '<a href="javascript:displayLink(' + linkUrl + ')">Error! Try again!</a>'
             }
         }
     }
}

function displayInnerHtml(http_request, params) {
    var targetElement = getElement(params['targetDiv']);
    if (http_request.status < 400) {
        targetElement.innerHTML=http_request.responseText;
     } else {
         if (typeof params['errorMsg'] != "undefined") {
            targetElement.innerHTML = params['errorMsg'];
         } else {
            targetElement.innerHTML = '<a href="javascript:displayLink(' + params['linkUrl'] + ')">Error! Try again!</a>'
         }
     }
}

function displaySubmitForm(form, targetDiv, loadingMsg, errorMsg) {
     var targetElement = getElement(targetDiv);
     
     if (typeof loadingMsg != "undefined") {
        targetElement.innerHTML = loadingMsg;
     }
     
     var result = doFormSubmit(form, false);
     if (result.status < 400) {
        targetElement.innerHTML=result.responseText;
     } else {
         if (errorMsg != "undefined") {
            targetElement.innerHTML = errorMsg;
         } else {
            targetElement.innerHTML = 'Error!'
         }
        
     }
}
/**
 * To submit form using synchronized http request
 */
function submitForm(form) {
    var httpRequest = doFormSubmit(form, false);
    if (httpRequest) {
        var result = trim(httpRequest.responseText);
        return result;
    }
}

/**
 * To submit form
 */
function doFormSubmit(form, async, funcName)  {
    if (typeof async == "undefined") {
        async = true;
    }

    var submitContent = '';
    if (form.elements.length > 0) {
        submitContent = form.elements[0].name + '=' + form.elements[0].value;
        for (var i=1;i<form.elements.length;i++) {
            if (form.elements[i].type == "select-multiple") {
                var selectMultiple = form.elements[i];
                for (var j=0;j<selectMultiple.options.length;j++) {
                    if (selectMultiple.options[j].selected) {
                        submitContent = submitContent + '&' + selectMultiple.name + '=' + selectMultiple[j].value;
                    }        
                }
            } else if (form.elements[i].type == "radio") {
                var radio = form.elements[i];
                if (radio.checked) {
                    submitContent = submitContent + '&' + radio.name + '=' + radio.value;
                }
            } else if (form.elements[i].type == "checkbox") {
                var checkbox = form.elements[i];
                if (checkbox.checked) {
                    submitContent = submitContent + '&' + checkbox.name + '=' + checkbox.value;
                }
            } else {
                submitContent = submitContent + '&' + form.elements[i].name + '=' + form.elements[i].value;
            }
        }
    }

    return doHttpRequest(form.action, form.method, encodeURI(submitContent), async, funcName);
}
/**
* url: request url
* method: GET, POST
* param: request parameter, such as p1=value1&p2=value2
* async: true:asynchronized, false: synchronized.
* funcName: function name to process return value.
*/
function doHttpRequest(url, method, param, async, funcName) {
    if (typeof async == "undefined") {
        async = true;
    }
    var http_request = getXMLHttpRequest();
    if (!http_request) {
      alert('無法取得XML Http Request!');
      return false;
    }

    if (async && typeof funcName != "undefined") {
        http_request.onreadystatechange = function (){
            if (http_request.readyState == 4) {
                if (http_request.status == 200) {
                    eval(funcName + "(http_request)");
                }
            }
        } // end of function
    }

    if ("GET" == method.toUpperCase()) {
        url = url + "?" + param;
        param = null;
    }

    http_request.open(method, url, async);
    http_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http_request.setRequestHeader( "If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT" );
    http_request.send(param);
    return http_request;

}

function unblockWithCheckBusy(target, time) {
	var t = 1000;
	if (typeof time != 'undefined') {
		t = time;
	}
	
	if (typeof target == 'undefined') {
		setTimeout("_checkBusy()", t);
	} else {
		setTimeout("_checkBusy('" + target + "', " + t + ")", t);
	}
}

function getContextPath() {
  var contextPath = "/" + location.pathname.split("/")[1];
  return contextPath;
}

function _checkBusy(target, time) {
	var checkUrl = getContextPath() + "/Checker!checkBusy.action";
	if (typeof target != 'undefined') {
		checkUrl += "?target=" + target;
	}
	
	$.ajax({
	  'url': checkUrl,
	  'cache': false,
	  'dataType': "json",
	  'success': function(data) {
		  if (data['busy'] != true) {
              $.unblockUI();
          } else {
        	  unblockWithCheckBusy(target, time);
          }
	}});
	
}