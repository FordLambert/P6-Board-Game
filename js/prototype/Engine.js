var Manager = function(board, firstPlayer, secondPlayer) { //this class should exist from the begining and react to event by calling object's functions
	this.actionButton = document.querySelector('start-button');
	this.board = board;
	this.firstPlayer = firstPlayer;
	this.secondPlayer = secondPlayer;
};

Manager.prototype.createBoard = function createBoard() {
	//create random non praticables blocks, like 10 or such
};

Manager.prototype.createWeapon = function createWeapon() {
	var pistol = new Weapon(10);
	var sword = new Weapon(8);
	var shotgun = new Weapon(13);
	var banana = new Weapon(2);
	var uzi = new Weapon(11);
};

Manager.prototype.createPlayer = function createPlayer() {
	var playerBlue = new Player();
	var playerRed = new Player();
	//should we keep this ? is it a good thing to have an object creating another one ? same for createWepon()
};

Manager.prototype.startGame = function startGame() {
	this.createBoard();
	this.createPlayer();
	this.createWeapon();

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

Manager.prototype.playing = function playing() {
	this.startGame();
	while (playerRed.alive && playerBlue.alive) {
		firstPlayer.play();
		secondPlayer.play();
	}
	this.endGame();
};

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