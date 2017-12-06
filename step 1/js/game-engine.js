var GameEngine = function(boardWrapper) {
	this._selectors = {
		'startButton': '.start-button'
	}
	this.boardWrapper = boardWrapper;
	this.$startButton = $(this._selectors.startButton);

	this.boardManager = new BoardManager(this.boardWrapper);
	this.gameEffectManager = new GameEffectManager(this.boardManager);
	this.playersDetailsManager = new PlayersDetailsManager();
};

GameEngine.prototype.getPlayersNumber = function() {
	return this.playerStore.playerStoreList.length;
};

GameEngine.prototype.getWeaponsNumber = function() {
	return this.weaponStore.weaponStoreList.length;
};

GameEngine.prototype.getAppropriateSpawnPosition = function() {
	var isSafe = false;

	while (!isSafe) {
		var randomId = this.generateRandomId(this.boardManager.boardSize);
		var cell = this.boardManager.getCell(randomId);
		var surroundingCellsList = this.getSurroundingCells(cell);

		if ((!this.checkEnnemyProximity(surroundingCellsList)) && (cell.status == CELL_STATUS_EMPTY )) {
			isSafe = true;
		}
	}
	return cell;
};

GameEngine.prototype.checkEnnemyProximity = function(surroundingCellsList) {
	var ennemyNumber = 0;

	for (var listIndex = 0; listIndex < surroundingCellsList.length; listIndex++) {
		var cell = this.boardManager.getCell(surroundingCellsList[listIndex]);

		if ((typeof cell != 'undefined') && (cell.status == CELL_STATUS_PLAYER)) { //checking 'undefined' in case we are on the edge of the board
			ennemyNumber++;
		}
	}
	return ennemyNumber > 0 ? true : false;
};

GameEngine.prototype.getSurroundingCells = function(cell) {
	var splitCellId = cell.id.split("-");
	
	var currentRow = splitCellId[0];
	//fetch the row (letter) in the alphabet and remove or add one to the index to have the previous/next row
	var previousRow = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(currentRow) - 1];
	var nextRow = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(currentRow) + 1];

	var currentColumnNumber = parseInt(splitCellId[1], 10);
	//convert the column (string) into an int and add/remove one to obtain next/previous column 
	var previousColumnNumber = parseInt(splitCellId[1], 10) - 1; 
	var nextColumnNumber = parseInt(splitCellId[1], 10) + 1;

	//Checking the cell on top of this one and moving around from left to right (vertical and horizontal)
	var surroundingCellList = [
		(previousRow + '-' + currentColumnNumber),
		(currentRow + '-' + nextColumnNumber),
		(nextRow + '-' + currentColumnNumber),
		(currentRow + '-' + previousColumnNumber),
	];

	return surroundingCellList;
};


GameEngine.prototype.getRandomNumber = function(number) {
	return Math.floor(Math.random() * (number - 1) + 1); //random number between number (max) and 1 (include)
};

GameEngine.prototype.getRandomLetter = function(number) {
	//Number is here to say : "how far must we go into the alphabet ?"
	var letter = this.boardManager.rowLetters[this.getRandomNumber(this.boardManager.boardSize - 1)];

	return letter;
};

GameEngine.prototype.generateRandomId = function(number) {
	var row = this.getRandomLetter(number);
	var index = this.getRandomNumber(number);
	var randomCellId = row + '-' + index;

	return randomCellId;
};

GameEngine.prototype.launchNewGame = function() {
	this.boardManager.createBoard(8);
	this.gameEffectManager.createVisualFromBoardObject();

	this.$startButton.click(function() {
		this.startGame();
	}.bind(this));
};

GameEngine.prototype.createPlayers = function() {
	var playerRed = new Player('Joueur Rouge', 'red', 'red-background.jpg');
	var playerBlue = new Player('Joueur Bleu', 'blue', 'blue-background.jpg');

	this.playerStore = new PlayerStore();
	this.playerStore.addPlayer(playerRed);
	this.playerStore.addPlayer(playerBlue);
};

GameEngine.prototype.createWeapons = function() {
	var bat1 = new Weapon('Batte', 10, 'bat.png');
	var bat2 = new Weapon('Batte', 10, 'bat.png');
	var knife = new Weapon('Couteau', 8, 'knife.png');
	var shovel = new Weapon('Pelle', 14, 'shovel.png');
	var axe = new Weapon('Hache', 16, 'axe.png');

	this.weaponStore = new WeaponStore();
	this.weaponStore.addWeapon(bat1);
	this.weaponStore.addWeapon(bat2);
	this.weaponStore.addWeapon(knife);
	this.weaponStore.addWeapon(shovel);
	this.weaponStore.addWeapon(axe);
};

GameEngine.prototype.distributeWeapons = function() {
	var index = 0

	while (index < this.getPlayersNumber()) {
		var player = this.playerStore.getPlayer(index);
		player.weapon = this.weaponStore.getWeapon(index);
		index++;
	}
};

GameEngine.prototype.placeObstacles = function() {
	var obstaclesNumber = Math.floor(Math.random() * 5) + 5;

	for(var i = 0; i < obstaclesNumber; i ++) {
		var cell = this.getAppropriateSpawnPosition();
		var obstacle = new Obstacle();
		obstacle.position = cell;
		this.boardManager.attributeCellTo(obstacle, cell);
	}
};

GameEngine.prototype.placeWeapons = function() {

	//First weapons are for players, the rest goes on the board
	for(var weaponIndex = this.getPlayersNumber(); weaponIndex < this.getWeaponsNumber(); weaponIndex ++) {
		var weapon = this.weaponStore.getWeapon(weaponIndex);
		var cell = this.getAppropriateSpawnPosition();
		weapon.position = cell;
		this.boardManager.attributeCellTo(weapon, cell);
	}
};

GameEngine.prototype.placePlayers = function(player) {

	for(var playerIndex = 0; playerIndex < this.getPlayersNumber(); playerIndex ++) {
		var player = this.playerStore.getPlayer(playerIndex);
		var cell = this.getAppropriateSpawnPosition();
		player.position = cell;
		this.boardManager.attributeCellTo(player, cell);
	}
};

GameEngine.prototype.installElementsOnBoard = function() {
	this.placeObstacles();
	this.placeWeapons();
	this.placePlayers();
	this.gameEffectManager.updateVisualFromBoardObject(); //Everything has a place, now show it
};

GameEngine.prototype.startGame = function() {
	this.resetGame();
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.installElementsOnBoard();

	//Displaying players infos (life, weapon...)
	for (var playerIndex = 0; playerIndex < this.getPlayersNumber(); playerIndex++) {
		this.playersDetailsManager.updatePlayerInfos(this.playerStore.getPlayer(playerIndex));
	}
};

GameEngine.prototype.resetGame = function() {
	this.removeEvent('.cell');
	this.gameEffectManager.resetBoardVisual();
};

GameEngine.prototype.removeEvent = function(element) {
	$(element).unbind( "click" );
};