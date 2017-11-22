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
	this.$logsDisplayArea.append('<p>' + info + '</p>');

	//This scroll down (in px) a little bit more each time the method is called
    var scrollActualPostion = this.$gameInfosArea.scrollTop();
    this.$gameInfosArea.scrollTop(scrollActualPostion + 80);
};

LogsDetailsManager.prototype.resetLogs = function() {
	this.$logsDisplayArea.text('');
};