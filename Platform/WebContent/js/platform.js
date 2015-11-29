/**
 * 
 */

if (!Detector.webgl)
	Detector.addGetWebGLMessage();

var scene, keyboard, camera, directionalLight, ambientLight, renderer;
var charMesh;
var stats;
var container;
var airborne1 = false;
var airborne2 = false;
var controllingChar = true;
var controllingCrane = false;
var keyMap = [];
var level1Texture;
var floor;
var charCaster;
var objects = [];
var moveableObjects = [];
var airTime;
var trapTime;
var crateMaterial;
var charCam = true;  //Set to false for easier bugtesting.
var carrying = false;
var triggered = false;
var triggered2 = false;
var health = 100;
var stamina = 200;
var gameOverAudio;
var charLoaded = false;
var levelLoaded = false;
var applyForce = false;
var damaged = false;
var fallClock;
var pickup = false;
var healthTexture;
var healthBoxTexture;
var bloodTexture;
var gameOverTexture;
var restartTexture;
var gameOverScreen = false;
var level = 1;
var ambience;
var textureLoader;
var menu = false;
var charMeshPosition = new THREE.Vector3(5, 1, 0); //for debugging purposes
var cratePosition = new THREE.Vector3(9, 1, -12);
var cone;
var carriedCones = 0;
var pickUpItems = [];
var coneGeometry;
var waitForKeyUp = true;
var menuSizeX;
var menuSizeY;
var buttonSizeX;
var buttonSizeY;
var controls = false;

function main() {
	init();
}

//Game Loop
function tick() {
    if (level == 1) {

            stats.update();
            // updateCamera(); //removed since camera is now attached to character.
            renderer.clear();
            renderer.render(scene, camera);
            renderer.clearDepth();
            renderer.render(orthoScene, orthoCamera);


    } else if (level == 2) {
            scene.simulate();
            stats.update();
            // updateCamera(); //removed since camera is now attached to character.
            renderer.clear();
            renderer.render(scene, camera);
            renderer.clearDepth();
            renderer.render(orthoScene, orthoCamera);
    } else {

    }

    requestAnimationFrame(tick);
}


