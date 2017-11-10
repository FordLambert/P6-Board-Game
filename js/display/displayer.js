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
			/*newCell.mouseover(function() {
				manager.getCurrentCellId($(this).attr('id'));
			});*/
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

Displayer.prototype.updateCellStatus = function() {
	$('.cell').each(function() {
		for (var i = 0; i < gameManager.getPlayerNumber(); i ++) {
			var player = gameManager.playerStore.getPlayer(i);
			if ($(this).attr('id') == player.cell) {
			    gameManager.boardManager.getCellById(player.cell).texture = gameManager.playerStore.getPlayer(i).texture;
			    gameManager.boardManager.getCellById(player.cell).status = 'has-player';
			}
		}
		for (var i = 0; i < gameManager.getWeaponNumber(); i ++) {
			var weapon = gameManager.weaponStore.getWeapon(i);
			if  ($(this).attr('id') == weapon.cell) {
			    gameManager.boardManager.getCellById(weapon.cell).texture = gameManager.weaponStore.getWeapon(i).texture;
			    gameManager.boardManager.getCellById(weapon.cell).status = 'has-weapon';
			}
		}
	});
	this.updateBoardDisplay();
};

Displayer.prototype.resetCellStatus = function() {
	for (var i = 0; i < gameManager.boardManager.board.length; i ++) {
		gameManager.boardManager.getCell(i).texture = '';
		gameManager.boardManager.getCell(i).status = 'empty';
	}
	this.updateBoardDisplay();
};

Displayer.prototype.toggleAccessiblesCells = function(cellIdList) {
	for (var i = 0; i < cellIdList.length; i++) {
		$('#' + cellIdList[i]).toggleClass('accessible');
	}
};