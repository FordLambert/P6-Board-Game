var Player = function() {
	//all action must depend on an 'if not dead' condition
	this.cell = ; //find a way to select a cell randomly when the gae start
	this.weapon = aGunOrSomethingIdk;
	this.life = 100; //must change when the ennemi shoot
	this.protected = false //change with the protect function
	this.color = blue or red //just to avoid mistake on who is who
	this.alive = true; //at first, if not anymore the game end

};

Player.prototype.move = function move(direction) {
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
};


Player.prototype.pickUp = function pickUp(weapon) {
	this.weapon = weapon;
	console.log('The weapon ' + weapon + ' is now equipped');
};

Player.prototype.shoot = function shoot() {
	if (the other player is not farer than one block && ennemy.protected = false) {
		ennemi.life = ennemi.life - weapon.damage 
	} else if (the other player is not farer than one block && ennemy.protected = true) {
		ennemy.life = enemy.life (weapon.damage / 2);
	if (ennemy.life <= 0) {
		enemy.alive = false;
	} else {
		console.log('you can not shoot from that far');
	}
};

Player.prototype.protect = function protect() {
	this. protected = true; //must be set to false on the next action
	console.log('the player is protected and will take only half damage !');
};

Player.prototype.play = function play() {
	if (this.alive) {
		this.move();
		manager.actionButton.addEventListener("click", function() {
			if (manager.startButton.value = shoot) {
				this.shoot();
			} else {
				this.protect();
			}
		});
	} else {
		manager.endGame();
	};
};

Player.prototype.canShoot = function() {
	if (manager.getDistance() == 0) {
		return true;
	} else {
		console.log('Vous êtes trop loin pour attaquer !');
	}
};