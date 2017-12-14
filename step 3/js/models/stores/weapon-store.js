'use strict';
var WeaponStore = function() {
	this.weaponStoreList = [];
};

WeaponStore.prototype.addWeapon = function(weapon) {
	this.weaponStoreList.push(weapon);
};

WeaponStore.prototype.getWeapon = function(weaponIndex) {
	return this.weaponStoreList[weaponIndex];
};