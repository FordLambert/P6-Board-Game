//-----Constructor
var GameEngine = function(boardid) {
	this._selectors = {
		'startButton': '.start-button',
		'actionButton': '.action-button',
		'attackButton': '#attack',
		'defendButton': '#defend'
	}
	this.boardid = boardid;
	this.$startButton = $(this._selectors.startButton);
	this.$actionsButtons = $(this._selectors.actionButton);
	this.$attackButton = $(this._selectors.attackButton);
	this.$defendButton =	$(this._selectors.defendButton);
	this.actualPlayer = {};
};

//-----Getters
GameEngine.prototype.getPlayerAttribute = function(attribute) {
	var playerIndex = 0;
	var condition = this.playerStore.getPlayer(playerIndex) + attribute;
	while (playerIndex < this.playerStore.playerStoreList.length - 1) {
		if (condition) {
			return this.playerStore.getPlayer(playerIndex);
		}
		playerIndex++;
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

		var randomId = this.attributeRandomCellid(this.boardManager.boardSize);
		var safeCell = this.boardManager.getCellByid(randomId);
		var surroundingCellsList = this.getSurroundingCells(safeCell.id);

		if ((this.checkEnnemyProximity(surroundingCellsList)) || (safeCell.status != 'empty')) {
			//do nothing
		} else {
			//we can get out the loop with a really safe cell
			i++
		}
	}
	return safeCell;
};

GameEngine.prototype.getSurroundingCells = function(cellId) {

	var splitCellId = cellId.split("-");

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

	var surroundingCells = this.getSurroundingCells(this.actualPlayer.cell);
	var players = this.playerStore.playerStoreList;
	var enemy = 'unknow';

	$.each(surroundingCells, function (cellIndex, value) {
		$.each(players, function (playerIndex, value) {

			if (players[playerIndex].cell == surroundingCells[cellIndex]) {
				enemy = players[playerIndex];
			}
		});
	});

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

GameEngine.prototype.generateRandomid = function(number) {
	var row = this.getRandomLetter(number);
	var index = this.getRandomNumber(number);
	var randomCellid = row + '-' + index;
	return randomCellid;
};

//-----How a complete game work
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
	this.gameEffectManager.createVisualFromBoardObject();
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
		var randomid = this.attributeRandomCellid(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellByid(randomid);
		if (actualCell.status = 'empty') {
			actualCell.texture = 'blockedCell.png';
			actualCell.status = 'is-blocked';
		}
	}
};

GameEngine.prototype.placeWeapons = function() {

	for(var weaponIndex = this.getPlayersNumber(); weaponIndex < this.getWeaponsNumber(); weaponIndex ++) {

		var randomId = this.attributeRandomCellid(this.boardManager.boardSize);
		var actualCell = this.boardManager.getCellByid(randomId);

		if (actualCell.status = 'empty') {

			actualCell.texture = this.weaponStore.getWeapon(weaponIndex).texture;
			actualCell.status = 'has-weapon';
			this.weaponStore.getWeapon(weaponIndex).cell = randomId;
		}
	}
};

GameEngine.prototype.placePlayers = function(player) {

	for(var playerIndex = 0; playerIndex < this.getPlayersNumber(); playerIndex ++) {

		var actualPlayer = this.playerStore.getPlayer(playerIndex);
		var cell = this.getSafeCell();

		cell.texture = actualPlayer.texture;
		cell.status = 'has-player';
		actualPlayer.cell = cell.id;
	}
};

