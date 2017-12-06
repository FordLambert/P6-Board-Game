var Player = function(name, color, turnToPlay, texture, logsDetailsManager) {
	this.name = name;
	this.movement = 3; //How far he can move
	this.weapon = {};
	this.life = 100;
	this.color = color;
	this.turnToPlay = turnToPlay; //true or false
	this.texture = texture;
	this.position = {}; //Where he is, nowhere at first
	this.logsDetailsManager = logsDetailsManager;
};

Player.prototype.move = function move(newCell, weaponOnCell) {
	this.position = newCell;
	
	if (weaponOnCell != null) {
		this.pickUp(weaponOnCell);
	}
};

Player.prototype.pickUp = function(newWeapon) {
	this.weapon.position = this.position; //drop old weapon on this position
	this.weapon = newWeapon; //assign the new weapon as current weapon
	this.weapon.position = {}; //the new weapon isn't on board anymore
	this.speak(this.name + ' a ramassé l\'arme "' + this.weapon.name + '"');
};

Player.prototype.speak = function(sentence) {
	this.logsDetailsManager.displayGameInfos(sentence);
};