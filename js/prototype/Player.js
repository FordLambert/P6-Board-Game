var Player = function(name, color, turnToPlay, cell) {
	//all action must depend on an 'if not dead' condition
	this.name = name;
	this.cell = cell;
	this.weapon = {};
	this.life = 100;
	this.protected = false;
	this.color = color;
	this.turnToPlay = turnToPlay;

};

Player.prototype.move = function move(direction) {
	this. protected = false;
	$('#board').click(function() {
		console.log('Le ' + this.name + ' se déplace');
		manager.choosePlayerActions('combat');
		manager.removeEvent('#board');
	}.bind(this));
};

Player.prototype.pickUp = function(weapon) {
	this.weapon = weapon;
	console.log(this.name + ' a ramassé l\'arme "' + this.weapon + '"');
};

Player.prototype.isAlive = function() {
	if (this.life <= 0) {
		this.life = 0;
		return false;
	} else {
		return true;
	}
};

Player.prototype.shoot = function() {
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

	manager.playTurns();
};

Player.prototype.defend = function() {
	this.protected = true;
	console.log(this.name + ' est sur la défensif et ne subira que la moitié des dégats au prochain tour');
	manager.playTurns();
};


//we'll see if this stay here or if it's a manager job
Player.prototype.canShoot = function() {
	if (manager.getDistance() == 0) {
		return true;
	} else {
		return false;
	}
};