//-----Process of a game
GameEngine.prototype.startGame = function() {

	this.resetGame();
	this.gameEffectManager.displayGameInfos('Début de la partie !');
	this.createPlayers();
	this.createWeapons();
	this.distributeWeapons();
	this.randomizeBoardElements();

	//Displaying players infos (life, weapon...)
	for (var playerIndex = 0; playerIndex < this.getPlayersNumber(); playerIndex++) {
		this.gameEffectManager.displayPlayersInfos(this.playerStore.getPlayer(playerIndex));
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
	var winner = this.getPlayerAttribute('.isAlive()');
	alert(winner.name + ' a gagné ! Un nouvel essai ?');
	window.location.reload();
};

//-----What happen during a player turn
GameEngine.prototype.organisePlayerTurn = function() {
	this.gameEffectManager.displayPlayersInfos(this.actualPlayer);
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

	//I don't like that but this is the only way i found (yet) to keep both the jquery and object context
	var self = this;

	$('.accessible').on("click", function() {

		//on what did the user clicked ?
		var clickedCellId = $(this).attr('id');
		var clickedCell = self.boardManager.getCellByid(clickedCellId);

		//reset the old player's cell
		self.boardManager.resetCell(self.actualPlayer.cell);

		//check weapon presence on this cell
		var weaponOnCell = self.boardManager.checkAndReturnWeapon(clickedCellId);
		//send place to move and weapon that might be on cell to player
		self.actualPlayer.move(clickedCell, weaponOnCell);

		//Changes on the board and visuals effects related
		self.gameEffectManager.displayGameInfos(self.actualPlayer.name + ' se déplace en ' + self.actualPlayer.cell);
		self.boardManager.updateBoard(self.weaponStore, self.playerStore);
		self.gameEffectManager.displayPlayersInfos(self.actualPlayer);

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

	this.gameEffectManager.displayPlayersInfos(this.actualPlayer);

	//attack
	this.$attackButton.on("click", function() {
		//just in case the player choose not to move
		this.removeAccessiblesCellsEvent(this.accessibleCellList);
		
		this.actualPlayer.attack(this.definePlayerEnemy());
		this.removeEvent(this.$actionsButtons);
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

	this.deadPlayers = [];

	for (var playerIndex = 0; playerIndex < this.getPlayersNumber(); playerIndex++) {
		var actualPlayer = this.playerStore.getPlayer(playerIndex);
		if (!actualPlayer.isAlive()) {
			this.deadPlayers.push(actualPlayer);
		}
	}

	enoughPlayer = this.getPlayersNumber() - this.deadPlayers.length == 1 ? false : true;
	return enoughPlayer;
};

GameEngine.prototype.checkEnnemyProximity = function(surroundingCellsList) {

	var ennemyNumber = 0;

	for (var listIndex = 0; listIndex < surroundingCellsList.length; listIndex++) {

		var cell = this.boardManager.getCellByid(surroundingCellsList[listIndex]);
		if ((typeof cell != 'undefined') && (cell.status == 'has-player')) {
			ennemyNumber ++;
		} 
	}

	var isThereEnnemy = ennemyNumber > 0 ? true : false;
	return isThereEnnemy;

};

GameEngine.prototype.checkAndActiveDeathmatch = function() {

	var closeToEnemy = this.checkEnnemyProximity(this.getSurroundingCells(this.actualPlayer.cell));

	if (closeToEnemy) {
		this.deathmatch = true;
		this.$attackButton.prop('disabled', false);
	}
};

GameEngine.prototype.isAccessible = function(cell) {
	if (typeof cell != 'undefined') {
		if ((cell.status == 'empty') || (cell.status == 'has-weapon')) {
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

GameEngine.prototype.attributeRandomCellid = function(number) {
	var cellid = this.generateRandomid(number);

	//check if this cell id is not used yet
	for (var cellIndex = 0; cellIndex <= this.boardManager.usedCellsid.length; cellIndex++) {

		//if this id had already been given
		if (cellid == this.boardManager.getUsedCellid(cellIndex)) {

			//we set a new value
			cellid = this.generateRandomid(number);
		}
	}
	//we add the new id to the "used" list and we return it
	this.boardManager.addUsedCellid(cellid);
	return cellid;
};

GameEngine.prototype.configAccessibleCellList = function() {

	this.accessibleCellList = [];

	var actualCellid = this.actualPlayer.cell.split("-");

	var actualRow = actualCellid[0];
	var actualColumn = parseInt(actualCellid[1], 10);

	//the following reapeat itself a bit but I want a loop in each direction that will stop if the way is blocked

	//cells to the right
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var nextCellId = actualRow + '-' + (actualColumn + i);
		var nextCell = this.boardManager.getCellByid(nextCellId);

		if (this.isAccessible(nextCell)) {
			this.accessibleCellList.push(nextCellId);
		} else {
			break;
		}
	}

	//cells to the left
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var previousCellId = actualRow + '-' + (actualColumn - i);
		var previousCell = this.boardManager.getCellByid(previousCellId);

		if (this.isAccessible(previousCell)) {
			this.accessibleCellList.push(previousCellId);
		} else {
			break;
		}
	}

	//cells on top of the player's
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var upperCellId = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) - i] + '-' + actualColumn;
		var upperCell = this.boardManager.getCellByid(upperCellId);

		if (this.isAccessible(upperCell)) {
			this.accessibleCellList.push(upperCellId);
		} else {
			break;
		}
	}

	//cells beside the player's
	for (var i = 1; i <= this.actualPlayer.movement; i++) {

		var underCellId = this.boardManager.rowLetters[this.boardManager.rowLetters.indexOf(actualRow) + i] + '-' + actualColumn;
		var underCell = this.boardManager.getCellByid(underCellId);

		if (this.isAccessible(underCell)) {
			this.accessibleCellList.push(underCellId);
		} else {
			break;
		}
	}
};