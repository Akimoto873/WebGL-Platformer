/**
 * 
 */

if (!Detector.webgl)
	Detector.addGetWebGLMessage();

var scene, keyboard, camera, orthoCamera, ambientLight, renderer;
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
var puzzleCaster;
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
var ambience2;
var playingSound = false;
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
var loadingScreen = false;
var playSelectedTexture;
var playTexture;
var oldMouseX = 0;
var oldMouseY = 0;
var mouseDown = false;
var crates = [];
var lasers = [];
var keysPickedUp = 0;
var puzzleComplete = false;

// Clock for delta
var clock = new THREE.Clock();

// Animation sprite for flare
var flareAnimation;

// Flare object
var flareSprite;

// Level Object (for lighting)
var levelObject; 

// Initial Screen Ratio
var screenRatioX, screenRatioY;

// Raycast List and Mouse Coordinates for mouse listener
var targetList = [];
var projector, mouse = { x: 0, y: 0 };
var menuItems = [];

/* DEBUG VARS */
var charCam = true;  // Set to false for easier bugtesting.
var enableDebugging = false;
var box; //For easier collision box placement.

function main() {
    
    init();
}

//Game Loop
function tick() {
    if (level != 0) {
        scene.simulate();
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
    scene.addEventListener('update', sceneUpdate);

    orthoCamera = new THREE.OrthographicCamera(window.innerWidth / -2,
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 1000);

    orthoScene = new THREE.Scene();

    keyboard = new THREEx.KeyboardState();

   

    // Renderer
    renderer = new THREE.WebGLRenderer({
            antialias : true
    });
    
    if(window.innerWidth < window.innerHeight * 16/9){
        renderer.setSize(window.innerWidth, window.innerWidth * 9/16);
        renderSizeX = window.innerWidth;
        renderSizeY = window.innerWidth * 9/16;
    }else{
        renderer.setSize(window.innerHeight * 16/9, innerHeight);
        renderSizeX = window.innerHeight * 16/9;
        renderSizeY = window.innerHeight;
    }
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.type = THREE.PCFShadowMap;       // Softer shadow
    renderer.autoClear = false;
    renderer.setClearColor( scene.fog.color );
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, renderSizeX / renderSizeY, 0.01, 300000);

    if (!charCam) {
            camera.position.y += 15;
            controls = new THREE.OrbitControls(camera);
    }
    
    textureLoader = new THREE.TextureLoader();
    
    var crateTexture = textureLoader.load('images/crate.jpg');
    crateMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
            map : crateTexture
    }), 0.4, 0.8);
    
    // Create level 1
     
    
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
                                    ambience2.volume = 0;
                                    damageSound.volume = 0;
                                    jumpSound.volume = 0;
                                    walkSound.volume = 0;
                            } else {
                                    gameOverAudio.volume = 0.5;
                                    ambience.volume = 0.2;
                                    ambience2.volume = 0.2;
                                    damageSound.volume = 0.5;
                                    jumpSound.volume = 0.4;
                                    walkSound.volume = 0.2;
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
            }
            
            // TEMP DEBUG KEY: 2 
            // Change to level 2
            if(e.keyCode == 50 && e.type == 'keyup'){
                levelComplete();
            }
            /*TODO: FOR CREATING COLLISION BOXES*/
            if(enableDebugging){
	            if(e.keyCode == 37 && e.type == 'keydown'){
	            	box.position.x -= 0.2;
	            }
	            if(e.keyCode == 38 && e.type == 'keydown'){
	            	box.position.z += 0.2;
	            }
	            if(e.keyCode == 39 && e.type == 'keydown'){
	            	box.position.x += 0.2;
	            }
	            if(e.keyCode == 40 && e.type == 'keydown'){
	            	box.position.z -= 0.2;
	            }
	            if(e.keyCode == 73 && e.type == 'keydown'){
	            	box.scale.x -= 0.2
	            }
	            if(e.keyCode == 79 && e.type == 'keydown'){
	            	box.scale.x += 0.2;
	            }
	            if(e.keyCode == 75 && e.type == 'keydown'){
	            	box.scale.z -= 0.2;
	            }
	            if(e.keyCode == 76 && e.type == 'keydown'){
	            	box.scale.z += 0.2;
	            }
	            if(e.keyCode == 78 && e.type == 'keyup'){
	            	log((box.position.x).toFixed(2) + "," + (box.position.z).toFixed(2) + "," + (box.scale.x).toFixed(2) + "," + "1," + (box.scale.z).toFixed(2));
	            }
            }

    };
    
    loadAudio();
    generateLevel1(); 
    createOverlay();
    createChar();
    createMenu();
    fallClock = new THREE.Clock();
    
