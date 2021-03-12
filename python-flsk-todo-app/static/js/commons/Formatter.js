	
	function formatHsDate(cellValue, opts, rowObject){
		if (cellValue == null||cellValue.length==0) { 
	        return ''; 
	    } else {
	    	if(cellValue.length==9){
	    		return cellValue;
	    	}else{
				var twDate = toTwDate(cellValue);
				showMsg('cellValue: '+cellValue+'  twDate: '+twDate,false);
				
				if(twDate == "8088/12/31") {
					return "999/99/99";
				} else if(twDate == "0-1910/01/01" || twDate == "-1910/01/01") {
					return "000/00/00";
				} else {
					return twDate;
				}
	    	}
	    }
	}
	
	function toHsDate(val){
		if (val == null||val.length==0) { 
	        return ''; 
	    } else {
	    	//rocDate : 8088/12/31 , DataObject : 9999-12-31
			if(val == "8088/12/31" || val== "9999-12-31"){
				return "999/99/99";
			} else if(val == "0-1910/01/01"){
				return "000/00/00";
			} else{
				return twDate;
			}
	    	
	    }
	}