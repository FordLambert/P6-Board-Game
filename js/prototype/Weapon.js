var Weapon = function(name, damage, texture) {
	this.name = name;
	this.damage = damage;
	this.texture = texture;
	this.cell = '';//find a way to select a random cell to place it on creation.
};