'use strict';
var LogsDetailsManager = function() {
	this._selectors = {
		'gameInfosWrapper': '.display-area',
		'logsDisplayArea': '.logs-area'
	}
	this.$gameInfosWrapper = $(this._selectors.gameInfosWrapper);
	this.$logsDisplayArea = $(this._selectors.logsDisplayArea);
};

//All infos on movement, combat and so made by players
LogsDetailsManager.prototype.displayGameInfos = function() {
	var self = this; //To keep both the jquery and object context

	$(document).on( 'logEvent', function(event, sentence) {
		var now = new Date();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		self.$logsDisplayArea.prepend('<p>' + hours + 'h ' + minutes + 'mn : ' + sentence + '</p>');
	});
};

LogsDetailsManager.prototype.resetLogs = function() {
	this.$logsDisplayArea.text('');
};