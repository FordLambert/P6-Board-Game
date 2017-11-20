var Player = function(name, color, turnToPlay, texture) {
	this.name = name;
	this.movement = 3;
	this.cell = '';
	this.weapon = {};
	this.life = 100;
	this.protected = false;
	this.color = color;
	this.texture = texture;
	this.turnToPlay = turnToPlay;
};

Player.prototype.isAlive = function() {
	alive = this.life <= 0 ? true : false;
	return alive;
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

	//I need to set a personnal event here to say that, then the engine display the message
	gameEngine.gameEffectManager.displayGameInfos(this.name + ' a ramassé l\'arme "' + this.weapon.name + '"');

};

Player.prototype.defend = function() {
	this.protected = true;

	//replace this with personnal event -> observer
	console.log(this.name + ' est sur ses gardes.');
};

Player.prototype.attack = function(enemy) {

	this.protected = false;

	//replace this with personnal event -> observer
	console.log('Le ' + this.name + ' tire !');

	var hitPoints = 0;
	if (enemy.protected = false) {
		hitPoints = this.weapon.damage;

		//replace this with personnal event -> observer
		console.log(enemy.name + ' a reçu ' + hitPoints + ' points de dégats !');

	} else if (enemy.protected = true) {
		hitPoints = this.weapon.damage / 2;

		//replace this with personnal event -> observer
		console.log(enemy.name + ' a paré la moitié des dégats et n\'en reçoit que ' + hitPoints + ' !');
		
	}
	enemy.life -= hitPoints;
};