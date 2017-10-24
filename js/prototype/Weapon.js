var Weapon = function(name, damage) {
	this.name = name;
	this.damage = damage;
	this.cell = '';//find a way to select a random cell to place it on creation.
};

var WeaponStore = function() {
	this.weaponStoreList = [];
};

WeaponStore.prototype.addWeapon = function(weapon) {
	this.weaponStoreList.push(weapon);
};

WeaponStore.prototype.getWeapon = function(weaponIndex) {
	return this.weaponStoreList[weaponIndex];
};