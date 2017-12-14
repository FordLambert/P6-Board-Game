'use strict';
var BoardManager = function(boardWrapper) {
	this.boardSize = 0; //Board created will be a square of boardsize * boardsize
	this.board = {}; //Associative array, will contain cells
	this.boardWrapper = boardWrapper;
	this.rowLetters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

BoardManager.prototype.getCell = function(cellId) {
	return this.board[cellId];
};

BoardManager.prototype.createBoard = function(boardSize) {

	if (!(boardSize > 26) && !(boardSize <= 6)) {
		this.boardSize = boardSize;

		//'boardsize' (number) of row to create
		for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
			var letterIndex = this.rowLetters[rowIndex];

			//'boardsize' (number) of columns to create
			for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {
				var newId = letterIndex + '-' + cellIndex
				var cell = new Cell(newId);

				this.board[newId] = cell;
			}
		}
	} else {
		console.log('Error: board size must be at least 6 and maximum 26');
	}
};

BoardManager.prototype.resetCell = function(cell) {
	cell.texture = '';
	cell.status = CELL_STATUS_EMPTY;
};

BoardManager.prototype.checkAndReturnWeapon = function(cell) {

	for (var weaponIndex = 0; weaponIndex < gameEngine.getWeaponsNumber(); weaponIndex++) {
		var weapon = gameEngine.weaponStore.getWeapon(weaponIndex);

		if (cell == weapon.position) {
			return weapon;
		}
	}
	return null
};

//Compare weapons and players position with board's cells
BoardManager.prototype.updateCellsAttributes = function(weaponList, playerList) {

	//scan all cells on board
	for (var cellIndex in this.board) {
		var cell = this.board[cellIndex];

		//If a cell match a weapon position, be sure the cell status say it
		for (var weaponIndex in weaponList) {
			var weapon = weaponList[weaponIndex]

			if (cell == weapon.position) {
			    this.assignCellTo(weapon, cell);
			}
		}

		//If a cell match a player position, be sure the cell status say it
		for (var playerIndex in playerList) {
			var player = playerList[playerIndex];

			if (cell == player.position) {
			    this.assignCellTo(player, cell);
			}
		}
	}
};

BoardManager.prototype.assignCellTo = function(object, cell) {
	cell.texture = object.texture;

	if (Player.prototype.isPrototypeOf(object)) {
		cell.status = CELL_STATUS_PLAYER;

	} else if (Weapon.prototype.isPrototypeOf(object)) {
		cell.status = CELL_STATUS_WEAPON;

	} else if (Obstacle.prototype.isPrototypeOf(object)) {
		cell.status = CELL_STATUS_BLOCKED;
		
	} else {
		console.log('Error: object type unknow');
	}
};