/**
 * 
 */

if (!Detector.webgl)
	Detector.addGetWebGLMessage();

var scene, keyboard, camera, directionalLight, ambientLight, renderer;
var charMesh;
var controls;
var stats;
var container;
var airborne = false;
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
var charCam = true;
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

function main() {
	init();
}

function tick() {
	if(level == 1){
		scene.simulate();
		stats.update();
	//	updateCamera(); //removed since camera is now attached to character.
		renderer.clear();
		renderer.render(scene, camera);
		renderer.clearDepth();
		renderer.render(orthoScene, orthoCamera);
		checkMovement();
	}
	else if(level == 2){
		scene.simulate();
		stats.update();
	//	updateCamera(); //removed since camera is now attached to character.
		renderer.clear();
		renderer.render(scene, camera);
		renderer.clearDepth();
		renderer.render(orthoScene, orthoCamera);
	}
	else{
		
	}
	

	requestAnimationFrame(tick);
}

function init() {
	Physijs.scripts.worker = 'lib/physijs_worker.js';
	Physijs.scripts.ammo = 'http://gamingJS.com/ammo.js';

	scene = new Physijs.Scene();
	scene.fog = new THREE.Fog(0x202020, 10, 100);
	scene.setGravity(new THREE.Vector3(0, -10, 0)); // set gravity
	scene.addEventListener('update', function() {
		scene.simulate(); // simulate on every scene update
	});

	keyboard = new THREEx.KeyboardState();

	// Camera

	camera = new THREE.PerspectiveCamera(75, window.innerWidth
			/ window.innerHeight, 0.01, 10000);
	
	if(!charCam){
	
	camera.position.y += 15;
	
	controls = new THREE.OrbitControls(camera);
	}
	
	

	// Lights

	ambientLight = new THREE.AmbientLight(0x606060);
	scene.add(ambientLight);
	
	

	// renderer

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha : true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.Enabled = true;
	renderer.autoClear = false;

	textureLoader = new THREE.TextureLoader();
	
	
	level1Texture = textureLoader.load('images/level_1_texture2.jpg');
	trapTexture = textureLoader.load('images/crushers.jpg');
	
	

	var loader = new THREE.JSONLoader();

//	loader.load('models/char.js', characterLoadedCallback);
	loader.load('models/level_01.js', level1loadedCallback);
	loader.load('models/trap.js', trapLoadedCallback);
	
	 var crateTexture = textureLoader.load('images/crate.jpg');
	 crateMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: crateTexture}), 0.4, 0.8);
	 var exitTexture = textureLoader.load('images/exit.jpg');
	 exitMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: exitTexture}), 0.4, 0.8);
	 var crushingTexture = textureLoader.load('images/crushing.jpg');
	 crushingMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({map:crushingTexture}), 0.4, 0.8);
	 roofTexture = textureLoader.load('images/concrete.jpg');
	 roofTexture.wrapT = roofTexture.wrapS = THREE.RepeatWrapping;
	 roofTexture.repeat.set(20,20);
	 healthTexture = textureLoader.load('images/health.jpg');
	 healthBoxTexture = textureLoader.load('images/healthBox.png');
	 bloodTexture = textureLoader.load('images/blood.jpg');
	 gameOverTexture = textureLoader.load('images/gameOver.jpg');
	 restartTexture = textureLoader.load('images/restart.jpg');
	
	generator = new levelGenerator();

	window.addEventListener('resize', onWindowResize, false);

	container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	// fps statistics

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);
	
	onkeydown = onkeyup = function(e){
	    e = e || event; // to deal with IE
	    keyMap[e.keyCode] = e.type == 'keydown';
	    if(e.keyCode == 32){
	    	e.preventDefault();
	    }
	    if(e.keyCode == 70){
	    	if(e.type == 'keyup'){
	    		pickup = true;
	    	}
	    }
	};
	
	gameOverAudio = new Audio('audio/gameOver.mp3');
	
	createOverlay();
	 createChar();
	 fallClock = new THREE.Clock();
	 

}


