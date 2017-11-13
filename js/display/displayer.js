//if a function whatsoever had an impact on what the user see, it should be here 
var Displayer = function() {
	this.actionButton = $('.action-button');
	this.changingBackground = $('.progress-bar');
};

Displayer.prototype.changeTheme = function(color) {
	this.changingBackground.attr( 'class', 'progress-bar progress-bar-striped active');
	this.changingBackground.addClass(this.updateBakcgroundColor(color));
	this.actionButton.attr( 'class', 'col-md-4 actions-buttons');
	this.actionButton.addClass(color);
};

Displayer.prototype.updateBakcgroundColor = function(color) {
	var strippedColor = '';
	switch (color) {
	    case 'red':
	        strippedColor = 'progress-bar-danger';
	        break;
	    case 'blue':
	       	strippedColor = '';
	        break;
	    default:
	        console.log('Erreur: Couleur Inconnue');
	}
	return strippedColor;
};

Displayer.prototype.displayBoard = function(boardManager) {

	for (var i = 0; i < boardManager.board.length; i ++) {
		var newCell = boardManager.getCell(i);
		newCell = $('<div>').addClass('cell').attr('id', newCell.Id);
		$(boardManager.place).append(newCell);
	}
	var h = $('.cell:last-of-type').width();
	$('.cell').css({height: h, lineHeight: h + 'px'});
};

Displayer.prototype.updateBoardDisplay = function() {	
	for (var i = 0; i < gameManager.boardManager.board.length; i ++) {
		var actualCell = $('#' + gameManager.boardManager.getCell(i).Id);
		actualCell.css('background-image', 'url(pictures/' + gameManager.boardManager.getCell(i).texture + ')');
		actualCell.attr('class', 'cell' +  ' ' + gameManager.boardManager.getCell(i).status);
	}
};

Displayer.prototype.resetCellStatus = function() {
	$('.cell').each(function() {
		gameManager.boardManager.resetCell($(this).attr('id'))
	});
	this.updateBoardDisplay();
};

Displayer.prototype.toggleAccessiblesCells = function(cellIdList) {
	for (var i = 0; i < cellIdList.length; i++) {
		$('#' + cellIdList[i]).toggleClass('accessible');
	}
};

Displayer.prototype.displayPlayersInfos = function(player) {

	this.playerDisplayBoxId = ('#' + player.color);
	var lifeBar = $(this.playerDisplayBoxId).find('.life');
	var activeWeapon = $(this.playerDisplayBoxId).find('.weapon');
	var weaponStat = $(this.playerDisplayBoxId).find('.weapon-stat');

	lifeBar.text(player.life + '/100 pv');
	activeWeapon.text('Arme : ' + player.weapon.name);
	weaponStat.text('Dégats : ' + player.weapon.damage);
};

Displayer.prototype.displayGameInfos = function(info) {
	this.displayArea = $('.display-area');
	this.displayArea.append('<p>' + info + '</p>');

    var pos = this.displayArea.scrollTop();
    this.displayArea.scrollTop(pos + 50);

};