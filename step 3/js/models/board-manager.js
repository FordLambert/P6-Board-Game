//-----Cell
var Cell = function(id) {
	this.id = id;
	this.texture = '';
	this.status = 'empty';
};

//-----BoardManager
var BoardManager = function(divId) {
	this.board = [];
	this.divId = divId;
	this.rowLetters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	//usedCells used when the engine start a game for not using twice the same cell on random placement
	this.usedCellsId = [];
};

//-----Getters
BoardManager.prototype.getCell = function(cellIndex) {
	return this.board[cellIndex];
};

BoardManager.prototype.getCellById = function(id) {
	for (var cellIndex = 0; cellIndex < this.board.length; cellIndex++) {
		if (this.getCell(cellIndex).id == id) {
			return this.getCell(cellIndex);
		}
	}
};

BoardManager.prototype.getUsedCellid = function(index) {
	return this.usedCellsId[index];
};

//-----Setters
BoardManager.prototype.resetUsedCellList = function() {
	this.usedCellsId = [];
};

BoardManager.prototype.addUsedCellid = function(cellid) {
	this.usedCellsId.push(cellid);
};

BoardManager.prototype.addCell = function(cell) {
	this.board.push(cell);
};

BoardManager.prototype.resetCell = function(cellId) {
	cell = this.getCellById(cellId)
	cell.texture = '';
	cell.status = 'empty';
};

//-----Other methods
BoardManager.prototype.createBoard = function(boardSize) {
	//where boardsize represent the number of row/columns (square)
	this.boardSize = boardSize;

	for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
		var letterIndex = this.rowLetters[rowIndex];

		for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {
			var cell = new Cell(letterIndex + '-' + cellIndex);
			this.addCell(cell);
		}

	}
};

//if there is a weapon on this cell, return it
BoardManager.prototype.checkAndReturnWeapon = function(cellid) {
	for (var weaponIndex = 0; weaponIndex < gameEngine.getWeaponsNumber(); weaponIndex++) {
		var weapon = gameEngine.weaponStore.getWeapon(weaponIndex);
		if (cellid == weapon.cell) {
			return weapon;
		}
	}
};

//compare weapon and player cells with board's cells
BoardManager.prototype.updateBoard = function(weaponStore, playerStore) {
	this.updateWeaponPresence(weaponStore);
	this.updatePlayerPresence(playerStore);
};

BoardManager.prototype.updatePlayerPresence = function(playerStore) {
	for (var cellIndex = 0; cellIndex < this.board.length; cellIndex++) {

		var cell = this.getCell(cellIndex);

		for (var playerIndex = 0; playerIndex < playerStore.playerStoreList.length; playerIndex++) {

			var player = playerStore.getPlayer(playerIndex);

			if (cell.id == player.cell) {
			    cell.texture = player.texture;
			    cell.status = 'has-player';
			}
		}
	}
};

BoardManager.prototype.updateWeaponPresence = function(weaponStore) {
	for (var cellIndex = 0; cellIndex < this.board.length; cellIndex++) {

		var cell = this.getCell(cellIndex);

		for (var weaponIndex = 0; weaponIndex < weaponStore.weaponStoreList.length; weaponIndex++) {

			var weapon = weaponStore.getWeapon(weaponIndex);

			if (cell.id == weapon.cell) {
			    cell.texture = weapon.texture;
			    cell.status = 'has-weapon';
			}
		}
	}
};