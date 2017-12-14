'use strict';
var PlayerStore = function() {
	this.playerStoreList = [];
};

PlayerStore.prototype.addPlayer = function(player) {
	this.playerStoreList.push(player);
};

PlayerStore.prototype.getPlayer = function(playerIndex) {
	return this.playerStoreList[playerIndex];
};