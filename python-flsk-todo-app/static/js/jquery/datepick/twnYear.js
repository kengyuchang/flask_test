 /*
 * Chinese year format for the jQuery UI date picker plugin.
 * Written by Max Clapton
 * http://maxclapton.comoj.com
 * 
 * modified by 2783 Brian Chang
 */

;(function($)
{

dpuuid = new Date().getTime();
$.extend($.datepicker._defaults,{formatSeparator:'/'});
$.extend($.datepicker, {
	_generateMonthYearHeader : function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {
		var changeMonth = this._get(inst, 'changeMonth');
		var changeYear = this._get(inst, 'changeYear');
		changeYear = true;
		changeMonth = true;
		var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
		var html = '<div class="ui-datepicker-title">';
		var monthHtml = '';
		// month selection
		if (secondary || !changeMonth)
			monthHtml += '<span class="ui-datepicker-month-custom">' + monthNames[drawMonth] + '月</span>';
		else {
			var inMinYear = (minDate && minDate.getFullYear() == drawYear);
			var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
			monthHtml += '<select class="ui-datepicker-month-custom" ' +
				'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'M\');" ' +
				'>';
			for (var month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) &&
						(!inMaxYear || month <= maxDate.getMonth()))
					monthHtml += '<option value="' + month + '"' +
						(month == drawMonth ? ' selected="selected"' : '') +
						'>' + monthNamesShort[month] + '</option>';
			}
			monthHtml += '</select>月';
		}
		if (!showMonthAfterYear)
			html += monthHtml + (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '');
		// year selection
		
		if (secondary || !changeYear){
			/*var displayYear = (drawYear-1911).toString();
			if (displayYear.length < 3) {
				displayYear = '0' + displayYear;
			}*/
			var displayYear = drawYear-1911;
			if(displayYear>=0)
				displayYear = pad(displayYear,3);
			else
				displayYear = '-' + pad(displayYear*(-1),2);
			html += '<span class="ui-datepicker-year">' + '民國 ' + displayYear + '</span>';
		}
		else {
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
			html += '<select class="ui-datepicker-year" ' +
				'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
				'>';
			year=year-100;
			for (; year <= endYear; year++) {
				if(year != 1911){
					html += '<option value="' + year + '"' +
					(year == drawYear ? ' selected="selected"' : '') +
					'>' + (year-1911) + '</option>';
				}
			}
			html += '</select>';
		}
		html += this._get(inst, 'yearSuffix');
		if (showMonthAfterYear)
			html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthHtml;
		html += '</div>'; // Close datepicker_header

		return html;
	},
    _setDateFromField : function(inst)

    {
     
	   var dateFormat = this._get(inst, 'dateFormat');
       var separator = this._get(inst,'formatSeparator');
       var dates = inst.input ? inst.input.val() : null;
       inst.endDay = inst.endMonth = inst.endYear = null;

       var date = defaultDate = this._getDefaultDate(inst);
       
       var settings = this._getFormatConfig(inst);
       try

       {
    	   if(dates=='999/99/99'){
    		   date = defaultDate = this._getDefaultDate(inst);
		   }
    	   else if(dates=='000/00/00'){
    		   date = defaultDate = this._getDefaultDate(inst);
    	   }
    	   else if (!dates == '') {
			   
			   var dateArr = dates.split(separator);
		   
               var year = parseInt(dateArr[0], 10) + 1911;

               var month = parseInt(dateArr[1], 10) - 1;

               var day = parseInt(dateArr[2], 10);
               date = new Date(year, month, day);
		   }
		  
		   
		   //date = this.parseDate(dateFormat, dates, settings) || defaultDate;

       } catch (event)

       {
           this.log(event);

           date = defaultDate;

       }

       inst.selectedDay = date.getDate();

       inst.drawMonth = inst.selectedMonth = date.getMonth();

       inst.drawYear = inst.selectedYear = date.getFullYear();

       inst.currentDay = (dates ? date.getDate() : 0);

       inst.currentMonth = (dates ? date.getMonth() : 0);

       inst.currentYear = (dates ? date.getFullYear() : 0);
	   
       this._adjustInstDate(inst);

    },
	
    _formatDate : function(inst, day, month, year)

    {
    	var separator = this._get(inst,'formatSeparator');
       if (!day)

       {

           inst.currentDay = inst.selectedDay;

           inst.currentMonth = inst.selectedMonth;

           inst.currentYear = inst.selectedYear;

       }

       var date = (day ? (typeof day == 'object' ? day :

               this._daylightSavingAdjust(new Date(year, month, day))) :

              this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
       
       var fullYear = date.getFullYear() - 1911;
       if(fullYear>=0)
    	   fullYear = pad(fullYear,3); // pad function lies js/utils.js 
	   else
			fullYear = '-' + pad(fullYear*(-1),2);
       return fullYear + separator +

              (date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + separator +

              (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

    },
	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if ($.datepicker._get(inst, 'constrainInput')) {
			//var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'formatSeperator'));
			var chars = '0123456789'+ $.datepicker._get(inst, 'formatSeparator');
			var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -2);
		}
	}
});

$.datepicker.regional['zh-TW'] = {
	clearText: '清除', clearStatus: '清除已選日期',
	closeText: '關閉', closeStatus: '不改變目前的選擇',
	prevText: '&#x3c;上月', prevStatus: '顯示上月',
	prevBigText: '&#x3c;&#x3c;', prevBigStatus: '顯示上一年',
	nextText: '下月&#x3e;', nextStatus: '顯示下月',
	nextBigText: '&#x3e;&#x3e;', nextBigStatus: '顯示下一年',
	currentText: '今天', currentStatus: '顯示本月',
	monthNames: ['1月','2月','3月','4月','5月','6月',
	'7月','8月','9月','10月','11月','12月'],
	monthNamesShort: ['1月','2月','3月','4月','5月','6月',
	'7月','8月','9月','10月','11月','12月'],
	monthStatus: '選擇月份', yearStatus: '選擇年份',
	weekHeader: '周', weekStatus: '年內周次',
	dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
	dayNamesShort: ['日','一','二','三','四','五','六'],
	dayNamesMin: ['日','一','二','三','四','五','六'],
	dayStatus: '設定 DD 為一周起始', dateStatus: '選擇 m月 d日, DD',
	dateFormat: 'yy-mm-dd', firstDay: 1,
	initStatus: '請選擇日期', isRTL: false,
	showMonthAfterYear: true, yearSuffix: ''};
$.datepicker.setDefaults($.datepicker.regional['zh-TW']);

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
window['DP_jQuery_' + dpuuid] = $;

})(jQuery);
