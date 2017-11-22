var BoardManager = function(divId) {
	this.board = []; //contain a list of cells
	this.divId = divId; //rename boardContainer
	this.rowLetters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	//usedCells used when the engine start a game for not using twice the same cell on random placement
	this.usedCellsid = [];
};

BoardManager.prototype.getCell = function(cellIndex) {
	return this.board[cellIndex];
};

BoardManager.prototype.getCellByid = function(id) {
	for (var cellIndex = 0; cellIndex < this.board.length; cellIndex++) {
		if (this.getCell(cellIndex).id == id) {
			return this.getCell(cellIndex);
		}
	}
};

BoardManager.prototype.getUsedCellid = function(index) {
	return this.usedCellsid[index];
};

BoardManager.prototype.resetUsedCellList = function() {
	this.usedCellsid = [];
};

BoardManager.prototype.addUsedCellid = function(cellid) {
	this.usedCellsid.push(cellid);
};

BoardManager.prototype.addCell = function(cell) {
	this.board.push(cell);
};

BoardManager.prototype.resetCell = function(cellid) { //inject cell not cellId
	cell = this.getCellByid(cellid)
	cell.texture = '';
	cell.status = 'empty';
};

BoardManager.prototype.createBoard = function(boardSize) {
	//where boardsize represent the number of row/columns (square)
	this.boardSize = boardSize;//useless ?

	for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
		var letterIndex = this.rowLetters[rowIndex];

		for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {
			var cell = new Cell(letterIndex + '-' + cellIndex);
			this.addCell(cell);
		}

	}
};