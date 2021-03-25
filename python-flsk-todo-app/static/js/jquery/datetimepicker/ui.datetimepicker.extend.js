/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Ressol (ressol@gmail.com). */
jQuery(function($){
	//轉民國年
	$.extend($.datepicker, {   
		formatDate: function (format, date, settings) {   
			var d = date.getDate();   
			var m = date.getMonth()+1;   
			var y = date.getFullYear();            
			var fm = function(v){              
				return (v<10 ? '0' : '')+v;   
			};
			y -= 1911;
			if(y>=0)
				y = pad(y,2);
			else
				y = '-' + pad(y*(-1),2); 
			return (y) +'/'+ fm(m) +'/'+ fm(d);   
        }
	});
});