//Initate 
function init() {
    Physijs.scripts.worker = 'lib/physijs_worker.js';
    Physijs.scripts.ammo = 'http://gamingJS.com/ammo.js';

    scene = new Physijs.Scene({fixedTimeStep: 1/60});
    scene.fog = new THREE.Fog(0x202020, 10, 100);
    scene.setGravity(new THREE.Vector3(0, -10, 0)); // set gravity
    scene.addEventListener('update', function() {
            checkKeys();
            checkMovement();
            checkChangesToHUD();
            resetValues();
            scene.simulate();


    });

    orthoCamera = new THREE.OrthographicCamera(window.innerWidth / -2,
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 1000);

    orthoScene = new THREE.Scene();

    keyboard = new THREEx.KeyboardState();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 30000);

    if (!charCam) {
            camera.position.y += 15;
            controls = new THREE.OrbitControls(camera);
    }

    // Lights
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);

    // Renderer
    renderer = new THREE.WebGLRenderer({
            antialias : true,
            alpha : true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.Enabled = true;
    renderer.autoClear = false;

    textureLoader = new THREE.TextureLoader();

    // level1Texture = textureLoader.load('images/level_1_texture2.jpg');
    trapTexture = textureLoader.load('images/crushers.jpg');

    // OBJ MTL Loader
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var objLoader = new THREE.OBJMTLLoader();

    // Load Level 1
    objLoader.load('models/level_01/level_01.obj', 'models/level_01/level_01.mtl', level1LoadedCallback);

    // JSON Loader
    var loader = new THREE.JSONLoader();
    // loader.load('models/char.js', characterLoadedCallback);
    // loader.load('models/level_01.js', level1loadedCallback);
    loader.load('models/trap.js', trapLoadedCallback);
    loader.load('models/cone.js', coneLoadedCallback);
    loader.load('models/cones.js', conesLoadedCallback);

    var crateTexture = textureLoader.load('images/crate.jpg');
    crateMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
            map : crateTexture
    }), 0.4, 0.8);
    var exitTexture = textureLoader.load('images/exit.jpg');
    exitMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
            map : exitTexture
    }), 0.4, 0.8);
    var crushingTexture = textureLoader.load('images/crushing.jpg');
    crushingMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
            map : crushingTexture
    }), 0.4, 0.8);
    roofTexture = textureLoader.load('images/concrete.jpg');
    roofTexture.wrapT = roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.repeat.set(20, 20);
    
    // Create level 1
    generateLevel1();

    window.addEventListener('resize', onWindowResize, false);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // fps statistics

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);


    //Key event handler
    onkeydown = onkeyup = function(e) {
            e = e || event; // to deal with IE
            keyMap[e.keyCode] = e.type == 'keydown';
            if (e.keyCode == 32) {
                    e.preventDefault();
                    if(e.type == 'keydown' && !airborne2){
                            if(!airborne1){
                                    airborne1 = true;
                                    jump = true;
                            }
                            else if (!waitForKeyUp){
                                    airborne2 = true;
                                    jump = true;
                            }

                    }
                    else if(e.type == 'keyup' && waitForKeyUp){
                            waitForKeyUp = false;
                    }
            }
            if(e.keyCode == 27){
                    if(e.type == 'keyup'){
                            if(menu){
                                    removeMenu();
                            }
                            else{
                                    showMenu();
                            }
                    }
            }
            if (e.keyCode == 70) {
                    if (e.type == 'keyup') {
                            pickup = true;
                    }
            }
            
            // M to toggle music
            if (e.keyCode == 77) {
                    if (e.type == 'keyup') {
                            if (ambience.volume != 0) {
                                    gameOverAudio.volume = 0;
                                    ambience.volume = 0;
                            } else {
                                    gameOverAudio.volume = 0.5;
                                    ambience.volume = 0.2;
                            }
                    }
            }
            if((e.keyCode == 87 || e.keyCode == 83 || e.keyCode == 69 || e.keyCode == 81) && e.type == 'keyup'){
                    if(!keyMap[87] && !keyMap[83] && !keyMap[69] && !keyMap[81]){
                            var oldY = charMesh.getLinearVelocity().y;
                            charMesh.setLinearVelocity(new THREE.Vector3(0,oldY,0));
                    }
            }

            if(e.keyCode == 71 && e.type == 'keyup'){
                    dropCone();
            }
            
            // TEMP DEBUG KEY: 2 
            // Change to level 2
            if(e.keyCode == 50 && e.type == 'keyup'){
                level = 0;
                scene = new Physijs.Scene();
                scene.fog = new THREE.Fog(0x202020, 10, 100);
                scene.setGravity(new THREE.Vector3(0, -10, 0)); // set gravity
                scene.addEventListener('update', function() {

                        scene.simulate();
                        checkKeys();
                        checkMovement();
                        checkChangesToHUD();
                        resetValues();

                });
                generateLevel2();
                resetChar();
                level = 2;
            }

    };

    //Mouseclick event handler
    renderer.domElement.addEventListener('click', function(e){
            e = e || event;
            var xPos = e.clientX;
            var yPos = e.clientY;
            if(menu && xPos < window.innerWidth / 2 + buttonSizeX / 2 && xPos > window.innerWidth / 2 -buttonSizeX / 2 && yPos > window.innerHeight / 2 - buttonSizeY*3.5 && yPos < window.innerHeight / 2 - buttonSizeY*2.5){
    			removeMenu();
    			
    		}
    		if(menu && xPos < window.innerWidth / 2 + buttonSizeX / 2 && xPos > window.innerWidth / 2 -buttonSizeX / 2 && yPos > window.innerHeight / 2 - buttonSizeY*1.5 && yPos < window.innerHeight / 2 - buttonSizeY*0.5){
    			
    			
    		}
    		if(menu && xPos < window.innerWidth / 2 + buttonSizeX / 2 && xPos > window.innerWidth / 2 -buttonSizeX / 2 && yPos > window.innerHeight / 2 + buttonSizeY*0.5 && yPos < window.innerHeight / 2 + buttonSizeY*1.5){
    			showControls();
    		}
    		if(menu && controls && xPos < window.innerWidth / 2 + buttonSizeX / 2 && xPos > window.innerWidth / 2 -buttonSizeX / 2 && yPos > window.innerHeight / 2 +menuSizeY/2 - buttonSizeY*1.5 && yPos < window.innerHeight / 2 + menuSizeY/2 - buttonSizeY*0.5){
    			backToMenu();
    		}
    });

    gameOverAudio = new Audio('audio/gameOver.mp3');
    ambience = new Audio('audio/277189__georgke__ambience-composition.mp3');
    
    /* TODO: DEBUG: TURNED OFF MUSIC WHILE WORKING ON THE GAME */
    ambience.volume = 0;
    ambience.addEventListener('ended', function() {
        this.currentTime = 0; 
        this.play();
    }, false);
    ambience.play();

    createOverlay();
    createChar();
    createWelcome();
    fallClock = new THREE.Clock();
}


