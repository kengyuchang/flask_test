/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Ressol (ressol@gmail.com). */
jQuery(function($){
	$.extend($.datepicker, {   
		formatDate: function (format, date, settings) {   
			var d = date.getDate();   
			var m = date.getMonth()+1;   
			var y = date.getFullYear();            
			var fm = function(v){              
				return (v<10 ? '0' : '')+v;   
			};
			return (y) +'/'+ fm(m) +'/'+ fm(d);   
        }
	});

	$.extend($.datetimepicker, {   
		_updateDateTime: function(dp_inst) {
		dp_inst = this.inst || dp_inst,
			dt = new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay),
			dateFmt = $.datepicker._get(dp_inst, 'dateFormat'),
			formatCfg = $.datepicker._getFormatConfig(dp_inst),
			timeAvailable = dt != null && this.timeDefined;
		this.formattedDate = $.datepicker.formatDate(dateFmt, (dt == null ? new Date() : dt), formatCfg);
		var formattedDateTime = this.formattedDate;
		if (dp_inst.lastVal != undefined && (dp_inst.lastVal.length > 0 && this.$input.val().length == 0))
			return;

		if (this._defaults.timeOnly == true) {
			formattedDateTime = this.formattedTime;
		} else if (this._defaults.timeOnly != true && (this._defaults.alwaysSetTime || timeAvailable)) {			
			formattedDateTime += this._defaults.separator + this.formattedTime;
		}
		this.formattedDateTime = formattedDateTime;

		if(!this._defaults.showTimepicker) {
			this.$input.val(this.formattedDate);
		} else if (this.$altInput && this._defaults.altFieldTimeOnly == true) {
			this.$altInput.val(this.formattedTime);
			this.$input.val(this.formattedDate);
		} else if(this.$altInput) {
			this.$altInput.val(formattedDateTime);
			this.$input.val(formattedDateTime);
		} else {
			this.$input.val(formattedDateTime);
		}
		this.$input.trigger("change");
	}
	});
});
