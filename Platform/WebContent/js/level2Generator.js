// Variables
level2Trap1Triggered = false;
level2Trap2TargetSpeed = 2.5;
level2Trap2TargetSpeed_2 = -3;
level2Trap2TargetSpeed_3 = 3.5;


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
    createLevel2Walls();

    // Lights
    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);


    createJumpableDoor();
    objLoader.load('models/objects/giant_door/giant_door.obj', 'models/objects/giant_door/giant_door.mtl', giantDoorLoadedCallback);
    objLoader.load('models/objects/doorway_door/doorway_door.obj', 'models/objects/doorway_door/doorway_door.mtl', doorwayDoorLoadedCallback);
    objLoader.load('models/objects/lever_wooden/lever_wooden.obj', 'models/objects/lever_wooden/lever_wooden.mtl', leverLoadedCallback);
    doorway = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 2),
                    Physijs.createMaterial(new THREE.MeshBasicMaterial({
                            color : 0x22ee44, visible : false
                    }), 0.0, 0.1), 0);
    doorway.position.set(9.80, 3, -22.0);
    doorway.scale.set(5.5,1,0.60);
    scene.add(doorway);
    portal = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 2),
                    Physijs.createMaterial(new THREE.MeshBasicMaterial({
                            color : 0x22ee44, visible : true
                    }), 0.0, 0.1), 0);
    portal.position.set(9.80, 3, -23.50);
    portal.scale.set(2,1,0.60);
    scene.add(portal);
    objLoader.load('models/objects/doorway/doorway.obj', 'models/objects/doorway/doorway.mtl', doorwayLoadedCallback);
    createKeys();
    objLoader.load('models/objects/key/key.obj', 'models/objects/key/key.mtl', keyLoadedCallback);

    // Crate Objects
    for (var i = 0; i < 4; i++) {
            var temp = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5, 1, 1.5),
                            crateMaterial, 15);
            moveableObjects.push(temp);
            temp.position.x = -12;
            temp.position.y = 1 + i;
            temp.position.z = -22 + 2 * i;
            scene.add(temp);
            pickUpItems.push(temp);
            crates.push(temp);
    }
    hintCrate = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5, 1, 1.5),
                    crateMaterial, 15);
    moveableObjects.push(hintCrate);
    hintCrate.position.set(14,1,14.3);
    scene.add(hintCrate);
    crates.push(hintCrate);
    pickUpItems.push(hintCrate);

    loader = new THREE.JSONLoader();
    loader.load('models/objects/dung/dung.js', dung2LoadedCallback);

    createLevel2Traps();
    objLoader.load('models/objects/trap_spikes/trap_spikes.obj', 'models/objects/trap_spikes/trap_spikes.mtl', trapSpikesLoadedCallback);

    createZombieEnemy();
    objLoader.load('models/enemies/enemy_egyptian_mask/enemy_egyptian_mask.obj', 'models/enemies/enemy_egyptian_mask/enemy_egyptian_mask.mtl', enemyLoadedCallback);

    createPuzzle();
    createGroundSpikes();
    
    objLoader.load('models/objects/trap_spikes_ground/bloody/trap_spikes_ground_bloody.obj', 'models/objects/trap_spikes_ground/bloody/trap_spikes_ground_bloody.mtl', groundSpikesBloodyLoadedCallback);
    objLoader.load('models/objects/trap_spikes_ground/normal/trap_spikes_ground.obj', 'models/objects/trap_spikes_ground/normal/trap_spikes_ground.mtl', groundSpikesLoadedCallback);
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


//Called when level 2 model is loaded.
function level2LoadedCallback(object) {
    
    // Shadows are not used, as we do not actively use lights
    object.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = false;
            node.receiveShadow = false;
        }
    });

    // Set level object
    levelObject = object;
    
    // Add to scene
    scene.add(object);
}


