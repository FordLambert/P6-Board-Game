var Cell = function() {
	this.class = 'cell'; //each cell should have a 'cell' class in DOM that can change to 'playerOneCell' or 'playerTwoCell'
	// when a player are on it. 
	this.color = 'white'; //this can change if mouseover, css background change ? or changing class in dom too ? like class 'red'
	//or class 'white' ?
};

var Player = function() {
	//all action must depend on an 'if not dead' condition
	this.cell = ; //find a way to select a cell randomly when the gae start
	this.weapon = aGunOrSomethingIdk;
	this.life = 100; //must change when the ennemi shoot
	this.protected = false //change with the protect function
	this.color = blue or red //just to avoid mistake on who is who
	this.alive = true; //at first, if not anymore the game end

};

Player.prototype.move = function move(direction) {
	//something like : if the cell that had been clicked is not more than 3 cell away AND if it's not a wall the 
	//player will mmove on it
	i = 0;
	while (i < 4) {
		if (direction == up) {
			row --;
		} else if (direction == down) {
			row ++;
		} else if (direction == right){
			col ++;
		} else if (direction == left) {
			col --;
		} else {
			console.log('no direction had been choosen');
		};
		i++; //this is not good, what if we want to go up only one time ? and one to the right after that ?
};


Player.prototype.pickUp = function pickUp(weapon) {
	this.weapon = weapon;
	console.log('The weapon ' + weapon + ' is now equipped');
};

Player.prototype.shoot = function shoot() {
	if (the other player is not farer than one block && ennemy.protected = false) {
		ennemi.life = ennemi.life - weapon.damage 
	} else if (the other player is not farer than one block && ennemy.protected = true) {
		ennemy.life = enemy.life (weapon.damage / 2);
	if (ennemy.life <= 0) {
		enemy.alive = false;
	} else {
		console.log('you can not shoot from that far');
	}
};

Player.prototype.protect = function protect() {
	this. protected = true; //must be set to false on the next action
	console.log('the player is protected and will take only half damage !');
};

Player.prototype.play = function play() {
	if (this.alive) {
		this.move();
		manager.actionButton.addEventListener("click", function() {
			if (manager.startButton.value = shoot) {
				this.shoot();
			} else {
				this.protect();
			}
		});
	} else {
		manager.endGame();
	};
};

var Weapon = function(damage) {
	this.damage = damage;
	this.cell = ;//find a way to select a random cell to place it on creation.
};

var Manager = function() { //this class should exist from the begining and react to event by calling object's functions
	this.actionButton = document.querySelector('start-button');
};

Manager.prototype.createBoard = function createBoard() {
	//create random non praticables blocks, like 10 or such
};

Manager.prototype.createWeapon = function createWeapon() {
	var pistol = new Weapon(10);
	var sword = new Weapon(8);
	var shotgun = new Weapon(13);
	var banana = new Weapon(2);
	var uzi = new Weapon(11);
};

Manager.prototype.createPlayer = function createPlayer() {
	var playerBlue = new Player();
	var playerRed = new Player();
	//should we keep this ? is it a good thing to have an object creating another one ? same for createWepon()
};

Manager.prototype.startGame = function startGame() {
	this.createBoard();
	this.createPlayer();
	this.createWeapon();

};

Manager.prototype.endGame = function endGame() {
	var winner = '';
	if (playerBlue.alive) {
		winner = 'Player blue';
	} else {
		winner = 'Player red';
	}
	alert(winner + ' won the game ! Another try ?');
	window.location.reload();
};

Manager.prototype.playing = function playing() {
	this.startGame();
	while (playerBlue.alive && playerRed.alive) {
		playerBlue.play();
		playerRed.play();
	}
	this.endGame();
};

//starting the fight

var manager = new Manager();
manager.playing();