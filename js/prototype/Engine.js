var Manager = function(board) {
	this.board = board;
	this.startButton = $('.start-button');
	this.actionsButtons = $('.actions-buttons');
};

Manager.prototype.createPlayers = function() {
	var playerRed = new Player('Joueur Rouge', 'red', true); //Only the first player playing should have 'true'
	var playerBlue = new Player('Joueur Bleu', 'blue', false);

	this.playerStore = new PlayerStore();
	this.playerStore.addPlayer(playerRed);
	this.playerStore.addPlayer(playerBlue);
};

Manager.prototype.createWeapons = function() {
	var bat = new Weapon('Batte', 15);
	var knife = new Weapon('Couteau', 10);
	var shovel = new Weapon('Pelle', 20);
	var banana = new Weapon('Banane', 2);
	var axe = new Weapon('Hache', 25);

	this.weaponStore = new WeaponStore();
	this.weaponStore.addWeapon(bat);
	this.weaponStore.addWeapon(knife);
	this.weaponStore.addWeapon(shovel);
	this.weaponStore.addWeapon(banana);
	this.weaponStore.addWeapon(axe);
};

Manager.prototype.distributeWeapons = function() {
	var i = 0
	while (i < this.playerStore.length) {
		this.playerStore[i].weapon = this.weaponStore.getWeapon(0);
		i++;
	}
};

Manager.prototype.createBoard = function() {
	console.log('Création du terrain');
};

Manager.prototype.startGame = function() {
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.createBoard();

	this.firstPlayer.setEnemy(this.secondPlayer);
	this.secondPlayer.setEnemy(this.firstPlayer);
};

Manager.prototype.playing = function() {
	var i = 0;
	while (i < this.playerStore.length) {
		if (this.playerStore[i].turnToPlay) {
			this.changeTheme(this.playerStore[i].color);
			this.chooseAction(this.playerStore[i], this.getActionType());
			this.playerStore[i].turnToPlay = false;
			if (i != this.playerStore.length - 1) {
				i++;
			} else {
				i = 0;
			}
			this.playerStore[i].turnToPlay = true;
			break;
		}
		i++;
	}
};

Manager.prototype.endGame = function() {
	var i = 0;
	var winner = '';
	while (i < this.playerStore.length) {
		if (this.playerStore[i].isAlive()) {
			winner = this.playerStore[i];
			alert(winner + ' a gagné ! Un nouvel essai ?');
			window.location.reload();
		} 
		i++;
	}
};


Manager.prototype.launchNewGame = function() {
	this.startButton.click(function() {
		this.startGame();


		this.endGame();
	}.bind(this));
};


Manager.prototype.changeTheme = function(color) {
	$('.progress-bar').removeAttr('progress-bar-success');
	if (color == 'red') {
		$('.changing-button').removeAttr('blue');
		$('.changing-button').toggleClass('red');
		$('.progress-bar').toggleClass('progress-bar-danger');
	} else if (color == 'blue') {
		$('.changing-button').removeAttr('red');
		$('.changing-button').toggleClass('blue');
		$('.progress-bar').toggleClass('progress-bar-danger');
	} else {
		console.log('Theme color error : red or blue accepted');
	}
}

Manager.prototype.getDistance = function() {
	var i = 0;
	while ('distance betweeen 2players cell' > 1) {
		i++;
	}
	return i;
};

Manager.prototype.chooseAction = function(player, action) {
	if (action == 'attack') {
		player.shoot();
	} else if (action == 'defend') {
		player.protect();
	} else {
		console.log('Erreur: type d\'action inconnue');
	}
};

Manager.prototype.getActionType = function() {
	this.actionsButtons.click(function() {
		return this.actionsButtons.value;
	}.bind(this));
};

//starting the fight

var manager = new Manager('rien');
manager.launchNewGame();