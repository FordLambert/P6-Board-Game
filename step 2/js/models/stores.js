//-----WeaponStore
var WeaponStore = function() {
	this.weaponStoreList = [];
};

WeaponStore.prototype.addWeapon = function(weapon) {
	this.weaponStoreList.push(weapon);
};

WeaponStore.prototype.getWeapon = function(weaponIndex) {
	return this.weaponStoreList[weaponIndex];
};

//-----PlayerStore
var PlayerStore = function() {
	this.playerStoreList = [];
};

PlayerStore.prototype.addPlayer = function(player) {
	this.playerStoreList.push(player);
};

PlayerStore.prototype.getPlayer = function(playerIndex) {
	return this.playerStoreList[playerIndex];
};