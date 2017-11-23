var GameEffectManager = function(boardManager) {
	this._selectors = {
		'actionButtons': '.action-button',
		'changingBackground': '.progress-bar'
	}
	this.boardManager = boardManager;
	this.$actionButtons = $(this._selectors.actionButtons);
	this.$changingBackground = $(this._selectors.changingBackground);
};

GameEffectManager.prototype.changeTheme = function(color) {
	this.$changingBackground.attr('class', 'progress-bar progress-bar-striped active');
	this.$changingBackground.addClass(this.getNewBgClass(color));
	this.$actionButtons.attr('class', 'col-md-4 actions-buttons');

	this.colorActionButtons(color);
};

GameEffectManager.prototype.colorActionButtons = function(color) {
	this.$actionButtons.each(function() {

		if (!$(this).prop('disabled')) {
			$(this).addClass(color);
		}
	});
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
	for(var key in this.boardManager.board) {

		var newCell = this.boardManager.board[key];

		newCell = $('<div>').addClass('cell').attr('id', newCell.id);
		$(this.boardManager.domDivId).append(newCell);
	}
};

GameEffectManager.prototype.updateVisualFromBoardObject = function() {	
	for(var key in this.boardManager.board) {

		var cell = this.boardManager.board[key];
		var div = $('#' + cell.id)

		div.css('background-image', 'url(pictures/' + cell.texture + ')');
		div.attr('class', 'cell' +  ' ' + cell.status);
	}
};

GameEffectManager.prototype.addClassAccessible = function(cellIdList) {
	for (var i = 0; i < cellIdList.length; i++) {
		$('#' + cellIdList[i]).addClass('accessible');
	}
};