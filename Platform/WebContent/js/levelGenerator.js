/**
 * 
 */
levelGenerator = function() {
	generateLevel();
}

function generateLevel() {
	floor = new Physijs.BoxMesh(new THREE.BoxGeometry(100, 1, 100), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xee2233,
				visible : false
			}), 0.99, 0.2), 0);
	floor.position.y -= 2.25;
	scene.add(floor);

	roof = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 1, 50), Physijs
			.createMaterial(new THREE.MeshBasicMaterial({
				map : roofTexture
			}), 0.9, 0.2), 0);
	roof.position.y += 5;
	scene.add(roof);
//	roof.visible = false;
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
	addWall(basicWall2, 7, -12.5, 1, 1, 6);
	addWall(basicWall2, 11, -10.5, 1, 1, 5.5);
	addWall(basicWall2, 11, 9, 1, 1, 2.5);
	addWall(basicWall2, 14.5, -9, 1, 1, 10);
	addWall(basicWall2, 25, 15.5, 1, 1, 3);
	crate = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5, 1, 1.5),
			crateMaterial, 15);
	moveableObjects.push(crate);
	crate.position.x += 9;
	crate.position.z -= 12;
	crate.addEventListener('collision', function(other_object,
			relative_velocity, relative_rotation, contact_normal) {
		if (other_object == trap || other_object == trap2) {
			crate.setLinearVelocity(new THREE.Vector3(0, 0, 0));
			scene.remove(crate);
			crate.position.x = 9;
			crate.position.z = -12;
			scene.add(crate);

		}
	});
	scene.add(crate);
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
	trap2.setAngularFactor(new THREE.Vector3(0, 0, 0));
	trap2.setLinearFactor(new THREE.Vector3(0, 0, 1));
	trapCaster2 = new THREE.Raycaster();
	trapCaster2.set(tile2.position, new THREE.Vector3(0, 1, 0));
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

	scene.traverse(function(node) {

		if (node instanceof Physijs.BoxMesh) {

			// insert your code here, for example:
			objects.push(node);

		}

	});

	levelLoaded = true;
	checkTick();
}

function addWall(object, wallX, wallZ, wallScaleX, wallScaleY, wallScaleZ) {
	wall = cloneBox(object);
	wall.position.x += wallX;
	wall.position.z += wallZ;
	wall.scale.set(wallScaleX, wallScaleY, wallScaleZ);
	scene.add(wall);
}

function cloneBox(object) {
	var clone = new Physijs.BoxMesh(object.clone().geometry, object.material,
			object.mass);
	clone.visible = false;
	return clone;
}

function generateLevel2(){
	
}