var GameEngine = function(domDivId) {
	this._selectors = {
		'startButton': '.start-button',
		'actionButton': '.action-button',
		'attackButton': '#attack',
		'defendButton': '#defend',
		'endTurnButton': '#end-turn'
	}
	this.domDivId = domDivId; //boardWrapper, not clear
	this.$startButton = $(this._selectors.startButton);
	this.$actionsButtons = $(this._selectors.actionButton);
	this.$attackButton = $(this._selectors.attackButton);
	this.$defendButton =	$(this._selectors.defendButton);
	this.$endTurnButton = $(this._selectors.endTurnButton);

	this.currentPlayer = {};
	this.accessibleCellList = [];
	this.deathmatch = false; //Change to true if two players are on adjacent cell
	this.cemetery = [];
};

GameEngine.prototype.getLastPlayerAlive = function() { //not very clear
	var playerIndex = 0;

	while (playerIndex <= this.playerStore.playerStoreList.length - 1) { //for each, not while
		var player = this.playerStore.getPlayer(playerIndex);

		if (player.isAlive()) {

			return player;

		} else {
			playerIndex++;
		}
	}
};

GameEngine.prototype.getPlayersNumber = function() {
	return this.playerStore.playerStoreList.length;
};

GameEngine.prototype.getWeaponsNumber = function() {
	return this.weaponStore.weaponStoreList.length;
};

GameEngine.prototype.getAppropriateSpawnPosition = function() {

	var i = 0; //boolean would be better
	while (i != 1) {

		var randomId = this.generateRandomId(this.boardManager.boardSize);
		var safeCell = this.boardManager.getCell(randomId); //not sure it's safe
		var surroundingCellsList = this.getSurroundingCells(safeCell);

		if ((this.checkEnnemyProximity(surroundingCellsList)) || (safeCell.status != CELL_STATUS_EMPTY )) {
			//Do nothing
		} else {
			//We can get out the loop with a really safe cell
			i++
		}
	}
	return safeCell;
};

GameEngine.prototype.getSurroundingCells = function(cell) {

	var splitCellId = cell.id.split("-");

	var currentRow = splitCellId[0];
	var previousRow = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(currentRow) - 1];
	var nextRow = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(currentRow) + 1];

	//comments
	var previousColumnNumber = parseInt(splitCellId[1], 10) - 1;
	var currentColumnNumber = parseInt(splitCellId[1], 10);
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

GameEngine.prototype.ChangeTurnToPlay = function() {

	var playerIndex = 0;
	while (playerIndex < this.getPlayersNumber()) {
		var player = this.playerStore.getPlayer(playerIndex);

		if (player.turnToPlay) {
			player.turnToPlay = false;
			this.currentPlayer = player;
			this.gameEffectManager.changeTheme(this.currentPlayer.color);

			//If we are not at the end of the players list
			if (playerIndex != this.playerStore.playerStoreList.length - 1) {
				playerIndex++;

			} else {
				playerIndex = 0;
			}
			this.playerStore.getPlayer(playerIndex).turnToPlay = true;
			break;
		}
		playerIndex++;
	}
};

GameEngine.prototype.definePlayerEnemy = function() {

	var surroundingCells = this.getSurroundingCells(this.currentPlayer.position);
	var players = this.playerStore.playerStoreList;
	var enemy = 'unknow';

	for(var key in surroundingCells) {
		var cell = this.boardManager.getCell(surroundingCells[key]);

		$.each(players, function (playerIndex, value) { //for each, not each jquery

			if (players[playerIndex].position == cell) {
				enemy = players[playerIndex];
			}
		});
	}
	return enemy;
};

GameEngine.prototype.getRandomNumber = function(number) { //comments or var
	return Math.floor(Math.random() * (number - 1) + 1);
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
	this.createAndStartManagers();

	this.$startButton.click(function() {
		this.startGame();
		this.playTurns();
	}.bind(this));
};

