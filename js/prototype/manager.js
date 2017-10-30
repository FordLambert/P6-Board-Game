var Manager = function() {
	this.startButton = $('.start-button');
	this.actionsButtons = $('.action-button');
	this.actualPlayer = {};
};

//Creation part, before starting to play
Manager.prototype.createBoard = function(size) {
	this.boardMaker = new BoardMaker('#board');
	this.boardMaker.createBoard(size);
	this.displayer.displayBoard(this.boardMaker);
};

Manager.prototype.createPlayers = function() {
	var playerRed = new Player('Joueur Rouge', 'red', true, this.getRandomCell(this.boardMaker.boardSize), 'red-background.png');
	var playerBlue = new Player('Joueur Bleu', 'blue', false, this.getRandomCell(this.boardMaker.boardSize), 'blue-background.png');

	this.playerStore = new PlayerStore();
	this.playerStore.addPlayer(playerRed);
	this.playerStore.addPlayer(playerBlue);
};

Manager.prototype.createWeapons = function() {
	var bat = new Weapon('Batte', 10);
	var knife = new Weapon('Couteau', 10);
	var shovel = new Weapon('Pelle', 20);
	var axe = new Weapon('Hache', 25);

	this.weaponStore = new WeaponStore();
	this.weaponStore.addWeapon(bat);
	this.weaponStore.addWeapon(knife);
	this.weaponStore.addWeapon(shovel);
	this.weaponStore.addWeapon(axe);
};

Manager.prototype.distributeWeapons = function() {
	var i = 0
	while (i < this.playerStore.length) {
		this.playerStore[i].weapon = this.weaponStore.getWeapon(0);
		i++;
	}
};

Manager.prototype.createDisplayer = function() {
	this.displayer = new Displayer();
};

//Now that everything exist, we can put them randomly on the board
Manager.prototype.randomizeBoardElements = function() {
	this.blockRandomCells();
	this.displayer.updateCellStatus();
	console.log('Ici bientôt : des obstacles et des armes aléatoires !');
};

//And the game itself can start
Manager.prototype.startGame = function() {
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.displayer.resetCellStatus();
	this.randomizeBoardElements();
};

Manager.prototype.playTurns = function() {
	if (this.enoughPlayersToFight()) {
		this.ChangeTurnToPlay();
		this.choosePlayerActions('move');
	} else {
		this.endGame();
	}
};

Manager.prototype.endGame = function() {
	var winner = this.getPlayerAttribute('.isAlive()');
	alert(winner + ' a gagné ! Un nouvel essai ?');
	window.location.reload();
};

Manager.prototype.launchNewGame = function() {
	this.createDisplayer();
	this.createBoard(8);
	this.startButton.click(function() {
		this.startGame();
		this.playTurns();
	}.bind(this));
};

Manager.prototype.ChangeTurnToPlay = function() {
	var i = 0;
	while (i < this.playerStore.playerStoreList.length) {
		if (this.playerStore.getPlayer(i).turnToPlay) {
		this.playerStore.getPlayer(i).turnToPlay = false;
		this.actualPlayer = this.playerStore.getPlayer(i);
		this.displayer.changeTheme(this.actualPlayer.color);
			if (i != this.playerStore.playerStoreList.length - 1) {
				i++;
			} else {
				i = 0;
			}
			this.playerStore.getPlayer(i).turnToPlay = true;
			break;
		}
		i++;
	}
}

Manager.prototype.getPlayerAttribute = function(attribute) {
	var i = 0;
	var condition = this.playerStore.getPlayer(i) + attribute;
	while (i < this.playerStore.playerStoreList.length - 1) {
		if (condition) {
			return this.playerStore.getPlayer(i);
		}
		i++;
	}
};

Manager.prototype.choosePlayerActions = function(requestedAction) {
	if (this.enoughPlayersToFight()) {
		if (requestedAction == 'move') {
			this.actualPlayer.move();
		} else if (requestedAction == 'combat') {

			this.actionsButtons.click(function(e) {
				var target = $(e.target);
				if (target.is('#attack')) {
					this.actualPlayer.shoot();
				} else if (target.is('#defend')) {
					this.actualPlayer.defend();
				} else {
					console.log('Erreur: type d\'action inconnu');
				}
				this.removeEvent(this.actionsButtons);

			}.bind(this));
		} 
	} else {
		this.endGame();
	}
};

Manager.prototype.removeEvent = function(element) {
	$(element).unbind( "click" );
};

Manager.prototype.getDeadPlayersNumber = function() {
	var i = 0;
	var deadPlayersNumber = 0;
	while (i < this.playerStore.playerStoreList.length - 1) {
		if (this.playerStore.getPlayer(i).isAlive == false) {
			deadPlayersNumber ++;
		}
	i++;
	}
	return deadPlayersNumber;
};

Manager.prototype.enoughPlayersToFight = function() {
	if (this.getDeadPlayersNumber() == this.playerStore.playerStoreList.length - 1) {
		return false;
	} else {
		return true;
	}
};


Manager.prototype.blockRandomCells = function() {
	var blockedCellNumber = Math.floor(Math.random() * 12) + 6;

	for(var i = 0; i < blockedCellNumber; i ++) {
		var actualCell = this.boardMaker.getCell(this.getRandomNumber(this.boardMaker.board.length-1));
		if (actualCell.status = 'empty') {
			actualCell.texture = 'blockedCell.png';
			actualCell.status = 'is-blocked';
		}
	}
};

//methods that will maybe be erased
Manager.prototype.isThreeCellAwayMax = function(playerCell) {
	var targetedCellId = this.getCurrentCellId();
	$('#board').click(function() {
		console.log(targetedCellId);
		if ($(targetedCell).attr("id") == playerCell) {
			console.log('Vous avez cliqué sur la case du joueur 1 !');
		} else {
			console.log('Vous avez cliqué ailleurs...');
		}
		return true;
	}.bind(this));
};

Manager.prototype.getCurrentCellId = function(cellId) {
	var banane = cellId;
	return (banane);
};

Manager.prototype.getDistance = function() {
	var i = 0;
	while ('distance betweeen 2players cell' > 1) {
		i++;
	}
	return i;
};





//Very simple and impersonnal function, maybe for another file later
Manager.prototype.getRandomNumber = function(number) {
	return Math.floor(Math.random() * number + 1);
};

Manager.prototype.getRandomLetter = function(number) {
	//number is here to say : "how far must we go into the alphabet ?"
	var letter = this.boardMaker.rowLetters[this.getRandomNumber(this.boardMaker.boardSize)];
	return letter;
};

Manager.prototype.getRandomCell = function(number) {
	var row = this.getRandomLetter(number);
	var index = this.getRandomNumber(number);
	var randomCell = row + index;
	return randomCell;
};

Manager.prototype.getPlayerNumber = function() {
	return this.playerStore.playerStoreList.length;
};

Manager.prototype.getWeaponNumber = function() {
	return this.weaponStore.weaponStoreList.length;
};


//starting the game
var manager = new Manager(board);
manager.launchNewGame();