// Called when level 1 model is loaded.
function level1LoadedCallback(object)
{
    // Add shadows
    object.traverse(function (node) {
        if (node instanceof THREE.Mesh) 
        {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    // Set position and scale
    object.scale.set(1, 1.8, 1);
    object.position.y += 1.4;

    // Add to scene
    scene.add(object);
}


/*
//Called when level1 model is loaded.
function level1loadedCallback(geometry, materials) {
	levelMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
		map : level1Texture
	}));
	levelMesh.scale.set(1, 1.8, 1)
	levelMesh.position.y += 1.4;
	scene.add(levelMesh);
	// tick();
}
*/

//Called when trap model is loaded.
function trapLoadedCallback(geometry) {
	trapBase = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
		map : trapTexture
	}));
	trapMesh = trapBase.clone();
	trapMesh.scale.set(0.1, 0.1, 0.1);
	trapMesh.position.y -= 0.5;
	trap.add(trapMesh);
	trap2Mesh = trapBase.clone();
	trap2Mesh.rotation.x += Math.PI / 2;
	trap2Mesh.scale.set(0.1, 0.1, 0.08);
	trap2.add(trap2Mesh);
}

function coneLoadedCallback(geometry){
	coneGeometry = geometry;
}

function conesLoadedCallback(geometry){
	cones = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xff8800}), 1, .1), 10);
	cones.position.z -= 5;
	cones.position.y += 1;
	cones.scale.set(0.2, 0.2, 0.2);
	scene.add(cones);
	pickUpItems.push(cones);
}

//Creates the character mesh
function createChar() {
	charMesh = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5, 3, 1), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xeeff33
			}), 0.5, .1), 10);
	charMesh.position.x = charMeshPosition.x;
	charMesh.position.y = charMeshPosition.y;
	charMesh.position.z = charMeshPosition.z;

	scene.add(charMesh);
	if (charCam) {
		camera.position.z += 0;
		camera.lookAt(new THREE.Vector3(0, 0, charMesh.position.z + 5));
		charMesh.add(camera);
		charMesh.material.visible = false;
	}
	charMesh.setAngularFactor(new THREE.Vector3(0, 0.1, 0));
	charMesh.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == trap || other_object == trap2) {
			health -= 100;
			damaged = true;
		}
		if (other_object == exit) {
			levelComplete();
		}
	});
//	charMesh.setDamping(0.1, 0.9);

	charCaster = new THREE.Raycaster();
	moveableObjects.push(charMesh);
	charLoaded = true;
	scene.simulate();
	checkTick();

}


//Checks if everything is loaded, and starts the tick loop if it is.
function checkTick() {
	if (charLoaded && levelLoaded) {
		tick();
	}
}
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);

}

//debug help
function log(param) {
	setTimeout(function() {
		throw new Error("Debug: " + param);
	}, 0);
}

//Called when the level is complete. Starts next level
function levelComplete() {
	level = 0;
	scene = new Physijs.Scene();
	scene.fog = new THREE.Fog(0x202020, 10, 100);
	scene.setGravity(new THREE.Vector3(0, -10, 0)); // set gravity
	scene.addEventListener('update', function() {
		
		scene.simulate();
		checkKeys();
		checkMovement();
		checkChangesToHUD();
		resetValues();
		
	});
	generateLevel3(); //For testing.
	resetChar();
	level = 2;
}


//restarts the level (after death for example).
function restartLevel() { // Currently not finished.
	level = 0;
	scene.remove(charMesh);
	resetChar();
	resetCrate();
	resetTraps();
	health = 100;
	damaged = true;
	if (gameOverScreen) {
		gameOverScreen = false;
		orthoScene.remove(bloodSprite);
		orthoScene.remove(gameOverSprite);
		orthoScene.remove(restartSprite);
	}
	level = 1;

}

