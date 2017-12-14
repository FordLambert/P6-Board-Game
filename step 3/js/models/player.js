'use strict';
var Player = function(name, color, turnToPlay, texture) {
	this.name = name;
	this.movement = 3; //How far he can move
	this.weapon = {};
	this.life = 100;
	this.protected = false; //Defense mode
	this.color = color;
	this.turnToPlay = turnToPlay; //true or false
	this.texture = texture;
	this.position = {}; //Where he is, nowhere at first
};

Player.prototype.isAlive = function() {
	return this.life <= 0 ? false : true;
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

Player.prototype.defend = function() {
	this.protected = true;
	$(document).trigger('logEvent', this.name + ' est sur ses gardes.');
};

Player.prototype.attack = function(enemy) {
	this.protected = false;
	$(document).trigger('logEvent', this.name + ' attaque !');
	var hitPoints = 0;

	if (enemy.protected) {
		hitPoints = this.weapon.damage / 2;
		$(document).trigger('logEvent', enemy.name + ' a paré la moitié des dégats et n\'en reçoit que ' + hitPoints + ' !');

	} else {
		hitPoints = this.weapon.damage;
		$(document).trigger('logEvent', enemy.name + ' a reçu ' + hitPoints + ' points de dégats !');
	}
	enemy.life -= hitPoints;
};