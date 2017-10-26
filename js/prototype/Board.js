var Cell = function(Id) {
	this.Id = Id;
	this.color = '#706F69';
};

var Board = function(cellStore, place) {
	this.cellStore= cellStore;
	this.place = place;
	this.rowNumber = Math.sqrt(this.cellStore.cellList.length);
	this.rowLetters = Array.from('abcdefghijklmnopqrstuvwxyz');
};

Board.prototype.createBoard = function() {
	this.assembleCells();
	this.addRowLetters();

	var h = $('.cell:last-of-type').width();
	$('.cell').css({height: h, lineHeight: h + 'px'});
};

Board.prototype.assembleCells = function() {
	for(var i = 0; i < this.cellStore.cellList.length; i ++) {
		var newCell = this.cellStore.getCell(i);
    	newCell = $('<div>').addClass('cell').attr('id', i + 1);
    	newCell.mouseover(function() {
			manager.getCurrentCellId($(this).attr('id'));
    	});
  		$(this.place).append(newCell);
	}
};

Board.prototype.addRowLetters = function() {
	var rowChanger = 0;
	for(var line = 0; line < this.rowNumber; line++) {
		var rowLetter = this.rowLetters[line];
		for (var i = 1 ; i <= this.rowNumber; i++) {
			$('#' + (i + rowChanger)).addClass(rowLetter);
		}
		rowChanger += this.rowNumber;
	}
}