/**
 * 
 */



//Creates the health and stamina bars.
function createOverlay() {
	

	healthTexture = textureLoader.load('images/health.jpg');
	healthBoxTexture = textureLoader.load('images/healthBox.png');
	

	
	overlayContainer = document.createElement('div');
	document.body.appendChild(overlayContainer);

	
	var spriteMaterial = new THREE.SpriteMaterial({
		map : healthTexture,
		color : 0x00ff00
	});
	healthSprite = new THREE.Sprite(spriteMaterial);
	healthSprite.position.set(-(window.innerWidth / 3.2),
			-(window.innerHeight / 2) + 100, 10);
	healthSprite.scale.set(window.innerWidth / 3, window.innerHeight / 16, 1);
	orthoScene.add(healthSprite);
	var spriteMaterial2 = new THREE.SpriteMaterial({
		map : healthBoxTexture,
		color : 0x000000
	});
	healthSprite2 = new THREE.Sprite(spriteMaterial2);
	healthSprite2.position.set(-(window.innerWidth / 3.2),
			-(window.innerHeight / 2) + 100, 8);
	healthSprite2.scale
			.set(window.innerWidth / 2.8, window.innerHeight / 15, 1);
	orthoScene.add(healthSprite2);
	var spriteMaterial3 = new THREE.SpriteMaterial({
		map : healthTexture,
		color : 0x0000ff
	});
	staminaSprite = new THREE.Sprite(spriteMaterial3);
	staminaSprite.position.set(-(window.innerWidth / 3.2),
			-(window.innerHeight / 2.5) + 100, 10);
	staminaSprite.scale.set(window.innerWidth / 3, window.innerHeight / 16, 1);
	orthoScene.add(staminaSprite);
	var spriteMaterial4 = new THREE.SpriteMaterial({
		map : healthBoxTexture,
		color : 0x000000
	});
	staminaSprite2 = new THREE.Sprite(spriteMaterial4);
	staminaSprite2.position.set(-(window.innerWidth / 3.2),
			-(window.innerHeight / 2.5) + 100, 8);
	staminaSprite2.scale.set(window.innerWidth / 2.8, window.innerHeight / 15,
			1);
	orthoScene.add(staminaSprite2);
}

//Shows the game over screen on death.
function showGameOver() {
	bloodTexture = textureLoader.load('images/blood.jpg');
	gameOverTexture = textureLoader.load('images/gameOver.jpg');
	restartTexture = textureLoader.load('images/restart.jpg');
	var bloodMaterial = new THREE.SpriteMaterial({
		map : bloodTexture,
		opacity : 0.1
	});
	bloodSprite = new THREE.Sprite(bloodMaterial);
	bloodSprite.position.set(0, 0, 5);
	bloodSprite.scale.set(window.innerWidth, window.innerHeight, 1);
	orthoScene.add(bloodSprite);
	var gameOverMaterial = new THREE.SpriteMaterial({
		map : gameOverTexture,
		opacity : 0.0
	});
	gameOverSprite = new THREE.Sprite(gameOverMaterial);
	gameOverSprite.position.set(0, 0, 4);
	gameOverSprite.scale.set(window.innerWidth, window.innerHeight, 1);
	orthoScene.add(gameOverSprite);

	var restartSpriteMaterial = new THREE.SpriteMaterial({
		map : restartTexture,
		opacity : 0.0
	});
	restartSprite = new THREE.Sprite(restartSpriteMaterial);
	restartSprite.position.set(0, 0, 7);
	restartSprite.scale.set(window.innerWidth / 2.5, window.innerHeight / 2.5,
			1);
	orthoScene.add(restartSprite);
	gameOverScreen = true;
	gameOverAudio.play();
}

//Scales the health and stamina bars based on health and stamina remaining.
function checkChangesToHUD() {

	staminaSprite.scale.set(
			(Math.abs(stamina) / 200) * (window.innerWidth / 3),
			window.innerHeight / 16, 1);
	staminaSprite.position.x = (-window.innerWidth / 3.2)
			- (1 - Math.abs(stamina / 200)) * (window.innerWidth / 6.0);

	if (damaged) {
		healthSprite.scale.set((Math.abs(health) / 100)
				* (window.innerWidth / 3), window.innerHeight / 16, 1);
		healthSprite.position.x = (-window.innerWidth / 3.2)
				- (1 - Math.abs(health / 100)) * (window.innerWidth / 6.0);
		if (health > 80) {
			healthSprite.material.color.setHex(0x00ff00);
		}
		if (health < 80) {
			healthSprite.material.color.setHex(0xffff00);
		}
		if (health < 50) {
			healthSprite.material.color.setHex(0xff0000);
		}
		damaged = false;
	}

	if (gameOverScreen) {
		if (bloodSprite.material.opacity < 0.8) {

			bloodSprite.material.opacity += 0.01;
			gameOverSprite.material.opacity += 0.015;
		} else if (restartSprite.material.opacity < 0.5) {
			restartSprite.material.opacity += 0.02;
		}
	}

}

//removes the menu
function removeMenu(){
	menu = false;
	menuSprite.visible = false;
	playSprite.visible = false;
	optionsSprite.visible = false;
}
//shows the menu
function showMenu(){
	menu = true;
	menuSprite.visible = true;
	playSprite.visible = true;
	optionsSprite.visible = true;
}