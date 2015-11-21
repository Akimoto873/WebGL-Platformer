/**
 * 
 */

function showGameOver() {
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