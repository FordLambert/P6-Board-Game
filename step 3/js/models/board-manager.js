var BoardManager = function(divId) {
	this.boardSize = 0; //board created will be a square of boardsize * boardsize
	this.board = {}; //associative array, will contain cells
	this.divId = divId;
	this.rowLetters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	//usedCells used only when the engine start a game for not using twice the same cell on random placement
	this.usedCellsId = [];
};

BoardManager.prototype.getCell = function(cellId) {
	return this.board[cellId];
};

BoardManager.prototype.createBoard = function(boardSize) {

	if (!(boardSize > 26) && !(boardSize <= 4)) {
		this.boardSize = boardSize;

		// 'boardsize' (number) row to create
		for (var rowIndex = 0; rowIndex < boardSize; rowIndex++) {
			var letterIndex = this.rowLetters[rowIndex];

			// 'boardsize' (number) columns to create
			for (var cellIndex = 1; cellIndex <= boardSize; cellIndex++) {

				var newId = letterIndex + '-' + cellIndex
				var cell = new Cell(newId);
				this.board[newId] = cell;
			}

		}
	} else {
		console.log('Error: board size must be at least 4 and maximum 26');
	}
};

BoardManager.prototype.getUsedCellid = function(index) {
	return this.usedCellsId[index];
};

BoardManager.prototype.resetUsedCellList = function() {
	this.usedCellsId = [];
};

BoardManager.prototype.addUsedCellid = function(cellid) {
	this.usedCellsId.push(cellid);
};

BoardManager.prototype.resetCell = function(cell) {
	cell.texture = '';
	cell.status = CELL_STATUS_EMPTY;
};

//if there is a weapon on this cell, return it
BoardManager.prototype.checkAndReturnWeapon = function(cell) {
	for (var weaponIndex = 0; weaponIndex < gameEngine.getWeaponsNumber(); weaponIndex++) {
		var weapon = gameEngine.weaponStore.getWeapon(weaponIndex);
		if (cell.id == weapon.cell.id) {
			return weapon;
		}
	}
};

//compare weapon and player cells with board's cells
//this can maybe be removed and shortened in the engine
BoardManager.prototype.updateBoard = function(weaponStore, playerStore) {
	this.updateWeaponPresence(weaponStore);
	this.updatePlayerPresence(playerStore);
};

BoardManager.prototype.updatePlayerPresence = function(playerStore) {

	for(var key in this.board) {

		var cell = this.board[key];

		for (var playerIndex = 0; playerIndex < playerStore.playerStoreList.length; playerIndex++) {

			var player = playerStore.getPlayer(playerIndex);

			if (cell.id == player.cell.id) {
			    cell.texture = player.texture;
			    cell.status = CELL_STATUS_PLAYER;
			}
		}
	}
};

BoardManager.prototype.updateWeaponPresence = function(weaponStore) {
	for(var key in this.board) {

		var cell = this.board[key];

		for (var weaponIndex = 0; weaponIndex < weaponStore.weaponStoreList.length; weaponIndex++) {

			var weapon = weaponStore.getWeapon(weaponIndex);

			if (cell.id == weapon.cell.id) {
			    cell.texture = weapon.texture;
			    cell.status = CELL_STATUS_WEAPON;
			}
		}
	}
};