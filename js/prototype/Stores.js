//Weapon store : it store weapon type objects
var WeaponStore = function() {
	this.weaponStoreList = [];
};

WeaponStore.prototype.addWeapon = function(weapon) {
	this.weaponStoreList.push(weapon);
};

WeaponStore.prototype.getWeapon = function(weaponIndex) {
	return this.weaponStoreList[weaponIndex];
};

//Player store : it store player type objects
var PlayerStore = function() {
	this.playerStoreList = [];
};

PlayerStore.prototype.addPlayer = function(player) {
	this.playerStoreList.push(player);
};

PlayerStore.prototype.getPlayer = function(playerIndex) {
	return this.playerStoreList[playerIndex];
};

//Cell store : it store the cells that will compose a board
var CellStore = function() {
	this.cellList = [];
};

CellStore.prototype.addCells = function(cellNumber) {
	for(var i = 1; i <= cellNumber; i ++) {
		var cell = new Cell(i);
		this.cellList.push(cell);
	}
};

CellStore.prototype.getCell = function(cellIndex) {
	return this.cellList[cellIndex];
};

CellStore.prototype.getCellById = function(domID) {
	console.log(domID);
	for(var i = 0; i < cellNumber; i ++) {
		if (domID == getCell(i)) {
			return getCell(i);
		}
	}

	return cellId;
};