/**
 * 
 */
var mapW;
var mapH;
function generateLevel(maps){
	for(var i = 0; i < maps.length; i++){
		mapW = maps[i].length;
		for(var j = 0; j < maps[i].length; j++){
			mapH = maps[i][j].length;
			for(var k = 0; k < maps[i][j].length; k++){
				generateParts(k, i, j, maps[i][j][k]);
			}
		}
	}
}



function generateParts(x, y, z, i){
	if(i == 1){
		createFloor(x,y, z);
	}
	if(i == 2){
		createWall(x,y, z);
	}
	if(i == 3){
		createElevator(x,y,z);
	}
	if(i == 4){
		createIce(x, y, z);
	}
	if(i == 5){
		createIce(x, y, z);
		createPillar(x, y, z);
	}
	if(i == 6){
		createTargetTile(x, y, z);
	}
	if(i == 7){
		createFloor(x,y,z);
		createVerticalDoor(x,y,z);
	}
	if(i == 8){
		createFloor(x,y,z);
		createDung(x,y,z);
	}
	if(i == 9){
		createZPlatform(x,y,z);
	}
	if(i == 10){
		createXPlatform(x,y,z);
	}
	if(i == 11){
		createFloor(x,y,z);
		createYPlatform(x,y,z);
	}
	if(i == 12){
		createFloor(x,y,z);
		createExitPortal(x,y,z);
	}
	if(i == 13){
		createFloor(x,y,z);
		createFallingRoofTrapLaser(x,y,z);
	}
	if(i == 14){
		createFloor(x,y,z);
		createFallingRoofTrapPlate(x,y,z);
	}
	if(i == 15){
		createFloor(x,y,z);
		createEnemy(x,y,z);
	}
	if(i == 16){
		createFloor(x,y,z);
		createPendulumBlade(x,y,z);
	}
	if(i == 17){
		createKey(x,y,z);
	}
	if(i == 18){
		createFloor(x,y,z);
		createKey(x,y,z);
	}
	if(i == 19){
		createFloor(x,y,z);
		createLightsPuzzle(x,y,z);
	}
	if(i == 20){
		createFloor(x,y,z);
		createCrate(x,y,z);
	}
	if(i == 21){
		createFloor(x,y,z);
		createJumpableDoor(x,y,z);
	}
	if(i == 22){
		createFloor(x,y,z);
		createHealthBox(x,y,z);
	}
	if(i == 23){
		createFloor(x,y,z);
		createFallingRoofTrapPlateDoubleZ(x,y,z);
	}
	if(i == 24){
		createFloor(x,y,z);
		createHorizontalSpikeTrapZ(x,y,z);
	}
	if(i == 25){
		createFloor(x,y,z);
		createGroundSpike(x,y,z);
	}
	if(i != 3 && y != 2){
		createRoofTile(x,y,z);
	}
	
}

function createFloor(x,y, z){
	var floorPart = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE,1,UNITSIZE), 
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				map: floorTexture
			}),1, 0.1), 0);
	floorPart.position.set(UNITSIZE * x, y*WALLHEIGHT +0.5, UNITSIZE * z);
	scene.add(floorPart);
}

function createRoofTile(x,y,z){
	var roofPart = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE,1,UNITSIZE), 
	Physijs.createMaterial(new THREE.MeshBasicMaterial({
	map: roofTexture
}),1, 0.1), 0);
roofPart.position.set(UNITSIZE * x, (y+1)*WALLHEIGHT -0.5, UNITSIZE * z);
scene.add(roofPart);
}

