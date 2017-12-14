'use strict';
var Player = function(name, color, turnToPlay, texture) {
	this.name = name;
	this.movement = 3; //How far he can move
	this.weapon = {};
	this.life = 100;
	this.color = color;
	this.turnToPlay = turnToPlay; //true or false
	this.texture = texture;
	this.position = {}; //Where he is, nowhere at first
};

Player.prototype.move = function move(newCell, weaponOnCell) {
	this.position = newCell;
	$(document).trigger('logEvent', this.name + ' se déplace en ' + this.position.id);

	if (weaponOnCell != null) {
		this.pickUp(weaponOnCell);
	}
};

Player.prototype.pickUp = function(newWeapon) {
	this.weapon.position = this.position; //drop old weapon on this position
	this.weapon = newWeapon; //assign the new weapon as current weapon
	this.weapon.position = {}; //the new weapon isn't on board anymore
	$(document).trigger('logEvent', this.name + ' a ramassé l\'arme "' + this.weapon.name + '"');
};