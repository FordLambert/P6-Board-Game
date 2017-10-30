var Cell = function(Id) {
	this.Id = Id;
	this.texture = '';
	this.status = 'empty';
};

var BoardMaker = function(place) {
	this.board = [];
	this.place = place;
	this.rowLetters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

BoardMaker.prototype.addCell = function(cell) {
	this.board.push(cell);
};

BoardMaker.prototype.getCell = function(cellIndex) {
	return this.board[cellIndex];
};

BoardMaker.prototype.getCellById = function(id) {
	for (var i = 0; i < this.board.length; i++) {
		if (this.getCell(i).Id == id) {
			return this.getCell(i);
		}
	}
};

BoardMaker.prototype.createBoard = function(boardSize) {
	this.boardSize = boardSize;
	for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
		var letterIndex = this.rowLetters[rowIndex];

		for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {
			var cell = new Cell(letterIndex + cellIndex);
			this.addCell(cell);
		}

	}
};