function createWall(x,y,z){
	var wallPart = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE,WALLHEIGHT*7/8,UNITSIZE), 
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				map:wallTexture
			}),0, 0.1), 0);
	wallPart.position.set(UNITSIZE * x, y*WALLHEIGHT + WALLHEIGHT/2 - 0.5, UNITSIZE * z);
	scene.add(wallPart);
}
var specialPlatforms = [];
function createElevator(x,y,z){
	createFloor(x,y,z);
	var specialPlatform = new MovingPlatform(new THREE.Vector3(0,0.01,0), new THREE.Vector3(0,1,0), WALLHEIGHT - 1, y);
	specialPlatform.createBoxMesh(new THREE.Vector3(UNITSIZE * 3 / 4, 0.5, UNITSIZE * 3 / 4), new THREE.Vector3(UNITSIZE * x, y * WALLHEIGHT + 1.5, UNITSIZE * z), null, 500, 1, 0.1);
	platforms.push(specialPlatform);
	specialPlatforms.push(specialPlatform);
}

function createZPlatform(x,y,z){
	var platform = new MovingPlatform(new THREE.Vector3(0,0,Math.random()*3 + 3), new THREE.Vector3(0,0,1), UNITSIZE*10, y);
	platform.createBoxMesh(new THREE.Vector3(UNITSIZE * 3/4, 0.5, UNITSIZE*3/4), new THREE.Vector3(UNITSIZE*x, y * WALLHEIGHT + 0.25, UNITSIZE * z), null, 500, 1, 0.1);
	platforms.push(platform);
}

function createXPlatform(x,y,z){
	var platform = new MovingPlatform(new THREE.Vector3(Math.random()*3 + 3,0,0), new THREE.Vector3(1,0,0), UNITSIZE*10, y);
	platform.createBoxMesh(new THREE.Vector3(UNITSIZE * 3/4, 0.5, UNITSIZE*3/4), new THREE.Vector3(UNITSIZE*x, y * WALLHEIGHT + 0.25, UNITSIZE * z), null, 500, 1, 0.1);
	platforms.push(platform);
}

function createYPlatform(x,y,z){
	var platform = new MovingPlatform(new THREE.Vector3(0,Math.random()*2 + 2,0), new THREE.Vector3(0,1,0), Math.random()*8 + 2, y);
	platform.createBoxMesh(new THREE.Vector3(UNITSIZE * 3/4, 0.5, UNITSIZE*3/4), new THREE.Vector3(UNITSIZE*x, y * WALLHEIGHT + 2, UNITSIZE * z), null, 500, 1, 0.1);
	platforms.push(platform);
}

var iceTiles = [];
function createIce(x,y,z){
	/*TODO: CHANGE THIS TO ICETILE OBJECT?*/
	var ice = new SpecialTile(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE * x, y * WALLHEIGHT +0.5, UNITSIZE * z));
	ice.makeIce();
	iceTiles.push(ice);
}

var icePillars = [];
function createPillar(x,y,z){
	
	var pillar = new IcePillar(new THREE.Vector3(UNITSIZE*0.8, WALLHEIGHT/2, UNITSIZE*0.8), new THREE.Vector3(UNITSIZE * x, WALLHEIGHT * y + WALLHEIGHT/4 + 1, UNITSIZE * z));
	icePillars.push(pillar);
}
var targetTile;
function createTargetTile(x, y, z){
	targetTile = new SpecialTile(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE * x, WALLHEIGHT * y + 0.5, UNITSIZE * z));
	targetTile.makeIce();
	targetTile.mesh.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x00ff00}), 0.0, 0.1);
	iceTiles.push(targetTile);
}

function generateInvisibleWall(){
	var basicWall1 = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE),
	        Physijs.createMaterial(new THREE.MeshBasicMaterial({
	                map: textureArray['floral'], opacity: 0.3
	        }), 0.0, 0.01), 0);
	basicWall1.material.transparent = true;
	addWall(basicWall1, UNITSIZE*5.5,UNITSIZE*8,0.1,1,5,WALLHEIGHT/2, true);
	addWall(basicWall1, UNITSIZE*10.5,UNITSIZE*8,0.1,1,5,WALLHEIGHT/2, true);
	addWall(basicWall1, UNITSIZE*8,UNITSIZE*10.5,5,1,0.1,WALLHEIGHT/2, true);
	addWall(basicWall1, UNITSIZE*8,UNITSIZE*5.5,5,1,0.1,WALLHEIGHT/2, true);
}

