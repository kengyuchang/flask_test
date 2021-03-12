
/*
 * Advanced General 通用檢查
 * 版本: 0.0.1
 */

/*
 * 檢查數值
 */
function advChkItengers(obj)
{
	var item = obj.value;

	var v = item.match(/^\d*$/ );
	if (!v)
		obj.value = '';
}