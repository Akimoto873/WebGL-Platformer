/**
 * 
 */

function generateLevel3(){
	generateLevel3Floors();
	 var ambientLight = new THREE.AmbientLight(0xffffff);
	    scene.add(ambientLight);
}

var UNITSIZE = 4;
var WALLHEIGHT = 8;
var mapW;
var mapH;

function generateLevel3Floors(){
	var map =  [ // 1, 2, 3, 4, 5, 6, 7, 8, 9 10 11 12 13 14
	            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 0
	            [2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2], // 1
	            [2, 9, 1, 1, 2, 8, 1, 2, 2, 2, 1, 0, 1, 0, 2, 1, 2], // 2
	            [2, 0, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 0, 1, 2, 1, 2], // 3
	            [2, 0, 9, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 1, 2], // 4
	            [2, 0, 0, 1, 2, 1, 4, 4, 4, 4, 4, 1, 2, 1, 0, 1, 2], // 5
	            [2, 0, 0, 2, 1, 1, 5, 4, 4, 4, 5, 1, 1, 2, 1, 1, 2], // 6
	            [2, 2, 0, 2, 1, 1, 4, 4, 6, 4, 4, 1, 1, 2, 1, 1, 2], // 7
	            [2, 9, 0, 2, 1, 1, 4, 5, 4, 4, 4, 1, 1, 2, 1, 1, 2], // 8
	            [2, 0, 0, 1, 2, 1, 4, 4, 4, 4, 5, 1, 2, 8, 1, 1, 2], // 8
	            [2, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2], // 8
	            [2, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 8, 2, 1, 1, 2], // 8
	            [2, 0, 0, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2], // 8
	            [2, 0, 2, 1, 1, 1, 2, 2, 7, 2, 1, 1, 1, 1, 1, 2, 2], // 8
	            [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 8
	            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	           ]; 
	mapW = map.length;
	mapH = map[0].length;
	
	var map2 =  [ // 1, 2, 3, 4, 5, 6, 7, 8, 9
	              [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	              [2, 1, 4, 1, 4, 4, 4, 1, 1, 2, 1, 8, 4, 4, 2, 3, 2], // 0
	              [2, 4, 4, 4, 4, 4, 4, 2, 1, 2, 4, 4, 4, 4, 2, 1, 2], // 1
	              [2, 4, 4, 4, 4, 4, 4, 2, 1, 2, 1, 4, 4, 1, 4, 4, 2], // 2
	              [2, 4, 4, 4, 1, 4, 1, 2, 0, 2, 4, 4, 4, 4, 4, 4, 2], // 3
	              [2, 4, 4, 4, 4, 4, 4, 2, 2, 2, 4, 4, 1, 4, 1, 4, 2], // 4
	              [2, 1, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 2], // 5
	              [2, 4, 4, 4, 4, 4, 1, 4, 4, 1, 4, 4, 4, 4, 4, 4, 2], // 6
	              [2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2], // 7
	              [2, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 2], // 8
	              [2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2], // 8
	              [2, 1, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2], // 8
	              [2, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 2], // 8
	              [2, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 1, 4, 4, 4, 4, 2], // 8
	              [2, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 4, 2], // 8
	              [2, 4, 4, 4, 4, 4, 1, 4, 4, 1, 4, 4, 1, 4, 4, 4, 2], // 8
	              [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
		           ];
	
	var map3 = [
	            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
	            ];
	
	for(var i = 0; i < mapW; i++){
		for(var j = 0; j < map[i].length; j++){
			generateParts(j, 0, i, map[i][j]);
		}
		for(var k = 0; k < map2[i].length; k++){
			generateParts(k, 1, i, map2[i][k]);
		}
		for(var l = 0; l < map3[i].length; l++){
			generateParts(l, 2, i, map3[i][l]);
		}
	}
	
	THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var objLoader = new THREE.OBJMTLLoader();
	
	generateInvisibleWall();
	addPuzzleLever();
	scene.traverse(function(node) {
        if (node instanceof Physijs.BoxMesh) {
        	if(node.visible == true){
        		objects.push(node);
        	}
        }
    });
	
	audioArray['key'] = new Audio('audio/270408__littlerobotsoundfactory__pickup-gold-00.mp3');
    audioArray['key'].volume = 0.5;
    audioArray['key'].addEventListener('ended', function(){
        this.currentTime = 0;
    });
    addKey(new THREE.Vector3(10 * UNITSIZE, 1, 3*UNITSIZE));
    objLoader.load('models/objects/key/key.obj', 'models/objects/key/key.mtl', keyLoadedCallback3);
    objLoader.load('models/objects/giant_door/giant_door.obj', 'models/objects/giant_door/giant_door.mtl', giantDoorLoadedCallback3);
    objLoader.load('models/objects/trap_spikes/trap_spikes.obj', 'models/objects/trap_spikes/trap_spikes.mtl', trapSpikesLoadedCallback3);
    loader = new THREE.JSONLoader();
    loader.load('models/objects/dung/dung.js', dung3LoadedCallback);
    
	level = 3;
	
	
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
	
}

function createFloor(x,y, z){
	var floorPart = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE,1,UNITSIZE), crateMaterial,0);
//			Physijs.createMaterial(new THREE.MeshBasicMaterial({
//				color: 0x22ee55
//			}),1, 0.1), 0);
	floorPart.position.set(UNITSIZE * x, y*WALLHEIGHT -0.5, UNITSIZE * z);
	scene.add(floorPart);
}

function createWall(x,y,z){
	var wallPart = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE,WALLHEIGHT,UNITSIZE), crateMaterial, 0);