//Runs when the model for the blades of the pendulum traps are loaded.
function trapBladeLoadedCallback(object){
    object.scale.set(0.2,0.4,0.2);
    object.position.y -= 3;
    var blade1 = object.clone();
    var blade2 = object.clone();
    level2Trap2_1.add(blade1);
    level2Trap2_2.add(blade2);
    level2Trap2_3.add(object);
}


//Runs when the doorway for the level 2 exit is loaded.
function doorwayLoadedCallback(object){
    object.scale.set(0.82,0.6,1);
    object.position.x = doorway.position.x;
    object.position.y = doorway.position.y - 3;
    object.position.z = doorway.position.z;
    scene.add(object);
}


//Runs when the model for the falling spike trap in level 2 is loaded.
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


//Generates the collectible keys for level 2
function createKeys(){
    keySound = new Audio('audio/270408__littlerobotsoundfactory__pickup-gold-00.mp3');
    keySound.volume = 0.5;
    keySound.addEventListener('ended', function(){
            this.currentTime = 0;
    });

    key1 = new Physijs.BoxMesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 0.99, 0.2), 0.1);
    key1.position.set(-7, 4, -22);
    scene.add(key1);
    key1.setLinearFactor(new THREE.Vector3(0,0,0));
    key1.setAngularVelocity(new THREE.Vector3(0,1,0));
    key1.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            keySound.play();
            scene.remove(key1);
            keysPickedUp += 1;
        }
    });
    key2 = new Physijs.BoxMesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 0.99, 0.2), 0.1);
    key2.position.set(22.4, 4, -17.8);
    scene.add(key2);
    key2.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            keySound.play();
            scene.remove(key2);
            keysPickedUp += 1;
        }
    });
    key2.setLinearFactor(new THREE.Vector3(0,0,0));
    key2.setAngularVelocity(new THREE.Vector3(0,1,0));
    key3 = new Physijs.BoxMesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 0.99, 0.2), 0.1);
    key3.position.set(31.6, 4, 6.4);
    scene.add(key3);
    key3.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            keySound.play();
            scene.remove(key3);
            keysPickedUp += 1;
        }
    });
    key3.setLinearFactor(new THREE.Vector3(0,0,0));
    key3.setAngularVelocity(new THREE.Vector3(0,1,0));
}

//Runs when the model for the keys in level 2 is loaded.
function keyLoadedCallback(object){
	object.scale.set(0.3,0.3,0.3);
	var key1Skin = object.clone();
	var key2Skin = object.clone();
	var key3Skin = object.clone();
	key1.add(key1Skin);
	key2.add(key2Skin);
	key3.add(key3Skin);
}

var lever;

//Creates the door and lever that players have to jump over in level 2.
function createJumpableDoor(){
	jumpableDoor = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x22ee44, visible:false
			}), 0.0, 0.1), 20);
	jumpableDoor.position.set(16.6, 3, 14.3);
	jumpableDoor.scale.set(1, 1, 1.60);
	scene.add(jumpableDoor);
	jumpableDoor.setLinearFactor(new THREE.Vector3(0,1,0));
	jumpableDoor.setAngularFactor(new THREE.Vector3(0,0,0));
	lever = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), 
			new THREE.MeshBasicMaterial({
				color : 0xee3355, visible : false
			}));
	lever.position.set(19, 2, 12.8);
	scene.add(lever);
}

//Runs when the door model for the exit in level 2 is loaded.
function doorwayDoorLoadedCallback(object){
	
	clone2 = object.clone();
	
	clone2.position.y -= 3;
	clone2.position.x += 0.03;
	clone2.scale.set(0.16, 0.6, 3);
	doorway.add(clone2);
}

//Runs when the door model for the jumpable door in level 2 is loaded.
function giantDoorLoadedCallback(object){
	clone1 = object.clone();
	clone1.rotation.y += Math.PI/2;
	clone1.position.y -= 3;
	clone1.scale.set(0.48,0.7,1.5);
	jumpableDoor.add(clone1);
}

function leverLoadedCallback(object){
	object.scale.set(0.3,0.3,0.3);
	object.position.z -= 0.9;
	object.rotation.x -= Math.PI/6;
	lever.add(object);
}

