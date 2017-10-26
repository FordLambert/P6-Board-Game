var Manager = function() {
	this.startButton = $('.start-button');
	this.actionsButtons = $('.actions-buttons');
};

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

//Now everything exist, we can put them randomly on the board
Manager.prototype.randomizeBoardElements = function() {
	this.updateCellStatus();
	console.log('Création du terrain');
};

Manager.prototype.move = function(playerCell) {
	this.isThreeCellAwayMax(playerCell);
	this.board.click(function() {
		console.log('Click sur une case !');
	}.bind(this));
};

Manager.prototype.startGame = function() {
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.createDisplayer();
	this.randomizeBoardElements();
};

Manager.prototype.playing = function() {
	if (this.enoughPlayersToFight()) {
		var i = 0;
		while (i < this.playerStore.playerStoreList.length - 1) {
			if (this.playerStore.getPlayer(i).turnToPlay) {
				var actualPlayer = this.playerStore.getPlayer(i);
				this.displayer.changeTheme(actualPlayer.color);

				this.move(actualPlayer.cell);

				actualPlayer.move(actualPlayer.cell);
				this.chooseAction(actualPlayer, this.getActionType());
				actualPlayer.turnToPlay = false;
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
	//I choose to create a empty board here because it's sad and empty if not
	this.createBoard(64);
	this.startButton.click(function() {
		this.startGame();
		this.playing();
		this.endGame();
	}.bind(this));
};

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



Manager.prototype.updateCellStatus = function() {
	var i = 0;
	while (i < this.playerStore.playerStoreList.length) {

		this.board.cellStore.getCell((this.playerStore.getPlayer(i).cell) - 1).color = this.playerStore.getPlayer(i).color;
		this.displayer.updateBoard();

		i++;
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
	return Math.floor(Math.random() * number);
};

//starting the game
var manager = new Manager(board);
manager.launchNewGame();