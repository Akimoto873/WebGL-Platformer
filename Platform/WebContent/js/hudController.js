//Creates the health and stamina bars.
function createOverlay() 
{
    // Create and append overlay container
    overlayContainer = document.createElement('div');
    document.body.appendChild(overlayContainer);

    // Textures
    healthTexture = textureLoader.load('images/health.jpg');
    healthBoxTexture = textureLoader.load('images/healthBox.png');

    // Health Bar Texture
    var spriteMaterial = new THREE.SpriteMaterial({
            map : healthTexture,
            color : 0x00ff00
    });
    healthSprite = new THREE.Sprite(spriteMaterial);
    healthSprite.position.set(-(window.innerWidth / 3.2), -(window.innerHeight / 2) + 100, 10);
    healthSprite.scale.set(window.innerWidth / 3, window.innerHeight / 16, 1);
    orthoScene.add(healthSprite);

    // Health Box Texture
    var spriteMaterial2 = new THREE.SpriteMaterial({
            map : healthBoxTexture,
            color : 0x000000
    });
    healthSprite2 = new THREE.Sprite(spriteMaterial2);
    healthSprite2.position.set(-(window.innerWidth / 3.2), -(window.innerHeight / 2) + 100, 8);
    healthSprite2.scale.set(window.innerWidth / 2.8, window.innerHeight / 15, 1);
    orthoScene.add(healthSprite2);

    // Stamina Bar Texture
    var spriteMaterial3 = new THREE.SpriteMaterial({
            map : healthTexture,
            color : 0x0000ff
    });
    staminaSprite = new THREE.Sprite(spriteMaterial3);
    staminaSprite.position.set(-(window.innerWidth / 3.2), -(window.innerHeight / 2.5) + 100, 10);
    staminaSprite.scale.set(window.innerWidth / 3, window.innerHeight / 16, 1);
    orthoScene.add(staminaSprite);

    // Stamina Box Texture
    var spriteMaterial4 = new THREE.SpriteMaterial({
            map : healthBoxTexture,
            color : 0x000000
    });
    staminaSprite2 = new THREE.Sprite(spriteMaterial4);
    staminaSprite2.position.set(-(window.innerWidth / 3.2), -(window.innerHeight / 2.5) + 100, 8);
    staminaSprite2.scale.set(window.innerWidth / 2.8, window.innerHeight / 15, 1);
    orthoScene.add(staminaSprite2);
}

/* Shows the game over screen on death */
function showGameOver() {
    
        // Textures
	bloodTexture = textureLoader.load('images/blood.jpg');
	gameOverTexture = textureLoader.load('images/gameOver.jpg');
	restartTexture = textureLoader.load('images/restart.jpg');
        
        // Blood Material (splash on screen)
	var bloodMaterial = new THREE.SpriteMaterial({
		map : bloodTexture,
		opacity : 0.1
	});
	bloodSprite = new THREE.Sprite(bloodMaterial);
	bloodSprite.position.set(0, 0, 5);
	bloodSprite.scale.set(window.innerWidth, window.innerHeight, 1);
	orthoScene.add(bloodSprite);
        
        // Game Over Screen
	var gameOverMaterial = new THREE.SpriteMaterial({
		map : gameOverTexture,
		opacity : 0.0
	});
	gameOverSprite = new THREE.Sprite(gameOverMaterial);
	gameOverSprite.position.set(0, 0, 4);
	gameOverSprite.scale.set(window.innerWidth, window.innerHeight, 1);
	orthoScene.add(gameOverSprite);

        // Press R to restart message screen
	var restartSpriteMaterial = new THREE.SpriteMaterial({
		map : restartTexture,
		opacity : 0.0
	});
	restartSprite = new THREE.Sprite(restartSpriteMaterial);
	restartSprite.position.set(0, 0, 7);
	restartSprite.scale.set(window.innerWidth / 2.5, window.innerHeight / 2.5, 1);
	orthoScene.add(restartSprite);
        
        
	gameOverScreen = true;
	gameOverAudio.play();
}

// Scales the health and stamina bars based on health and stamina remaining.
function checkChangesToHUD() {
    staminaSprite.scale.set((Math.abs(stamina) / 200) * (window.innerWidth / 3), window.innerHeight / 16, 1);
    staminaSprite.position.x = (-window.innerWidth / 3.2) - (1 - Math.abs(stamina / 200)) * (window.innerWidth / 6.0);

    // If you have been hurt, we update the apperance of your health
    if (damaged) {
        // Update the size of the health bar according to your amount of health
        healthSprite.scale.set((Math.abs(health) / 100) * (window.innerWidth / 3), window.innerHeight / 16, 1);
        healthSprite.position.x = (-window.innerWidth / 3.2) - (1 - Math.abs(health / 100)) * (window.innerWidth / 6.0);
        
        // Color codes your health bar according to amount of health
        if (health > 80) {
                healthSprite.material.color.setHex(0x00ff00);   // Green
        }
        if (health < 80) {
                healthSprite.material.color.setHex(0xffff00);   // Yellow
        }
        if (health < 50) {
                healthSprite.material.color.setHex(0xff0000);   // Red
        }
        
        // Set damaged to false to prevent taking further damage from the source
        damaged = false;
    }

    // Fading in the game over screen(s)
    if (gameOverScreen) {
        if (bloodSprite.material.opacity < 0.8) {
                bloodSprite.material.opacity += 0.01;
                gameOverSprite.material.opacity += 0.015;
        } else if (restartSprite.material.opacity < 0.5) {
                restartSprite.material.opacity += 0.02;
        }
    }
}

// Removes the menu
function removeMenu(){
    menu = false;
    menuSprite.visible = false;
    playSprite.visible = false;
    optionsSprite.visible = false;
}

// Shows the menu
function showMenu(){
    menu = true;
    menuSprite.visible = true;
    playSprite.visible = true;
    optionsSprite.visible = true;
}