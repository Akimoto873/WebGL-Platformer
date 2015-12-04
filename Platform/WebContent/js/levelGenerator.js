// Essentials
function loadAssets() {
	// LOAD FLARE ANIMATION AND SPRITE
	var flareAnimTexture = new THREE.ImageUtils.loadTexture(
			'images/animation/flare_sprite.png');
	flareAnimation = new textureAnimator(flareAnimTexture, 4, 1, 4, 15); // texture,
																			// #horiz,
																			// #vert,
																			// #total,
																			// duration.
	var flareSpriteMaterial = new THREE.SpriteMaterial({
		map : flareAnimTexture,
		side : THREE.DoubleSide,
		transparent : true
	});
	flareSprite = new THREE.Sprite(flareSpriteMaterial);
	flareSprite.scale.set(6, 6, 6);
}

// Create a FLARE LIGHT
function createLight(x, y, z) {
	// Light settings
	var lightIntensity = 25;
	var lightDistance = 5;
	var lightColor = 0xff6666;

	// Create light
	var myLight = new THREE.PointLight(lightColor, lightIntensity,
			lightDistance);
	myLight.castShadow = true;
	myLight.shadowCameraNear = 0.1;
	myLight.shadowCameraFar = 30;
	myLight.shadowMapWidth = 32;
	myLight.shadowMapHeight = 32;
	myLight.shadowBias = 0.04;
	myLight.shadowDarkness = 0.5;

	// Add flare sprite with animation to flare
	var flareAnim = flareSprite.clone();
	myLight.add(flareAnim);

	// Returns the light
	return myLight;
}

