;(function($){
	dpuuid = new Date().getDate();
	$.extend($.ympicker._defaults,{formatSeparator:'/'});
	$.extend($.ympicker,{
		_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
				secondary, monthNames, monthNamesShort){
			console.log(drawYear);
			var changeMonth = this._get(inst, 'changeMonth');
			var changeYear = this._get(inst, 'changeYear');
			var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
			var html = '<div class="ui-datepicker-title">';
			var monthHtml = '';

			if ( !inst.yearshtml ) {
				inst.yearshtml = '';
				if (secondary || !changeYear){
					var displayYear = drawYear -1911;
					if((drawYear -1911) >0)
						displayYear = pad((drawYear -1911),3);
					else
						displayYear = '-' + pad((drawYear -1912)*(-1),2);
					html += '<span class="ui-datepicker-year">' + '民國 ' + displayYear + '</span>';
//					html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
				} else {
					// determine range of years to display
					var years = this._get(inst, 'yearRange').split(':');
					var thisYear = new Date().getFullYear();
					var determineYear = function(value) {
						var year = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) :
							(value.match(/[+-].*/) ? thisYear + parseInt(value, 10) :
							parseInt(value, 10)));
						return (isNaN(year) ? thisYear : year);
					};
					var year = determineYear(years[0]);
					var endYear = Math.max(year, determineYear(years[1] || ''));
					year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
					endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
					inst.yearshtml += '<select class="ui-datepicker-year" ' +
						'onchange="DP_jQuery_' + dpuuid + '.ympicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
						'>';
					year=year-100;
					for (; year <= endYear; year++) {
						if((year-1911) < 1){
							inst.yearshtml += '<option value="' + year + '"' +
							(year == drawYear ? ' selected="selected"' : '') +
							'>' + (year-1912) + '</option>';
						}else{
							inst.yearshtml += '<option value="' + year + '"' +
							(year == drawYear ? ' selected="selected"' : '') +
							'>' + (year-1911) + '</option>';
						}
//						inst.yearshtml += '<option value="' + year + '"' +
//							(year == drawYear ? ' selected="selected"' : '') +
//							'>' + (year-1911) + '</option>';
					}
					inst.yearshtml += '</select>';
					
					html += inst.yearshtml;
					inst.yearshtml = null;
				}
			}
			html += this._get(inst, 'yearSuffix');
			if (showMonthAfterYear)
				html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthHtml;
			html += '</div>'; // Close ympicker_header
			return html;
		},
		_setDateFromField : function(inst){
			var dates = inst.input ? inst.input.val() : null;
			
			var dateFormat = this._get(inst, 'dateFormat');
			var separator = this._get(inst,'formatSeparator');
			inst.endDay = inst.endMonth = inst.endYear = null;

			var date = defaultDate = this._getDefaultDate(inst);
			console.log(dates);
			var settings = this._getFormatConfig(inst);
			try{
				if(dates=='999/99'){
					date = defaultDate = this._getDefaultDate(inst);
				}else if(dates=='000/00'){
					date = defaultDate = this._getDefaultDate(inst);
				}else if (!dates == '') {
					var dateArr = dates.split(separator);
					var year = parseInt(dateArr[0], 10) + 1911;
					var month = parseInt(dateArr[1], 10) - 1;
					date = new Date(year, month);
				}
			} catch (event){
				this.log(event);
				date = defaultDate;
			}
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
			inst.currentMonth = (dates ? date.getMonth() : 0);
			inst.currentYear = (dates ? date.getFullYear() : 0);
			this._adjustInstDate(inst);			
	    },
		_formatDate : function(inst, day, month, year){
			if (!day) {
				inst.currentDay = inst.selectedDay;
				inst.currentMonth = inst.selectedMonth;
				inst.currentYear = inst.selectedYear;
			}
			var date = (day ? (typeof day == 'object' ? day :
				this._daylightSavingAdjust(new Date(year, month, day))) :
				this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
			var twYear = date.getFullYear()-1911 <= 0 ? ("-"+pad((date.getFullYear()-1912)*(-1),2)) : date.getFullYear()-1911;
			var twMonth = (date.getMonth() + 1);
			var i = twYear.toString().length;
			for(;i<3;i++){
				twYear = "0"+ twYear;
			}
			return twYear + "/" + (twMonth.toString().length < 2 ? "0" + twMonth : twMonth);
			
		},
		_doKeyPress: function(event) {
			var inst = $.ympicker._getInst(event.target);
			if ($.ympicker._get(inst, 'constrainInput')) {
				//var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'formatSeperator'));
				var chars = '0123456789'+ $.ympicker._get(inst, 'formatSeparator');
				var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
				console.log("chr : "+chr);
				console.log("chars.indexOf(chr) : "+chars.indexOf(chr));
				return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -2);
			}
		}
	});
})(jQuery);