//    For collision box placement
    if(enableDebugging){
	    var box = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2),
	            new THREE.MeshBasicMaterial({
	                    color : 0x22ee44
	            }));
	    scene.add(box);
    }
}

// Listener: On mouse click
function onDocumentMouseClick(e) 
{
	if(menu){
	    e = e || event;
	         
	    if(!controls){
		    // Play Button
		    if(hasClickedButton(e, toScreenXY(menuItems["play"].position)))
		    {
		        removeMenu();
		    }
		
		    // Options Button
		    if(hasClickedButton(e, toScreenXY(menuItems["options"].position)))
		    {
		        // Do something
		    }
		
		    // Options Button
		    if(hasClickedButton(e, toScreenXY(menuItems["help"].position)))
		    {
		        showControls();
		    }
	    }
	    if(controls){
	    	if(hasClickedButton(e, toScreenXY(menuItems["back"].position)))
	    	{
		    	backToMenu();
	    	}
	    }
	}
	if(level == 2 && !menu){
		var distance = new THREE.Vector3();
		distance.subVectors(charMesh.position, puzzle.position);
		if(distance.length() < 10){
			var point = 0;
			for(var j = 0; j<4; j++){
				for(var k = 0; k<4; k++){
					var vector = new THREE.Vector3();
					var canvas = renderer.domElement;

					vector.x = puzzlePoints[point].position.x;
					vector.y = puzzlePoints[point].position.y;
					vector.z = puzzlePoints[point].position.z;

					// map to normalized device coordinate (NDC) space
					vector.project( camera );

					// map to 2D screen space
					vector.x = Math.round( (   vector.x + 1 ) * window.innerWidth  / 2 ),
					vector.y = Math.round( ( - vector.y + 1 ) * window.innerHeight / 2 );
					vector.z = 0;
					
					if(Math.abs(e.clientX - vector.x) < 50 && Math.abs(e.clientY  - vector.y) < 50){
						
						if(puzzlePoints[point].material.map == puzzleLightOffTexture){
							puzzlePoints[point].material.map = puzzleLightOnTexture;
						}
						else{
							puzzlePoints[point].material.map = puzzleLightOffTexture;
						}
						if(k > 0){
							if(puzzlePoints[point - 1].material.map == puzzleLightOffTexture){
								puzzlePoints[point -1].material.map = puzzleLightOnTexture;
							}
							else{
								puzzlePoints[point-1].material.map = puzzleLightOffTexture;
							}
						}
						if(k < 3){
							if(puzzlePoints[point + 1].material.map == puzzleLightOffTexture){
								puzzlePoints[point +1].material.map = puzzleLightOnTexture;
							}
							else{
								puzzlePoints[point+1].material.map = puzzleLightOffTexture;
							}
						}
						if(j>0){
							if(puzzlePoints[point - 4].material.map == puzzleLightOffTexture){
								puzzlePoints[point -4].material.map = puzzleLightOnTexture;
							}
							else{
								puzzlePoints[point-4].material.map = puzzleLightOffTexture;
							}
						}
						if(j<3){
							if(puzzlePoints[point + 4].material.map == puzzleLightOffTexture){
								puzzlePoints[point +4].material.map = puzzleLightOnTexture;
							}
							else{
								puzzlePoints[point+4].material.map = puzzleLightOffTexture;
							}
						}
					}
					point += 1;
				}
			}
			var complete = true;
			for(var i = 0; i < puzzlePoints.length; i++){
				if(puzzlePoints[i].material.map.name == "puzzleLightOffTexture"){
					complete = false;
				}
			}
			if(complete){
				puzzleSound.play();
				puzzle.material.transparent = true;
				for(var i = 0; i< puzzlePoints.length; i++){
					puzzlePoints[i].material.transparent = true;
				}
				puzzleComplete = true;
			}
			
		}
		
		
	}
}


