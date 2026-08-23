import * as THREE from "three";

import {
    PointerLockControls
} from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/PointerLockControls.js";


const PlayerNumber = Math.floor(1000 + Math.random() * 9000);

// ============================================================
// PHOTON SETTINGS
// ============================================================

const APP_ID = "684a8878-817b-4cd9-a025-d93e7d32ce18";
const APP_VERSION = "Beta1";
const PLAYER_EVENT = 1;


// ============================================================
// THREE.JS
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x14294d);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(
    renderer.domElement
);


// ============================================================
// UI
// ============================================================

const title = document.createElement("div");

title.innerText = "Beta 1.0";

title.style.position = "fixed";
title.style.left = "20px";
title.style.top = "20px";
title.style.color = "white";
title.style.fontFamily = "Arial";
title.style.fontSize = "24px";
title.style.fontWeight = "bold";
title.style.textShadow = "0 0 5px black";
title.style.pointerEvents = "none";

document.body.appendChild(title);


const crosshair = document.createElement("div");

crosshair.innerText = "+";

crosshair.style.position = "fixed";
crosshair.style.left = "50%";
crosshair.style.top = "50%";
crosshair.style.transform =
    "translate(-50%, -50%)";

crosshair.style.color = "white";
crosshair.style.fontFamily = "Arial";
crosshair.style.fontSize = "28px";
crosshair.style.fontWeight = "bold";
crosshair.style.pointerEvents = "none";

document.body.appendChild(crosshair);


const networkText = document.createElement("div");

networkText.innerText =
    "Photon: Starting...";

networkText.style.position = "fixed";
networkText.style.left = "20px";
networkText.style.bottom = "20px";
networkText.style.color = "yellow";
networkText.style.fontFamily = "Arial";
networkText.style.fontSize = "16px";
networkText.style.textShadow =
    "0 0 5px black";

networkText.style.pointerEvents = "none";

document.body.appendChild(networkText);


// ============================================================
// TEXTURES
// ============================================================

const loader =
    new THREE.TextureLoader();


const grassTexture =
    loader.load("textures/Grass.png");

const woodTexture =
    loader.load("textures/Wood.png");

const stoneTexture =
    loader.load("textures/Stone.png");

const goldTexture =
    loader.load("textures/Gold.png");


// ============================================================
// MATERIALS
// ============================================================

const grassMaterial =
    new THREE.MeshStandardMaterial({
        map: grassTexture
    });


const woodMaterial =
    new THREE.MeshStandardMaterial({
        map: woodTexture
    });


const stoneMaterial =
    new THREE.MeshStandardMaterial({
        map: stoneTexture
    });


const goldMaterial =
    new THREE.MeshStandardMaterial({
        map: goldTexture
    });


// ============================================================
// SKYBOX
// ============================================================

const skyTextures = [

    loader.load("textures/Sky/right.png"),
    loader.load("textures/Sky/left.png"),
    loader.load("textures/Sky/top.png"),
    loader.load("textures/Sky/bottom.png"),
    loader.load("textures/Sky/front.png"),
    loader.load("textures/Sky/back.png")

];


const skyMaterials =
    skyTextures.map(texture => {

        return new THREE.MeshBasicMaterial({

            map: texture,

            side: THREE.BackSide

        });

    });


const skybox =
    new THREE.Mesh(

        new THREE.BoxGeometry(
            500,
            500,
            500
        ),

        skyMaterials

    );


scene.add(skybox);


// ============================================================
// LIGHTING
// ============================================================

const sun =
    new THREE.DirectionalLight(
        0xffd2a0,
        2
    );

sun.position.set(
    30,
    40,
    -30
);

sun.castShadow = true;

scene.add(sun);


const ambient =
    new THREE.AmbientLight(
        0x64646e,
        0.7
    );

scene.add(ambient);


// ============================================================
// COLLIDERS
// ============================================================

const colliders = [];


// ============================================================
// BLOCK CREATOR
// ============================================================

function createBlock(
    x,
    y,
    z,
    width,
    height,
    depth,
    material
) {

    const mesh =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),

            material

        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.castShadow = true;
    mesh.receiveShadow = true;


    scene.add(mesh);


    colliders.push({

        minX: x - width / 2,
        maxX: x + width / 2,

        minY: y - height / 2,
        maxY: y + height / 2,

        minZ: z - depth / 2,
        maxZ: z + depth / 2

    });


    return mesh;
}


// ============================================================
// GROUND
// ============================================================

