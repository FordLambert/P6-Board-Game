var Cell = function(Id) {
	this.Id = Id;
	this.texture = '';
	this.status = 'empty';
};

var BoardManager = function(place) {
	this.board = [];
	//usedCells is used when the engine start a game for not using twice the same cell
	this.usedCellsId = [];
	this.place = place;
	this.rowLetters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

//-----Getters
BoardManager.prototype.getCell = function(cellIndex) {
	return this.board[cellIndex];
};

BoardManager.prototype.getCellById = function(id) {
	for (var i = 0; i < this.board.length; i++) {
		if (this.getCell(i).Id == id) {
			return this.getCell(i);
		}
	}
};

BoardManager.prototype.getUsedCellId = function(index) {
	return this.usedCellsId[index];
};

//-----Setters
BoardManager.prototype.resetUsedCellList = function() {
	this.usedCellsId = [];
}

BoardManager.prototype.addUsedCellId = function(cellId) {
	this.usedCellsId.push(cellId);
};

BoardManager.prototype.addCell = function(cell) {
	this.board.push(cell);
};

//-----Other methods
BoardManager.prototype.createBoard = function(boardSize) {
	this.boardSize = boardSize;
	for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
		var letterIndex = this.rowLetters[rowIndex];

		for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {
			var cell = new Cell(letterIndex + cellIndex);
			this.addCell(cell);
		}

	}
};