function addPuzzleLever(){
	lever = new Lever(icePillars, "reset", new THREE.Vector3(UNITSIZE*4,2,UNITSIZE*7));
}



function addKey(position){
    var key = new GatherItem('keys', 1, 'key', true, false);
    key.createBoxMesh(new THREE.Vector3(0.2, 0.2, 0.2), position, null, 0.1, 1, 0.1);
    keys.push(key);
}

function keyLoadedCallback3(object){
	object.scale.set(0.3,0.3,0.3);
	for(var i = 0; i < keys.length; i++){
		var clone = object.clone();
		keys[i].mesh.add(clone);
	}
}
var doors = [];
var doorNumber = 0;
function createVerticalDoor(x, y, z){
	doorNumber += 1;
	var door = new Door(new THREE.Vector3(0,1,0), new THREE.Vector3(1,0,0), new THREE.Vector3(x*UNITSIZE, y*WALLHEIGHT + WALLHEIGHT / 2, z*UNITSIZE), new THREE.Vector3(UNITSIZE, WALLHEIGHT, UNITSIZE/4), doorNumber);
	doors.push(door);
}

function createJumpableDoor(x, y, z){
	doorNumber += 1;
	var door = new Door(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1), new THREE.Vector3(x*UNITSIZE, y*WALLHEIGHT + WALLHEIGHT / 2, z*UNITSIZE), new THREE.Vector3(UNITSIZE/4, WALLHEIGHT, UNITSIZE), doorNumber);
	doors.push(door);
}

function giantDoorLoadedCallback3(object){
	object.scale.set(0.6, 0.75, 0.6);
	for(var i = 0; i < doors.length; i++){
		var clone = object.clone();
		doors[i].addSkin(clone);
	}
}

function groundSpikesBloodyLoadedCallback3(object){
	object.scale.set(0.4,0.5,0.4);
	object.rotation.x += Math.PI;
	for(var i = 1; i < mapW - 1; i++){
		for(var j = 1; j < mapH - 1; j++){
			if(!(i == 1 && j == 15) && !(i == 2 && j == 15)){
				var clone = object.clone();
				clone.position.y += 1;
				createRoofTrap(i, 1, j, clone);
				var clone2 = object.clone();
				clone2.rotation.x -= Math.PI;
				clone2.position.y -= 0.8;
				createRoofTrap(i, 2, j, clone2);
			}
		}
	}
	
}

function groundSpikesBloodyLoadedCallback2(object){
	object.scale.set(0.4, 0.5, 0.4);
	object.position.y -= 0.8;
	for(var i = 0; i < spikes.length; i++){
		var clone = object.clone();
		spikes[i].mesh.add(clone);
	}
}

function createRoofTrap(z, y, x, object){
	var roofTrap = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE,1,UNITSIZE), 
	Physijs.createMaterial(new THREE.MeshBasicMaterial({
		color: 0x22ee55, visible: false
	}),1, 0.1), 0);
	roofTrap.position.set(UNITSIZE * x, y*WALLHEIGHT + WALLHEIGHT*0.6*(2.1-y), UNITSIZE * z);
	roofTrap.addEventListener('collision', function(other_object){
		if(other_object == player.mesh){
			takeDamage(100);
		}
	});
	scene.add(roofTrap);
	roofTrap.add(object);
}
var dungObject;
function dung3LoadedCallback(geometry){
	dungTexture = textureLoader.load('images/poop4.jpg');
    dungMaterial = new THREE.MeshBasicMaterial({map: dungTexture});
    dungObject = new THREE.Mesh(geometry, dungMaterial);
    dungObject.scale.set(0.1, 0.1, 0.1);
    for(var i = 0; i < dungs.length; i++){
    	var skin = dungObject.clone();
    	dungs[i].mesh.add(skin);
    }
}

