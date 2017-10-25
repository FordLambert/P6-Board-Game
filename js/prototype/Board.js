var Cell = function() {
	this.class = 'cell'; //each cell should have a 'cell' class in DOM that can change to 'playerOneCell' or 'playerTwoCell'
	// when a player are on it. 
	this.color = 'white'; //this can change if mouseover, css background change ? or changing class in dom too ? like class 'red'
	//or class 'white' ?
};

var cells = 64;
var cell;
var h;

for(var i = 1; i <= cells; i ++)
{
    cell = $('<div>').addClass('cell').attr('data-cell', i).text(i);
    if(i % 2 == 1)
        cell.addClass('odd');
    
    $('#board').append(cell);
}

h = $('.cell:last-of-type').width();
$('.cell').css({height: h, lineHeight: h + 'px'});