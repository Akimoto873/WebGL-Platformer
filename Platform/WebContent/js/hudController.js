//Creates the health and stamina bars.
var spriteXPosition;
var spriteXScale;
var spriteXScale2;
var spriteYScale;
var spriteYScale2;
var damageWarning = false;
var damageFrames = 0;


// Create HUD Overlay
var g;
var text;
var bitmap;
var scoreMaterial;
function createOverlay() 
{
    // Scales
    spriteXScale = window.innerWidth / 2.8;
    spriteYScale = window.innerHeight / 17;
    spriteXScale2 = window.innerWidth / 2.5;
    spriteYScale2 = window.innerHeight / 16;
    spriteXPosition = (-window.innerWidth / 2.1) + spriteXScale2/2;
    bonusArray['points'] = 0;
    bonusArray['savedScore'] = 0;
    
    createScoreTracker();
    createKeyTracker();
    createTipsTracker();
    createLivesTracker();
	
    

    // Textures
    healthTexture = textureLoader.load('images/health.jpg');
    healthBoxTexture = textureLoader.load('images/healthBox.png');

    // Health Bar Texture
    var spriteMaterial = new THREE.SpriteMaterial({
            map : healthTexture,
            color : 0x00ff00
    });
    healthSprite = new THREE.Sprite(spriteMaterial);
    healthSprite.position.set(spriteXPosition, -(window.innerHeight / 2.5), 10);
    healthSprite.scale.set(spriteXScale, spriteYScale, 1);
    orthoScene.add(healthSprite);

    // Health Box Texture
    var spriteMaterial2 = new THREE.SpriteMaterial({
            map : healthBoxTexture,
            color : 0x000000
    });
    healthSprite2 = new THREE.Sprite(spriteMaterial2);
    healthSprite2.position.set(spriteXPosition, -(window.innerHeight / 2.5), 8);
    healthSprite2.scale.set(spriteXScale2, spriteYScale2, 1);
    orthoScene.add(healthSprite2);

    // Stamina Bar Texture
    var spriteMaterial3 = new THREE.SpriteMaterial({
            map : healthTexture,
            color : 0x0000ff
    });
    staminaSprite = new THREE.Sprite(spriteMaterial3);
    staminaSprite.position.set(spriteXPosition, -(window.innerHeight / 3.5), 10);
    staminaSprite.scale.set(spriteXScale, spriteYScale, 1);
    orthoScene.add(staminaSprite);

    // Stamina Box Texture
    var spriteMaterial4 = new THREE.SpriteMaterial({
            map : healthBoxTexture,
            color : 0x000000
    });
    staminaSprite2 = new THREE.Sprite(spriteMaterial4);
    staminaSprite2.position.set(spriteXPosition, -(window.innerHeight / 3.5), 8);
    staminaSprite2.scale.set(spriteXScale2, spriteYScale2, 1);
    orthoScene.add(staminaSprite2);
    
    
    // Crosshair used in level 2 for the "Lights on!" minigame
    staminaSprite.visible = false;
    healthSprite.visible = false;
    staminaSprite2.visible = false;
    healthSprite2.visible = false;

    var spriteMaterial5 = new THREE.SpriteMaterial({
            color: 0xff0000
    });
    crossHairSprite = new THREE.Sprite(spriteMaterial5);
    crossHairSprite.position.set(0,0,5);
    crossHairSprite.scale.set(4,4,1);
    orthoScene.add(crossHairSprite);
    crossHairSprite.visible = false;
    
}


// Shows the game over screen on death
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
    audioArray['walk'].pause();
    audioArray['death'].play();
}


