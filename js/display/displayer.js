//if a function whatsoever had an impact on what the user see, it should be here 
var Displayer = function() {};

Displayer.prototype.changeTheme = function(color) {
	$('.progress-bar').removeAttr('progress-bar-success');
	if (color == 'red') {
		$('.changing-button').removeClass('blue');
		$('.changing-button').addClass('red');
		$('.progress-bar').addClass('progress-bar-danger');
	} else if (color == 'blue') {
		$('.changing-button').removeClass('red');
		$('.changing-button').addClass('blue');
		$('.progress-bar').removeClass('progress-bar-danger');
	} else {
		console.log('Theme color error: red or blue accepted');
	}
};

Displayer.prototype.updateBoard = function() {
	for(var i = 0; i < manager.board.cellStore.cellList.length; i ++) {
		var actualCell = $('#' + (i + 1));
		actualCell.css('background-color', manager.board.cellStore.getCell(i).color);
	}
};

Displayer.prototype.updateCellStatus = function() {
	var i = 0;
	while (i < manager.playerStore.playerStoreList.length - 1) {
		manager.board.cellStore.getCell((manager.playerStore.getPlayer(i).cell) - 1).color = manager.playerStore.getPlayer(i).color;
		this.updateBoard();
		i++;
	}
};

Displayer.prototype.resetCellStatus = function() {
	var i = 0;
	while (i < manager.cellStore.cellList.length - 1) {
		manager.board.cellStore.getCell(i).color = '#706F69';
		this.updateBoard();
		i++;
	}
};