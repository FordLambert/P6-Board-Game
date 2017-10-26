var Manager = function() {
	this.startButton = $('.start-button');
	this.attackButton = $('.attack');
	this.defendButton = $('.defend');
	this.actualPlayer = {};
};


//Creation part, before starting to play
Manager.prototype.createBoard = function(cellNumber) {
	this.cellStore = new CellStore();
	this.cellStore.addCells(cellNumber);//64 cells
	this.board = new Board(this.cellStore, '#board');
	this.board.createBoard();
};

Manager.prototype.createPlayers = function() {
	var playerRed = new Player('Joueur Rouge', 'red', true, this.getRandomNumber(this.board.cellStore.cellList.length));
	var playerBlue = new Player('Joueur Bleu', 'blue', false, this.getRandomNumber(this.board.cellStore.cellList.length));

	this.playerStore = new PlayerStore();
	this.playerStore.addPlayer(playerRed);
	this.playerStore.addPlayer(playerBlue);
	console.log('Nombre de joueur(s): ' + this.playerStore.length);
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

Manager.prototype.createDisplayer = function() {
	this.displayer = new Displayer();
};

//Now that everything exist, we can put them randomly on the board
Manager.prototype.randomizeBoardElements = function() {
	this.displayer.updateCellStatus();
	console.log('Ici bientôt : des obstacles et des armes aléatoires !');
};

//And the game itself can start
Manager.prototype.startGame = function() {
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.createDisplayer();
	this.displayer.resetCellStatus();
	this.randomizeBoardElements();
};

Manager.prototype.playturns = function() {
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
	this.createBoard(64);
	this.startButton.click(function() {
		this.startGame();
		this.playturns();
	}.bind(this));
};

Manager.prototype.ChangeTurnToPlay = function() {
	var i = 0;
	while (i < this.playerStore.playerStoreList.length - 1) {
		if (this.playerStore.getPlayer(i).turnToPlay) {
		this.actualPlayer.turnToPlay = false;
		this.actualPlayer = this.playerStore.getPlayer(i);
		this.displayer.changeTheme(this.actualPlayer.color);
			if (i != this.playerStore.length - 1) {
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

Manager.prototype.getDistance = function() {
	var i = 0;
	while ('distance betweeen 2players cell' > 1) {
		i++;
	}
	return i;
};

Manager.prototype.choosePlayerActions = function(requestedAction) {
	if (this.enoughPlayersToFight()) {
		if (requestedAction == 'move') {
			this.actualPlayer.move();
		} else if (requestedAction == 'combat') {
			this.attackButton.click(function() {
				console.log('A l\'attaque !');
				this.removeEvent(this.attackButton);
				this.removeEvent(this.defendButton);
			}.bind(this));

			this.defendButton.click(function() {
				console.log('Levée de bouclier !');
				this.removeEvent(this.defendButton);
				this.removeEvent(this.attackButton);
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
	while (i < this.playerStore.length - 1) {
		if (this.playerStore[i].isAlive() == false) {
			deadPlayersNumber ++;
		}
	i++;
	}
	return deadPlayersNumber;
};

Manager.prototype.enoughPlayersToFight = function() {
	if (this.getDeadPlayersNumber == this.playerStore.length - 1) {
		return false;
	} else {
		return true;
	}
};

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


//Very simple and impersonnal function, maybe for another file later
Manager.prototype.getRandomNumber = function(number) {
	return Math.floor(Math.random() * number + 1);
};

//starting the game
var manager = new Manager(board);
manager.launchNewGame();