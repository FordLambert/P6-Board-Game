'use strict';
var GameEffectManager = function(boardManager) {
	this._selectors = {
		'actionButtons': '.action-button',
		'changingBackground': '.progress-bar',
		'columnDivDisplay': '.column-display',
		'rowDivDisplay': '.row-display'
	}
	this.boardManager = boardManager;
	this.$actionButtons = $(this._selectors.actionButtons);
	this.$changingBackground = $(this._selectors.changingBackground);
	this.$columnDivDisplay = $(this._selectors.columnDivDisplay); //where to display column (numbers)
	this.$rowDivDisplay = $(this._selectors.rowDivDisplay); //where to display row (letters)
};

GameEffectManager.prototype.changeTheme = function(color) {
	this.$changingBackground.attr('class', 'progress-bar progress-bar-striped active');
	this.$changingBackground.addClass(this.getNewBgClass(color));
	this.$actionButtons.attr('class', 'col-xs-12 action-button btn');
	this.colorActionButtons(color);
};

GameEffectManager.prototype.colorActionButtons = function(color) {
	this.$actionButtons.each(function() {

		if (!$(this).prop('disabled')) {
			$(this).addClass(color);
		}
	});
};

GameEffectManager.prototype.getNewBgClass = function(color) {
	var strippedColor = '';

	switch (color) {

	    case 'red':
	        strippedColor = 'progress-bar-danger';
	        break;

	    case 'blue':
	       	strippedColor = ''; //Default color is blue
	        break;

	    default:
	        console.log('Error: unknown color');
	}
	return strippedColor;
};

GameEffectManager.prototype.createVisualFromBoardObject = function() {

	for(var cellIndex in this.boardManager.board) {
		var newCell = this.boardManager.board[cellIndex];
		newCell = $('<div>').addClass('cell').attr('id', newCell.id);
		$(this.boardManager.boardWrapper).append(newCell);
	}

	for (var i = 0; i < this.boardManager.boardSize; i++) {
		var columnIndex = this.boardManager.rowLetters[i];
		this.$columnDivDisplay.append('<p>' + columnIndex + '</p>');
		this.$rowDivDisplay.append('<p>' + (i + 1) + '</p>');
	}
};

GameEffectManager.prototype.updateVisualFromBoardObject = function() {	

	for(var cellIndex in this.boardManager.board) {
		var cell = this.boardManager.board[cellIndex];
		var div = $('#' + cell.id);
		div.css('background-image', 'url(pictures/' + cell.texture + ')');
		div.attr('class', 'cell' +  ' ' + cell.status);
	}
};

GameEffectManager.prototype.addClassAccessible = function(cellIdList) {
	
	for (var i = 0; i < cellIdList.length; i++) {
		$('#' + cellIdList[i]).addClass('accessible');
	}
};

GameEffectManager.prototype.resetBoardVisual = function() {

	for(var cellIndex in this.boardManager.board) {
		var cell = this.boardManager.board[cellIndex];
		this.boardManager.resetCell(cell);
	}
	this.updateVisualFromBoardObject();
};