var puzzlePoints = [];
var puzzle;
var puzzleLightOnTexture;
var puzzleLightOffTexture;

//Creates the "lights on!" puzzle in level 2.
function createPuzzle(){
	var puzzleTexture = textureLoader.load('images/lightwall/lightwall_texture.jpg');
  puzzleMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
          map : puzzleTexture
  }), 0.4, 0.8);
  puzzleLightOnTexture = textureLoader.load('images/lightwall/on_state.png');
  puzzleLightOnTexture.name = "puzzleLightOnTexture";
  puzzleLightOffTexture = textureLoader.load('images/lightwall/off_state.png');
  puzzleLightOffTexture.name = "puzzleLightOffTexture";
  puzzleLightMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
          map : puzzleLightOffTexture
  }), 0.4, 0.8);
  
	puzzleSound = new Audio('audio/162473__kastenfrosch__successful.mp3');
	puzzleCaster = new THREE.Raycaster();
	puzzle = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 2),
			puzzleMaterial, 0);
	puzzle.position.set(-4.8, 3, -22);
	puzzle.scale.set(0.2, 1, 2.2);
	scene.add(puzzle);
	var puzzlePoint = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8), 
			new THREE.MeshBasicMaterial());
	puzzlePoint.position.x = -4.8;
	puzzlePoint.position.y = 3;
	puzzlePoint.position.z = -22;
	puzzlePoint.position.x += 0.3;
	puzzlePoint.position.z -= 1;
	puzzlePoint.position.y -= 2;
	puzzlePoint.rotation.z += Math.PI / 2;
	var point = 0;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			point += 1;
			var clone = puzzlePoint.clone();
			clone.material = puzzleLightMaterial.clone();
			clone.position.y += (0.7 * i);
			clone.position.z += (0.7 * j);
			puzzlePoints.push(clone);
			scene.add(clone);
		}
	}
}
var platform1Velocity = -2;
var platform2Velocity = -2;
var platform3Velocity = -3;
var platform4Velocity = 2.5;
var spikeArray = [];

//Creates the spikes on the ground and the moving platforms in one of the keyrooms in level 2.
function createGroundSpikes(){
	for(var i = 0; i < 5; i++){
		for(var j = 0; j<3; j++){
			if((i<2 && j == 1) || (i == 3 && (j == 0 || j == 2)) || (i==2) || (i == 4)){ //generates the correct pattern.
				var spikes = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2),
						Physijs.createMaterial(new THREE.MeshBasicMaterial({
							color : 0x22ee44, visible:false
						}), 0.0, 0.1), 0);
				spikes.position.set(17.8 + (j*4.6), -0.6, -4 - (i * 4.6));
				spikes.scale.set(2, 1, 2);
				spikes.addEventListener('collision', function(other_object){
					if(other_object == charMesh){
						takeDamage(5);
					}
				});
				spikeArray.push(spikes);
				scene.add(spikes);
			}
		}
	}
	
	platform1 = new Physijs.BoxMesh(new THREE.BoxGeometry(2,0.2,2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x222222
			}), 1, 0.1), 100);
	platform1.position.set(22.40, 1.2, -3);
	scene.add(platform1);
	platform1.setLinearFactor(new THREE.Vector3(0,0,1));
	platform1.setAngularFactor(new THREE.Vector3(0,0,0));
	platform1.setLinearVelocity(new THREE.Vector3(0,0,platform1Velocity));
	platform2 = new Physijs.BoxMesh(new THREE.BoxGeometry(2,0.2,2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x222222
			}), 1, 0.1), 100);
	platform2.position.set(27, 1.2, -13);
	platform2.addEventListener('collision', function(other_object){
		if(other_object == platform3){
			platform2Velocity = -platform2Velocity;
		}
	})
	scene.add(platform2);
	platform2.setLinearFactor(new THREE.Vector3(0,0,1));
	platform2.setAngularFactor(new THREE.Vector3(0,0,0));
	platform2.setLinearVelocity(new THREE.Vector3(0,0,platform2Velocity));
	platform3 = new Physijs.BoxMesh(new THREE.BoxGeometry(2,0.2,2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x222222
			}), 1, 0.1), 100);
	platform3.position.set(22.40, 1.2, -22.4);
	platform3.addEventListener('collision', function(other_object){
		if(other_object == platform2 || other_object == platform4){
			platform3Velocity = -platform3Velocity;
		}
	});
	scene.add(platform3);
	platform3.setLinearFactor(new THREE.Vector3(1,0,0));
	platform3.setAngularFactor(new THREE.Vector3(0,0,0));
	platform3.setLinearVelocity(new THREE.Vector3(platform3Velocity,0,0));
	platform4 = new Physijs.BoxMesh(new THREE.BoxGeometry(2,0.2,2),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0x222222
			}), 1, 0.1), 100);
	platform4.position.set(17.8, 1.2, -22.4);
	platform4.addEventListener('collision', function(other_object){
		if(other_object == platform3){
			platform4Velocity = -platform4Velocity;
		}
	})
	scene.add(platform4);
	platform4.setLinearFactor(new THREE.Vector3(0,0,1));
	platform4.setAngularFactor(new THREE.Vector3(0,0,0));
	platform4.setLinearVelocity(new THREE.Vector3(0,0,platform4Velocity));
}

