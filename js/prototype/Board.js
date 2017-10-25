var Cell = function(Id) {
	this.Id = Id;
	this.color = '#706F69'; //it's grey
};

var Board = function(cellStore, place) {
	this.cellStore= cellStore;
	this.place = place;
};

Board.prototype.createBoard = function() {
	for(var i = 0; i <= this.cellStore.cellList.length - 1; i ++) {
		var newCell = this.cellStore.getCell(i);
    	newCell = $('<div>').addClass('cell').attr('id', i + 1);
  		$(this.place).append(newCell);
	}
	this.updateBoard;
	var h = $('.cell:last-of-type').width();
	$('.cell').css({height: h, lineHeight: h + 'px'});
};

Board.prototype.updateBoard = function() {
	for(var i = 0; i <= this.cellStore.cellList.length - 1; i ++) {
		var actualCell = $('#' + (i + 1));
		actualCell.css('background-color', this.cellStore.getCell(i).color);
	}
};