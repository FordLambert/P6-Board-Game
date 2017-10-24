var Player = function(name, color) {
	//all action must depend on an 'if not dead' condition
	this.name = '';
	this.cell = ''; //find a way to select a cell randomly when the game start
	this.weapon = {};
	this.life = 100;
	this.protected = false;
	this.color = '';
	this.alive = true; //at first, if not anymore the game end

};

/*Player.prototype.move = function move(direction) {
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
};*/

//actual state is satisfactoring
Player.prototype.pickUp = function pickUp(weapon) {
	this.weapon = weapon;
	console.log(this.color + ' a rammssé l\'arme "' + this.weapon + '"');
};

Player.prototype.isAlive = function() {
	if (this.life <= 0) {
		this.life = 0;
		return false;
	} else {
		return true;
	}
};

//actual state is satisfactoring
Player.prototype.actions = function() {
	if
}

Player.prototype.shoot = function shoot() {
	if (this.canShoot) {
		var hitPoints = 0;
		if (/*this.canShoot() &&*/ enemy.protected = false) {
			hitPoints = weapon.damage;
			console.log(enemy.name + ' a reçu ' + weapon.damage + ' points de dégats !');
		} else if (/*this.canShoot() &&*/ enemy.protected = true) {
			hitPoints = weapon.damage / 2;
			console.log(enemy.name + ' a paré la moitié des dégats et n\'en reçoit que ' + weapon.damage + ' !');
		}
		enemy.life = enemy.life - hitPoints;
	} else {
		console.log('Vous ne pouvez pas tirer d\'ici !');
	}
};

//actual state is satisfactoring
Player.prototype.protect = function protect() {
	this. protected = true; //must be set to false on the next action
	console.log(this.name + ' est sur la défensif et ne subira que la moitié des dégats au prochain tour');
};

Player.prototype.isMyTurn = function() {
	if (this.myturn == true) {

	}
}

Player.prototype.play = function play(enemy) {
	this.setEnemy(enemy);
	if (this.isAlive()) {
		//this.move();
		console.log(this.name + 'bouge');
		this.actions();
	} else {
		manager.endGame();
	}
};

Player.prototype.canShoot = function() {
	if (manager.getDistance() == 0) {
		return true;
	} else {
		return false;
	}
};

Player.prototype.setEnemy = function(enemy) {
	if (this.enemy != enemy) {
		this.enemy = enemy;
	}
};

var playerRed = new Player('Joueur Rouge', 'red');
var playerBlue = new Player('Joueur Bleu', 'blue');