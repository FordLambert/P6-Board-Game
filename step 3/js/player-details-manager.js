var PlayersDetailsManager = function() {
	this.htmlDisplayBoxId = ''; //target the dom element for actual player's infos
};

//Display player's life, weapon and weapon damage
PlayersDetailsManager.prototype.displayPlayersInfos = function(player) {

	this.htmlDisplayBoxId = ('#' + player.color);

	var $lifeBar = $(this.htmlDisplayBoxId).find('.life');
	var $activeWeapon = $(this.htmlDisplayBoxId).find('.weapon');
	var $weaponStat = $(this.htmlDisplayBoxId).find('.weapon-stat');

	$lifeBar.text(player.life + '/100 pv');
	$activeWeapon.text('Arme : ' + player.weapon.name);
	$weaponStat.text('Dégats : ' + player.weapon.damage);
};