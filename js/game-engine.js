//-----Constructor
var GameEngine = function(boardid) {
	this.boardid = boardid;
	this.$startButton = $('.start-button');
	this.$actionsButtons = $('.action-button');
	this.actualPlayer = {};
};

//-----Getters
GameEngine.prototype.getPlayerAttribute = function(attribute) {
	var i = 0;
	var condition = this.playerStore.getPlayer(i) + attribute;
	while (i < this.playerStore.playerStoreList.length - 1) {
		if (condition) {
			return this.playerStore.getPlayer(i);
		}
		i++;
	}
};

GameEngine.prototype.getPlayersNumber = function() {
	return this.playerStore.playerStoreList.length;
};

GameEngine.prototype.getDeadPlayersNumber = function() {
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

GameEngine.prototype.getWeaponsNumber = function() {
	return this.weaponStore.weaponStoreList.length;
};
//----Setters
GameEngine.prototype.ChangeTurnToPlay = function() {
	var i = 0;
	while (i < this.playerStore.playerStoreList.length) {
		var player = this.playerStore.getPlayer(i)
		if (player.turnToPlay) {
		player.turnToPlay = false;
		this.actualPlayer = player;
		this.gameEffectManager.changeTheme(player.color);
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
GameEngine.prototype.getRandomNumber = function(number) {
	return Math.floor(Math.random() * (number - 1) + 1);
};

GameEngine.prototype.getRandomLetter = function(number) {
	//number is here to say : "how far must we go into the alphabet ?"
	var letter = this.boardManager.rowLetters[this.getRandomNumber(this.boardManager.boardSize - 1)];
	return letter;
};

GameEngine.prototype.generateRandomid = function(number) {
	var row = this.getRandomLetter(number);
	var index = this.getRandomNumber(number);
	var randomCellid = row + '-' + index;
	return randomCellid;
};

//What happen when the window load :
GameEngine.prototype.launchNewGame = function() {
	this.createBoardManager(8);
	this.creategameEffectManager();
	this.$startButton.click(function() {
		this.startGame();
		this.playTurns();
	}.bind(this));
};

//Creation part, before starting to play
GameEngine.prototype.createBoardManager = function(size) {
	this.boardManager = new BoardManager(this.boardid);
	this.boardManager.createBoard(size);
};

GameEngine.prototype.creategameEffectManager = function() {
	this.gameEffectManager = new GameEffectManager(this.boardManager);
	this.gameEffectManager.displayBoard();
};

GameEngine.prototype.createPlayers = function() {
	var playerRed = new Player('Joueur Rouge', 'red', true, 'red-background.png');
	var playerBlue = new Player('Joueur Bleu', 'blue', false, 'blue-background.png');

	this.playerStore = new PlayerStore();
	this.playerStore.addPlayer(playerRed);
	this.playerStore.addPlayer(playerBlue);
};

GameEngine.prototype.createWeapons = function() {

	var bat1 = new Weapon('Batte', 10, 'bat.png');
	var bat2 = new Weapon('Batte', 10, 'bat.png');
	var knife = new Weapon('Couteau', 8, 'knife.png');
	var shovel = new Weapon('Pelle', 13, 'shovel.png');
	var axe = new Weapon('Hache', 15, 'axe.png');

	this.weaponStore = new WeaponStore();
	this.weaponStore.addWeapon(bat1);
	this.weaponStore.addWeapon(bat2);
	this.weaponStore.addWeapon(knife);
	this.weaponStore.addWeapon(shovel);
	this.weaponStore.addWeapon(axe);
};

GameEngine.prototype.distributeWeapons = function() {
	var i = 0
	while (i < this.getPlayersNumber()) {
		var player = this.playerStore.getPlayer(i);
		player.weapon = this.weaponStore.getWeapon(i);
		i++;
	}
};

//Now that everything exist, we can put them randomly on the board
GameEngine.prototype.randomizeBoardElements = function() {
	this.blockRandomCells();
	this.placeWeapons();
	this.placePlayers();
	//everything has a place, now show it
	this.gameEffectManager.updateBoardDisplay();
};

//Process of a game
GameEngine.prototype.startGame = function() {
	this.gameEffectManager.displayGameInfos('Début de la partie !');
	this.resetGame();
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.randomizeBoardElements();
	for (var i = 0; i < this.getPlayersNumber(); i++) {
		this.gameEffectManager.displayPlayersInfos(this.playerStore.getPlayer(i));
	}
};

GameEngine.prototype.playTurns = function() {
	if (this.enoughPlayersToFight()) {
		this.ChangeTurnToPlay();
		this.choosePlayerActions('move');
	} else {
		this.endGame();
	}
};

GameEngine.prototype.endGame = function() {
	var winner = this.getPlayerAttribute('.isAlive()');
	alert(winner + ' a gagné ! Un nouvel essai ?');
	window.location.reload();
};

//What happen during the game itself :

GameEngine.prototype.choosePlayerActions = function(requestedAction) {

	this.gameEffectManager.displayPlayersInfos(this.actualPlayer);

	if (this.enoughPlayersToFight()) {
		if (requestedAction == 'move') {
			this.organiseMovingState('start-moving', this.getAccessibleCellList());
		} else if (requestedAction == 'combat') {

			this.$actionsButtons.click(function(e) {
				var target = $(e.target);
				if (target.is('#attack')) {
					this.actualPlayer.shoot();
				} else if (target.is('#defend')) {
					this.actualPlayer.defend();
				} else {
					console.log('Erreur: type d\'action inconnu');
				}
				this.removeEvent(this.$actionsButtons);

			}.bind(this));
		} 
	} else {
		this.endGame();
	}
};

GameEngine.prototype.removeEvent = function(element) {
	$(element).unbind( "click" );
};


GameEngine.prototype.enoughPlayersToFight = function() {
	if (this.getDeadPlayersNumber() == this.playerStore.playerStoreList.length - 1) {
		return false;
	} else {
		return true;
	}
};

GameEngine.prototype.blockRandomCells = function() {
	var blockedCellNumber = Math.floor(Math.random() * 5) + 5;
	for(var i = 0; i < blockedCellNumber; i ++) {
		var randomid = this.attributeRandomCellid(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellByid(randomid);
		if (actualCell.status = 'empty') {
			actualCell.texture = 'blockedCell.png';
			actualCell.status = 'is-blocked';
		}
	}
};

GameEngine.prototype.placeWeapons = function() {

	for(var i = this.getPlayersNumber(); i < this.getWeaponsNumber(); i ++) {
		var randomid = this.attributeRandomCellid(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellByid(randomid);
		if (actualCell.status = 'empty') {
			actualCell.texture = this.weaponStore.getWeapon(i).texture;
			actualCell.status = 'has-weapon';
			this.weaponStore.getWeapon(i).cell = randomid;
		}
	}
};

GameEngine.prototype.placePlayers = function() {
	for(var i = 0; i < this.getPlayersNumber(); i ++) {
		var randomid = this.attributeRandomCellid(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellByid(randomid);
		if (actualCell.status = 'empty') {
			actualCell.texture = this.playerStore.getPlayer(i).texture;
			actualCell.status = 'has-player';
			this.playerStore.getPlayer(i).cell = randomid;
		}
	}
};

GameEngine.prototype.resetGame = function() {
	this.removeEvent(this.$actionsButtons);
	this.removeEvent('.cell');
	this.boardManager.resetUsedCellList();
	this.gameEffectManager.resetCellStatus();
};

//only unsed at board generation, not after to see if a cell is occupied
GameEngine.prototype.attributeRandomCellid = function(number) {
	var cellid = this.generateRandomid(number);
	//check if this cell id is not used yet
	for (var i = 0; i <= this.boardManager.usedCellsid.length; i++) {
		//if this id had already been given
		if (cellid == this.boardManager.getUsedCellid(i)) {
			//we set a new value
			cellid = this.generateRandomid(number);
		}
	}
	//we add the new id to the "used" list and we return it
	this.boardManager.addUsedCellid(cellid);
	return cellid;
};


//this part need to be shortened, I repeat myself a lot here
GameEngine.prototype.getAccessibleCellList = function() {

	var accessibleCells = [];

	var actualCellid = this.actualPlayer.cell.split("-");

	var actualRow = actualCellid[0];
	var actualColumn = parseInt(actualCellid[1], 10);

	//next cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var nextCellsids = actualRow + '-' + (actualColumn + i);
		var nextCell = this.boardManager.getCellByid(nextCellsids);

		if (typeof nextCell != 'undefined') {
			if ((nextCell.status == 'empty') || (nextCell.status == 'has-weapon')) {
				accessibleCells.push(nextCell.id);
			} else {
				break;
			}
		}
	}

	//previous cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var previousCellsids = actualRow + '-' + (actualColumn - i);
		var previousCell = this.boardManager.getCellByid(previousCellsids);

		if (typeof previousCell != 'undefined') {
			if ((previousCell.status == 'empty') || (previousCell.status == 'has-weapon'))  {
				accessibleCells.push(previousCell.id);
			} else {
				break;
			}
		}
	}
	
	//upper cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var upperCellsids = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) - i] + '-' + actualColumn;
		var upperCell = this.boardManager.getCellByid(upperCellsids);

		if (typeof upperCell != 'undefined') {
			if ((upperCell.status == 'empty') || (upperCell.status == 'has-weapon'))  {
				accessibleCells.push(upperCell.id);
			} else {
				break;
			}
		}
	}

	//under cells:
	for (var i = 1; i <= this.actualPlayer.movement; i++) {
		var underCellsids = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) + i] + '-' + actualColumn;
		var underCell = this.boardManager.getCellByid(underCellsids);

		if (typeof underCell != 'undefined') {
			if ((underCell.status == 'empty') || (underCell.status == 'has-weapon'))  {
				accessibleCells.push(underCell.id);
			} else {
				break;
			}
		}
	}

	return accessibleCells;
};

GameEngine.prototype.organiseMovingState = function(status, cellList) {
	if (status == 'start-moving') {
		this.gameEffectManager.toggleAccessiblesCells(cellList);
		this.actualPlayer.move(cellList);
	} else if (status == 'has-moved') {
		this.boardManager.checkWeaponPresence();
		this.boardManager.checkPlayerPresence();
		this.gameEffectManager.toggleAccessiblesCells(cellList);
		this.gameEffectManager.updateBoardDisplay();
		this.choosePlayerActions('combat');
	}
}