// Generates level 1.
function generateLevel1() {

	// Load assets
	loadAssets();

	// OBJ MTL Loader
	THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
	var objLoader = new THREE.OBJMTLLoader();

	// Load Level 1
	objLoader.load('models/level_01/level_01.obj',
			'models/level_01/level_01.mtl', level1LoadedCallback);

	// Load Flare
	objLoader.load('models/objects/flare/flare.obj',
			'models/objects/flare/flare.mtl', flareLoadedCallback);

	// Load Flare Box
	objLoader.load('models/objects/flare_box/flare_box.obj',
			'models/objects/flare_box/flare_box.mtl', flareBoxLoadedCallback);

	// Lights
	// ambientLight = new THREE.AmbientLight(0xd3d3d3);
	ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	trapTexture = textureLoader.load('images/crushers.jpg');

	// JSON Loader
	var loader = new THREE.JSONLoader();
	// loader.load('models/char.js', characterLoadedCallback);
	// loader.load('models/level_01.js', level1loadedCallback);
	loader.load('models/trap.js', trapLoadedCallback);

	// loader.load('models/cone.js', coneLoadedCallback);
	// loader.load('models/cones.js', conesLoadedCallback);

	var exitTexture = textureLoader.load('images/exit.jpg');
	exitMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
		map : exitTexture
	}), 0.4, 0.8);
	var crushingTexture = textureLoader.load('images/crushing.jpg');
	crushingMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
		map : crushingTexture
	}), 0.4, 0.8);

	/*
	 * var lightHeight = 4.4; createLight(0,lightHeight, -2);
	 * createLight(5,lightHeight, -2); createLight(9,lightHeight, -4);
	 * createLight(12.5,lightHeight, 5); createLight(12.5,lightHeight, 12);
	 * createLight(12.5,lightHeight, 16); createLight(12.5,lightHeight, 20);
	 * createLight(12.5,lightHeight, -2); createLight(12.5,lightHeight, -12);
	 * createLight(12.5,lightHeight, -23.5); createLight(9,lightHeight, -15.5);
	 * createLight(0,lightHeight, -20); createLight(-5,lightHeight, 5);
	 * createLight(2.5,lightHeight, -11); createLight(5.4,lightHeight, -20);
	 */

	// Level Collision
	floor = new Physijs.BoxMesh(new THREE.BoxGeometry(100, 1, 100), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false
			}), 1, 0.2), 0);
	floor.position.y -= 2.25;
	scene.add(floor);

	roof = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 1, 50), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false
			}), 0.9, 0.2), 0);
	roof.position.y += 6;
	scene.add(roof);

	var basicWall1 = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 6, 0.2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x22ee44
			}), 0.0, 0.1), 0);

	addWall(basicWall1, 3.5, 3.9, 3.5, 1, 1);
	addWall(basicWall1, 0, 7.4, 3.5, 1, 1);
	addWall(basicWall1, 2, -7.5, 1, 1, 1);
	addWall(basicWall1, 2, -15, 1, 1, 1);
	addWall(basicWall1, 7, -10.5, 1.6, 1, 1);
	addWall(basicWall1, -10, -25, 12, 1, 1);
	addWall(basicWall1, 1.8, 10.5, 1, 1, 1);
	addWall(basicWall1, 20, 11, 2.8, 1, 1);
	addWall(basicWall1, 16.5, 14.5, 2.8, 1, 1);
	addWall(basicWall1, 18, 18, 3.5, 1, 1);
	addWall(basicWall1, 4, 21.5, 11, 1, 1);
	addWall(basicWall1, 0, 25, 15, 1, 1);
	addWall(basicWall1, -5.2, 14.5, 1, 1, 1);
	addWall(basicWall1, -5.4, 18, 2.8, 1, 1);
	addWall(basicWall1, -24, 21.5, 1, 1, 1);
	addWall(basicWall1, -12.5, 7.5, 0.8, 1, 1);
	addWall(basicWall1, -16.5, 0, 0.8, 1, 1);
	addWall(basicWall1, -20, -4, 0.8, 1, 1);
	addWall(basicWall1, -12.5, -14, 1, 1, 1);
	addWall(basicWall1, -11, -17.8, 1.8, 1, 1);
	addWall(basicWall1, -18, -21.5, 1.8, 1, 1);

	var basicWall2 = new Physijs.BoxMesh(new THREE.BoxGeometry(0.2, 6, 4),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x554444
			}), 0.0, 0.1), 0);
	addWall(basicWall2, -3.5, -12, 1, 1, 8);
	addWall(basicWall2, -7, -3, 1, 1, 9);
	addWall(basicWall2, -11, 2, 1, 1, 8);
	addWall(basicWall2, -11, -23.5, 1, 1, 1);
	addWall(basicWall2, -14.5, 16.2, 1, 1, 2.5);
	addWall(basicWall2, -14.5, 5.2, 1, 1, 1);
	addWall(basicWall2, -14.5, -6.5, 1, 1, 3.4);
	addWall(basicWall2, -14.5, -19.8, 1, 1, 0.9);
	addWall(basicWall2, -18, 10, 1, 1, 5.5);
	addWall(basicWall2, -18, -11, 1, 1, 3.5);
	addWall(basicWall2, -21.5, 0, 1, 1, 10);
	addWall(basicWall2, -25, 0, 1, 1, 12);
	addWall(basicWall2, -3.5, 12, 1, 1, 1);
	addWall(basicWall2, 0, 14.5, 1, 1, 2);
	addWall(basicWall2, 3.5, 14.5, 1, 1, 2);
	addWall(basicWall2, 0, -11, 1, 1, 2);
	addWall(basicWall2, 4, -3.5, 1, 1, 2);
	addWall(basicWall2, 4, -20.5, 1, 1, 3);
	addWall(basicWall2, 7.5, 12.5, 1, 1, 2.8);
	addWall(basicWall2, 7, -11.5, 1, 1, 6);
	addWall(basicWall2, 11, -10.5, 1, 1, 5.5);
	addWall(basicWall2, 11, 9, 1, 1, 2.5);
	addWall(basicWall2, 14.5, -9, 1, 1, 10);
	addWall(basicWall2, 25, 15.5, 1, 1, 3);

	// Crate Object
	crates[0] = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5, 1, 1.5),
			crateMaterial, 15);
	moveableObjects.push(crates[0]);
	crates[0].position.x = cratePosition.x;
	crates[0].position.y = cratePosition.y;
	crates[0].position.z = cratePosition.z;
	crates[0].addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == trap || other_object == trap2) {
			crates[0].setLinearVelocity(new THREE.Vector3(0, 0, 0));
			scene.remove(crates[0]);
			crates[0].position.x = 9;
			crates[0].position.z = -12;
			scene.add(crates[0]);

		}
	});
	scene.add(crates[0]);
	pickUpItems.push(crates[0]);

	// Exit Sign
	exitSign = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 1, 2),
			exitMaterial, 0);
	exitSign.position.x += 24.5;
	exitSign.position.z += 23.2;
	exitSign.position.y += 3;
	scene.add(exitSign);

	crushingSign = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 1, 2),
			crushingMaterial, 0);
	crushingSign.position.x -= 10.6;
	crushingSign.position.z += 16.5;
	crushingSign.position.y += 3;
	scene.add(crushingSign);

	exit = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 6, 3), Physijs
			.createMaterial(new THREE.MeshPhongMaterial({
				color : 0x00ff00,
				emissive : 0x10ff10,
				shininess : 100,
				opacity : 0.5
			})), 0);
	exit.position.x += 25;
	exit.position.z += 23.2;
	scene.add(exit);
	exit.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == charMesh) {
			levelComplete();
		}
	});

	scene.traverse(function(node) {

		if (node instanceof Physijs.BoxMesh) {

			// insert your code here, for example:
			objects.push(node);
		}

	});

}

