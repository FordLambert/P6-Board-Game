var GameEngine = function(boardId) {
	this._selectors = {
		'startButton': '.start-button',
		'actionButton': '.action-button',
		'attackButton': '#attack',
		'defendButton': '#defend'
	}
	this.boardId = boardId;
	this.$startButton = $(this._selectors.startButton);
	this.$actionsButtons = $(this._selectors.actionButton);
	this.$attackButton = $(this._selectors.attackButton);
	this.$defendButton =	$(this._selectors.defendButton);
	this.actualPlayer = {};
	this.accessibleCellList = [];
	this.deathmatch = false;
	this.cemetery = [];
};

//-----Getters
GameEngine.prototype.getLastPlayerAlive = function() { //not very clear
	var playerIndex = 0;
	while (playerIndex <= this.playerStore.playerStoreList.length - 1) {

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

GameEngine.prototype.getSafeCell = function() {

	var i = 0;
	while (i != 1) {

		var randomId = this.attributeRandomCellId(this.boardManager.boardSize);
		var safeCell = this.boardManager.getCell(randomId);
		var surroundingCellsList = this.getSurroundingCells(safeCell);

		if ((this.checkEnnemyProximity(surroundingCellsList)) || (safeCell.status != CELL_STATUS_EMPTY )) {
			//do nothing
		} else {
			//we can get out the loop with a really safe cell
			i++
		}
	}
	return safeCell;
};

GameEngine.prototype.getSurroundingCells = function(cell) {

	var splitCellId = cell.id.split("-");

	var actualRow = splitCellId[0];
	var previousRow = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) - 1];
	var nextRow = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) + 1];

	var previousColumnNumber = parseInt(splitCellId[1], 10) - 1;
	var actualColumnNumber = parseInt(splitCellId[1], 10);
	var nextColumnNumber = parseInt(splitCellId[1], 10) + 1;

	//checking the cell just on top of this one and moving around from left to right (vertical and horizontal)

	var surroundingCellList = [
		(previousRow + '-' + actualColumnNumber),
		(actualRow + '-' + nextColumnNumber),
		(nextRow + '-' + actualColumnNumber),
		(actualRow + '-' + previousColumnNumber),
	];

	return surroundingCellList;
};

