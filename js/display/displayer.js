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

Displayer.prototype.displayBoard = function(boardMaker) {

	for (var i = 0; i < boardMaker.board.length; i ++) {
		var newCell = boardMaker.getCell(i);
		newCell = $('<div>').addClass('cell').attr('id', newCell.Id);
		$(boardMaker.place).append(newCell);
			/*newCell.mouseover(function() {
				manager.getCurrentCellId($(this).attr('id'));
			});*/
	}
	var h = $('.cell:last-of-type').width();
	$('.cell').css({height: h, lineHeight: h + 'px'});
};

Displayer.prototype.updateBoardDisplay = function() {	
	for (var i = 0; i < manager.boardMaker.board.length; i ++) {
		var actualCell = $('#' + manager.boardMaker.getCell(i).Id);
		actualCell.css('background-image', 'url(pictures/' + manager.boardMaker.getCell(i).texture + ')');
		actualCell.attr('class', 'cell' +  ' ' + manager.boardMaker.getCell(i).status);
	}
};

Displayer.prototype.updateCellStatus = function() {
	$('.cell').each(function() {
		for (var i = 0; i < manager.getPlayerNumber(); i ++) {
			var player = manager.playerStore.getPlayer(i);
			if ($(this).attr('id') == player.cell) {
			    manager.boardMaker.getCellById(player.cell).texture = manager.playerStore.getPlayer(i).texture;
			    manager.boardMaker.getCellById(player.cell).status = 'has-player';
			}
		}
		for (var i = 0; i < manager.getWeaponNumber(); i ++) {
			var weapon = manager.weaponStore.getWeapon(i);
			if  ($(this).attr('id') == weapon.cell) {
			    manager.boardMaker.getCellById(weapon.cell).texture = manager.playerStore.getWeapon(i).texture;
			    manager.boardMaker.getCellById(weapon.cell).status = 'has-weapon';
			}
		}
	});
	this.updateBoardDisplay();
};

Displayer.prototype.resetCellStatus = function() {
	for (var i = 0; i < manager.boardMaker.board.length; i ++) {
		manager.boardMaker.getCell(i).texture = '';
		manager.boardMaker.getCell(i).status = 'empty';
	}
	this.updateBoardDisplay();
};