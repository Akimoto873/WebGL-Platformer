var dungs = [];

// Essentials
function loadAssets() {
    // LOAD FLARE ANIMATION AND SPRITE
    var flareAnimTexture = new THREE.ImageUtils.loadTexture('images/animation/flare_sprite.png');
    flareAnimation = new textureAnimator(flareAnimTexture, 4, 1, 4, 15); // texture,
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


// Generates level 1
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
    

    // JSON Loader
    loader = new THREE.JSONLoader();
    
     // Trap Texture
    trapTexture = textureLoader.load('images/crushers.jpg');
    
    // Load Trap
    loader.load('models/trap.js', trapLoadedCallback);

    // Exit Texture
    var exitTexture = textureLoader.load('images/exit.jpg');
    exitMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
            map : exitTexture
    }), 0.4, 0.8);
    var crushingTexture = textureLoader.load('images/crushing.jpg');
    crushingMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
            map : crushingTexture
    }), 0.4, 0.8);

    // Level Collision
    floor = new Physijs.BoxMesh(new THREE.BoxGeometry(100, 1, 100), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
                color : 0xee2233,
                visible : false
        }), 1, 0.2), 0);
    floor.position.y -= 2.25;
    scene.add(floor);

    // Roof
    roof = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 1, 50), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
                color : 0xee2233,
                visible : false
        }), 0.9, 0.2), 0);
    roof.position.y += 6;
    scene.add(roof);

    // Create level 1 wall collision
    createLevel1Walls();

    // Crate Object
    crates[0] = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5, 1, 1.5), crateMaterial, 15);
    moveableObjects.push(crates[0]);
    crates[0].position.x = cratePosition.x;
    crates[0].position.y = cratePosition.y;
    crates[0].position.z = cratePosition.z;
    crates[0].addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
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
    exitSign = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 1, 2), exitMaterial, 0);
    exitSign.position.x += 24.5;
    exitSign.position.z += 23.2;
    exitSign.position.y += 3;
    scene.add(exitSign);

    crushingSign = new Physijs.BoxMesh(new THREE.BoxGeometry(0.1, 1, 2), crushingMaterial, 0);
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
    
    exit.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object == charMesh) {
            levelComplete();
        }
    });

    // Load the dung model
    loader.load('models/objects/dung/dung.js', dung1LoadedCallback);

    scene.traverse(function(node) {
        if (node instanceof Physijs.BoxMesh) {
            objects.push(node);
        }
    });
}


// Dung level 1 Callback
function dung1LoadedCallback(geometry){
    dungTexture = textureLoader.load('images/poop4.jpg');
    var dung = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshBasicMaterial({map: dungTexture}), 1, 0.1), 1);
    dung.scale.set(0.1, 0.1, 0.1);
    dung.position.set(5.40,1,-22.80);
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
    dung.position.set(-23.20,1,18.20);
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
    dung.position.set(-16.20,1,18.20);
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
    dung.position.set(-5.40,1,12.60);
    dung.addEventListener('collision', function(other_object){
        if(other_object == charMesh){
            dungCollected();
            scene.remove(this);

        }
    });
    scene.add(dung);
    dungs.push(dung);
}


// Called when level 1 model is loaded.
function level1LoadedCallback(object) {
    // Since we are not using lights and shadows (besides flare), we do not need shadows
    // +Increases game performance
    object.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = false;
            node.receiveShadow = false;
        }
    });

    // Material
    object.material = new THREE.MeshPhongMaterial({
            color : 0x555555,
            specular : 0xffffff,
            shininess : 25
    });

    // Set position and scale
    object.scale.set(1, 1.8, 1);
    object.position.y += 1.4;

    // Add to scene
    scene.add(object);
    levelObject = object;
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
    var clone = new Physijs.BoxMesh(object.clone().geometry, object.material, object.mass);
    clone.visible = false;
    return clone;
}



// Called when trap model is loaded.
function trapLoadedCallback(geometry) {
    tile = new Physijs.BoxMesh(new THREE.BoxGeometry(3, 0.1, 4), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0x554444
        }), 0.0, 0.1), 0);
    tile.position.x -= 9;
    tile.position.y -= 1.8;
    tile.position.z += 2;
    scene.add(tile);
    trap = new Physijs.BoxMesh(new THREE.BoxGeometry(3, 1, 8), Physijs
        .createMaterial(new THREE.MeshBasicMaterial({
            color : 0x554444
        }), 0.0, 0.1), 100);
    trap.position.x -= 9;
    trap.position.y += 4;
    scene.add(trap);
    trap.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object == charMesh) {
            takeDamage(100);
        }
    });
    trap.material.visible = false;
    trap.setLinearFactor(new THREE.Vector3(0, 0, 0));
    trap.setAngularFactor(new THREE.Vector3(0, 0, 0));
    trapCaster = new THREE.Raycaster();
    trapCaster.set(new THREE.Vector3(tile.position.x, tile.position.y, tile.position.z + 2), new THREE.Vector3(0, 1, 0));
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
    trap2.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
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
    // Load physijs material
    var col_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
            color : 0xFFFF00,
            visible : false
    }), .8, // friction
    .4      // restitution
    );

    // Add physics box around the object
    coneGeometry = new Physijs.BoxMesh(new THREE.BoxGeometry(0.18, 0.18, 0.8),
        col_material, 0 // mass
    );

    // Rotate object to fit the geometry
    object.rotation.set(Math.PI / 2, 0, 0);
    coneGeometry.add(object);
}


// Runs after Flare Box item geometry is loaded
function flareBoxLoadedCallback(object) {
    // Load physijs material
    var col_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color : 0xFFFFFF,
        visible : false
    }), 1, // friction
    .1 // restitution
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


// Texture Animation Function : based on code from http://stemkoski.github.io/Three.js/Texture-Animation.html
// Returns an object that can be added to scene, and must be updated in order to
// animate
function textureAnimator(textureSource, tileHori, tileVert, tileNumber,	tileDisplayDuration) {
	
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

// Create level 1 wall collision
function createLevel1Walls(){
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
}