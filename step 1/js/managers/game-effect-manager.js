var GameEffectManager = function(boardManager) {
	this._selectors = {
		'changingBackground': '.progress-bar',
		'columnDivDisplay': '.column-display',
		'rowDivDisplay': '.row-display'
	}
	this.boardManager = boardManager;
	this.$changingBackground = $(this._selectors.changingBackground);
	this.$columnDivDisplay = $(this._selectors.columnDivDisplay); //where to display column (numbers)
	this.$rowDivDisplay = $(this._selectors.rowDivDisplay); //where to display row (letters)
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

GameEffectManager.prototype.resetBoardVisual = function() {

	for(var cellIndex in this.boardManager.board) {
		var cell = this.boardManager.board[cellIndex];
		this.boardManager.resetCell(cell);
	}
	this.updateVisualFromBoardObject();
};