createBlock(
    0,
    -0.5,
    0,
    50,
    1,
    50,
    grassMaterial
);


// ============================================================
// WALLS
// ============================================================

createBlock(
    0,
    2,
    25,
    50,
    4,
    1,
    stoneMaterial
);


createBlock(
    0,
    2,
    -25,
    50,
    4,
    1,
    stoneMaterial
);


createBlock(
    -25,
    2,
    0,
    1,
    4,
    50,
    stoneMaterial
);


createBlock(
    25,
    2,
    0,
    1,
    4,
    50,
    stoneMaterial
);


// ============================================================
// FIXED ROCK POSITIONS
// ============================================================
//
// You can change these numbers to move the rocks.
//
// Format:
// [x, height, z, width, depth]
//
// ============================================================

const rockPositions = [

    [-18, 2, -17, 2, 2],
    [-12, 1, -7, 1, 2],
    [-5, 3, -15, 2, 2],
    [4, 2, -18, 2, 1],
    [12, 1, -12, 2, 2],

    [18, 3, -5, 2, 2],
    [8, 2, 2, 1, 2],
    [-7, 1, 5, 2, 1],
    [-16, 2, 8, 2, 2],
    [-3, 3, 12, 2, 2],

    [7, 1, 15, 1, 2],
    [17, 2, 14, 2, 1],
    [-18, 3, 17, 2, 2],
    [-10, 1, 18, 2, 1],
    [2, 2, 7, 2, 2]

];


for (
    const rock of rockPositions
) {

    const x = rock[0];
    const height = rock[1];
    const z = rock[2];
    const width = rock[3];
    const depth = rock[4];


    createBlock(

        x,

        height / 2,

        z,

        width,

        height,

        depth,

        stoneMaterial

    );

}


// ============================================================
// TREES
// ============================================================

function createTree(x, z) {

    const tree =
        new THREE.Group();


    const trunk =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.5,
                2,
                0.5
            ),

            woodMaterial

        );


    trunk.position.y = 1;

    trunk.castShadow = true;


    tree.add(trunk);


    const leaves =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                1.25,
                12,
                8
            ),

            grassMaterial

        );


    leaves.position.y = 3;

    leaves.castShadow = true;


    tree.add(leaves);


    tree.position.set(
        x,
        0,
        z
    );


    scene.add(tree);
}


// ============================================================
// FIXED TREE POSITIONS
// ============================================================

const treePositions = [

    [-21, -20],
    [-14, -19],
    [-7, -21],

    [2, -21],
    [10, -20],
    [19, -18],

    [-21, -10],
    [-15, -4],

    [18, -9],
    [21, -2],

    [-21, 3],
    [-14, 10],

    [19, 7],
    [14, 15],

    [-19, 19],
    [-8, 20],

    [5, 20],
    [20, 19]

];


for (
    const position of treePositions
) {

    createTree(
        position[0],
        position[1]
    );

}


// ============================================================
// GOLD
// ============================================================

const collectibles = [];

let gold = 0;


function createGold(
    x,
    y,
    z
) {

    const mesh =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.5,
                16,
                12
            ),

            goldMaterial

        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.castShadow = true;


    scene.add(mesh);


    collectibles.push(mesh);
}


// Fixed gold positions too
const goldPositions = [

    [-15, 1, -14],
    [-8, 1, -3],
    [0, 1, -12],
    [10, 1, -8],
    [17, 1, -2],

    [-17, 1, 4],
    [-5, 1, 8],
    [5, 1, 13],
    [13, 1, 8],
    [18, 1, 17]

];


for (
    const position of goldPositions
) {

    createGold(
        position[0],
        position[1],
        position[2]
    );

}


// ============================================================
// PLAYER
// ============================================================

const player = {

    position:
        new THREE.Vector3(
            0,
            2,
            -10
        ),

    velocity:
        new THREE.Vector3(),

    height: 1.1,

    radius: 0.35,

    speed: 5,

    sprintSpeed: 8.5,

    jumpForce: 7,

    gravity: 20,

    grounded: false

};


// ============================================================
// CAMERA
// ============================================================

const controls =
    new PointerLockControls(
        camera,
        document.body
    );


camera.position.copy(
    player.position
);

camera.position.y +=
    player.height;


document.addEventListener(
    "click",
    () => {

        if (
            !controls.isLocked
        ) {

            controls.lock();

        }

    }
);


// ============================================================
// CHARACTER CREATOR
// ============================================================

