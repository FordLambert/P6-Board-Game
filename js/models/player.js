var Player = function(name, color, turnToPlay, texture) {
	this.name = name;
	this.movement = 3,
	this.cell = '';
	this.weapon = {};
	this.life = 100;
	this.protected = false;
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

	//I need to set a personnal event here to say that, then the engine display the message
	gameEngine.gameEffectManager.displayGameInfos(this.name + ' a ramassé l\'arme "' + this.weapon.name + '"');

};

Player.prototype.shoot = function() {
	this. protected = false;
	console.log('Le ' + this.name + ' tire !');

	/*var hitPoints = 0;
	if (/*this.canShoot() && enemy.protected = false) {
		hitPoints = weapon.damage;
		console.log(enemy.name + ' a reçu ' + weapon.damage + ' points de dégats !');
	} else if (/*this.canShoot() && enemy.protected = true) {
		hitPoints = weapon.damage / 2;
		console.log(enemy.name + ' a paré la moitié des dégats et n\'en reçoit que ' + weapon.damage + ' !');
	}
	enemy.life -= hitPoints;*/
};

Player.prototype.defend = function() {
	this.protected = true;
	console.log(this.name + ' se prépare à prendre un coup.');
};


//we'll see if this stay here or if it's a manager job
Player.prototype.canShoot = function() {
	if (gameEngine.getDistance() == 0) {
		return true;
	} else {
		return false;
	}
};