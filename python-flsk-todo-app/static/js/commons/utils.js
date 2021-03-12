function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function formatDate($date) {
	 $date.blur(function(){
	 	
			try{
				
	        var value = $(this).val();
	        if (value.indexOf('/') >= 0 ) {
	            var dateArray = value.split('/');
	            if(dateArray.length<3){
	            	$(this).val("");
	            	return;
	            }
	            var displayDate = '';
	            var year = parseInt(dateArray[0],10);
        		if(year>=0)
        			displayDate += pad(year,3) + '/';
        		else
        			displayDate += '-' + pad(year*(-1),2) + '/';
	            var month = dateArray[1];
        		displayDate += pad(month,2) + '/';
        		var day = dateArray[2];
        		displayDate += pad(day,2);
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
				

			}catch(e){
				$(this).val("");
			}	 	
	 	

	    });
}

function formatDateTime($dateTime) {
	 $dateTime.blur(function(){
		var value = $(this).val();
		if (value.indexOf('/') >= 0 ) {
			var dateArray = value.split('/');
			var displayDate = '';
			var year = parseInt(dateArray[0],10);
 			if(year>=0)
 				displayDate += pad(year,3) + '/';
 			else
 				displayDate += '-' + pad(year*(-1),2) + '/';
     		var month = dateArray[1];
			displayDate += pad(month,2) + '/';
			var day = dateArray[2].split(' ')[0];
			displayDate += pad(day,2);
			if (value.indexOf(':') >= 0 ) {
				var timeArray = value.split(':');
		    	var hour = timeArray[0].split(' ')[1];
		    	var minute = timeArray[1];
		    	displayDate += ' ' + pad(hour,2) + ':' + pad(minute,2);   		    			
		    }
		    $(this).val(displayDate);      		    
		}
	});
}