function createNameTag(name) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    // Text
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Black outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.strokeText(name, 256, 64);

    // White text
    ctx.fillStyle = "white";
    ctx.fillText(name, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(2.5, 0.625, 1);

    // Above the head
    sprite.position.y = 1.5;

    return sprite;
}

function createCharacter(
    bodyColor,
    headColor
) {

    const character =
        new THREE.Group();

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x314ECC
        });

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xE8E66D
        });

    const hatMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xC20000
        });

    // ========================================================
    // BODY
    // ========================================================

    const body =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(
                0.35,
                0.65,
                6,
                12
            ),

            bodyMaterial

        );


    body.position.y =
        0;


    body.castShadow = true;


    character.add(body);


    // ========================================================
    // HEAD
    // ========================================================

    const head =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.6,
                0.6,
                0.6
            ),

            headMaterial

        );


    head.position.y =
        0.8;


    head.castShadow = true;


    character.add(head);

    // ========================================================
    // hat
    // ========================================================

    const hat = new THREE.Mesh(
        new THREE.ConeGeometry(
            0.45, // radius
            0.8,  // height
            16
        ),
        hatMaterial
    );

    hat.position.y = 1.5;

    hat.castShadow = true;

    character.add(hat);

    // ========================================================
    // NameTag/MakeCharacter
    // ========================================================

    const nameTag = createNameTag("Player " + PlayerNumber);

    character.add(nameTag);

    return character;
}


// ============================================================
// LOCAL PLAYER BODY
// ============================================================

const localBodyGroup =
    createCharacter(
        0x22dd55,
        0x55ff88
    );


scene.add(
    localBodyGroup
);


// ============================================================
// KEYBOARD
// ============================================================

const keys = {};


document.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;


        if (

            event.code === "Space" &&

            player.grounded

        ) {

            player.velocity.y =
                player.jumpForce;

            player.grounded = false;

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        keys[event.code] = false;

    }
);


// ============================================================
// COLLISION
// ============================================================

function canMoveTo(position) {

    const r =
        player.radius;


    const bottom =
        position.y -
        player.height;


    const top =
        position.y;


    for (
        const box of colliders
    ) {

        if (

            top <= box.minY ||

            bottom >= box.maxY

        ) {

            continue;

        }


        if (

            position.x + r >
                box.minX &&

            position.x - r <
                box.maxX &&

            position.z + r >
                box.minZ &&

            position.z - r <
                box.maxZ

        ) {

            return false;

        }

    }


    return true;
}


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer(delta) {

    const input =
        new THREE.Vector3();


    if (keys["KeyW"])
        input.z -= 1;

    if (keys["KeyS"])
        input.z += 1;

    if (keys["KeyA"])
        input.x -= 1;

    if (keys["KeyD"])
        input.x += 1;


    if (
        input.lengthSq() > 0
    ) {

        input.normalize();


        const forward =
            new THREE.Vector3();


        camera.getWorldDirection(
            forward
        );


        forward.y = 0;

        forward.normalize();


        const right =
            new THREE.Vector3();


        right.crossVectors(

            forward,

            new THREE.Vector3(
                0,
                1,
                0
            )

        );


        right.normalize();


        const movement =
            new THREE.Vector3();


        movement.addScaledVector(
            forward,
            -input.z
        );


        movement.addScaledVector(
            right,
            input.x
        );


        movement.normalize();


        const speed =

            keys["ShiftLeft"] ||
            keys["ShiftRight"]

                ? player.sprintSpeed
                : player.speed;


        movement.multiplyScalar(
            speed * delta
        );


        const nextX =
            player.position.clone();


        nextX.x +=
            movement.x;


        if (
            canMoveTo(nextX)
        ) {

            player.position.x =
                nextX.x;

        }


        const nextZ =
            player.position.clone();


        nextZ.z +=
            movement.z;


        if (
            canMoveTo(nextZ)
        ) {

            player.position.z =
                nextZ.z;

        }

    }


    // ========================================================
    // GRAVITY
    // ========================================================

    player.velocity.y -=
        player.gravity * delta;


    player.position.y +=
        player.velocity.y * delta;


    player.grounded = false;


    // ========================================================
    // GROUND COLLISION
    // ========================================================

    for (
        const box of colliders
    ) {

        const horizontal =

            player.position.x +
                player.radius >
                box.minX &&

            player.position.x -
                player.radius <
                box.maxX &&

            player.position.z +
                player.radius >
                box.minZ &&

            player.position.z -
                player.radius <
                box.maxZ;


        if (

            horizontal &&

            player.velocity.y <= 0 &&

            player.position.y -
                player.height <=
                box.maxY &&

            player.position.y -
                player.height >=
                box.maxY - 1

        ) {

            player.position.y =
                box.maxY +
                player.height;


            player.velocity.y = 0;


            player.grounded = true;

        }

    }


    // ========================================================
    // RESPAWN
    // ========================================================

    if (
        player.position.y < -20
    ) {

        player.position.set(
            0,
            2,
            -10
        );


        player.velocity.set(
            0,
            0,
            0
        );

    }


    // ========================================================
    // CAMERA
    // ========================================================

    camera.position.copy(
        player.position
    );


    camera.position.y +=
        player.height;


    // ========================================================
    // LOCAL CHARACTER
    // ========================================================

    localBodyGroup.position.copy(
        player.position
    );


    localBodyGroup.rotation.y =
        camera.rotation.y;
}


