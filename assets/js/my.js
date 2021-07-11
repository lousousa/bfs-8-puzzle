var cell_size = 64;
var m = 3, n = 3;
var vis = new Set();
var finished;
var queue = [];
var max = 0;
var cell_disabled = false;

function bfs(){
	while(queue.length && !finished){
		if(queue.length > max) max = queue.length;
		var current = queue.shift();
		var dir = getDirections(current.idx);
		$(dir).each(function(){
			var copy = current.list; copy = copy.split(',');
			var p = current.path.length ? current.path + '*' : '';
			copy[current.idx] = [copy[this.idx], copy[this.idx] = copy[current.idx]][0];
			if(isSorted(copy)){
				finished = true;
				p += copy[current.idx] + '*' + this.move;
				if (confirm('Solved! See the sequence?')){
					$('#panel .loading-img').hide();
					$('#panel .movement-txt').show();
					runSequence(p, true);
				} else {
					$('#panel .loading-img').hide(); 
					$('#panel .btn-1').show();
				}
			} else if(!vis.has(copy.toString())){
				vis.add(copy.toString());
				var path = p + copy[current.idx] + '*' + this.move;
				var k = 0;
				for(var i = 0; i < copy.length; i++) if (i + 1 != copy[i]) k++;
				var hamming = (path.length + 1) / 4 + k;
				var node = {
						'list': copy.toString(), 'idx': this.idx, 
						'path': path, 'hamming': hamming
					};
				if(!queue.length) queue.push(node);
				else for(var i = 0; i < queue.length; i++){
					if(queue[i].hamming > hamming || i == queue.length - 1){
						queue.splice(i, 0, node);
						i = queue.length;
					}
				}
			}
		});
	}
}

function dfs(list, idx, path){
	if(!vis.has(list) && !finished){
		if(isSorted(list.split(','))){ 
			runSequence(path, true);
			finished = true; 
		} else {
			vis.add(list);
			var dir = getDirections(idx);	
			$(dir).each(function(){
				var copy = list; copy = copy.split(',');
				var p = path.length ? path + '*' : '';
				copy[idx] = [copy[this.idx], copy[this.idx] = copy[idx]][0];
				solve(copy.toString(), this.idx, p + copy[idx] + '*' + this.move);
			});
		}
	}
}

function getDirections(idx){
	var k = Math.floor(idx / n) * n;
	var dir = [];

	if(idx - n >= 0) dir.push({'idx': idx - n, 'move': 'd'}); // TOP
	if(idx - 1 >= k) dir.push({'idx': idx - 1, 'move': 'r'}); // LEFT
	if(idx + 1 <= k + n - 1) dir.push({'idx': idx + 1, 'move': 'l'}); // RIGHT
	if(idx + n <= n * m - 1) dir.push({'idx': idx + n, 'move': 'u'}); /// BOTTOM

	return dir;
}

function getList(){
	var list = [];
	$('.cell').each(function(){
		list[$(this).data('idx')] = $(this).data('val');
	});
	return list;
}

function isSorted(arr){
	for(var i = 0; i < arr.length;)
		if(arr[i++] != i) return false;
	return true;
}

function mess(list, idx){
	var seq = '';
	for(var i = 0; i < 100; i++){
		var dir = getDirections(idx);
		var k = Math.floor(Math.random() * dir.length);
		if(seq.length) seq += '*';	
		seq += list[dir[k].idx] + '*' + dir[k].move;
		list[idx] = [list[dir[k].idx], list[dir[k].idx] = list[idx]][0];
		idx = dir[k].idx;
	}
	runSequence(seq, false);	
}

function move(val, dir){
	var cell = $('[data-val="' + val + '"]');
	var gap = $('#cell-' + (m - 1) + '-' + (n - 1));
	var idx_tmp = gap.data('idx');
	gap
		.css({'left': cell.position().left, 'top': cell.position().top})
		.data('idx', $(cell).data('idx'));
	if(dir == 'u') cell.css({'top': cell.position().top - cell_size}).data('idx', idx_tmp);
	else if(dir == 'l') cell.css({'left': cell.position().left - cell_size}).data('idx', idx_tmp);
	else if(dir == 'r') cell.css({'left': cell.position().left + cell_size}).data('idx', idx_tmp);
	else if(dir == 'd') cell.css({'top': cell.position().top + cell_size}).data('idx', idx_tmp);
}

function runSequence(seq, anim){
	seq = seq.split('*');
	seq.reverse();
	if(anim){
		var interval = setInterval(function(){
			if(seq.length){
				var val = seq[seq.length - 1];
				seq.pop();
				var dir = '' + seq[seq.length - 1];
				seq.pop();
				var dir_text = dir == 'u' ? 'up' : dir == 'l' ? 'left' : dir == 'r' ? 'right' : 'down';
				$('#panel .movement-txt').html('<b>' + val + ' </b><i class="fa fa-arrow-' + dir_text + '"></i>');
				move(val, dir);
			} else{
				$('#panel .movement-txt').hide();
				$('#panel .btn-1').show();
				clearInterval(interval);
				cell_disabled = false;
			}
		}, 250);
	} else {
		$('#grid .cell').css({'transition': 'none'});
		while(seq.length){
			var val = seq[seq.length - 1];
			seq.pop();
			var dir = '' + seq[seq.length - 1];
			seq.pop();
			move(val, dir);
			setTimeout(function(){
				if(!seq.length) $('#grid .cell').css({'transition': 'top .1s, left .1s'});
				cell_disabled = false;
			}, 50);
		}
		
	}
}

$('document').ready(function(){

	var grid = $('#grid');
	var counter = 0;

	grid.width(cell_size * n).height(cell_size * m);

	for (var i = 0; i < m; i++){
		for (var j = 0; j < n; j++){
			grid.append('<div class="cell" id="cell-' + i + '-' + j + '" data-idx="' + counter + '" data-val="' + (++counter) + '">' + counter + '</div>');
			$('#cell-' + i + '-' + j).css({'top': cell_size * i, 'left': cell_size * j});
		}
	}

	var gap = $('#cell-' + (m - 1) + '-' + (n - 1));
	gap.css({'display': 'none'});

	$('.cell').on('click', function(){
		if(!cell_disabled){
			var dir = getDirections($(this).data('idx'));
			var list = getList();
			var cell = $(this);
			$(dir).each(function(){
				if(list[this.idx] == m * n){
					move(cell.data('val'), 
						this.move == 'u' ? 'd' : this.move == 'd' ? 'u' : this.move == 'l' ? 'r' : 'l');
					return false;
				}
			});
		}
	});

	$('#btn-solve').on('click', function(){
		cell_disabled = true;
		$('#panel .btn-1').hide();
		$('#panel .loading-img').show();
		finished = false; 
		vis.clear();
		queue = [];
		var current = getList();
		var k = 0;
		for(var i = 0; i < current.length; i++) if (i + 1 != current[i]) k++;
		var first = {'list': current.toString(), 'idx': gap.data('idx'), 'path': '', 'hamming': k};
		queue.push(first);
		vis.add(first.list);
		
		setTimeout(function(){
			
			if(!isSorted(getList())) bfs();
			else {
				alert('That\'s already solved, man!');
				$('#panel .btn-1').show();
				$('#panel .loading-img').hide();
			}
			
		}, 500);
		//dfs(getList().toString(), gap.data('idx'), '');

	});	
	$('#btn-mess').on('click', function(){ cell_disabled = true; mess(getList(), gap.data('idx'));});	

});