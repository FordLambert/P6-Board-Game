'use strict';
var PlayersDetailsManager = function() {
	this.playerInfosWrapper = ''; //Target the dom element for actual player's infos
};

PlayersDetailsManager.prototype.updatePlayerInfos = function(player) {
	this.playerInfosWrapper = ('.' + player.color);

	var $lifeBar = $(this.playerInfosWrapper).find('.life');
	var $activeWeapon = $(this.playerInfosWrapper).find('.weapon');
	var $weaponDamage = $(this.playerInfosWrapper).find('.weapon-stat');

	$lifeBar.text(player.life + '/100 pv');
	$activeWeapon.text('Arme : ' + player.weapon.name);
	$weaponDamage.text('Dégats : ' + player.weapon.damage);
};