/**
 * 
 */

if (!Detector.webgl)
	Detector.addGetWebGLMessage();

var scene, keyboard, camera, directionalLight, ambientLight, renderer;
var dockModel;
var charMesh;
var dockMaterial;
var controls;
var stats;
var container;
var rotating = false;
var airborne = false;
var moveForward = false;
var moveBackward = false;
var rotateLeft = false;
var rotateRight = false;
var moving = false;
var jump = false;
var controllingChar = true;
var controllingCrane = false;
var keyMap = [];
var hinge1;
var tempPos;
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
var health = 100;
var gameOverAudio;

function main() {
	init();
}

function tick() {
	scene.simulate();
	stats.update();
//	updateCamera(); //removed since camera is now attached to character. 
	renderer.render(scene, camera);
	checkMovement();
	
	

	requestAnimationFrame(tick);
}

function init() {
	Physijs.scripts.worker = 'lib/physijs_worker.js';
	Physijs.scripts.ammo = 'http://gamingJS.com/ammo.js';

	scene = new Physijs.Scene();
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

	directionalLight = new THREE.DirectionalLight(0x909080);
	directionalLight.position.set(-2, 2, 5);
	ambientLight = new THREE.AmbientLight(0x606060);
	scene.add(directionalLight);
	scene.add(ambientLight);

	// renderer

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha : true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.Enabled = true;

	textureLoader = new THREE.TextureLoader();
	var groundTexture = textureLoader.load('images/ground.jpg');
	

	dockMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
		map : groundTexture
	}), .7, .2);
	
	level1Texture = textureLoader.load('images/level_1_texture.jpg');
	trapTexture = textureLoader.load('images/bouncers.jpg');
	
	

	var loader = new THREE.JSONLoader();

//	loader.load('models/char.js', characterLoadedCallback);
	loader.load('models/level_01.js', level1loadedCallback);
	loader.load('models/trap.js', trapLoadedCallback);
	
	 var craneTexture = textureLoader.load( 'images/crane.jpg');
	 craneMaterial = Physijs.createMaterial( new THREE.MeshBasicMaterial({map: craneTexture}),  0.4, 0.8);
	 var crateTexture = textureLoader.load('images/crate.jpg');
	 crateMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: crateTexture}), 0.4, 0.8);
	
	generator = new levelGenerator();

	window.addEventListener('resize', onWindowResize, false);
	//
	// goal = new Physijs.BoxMesh(new THREE.BoxGeometry(100, 2, 4, 10, 10),
	// Physijs.createMaterial(new THREE.MeshBasicMaterial({
	// color : 0xffee22
	// }), .4, .8), 0);
	// scene.add(goal);

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
	};
	
	gameOverAudio = new Audio('audio/gameOver.mp3');
	
	
	 createChar();
	 
//     craneObj = new THREE.Object3D();
//	 buildCrane();

//	document.addEventListener("keydown", function(e) {
//		e = e || event;
//		keyMap[e.keyCode] = e.type == 'keydown';
//		var code = event.which || event.keyCode;
//		if (code == 65) { //A
//			rotateLeft = true;
//		}
//		if (code == 68) { //D
//			rotateRight = true;
//		}
//		if (code == 87) { //W
//			moveForward = true;
//		}
//		if (code == 83) { //S
//			moveBackward = true;
//		}
//		if (code == 74){ //J
//			jump = true;
//		}
//	});
//
//	document.addEventListener("keyup", function(event) {
//		e = e || event;
//		keyMap[e.keyCode] = e.type == 'keydown';
//		var code = event.keyCode;
//		if (code == 65) { //A
//			rotateLeft = false;
//		}
//		if (code == 68) { //D
//			rotateRight = false;
//		}
//		if (code == 87) { //W
//			moveForward = false;
//		}
//		if (code == 83) { //S
//			moveBackward = false;
//		}
//		if (code = 74){ //J
//			jump = false;
//		}
//	});

}


function level1loadedCallback(geometry, materials){
	levelMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:level1Texture}));
	scene.add(levelMesh);
//	tick();
}

function trapLoadedCallback(geometry){
	trapMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:trapTexture}));
	trapMesh.scale.set(0.1,0.1,0.1);
	trapMesh.position.y -= 0.5;
	trap.add(trapMesh);
}

function createChar() {
	charMesh = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5,3,1), Physijs.createMaterial(
			new THREE.MeshBasicMaterial({
				color : 0xeeff33
			}), .9, .1), 10);
	charMesh.position.y += 1;
	charMesh.position.x -= 9;
	charMesh.position.z += 5;
	
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
		if (other_object == trap) {
			health -= 100;
		}
	});
	charMesh.setDamping(0.1, 0.9);
	
	charCaster = new THREE.Raycaster();
	moveableObjects.push(charMesh);
	tick();
	
}