function level1loadedCallback(geometry, materials){
	levelMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:level1Texture}));
	levelMesh.scale.set(1,1.8,1)
	levelMesh.position.y += 1.4;
	scene.add(levelMesh);
//	tick();
}

function trapLoadedCallback(geometry){
	trapBase = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:trapTexture}));
	trapMesh = trapBase.clone();
	trapMesh.scale.set(0.1,0.1,0.1);
	trapMesh.position.y -= 0.5;
	trap.add(trapMesh);
	trap2Mesh = trapBase.clone();
	trap2Mesh.rotation.x += Math.PI / 2;
	trap2Mesh.scale.set(0.1,0.1,0.08);
	trap2.add(trap2Mesh);
}

function createChar() {
	charMesh = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5,3,1), Physijs.createMaterial(
			new THREE.MeshBasicMaterial({
				color : 0xeeff33
			}), .95, .1), 10);
	charMesh.position.y += 1;
	charMesh.position.x += 5;
	
	scene.add(charMesh);
	if(charCam){
		camera.position.z +=0;
		camera.lookAt(new THREE.Vector3(0, 0, charMesh.position.z + 5));
		charMesh.add(camera);
		charMesh.material.visible = false;
	}
	charMesh.setAngularFactor(new THREE.Vector3(0,0.1,0));
	charMesh.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == trap || other_object == trap2) {
			health -= 100;
			damaged = true;
		}
		if(other_object == exit){
			levelComplete();
		}
	});
	charMesh.setDamping(0.1, 0.9);
	
	charCaster = new THREE.Raycaster();
	moveableObjects.push(charMesh);
	charLoaded = true;
	checkTick();
	
}



function cloneBox(object){
	var clone = new Physijs.BoxMesh(object.clone().geometry, object.material, object.mass);
	clone.visible = false;
	return clone;
}

function showGameOver(){
	 var bloodMaterial = new THREE.SpriteMaterial({map: bloodTexture, opacity: 0.1});
	  bloodSprite = new THREE.Sprite(bloodMaterial);
	  bloodSprite.position.set(0,0,5);
	  bloodSprite.scale.set(window.innerWidth,window.innerHeight,1);
	  orthoScene.add(bloodSprite);
	  var gameOverMaterial = new THREE.SpriteMaterial({map: gameOverTexture, opacity: 0.0});
	  gameOverSprite = new THREE.Sprite(gameOverMaterial);
	  gameOverSprite.position.set(0,0,4);
	  gameOverSprite.scale.set(window.innerWidth,window.innerHeight,1);
	  orthoScene.add(gameOverSprite);

	  var restartSpriteMaterial = new THREE.SpriteMaterial({map: restartTexture, opacity: 0.0});
	  restartSprite = new THREE.Sprite(restartSpriteMaterial);
	  restartSprite.position.set(0,0,7);
	  restartSprite.scale.set(window.innerWidth/2.5, window.innerHeight/2.5, 1);
	  orthoScene.add(restartSprite);
	  gameOverScreen = true;
//	gameOverPopup = document.getElementById('gameOverPopup');
//	gameOverPopup.style.visibility = "visible";
//	gameOverPopup.style.position = 'absolute';
//	gameOverPopup.style.width = 300 + 'px';
//	gameOverPopup.style.height = 200 + 'px';
//	gameOverPopup.style.backgroundColor = "green";
//	gameOverPopup.innerHTML = "GAME OVER";
//	gameOverPopup.style.top = 300 + 'px';
//	gameOverPopup.style.left = 800 + 'px';
//	gameOverPopup.style.fontSize = 30 + 'px';
//	document.body.appendChild(gameOverPopup);
	gameOverAudio.play();
}

function checkTick(){
	if(charLoaded && levelLoaded){
		tick();
	}
}
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);

}

function log(param){
    setTimeout(function(){
        throw new Error("Debug: "+param)
    },0)
}

