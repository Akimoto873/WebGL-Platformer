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
	
	camera.position.x = 2;
	camera.position.y = 2;
	camera.position.z = 2;
	scene.add(camera);
	
	controls = new THREE.OrbitControls(camera); //Added for testing purposes. Makes it easier to see whats going on.

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
	

	var loader = new THREE.JSONLoader();

//	loader.load('models/dock.js', dockModelLoadedCallback);
//	loader.load('models/dock.js', dockModelLoadedCallback2);
	loader.load('models/char.js', characterLoadedCallback);
	loader.load('models/level_01.js', level1loadedCallback);

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
	
	
	
	 var craneTexture = textureLoader.load( 'images/crane.jpg');
	 craneMaterial = Physijs.createMaterial( new THREE.MeshBasicMaterial({map: craneTexture}),  0.4, 0.8);
	 
	 
     craneObj = new THREE.Object3D();
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

function dockModelLoadedCallback(geometry) {
	dockModel = new Physijs.BoxMesh(geometry, dockMaterial, 0);
	dockModel.position.y -= 1;
	scene.add(dockModel);
}

function dockModelLoadedCallback2(geometry) {
	dockModel2 = new Physijs.BoxMesh(geometry, dockMaterial, 0);
	dockModel2.position.x += 35;
	dockModel2.position.y -= 1;
	scene.add(dockModel2);
}

function level1loadedCallback(geometry, materials){
	levelMesh = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshBasicMaterial({map:level1Texture}), 0.4, 0.6), 0);
	scene.add(levelMesh);
}

function characterLoadedCallback(geometry, materials) {
	charMesh = new Physijs.ConcaveMesh(geometry, Physijs.createMaterial(
			new THREE.MeshBasicMaterial({
				color : 0xeeff33
			}), .7, .2), 1);
	charMesh.position.y += 3;
	
	scene.add(charMesh);
//	camera.position.y = 5;
//	camera.position.z = -5;
//	camera.lookAt(charMesh.position);
//	scene.add(camera);
//	charMesh.setAngularFactor(0,1,0);
	charMesh.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
//		if (other_object == dockModel || other_object == dockModel2) {
//			airborne = false;
//		}
	});
	charMesh.setDamping(0.1, 0.9);
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

function checkMovement(){
	if(controllingChar){
		if (keyMap[87]) { //W
			if(!airborne){
				var rotationMatrix = new THREE.Matrix4();
				rotationMatrix.extractRotation(charMesh.matrix);
				var forceVector = new THREE.Vector3(0, 0, 4);
				var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
				var oldVelocity = charMesh.getLinearVelocity();
				charMesh.setLinearVelocity(new THREE.Vector3(finalForceVector.x, oldVelocity.y, finalForceVector.z ));
			}
		}
		if (keyMap[83]) { //S
			if(!airborne){
				var rotationMatrix = new THREE.Matrix4();
				rotationMatrix.extractRotation(charMesh.matrix);
				var forceVector = new THREE.Vector3(0, 0, -4);
				var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
				var oldVelocity = charMesh.getLinearVelocity();
				charMesh.setLinearVelocity(new THREE.Vector3(finalForceVector.x, oldVelocity.y, finalForceVector.z ));
			}
	
		}
		if (keyMap[32]) { //Space
			if (!airborne) {
				airborne = true;
				charMesh.applyCentralImpulse(new THREE.Vector3(0, 10, 0));
			}
		}
	
		if (keyMap[65]) { //A
			charMesh.setAngularVelocity(new THREE.Vector3(0, 1.5, 0));
	
		}
		if (keyMap[68]) { //D
			charMesh.setAngularVelocity(new THREE.Vector3(0, -1.5, 0));
	
		}
		if(charMesh.position.y < -5){ //Checks if fallen off the edge.
			charMesh.__dirtyPosition = true;
			charMesh.position.x = 0;
			charMesh.position.y = 5;
			charMesh.position.z = 0;
			charMesh.setLinearVelocity(new THREE.Vector3(0,0,0));
			
		}
		if(keyMap[69]){ //E
			var distance = new THREE.Vector3();
			distance.subVectors(charMesh.position, meshFoundation.position);
			if(distance.length() < 3){
				controllingChar = false;
				controllingCrane = true;
				tempPos = camera.position.clone();
				charMesh.remove(camera);
				scene.add(camera);
				camera.position.set(0, 15, 15);
				camera.lookAt(meshFoundation.position);
				
			}
		}
	}
	if(controllingCrane){
		if(keyMap[65]){ //A
			meshFoundation.setLinearVelocity(new THREE.Vector3(1,0,0));
		}
		if(keyMap[68]){ //D
			meshFoundation.setLinearVelocity(new THREE.Vector3(-1,0,0));
		}
		if(keyMap[70]){ //F
			controllingChar = true;
			controllingCrane = false;
			scene.remove(camera);
			camera.position.x = tempPos.x;
			camera.position.y = tempPos.y;
			camera.position.z = tempPos.z;
			camera.lookAt(charMesh.position); //This doesnt turn out exactly how it should. Don't know why.
			
			charMesh.add(camera);
			
		}
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
