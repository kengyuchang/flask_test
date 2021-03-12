
//
if(typeof HTMLElement!="undefined" && !HTMLElement.prototype.insertAdjacentElement) {
  HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
      switch (where)  {
	      case 'beforeBegin':
	          this.parentNode.insertBefore(parsedNode, this);
	          break;
          case 'afterBegin':
	          this.insertBefore(parsedNode, this.firstChild);
	          break;
          case 'beforeEnd':
	          this.appendChild(parsedNode);
	          break;
          case 'afterEnd':
	          if (this.nextSibling)
			      this.parentNode.insertBefore(parsedNode, this.nextSibling);
	          else
			      this.parentNode.appendChild(parsedNode);
	          break;
	  }
  }

  HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
      var r = this.ownerDocument.createRange();
      r.setStartBefore(this);
      var parsedHTML = r.createContextualFragment(htmlStr);
      this.insertAdjacentElement(where,parsedHTML)
  }

  HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
      var parsedText = document.createTextNode(txtStr)
      this.insertAdjacentElement(where, parsedText)
  }
}


var setCount = 0;
var tempNewElementId = null;
function addHtml(addedElementId, htmlSegment, isAutoAddRemove)
{
  if (typeof isAutoAddRemove == "undefined")
  {
	  isAutoAddRemove = true;
  }
  var newDiv = document.createElement("div");
  var newDivId = addedElementId+"_set_"+setCount;
  newDiv.id = newDivId;
  document.getElementById(addedElementId).appendChild(newDiv);

  document.getElementById(newDivId).insertAdjacentHTML("beforeEnd", htmlSegment);
  if (isAutoAddRemove)
  {
	  document.getElementById(newDivId).insertAdjacentHTML("beforeEnd", "&nbsp;<a href=\"javascript:removeHtml('"+addedElementId+"', '"+newDivId+"');\"><img src='../images/delete.gif' border=0></a>");
  }
  tempNewElementId = newDivId;
  location.href='#'+tempNewElementId;
  setCount ++;
}

function removeHtml(parentElementId, removeElementId)
{
  var parent = document.getElementById(parentElementId);
  parent.removeChild(document.getElementById(removeElementId));
}

function getNewElementId()
{
  return tempNewElementId;
}

function removeChildren(parentElementId)
{
  var children = document.getElementById(parentElementId).childNodes;
  for (var i=0; i<children.length; i++){
	  document.getElementById(parentElementId).removeChild(children[i]);
  }
}

function removeAllSubs(parentObject)
{
  if (parentObject != null)
  {
	  var children = parentObject.childNodes;
	  if (children != null)
	  {
		  for (var i=0; i<children.length; i++)
		  {
			  parentObject.removeChild(children[i]);
			  removeAllSubs(children[i]);
		  }
	  }
  }
}
function openBlock(element) {
    var elt;
    if (typeof element == "string") {
        elt = document.getElementById(element);
    } else if (element != null) {
        elt = element;
    }
    elt.style.display='block';    
}
function closeBlock(element) {
    var elt;
    if (typeof element == "string") {
        elt = document.getElementById(element);
    } else if (element != null) {
        elt = element;
    }
    elt.style.display='none';    
}
/**
 * To hide element
 * @param element The element name or object.
 */
function hideElement(element) {
    var elt;
    if (typeof element == "string") {
        elt = document.getElementById(element);
    } else if (element != null) {
        elt = element;
    }
    elt.style.visibility='hidden';
}
/**
 * To show element
 * @param element The element name or object.
 */
function showElement(element) {
    var elt;
    if (typeof element == "string") {
        elt = document.getElementById(element);
    } else if (element != null) {
        elt = element;
    }
    elt.style.visibility='hidden';
}

/*
 * 新增或刪除多選下拉選單
 */
function addMultiSelect(from, to, isAll) {
    var fromSize = from.options.length;
    var toSize = to.options.length;
    var hasSelected = false;
    
    for (var i = 0; i < fromSize; i ++) {
        if (isAll != undefined && isAll == "transAll") {
            if (from.options[i].value != "-1") {
	            to.options[toSize] = new Option(from.options[i].text, from.options[i].value);
	            toSize++;   
                from.options[i] = null;
                i--;
                fromSize--;
            }
        } else {
            if (from.options[i].selected) {
                if (from.options[i].value != "-1") {
	                to.options[toSize] = new Option(from.options[i].text, from.options[i].value);
	                toSize++;   
                    from.options[i] = null;
                    i--;
                    fromSize--;
                    hasSelected = true;
                }
            }
            
        }
    }
    
    if (!hasSelected && isAll != "transAll") {
        alert("移轉的商品未指定！");
        return;
    }
}

/**
 * CheckBox全選
 */
function selectAllCheckBox(form) {

	if (form == undefined) {
		alert("This form is undefined.");
	}
	for(var i = 0; i < form.elements.length; i++) {
		if (form.elements[i].type == "checkbox" ) {
			if (form.elements[i].disabled != true) {
				form.elements[i].checked = true;
			}
		}
	}
}


/**
 * Confirm delete
 */
function deleteConfirm() {
	return confirm("確定刪除?");
}

/**
 * confirm add
 */
function addConfirm(){
	return confirm("確定新增?");
}

/**
 * confirm update
 */
 function updateConfirm(){
 	return confirm("確定更新");
 }

/**
 * on mouse over
 */
function changeIconOnMouseOver(iconName, imgSrc) {
    var img=document.getElementById(iconName);
    img.imgRolln=img.src;
    img.src=imgSrc;
}
/**
 * on mouse out
 */
function changeIconOnMouseOut(iconName, imgSrc) {
    var img = document.getElementById(iconName);
    img.src=imgSrc;
}

