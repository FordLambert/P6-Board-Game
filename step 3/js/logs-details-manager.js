var LogsDetailsManager = function() {
	this._selectors = {
		'logsDisplayArea': '.display-area'
	}
	this.$logsDisplayArea = $(this._selectors.logsDisplayArea);
};

//All infos on movement, combat and so made by players
LogsDetailsManager.prototype.displayGameInfos = function(info) {
	this.$logsDisplayArea.append('<p>' + info + '</p>');

	//This scroll down (in px) a little bit more each time the method is called
    var scrollActualPostion = this.$logsDisplayArea.scrollTop();
    this.$logsDisplayArea.scrollTop(scrollActualPostion + 80);
};