level2Trap1Triggered = false;
level2Trap2TargetSpeed = 2.5;
level2Trap2TargetSpeed_2 = 3.5;
level2Trap2TargetSpeed_3 = 3;

// Generates level 2
function generateLevel2() {
	// OBJ MTL Loader
	THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
	var objLoader = new THREE.OBJMTLLoader();

	// Load Level 2
	objLoader.load('models/level_02/level_02.obj',
			'models/level_02/level_02.mtl', level2LoadedCallback);

	// Load Flare
	objLoader.load('models/objects/flare/flare.obj',
			'models/objects/flare/flare.mtl', flareLoadedCallback);

	// Load Flare Box
	objLoader.load('models/objects/flare_box/flare_box.obj',
			'models/objects/flare_box/flare_box.mtl', flareBoxLoadedCallback);
	
	objLoader.load('models/objects/trap_blade/trap_blade.obj', 'models/objects/trap_blade/trap_blade.mtl', trapBladeLoadedCallback);

	
	
	createLevel2Floors();

	// Lights
	var ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	var basicWall1 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 30, 2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x22ee44
			}), 0.0, 0.1), 0);
	addWall(basicWall1, 2, -8.2, 2.2, 1, 2);
	addWall(basicWall1, 5.8, -3.6, 2.2, 1, 2.4);
	addWall(basicWall1, 16.6, -3.6, 3.2, 1, 2.4);
	addWall(basicWall1, 17.4, -8.2, 2.2, 1, 2.4);
	addWall(basicWall1, 15.4, -18, 0.2, 1, 7.2);
	addWall(basicWall1, 4.2, -14.8, 0.2, 1, 9.2);
	addWall(basicWall1, -7.20, 5.80, 6.60, 1, 2.20);
	addWall(basicWall1, -9.20, 10.20, 4.40, 1, 2.20);
	addWall(basicWall1, 16.60, 10.20, 9.00, 1, 2.20);
	addWall(basicWall1, 14.60, 5.80, 11.00, 1, 2.20);
	addWall(basicWall1, -11.60, -10.20, 2.20, 1, 15.20);
	addWall(basicWall1, -7.00, -12.60, 2.20, 1, 6.80);
	addWall(basicWall1, -18.60, -5.00, 0.60, 1, 23.00);
	addWall(basicWall1, -15.40, -25.60, 4.60, 1, 0.40);
	addWall(basicWall1, 2.00, -24.60, 13.20, 1, 0.40);
	addWall(basicWall1, 17.00, -28.20, 3.00, 1, 3.20);
	addWall(basicWall1, 27.80, -28.20, 3.00, 1, 3.20);
	addWall(basicWall1, 22.40, -30.00, 3.00, 1, 0.40);
	addWall(basicWall1, 30.40, -18.40, 1.20, 1, 9.00);
	addWall(basicWall1, 33.20, -5.40, 8.40, 1, 5.20);
	addWall(basicWall1, 39.00, 8.80, 1.00, 1, 9.20);
	addWall(basicWall1, 36.00, 21.60, 2.20, 1, 5.20);
	addWall(basicWall1, 4.00, 21.60, 25.60, 1, 5.20);
	addWall(basicWall1, 31.00, 26.00, 3.00, 1, 0.60);
	addWall(basicWall1, 25.20, 1.80, 0.40, 1, 1.80);
	var stoppingWall = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x22ee44
			}), 0.0, 0.1), 0);
	stoppingWall.position.set(16.6, 3, 14.4);
	stoppingWall.scale.set(1.40, 1, 1.60);
	scene.add(stoppingWall);
	doorway = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x22ee44, visible : false
			}), 0.0, 0.1), 0);
	doorway.position.set(9.80, 3, -23.60);
	doorway.scale.set(2.60,1,0.60);
	scene.add(doorway);
	objLoader.load('models/objects/doorway/doorway.obj', 'models/objects/doorway/doorway.mtl', doorwayLoadedCallback);

	// Crate Object
	for (var i = 0; i < 4; i++) {
		var temp = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5, 1, 1.5),
				crateMaterial, 15);
		moveableObjects.push(temp);
		temp.position.x = -12;
		temp.position.y = 1 + i;
		temp.position.z = -22 + 2 * i;
		// crates[i].addEventListener('collision', function(other_object,
		// relative_velocity, relative_rotation, contact_normal) {
		// if (other_object == trap || other_object == trap2) {
		// crates[i].setLinearVelocity(new THREE.Vector3(0, 0, 0));
		// scene.remove(crates[i]);
		// crates[i].position.x = -12;
		// crates[i].position.y = 1 + i;
		// crates[i].position.z = -20 + i;
		// scene.add(crates[i]);
		//	
		// }
		// });
		scene.add(temp);
		pickUpItems.push(temp);
		crates.push(temp);
	}

	createLevel2Traps();
	objLoader.load('models/objects/trap_spikes/trap_spikes.obj', 'models/objects/trap_spikes/trap_spikes.mtl', trapSpikesLoadedCallback);

	scene.traverse(function(node) {

		if (node instanceof Physijs.BoxMesh) {

			objects.push(node);
		}

	});
	level = 2;
	if (ambience != null) {
		ambience.pause();
	}
	ambience2.play();

}

