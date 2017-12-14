'use strict';
var Player = function(name, color, texture) {
	this.name = name;
	this.weapon = {};
	this.life = 100;
	this.color = color;
	this.texture = texture;
	this.position = {}; //Where he is, nowhere at first
};