// Listener: On mouse move
function onDocumentMouseMove(e) 
{
    e.preventDefault();
    //console.log("Mouse Coord: (" + e.clientX + ", " + e.clientY + ")");
    //
    // Check if hovering menu items
    if(menu){
        if(!controls){
            // Hovering Play
            if(hasClickedButton(e, toScreenXY(menuItems["play"].position)))
            {
                menuItems["play"].material.map = playSelectedTexture; 
            }
            else
            {
                menuItems["play"].material.map = playTexture; 
            }

            // Hovering Options
            if(hasClickedButton(e, toScreenXY(menuItems["options"].position)))
            {
                menuItems["options"].material.map = optionsSelectedTexture; 
            }
            else
            {
                menuItems["options"].material.map = optionsTexture; 
            }

            // Hovering Help
            if(hasClickedButton(e, toScreenXY(menuItems["help"].position)))
            {
                menuItems["help"].material.map = controlsSelectedTexture; 
            }
            else
            {
                menuItems["help"].material.map = controlsTexture; 
            }
        }
        else
        {
            // Hovering "Back" arrow
            if(hasClickedButton(e, toScreenXY(menuItems["back"].position)))
            {
                menuItems["back"].material.map = backSelectedTexture;
            }
            else
            {
                menuItems["back"].material.map = backTexture;
            }
        }
    }
    if(!menu && charCam){ //If not in the menu
        if(oldMouseY == 0){ //Dunno if this is needed really.
        	oldMouseY = e.clientY; 
        	oldMouseX = e.clientX;
        }
        if(mouseDown){ //if the mouse button is down, move the camera based on the mouse movement this frame.
	    	var diffY = e.clientY - oldMouseY;

	    	var diffX = e.clientX - oldMouseX;
	    	
	        camera.rotation.x -= (diffY/200);
	        camera.rotation.y -= diffX/200;
				
	    	
	    	
        }
    	
    
    	oldMouseY = e.clientY; //Save the mouse position on each frame
    	oldMouseX = e.clientX;
      
       
    }
    
}

//Not used. Saved in case we want to use it.
function onDocumentMouseDown(e){
	if(!menu){
		mouseDown = true;
	}
}
function onDocumentMouseUp(e){
	if(!menu){
		mouseDown = false;
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
        if(yPos > vec2.y - buttonSizeY / 2 && yPos < vec2.y + buttonSizeY / 2){
            return true;
        }
    }
    return false;
}


// Given a Vector 3, returns "on screen" Vector2 screen coordinates.
// It also takes render size in account, when calculating coordinates.
function toScreenXY(pos3D)
{
    var v = pos3D.clone();
    v = v.project(orthoCamera);
    var percX = (v.x + 1) / 2;
    var percY = (-v.y + 1) / 2;
    var left = percX * renderSizeX + (window.innerWidth - renderSizeX)/2;
    var top = percY * renderSizeY;
    return new THREE.Vector2(left, top);
}

function sceneUpdate(){
	if(!menu && !gameOverScreen){
        checkKeys();
        checkMovement();
	}
    checkChangesToHUD();
    resetValues();
    // Update animation
    var delta = clock.getDelta();
    if(flareAnimation != null){
    	flareAnimation.update(delta * 1000);
    }
    
}


