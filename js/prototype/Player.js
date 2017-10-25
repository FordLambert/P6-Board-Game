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

	

	if (this.isAlive()) {
		this. protected = false;
		//something like : if the cell that had been clicked is not more than 3 cell away AND if it's not a wall the 
		//player will mmove on it
		i = 0;
		while (i < 4) {
			if (direction == up) {
				row --;
			} else if (direction == down) {
				row ++;
			} else if (direction == right){
				col ++;
			} else if (direction == left) {
				col --;
			} else {
				console.log('no direction had been choosen');
			};
			i++; //this is not good, what if we want to go up only one time ? and one to the right after that ?
		}
	}
};

//actual state is satisfactoring
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
	if (this.isAlive()) {
		var hitPoints = 0;
		if (/*this.canShoot() &&*/ enemy.protected = false) {
			hitPoints = weapon.damage;
			console.log(enemy.name + ' a reçu ' + weapon.damage + ' points de dégats !');
		} else if (/*this.canShoot() &&*/ enemy.protected = true) {
			hitPoints = weapon.damage / 2;
			console.log(enemy.name + ' a paré la moitié des dégats et n\'en reçoit que ' + weapon.damage + ' !');
		}
		enemy.life -= hitPoints;
	} else {
		console.log('Vous ne pouvez pas tirer d\'ici !');
	}
};

Player.prototype.protect = function() {
	this. protected = true;
	console.log(this.name + ' est sur la défensif et ne subira que la moitié des dégats au prochain tour');
};

Player.prototype.isMyTurn = function() {
	if (this.myturn == true) {

	}
}

Player.prototype.getNearestEnemy = function() {

};

Player.prototype.canShoot = function() {
	if (manager.getDistance() == 0) {
		return true;
	} else {
		return false;
	}
};

Player.prototype.setEnemy = function(enemy) {
	this.enemy = enemy;
};