// Called when level 1 model is loaded.
function level1LoadedCallback(object) {
	// Add shadows
	object.traverse(function(node) {
		if (node instanceof THREE.Mesh) {
			node.castShadow = true;
			node.receiveShadow = true;
		}
	});

	object.material = new THREE.MeshPhongMaterial({
		color : 0x555555,
		specular : 0xffffff,
		shininess : 50
	});

	// Set position and scale
	object.scale.set(1, 1.8, 1);
	object.position.y += 1.4;

	// Add to scene
	scene.add(object);
	levelObject = object;

	/* TODO: Move this somewhere else? */
	// loadingScreen = false;
	// removeLoadingScreen();
}

// Called when level 1 model is loaded.
function level2LoadedCallback(object) {
	// Add shadows
	object.traverse(function(node) {
		if (node instanceof THREE.Mesh) {
			node.castShadow = true;
			node.receiveShadow = true;
		}
	});

	// Set level object
	levelObject = object;
	// Add to scene
	scene.add(object);
}

// Adds a new wall with the specified position and scale
function addWall(object, wallX, wallZ, wallScaleX, wallScaleY, wallScaleZ) {
	wall = cloneBox(object);
	wall.position.x += wallX;
	wall.position.z += wallZ;
	wall.scale.set(wallScaleX, wallScaleY, wallScaleZ);
	wall.visible = false;
	scene.add(wall);
}

// Clones a physijs boxmesh
function cloneBox(object) {
	var clone = new Physijs.BoxMesh(object.clone().geometry, object.material,
			object.mass);
	clone.visible = false;
	return clone;
}

// Generates level 3 (testlevel).
function generateLevel3() {
	floor = new Physijs.BoxMesh(new THREE.BoxGeometry(100, 1, 100), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : true,
				opacity : 0.5
			}), 0.99, 0.2), 0);
	floor.position.y -= 2.25;
	scene.add(floor);
	crate = new Physijs.BoxMesh(new THREE.BoxGeometry(3, 2, 3), crateMaterial,
			15);
	moveableObjects.push(crate);
	pickUpItems.push(crate);
	crate.position.x += 9;
	crate.position.z -= 12;
	scene.add(crate);
}

