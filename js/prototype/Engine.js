var Manager = function(board, firstPlayer, secondPlayer) { //this class should exist from the begining and react to event by calling object's functions
	this.actionButton = document.querySelector('start-button');
	this.board = board;
	this.firstPlayer = firstPlayer;
	this.secondPlayer = secondPlayer;
};

Manager.prototype.createBoard = function createBoard() {
	console.log('Création du terrain');
};

Manager.prototype.createWeapon = function createWeapon() {
	var bat = new Weapon('Batte', 15);
	var knife = new Weapon('Couteau', 10);
	var shovel = new Weapon('Pelle', 20);
	var banana = new Weapon('Banane', 2);
	var axe = new Weapon('Hache', 25);

	var weaponStore = new WeaponStore();
	weaponStore.addWeapon(bat, knife, shovel, banana, axe);
};

Manager.prototype.startGame = function startGame() {
	this.createWeapon();
	this.createBoard();
};

Manager.prototype.playing = function playing() {
	this.startGame();
	while (firstPlayer.alive && secondPlayer.alive) {
		this.changeTheme('red');
		firstPlayer.play(secondPlayer);
		this.changeTheme('blue');
		secondPlayer.play(firstPlayer);
	}
	this.endGame();
};

Manager.prototype.endGame = function endGame() {
	var winner = '';
	if (firstPlayer.alive) {
		winner = 'Joueur Rouge';
	} else {
		winner = 'Joueur Bleu';
	}
	alert(winner + ' won the game ! Another try ?');
	window.location.reload();
};

Manager.prototype.changeTheme = function(color) {
	$('progress-bar').removeAttr('progress-bar-success');
	if (color == 'red') {
		$('changing-button').removeAttr('blue');
		$('changing-button').addAttr('red');
		$('progress-bar').toggleClass('progress-bar-danger');
	} else if (color == 'blue') {
		$('changing-button').removeAttr('red');
		$('changing-button').addAttr('blue');
		$('progress-bar').toggleClass('progress-bar-danger');
	} else {
		console.log('Theme color error : red or blue accepted');
	}
}

Manager.prototype.getDistance = function {
	var i = 0;
	while ('distance betweeen 2players cell' > 1) {
		i++;
	}
	return i;
};


//starting the fight

var manager = new Manager('rien', playerBlue, playerRed);
manager.playing();