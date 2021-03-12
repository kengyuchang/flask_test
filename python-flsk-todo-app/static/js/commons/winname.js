
function formatDate($date) {
	 $date.blur(function(){
	        var value = $(this).val();
	        if (value.indexOf('/') >= 0 ) {
	            var dateArray = value.split('/');
	            var displayDate = '';
	            for (i=0;i<dateArray.length;i++) {
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