//----Setters
GameEngine.prototype.ChangeTurnToPlay = function() {

	var playerIndex = 0;
	while (playerIndex < this.playerStore.playerStoreList.length) {

		var player = this.playerStore.getPlayer(playerIndex)
		if (player.turnToPlay) {

		player.turnToPlay = false;
		this.actualPlayer = player;
		this.gameEffectManager.changeTheme(player.color);

			//if we are not at the end of the list
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

	var surroundingCells = this.getSurroundingCells(this.actualPlayer.position);
	var players = this.playerStore.playerStoreList;
	var enemy = 'unknow';

	for(var key in surroundingCells) {

		var cell = this.boardManager.getCell(surroundingCells[key]);

		$.each(players, function (playerIndex, value) {

			if (players[playerIndex].position == cell) {
				enemy = players[playerIndex];
			}
		});
	}
	return enemy;
};

//-----Random generators
GameEngine.prototype.getRandomNumber = function(number) {
	return Math.floor(Math.random() * (number - 1) + 1);
};

GameEngine.prototype.getRandomLetter = function(number) {
	//number is here to say : "how far must we go into the alphabet ?"
	var letter = this.boardManager.rowLetters[this.getRandomNumber(this.boardManager.boardSize - 1)];
	return letter;
};

GameEngine.prototype.generateRandomId = function(number) {
	var row = this.getRandomLetter(number);
	var index = this.getRandomNumber(number);
	var randomCellId = row + '-' + index;
	return randomCellId;
};

//-----How a complete game work
GameEngine.prototype.launchNewGame = function() {
	this.createAndStartManagers();
	this.$startButton.click(function() {
		this.startGame();
		this.playTurns();
	}.bind(this));
};

//Creation part, before starting to play
GameEngine.prototype.createAndStartManagers = function() {
	this.boardManager = new BoardManager(this.boardId);
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

//Now that everything exist, we can put them randomly on the board
GameEngine.prototype.randomizeBoardElements = function() {
	this.blockRandomCells();
	this.placeWeapons();
	this.placePlayers();

	//everything has a place, now show it
	this.gameEffectManager.updateVisualFromBoardObject();
};

GameEngine.prototype.blockRandomCells = function() {
	var blockedCellNumber = Math.floor(Math.random() * 5) + 5;
	for(var i = 0; i < blockedCellNumber; i ++) {

		var randomId = this.attributeRandomCellId(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCell(randomId);

		if (actualCell.status = CELL_STATUS_EMPTY) {
			actualCell.texture = 'blockedCell.png';
			actualCell.status = CELL_STATUS_BLOCKED;
		}
	}
};

GameEngine.prototype.placeWeapons = function() {

	for(var weaponIndex = this.getPlayersNumber(); weaponIndex < this.getWeaponsNumber(); weaponIndex ++) {

		var randomId = this.attributeRandomCellId(this.boardManager.boardSize);
		var cell = this.boardManager.getCell(randomId);

		if (cell.status = CELL_STATUS_EMPTY) {

			cell.texture = this.weaponStore.getWeapon(weaponIndex).texture;
			cell.status = CELL_STATUS_WEAPON;
			this.weaponStore.getWeapon(weaponIndex).position = cell;
		}
	}
};

GameEngine.prototype.placePlayers = function(player) {

	for(var playerIndex = 0; playerIndex < this.getPlayersNumber(); playerIndex ++) {

		var actualPlayer = this.playerStore.getPlayer(playerIndex);
		var cell = this.getSafeCell();

		cell.texture = actualPlayer.texture;
		cell.status = CELL_STATUS_PLAYER;
		actualPlayer.position = cell;
	}
};

//-----Process of a game
GameEngine.prototype.startGame = function() {

	this.resetGame();
	this.logsDetailsManager.displayGameInfos('Début de la partie !');
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.randomizeBoardElements();

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

//-----What happen during a player turn
GameEngine.prototype.organisePlayerTurn = function() {
	this.playersDetailsManager.displayPlayersInfos(this.actualPlayer);
	this.organiseMovingPhase();
	this.organiseActionPhase();
};


GameEngine.prototype.organiseMovingPhase = function() {
	//move only if players arent figthing
	if (!this.deathmatch) {

		this.configAccessibleCellList();
		this.gameEffectManager.addClassAccessible(this.accessibleCellList);

		this.setAccessiblesCellsEvent();
	}
};

GameEngine.prototype.setAccessiblesCellsEvent = function() {

	//To keep both the jquery and object context
	var self = this;

	$('.accessible').on("click", function() {

		//on what did the user clicked ?
		var clickedCellId = $(this).attr('id');
		var clickedCell = self.boardManager.getCell(clickedCellId);

		//reset the old player's cell
		self.boardManager.resetCell(self.actualPlayer.position);

		//check weapon presence on this cell
		var weaponOnCell = self.boardManager.checkAndReturnWeapon(clickedCell);
		//send place to move and weapon that might be on cell to player
		self.actualPlayer.move(clickedCell, weaponOnCell);

		//Changes on the board and visuals effects related
		self.logsDetailsManager.displayGameInfos(self.actualPlayer.name + ' se déplace en ' + self.actualPlayer.position.id);
		self.boardManager.updateBoard(self.weaponStore, self.playerStore);
		self.playersDetailsManager.displayPlayersInfos(self.actualPlayer);

		self.checkAndActiveDeathmatch();
		//job is done, remove accessibles cells
		self.removeAccessiblesCellsEvent();
	});
};

GameEngine.prototype.removeAccessiblesCellsEvent = function() {
	this.removeEvent('.cell');
	this.gameEffectManager.updateVisualFromBoardObject();
};


GameEngine.prototype.organiseActionPhase = function() {

	this.playersDetailsManager.displayPlayersInfos(this.actualPlayer);

	//attack
	this.$attackButton.on("click", function() {
		var enemy = this.definePlayerEnemy();
		//just in case the player choose not to move
		this.removeAccessiblesCellsEvent(this.accessibleCellList);
		
		this.actualPlayer.attack(enemy);
		this.removeEvent(this.$actionsButtons);

		this.killPlayerIfNecessary(enemy);
		this.playTurns();

	}.bind(this));

	//defend
	this.$defendButton.on("click", function() {
		//just in case the player choose not to move
		this.removeAccessiblesCellsEvent(this.accessibleCellList);

		this.actualPlayer.defend();
		this.removeEvent(this.$actionsButtons);
		this.playTurns();

	}.bind(this));

};

//----Conditions methods
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
		if ((typeof cell != 'undefined') && (cell.status == CELL_STATUS_PLAYER)) {
			ennemyNumber ++;
		} 
	}

	var isThereEnnemy = ennemyNumber > 0 ? true : false;
	return isThereEnnemy;

};

GameEngine.prototype.checkAndActiveDeathmatch = function() {

	var closeToEnemy = this.checkEnnemyProximity(this.getSurroundingCells(this.actualPlayer.position));

	if (closeToEnemy) {
		this.deathmatch = true;
		this.$attackButton.prop('disabled', false);
		this.gameEffectManager.colorActionButtons(this.actualPlayer.color);
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

//-----Others methods
GameEngine.prototype.removeEvent = function(element) {
	$(element).unbind( "click" );
};

GameEngine.prototype.resetGame = function() {
	this.removeEvent(this.$actionsButtons);
	this.removeEvent('.cell');
	this.boardManager.resetUsedCellList();
	this.gameEffectManager.resetBoardVisualAndGameInfos();
	this.deathmatch = false;
	this.$attackButton.prop('disabled', true);
};

GameEngine.prototype.attributeRandomCellId = function(number) {
	var cellId = this.generateRandomId(number);

	//check if this cell id is not used yet
	for (var cellIndex = 0; cellIndex <= this.boardManager.usedCellsId.length; cellIndex++) {

		//if this id had already been given
		if (cellId == this.boardManager.getUsedCellId(cellIndex)) {

			//we set a new value
			cellId = this.generateRandomId(number);
		}
	}
	//we add the new id to the "used" list and we return it
	this.boardManager.addUsedCellId(cellId);
	return cellId;
};

GameEngine.prototype.configAccessibleCellList = function() {

	this.accessibleCellList = [];

	var actualCellId = this.actualPlayer.position.id.split("-");

	var actualRow = actualCellId[0];
	var actualColumn = parseInt(actualCellId[1], 10);

	//the following reapeat itself a bit but I want a loop in each direction that will stop if the way is blocked

	//cells to the right
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var nextCellId = actualRow + '-' + (actualColumn + i);
		var nextCell = this.boardManager.getCell(nextCellId);

		if (this.isAccessible(nextCell)) {
			this.accessibleCellList.push(nextCellId);
		} else {
			break;
		}
	}

	//cells to the left
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var previousCellId = actualRow + '-' + (actualColumn - i);
		var previousCell = this.boardManager.getCell(previousCellId);

		if (this.isAccessible(previousCell)) {
			this.accessibleCellList.push(previousCellId);
		} else {
			break;
		}
	}

	//cells on top of the player's
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var upperCellId = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) - i] + '-' + actualColumn;
		var upperCell = this.boardManager.getCell(upperCellId);

		if (this.isAccessible(upperCell)) {
			this.accessibleCellList.push(upperCellId);
		} else {
			break;
		}
	}

	//cells beside the player's
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var underCellId = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) + i] + '-' + actualColumn;
		var underCell = this.boardManager.getCell(underCellId);

		if (this.isAccessible(underCell)) {
			this.accessibleCellList.push(underCellId);
		} else {
			break;
		}
	}
};