// Called when trap model is loaded.
function trapLoadedCallback(geometry) {
	tile = new Physijs.BoxMesh(new THREE.BoxGeometry(3, 0.1, 4), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x554444
			}), 0.0, 0.1), 0);
	tile.position.x -= 9;
	tile.position.y -= 1.8;
	scene.add(tile);
	trap = new Physijs.BoxMesh(new THREE.BoxGeometry(3, 1, 8), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x554444
			}), 0.0, 0.1), 100);
	trap.position.x -= 9;
	trap.position.y += 4;
	scene.add(trap);
	trap.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == charMesh) {
			takeDamage(100);
		}
	});
	trap.material.visible = false;
	trap.setLinearFactor(new THREE.Vector3(0, 0, 0));
	trap.setAngularFactor(new THREE.Vector3(0, 0, 0));
	trapCaster = new THREE.Raycaster();
	trapCaster.set(new THREE.Vector3(tile.position.x, tile.position.y,
			tile.position.z + 2), new THREE.Vector3(0, 1, 0));
	tile2 = new Physijs.BoxMesh(new THREE.BoxGeometry(3, 0.1, 3), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x554444
			}), 0.0, 0.1), 0);
	tile2.position.x -= 20;
	tile2.position.z += 4
	tile2.position.y -= 2.55;
	scene.add(tile2);
	trap2 = new Physijs.BoxMesh(new THREE.BoxGeometry(2.5, 6, 0.1), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x224444,
				visible : false
			}), 0.0, 0.1), 10);
	trap2.position.x -= 20;
	trap2.position.z += 24.5;
	trap2.position.y += 1.5;
	scene.add(trap2);
	trap2.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == charMesh) {
			takeDamage(100);
		}
	});
	trap2.setAngularFactor(new THREE.Vector3(0, 0, 0));
	trap2.setLinearFactor(new THREE.Vector3(0, 0, 1));
	trapCaster2 = new THREE.Raycaster();
	trapCaster2.set(tile2.position, new THREE.Vector3(0, 1, 0));
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

// Runs after Flare item geometry is loaded
function flareLoadedCallback(object) {
	// coneGeometry = object;
	// ASDSA
	var col_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
		color : 0xFFFF00,
		visible : false
	}), .8, // high friction
	.4 // low restitution
	);

	// Add physics box around the object
	coneGeometry = new Physijs.BoxMesh(new THREE.BoxGeometry(0.18, 0.18, 0.8),
			col_material, 0 // mass
	);

	object.rotation.set(Math.PI / 2, 0, 0);

	coneGeometry.add(object);
}

// Runs after Flare Box item geometry is loaded
function flareBoxLoadedCallback(object) {
	// ASDSA
	var col_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
		color : 0xFFFFFF,
		visible : false
	}), 1, // high friction
	.1 // low restitution
	);

	// Add physics box around the object
	cones = new Physijs.BoxMesh(new THREE.CubeGeometry(0.4, 0.32, 0.2),
			col_material, 10 // mass
	);

	object.scale.set(0.4, 0.4, 0.4);
	object.position.y += 0.04;

	cones.add(object);
	scene.add(cones);
	pickUpItems.push(cones);
}

function trapBladeLoadedCallback(object){
	object.scale.set(0.3,0.4,0.2);
	object.position.y -= 4;
	var blade1 = object.clone();
	var blade2 = object.clone();
	level2Trap2_1.add(blade1);
	level2Trap2_2.add(blade2);
	level2Trap2_3.add(object);
}

function doorwayLoadedCallback(object){
	object.scale.set(0.3, 0.6, 0.6);
	object.position.y -= 3;
	doorway.add(object);
}

function trapSpikesLoadedCallback(object){
	object.scale.set(0.5,0.5,0.5);
	var clone1 = object.clone();
	var clone2 = object.clone();
	var clone3 = object.clone();
	clone1.position.z += 5;
	clone2.position.z -= 5;
	clone3.position.z -= 0;
	level2Trap1.add(clone1);
	level2Trap1.add(clone2);
	level2Trap1.add(clone3);
}