// Resets the character mesh.
function resetChar() {
    charMesh.remove(camera);
    var temp = cloneBox(charMesh);
    temp.visible = true;
    charMesh = temp;
    charMesh.position.x = charMeshPosition.x;
    charMesh.position.y = charMeshPosition.y;
    charMesh.position.z = charMeshPosition.z;
    scene.add(charMesh);
    camera.lookAt(new THREE.Vector3(0, 0, charMesh.position.z + 5));
    charMesh.add(camera);
    charMesh.material.visible = false;
    charMesh.setAngularFactor(new THREE.Vector3(0, 0.1, 0));
    charMesh.addEventListener('collision', function(other_object,
                    relative_velocity, relative_rotation, contact_normal) {
            if (other_object == trap || other_object == trap2) {
                    health -= 100;
                    damaged = true;
            }
            if (other_object == exit) {
                    levelComplete();
            }
    });
    charMesh.setDamping(0.1, 0.9);
    moveableObjects.push(charMesh);
    carrying = false;
}

//Resets the crate.
function resetCrate() {
    scene.remove(crate);
    crate.position.set(9, 0, -12);
    scene.add(crate);
}

//resets the traps
function resetTraps() {
    scene.remove(trap2);
    trap2.position.set(-20, 1.5, 24.5);
    scene.add(trap2);
    trap2.setAngularFactor(new THREE.Vector3(0, 0, 0));
    triggered2 = false;
}

//Creates the menu
function createWelcome(){
	menuTexture = textureLoader.load('images/testMenu.jpg');
	playTexture = textureLoader.load('images/testPlay.jpg');
	optionsTexture = textureLoader.load('images/testOptions.jpg');
	controlsTexture = textureLoader.load('images/controlsButton.jpg');
	controlsScreenTexture = textureLoader.load('images/controlsScreen.jpg');
	backTexture = textureLoader.load('images/backButton.jpg');
	

	
	overlayContainer = document.createElement('div');
	document.body.appendChild(overlayContainer);
	
	menuSizeX = window.innerWidth / 1.5;
	menuSizeY = window.innerHeight / 1.1;
	buttonSizeX = window.innerWidth / 7;
	buttonSizeY = window.innerHeight / 15;

	
	var spriteMaterial = new THREE.SpriteMaterial({
		map : menuTexture
	});
	menuSprite = new THREE.Sprite(spriteMaterial);
	menuSprite.position.set(0,0 , -100);
	menuSprite.scale.set(menuSizeX, menuSizeY, 1);
	orthoScene.add(menuSprite);
	
	var spriteMaterial = new THREE.SpriteMaterial({
		map : controlsScreenTexture
	});
	controlsScreenSprite = new THREE.Sprite(spriteMaterial);
	controlsScreenSprite.position.set(0,0 , -100);
	controlsScreenSprite.scale.set(menuSizeX, menuSizeY, 1);
	controlsScreenSprite.visible = false;
	orthoScene.add(controlsScreenSprite);
	
	var spriteMaterial = new THREE.SpriteMaterial({
		map : playTexture
	});
	playSprite = new THREE.Sprite(spriteMaterial);
	playSprite.position.set(0,buttonSizeY*3 , -80);
	playSprite.scale.set(buttonSizeX, buttonSizeY, 1);
	orthoScene.add(playSprite);
	var spriteMaterial = new THREE.SpriteMaterial({
		map : optionsTexture
	});
	optionsSprite = new THREE.Sprite(spriteMaterial);
	optionsSprite.position.set(0,buttonSizeY , -80);
	optionsSprite.scale.set(buttonSizeX, buttonSizeY, 1);
	orthoScene.add(optionsSprite);
	var spriteMaterial = new THREE.SpriteMaterial({
		map : controlsTexture
	});
	controlsSprite = new THREE.Sprite(spriteMaterial);
	controlsSprite.position.set(0, -buttonSizeY , -80);
	controlsSprite.scale.set(buttonSizeX, buttonSizeY, 1);
	orthoScene.add(controlsSprite);
	var spriteMaterial = new THREE.SpriteMaterial({
		map : backTexture
	});
	backSprite = new THREE.Sprite(spriteMaterial);
	backSprite.position.set(0, -menuSizeY/2 + buttonSizeY, -80);
	backSprite.scale.set(buttonSizeX, buttonSizeY, 1);
	backSprite.visible = false;
	orthoScene.add(backSprite);
	menu = true;
}
