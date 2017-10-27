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

Displayer.prototype.updateBoard = function() {
	for(var i = 0; i < manager.board.cellStore.cellList.length; i ++) {
		var actualCell = $('#' + (i + 1));
		actualCell.css('background-color', manager.board.cellStore.getCell(i).color);
	}
};

Displayer.prototype.updateCellStatus = function() {
	var i = 0;
	while (i < manager.playerStore.playerStoreList.length) {
		manager.board.cellStore.getCell((manager.playerStore.getPlayer(i).cell) - 1).color = manager.playerStore.getPlayer(i).color;
		this.updateBoard();
		i++;
	}
};

Displayer.prototype.resetCellStatus = function() {
	var i = 0;
	while (i < manager.cellStore.cellList.length) {
		manager.board.cellStore.getCell(i).color = '#706F69';
		this.updateBoard();
		i++;
	}
};