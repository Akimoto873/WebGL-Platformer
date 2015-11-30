/**
 * 
 */

if (!Detector.webgl)
	Detector.addGetWebGLMessage();

var scene, keyboard, camera, orthoCamera, directionalLight, ambientLight, renderer;
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
var loadingScreen = true;

// Menu Textures
var playTexture, playSelectedTexture, optionsTexture, optionsSelectedTexture, helpTexture, helpSelectedTexture;

// Initial Screen Ratio
var screenRatioX, screenRatioY;

// Raycast List and Mouse Coordinates for mouse listener
var targetList = [];
var projector, mouse = { x: 0, y: 0 };
var menuItems = [];

/* DEBUG VARS */
var charCam = true;  // Set to false for easier bugtesting.

function main() {
    
    init();
}

//Game Loop
function tick() {
    if (level == 1) {
    	if(!menu){
            scene.simulate();
    	}
        stats.update();
        renderer.clear();
        if(!loadingScreen){
            renderer.render(scene, camera);
        }
        renderer.clearDepth();
        renderer.render(orthoScene, orthoCamera);
        if(loadingScreen){
    		loadingBarTexture.offset.x += 0.1;
    	}
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

    // Projector for checking raycast on menu
    projector = new THREE.Projector();

    scene = new Physijs.Scene({fixedTimeStep: 1/60});
    scene.fog = new THREE.Fog(0x202020, 10, 100);
    scene.setGravity(new THREE.Vector3(0, -20, 0)); // set gravity
    scene.addEventListener('update', function() {
    	if(!menu){
            checkKeys();
            checkMovement();
    	}
            checkChangesToHUD();
            resetValues();
        if(!menu){
            scene.simulate();
        }


    });

    orthoCamera = new THREE.OrthographicCamera(window.innerWidth / -2,
            window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 1000);

    orthoScene = new THREE.Scene();

    keyboard = new THREEx.KeyboardState();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 300000);

    if (!charCam) {
            camera.position.y += 15;
            controls = new THREE.OrbitControls(camera);
    }

    // Renderer
    renderer = new THREE.WebGLRenderer({
            antialias : true
    });
    
    // Set initial window size based on width or height (keep aspect ratio of 16:9)
    if(window.innerWidth < window.innerHeight * 16/9){
        renderer.setSize(window.innerWidth, window.innerWidth * 9/16);
    }else{
        renderer.setSize(window.innerHeight * 16/9, innerHeight);
    }
    
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.type = THREE.PCFShadowMap;       // Softer shadow
    renderer.autoClear = false;
    renderer.setClearColor( scene.fog.color );

    textureLoader = new THREE.TextureLoader();
    trapTexture = textureLoader.load('images/crushers.jpg');

    // JSON Loader
    var loader = new THREE.JSONLoader();
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
    
    // Add window resize listener
    window.addEventListener('resize', onWindowResize, false);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // FPS statistics
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
            if(e.keyCode == 82 && e.type == 'keyup'){
            	restartLevel();
            	/*TODO: UPDATE THE CONTROLS MENU SCREEN */
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

    // Mouse click listener
    // document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    // Mouseclick event handler
    renderer.domElement.addEventListener('click', function(e){
            e = e || event;
            
            // Play Button
            if(hasClickedButton(e, menuItems["play"]))
            {
                removeMenu();
            }
            
            // Options Button
            if(hasClickedButton(e, menuItems["options"]))
            {
                // Do something
            }
            
            // Options Button
            if(hasClickedButton(e, menuItems["help"]))
            {
                showControls();
            }
    });
    
    // Check mouse movement
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
   
    // Sounds & Audio
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


// Update mouse coordinates
function onDocumentMouseMove(e) 
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();
	
	// update the mouse variable
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        
        
        // Check if hovering menu items
        // Play Button
        if(hasClickedButton(e, toScreenXY(menuItems["play"])))
        {
            menuItems["play"].material.map = playSelectedTexture; 
        }
        else
        {
            menuItems["play"].material.map = playTexture; 
        }
        
        if(hasClickedButton(e, toScreenXY(menuItems["options"])))
        {
            menuItems["options"].material.map = optionsSelectedTexture; 
        }
        else
        {
            menuItems["options"].material.map = optionsTexture; 
        }
        
        if(hasClickedButton(e, toScreenXY(menuItems["help"])))
        {
            menuItems["help"].material.map = helpSelectedTexture; 
        }
        else
        {
            menuItems["help"].material.map = helpTexture; 
        }
        
}


// Returns true if button has been pressed, given button coordinates
function hasClickedButton(e, vec2)
{
    // Get mouse click coordinate
    var xPos = e.clientX;
    var yPos = e.clientY;
            
    // Calculate if the mouse click was within the button area of given vector2
    if(menu && xPos > vec2.x - buttonSizeX / 2 && xPos < vec2.x + buttonSizeX / 2){
        if(yPos > vec2.y && yPos < vec2.y + buttonSizeY * 2){
            return true;
        }
    }
    return false;
}

// Given a object3D, returns "on screen" Vector2 coordinates
function toScreenXY(object)
{
    var v = object.position.clone();
    v = v.project(orthoCamera);
    var percX = (v.x + 1) / 2;
    var percY = (-v.y + 1) / 2;
    var left = percX * window.innerWidth;
    var top = percY * window.innerHeight;
    return new THREE.Vector2(left, top);
}

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
	cones.position.z = -5;
	cones.position.y += 1;
	cones.scale.set(0.2, 0.2, 0.2);
	scene.add(cones);
	pickUpItems.push(cones);
}

