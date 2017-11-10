//-----Constructor
var GameManager = function(boardId) {
	this.boardId = boardId;
	this.startButton = $('.start-button');
	this.actionsButtons = $('.action-button');
	this.actualPlayer = {};
};

//-----Getters
GameManager.prototype.getPlayerAttribute = function(attribute) {
	var i = 0;
	var condition = this.playerStore.getPlayer(i) + attribute;
	while (i < this.playerStore.playerStoreList.length - 1) {
		if (condition) {
			return this.playerStore.getPlayer(i);
		}
		i++;
	}
};

GameManager.prototype.getPlayersNumber = function() {
	return this.playerStore.playerStoreList.length;
};

GameManager.prototype.getDeadPlayersNumber = function() {
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

GameManager.prototype.getWeaponsNumber = function() {
	return this.weaponStore.weaponStoreList.length;
};
//----Setters
GameManager.prototype.ChangeTurnToPlay = function() {
	var i = 0;
	while (i < this.playerStore.playerStoreList.length) {
		var player = this.playerStore.getPlayer(i)
		if (player.turnToPlay) {
		console.log(player.name + player.turnToPlay);
		player.turnToPlay = false;
		this.actualPlayer = player;
		this.displayer.changeTheme(player.color);
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

//-----Random generators
GameManager.prototype.getRandomNumber = function(number) {
	return Math.floor(Math.random() * (number - 1) + 1);
};

GameManager.prototype.getRandomLetter = function(number) {
	//number is here to say : "how far must we go into the alphabet ?"
	var letter = this.boardManager.rowLetters[this.getRandomNumber(this.boardManager.boardSize - 1)];
	return letter;
};

GameManager.prototype.generateRandomId = function(number) {
	var row = this.getRandomLetter(number);
	var index = this.getRandomNumber(number);
	var randomCellId = row + '-' + index;
	return randomCellId;
};

//What happen when the window load :
GameManager.prototype.launchNewGame = function() {
	this.createDisplayer();
	this.createBoardManager(8);
	this.startButton.click(function() {
		this.startGame();
		this.playTurns();
	}.bind(this));
};

//Creation part, before starting to play
GameManager.prototype.createDisplayer = function() {
	this.displayer = new Displayer();
};

GameManager.prototype.createBoardManager = function(size) {
	this.boardManager = new BoardManager(this.boardId);
	this.boardManager.createBoard(size);
	this.displayer.displayBoard(this.boardManager);
};

GameManager.prototype.createPlayers = function() {
	var playerRed = new Player('Joueur Rouge', 'red', true, 'red-background.png');
	var playerBlue = new Player('Joueur Bleu', 'blue', false, 'blue-background.png');

	this.playerStore = new PlayerStore();
	this.playerStore.addPlayer(playerRed);
	this.playerStore.addPlayer(playerBlue);
};

GameManager.prototype.createWeapons = function() {
	var bat = new Weapon('Batte', 10, 'bat.png');
	var knife = new Weapon('Couteau', 10, 'knife.png');
	var shovel = new Weapon('Pelle', 20, 'shovel.png');
	var axe = new Weapon('Hache', 25, 'axe.png');

	this.weaponStore = new WeaponStore();
	this.weaponStore.addWeapon(bat);
	this.weaponStore.addWeapon(knife);
	this.weaponStore.addWeapon(shovel);
	this.weaponStore.addWeapon(axe);
};

GameManager.prototype.distributeWeapons = function() {
	var i = 0
	while (i < this.playerStore.length) {
		this.playerStore[i].weapon = this.weaponStore.getWeapon(0);
		i++;
	}
};

//Now that everything exist, we can put them randomly on the board
GameManager.prototype.randomizeBoardElements = function() {
	this.blockRandomCells();
	this.placeWeapons();
	this.placePlayers();
	//everything has a place, now show it
	this.displayer.updateBoardDisplay();
};

//Process of a game
GameManager.prototype.startGame = function() {
	this.resetGame();
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.randomizeBoardElements();
};

GameManager.prototype.playTurns = function() {
	if (this.enoughPlayersToFight()) {
		this.ChangeTurnToPlay();
		this.choosePlayerActions('move');
	} else {
		this.endGame();
	}
};

GameManager.prototype.endGame = function() {
	var winner = this.getPlayerAttribute('.isAlive()');
	alert(winner + ' a gagné ! Un nouvel essai ?');
	window.location.reload();
};

//What happen during the game itself :

GameManager.prototype.choosePlayerActions = function(requestedAction) {
	if (this.enoughPlayersToFight()) {
		if (requestedAction == 'move') {
			this.organiseMovingState('start-moving', this.getAccessibleCellList());
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

GameManager.prototype.removeEvent = function(element) {
	$(element).unbind( "click" );
};


GameManager.prototype.enoughPlayersToFight = function() {
	if (this.getDeadPlayersNumber() == this.playerStore.playerStoreList.length - 1) {
		return false;
	} else {
		return true;
	}
};

GameManager.prototype.blockRandomCells = function() {
	var blockedCellNumber = Math.floor(Math.random() * 5) + 5;
	for(var i = 0; i < blockedCellNumber; i ++) {
		var randomId = this.attributeRandomCellId(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellById(randomId);
		if (actualCell.status = 'empty') {
			actualCell.texture = 'blockedCell.png';
			actualCell.status = 'is-blocked';
		}
	}
};

GameManager.prototype.placeWeapons = function() {
	for(var i = 0; i < this.getWeaponsNumber(); i ++) {
		var randomId = this.attributeRandomCellId(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellById(randomId);
		if (actualCell.status = 'empty') {
			actualCell.texture = this.weaponStore.getWeapon(i).texture;
			actualCell.status = 'has-weapon';
		}
	}
};

GameManager.prototype.placePlayers = function() {
	for(var i = 0; i < this.getPlayersNumber(); i ++) {
		var randomId = this.attributeRandomCellId(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellById(randomId);
		if (actualCell.status = 'empty') {
			actualCell.texture = this.playerStore.getPlayer(i).texture;
			actualCell.status = 'has-player';
			this.playerStore.getPlayer(i).cell = randomId;
		}
	}
};

GameManager.prototype.resetGame = function() {
	this.removeEvent(this.boardId);
	this.boardManager.resetUsedCellList();
	this.displayer.resetCellStatus();
};

//only unsed at board generation, not after to see if a cell is occupied
GameManager.prototype.attributeRandomCellId = function(number) {
	var cellId = this.generateRandomId(number);
	//check if this cell Id is not used yet
	for (var i = 0; i <= this.boardManager.usedCellsId.length; i++) {
		//if this id had already been given
		if (cellId == this.boardManager.getUsedCellId(i)) {
			//we set a new value
			cellId = this.generateRandomId(number);
		}
	}
	//we add the new id to the "used" list and we return it
	this.boardManager.addUsedCellId(cellId);
	return cellId;
};


//this part need to be shortened, I repeat myself a lot here
GameManager.prototype.getAccessibleCellList = function() {

	var accessibleCells = [];

	var actualCellId = this.actualPlayer.cell.split("-");

	var actualRow = actualCellId[0];
	var actualColumn = parseInt(actualCellId[1], 10);

	//next cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var nextCellsIds = actualRow + '-' + (actualColumn + i);
		var nextCell = this.boardManager.getCellById(nextCellsIds);

		if (typeof nextCell != 'undefined') {
			if ((nextCell.status == 'empty') || (nextCell.status == 'has-weapon')) {
				accessibleCells.push(nextCell.Id);
			} else {
				break;
			}
		}
	}

	//previous cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var previousCellsIds = actualRow + '-' + (actualColumn - i);
		var previousCell = this.boardManager.getCellById(previousCellsIds);

		if (typeof previousCell != 'undefined') {
			if ((previousCell.status == 'empty') || (previousCell.status == 'has-weapon'))  {
				accessibleCells.push(previousCell.Id);
			} else {
				break;
			}
		}
	}
	
	//upper cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var upperCellsIds = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) - i] + '-' + actualColumn;
		var upperCell = this.boardManager.getCellById(upperCellsIds);

		if (typeof upperCell != 'undefined') {
			if ((upperCell.status == 'empty') || (upperCell.status == 'has-weapon'))  {
				accessibleCells.push(upperCell.Id);
			} else {
				break;
			}
		}
	}

	//under cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var underCellsIds = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) + i] + '-' + actualColumn;
		var underCell = this.boardManager.getCellById(underCellsIds);

		if (typeof underCell != 'undefined') {
			if ((underCell.status == 'empty') || (underCell.status == 'has-weapon'))  {
				accessibleCells.push(underCell.Id);
			} else {
				break;
			}
		}
	}

	return accessibleCells;
};

GameManager.prototype.organiseMovingState = function(status, cellList) {
	if (status == 'start-moving') {
		this.displayer.toggleAccessiblesCells(cellList);
		this.actualPlayer.move(cellList);
	} else if (status == 'has-moved') {
		this.boardManager.checkPlayerPresence();
		this.boardManager.checkWeaponPresence();
		this.displayer.toggleAccessiblesCells(cellList);
		this.displayer.updateBoardDisplay();
		this.choosePlayerActions('combat');
	}
}