//Creates the character mesh
function createChar() {
	charMesh = new Physijs.CapsuleMesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 16), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xeeff33
			}), 0.5, 0.1), 10);
	charMesh.position.x = charMeshPosition.x;
	charMesh.position.y = charMeshPosition.y;
	charMesh.position.z = charMeshPosition.z;

	scene.add(charMesh);
	charMesh.setAngularFactor(new THREE.Vector3(0,0,0)); //The character mesh cannot rotate in any direction.
	//All rotation is only the camera rotating.
	if (charCam) {
		camera.position.z += 0;
		camera.eulerOrder = "YXZ"; //Change the rotation axis order to a more suiting one for first person camera.
		camera.lookAt(new THREE.Vector3(0, 0, charMesh.position.z + 5));
		charMesh.add(camera);
		charMesh.material.visible = false;
	}
	charCaster = new THREE.Raycaster();
	moveableObjects.push(charMesh);
	scene.simulate();
}

function onWindowResize() {
    
        // Always update camera aspect
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        // Update menu size
        buttonSizeX = window.innerWidth * (200/window.innerWidth);
	buttonSizeY = (window.innerWidth * (9/16)) * (50/(window.innerWidth * (9/16)));
        
        // Update canvas
	camera.updateProjectionMatrix();
        
        // This makes sure regardless if width or height is changed, 
        // the aspect stays the same, as well as updating
        if(window.innerWidth < window.innerHeight * 16/9){
            renderer.setSize(window.innerWidth, window.innerWidth * 9/16);
            renderSizeX = window.innerWidth;
            renderSizeY = window.innerWidth * 9/16;
        }else{
            renderer.setSize(window.innerHeight * 16/9, innerHeight);
            renderSizeX = window.innerHeight * 16/9;
            renderSizeY = window.innerHeight;
        }
}

//debug help
function log(param) {
	setTimeout(function() {
		throw new Error("Debug: " + param);
	}, 0);
}

//Called when the level 1 is complete. Starts next level
function levelComplete() {
    level = 0;
    scene = new Physijs.Scene();
    scene.fog = new THREE.Fog(0x202020, 10, 100);
    scene.setGravity(new THREE.Vector3(0, -20, 0)); // set gravity
    scene.addEventListener('update', sceneUpdate);
    crates = [];
    objects = [];
    moveableObjects = [];
    generateLevel2();
    resetChar();
    level = 2;
}


