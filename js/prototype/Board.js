var Cell = function(Id) {
	this.Id = Id;
	this.texture = '';
	this.status = 'empty';
};

var BoardMaker = function(/*cellStore,*/ place) {
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

BoardMaker.prototype.createBoard = function(boardSize) {
	for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
		var letterIndex = this.rowLetters[rowIndex];

		for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {
			var cell = new Cell(letterIndex + cellIndex);
			this.addCell(cell);
		}

	}
};