//Just making a simple crane to test stuff.
function buildCrane(){
	horizontalPivotGeo = new THREE.CylinderGeometry(1, 1, 10);
	firstPivotGeo = new THREE.CylinderGeometry(1, 1, 8);
	secondPivotGeo = new THREE.CylinderGeometry(1, 1, 8);
	wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 2);
	ropeGeo = new THREE.CylinderGeometry(0.05, 0.05, 8);
	magGeo = new THREE.CylinderGeometry(1, 1, 0.5);
	meshFoundation = new Physijs.BoxMesh( new THREE.BoxGeometry(3,3,2), craneMaterial, 100 );
	meshHorizontalPivot = new Physijs.CylinderMesh(horizontalPivotGeo, craneMaterial, 1);
	meshFirstPivot = new Physijs.CylinderMesh(firstPivotGeo, craneMaterial, 1);
	meshFirstPivot.translateY(5);
	meshFirstPivot.translateX(-4);
	
	meshSecondPivot = new Physijs.CylinderMesh(secondPivotGeo, craneMaterial, 1);
	meshSecondPivot.translateY(8);
	meshWheel1 = new Physijs.CylinderMesh(wheelGeo, craneMaterial, 1);
	
	meshWheel2 = new Physijs.CylinderMesh(wheelGeo, craneMaterial, 1);
	meshRope = new Physijs.CylinderMesh(ropeGeo, craneMaterial, 1);
	meshMag = new Physijs.CylinderMesh(magGeo, craneMaterial, 1);
	meshMag.translateY(-4);
	
	meshWheel2.rotation.x = Math.PI/2;
	meshHorizontalPivot.translateY(4);
	meshFirstPivot.rotation.z = Math.PI/2;
	currentAngle = 0;
	currentAngle2 = 0;
	meshFoundation.translateX(-5);
	meshFoundation.translateZ(2.5);
	meshFoundation.translateY(3);
	meshFirstPivot.add(meshWheel1);
	
	meshWheel1.rotation.x = Math.PI/2;
	meshWheel1.translateZ(4);
	meshSecondPivot.add(meshWheel2);
	meshWheel2.translateZ(4);
	meshHorizontalPivot.add(meshFirstPivot);
	meshFirstPivot.add(meshSecondPivot);
	meshFoundation.add(meshHorizontalPivot);
	  //Adding all the parts together in the correct orders and places is a bit messy, but this works.
	meshRope.add(meshMag);
	meshRope.rotation.z = Math.PI/2;
	meshRope.translateY(4);
	meshRope.translateX(4);
	meshMag.translateY(8);
	meshSecondPivot.add(meshRope);
	scene.add(meshFoundation);
//	hinge1 = new Physijs.HingeConstraint(meshFirstPivot, null, new THREE.Vector3(-5, 10, 0), new THREE.Vector3(0,0,1)); Does not work o.O
//	scene.addConstraint(hinge1);
//	hinge1.setLimits(0, Math.PI/2, 1, 1);
//	hinge1.enableAngularMotor(2,2);
			
}




//function updateCamera() {  //Figured I could just attach the camera to the character instead.
//	var quat = new THREE.Quaternion();
//	var rotMat = new THREE.Matrix4();
//	rotMat.extractRotation(charMesh.matrix);
//	quat.setFromRotationMatrix(rotMat);
//	var position = new THREE.Vector3(0, 10, -10);
//	position.applyQuaternion(quat);
//	camera.position.x = charMesh.position.x + position.x;
//	camera.position.y = charMesh.position.y + position.y;
//	camera.position.z = charMesh.position.z + position.z;
//	camera.lookAt(charMesh.position);
//}



function cloneBox(object){
	var clone = new Physijs.BoxMesh(object.clone().geometry, object.material, object.mass);
	clone.visible = false;
	return clone;
}

function showGameOver(){
	gameOverPopup = document.getElementById('gameOverPopup');
	gameOverPopup.style.visibility = "visible";
	gameOverPopup.style.position = 'absolute';
	gameOverPopup.style.width = 300 + 'px';
	gameOverPopup.style.height = 200 + 'px';
	gameOverPopup.style.backgroundColor = "green";
	gameOverPopup.innerHTML = "GAME OVER";
	gameOverPopup.style.top = 300 + 'px';
	gameOverPopup.style.left = 800 + 'px';
	gameOverPopup.style.fontSize = 30 + 'px';
	document.body.appendChild(gameOverPopup);
	gameOverAudio.play();
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