// Restarts the level (after death for example).
function restartLevel() { 
	if(level == 1){ //Restarting level 1 and level 2 demands different actions.
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
	if(level == 2){
		level = 0;
	    scene.remove(charMesh);
	    resetChar();
	    resetCrates();
	    resetTraps2();
	    health = 100;
	    damaged = true;
	    if (gameOverScreen) {
	            gameOverScreen = false;
	            orthoScene.remove(bloodSprite);
	            orthoScene.remove(gameOverSprite);
	            orthoScene.remove(restartSprite);
	    }
	    carriedCones = 0;
	    resetCones(); /*TODO: This is not working properly*/
	    resetKeys();
	    resetPuzzle();
	    resetJumpableDoor();
	    level = 2;
	}
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
    if(charCam){
    	camera.lookAt(new THREE.Vector3(0, 0, charMesh.position.z + 5));
        charMesh.add(camera);
    	charMesh.material.visible = false;
    }
    charMesh.setAngularFactor(new THREE.Vector3(0, 0, 0));
    moveableObjects.push(charMesh);
    carrying = false;
}

//Resets the crate.
function resetCrate() {
    scene.remove(crates[0]);
    crates[0].setLinearVelocity(new THREE.Vector3(0,0,0));
    crates[0].position.set(9, 0, -12);
    crates[0].rotation.x = 0;
    crates[0].rotation.y = 0;
    crates[0].rotation.z = 0;
    scene.add(crates[0]);
}
var cratesRemoved = false;
function resetCrates(){
	for(var i = 0; i < 4; i++){
		scene.remove(crates[i]);
//		crates[i].rotation.set(0,0,0);
		crates[i].position.set(-12, 1 + i, -22 + 2*i);
		
		
	}
	scene.remove(hintCrate);
	hintCrate.position.set(14,1,14.3);
	cratesRemoved= true;
}

//Resets the cones
function resetCones(){
	
	var clone = new Physijs.BoxMesh(cones.clone().geometry, cones.material,
			cones.mass);
	clone.position.x = 0;
	clone.position.z = -5;
	clone.position.y = 1;
	clone.rotation.z = 0;
	clone.rotation.y = 0;
	clone.rotation.x = 0;
	clone.scale.set(0.2, 0.2, 0.2);
	cones = clone;
	scene.add(cones);
}

//resets the traps
function resetTraps() {
	    scene.remove(trap2);
	    trap2.position.set(-20, 1.5, 24.5);
	    scene.add(trap2);
	    trap2.setAngularFactor(new THREE.Vector3(0, 0, 0));
	    triggered2 = false;
	
		
}
//resets the falling spikes trap in level 2.
function resetTraps2(){
	level2Trap1Triggered = false;
	scene.remove(level2Trap1);
	level2Trap1.position.x = -16;
	level2Trap1.position.y = 9;
	level2Trap1.position.z = 0;
	scene.add(level2Trap1);
	level2Trap1.setLinearFactor(new THREE.Vector3(0, 0, 0));
	level2Trap1.setAngularFactor(new THREE.Vector3(0, 0, 0));

}
//resets the collectible keys in level 2.
function resetKeys(){
	keysPickedUp = 0;
	scene.remove(key1);
	scene.add(key1);
	key1.setLinearFactor(new THREE.Vector3(0,0,0));
	key1.setAngularVelocity(new THREE.Vector3(0,1,0));
	scene.remove(key2);
	scene.add(key2);
	key2.setLinearFactor(new THREE.Vector3(0,0,0));
	key2.setAngularVelocity(new THREE.Vector3(0,1,0));
	scene.remove(key3);
	scene.add(key3);
	key3.setLinearFactor(new THREE.Vector3(0,0,0));
	key3.setAngularVelocity(new THREE.Vector3(0,1,0));
}
var reAddPuzzle = false;
//resets the "lights on!" puzzle in level 2.
function resetPuzzle(){
	for(var i = 0; i < puzzlePoints.length; i++){
		if(puzzlePoints[i].material.map == puzzleLightOnTexture){
			puzzlePoints[i].material.map = puzzleLightOffTexture;
			
		}
		puzzlePoints[i].material.opacity = 1;
		puzzlePoints[i].material.transparent = false;
		if(reAddPuzzle){
			scene.add(puzzlePoints[i]);
			
		}
	}
	puzzle.material.opacity = 1;
	puzzle.material.transparent = false;
	if(reAddPuzzle){
		scene.add(puzzle);
		reAddPuzzle = false;
	}
}
function resetJumpableDoor(){
	if(jumpableDoorOpen){
		scene.remove(jumpableDoor);
		jumpableDoor.position.y -= 4;
		scene.add(jumpableDoor);
		jumpableDoor.setLinearFactor(new THREE.Vector3(0,1,0));
		jumpableDoor.setAngularFactor(new THREE.Vector3(0,0,0));
	}
}

//Creates the menu
function createMenu(){
	menuTexture = textureLoader.load('images/menu/main_menu.jpg');
	playTexture = textureLoader.load('images/menu/menu_play.png');
	playSelectedTexture = textureLoader.load('images/menu/menu_play_selected.png');
	optionsTexture = textureLoader.load('images/menu/menu_options.png');
	optionsSelectedTexture = textureLoader.load('images/menu/menu_options_selected.png');
	controlsTexture = textureLoader.load('images/menu/menu_help.png');
	controlsSelectedTexture = textureLoader.load('images/menu/menu_help_selected.png');
	controlsScreenTexture = textureLoader.load('images/menu/menu_controls.jpg');
	backTexture = textureLoader.load('images/menu/menu_back_arrow.png');
        backSelectedTexture = textureLoader.load('images/menu/menu_back_arrow_selected.png');
	loadingBackgroundTexture = textureLoader.load('images/loadingBackground.jpg');
	loadingBarTexture = textureLoader.load('images/loadingBar.jpg');
	loadingBarTexture.wrapS = THREE.RepeatWrapping;
        loadingBarTexture.wrapT = THREE.RepeatWrapping;
    damageTexture = textureLoader.load('images/damage.png');    
    
	

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
	menuItems["play"] = playSprite;
	playSprite.visible = false;
	
        
        // Options Button
	var spriteMaterialOptions = new THREE.SpriteMaterial({
		map : optionsTexture
	});
	optionsSprite = new THREE.Sprite(spriteMaterialOptions);
	optionsSprite.position.set(8, -buttonSizeY*2 + 30 , -80);
	optionsSprite.scale.set(buttonSizeX, buttonSizeY, 1);
	orthoScene.add(optionsSprite);
	menuItems["options"] = optionsSprite;
	optionsSprite.visible = false;
        
        // Help / Controls Button
	var spriteMaterialControls = new THREE.SpriteMaterial({
		map : controlsTexture
	});
	controlsSprite = new THREE.Sprite(spriteMaterialControls);
	controlsSprite.position.set(8, -buttonSizeY*3, -80);
	controlsSprite.scale.set(buttonSizeX, buttonSizeY, 1);
	orthoScene.add(controlsSprite);
	menuItems["help"] = controlsSprite;
	controlsSprite.visible = false;
        
        
        // Back (Arrow)
	var spriteMaterial = new THREE.SpriteMaterial({
		map : backTexture
	});
	backSprite = new THREE.Sprite(spriteMaterial);
	backSprite.position.set(-buttonSizeX*1.5, -menuSizeY/2.25 + buttonSizeY , -80);
	backSprite.scale.set(buttonSizeX, buttonSizeY*3, 1);
	orthoScene.add(backSprite);
	menuItems["back"] = backSprite;
        backSprite.visible = false;
    
    var damageMaterial = new THREE.SpriteMaterial({
    	map : damageTexture
    });
    damageSprite = new THREE.Sprite(damageMaterial);
    damageSprite.position.set(0,0,-20);
    damageSprite.scale.set(window.innerWidth, window.innerHeight, 1);
    damageSprite.visible = false;
    orthoScene.add(damageSprite);
        
        
	menu = true;
	removeLoadingScreen();
	showMenu();
	renderer.domElement.addEventListener('mousemove', onDocumentMouseMove);
	renderer.domElement.addEventListener('click', onDocumentMouseClick);
	renderer.domElement.addEventListener('mousedown', onDocumentMouseDown);
	renderer.domElement.addEventListener('mouseup', onDocumentMouseUp);
	tick();
}

function loadAudio(){
/*TODO: MIGHT WANT TO COMPRESS SOME OF THESE SOUNDFILES */
    
    gameOverAudio = new Audio('audio/gameOver.mp3');
    gameOverAudio.volume = 0.5;
    ambience = new Audio('audio/277189__georgke__ambience-composition.mp3');
    /* TODO: DEBUG: TURNED OFF MUSIC WHILE WORKING ON THE GAME */
    ambience.volume = 0;
    ambience.addEventListener('ended', function() {
        this.currentTime = 0; 
        this.play();
    }, false);
    ambience.play();
    ambience2 = new Audio('audio/172937__setuniman__creepy-0v55m2.mp3');
    ambience2.volume = 0;
    ambience2.addEventListener('ended', function(){
    	this.currentTime = 0;
    	this.play();
    }, false);
    damageSound = new Audio('audio/262279__dirtjm__grunts-male.mp3');
    damageSound.addEventListener('ended', function(){
    	this.currentTime = 0;
    });
    walkSound = new Audio('audio/166304__fantozzi__mco-walk-f01.mp3');
    walkSound.volume = 0.2;
    walkSound.addEventListener('ended', function(){
    	this.currentTime = 0;
    	this.play();
    })
    jumpSound = new Audio('audio/319664__manuts__jump-1.mp3');
    jumpSound.volume = 0.5;
    jumpSound.addEventListener('ended', function(){
    	this.currentTime = 0;
    });
}
