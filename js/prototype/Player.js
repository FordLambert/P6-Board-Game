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

//the manager tell were the player can move (array list of Id)
Player.prototype.move = function move(accessiblesCellsList) {

	//just to keep the context
	var player = this;

	for (var i = 0; i < accessiblesCellsList.length; i++) {
		//if the user choose this cell for his move
		$('#' + accessiblesCellsList[i]).click(function() {
			//we remove the old position information
			gameManager.boardManager.resetCell(player.cell);
			//we set the new one
			player.cell = $(this).attr('id');
			//then we inform the manager that we have moved
			gameManager.organiseMovingState('has-moved', accessiblesCellsList);
			gameManager.removeEvent('.cell');

		});
	}
};

Player.prototype.pickUp = function(weapon) {
	this.weapon = weapon;
	console.log(this.name + ' a ramassé l\'arme "' + this.weapon + '"');
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

	gameManager.playTurns();
};

Player.prototype.defend = function() {
	this.protected = true;
	console.log(this.name + ' se prépare à prendre un coup.');
	gameManager.playTurns();
};


//we'll see if this stay here or if it's a manager job
Player.prototype.canShoot = function() {
	if (gameManager.getDistance() == 0) {
		return true;
	} else {
		return false;
	}
};