GameEngine.prototype.createAndStartManagers = function() { //inside constructor
	this.boardManager = new BoardManager(this.domDivId);
	this.boardManager.createBoard(8);

	this.gameEffectManager = new GameEffectManager(this.boardManager);
	this.gameEffectManager.createVisualFromBoardObject();

	this.playersDetailsManager = new PlayersDetailsManager();

	this.logsDetailsManager = new LogsDetailsManager();
};

GameEngine.prototype.createPlayers = function() {
	var playerRed = new Player('Joueur Rouge', 'red', true, 'red-background.png', this.logsDetailsManager);
	var playerBlue = new Player('Joueur Bleu', 'blue', false, 'blue-background.png', this.logsDetailsManager);

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
	this.logsDetailsManager.displayGameInfos('Début de la partie !');
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.installElementsOnBoard();

	//Displaying players infos (life, weapon...)
	for (var playerIndex = 0; playerIndex < this.getPlayersNumber(); playerIndex++) {
		this.playersDetailsManager.displayPlayersInfos(this.playerStore.getPlayer(playerIndex));
	}
};

GameEngine.prototype.playTurns = function() {

	if (this.enoughPlayersToFight()) {
		this.ChangeTurnToPlay();
		this.organisePlayerTurn();

	} else {
		this.endGame();
	}
};

GameEngine.prototype.endGame = function() {
	var winner = this.getLastPlayerAlive();
	alert(winner.name + ' a gagné ! Un nouvel essai ?');
	window.location.reload();
};

GameEngine.prototype.resetGame = function() {
	this.removeEvent(this.$actionsButtons);
	this.removeEvent('.cell');
	this.resetBoardVisual();
	this.logsDetailsManager.resetLogs();
	this.deathmatch = false;
	this.$attackButton.prop('disabled', true);
};

GameEngine.prototype.organisePlayerTurn = function() {
	this.playersDetailsManager.displayPlayersInfos(this.currentPlayer);
	this.organiseMovingPhase();
	this.organiseActionPhase();
};

GameEngine.prototype.organiseMovingPhase = function() {

	if (!this.deathmatch) { //Move only if players arent figthing
		this.setAccessibleCellList();
		this.gameEffectManager.addClassAccessible(this.accessibleCellList);
		this.setAccessiblesCellsEvent();
	}
};

GameEngine.prototype.setAccessiblesCellsEvent = function() {
	var self = this; //To keep both the jquery and object context

	$('.accessible').on("click", function() {

		//On what did the user clicked ?
		var clickedCellId = $(this).attr('id');
		var clickedCell = self.boardManager.getCell(clickedCellId);

		//Reset the old player's cell
		self.boardManager.resetCell(self.currentPlayer.position);

		//Send place to move and weapon that might be on cell to player
		var weaponOnCell = self.boardManager.checkAndReturnWeapon(clickedCell);
		self.currentPlayer.move(clickedCell, weaponOnCell);

		//Changes on the board and visuals effects related
		self.logsDetailsManager.displayGameInfos(self.currentPlayer.name + ' se déplace en ' + self.currentPlayer.position.id);

		self.boardManager.updateCellsAttributes(self.weaponStore, self.playerStore);
		self.playersDetailsManager.displayPlayersInfos(self.currentPlayer);

		self.checkAndActiveDeathmatch();
		self.removeAccessiblesCellsEvent();
	});
};

GameEngine.prototype.removeAccessiblesCellsEvent = function() {
	this.removeEvent('.cell');
	this.gameEffectManager.updateVisualFromBoardObject();
};


GameEngine.prototype.organiseActionPhase = function() {

	this.playersDetailsManager.displayPlayersInfos(this.currentPlayer);

	this.$attackButton.on("click", function() {
		var enemy = this.definePlayerEnemy();
		this.currentPlayer.attack(enemy);
		this.killPlayerIfNecessary(enemy);
		this.endTurn();
	}.bind(this));

	this.$defendButton.on("click", function() {
		this.currentPlayer.defend();
		this.endTurn();
	}.bind(this));

	this.$endTurnButton.on("click", function() {
		this.endTurn();
	}.bind(this));
};