// Texture Animation Function:
// Returns an object that can be added to scene, and must be updated in order to
// animate
function textureAnimator(textureSource, tileHori, tileVert, tileNumber,
		tileDisplayDuration) {
	// Number of horizontal tiles
	this.tilesHorizontal = tileHori;

	// Number of vertical tiles
	this.tilesVertical = tileVert;

	// Texture wrapping
	textureSource.wrapS = textureSource.wrapT = THREE.RepeatWrapping;
	textureSource.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

	// Number of tiles we want to animate
	this.numberOfTiles = tileNumber;

	// The time each tile should be displayed
	this.tileDisplayDuration = tileDisplayDuration;

	// Current Tile (being displayed)
	this.currentTile = 0;

	// Tile display time
	this.currentDisplayTime = 0;

	// Update animation (must run in an update function, and should take
	// update(delta * 1000) )
	this.update = function(milliSec) {
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration) {
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile === this.numberOfTiles) {
				this.currentTile = 0;
			}
			var currentColumn = this.currentTile % this.tilesHorizontal;
			textureSource.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math
					.floor(this.currentTile / this.tilesHorizontal);
			textureSource.offset.y = currentRow / this.tilesVertical;
		}
	};

}

function createLevel2Floors(){
	// Collision
	floor1 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);

	floor1.position.set(7.8, -0.5, -3.8);
	floor1.scale.set(12.5, 1, 20.2);
	scene.add(floor1);
	
	floor2 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);

	floor2.position.set(-14.8, -0.5, -3.8);
	floor2.scale.set(5.6, 1, 20.2);
	scene.add(floor2);
	floor3 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);

	floor3.position.set(-7, -0.5, -1);
	floor3.scale.set(2.5, 1, 18.2);
	scene.add(floor3);
	floor4 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);

	floor4.position.set(27.2, -0.5, -3.8);
	floor4.scale.set(2.2, 1,20.2 );
	scene.add(floor4);
	
	floor5 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);

	floor5.position.set(36.2, -0.5, 8.2);
	floor5.scale.set(2.2, 1, 10.2);
	scene.add(floor5);
	floor6 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);
	floor6.position.set(31.8, -0.5, 18.8);
	floor6.scale.set(2.2, 1, 10.2);
	scene.add(floor6);
	floor7 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);
	floor7.position.set(31.6, -0.5, 1.6);
	floor7.scale.set(2.2, 1, 2.6);
	scene.add(floor7);
	floor8 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);
	floor8.position.set(22.6, -0.5, -25.4);
	floor8.scale.set(2.2, 1, 5.2);
	scene.add(floor8);
	floor9 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false,
				opacity : 1
			}), 0.99, 0.2), 0);
	floor9.position.set(22.6, -0.5, 0.8);
	floor9.scale.set(2.6, 1, 16);
	scene.add(floor9);
}

