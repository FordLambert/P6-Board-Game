var Board = function(cellsStore, place) {
	this.cellsStore= cellsStore;
	this.place = place;
};

Board.prototype.createBoard = function() {
	for(var i = 0; i <= this.cellsStore.cellsList.length - 1; i ++) {
		var newCell = this.cellsStore.getCell[i];
    	newCell = $('<div>').addClass('cell').attr('id', i);
    	$(this.place).append(newCell);
	}
	var h = $('.cell:last-of-type').width();
	$('.cell').css({height: h, lineHeight: h + 'px'});
};

var Cell = function(Id) {
	this.Id = Id;
	this.color = '#706F69'; //it's grey
};

var CellStore = function() {
	this.cellsList = [];
};

CellStore.prototype.addCells = function(cellNumber) {
	for(var i = 1; i <= cellNumber; i ++) {
		var cell = new Cell(i);
		this.cellsList.push(cell);
	}
};

CellStore.prototype.getCell = function(cellIndex) {
	return this.cellsList[cellIndex];
};

var cellStore = new CellStore;
cellStore.addCells(64);

var board = new Board(cellStore, '#board');
board.createBoard();