function createDung(x,y,z){
	var dung = new GatherItem('points', 100, 'dung', false, true);
    dung.createBoxMesh(new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Vector3(x*UNITSIZE, y*WALLHEIGHT + 1, z*UNITSIZE), null, 1, 1, 0.1);
    dungs.push(dung);
}

function createExitPortal(x,y,z){
	exitPortal = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT*7/8, UNITSIZE),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x00ff00, opacity: 0.9}), 1, 0.1), 0);
	exitPortal.material.transparent = true;
	exitPortal.position.set(x*UNITSIZE, y*WALLHEIGHT + WALLHEIGHT/2, z*UNITSIZE);
	exitPortal.addEventListener('collision', function(other_object){
		if(other_object == player.mesh){
			levelComplete();
		}
	});
	scene.add(exitPortal);
}
var fallingRooftraps = [];
function createFallingRoofTrapLaser(x,y,z){
	var trap = new Trap(new THREE.Vector3(0,1,0), 100, new THREE.Vector3(0,-4,0), 0);
	trap.createBoxMesh(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*(y+1) - 1, UNITSIZE*z), null, 200, 0, 0.1);
	var traps = [];
	traps.push(trap);
	var trigger = new TrapTrigger(traps);
	trigger.createCylinderMesh(new THREE.Vector3(0.1, 0.1, UNITSIZE), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*y + 1, UNITSIZE*z), null, Math.PI/2, 0, 0, 0);
	fallingRooftraps.push(trap);
}

function createFallingRoofTrapPlateDoubleZ(x,y,z){
	var trap1 = new Trap(new THREE.Vector3(0,1,0), 100, new THREE.Vector3(0,-4,0), 250);
	trap1.createBoxMesh(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*(y+1) - 1, UNITSIZE*z), null, 200, 0, 0.1);
	var trap2 = new Trap(new THREE.Vector3(0,1,0), 100, new THREE.Vector3(0,-4,0), 250);
	trap2.createBoxMesh(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*(y+1) - 1, UNITSIZE*(z+1)), null, 200, 0, 0.1);
	var traps = [];
	traps.push(trap1);
	traps.push(trap2);
	var trigger = new TrapTrigger(traps);
	trigger.createBoxMesh(new THREE.Vector3(UNITSIZE, 0.1, UNITSIZE), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*y + 1, UNITSIZE*z + UNITSIZE/4), null, 0, 1, 0);
	fallingRooftraps.push(trap1);
	fallingRooftraps.push(trap2);
}

function fallingRoofTrapLoadedCallback(object){
	object.scale.set(0.5,0.5,0.5);
	for(var i = 0; i < fallingRooftraps.length; i++){
		var clone = object.clone();
		fallingRooftraps[i].addSkin(clone);
	}
}

function createKey(x,y,z){
	addKey(new THREE.Vector3(x * UNITSIZE, WALLHEIGHT * y + 2.5, z*UNITSIZE));
}

function createPendulumBlade(x,y,z){
	var pendulum = new Pendulum(Math.PI/2, 40, Math.random()*3 + 1, new THREE.Vector3(0,0,1));
    pendulum.createCylinderMesh(new THREE.Vector3(0.1, 0.1, WALLHEIGHT*0.65), new THREE.Vector3(x * UNITSIZE, WALLHEIGHT*y + WALLHEIGHT/2, z * UNITSIZE), null, 10, 0.0, 0.1);
    pendulums.push(pendulum);
}

function trapBladeLoadedCallback2(object){
	object.scale.set(0.15,0.25,0.15);
    object.position.y -= 2;
	for(var i = 0; i < pendulums.length; i++){
		var clone = object.clone();
		pendulums[i].mesh.add(clone);
	}
}
var enemies = [];
function createEnemy(x,y,z){
	var enemy = new Enemy(x,y,z);
	enemies.push(enemy);
}