function createLevel2Traps() {
	level2Trap1 = new Physijs.BoxMesh(new THREE.BoxGeometry(5, 1, 15), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x332255, visible : false
			}), 0.0, 0.1), 20);
	level2Trap1.position.x = -16;
	level2Trap1.position.y = 9;
	level2Trap1.position.z = 0;
	level2Trap1.addEventListener('collision', function(other_object) {
		if (other_object == floor2) {
			level2Trap1Triggered = true;
		} else if (other_object == charMesh) {
			takeDamage(100);
		}
	})
	scene.add(level2Trap1);
	level2Trap1.setLinearFactor(new THREE.Vector3(0, 0, 0));
	level2Trap1.setAngularFactor(new THREE.Vector3(0, 0, 0));

	for (var i = 0; i < 3; i++) {
		lasers[i] = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.05,
				0.05, 5, 8), Physijs.createMaterial(new THREE.MeshBasicMaterial(
				{
					color : 0xff0000
				}), 0.0, 0.0), 0);
		lasers[i].position.x = -16;
		lasers[i].position.y = 0.5;
		lasers[i].position.z = -6 * i + 5;
		lasers[i].rotation.z = Math.PI / 2;
		lasers[i]._physijs.collision_flags = 4;
		lasers[i].addEventListener('collision', function(other_object) {
			if (other_object == charMesh) {
				scene.remove(level2Trap1);
				scene.add(level2Trap1);
				level2Trap1.setLinearFactor(new THREE.Vector3(0, 1, 0));
				level2Trap1.setAngularFactor(new THREE.Vector3(0, 0, 0));

			}
		})
		scene.add(lasers[i]);
	}

	level2Trap2_1 = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.1,
			0.1, 8, 8), Physijs.createMaterial(new THREE.MeshBasicMaterial({
		color : 0xff0000, visible:false
	}), 0.0, 0.0), 10);
	level2Trap2_1.position.z = -8;
	level2Trap2_1.position.y = 5;
	level2Trap2_1.position.x = 10;
	scene.add(level2Trap2_1);
	var level2Trap2Constraint = new Physijs.HingeConstraint(level2Trap2_1, 
	null, 
	new THREE.Vector3(10, 10, -8), 
	new THREE.Vector3(0, 0, 1) 
	);
	scene.addConstraint(level2Trap2Constraint);
	level2Trap2Constraint.setLimits(-Math.PI / 3, 
	Math.PI / 3, // maximum angle of motion, in radians
	0.1, // applied as a factor to level2Trap2Constraint error
	0.0 // controls bounce at limit (0.0 == no bounce)
	);
	level2Trap2Constraint.enableAngularMotor(level2Trap2TargetSpeed, 10);
	level2Trap2_1.addEventListener('collision', function(other_object) {
		if (other_object == charMesh) {
			takeDamage(40);
		} else {
			level2Trap2TargetSpeed = -level2Trap2TargetSpeed;
			level2Trap2Constraint
					.enableAngularMotor(level2Trap2TargetSpeed, 10);
		}
	});

	level2Trap2_2 = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.1,
			0.1, 8, 8), Physijs.createMaterial(new THREE.MeshBasicMaterial({
		color : 0xff0000, visible:false
	}), 0.0, 0.0), 10);
	level2Trap2_2.position.z = -12;
	level2Trap2_2.position.y = 5;
	level2Trap2_2.position.x = 10;
	scene.add(level2Trap2_2);
	var level2Trap2Constraint_2 = new Physijs.HingeConstraint(level2Trap2_2, 
	null, 
	new THREE.Vector3(10, 10, -11), 
	new THREE.Vector3(0, 0, 1)
	);
	scene.addConstraint(level2Trap2Constraint_2);
	level2Trap2Constraint_2.setLimits(-Math.PI / 3, // minimum angle of motion,
													// in radians
	Math.PI / 3, // maximum angle of motion, in radians
	0.1, // applied as a factor to level2Trap2Constraint error
	0.0 // controls bounce at limit (0.0 == no bounce)
	);
	level2Trap2Constraint_2.enableAngularMotor(level2Trap2TargetSpeed_2, 10);
	level2Trap2_2.addEventListener('collision', function(other_object) {
		if (other_object == charMesh) {
			takeDamage(40);
		} else {
			level2Trap2TargetSpeed_2 = -level2Trap2TargetSpeed_2;
			level2Trap2Constraint_2.enableAngularMotor(
					level2Trap2TargetSpeed_2, 10);
		}
	});

	level2Trap2_3 = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.1,
			0.1, 8, 8), Physijs.createMaterial(new THREE.MeshBasicMaterial({
		color : 0xff0000, visible:false
	}), 0.0, 0.0), 10);
	level2Trap2_3.position.z = -16;
	level2Trap2_3.position.y = 5;
	level2Trap2_3.position.x = 10;
	scene.add(level2Trap2_3);
	var level2Trap2Constraint_3 = new Physijs.HingeConstraint(
	level2Trap2_3, // First object to be constrained
	null, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
	new THREE.Vector3(10, 10, -14), // point in the scene to apply the Constraint
	new THREE.Vector3(0, 0, 1) // Axis along which the hinge lies 
	);
	scene.addConstraint(level2Trap2Constraint_3);
	level2Trap2Constraint_3.setLimits(-Math.PI / 3, // minimum angle of motion,
													// in radians
	Math.PI / 3, // maximum angle of motion, in radians
	0.1, // applied as a factor to level2Trap2Constraint error
	0.0 // controls bounce at limit (0.0 == no bounce)
	);
	level2Trap2Constraint_3.enableAngularMotor(level2Trap2TargetSpeed_3, 10);
	level2Trap2_3.addEventListener('collision', function(other_object) {
		if (other_object == charMesh) {
			takeDamage(40);
		} else {
			level2Trap2TargetSpeed_3 = -level2Trap2TargetSpeed_3;
			level2Trap2Constraint_3.enableAngularMotor(
					level2Trap2TargetSpeed_3, 10);
		}
	});
}