//Runs when the bloody spikes model for floor spikes in level 2 is loaded.
function groundSpikesBloodyLoadedCallback(object){
	object.scale.set(0.3,0.3,0.3);
	object.position.y += 0.2;
	clone1 = object.clone();
	clone3 = object.clone();
	
	clone5 = object.clone();
	
	clone7 = object.clone();
	clone8 = object.clone();
	
	clone10 = object.clone();
	spikeArray[0].add(clone1);
	spikeArray[2].add(clone3);
	
	spikeArray[4].add(clone5);
	
	spikeArray[6].add(clone7);
	spikeArray[7].add(clone8);
	
	spikeArray[9].add(clone10);
}

//Runs when the non-bloody spikes model for floor spikes in level 2 is loaded.
function groundSpikesLoadedCallback(object){
	object.scale.set(0.3,0.3,0.3);
	object.position.y += 0.2;
	
	clone2 = object.clone();
	clone4 = object.clone();
	clone6 = object.clone();
	clone9 = object.clone();
	
	
	spikeArray[1].add(clone2);
	spikeArray[3].add(clone4);
	spikeArray[5].add(clone6);
	spikeArray[8].add(clone9);
}

function createZombieEnemy(){
	zombie = new Physijs.CapsuleMesh(new THREE.CylinderGeometry(1, 1, 3, 8),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color: 0x0000ff, visible: false
			})), 10);
	zombie.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
		
		if(other_object == charMesh){
			takeDamage(30);
		}
		else if (contact_normal.y == 0){
			var temp = new THREE.Vector3(contact_normal.x, 0, contact_normal.z);
			zombieVelocityNormal.sub(temp);
			zombieVelocityNormal.normalize();
			
		}
	});
	zombie.position.set(30, 1, 12);
	
	scene.add(zombie);
	zombie.setAngularFactor(new THREE.Vector3(0,1,0));
	zombieSound = new Audio('audio/163439__under7dude__zombie-2.wav');
	zombieSound.addEventListener('ended', function(){
		this.currentTime = 0;
	});
	zombieSound.volume = 0.15;
}

function enemyLoadedCallback(object){
	object.scale.set(0.3,0.3,0.3);
	zombie.add(object);
}