function enemyLoadedCallback2(object){
	object.scale.set(0.3, 0.3, 0.3);
	for(var i = 0; i < enemies.length; i++){
		var clone = object.clone();
		enemies[i].mesh.add(clone);
	}
}

//Creates the "lights on!" puzzle in level 2.
function createLightsPuzzle(x,y,z){
	var puzzleTexture = textureLoader.load('images/lightwall/lightwall_texture.jpg');
  puzzleMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
          map : puzzleTexture
  }), 0.4, 0.8);
  puzzleLightOnTexture = textureLoader.load('images/lightwall/on_state.jpg');
  puzzleLightOnTexture.name = "puzzleLightOnTexture";
  puzzleLightOffTexture = textureLoader.load('images/lightwall/off_state.jpg');
  puzzleLightOffTexture.name = "puzzleLightOffTexture";
  puzzleLightMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
          map : puzzleLightOffTexture
  }), 0.4, 0.8);
  
	audioArray['puzzle'] = new Audio('audio/162473__kastenfrosch__successful.mp3');
	puzzleCaster = new THREE.Raycaster();
	puzzle = new Physijs.BoxMesh(new THREE.BoxGeometry(2, WALLHEIGHT, UNITSIZE),
			puzzleMaterial, 0);
	puzzle.position.set(UNITSIZE * x, WALLHEIGHT * y + WALLHEIGHT/2 - 0.5, UNITSIZE * z);
	scene.add(puzzle);
	var puzzlePoint = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8), 
			new THREE.MeshBasicMaterial());
	puzzlePoint.position.x = UNITSIZE * x - 1;
	puzzlePoint.position.y =  WALLHEIGHT * y + WALLHEIGHT/2 - 0.5;
	puzzlePoint.position.z = UNITSIZE * z;
	puzzlePoint.position.x -= 0.3;
	puzzlePoint.position.z -= UNITSIZE/3;
	puzzlePoint.position.y -= WALLHEIGHT/7;
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
function createCrate(x,y,z){
	var crate = new PickUpItem();
	crate.createBoxMesh(new THREE.Vector3(1.5, 1, 1.5), new THREE.Vector3(x*UNITSIZE, y*WALLHEIGHT + 1, z*UNITSIZE), crateMaterial, 15);
	moveableObjects.push(crate);
	crates.push(crate);
}

function createHealthBox(x,y,z){
	var healthBox = new GatherItem("health", 50, "health", true, false);
	var healthBoxMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: textureArray['healthBox']}), 0, 0);
	healthBox.createBoxMesh(new THREE.Vector3(UNITSIZE/2, UNITSIZE/2, UNITSIZE/2), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*y + 2, UNITSIZE*z), healthBoxMaterial, 1);
}

function createHorizontalSpikeTrapZ(x,y,z){
	var trap = new Trap(new THREE.Vector3(0,0,1), 100, new THREE.Vector3(0,0,4), 3000);
	trap.createBoxMesh(new THREE.Vector3(UNITSIZE, UNITSIZE, 1), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*y + WALLHEIGHT/3, UNITSIZE*z), null, 200, 0, 0.1);
	var traps = [];
	traps.push(trap);
	var trigger = new TrapTrigger(traps);
	trigger.createBoxMesh(new THREE.Vector3(UNITSIZE, 0.1, UNITSIZE), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*y + 1, UNITSIZE*(z+3)), null, 0, 1, 0);
	fallingRooftraps.push(trap);
}
var spikes = [];
function createGroundSpike(x,y,z){
	var groundSpike = new Trap(new THREE.Vector3(0,0,0), 20, new THREE.Vector3(0,0,0), 0);
	groundSpike.createBoxMesh(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE*x, WALLHEIGHT*y +1, UNITSIZE*z), null, 0, 0, 0.1);
	spikes.push(groundSpike);
}

