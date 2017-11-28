var LogsDetailsManager = function() {
	this._selectors = {
		'gameInfosArea': '.display-area',
		'logsDisplayArea': '.logs-area'
	}
	this.$gameInfosArea = $(this._selectors.gameInfosArea);
	this.$logsDisplayArea = $(this._selectors.logsDisplayArea);
};

//All infos on movement, combat and so made by players
LogsDetailsManager.prototype.displayGameInfos = function(info) {
	var now = new Date();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	this.$logsDisplayArea.prepend('<p>' + hours + 'h ' + minutes + 'mn : ' + info + '</p>');
};

LogsDetailsManager.prototype.resetLogs = function() {
	this.$logsDisplayArea.text('');
};