// Creates the collision boxes for the floor in level 2 
function createLevel2Floors(){
    floor1 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);

    floor1.position.set(7.8, -0.5, -3.8);
    floor1.scale.set(12.5, 1, 20.2);
    scene.add(floor1);

    floor2 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);

    floor2.position.set(-14.8, -0.5, -3.8);
    floor2.scale.set(5.6, 1, 20.2);
    scene.add(floor2);
    floor3 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);

    floor3.position.set(-7, -0.5, -1);
    floor3.scale.set(2.5, 1, 18.2);
    scene.add(floor3);
    floor4 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);

    floor4.position.set(27.2, -0.5, -3.8);
    floor4.scale.set(2.2, 1,20.2 );
    scene.add(floor4);

    floor5 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);

    floor5.position.set(36.2, -0.5, 8.2);
    floor5.scale.set(2.2, 1, 10.2);
    scene.add(floor5);
    floor6 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);
    floor6.position.set(31.8, -0.5, 18.8);
    floor6.scale.set(2.2, 1, 10.2);
    scene.add(floor6);
    floor7 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);
    floor7.position.set(31.6, -0.5, 1.6);
    floor7.scale.set(2.2, 1, 2.6);
    scene.add(floor7);
    floor8 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);
    floor8.position.set(22.6, -0.5, -25.4);
    floor8.scale.set(2.2, 1, 5.2);
    scene.add(floor8);
    floor9 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 1, 2), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0xee2233,
            visible : false,
            opacity : 1
        }), 1, 0.2), 0);
    floor9.position.set(22.6, -0.5, 0.8);
    floor9.scale.set(2.6, 1, 16);
    scene.add(floor9);
}


// Create level 2 wall collision
function createLevel2Walls(){
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
}


// Creates the falling spike trap, and the pendulum blade traps in level 2.
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
        } else{
            for (var i = 0; i < crates.length; i++){
                if(other_object == crates[i]){
                    scene.remove(other_object);
                    pickUpItems.splice(i,1);
                }
            }

        }
    });
    
    scene.add(level2Trap1);
    level2Trap1.setLinearFactor(new THREE.Vector3(0, 0, 0));
    level2Trap1.setAngularFactor(new THREE.Vector3(0, 0, 0));

    for (var i = 0; i < 3; i++) {
        lasers[i] = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 8), 
            Physijs.createMaterial(new THREE.MeshBasicMaterial(
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
        });
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
            level2Trap2Constraint_2.enableAngularMotor(level2Trap2TargetSpeed_2, 10);
        }
    });

    level2Trap2_3 = new Physijs.CylinderMesh(new THREE.CylinderGeometry(0.1, 0.1, 8, 8), 
        Physijs.createMaterial(new THREE.MeshBasicMaterial({
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
            level2Trap2Constraint_3.enableAngularMotor(level2Trap2TargetSpeed_3, 10);
        }
    });
}


// Dung at level 2 callback
function dung2LoadedCallback(geometry){
    dungTexture = textureLoader.load('images/poop4.jpg');
    var dung = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshBasicMaterial({map: dungTexture}), 1, 0.1), 1);
    dung.scale.set(0.1, 0.1, 0.1);
    dung.position.set(-15.80, 1, -24.00);
    dung.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            dungCollected();
            scene.remove(this);
        }
    });
    scene.add(dung);
    dungs.push(dung);
    var dung = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshBasicMaterial({map: dungTexture}), 1, 0.1), 1);
    dung.scale.set(0.1, 0.1, 0.1);
    dung.position.set(31.80,1,23.00);
    dung.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            dungCollected();
            scene.remove(this);
        }
    });
    scene.add(dung);
    dungs.push(dung);
    var dung = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshBasicMaterial({map: dungTexture}), 1, 0.1), 1);
    dung.scale.set(0.1, 0.1, 0.1);
    dung.position.set(22.40,1,-26.80);
    dung.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            dungCollected();
            scene.remove(this);
        }
    });
    scene.add(dung);
    dungs.push(dung);
    var dung = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshBasicMaterial({map: dungTexture}), 1, 0.1), 1);
    dung.scale.set(0.1, 0.1, 0.1);
    dung.position.set(2.20,1,-12.40);
    dung.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            dungCollected();
            scene.remove(this);
        }
    });
    scene.add(dung);
    dungs.push(dung);
}