// ============================================================
// REMOTE PLAYERS
// ============================================================

const remotePlayers = {};


// ============================================================
// CREATE REMOTE PLAYER
// ============================================================

function createRemotePlayer(actorNr) {

    actorNr =
        Number(actorNr);


    if (
        remotePlayers[actorNr]
    ) {

        return;

    }


    if (

        photon &&

        photon.myActor() &&

        actorNr ===
            photon.myActor().actorNr

    ) {

        return;

    }


    console.log(
        "Creating remote player:",
        actorNr
    );


    const group =
        createCharacter(
            0xff3333,
            0xff6666
        );


    group.position.set(
        0,
        2,
        -5
    );


    scene.add(
        group
    );


    remotePlayers[actorNr] = {

        mesh: group,

        targetPosition:
            new THREE.Vector3(
                0,
                2,
                -5
            ),

        targetRotation: 0

    };


    console.log(
        "Remote player created:",
        actorNr
    );
}


// ============================================================
// REMOVE REMOTE PLAYER
// ============================================================

function removeRemotePlayer(actorNr) {

    actorNr =
        Number(actorNr);


    const remote =
        remotePlayers[actorNr];


    if (!remote) {
        return;
    }


    scene.remove(
        remote.mesh
    );


    delete remotePlayers[
        actorNr
    ];
}


// ============================================================
// REMOTE PLAYER MOVEMENT
// ============================================================

function updateRemotePlayers(delta) {

    for (
        const actorNr in remotePlayers
    ) {

        const remote =
            remotePlayers[actorNr];


        remote.mesh.position.lerp(

            remote.targetPosition,

            Math.min(
                1,
                delta * 12
            )

        );


        let difference =

            remote.targetRotation -
            remote.mesh.rotation.y;


        while (
            difference > Math.PI
        ) {

            difference -=
                Math.PI * 2;

        }


        while (
            difference < -Math.PI
        ) {

            difference +=
                Math.PI * 2;

        }


        remote.mesh.rotation.y +=

            difference *

            Math.min(
                1,
                delta * 12
            );

    }
}


// ============================================================
// PHOTON
// ============================================================

let photon = null;

let joinedRoom = false;

let networkTimer = 0;


