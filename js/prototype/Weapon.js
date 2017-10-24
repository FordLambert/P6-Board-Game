var Weapon = function(name, damage) {
	this.name = name;
	this.damage = damage;
	this.cell = ;//find a way to select a random cell to place it on creation.
};

var WeaponStore = function() {
	this.weaponStore = [];
};

WeaponStore.prototype.addWeapon = function(1, 2, 3, 4, 5) {
	var i = 1;
	while (i < 6) {
		this.weaponStore.push(i);
	}
};

WeaponStore.prototype.getWeapon = function(weaponIndex) {
	return this.WeaponStore[weaponIndex];
};