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
	
//	camera.position.y += 15;
//	
//	controls = new THREE.OrbitControls(camera);
	
	
	

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
	
	generateLevel();

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
	levelMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:level1Texture}));
	scene.add(levelMesh);
	tick();
}

function characterLoadedCallback(geometry, materials) {
	charMesh = new Physijs.BoxMesh(geometry, Physijs.createMaterial(
			new THREE.MeshBasicMaterial({
				color : 0xeeff33
			}), .7, .2), 10);
	charMesh.position.y += 3;
	charMesh.position.x += 10;
	charMesh.scale.set(0.5, 1,1);
	
	scene.add(charMesh);
	camera.position.z +=0;
	camera.lookAt(new THREE.Vector3(0, 0, charMesh.position.z + 5));
	charMesh.add(camera);
	charMesh.setAngularFactor(new THREE.Vector3(0,0.1,0));
	charMesh.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == floor) {
			airborne = false;
		}
	});
	charMesh.setDamping(0.1, 0.9);
	charMesh.visible = false;
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
				charMesh.applyCentralImpulse(new THREE.Vector3(0, 60, 0));
			}
		}
	
		if (keyMap[65]) { //A
			charMesh.setAngularVelocity(new THREE.Vector3(0, 1.5, 0));
	
		}
		if (keyMap[68]) { //D
			charMesh.setAngularVelocity(new THREE.Vector3(0, -1.5, 0));
	
		}
		if(!keyMap[65] && !keyMap[68]){
			charMesh.setAngularVelocity(new THREE.Vector3(0,0,0));
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
		if(keyMap[70]){
			charMesh.remove(camera);
			charMesh.visible = true;
			camera.position.y += 10;
			camera.lookAt(charMesh.position);
			scene.add(camera);
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

function generateLevel(){
	floor = new Physijs.BoxMesh(new THREE.BoxGeometry(100,1,100), Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xee2233}), 0.4, 0.2), 0);
	floor.position.y -= 2.5;
	scene.add(floor);
	var basicWall1 = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 4, 0.2), Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x22ee44}), 0.0, 0.1), 0);
	wall1 = cloneBox(basicWall1);
	wall1.position.z +=3.9;
	wall1.scale.set(3.5,1,1);
	wall1.position.x += 3.5;
	scene.add(wall1);
	wall2 = cloneBox(basicWall1);
	wall2.position.x -= 0;
	wall2.position.z += 7.4;
	wall2.scale.set(3.5, 1, 1);
	scene.add(wall2);
	wall3 = cloneBox(basicWall1);
	wall3.position.x += 2;
	wall3.position.z -= 7.5;
	scene.add(wall3);
	wall4 = cloneBox(basicWall1);
	wall4.position.x += 2;
	wall4.position.z -= 15;
	scene.add(wall4);
	wall5 = cloneBox(basicWall1);
	wall5.position.x += 7;
	wall5.position.z -= 10.5;
	wall5.scale.set(1.6, 1, 1);
	scene.add(wall5);
	wall6 = cloneBox(basicWall1);
	wall6.position.x -= 10;
	wall6.position.z -= 25;
	wall6.scale.set(12, 1, 1);
	scene.add(wall6);
	wall7 = cloneBox(basicWall1);
	wall7.position.x += 2;
	wall7.position.z += 10.5;
	scene.add(wall7);
	wall8 = cloneBox(basicWall1);
	wall8.position.x += 20;
	wall8.position.z += 11;
	wall8.scale.set(2.8,1,1);
	scene.add(wall8);
	wall9 = cloneBox(basicWall1);
	wall9.position.x += 16.5;
	wall9.position.z += 14.5;
	wall9.scale.set(2.8, 1,1);
	scene.add(wall9);
	wall10 = cloneBox(basicWall1);
	wall10.position.x += 18;
	wall10.position.z += 18;
	wall10.scale.set(3.5, 1,1);
	scene.add(wall10);
	wall11 = cloneBox(basicWall1);
	wall11.position.x += 4;
	wall11.position.z += 21.5;
	wall11.scale.set(11, 1,1);
	scene.add(wall11);
	wall12 = cloneBox(basicWall1);
	wall12.position.x += 0;
	wall12.position.z += 25;
	wall12.scale.set(15, 1,1);
	scene.add(wall12);
	wall13 = cloneBox(basicWall1);
	wall13.position.x -= 5;
	wall13.position.z += 14.5;
	wall13.scale.set(1, 1,1);
	scene.add(wall13);
	wall14 = cloneBox(basicWall1);
	wall14.position.x -= 5.2;
	wall14.position.z += 18;
	wall14.scale.set(2.8, 1,1);
	scene.add(wall14);
	wall15 = cloneBox(basicWall1);
	wall15.position.x -= 24;
	wall15.position.z += 21.5;
	wall15.scale.set(1, 1,1);
	scene.add(wall15);
	wall16 = cloneBox(basicWall1);
	wall16.position.x -= 12.5;
	wall16.position.z += 7.5;
	wall16.scale.set(1, 1,1);
	scene.add(wall16);
	wall17 = cloneBox(basicWall1);
	wall17.position.x -= 16;
	wall17.position.z -= 0;
	wall17.scale.set(1, 1,1);
	scene.add(wall17);
	wall18 = cloneBox(basicWall1);
	wall18.position.x -= 19.5;
	wall18.position.z -= 4;
	wall18.scale.set(1, 1,1);
	scene.add(wall18);
	wall19 = cloneBox(basicWall1);
	wall19.position.x -= 12.5;
	wall19.position.z -= 14;
	wall19.scale.set(1, 1,1);
	scene.add(wall19);
	wall20 = cloneBox(basicWall1);
	wall20.position.x -= 11;
	wall20.position.z -= 17.8;
	wall20.scale.set(1.8, 1,1);
	scene.add(wall20);
	wall20 = cloneBox(basicWall1);
	wall20.position.x -= 18;
	wall20.position.z -= 21.5;
	wall20.scale.set(1.8, 1,1);
	scene.add(wall20);
	var basicWall2 = new Physijs.ConvexMesh(new THREE.BoxGeometry(0.2, 4, 4), Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x554444}), 0.0, 0.1), 0);
	wall21 = cloneBox(basicWall2);
	wall21.position.x -= 3.5;
	wall21.position.z -= 12;
	wall21.scale.set(1,1,8);
	scene.add(wall21);
	wall22 = cloneBox(basicWall2);
	wall22.position.x -= 7;
	wall22.position.z -= 3;
	wall22.scale.set(1,1,9);
	scene.add(wall22);
	wall23 = cloneBox(basicWall2);
	wall23.position.x -= 11;
	wall23.position.z += 2;
	wall23.scale.set(1,1,8);
	scene.add(wall23);
	wall24 = cloneBox(basicWall2);
	wall24.position.x -= 11;
	wall24.position.z -= 23;
	wall24.scale.set(1,1,1);
	scene.add(wall24);
	wall25 = cloneBox(basicWall2);
	wall25.position.x -= 14.5;
	wall25.position.z += 16;
	wall25.scale.set(1,1,2.5);
	scene.add(wall25);
	wall26 = cloneBox(basicWall2);
	wall26.position.x -= 14.5;
	wall26.position.z += 5;
	wall26.scale.set(1,1,1);
	scene.add(wall26);
	wall27 = cloneBox(basicWall2);
	wall27.position.x -= 14.5;
	wall27.position.z -= 6;
	wall27.scale.set(1,1,3.5);
	scene.add(wall27);
	wall28 = cloneBox(basicWall2);
	wall28.position.x -= 14.5;
	wall28.position.z -= 20;
	wall28.scale.set(1,1,1);
	scene.add(wall28);
	wall29 = cloneBox(basicWall2);
	wall29.position.x -= 18;
	wall29.position.z += 10;
	wall29.scale.set(1,1,5.5);
	scene.add(wall29);
	wall30 = cloneBox(basicWall2);
	wall30.position.x -= 18;
	wall30.position.z -= 11;
	wall30.scale.set(1,1,3.5);
	scene.add(wall30);
	wall31 = cloneBox(basicWall2);
	wall31.position.x -= 21.5;
	wall31.position.z -= 0;
	wall31.scale.set(1,1,10);
	scene.add(wall31);
	wall32 = cloneBox(basicWall2);
	wall32.position.x -= 25;
	wall32.position.z -= 0;
	wall32.scale.set(1,1,12);
	scene.add(wall32);
	wall33 = cloneBox(basicWall2);
	wall33.position.x -= 3.5;
	wall33.position.z += 12;
	wall33.scale.set(1,1,1);
	scene.add(wall33);
	wall34 = cloneBox(basicWall2);
	wall34.position.x += 0;
	wall34.position.z += 14.5;
	wall34.scale.set(1,1,2);
	scene.add(wall34);
	wall35 = cloneBox(basicWall2);
	wall35.position.x += 3.5;
	wall35.position.z += 14.5;
	wall35.scale.set(1,1,2);
	scene.add(wall35);
	wall36 = cloneBox(basicWall2);
	wall36.position.x += 0;
	wall36.position.z -= 11;
	wall36.scale.set(1,1,2);
	scene.add(wall36);
	wall37 = cloneBox(basicWall2);
	wall37.position.x += 4;
	wall37.position.z -= 3.5;
	wall37.scale.set(1,1,2);
	scene.add(wall37);
	wall38 = cloneBox(basicWall2);
	wall38.position.x += 4;
	wall38.position.z -= 20.5;
	wall38.scale.set(1,1,3);
	scene.add(wall38);
	wall39 = cloneBox(basicWall2);
	wall39.position.x += 7.5;
	wall39.position.z += 12.5;
	wall39.scale.set(1,1,2.8);
	scene.add(wall39);
	wall40 = cloneBox(basicWall2);
	wall40.position.x += 7;
	wall40.position.z -= 12.5;
	wall40.scale.set(1,1,6);
	scene.add(wall40);
	wall41 = cloneBox(basicWall2);
	wall41.position.x += 11;
	wall41.position.z -= 10.5;
	wall41.scale.set(1,1,5.5);
	scene.add(wall41);
	wall42 = cloneBox(basicWall2);
	wall42.position.x += 11;
	wall42.position.z += 9;
	wall42.scale.set(1,1,2.5);
	scene.add(wall42);
	wall43 = cloneBox(basicWall2);
	wall43.position.x += 14.5;
	wall43.position.z -= 9;
	wall43.scale.set(1,1,10);
	scene.add(wall43);
	wall44 = cloneBox(basicWall2);
	wall44.position.x += 25;
	wall44.position.z += 15.5;
	wall44.scale.set(1,1,3);
	scene.add(wall44);
}

function cloneBox(object){
	var clone = new Physijs.BoxMesh(object.clone().geometry, object.material, object.mass);
	clone.visible = false;
	return clone;
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
