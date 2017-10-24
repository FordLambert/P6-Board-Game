var Manager = function(board, firstPlayer, secondPlayer) { //this class should exist from the begining and react to event by calling object's functions
	this.actionButton = document.querySelector('start-button');
	this.board = board;
	this.firstPlayer = firstPlayer;
	this.secondPlayer = secondPlayer;
	this.startButton = $('.start-button');
	this.actionsButtons = $('.actions-buttons');
};

Manager.prototype.addEvents = function() {
	this.actionsButtons.addEventListener('click' function {
		
	});
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

	this.weaponStore = new WeaponStore();
	this.weaponStore.addWeapon(bat);
	this.weaponStore.addWeapon(knife);
	this.weaponStore.addWeapon(shovel);
	this.weaponStore.addWeapon(banana);
	this.weaponStore.addWeapon(axe);
};

Manager.prototype.distributeWeapons = function() {
	this.firstPlayer.weapon = this.weaponStore.getWeapon(0);
	this.secondPlayer.weapon = this.weaponStore.getWeapon(0);
};

Manager.prototype.startGame = function startGame() {
	this.createWeapon();
	this.distributeWeapons();
	this.createBoard();
};

Manager.prototype.playing = function playing() {
	this.startGame();
	while (this.firstPlayer.alive && this.secondPlayer.alive) {
		this.changeTheme('red');
		this.firstPlayer.play(this.secondPlayer);
		this.changeTheme('blue');
		this.secondPlayer.play(this.firstPlayer);
	}
	this.endGame();
};

Manager.prototype.endGame = function endGame() {
	var winner = '';
	if (this.firstPlayer.alive) {
		winner = 'Joueur Rouge';
	} else {
		winner = 'Joueur Bleu';
	}
	alert(winner + ' won the game ! Another try ?');
	window.location.reload();
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

Manager.prototype.actionReaction = function() {
	this.actionsButtons.addEventListener("click", function() {
		if (this.actionsButtons.value = 'attack') {
			this.shoot(this.enemy);
		} else if (this.actionsButtons.value = 'protect') {
			this.protect();
		} else {
			console.log('Action inconnue');
		}
	});
};


//starting the fight

var manager = new Manager('rien', playerBlue, playerRed);
manager.playing();