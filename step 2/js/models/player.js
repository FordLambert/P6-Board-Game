var Player = function(name, color, turnToPlay, texture) {
	this.name = name;
	this.movement = 3;
	this.cell = '';
	this.weapon = {};
	this.life = 100;
	this.color = color;
	this.texture = texture;
	this.turnToPlay = turnToPlay;
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

//I need to find a nice way ro remove the call to gameEngine, inject gameEffectManager ?
Player.prototype.speak = function(sentence) {
	gameEngine.gameEffectManager.displayGameInfos(sentence);
};