//Creates the character mesh
function createChar() {
	charMesh = new Physijs.CapsuleMesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 16), Physijs
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
		
	}
}
function onWindowResize() {

	//camera.aspect = window.innerWidth / window.innerHeight;
        // camera.aspect = 16 / 9;
        
        // Update menu size
        buttonSizeX = window.innerWidth * (200/window.innerWidth);
	buttonSizeY = (window.innerWidth * (9/16)) * (50/(window.innerWidth * (9/16)));
        
        // Update canvas
	camera.updateProjectionMatrix();
        
        // Keep aspect ratio regardless of windows width or height
        if(window.innerWidth < window.innerHeight * 16/9){
            renderer.setSize(window.innerWidth, window.innerWidth * 9/16);
        }else{
            renderer.setSize(window.innerHeight * 16/9, innerHeight);
        }
        
        // Update menu button coordinates
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
    generateLevel2();
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
    carriedCones = 0;
    resetCones();
    level = 1;
}

// Resets the character mesh.
function resetChar() {
    charMesh.remove(camera);
    var clone = new Physijs.CapsuleMesh(charMesh.clone().geometry, charMesh.material,
			charMesh.mass);
	clone.visible = true;
    charMesh = clone;
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

//Resets the cones
function resetCones(){
	for(var i = pickUpItems.length - 1; i > 0; i--){
		scene.remove(pickUpItems[i]);
		pickUpItems.splice(i,1);
	}
	var clone = new Physijs.BoxMesh(cones.clone().geometry, cones.material,
			cones.mass);
	clone.position.x = 0;
	clone.position.z = -5;
	clone.position.y = 10;
	clone.rotation.z = 0;
	clone.rotation.y = 0;
	clone.rotation.x = 0;
	clone.scale.set(0.2, 0.2, 0.2);
	cones = clone;
	scene.add(cones);
	pickUpItems.push(cones);
	
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
    menuTexture = textureLoader.load('images/menu/main_menu.png');
    playTexture = textureLoader.load('images/menu/menu_play.png');
    playSelectedTexture = textureLoader.load('images/menu/menu_play_selected.png');
    optionsTexture = textureLoader.load('images/menu/menu_options.png');
    optionsSelectedTexture = textureLoader.load('images/menu/menu_options_selected.png');
    helpTexture = textureLoader.load('images/menu/menu_help.png');
    helpSelectedTexture = textureLoader.load('images/menu/menu_help_selected.png');
    controlsScreenTexture = textureLoader.load('images/menu/menu_controls.png');
    backTexture = textureLoader.load('images/backButton.jpg');
    loadingBackgroundTexture = textureLoader.load('images/loadingBackground.jpg');
    loadingBarTexture = textureLoader.load('images/loadingBar.jpg');
    loadingBarTexture.wrapS = THREE.RepeatWrapping;
    loadingBarTexture.wrapT = THREE.RepeatWrapping;


    // Create and add container for our overlay (menu)
    overlayContainer = document.createElement('div');
    document.body.appendChild(overlayContainer);

    // Automatically adjust menu and buttons according to screen size
    menuSizeX = window.innerWidth;
    menuSizeY = window.innerHeight;
    buttonSizeY = 50 * window.innerHeight / 1080;
    buttonSizeX = 200 * window.innerWidth / 1920;


    var spriteMaterial = new THREE.SpriteMaterial({
            map : loadingBackgroundTexture
    });
    loadingBackgroundSprite = new THREE.Sprite(spriteMaterial);
    loadingBackgroundSprite.position.set(0,0 , -100);
    loadingBackgroundSprite.scale.set(menuSizeX, menuSizeY, 1);
    orthoScene.add(loadingBackgroundSprite);

    var spriteMaterial = new THREE.SpriteMaterial({
            map : loadingBarTexture
    });
    loadingBarSprite = new THREE.Sprite(spriteMaterial);
    loadingBarSprite.position.set(0, 0 , -80);
    loadingBarSprite.scale.set(buttonSizeX*2, buttonSizeY, 1);
    orthoScene.add(loadingBarSprite);


    // Main Menu Screen (background)
    var spriteMaterial = new THREE.SpriteMaterial({
            map : menuTexture
    });
    menuSprite = new THREE.Sprite(spriteMaterial);
    menuSprite.position.set(0,0 , -100);
    menuSprite.scale.set(menuSizeX, menuSizeY, 1);
    orthoScene.add(menuSprite);
    menuSprite.visible = false;

    // Help / Controls Screen
    var spriteMaterial = new THREE.SpriteMaterial({
            map : controlsScreenTexture
    });
    controlsScreenSprite = new THREE.Sprite(spriteMaterial);
    controlsScreenSprite.position.set(0,0 , -100);
    controlsScreenSprite.scale.set(menuSizeX, menuSizeY, 1);
    controlsScreenSprite.visible = false;
    orthoScene.add(controlsScreenSprite);


    // Play Button
    var spriteMaterialPlay = new THREE.SpriteMaterial({
            map : playTexture
    });
    playSprite = new THREE.Sprite(spriteMaterialPlay);
    playSprite.position.set(8, -buttonSizeY + 60 , -80);
    playSprite.scale.set(buttonSizeX, buttonSizeY, 1);
    orthoScene.add(playSprite);
    playSprite.visible = false;
    menuItems["play"] = playSprite;

    // Options Button
    var spriteMaterialOptions = new THREE.SpriteMaterial({
            map : optionsTexture
    });
    optionsSprite = new THREE.Sprite(spriteMaterialOptions);
    optionsSprite.position.set(8, -buttonSizeY*2 + 30 , -80);
    optionsSprite.scale.set(buttonSizeX, buttonSizeY, 1);
    orthoScene.add(optionsSprite);
    optionsSprite.visible = false;
    menuItems["options"] = optionsSprite;

    // Help / Controls Button
    var spriteMaterialControls = new THREE.SpriteMaterial({
            map : helpTexture
    });
    controlsSprite = new THREE.Sprite(spriteMaterialControls);
    controlsSprite.position.set(8, -buttonSizeY*3, -80);
    controlsSprite.scale.set(buttonSizeX, buttonSizeY, 1);
    orthoScene.add(controlsSprite);
    controlsSprite.visible = false;
    menuItems["help"] = controlsSprite;


    var spriteMaterial = new THREE.SpriteMaterial({
            map : backTexture
    });
    backSprite = new THREE.Sprite(spriteMaterial);
    backSprite.position.set(0, -menuSizeY/2 + buttonSizeY, -80);
    backSprite.scale.set(buttonSizeX, buttonSizeY, 1);
    backSprite.visible = false;
    orthoScene.add(backSprite);
    menu = true;
    tick();      
}
