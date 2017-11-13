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

//the manager tell were the player can move (array list of id)
Player.prototype.move = function move(accessiblesCellsList) {

	//just to keep the context
	var player = this;

	for (var i = 0; i < accessiblesCellsList.length; i++) {
		//if the user choose this cell for his move
		$('#' + accessiblesCellsList[i]).click(function() {
			//we remove the old position information
			gameEngine.boardManager.resetCell(player.cell);
			//we set the new one
			player.cell = $(this).attr('id');

			gameEngine.gameEffectManager.displayGameInfos(player.name + ' se déplace en ' + player.cell);
			//is there a weapon on this cell ?

			var newWeapon = gameEngine.boardManager.checkAndReturnWeapon(player.cell);
			//if yes : take it and let your's here
			if (typeof newWeapon != 'undefined') {
				player.pickUp(newWeapon);
			}

			//then we inform the manager that we have moved
			gameEngine.organiseMovingState('has-moved', accessiblesCellsList);
			gameEngine.removeEvent('.cell');

		});
	}
};

Player.prototype.pickUp = function(weapon) {
	this.weapon.cell = this.cell
	this.weapon = weapon;
	this.weapon.cell = '';
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

	gameEngine.playTurns();
};

Player.prototype.defend = function() {
	this.protected = true;
	console.log(this.name + ' se prépare à prendre un coup.');
	gameEngine.playTurns();
};


//we'll see if this stay here or if it's a manager job
Player.prototype.canShoot = function() {
	if (gameEngine.getDistance() == 0) {
		return true;
	} else {
		return false;
	}
};