function levelComplete(){
	restartLevel();
}

function createOverlay(){
	  overlayContainer = document.createElement( 'div' );
	  document.body.appendChild( overlayContainer );
	  
	  orthoCamera = new THREE.OrthographicCamera( 
			    window.innerWidth / - 2, window.innerWidth / 2,     window.innerHeight / 2, window.innerHeight / - 2, -10, 1000 );
			  orthoCamera.position.x = 0;
			  orthoCamera.position.y = 0;
			  orthoCamera.position.z = 0;
			  
	  orthoScene = new THREE.Scene();
	  var spriteMaterial = new THREE.SpriteMaterial({map: healthTexture, color: 0x00ff00});
	  healthSprite = new THREE.Sprite(spriteMaterial);
	  healthSprite.position.set(-(window.innerWidth/3.2),-(window.innerHeight/2) + 100,10);
	  healthSprite.scale.set(window.innerWidth/3,window.innerHeight/16,1);
	  orthoScene.add(healthSprite);
	  var spriteMaterial2 = new THREE.SpriteMaterial({map: healthBoxTexture, color: 0x000000});
	  healthSprite2 = new THREE.Sprite(spriteMaterial2);
	  healthSprite2.position.set(-(window.innerWidth/3.2),-(window.innerHeight/2) + 100,8);
	  healthSprite2.scale.set(window.innerWidth/2.8,window.innerHeight/15,1);
	  orthoScene.add(healthSprite2);
	  var spriteMaterial3 = new THREE.SpriteMaterial({map: healthTexture, color: 0x0000ff});
	  staminaSprite = new THREE.Sprite(spriteMaterial3);
	  staminaSprite.position.set(-(window.innerWidth/3.2),-(window.innerHeight/2.5) + 100,10);
	  staminaSprite.scale.set(window.innerWidth/3,window.innerHeight/16,1);
	  orthoScene.add(staminaSprite);
	  var spriteMaterial4 = new THREE.SpriteMaterial({map: healthBoxTexture, color: 0x000000});
	  staminaSprite2 = new THREE.Sprite(spriteMaterial4);
	  staminaSprite2.position.set(-(window.innerWidth/3.2),-(window.innerHeight/2.5) + 100,8);
	  staminaSprite2.scale.set(window.innerWidth/2.8,window.innerHeight/15,1);
	  orthoScene.add(staminaSprite2);
}

function restartLevel(){ //Currently not finished.
	level = 0;
	resetChar();
	resetCrate();
	resetTraps();
	health = 100;
	damaged = true;
	if(gameOverScreen){
		gameOverScreen = false;
		orthoScene.remove(bloodSprite);
		orthoScene.remove(gameOverSprite);
		orthoScene.remove(restartSprite);
	}
	level = 1;
	
	
	
}

function resetChar(){
	scene.remove(charMesh);
	charMesh.remove(camera);
	var temp = cloneBox(charMesh);
	temp.visible = true;
	charMesh = temp;
	charMesh.position.set(5,1,0);
	scene.add(charMesh);
	camera.lookAt(new THREE.Vector3(0, 0, charMesh.position.z + 5));
	charMesh.add(camera);
	charMesh.material.visible = false;
	charMesh.setAngularFactor(new THREE.Vector3(0,0.1,0));
	charMesh.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == trap || other_object == trap2) {
			health -= 100;
			damaged = true;
		}
		if(other_object == exit){
			levelComplete();
		}
	});
	charMesh.setDamping(0.1, 0.9);
	moveableObjects.push(charMesh);
	carrying = false;
}

function resetCrate(){
	scene.remove(crate);
	crate.position.set(9, 0 , -12);
	scene.add(crate);
}
function resetTraps(){
	scene.remove(trap2);
	trap2.position.set(-20, 1.5, 24.5);
	scene.add(trap2);
	trap2.setAngularFactor(new THREE.Vector3(0,0,0));
	triggered2 = false;
}
