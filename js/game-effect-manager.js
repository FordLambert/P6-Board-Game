//if a function whatsoever had an impact on what the user see, it should be here 
var GameEffectManager = function(boardManager) {
	this.boardManager = boardManager;
	this.actionButton = $('.action-button');
	this.changingBackground = $('.progress-bar');
};

GameEffectManager.prototype.changeTheme = function(color) {
	this.changingBackground.attr('class', 'progress-bar progress-bar-striped active');
	this.changingBackground.addClass(this.getNewBgClass(color));
	this.actionButton.attr('class', 'col-md-4 actions-buttons');
	this.actionButton.addClass(color);
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
	        console.log('Erreur: Couleur Inconnue');
	}

	return strippedColor;

};
GameEffectManager.prototype.displayBoard = function() {

	for (var i = 0; i < this.boardManager.board.length; i ++) {
		var newCell = this.boardManager.getCell(i);
		newCell = $('<div>').addClass('cell').attr('id', newCell.id);
		$(this.boardManager.place).append(newCell);

	}

	//to remove
	var h = $('.cell:last-of-type').width();
	$('.cell').css({height: h, lineHeight: h + 'px'});
};

GameEffectManager.prototype.updateBoardDisplay = function() {	
	for (var i = 0; i < this.boardManager.board.length; i ++) {
		var actualCell = $('#' + this.boardManager.getCell(i).id);
		actualCell.css('background-image', 'url(pictures/' + this.boardManager.getCell(i).texture + ')');
		actualCell.attr('class', 'cell' +  ' ' + this.boardManager.getCell(i).status);
	}
};

GameEffectManager.prototype.resetCellStatus = function() {

	//to avoid conflict between the JQuery and object 'this'
	var boardManager = this.boardManager;

	$('.cell').each(function() {
		boardManager.resetCell($(this).attr('id'))
	});
	this.updateBoardDisplay();
};

GameEffectManager.prototype.toggleAccessiblesCells = function(cellidList) {
	for (var i = 0; i < cellidList.length; i++) {
		$('#' + cellidList[i]).toggleClass('accessible');
	}
};

GameEffectManager.prototype.displayPlayersInfos = function(player) {

	this.playerDisplayBoxid = ('#' + player.color);
	var lifeBar = $(this.playerDisplayBoxid).find('.life');
	var activeWeapon = $(this.playerDisplayBoxid).find('.weapon');
	var weaponStat = $(this.playerDisplayBoxid).find('.weapon-stat');

	lifeBar.text(player.life + '/100 pv');
	activeWeapon.text('Arme : ' + player.weapon.name);
	weaponStat.text('Dégats : ' + player.weapon.damage);
};

GameEffectManager.prototype.displayGameInfos = function(info) {
	this.displayArea = $('.display-area');
	this.displayArea.append('<p>' + info + '</p>');

    var pos = this.displayArea.scrollTop();
    this.displayArea.scrollTop(pos + 50);

};