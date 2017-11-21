var Player = function(name, color, turnToPlay, texture) {
	this.name = name;
	this.movement = 3;
	this.cell = '';
	this.weapon = {};
	this.life = 100;
	this.protected = false;
	this.color = color;
	this.turnToPlay = turnToPlay;
	this.texture = texture;
};

Player.prototype.isAlive = function() {
	aliveStatus = this.life <= 0 ? true : false;
	return aliveStatus;
};

Player.prototype.move = function move(newCell, weaponOnCell) {

	var newCell = newCell;
	this.cell = newCell.id;
	
	if (typeof weaponOnCell != 'undefined') {
		this.pickUp(weaponOnCell);
	}
};

Player.prototype.pickUp = function(weapon) {

	this.weapon.cell = this.cell
	this.weapon = weapon;
	this.weapon.cell = '';

	this.speak(this.name + ' a ramassé l\'arme "' + this.weapon.name + '"');

};

Player.prototype.defend = function() {
	this.protected = true;

	this.speak(this.name + ' est sur ses gardes.');
};

Player.prototype.attack = function(enemy) {

	this.protected = false;

	this.speak('Le ' + this.name + ' tire !');

	var hitPoints = 0;
	if (enemy.protected) {

		hitPoints = this.weapon.damage / 2;
		this.speak(enemy.name + ' a paré la moitié des dégats et n\'en reçoit que ' + hitPoints + ' !');

	} else {

		hitPoints = this.weapon.damage;
		this.speak(enemy.name + ' a reçu ' + hitPoints + ' points de dégats !');
	}
	enemy.life -= hitPoints;
};

//I need to find a nice way ro remove the call to gameEngine, inject gameEffectManager ?
Player.prototype.speak = function(sentence) {
	gameEngine.gameEffectManager.displayGameInfos(sentence);
};