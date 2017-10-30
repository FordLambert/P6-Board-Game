//if a function whatsoever had an impact on what the user see, it should be here 
var Displayer = function() {
	this.actionButton = $('.action-button');
	this.changingBackground = $('.progress-bar');
};

Displayer.prototype.changeTheme = function(color) {
	this.changingBackground.attr( 'class', 'progress-bar progress-bar-striped active');
	this.changingBackground.addClass(this.updateBakcgroundColor(color));
	this.actionButton.attr( 'class', 'col-md-4 actions-buttons');
	this.actionButton.addClass(color);
};

Displayer.prototype.updateBakcgroundColor = function(color) {
	var strippedColor = '';
	switch (color) {
	    case 'red':
	        strippedColor = 'progress-bar-danger';
	        break;
	    case 'blue':
	       	strippedColor = '';
	        break;
	    default:
	        console.log('Erreur: Couleur Inconnue');
	}
	return strippedColor;
};

Displayer.prototype.displayBoard = function(boardMaker) {

	for (var i = 0; i < boardMaker.board.length; i ++) {
		var newCell = boardMaker.getCell(i);
		newCell = $('<div>').addClass('cell').attr('id', newCell.Id);
		$(boardMaker.place).append(newCell);
			/*newCell.mouseover(function() {
				manager.getCurrentCellId($(this).attr('id'));
			});*/
	}
	var h = $('.cell:last-of-type').width();
	$('.cell').css({height: h, lineHeight: h + 'px'});
};

Displayer.prototype.updateBoard = function() {
	//for(var i = 0; i < manager.board.cellStore.cellList.length; i ++) {
		var cells = $('.cell');
		var actualCell = $('#' + (i + 1));
		actualCell.css('background-image', 'url(pictures/' + manager.board.cellStore.getCell(i).texture + ')');
	//}
};

Displayer.prototype.updateCellStatus = function() {
	var i = 0;
	while (i < manager.getPlayerNumber()) {
		var cell = $('#E5'/*manager.playerStore.getPlayer(i).cell*/);
		cell.texture = manager.playerStore.getPlayer(i).texture;
		cell.status = 'has-player';
		i++;
	}

	/*while (i < manager.getPlayerNumber()) {
		var cell = manager.board.cellStore.getCell((manager.playerStore.getPlayer(i).cell) - 1)
		cell.texture = manager.playerStore.getPlayer(i).texture;
		cell.status = 'has-player';
		i++;
	}*/
	this.updateBoard();
};

Displayer.prototype.resetCellStatus = function() {
	var i = 0;
	while (i < manager.cellStore.cellList.length) {
		manager.board.cellStore.getCell(i).texture = '';
		i++;
	}
	this.updateBoard();
};