// Scales the health and stamina bars based on health and stamina remaining.
var mouseTip = true;
function checkChangesToHUD() {
    if(menu){
            staminaSprite.visible = false;
            healthSprite.visible = false;
            staminaSprite2.visible = false;
            healthSprite2.visible = false;
    }
    else{
            staminaSprite.visible = true;
            healthSprite.visible = true;
            staminaSprite2.visible = true;
            healthSprite2.visible = true;
    }

    staminaSprite.scale.set((Math.abs(stamina) / 200) * spriteXScale, spriteYScale, 1);
    staminaSprite.position.x = (spriteXPosition)  - (1 - (Math.abs(stamina)/200)) * spriteXScale / 2;

    // Damage effect
    if(damageWarning){
        if(damageFrames > 5){
                damageSprite.visible = false;
                damageWarning = false;
        }
        damageFrames += 1;
    }

    // If you have been hurt, we update the apperance of your health
    if (damaged) {
        
        // Update the size of the health bar according to your amount of health
        healthSprite.scale.set((Math.abs(health) / 100) * spriteXScale, spriteYScale, 1);
        healthSprite.position.x = (spriteXPosition)  - (1 - (Math.abs(health)/100)) * spriteXScale / 2;

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
    
    // TODO: Comment
    crossHairSprite.visible = false;
    if(level == 2 && !menu && !reAddPuzzle){
        var distance = new THREE.Vector3();
        distance.subVectors(player.mesh.position, puzzle.position);
        if(distance.length() < 10){
            crossHairSprite.visible = true;
            if(mouseTip){
            	var tipText1 = "Sometimes you can click on things.";
            	var tipText2 = "The red crosshair in the middle,";
            	var tipText3 = "indicates when it's possible :)";
            	var input = [];
            	input.push(tipText1);
            	input.push(tipText2);
            	input.push(tipText3);
            	updateTipsTracker(input);
            	showTips();
            	mouseTip = false;
            }
        }
    }
  
    if(level == 3 && !menu){
    	var distance = new THREE.Vector3();
        distance.subVectors(player.mesh.position, targetTile.mesh.position);
        if(distance.length() < UNITSIZE*4){
            crossHairSprite.visible = true;
        }
    }
    if(showingTips){
    	tipsTime += 1;
    	tipsTrackerSprite.material.opacity -= 0.0025;
    	if(tipsTime > 500){
    		hideTips();
    	}
    }
}


// Hides the menu
var startTip = true;
function removeMenu(){
    menu = false;
    menuSprite.visible = false;
    playSprite.visible = false;
    optionsSprite.visible = false;
    controlsSprite.visible = false;
    controlsScreenSprite.visible = false;
    optionsScreenSprite.visible = false;
    backSprite.visible = false;
    scoreSprite.visible = true;
    keyTrackerSprite.visible = true;
    livesTrackerSprite.visible = true;
    if(startTip){
    	var tipText1 = "Find the way to the next level !";
    	var tipText2 = "Try to gather Dungs on the way for points.";
    	var input = [];
    	input.push(tipText1);
    	input.push(tipText2);
    	updateTipsTracker(input);
    	showTips();
    	startTip = false;
    }
    controls = false;
    scene.simulate();
}


// Shows the menu
function showMenu(){
    menu = true;
    menuSprite.visible = true;
    playSprite.visible = true;
    optionsSprite.visible = true;
    controlsSprite.visible = true;
    scoreSprite.visible = false;
    keyTrackerSprite.visible = false;
    livesTrackerSprite.visible = false;
}


// Show help/control page
function showControls(){
    menuSprite.visible = false;
    playSprite.visible = false;
    optionsSprite.visible = false;
    controlsSprite.visible = false;
    controlsScreenSprite.visible = true;
    backSprite.visible = true;
    controls = true;
}


// Show options page
function showOptions(){
	menuSprite.visible = false;
	playSprite.visible = false;
	optionsSprite.visible = false;
	controlsSprite.visible = false;
	optionsScreenSprite.visible = true;
	backSprite.visible = true;
	controls = true;
}


// Return to menu
function backToMenu(){
    menuSprite.visible = true;
    playSprite.visible = true;
    optionsSprite.visible = true;
    controlsSprite.visible = true;
    controlsScreenSprite.visible = false;
    optionsScreenSprite.visible = false;
    backSprite.visible = false;
    controls = false;
}


// Remove loading screen
function removeLoadingScreen(){
    loadingBackgroundSprite.visible = false;
    loadingBarSprite.visible = false;
    showMenu();
}

function createScoreTracker(){
	text = "Score: " + bonusArray['points'];
    bitmap = document.createElement('canvas');
    bitmap.width = 256;
    bitmap.height = 128;
    g = bitmap.getContext('2d');
    g.font = 'Bold 30px Arial';

    g.fillStyle = 'black';
    g.fillText(text, 0, 40);
    g.strokeStyle = 'black';
    g.strokeText(text, 0, 40);

    // canvas contents will be used for a texture
    textureArray['score'] = new THREE.Texture(bitmap) 
    textureArray['score'].needsUpdate = true;
    scoreMaterial = new THREE.SpriteMaterial({map: textureArray['score'], opacity: 0.5});
    scoreMaterial.transparent = true;
    scoreSprite = new THREE.Sprite(scoreMaterial);
    scoreSprite.position.set(window.innerWidth/3, window.innerHeight/3, 1);
    scoreSprite.scale.set(200, 100, 1);
    orthoScene.add(scoreSprite);
    scoreSprite.visible = false;
}
var text2;
var bitmap2;
var g2;
function createKeyTracker(){
	bonusArray['keys'] = 0;
	text2 = "Keys: " + bonusArray['keys'];
    bitmap2 = document.createElement('canvas');
    bitmap2.width = 256;
    bitmap2.height = 128;
    g2 = bitmap2.getContext('2d');
    g2.font = 'Bold 30px Arial';

    g2.fillStyle = 'black';
    g2.fillText(text2, 0, 40);
    g2.strokeStyle = 'black';
    g2.strokeText(text2, 0, 40);

    // canvas contents will be used for a texture
    textureArray['keys'] = new THREE.Texture(bitmap2) 
    textureArray['keys'].needsUpdate = true;
    keyTrackerMaterial = new THREE.SpriteMaterial({map: textureArray['keys'], opacity: 0.5});
    keyTrackerMaterial.transparent = true;
    keyTrackerSprite = new THREE.Sprite(keyTrackerMaterial);
    keyTrackerSprite.position.set(window.innerWidth/3, window.innerHeight/4, 1);
    keyTrackerSprite.scale.set(200, 100, 1);
    orthoScene.add(keyTrackerSprite);
    keyTrackerSprite.visible = false;
}

function createLivesTracker(){
	bonusArray['lives'] = 3;
	livesText = "Lives: " + bonusArray['lives'];
    livesMap = document.createElement('canvas');
    livesMap.width = 256;
    livesMap.height = 128;
    livesContext = livesMap.getContext('2d');
    livesContext.font = 'Bold 30px Arial';

    livesContext.fillStyle = 'black';
    livesContext.fillText(livesText, 0, 40);
    livesContext.strokeStyle = 'black';
    livesContext.strokeText(livesText, 0, 40);

    // canvas contents will be used for a texture
    textureArray['lives'] = new THREE.Texture(livesMap) 
    textureArray['lives'].needsUpdate = true;
    livesTrackerMaterial = new THREE.SpriteMaterial({map: textureArray['lives'], opacity: 0.5});
    livesTrackerMaterial.transparent = true;
    livesTrackerSprite = new THREE.Sprite(livesTrackerMaterial);
    livesTrackerSprite.position.set(-window.innerWidth/3, window.innerHeight/3, 1);
    livesTrackerSprite.scale.set(200, 100, 1);
    orthoScene.add(livesTrackerSprite);
    livesTrackerSprite.visible = false;
}

function updateLives(){
	livesText = "Lives: " + bonusArray['lives'];
    livesMap = document.createElement('canvas');
    livesMap.width = 256;
    livesMap.height = 128;
    livesContext = livesMap.getContext('2d');
    livesContext.font = 'Bold 30px Arial';

    livesContext.fillStyle = 'black';
    livesContext.fillText(livesText, 0, 40);
    livesContext.strokeStyle = 'black';
    livesContext.strokeText(livesText, 0, 40);

    // canvas contents will be used for a texture
    textureArray['lives'] = new THREE.Texture(livesMap) 
    textureArray['lives'].needsUpdate = true;
    livesTrackerMaterial.map = textureArray['lives'];
}

function updateScore(){
	text = "Score:" + bonusArray['points'];
	bitmap = document.createElement('canvas');
    bitmap.width = 256;
    bitmap.height = 128;
    g = bitmap.getContext('2d');
    g.font = 'Bold 30px Arial';
    g.fillStyle = 'black';
    g.fillText(text, 0, 40);
    g.strokeStyle = 'black';
    g.strokeText(text, 0, 40);
    textureArray['score'] = new THREE.Texture(bitmap);
    textureArray['score'].needsUpdate = true;
    scoreMaterial.map = textureArray['score'];
}

function updateKeys(){
	text2 = "Keys: " + bonusArray['keys'];
    bitmap2 = document.createElement('canvas');
    bitmap2.width = 256;
    bitmap2.height = 128;
    g2 = bitmap2.getContext('2d');
    g2.font = 'Bold 30px Arial';

    g2.fillStyle = 'black';
    g2.fillText(text2, 0, 40);
    g2.strokeStyle = 'black';
    g2.strokeText(text2, 0, 40);

    // canvas contents will be used for a texture
    textureArray['keys'] = new THREE.Texture(bitmap2) 
    textureArray['keys'].needsUpdate = true;
    keyTrackerMaterial.map = textureArray['keys'];
}
var tipsText;
var tipsMap;
var tipsContext;

function createTipsTracker(){
	tipsText = "";
    tipsMap = document.createElement('canvas');
    tipsMap.width = window.innerWidth/2;
    tipsMap.height = window.innerHeight/2;
    tipsContext = tipsMap.getContext('2d');
    tipsContext.font = 'Bold 40px Arial';

    tipsContext.fillStyle = 'teal';
    tipsContext.fillText(tipsText, 0, 40);
    tipsContext.strokeStyle = 'teal';
    tipsContext.strokeText(tipsText, 0, 40);

    // canvas contents will be used for a texture
    textureArray['tips'] = new THREE.Texture(tipsMap) 
    textureArray['tips'].needsUpdate = true;
    tipsTrackerMaterial = new THREE.SpriteMaterial({map: textureArray['tips'], opacity: 1});
    tipsTrackerMaterial.transparent = true;
    tipsTrackerSprite = new THREE.Sprite(tipsTrackerMaterial);
    tipsTrackerSprite.position.set(0, 0, 1);
    tipsTrackerSprite.scale.set(window.innerWidth/2, window.innerHeight/2, 1);
    orthoScene.add(tipsTrackerSprite);
    tipsTrackerSprite.visible = false;
}

function updateTipsTracker(newText){
    tipsMap = document.createElement('canvas');
    tipsMap.width = window.innerWidth/2;
    tipsMap.height = window.innerHeight/2;
    tipsContext = tipsMap.getContext('2d');
    tipsContext.font = 'Bold 40px Arial';

    for(var i = 0; i < newText.length; i++){
	    tipsContext.fillStyle = 'teal';
	    tipsContext.fillText(newText[i], 0, 40*(i+1));
	    tipsContext.strokeStyle = 'teal';
	    tipsContext.strokeText(newText[i], 0, 40*(i+1));
    }

    // canvas contents will be used for a texture
    textureArray['tips'] = new THREE.Texture(tipsMap) 
    textureArray['tips'].needsUpdate = true;
    tipsTrackerMaterial.map = textureArray['tips'];
}
var tipsTime = 0;
var showingTips = false;
function showTips(){
	tipsTrackerSprite.visible = true;
	tipsTrackerSprite.material.opacity = 1;
	showingTips = true;
	
}

function hideTips(){
	tipsTrackerSprite.visible = false;
	showingTips = false;
	tipsTime = 0;
}