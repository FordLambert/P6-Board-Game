//-----Constructor
var GameEngine = function(boardid) {
	this._selectors = {
		'startButton': '.start-button'
	}
	this.boardid = boardid;
	this.$startButton = $(this._selectors.startButton);
	this.actualPlayer = {};
};

//-----Getters
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



//----Conditions methods
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

//-----Others methods
GameEngine.prototype.removeEvent = function(element) {
	$(element).unbind( "click" );
};

GameEngine.prototype.resetGame = function() {
	this.boardManager.resetUsedCellList();
	this.gameEffectManager.resetBoardVisualAndGameInfos();
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