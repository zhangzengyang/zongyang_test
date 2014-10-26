//方向数组
var DIRECTION = ['asc', 'desc'];

//元素class的操作
function hasClassName(dom, test_name) {
	var name = dom.className;
	var reg = new RegExp('(\\s|^)' + test_name + '(\\s|$)');
	return reg.test(name);
}

function addClassName(dom, test_name) {
	var name = dom.className;
	if (!hasClassName(dom, test_name)) {
		dom.className = name + ' ' + test_name;
	}
}

function removeClassName(dom, test_name) {
	var name = dom.className;
	if (hasClassName(dom, test_name)) {
		dom.className = name.replace(new RegExp('(\\s|^)' + test_name + '(\\s|$)'), '');
	}
}

function toogleClassName(dom, test_name) {
	if (hasClassName(dom, test_name)) {
		removeClassName(dom, test_name);
	} else {
		addClassName(dom, test_name);
	}
}

//字符串排序
//arr:table的二维数组信息
//index:需要排序的列序号
//direction:排序方向
//return:排序的结果
function strCompare(arr, index, direction) {
	var objs = [];
	for (var i = 0; i < arr.length; i++) {
		objs.push({
			str: arr[i]
		});
	}

	for (var i = 0; i < objs.length - 1; i++) {
		for (var j = i + 1; j < objs.length; j++) {
			//自减方向
			if (direction == DIRECTION[1]) {
				if (objs[i].str[index] > objs[j].str[index]) {
					var temp = objs[i];
					objs[i] = objs[j];
					objs[j] = temp;
				}
			}
			//自增方向
			else {
				if (objs[i].str[index] < objs[j].str[index]) {
					var temp = objs[i];
					objs[i] = objs[j];
					objs[j] = temp;
				}
			}
		}
	}

	return objs;
}

//按列序号排序
//table:table
//index:需要排序的列序号
//direction:排序方向
function sortTableByCol(table, index, direction) {
	index = (index == undefined) ? 0 : index;
	direction = (direction == undefined) ? DIRECTION[0] : direction;
	//初始化，用一个二维数组存储表格内容信息
	var trs = table.rows;
	var trs_copy = [];
	for (var i = 1; i < trs.length; i++) { //由于表头占一行，所以从一开始
		var cells = trs[i].cells;
		var cells_copy = [];
		for (var j = 0; j < cells.length; j++) {
			cells_copy.push(cells[j].innerText);
		}
		trs_copy.push(cells_copy);
	}

	//根据排序结果重写表格td内容
	var sortObjs = strCompare(trs_copy, index, direction);

	for (var i = 1; i < trs.length; i++) {
		var cells = trs[i].cells;
		for (var j = 0; j < cells.length; j++) {
			cells[j].innerText = sortObjs[i - 1].str[j]; //返回的排序结果是没有表头这一行的所以i-1
		}
	}

}



//根据给table->t->td添加事件
function addThEvent(table) {
	var ths = table.rows[0].cells;
	for (var i = 0; i < ths.length; i++) {

		//onclick事件：箭头图标的修改及排序
		ths[i].onclick = function(e) {
			var dom = e.target;
			if (hasClassName(dom, DIRECTION[0])) {

				removeClassName(dom, DIRECTION[0]);
				addClassName(dom, DIRECTION[1]);

				sortTableByCol(table, dom.cellIndex, DIRECTION[0]);
			} else {

				removeClassName(dom, DIRECTION[1]);
				addClassName(dom, DIRECTION[0]);

				sortTableByCol(table, dom.cellIndex, DIRECTION[1]);
			}
		}
		//onmouseleave事件：处理鼠标离开后箭头消失
		ths[i].onmouseleave = function(e) {
			var dom = e.target;
			if (hasClassName(dom, DIRECTION[0])) {
				removeClassName(dom, DIRECTION[0]);
			}
			if (hasClassName(dom, DIRECTION[1])) {
				removeClassName(dom, DIRECTION[1]);
			}
		}

	}
}


//使table元素变得sortable
function makeAllTablesSortable(table_doms) {
	for (var i = 0; i < table_doms.length; i++) {
		addThEvent(table_doms[i]);
	}
}



//加载所有元素后执行
window.onload = function() {

	var t_todo = document.getElementById('todo');
	var t_staff = document.getElementById('staff');
	var doms = [t_todo, t_staff];

	makeAllTablesSortable(doms);
}