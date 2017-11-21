var GameEffectManager = function(boardManager) {
	this._selectors = {
		'actionButton': '.action-button',
		'changingBackground': '.progress-bar',
		'displayArea': '.display-area'
	}
	this.boardManager = boardManager;
	this.$actionButton = $(this._selectors.actionButton);
	this.$changingBackground = $(this._selectors.changingBackground);
	this.$displayArea = $(this._selectors.displayArea);
};

GameEffectManager.prototype.changeTheme = function(color) {
	this.$changingBackground.attr('class', 'progress-bar progress-bar-striped active');
	this.$changingBackground.addClass(this.getNewBgClass(color));
	this.$actionButton.attr('class', 'col-md-4 actions-buttons');
	this.$actionButton.addClass(color);
};

GameEffectManager.prototype.getNewBgClass = function(color) {
	var strippedColor = '';
	switch (color) {
	    case 'red':
	        strippedColor = 'progress-bar-danger';
	        break;
	    case 'blue':
	       	strippedColor = ''; //the default color is blue
	        break;
	    default:
	        console.log('Error: unknown color');
	}

	return strippedColor;

};

GameEffectManager.prototype.createVisualFromBoardObject = function() {

	for (var cellIndex = 0; cellIndex < this.boardManager.board.length; cellIndex++) {
		var newCell = this.boardManager.getCell(cellIndex);

		newCell = $('<div>').addClass('cell').attr('id', newCell.id);
		$(this.boardManager.divId).append(newCell);
	}
};

GameEffectManager.prototype.updateVisualFromBoardObject = function() {	
	for (var cellIndex = 0; cellIndex < this.boardManager.board.length; cellIndex++) {

		var actualCell = $('#' + this.boardManager.getCell(cellIndex).id);

		actualCell.css('background-image', 'url(pictures/' + this.boardManager.getCell(cellIndex).texture + ')');
		actualCell.attr('class', 'cell' +  ' ' + this.boardManager.getCell(cellIndex).status);
	}
};

GameEffectManager.prototype.resetBoardVisualAndGameInfos = function() {
	//to avoid conflict between the JQuery and object 'this'
	var boardManager = this.boardManager;

	$('.cell').each(function() {
		boardManager.resetCell($(this).attr('id'))
	});

	this.updateVisualFromBoardObject();
	this.$displayArea.html('<h2>Déroulement de la partie:</h2>');
};

GameEffectManager.prototype.addClassAccessible = function(cellidList) {
	//$.each(accessibleCells, function (index, value) {
	for (var i = 0; i < cellidList.length; i++) {
		$('#' + cellidList[i]).addClass('accessible');
	}
};

GameEffectManager.prototype.displayPlayersInfos = function(player) {

	this.playerDisplayBoxid = ('#' + player.color);

	var $lifeBar = $(this.playerDisplayBoxid).find('.life');
	var $activeWeapon = $(this.playerDisplayBoxid).find('.weapon');
	var $weaponStat = $(this.playerDisplayBoxid).find('.weapon-stat');

	$lifeBar.text(player.life + '/100 pv');
	$activeWeapon.text('Arme : ' + player.weapon.name);
	$weaponStat.text('Dégats : ' + player.weapon.damage);
};

//All infos on movement, combat and so made by players
GameEffectManager.prototype.displayGameInfos = function(info) {
	this.$displayArea.append('<p>' + info + '</p>');

	//This scroll down (in px) a little bit more each time the method is called
    var scrollActualPostion = this.$displayArea.scrollTop();
    this.$displayArea.scrollTop(scrollActualPostion + 80);
};