//			Physijs.createMaterial(new THREE.MeshBasicMaterial({
//				color: 0x22ee55
//			}),0, 0.1), 0);
	wallPart.position.set(UNITSIZE * x, y*WALLHEIGHT + WALLHEIGHT/2 - 1, UNITSIZE * z);
	scene.add(wallPart);
}
var specialPlatforms = [];
function createElevator(x,y,z){
	createFloor(x,y,z);
	var specialPlatform = new MovingPlatform(new THREE.Vector3(0,0.01,0), new THREE.Vector3(0,1,0), WALLHEIGHT - 1);
	specialPlatform.createBoxMesh(new THREE.Vector3(UNITSIZE * 3 / 4, 0.5, UNITSIZE * 3 / 4), new THREE.Vector3(UNITSIZE * x, y * WALLHEIGHT + 0.7, UNITSIZE * z), null, 500, 1, 0.1);
	platforms.push(specialPlatform);
	specialPlatforms.push(specialPlatform);
}

function createZPlatform(x,y,z){
	var platform = new MovingPlatform(new THREE.Vector3(0,0,Math.random()*3 + 2), new THREE.Vector3(0,0,1), UNITSIZE*10);
	platform.createBoxMesh(new THREE.Vector3(UNITSIZE * 3/4, 0.5, UNITSIZE*3/4), new THREE.Vector3(UNITSIZE*x, y * WALLHEIGHT - 0.25, UNITSIZE * z), null, 500, 1, 0.1);
	platforms.push(platform);
}

function createXPlatform(x,y,z){
	
}

var iceTiles = [];
function createIce(x,y,z){
	/*TODO: CHANGE THIS TO ICETILE OBJECT*/
	var ice = new SpecialTile(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE * x, y * WALLHEIGHT -0.5, UNITSIZE * z));
	ice.makeIce();
	iceTiles.push(ice);
}

var icePillars = [];
function createPillar(x,y,z){
	
	var pillar = new IcePillar(new THREE.Vector3(UNITSIZE*0.8, WALLHEIGHT/2, UNITSIZE*0.8), new THREE.Vector3(UNITSIZE * x, WALLHEIGHT * y + WALLHEIGHT/4, UNITSIZE * z));
	icePillars.push(pillar);
//	var pillar = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE/2,WALLHEIGHT/2,UNITSIZE/2), 
//	Physijs.createMaterial(new THREE.MeshBasicMaterial({
//	color: 0x22ee55
//	}),0.5, 0.1), 1);
//	pillar.position.set(UNITSIZE * x, WALLHEIGHT * y + WALLHEIGHT/2, UNITSIZE * z);
//	scene.add(pillar);
//	pillar.setAngularFactor(new THREE.Vector3(0,0,0));
}
var targetTile;
function createTargetTile(x, y, z){
	targetTile = new SpecialTile(new THREE.Vector3(UNITSIZE, 1, UNITSIZE), new THREE.Vector3(UNITSIZE * x, WALLHEIGHT * y - 0.5, UNITSIZE * z));
	targetTile.makeIce();
	targetTile.mesh.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x00ff00}), 0.0, 0.1);
	iceTiles.push(targetTile);
}

function generateInvisibleWall(){
	var basicWall1 = new Physijs.BoxMesh(new THREE.BoxGeometry(2, WALLHEIGHT, 2),
	        Physijs.createMaterial(new THREE.MeshBasicMaterial({
	                color : 0x22ee44, opacity: 0.3
	        }), 0.0, 0.1), 0);
	basicWall1.material.transparent = true;
	addWall(basicWall1, 22.20,32.00,0.20,1,10.20,WALLHEIGHT/2, true);
	addWall(basicWall1, 41.80,32.00,0.20,1,10.20,WALLHEIGHT/2, true);
	addWall(basicWall1, 32.00,41.80,10.00,1,0.20,WALLHEIGHT/2, true);
	addWall(basicWall1, 32.00,22.00,10.00,1,0.20,WALLHEIGHT/2, true);
}

function addPuzzleLever(){
	lever = new Lever(icePillars, "reset", new THREE.Vector3(25,2,20));
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
	var door = new Door(new THREE.Vector3(0,1,0), new THREE.Vector3(x*UNITSIZE, y*WALLHEIGHT + WALLHEIGHT / 2, z*UNITSIZE), new THREE.Vector3(UNITSIZE, WALLHEIGHT*0.9, UNITSIZE/4), doorNumber);
	doors.push(door);
}

function giantDoorLoadedCallback3(object){
	object.scale.set(1, 1, 1);
	for(var i = 0; i < doors.length; i++){
		var clone = object.clone();
		doors[i].addSkin(clone);
	}
}

function trapSpikesLoadedCallback3(object){
	object.scale.set(0.5,0.5,0.5);
	for(var i = 1; i < mapW - 1; i++){
		for(var j = 1; j < mapH - 1; j++){
			if(!(i == 1 && j == 15) && !(i == 2 && j == 15)){
				var clone = object.clone();
				
				createRoofTrap(i, j, clone);
			}
		}
	}
}

function createRoofTrap(z, x, object){
	var roofTrap = new Physijs.BoxMesh(new THREE.BoxGeometry(UNITSIZE,1,UNITSIZE), 
	Physijs.createMaterial(new THREE.MeshBasicMaterial({
		color: 0x22ee55, visible: false
	}),1, 0.1), 0);
roofTrap.position.set(UNITSIZE * x, 1*WALLHEIGHT + WALLHEIGHT*0.5, UNITSIZE * z);
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
    dung.createBoxMesh(new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Vector3(x*UNITSIZE, y*WALLHEIGHT + 0.5, z*UNITSIZE), null, 1, 1, 0.1);
    dungs.push(dung);
}