if (
    typeof Photon === "undefined"
) {

    console.error(
        "Photon SDK was not loaded!"
    );


    networkText.innerText =
        "Photon SDK NOT LOADED";

} else {

    console.log(
        "Photon SDK loaded."
    );


    photon =
        new Photon.LoadBalancing.LoadBalancingClient(

            Photon.ConnectionProtocol.Wss,

            APP_ID,

            APP_VERSION

        );


    // ========================================================
    // STATE CHANGE
    // ========================================================

    photon.onStateChange =
        function(state) {

            console.log(
                "Photon state:",
                state
            );


            networkText.innerText =
                "Photon: " + state;


            if (

                state ===

                Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster

            ) {

                console.log(
                    "Connected to Master!"
                );


                networkText.innerText =
                    "Photon: Joining room...";


                photon.joinRandomOrCreateRoom(

                    {},

                    "BetaRoom",

                    {

                        maxPlayers: 20,

                        isVisible: true,

                        isOpen: true

                    }

                );

            }

        };


    // ========================================================
    // JOINED ROOM
    // ========================================================

    photon.onJoinRoom =
        function(createdByMe) {

            joinedRoom = true;


            console.log(
                "=========================="
            );


            console.log(
                "JOINED ROOM!"
            );


            console.log(
                "Room:",
                photon.myRoom().name
            );


            console.log(
                "My Actor:",
                photon.myActor().actorNr
            );


            console.log(
                "Players:",
                photon.myRoomActorCount()
            );


            console.log(
                "=========================="
            );


            networkText.innerText =

                "Photon: ONLINE | Players: " +

                photon.myRoomActorCount();


            const actors =
                photon.myRoomActors();


            for (
                const actorNr in actors
            ) {

                const nr =
                    Number(actorNr);


                if (

                    nr !==
                    photon.myActor().actorNr

                ) {

                    createRemotePlayer(
                        nr
                    );

                }

            }


            sendPlayerPosition(
                1
            );

        };


    // ========================================================
    // NEW PLAYER
    // ========================================================

    photon.onActorJoin =
        function(actor) {

            const actorNr =
                Number(actor.actorNr);


            console.log(
                "NEW PLAYER:",
                actorNr
            );


            createRemotePlayer(
                actorNr
            );


            networkText.innerText =

                "Photon: ONLINE | Players: " +

                photon.myRoomActorCount();


            sendPlayerPosition(
                1
            );

        };


    // ========================================================
    // PLAYER LEFT
    // ========================================================

    photon.onActorLeave =
        function(actor) {

            console.log(
                "PLAYER LEFT:",
                actor.actorNr
            );


            removeRemotePlayer(
                actor.actorNr
            );


            if (
                photon.isJoinedToRoom()
            ) {

                networkText.innerText =

                    "Photon: ONLINE | Players: " +

                    photon.myRoomActorCount();

            }

        };


    // ========================================================
    // RECEIVE PLAYER MOVEMENT
    // ========================================================

    photon.onEvent =
        function(
            eventCode,
            content,
            actorNr
        ) {

            if (
                eventCode !==
                PLAYER_EVENT
            ) {

                return;

            }


            actorNr =
                Number(actorNr);


            if (

                photon.myActor() &&

                actorNr ===
                    photon.myActor().actorNr

            ) {

                return;

            }


            if (
                !remotePlayers[actorNr]
            ) {

                createRemotePlayer(
                    actorNr
                );

            }


            const remote =
                remotePlayers[actorNr];


            if (!remote) {
                return;
            }


            if (

                content &&

                typeof content.x ===
                    "number" &&

                typeof content.y ===
                    "number" &&

                typeof content.z ===
                    "number"

            ) {

                remote.targetPosition.set(

                    content.x,

                    content.y,

                    content.z

                );

            }


            if (

                content &&

                typeof content.r ===
                    "number"

            ) {

                remote.targetRotation =
                    content.r;

            }

        };


    // ========================================================
    // CONNECT
    // ========================================================

    console.log(
        "Connecting to Photon..."
    );


    networkText.innerText =
        "Photon: Connecting...";


    photon.connectToRegionMaster(
        "us"
    );

}


// ============================================================
// SEND PLAYER POSITION
// ============================================================

function sendPlayerPosition(delta) {

    if (!photon) {
        return;
    }


    if (!joinedRoom) {
        return;
    }


    if (
        !photon.isJoinedToRoom()
    ) {

        return;

    }


    networkTimer += delta;


    if (
        networkTimer < 0.05
    ) {

        return;

    }


    networkTimer = 0;


    photon.raiseEvent(

        PLAYER_EVENT,

        {

            x:
                player.position.x,

            y:
                player.position.y,

            z:
                player.position.z,

            r:
                camera.rotation.y

        },

        {

            receivers:

                Photon.LoadBalancing.Constants.ReceiverGroup.Others

        }

    );

}


// ============================================================
// COLLECTIBLES
// ============================================================

function updateCollectibles(delta) {

    for (

        let i =
            collectibles.length - 1;

        i >= 0;

        i--

    ) {

        const item =
            collectibles[i];


        item.rotation.y +=
            2 * delta;


        const distance =
            item.position.distanceTo(
                player.position
            );


        if (
            distance < 1.5
        ) {

            scene.remove(
                item
            );


            collectibles.splice(
                i,
                1
            );


            gold++;


            console.log(
                "Gold:",
                gold
            );

        }

    }
}


// ============================================================
// SKY
// ============================================================

function updateSky() {

    skybox.position.copy(
        player.position
    );

}


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =

            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }
);


// ============================================================
// GAME LOOP
// ============================================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    if (
        controls.isLocked
    ) {

        updatePlayer(
            delta
        );


        updateCollectibles(
            delta
        );

    }


    sendPlayerPosition(
        delta
    );


    updateRemotePlayers(
        delta
    );


    updateSky();


    renderer.render(
        scene,
        camera
    );

}


animate();