const CELL_STATUS_EMPTY = 'empty';
const CELL_STATUS_PLAYER = 'has-player';
const CELL_STATUS_WEAPON = 'has-weapon';
const CELL_STATUS_BLOCKED = 'is-blocked';

var Cell = function(id) {
	this.id = id;
	this.texture = ''; //can change to player or weapon picture's path
	this.status = CELL_STATUS_EMPTY;
};