GameEngine.prototype.endTurn = function() {
	this.removeAccessiblesCellsEvent(this.accessibleCellList); //Just in case the player choose not to move
	this.removeEvent(this.$actionsButtons);
	this.playTurns();
};

GameEngine.prototype.enoughPlayersToFight = function() {
	enoughPlayer = this.getPlayersNumber() - this.cemetery.length == 1 ? false : true;

	return enoughPlayer;
};

GameEngine.prototype.killPlayerIfNecessary = function(player) {

	if (!player.isAlive()) {
		player.life = 0;
		this.cemetery.push(player);
		console.log('He\'s dead Jim.');
	}
};

GameEngine.prototype.checkEnnemyProximity = function(surroundingCellsList) {
	var ennemyNumber = 0;

	for (var listIndex = 0; listIndex < surroundingCellsList.length; listIndex++) {
		var cell = this.boardManager.getCell(surroundingCellsList[listIndex]);

		if ((typeof cell != 'undefined') && (cell.status == CELL_STATUS_PLAYER)) { //comment the undefined
			ennemyNumber++;
		}
	}

	return ennemyNumber > 0 ? true : false;
};

GameEngine.prototype.checkAndActiveDeathmatch = function() {
	var closeToEnemy = this.checkEnnemyProximity(this.getSurroundingCells(this.currentPlayer.position)); //divide in two var for lisibility
	//can be a const (close to enemy)

	if (closeToEnemy) {
		this.deathmatch = true;
		this.$attackButton.prop('disabled', false);
		this.gameEffectManager.colorActionButtons(this.currentPlayer.color);
	}
};

GameEngine.prototype.isAccessible = function(cell) {

	if (typeof cell != 'undefined') {

		if ((cell.status == CELL_STATUS_EMPTY ) || (cell.status == CELL_STATUS_WEAPON)) {
			return true;

		} else {
			return false;
		}
	}
};

GameEngine.prototype.removeEvent = function(element) {
	$(element).unbind( "click" );
};

GameEngine.prototype.resetBoardVisual = function() { //move to game effect manager

	for(var key in this.boardManager.board) {
		var cell = this.boardManager.board[key];
		this.boardManager.resetCell(cell);
	}
	this.gameEffectManager.updateVisualFromBoardObject();
};


/*
 * Not really satisfied with the following
 * It reapeat itself a bit but I want a loop in each direction that will stop if the way is blocked
*/
GameEngine.prototype.setAccessibleCellList = function() {
	this.accessibleCellList = [];
	var currentCellId = this.currentPlayer.position.id.split("-");
	var currentRow = currentCellId[0];
	var currentColumn = parseInt(currentCellId[1], 10);

	/*Cells to the right*/
	for (var i = 1; i <= this.currentPlayer.movement; i++) {

		var nextCellId = currentRow + '-' + (currentColumn + i);
		var nextCell = this.boardManager.getCell(nextCellId);

		if (this.isAccessible(nextCell)) {
			this.accessibleCellList.push(nextCellId);
		} else {
			break;
		}
	}

	/*Cells to the left*/
	for (var i = 1; i <= this.currentPlayer.movement; i++) {

		var previousCellId = currentRow + '-' + (currentColumn - i);
		var previousCell = this.boardManager.getCell(previousCellId);

		if (this.isAccessible(previousCell)) {
			this.accessibleCellList.push(previousCellId);
		} else {
			break;
		}
	}

	/*Cells on top of the player's*/
	for (var i = 1; i <= this.currentPlayer.movement; i++) {

		var upperCellId = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(currentRow) - i] + '-' + currentColumn;
		var upperCell = this.boardManager.getCell(upperCellId);

		if (this.isAccessible(upperCell)) {
			this.accessibleCellList.push(upperCellId);
		} else {
			break;
		}
	}

	/*Cells beside the player's*/
	for (var i = 1; i <= this.currentPlayer.movement; i++) {

		var underCellId = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(currentRow) + i] + '-' + currentColumn;
		var underCell = this.boardManager.getCell(underCellId);

		if (this.isAccessible(underCell)) {
			this.accessibleCellList.push(underCellId);
		} else {
			break;
		}
	}
};