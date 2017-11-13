var Cell = function(id) {
	this.id = id;
	this.texture = '';
	this.status = 'empty';
};

var BoardManager = function(divId) {
	this.board = [];
	//usedCells used when the engine start a game for not using twice the same cell on random placement
	this.usedCellsid = [];
	this.divId = divId;
	this.rowLetters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

//-----Getters
BoardManager.prototype.getCell = function(cellIndex) {
	return this.board[cellIndex];
};

BoardManager.prototype.getCellByid = function(id) {
	for (var i = 0; i < this.board.length; i++) {
		if (this.getCell(i).id == id) {
			return this.getCell(i);
		}
	}
};

BoardManager.prototype.getUsedCellid = function(index) {
	return this.usedCellsid[index];
};

//-----Setters
BoardManager.prototype.resetUsedCellList = function() {
	this.usedCellsid = [];
}

BoardManager.prototype.addUsedCellid = function(cellid) {
	this.usedCellsid.push(cellid);
};

BoardManager.prototype.addCell = function(cell) {
	this.board.push(cell);
};

BoardManager.prototype.resetCell = function(cellid) {
	cell = this.getCellByid(cellid)
	cell.texture = '';
	cell.status = 'empty';
};

//-----Other methods
BoardManager.prototype.createBoard = function(boardSize) {
	this.boardSize = boardSize;
	for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
		var letterIndex = this.rowLetters[rowIndex];

		for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {
			var cell = new Cell(letterIndex + '-' + cellIndex);
			this.addCell(cell);
		}

	}
};

BoardManager.prototype.checkPlayerPresence = function() {
	for (var i = 0; i < this.board.length; i++) {
		var cell = this.getCell(i);
		for (var p = 0; p < gameEngine.getPlayersNumber(); p ++) {
			var player = gameEngine.playerStore.getPlayer(p);
			if (cell.id == player.cell) {
			    cell.texture = player.texture;
			    cell.status = 'has-player';
			}
		}
	}
};

BoardManager.prototype.checkWeaponPresence = function() {
	for (var i = 0; i < this.board.length; i++) {
		var cell = this.getCell(i);
		for (var p = 0; p < gameEngine.getWeaponsNumber(); p ++) {
			var weapon = gameEngine.weaponStore.getWeapon(p);
			if (cell.id == weapon.cell) {
			    cell.texture = weapon.texture;
			    cell.status = 'has-weapon';
			}
		}
	}
};

BoardManager.prototype.checkAndReturnWeapon = function(cellid) {
	for (var i = 0; i < gameEngine.getWeaponsNumber(); i++) {
		var weapon = gameEngine.weaponStore.getWeapon(i);
		if (cellid == weapon.cell) {
			return weapon;
		}
	}
};