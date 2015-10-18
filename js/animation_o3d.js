/*
 // fake stuff

 function noop() {}

 var o3djs = {
 math: {
 matrix4: {
 translation: function(c) {
 return null; // TODO return matrix4
 }
 }
 },
 rendergraph: {
 createBasicView: function(pack, root, render) {
 return {
 clearBuffer: {
 clearColor: null
 }
 };
 }
 },
 material: {
 createBasicMaterial: function(pack, viewInfo, color) {
 return color;
 },
 createAndBindStandardParams: function(pack) {
 return {
 lightWorldPos: {
 value: null
 },
 lightColor: {
 value: null
 }
 };
 }
 },
 primitives: {
 createBox: function(pack, material, x, y, z, transform) {
 return null; //TODO
 },
 createSphere: function(pack, material, r, f1, f2, transform) {
 return null; //TODO
 },
 createCylinder: function(pack, material, r, h, f1, f2, transform) {
 return null; // TODO
 }
 },
 event: {
 addEventListener: noop
 }
 };

 initStep2([{
 o3d: null,
 client: {
 createPack: function() {
 return {
 createObject: function(typ) {
 switch(typ) {
 case 'Transform':
 return {
 parent: null,
 addShape: function(shape) {
 return null; // TODO
 }
 };
 }
 }
 }
 },
 renderGraphRoot: null
 }
 }]);

 */

o3djs.base.o3d = o3d;
o3djs.require('o3djs.webgl');

o3djs.require('o3djs.util');
o3djs.require('o3djs.math');
o3djs.require('o3djs.rendergraph');
o3djs.require('o3djs.primitives');
o3djs.require('o3djs.material');



// constants
var MOVE_VELOCITY = 25;  // in units per second.
var ROTATE_VELOCITY = 1; // in radians per second

// global variables
var g_o3dElement;
var g_o3d;
var g_math;
var g_client;
var g_viewInfo;
var g_pack;
var g_globalParams;
var g_o3dWidth;
var g_o3dHeight;

var g_playerTransform = [];
var g_playerJoint = [];
var g_playerMovement = [];

var g_eye = [15, 15, 60];
var g_target = [0, 0, 0];
var g_up = [0, 1, 0];
var g_viewMatrix;

var g_error = 0;
var return_register = "";


/**
 * Updates the projection matrix.
 */
function updateProjection() {
    g_viewInfo.drawContext.projection = g_math.matrix4.perspective(
        g_math.degToRad(45),       // field of view.
        g_o3dWidth / g_o3dHeight,  // aspect ratio
        0.1,                       // Near plane.
        5000);                     // Far plane.
}

/*
 * Updates the camera.
 */
function updateCamera() {
    g_viewMatrix = g_math.matrix4.lookAt(g_eye, g_target, g_up);
    g_viewInfo.drawContext.view = g_viewMatrix;
}

/**
 * Updates global variables of the client's size if they have changed.
 */
function updateClientSize() {
    var newWidth = g_client.width;
    var newHeight = g_client.height;
    if (g_o3dWidth != newWidth || g_o3dHeight != newHeight) {
        g_o3dWidth = newWidth;
        g_o3dHeight = newHeight;
        updateProjection();
    }
}


/**
 * Initializes O3D and creates the BASIC character shape.
 * @param {Array} clientElements Array of o3d object elements.
 */
function initStep2(clientElements) {
    // Initializes global variables and libraries.
    g_o3dElement = clientElements[0];
    g_o3d = g_o3dElement.o3d;
    g_math = o3djs.math;
    g_client = g_o3dElement.client;

    // Creates a pack to manage our resources/assets
    g_pack = g_client.createPack();

    g_root = g_pack.createObject('Transform');

    g_viewInfo = o3djs.rendergraph.createBasicView(
        g_pack,
        g_root,
        g_client.renderGraphRoot);

    g_viewInfo.clearBuffer.clearColor = [
        0.88,0.85,0.8,1];

    updateCamera();

    var redMaterial = o3djs.material.createBasicMaterial(
        g_pack,
        g_viewInfo,
        [0.2, 0.4, 0.5, 1]);  // green

    // var checkerMaterial = o3djs.material.createMaterialFromFile(
    //   g_pack, 'shaders/checker.shader', g_viewInfo.performanceDrawList);

    g_globalParams = o3djs.material.createAndBindStandardParams(g_pack);
    g_globalParams.lightWorldPos.value = [30, 60, 40];
    g_globalParams.lightColor.value = [1, 1, 1, 1];

    // Create the body for my character
    var bodyShape = o3djs.primitives.createBox(
        g_pack, redMaterial, 6.5, 8, 3,
        g_math.matrix4.translation([0, 4, 0]));

    var transformCOG = g_pack.createObject('Transform');
    transformCOG.parent = g_root;

    var bendCOG = g_pack.createObject('Transform');
    bendCOG.parent = transformCOG;
    bendCOG.addShape(bodyShape);

    // Create a head for my character
    var head = o3djs.primitives.createSphere(
        g_pack, redMaterial, 2.5, 18, 18,
        g_math.matrix4.translation([0, 11, 0]));
    var transformHead = g_pack.createObject('Transform');
    transformHead.parent = bendCOG;
    transformHead.addShape(head);

    // Create arms for my character - left
    var upper_arm_left = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1, 5.25, 18, 10,
        g_math.matrix4.translation([4, 4.625, 0]));
    var joint_arm_left = o3djs.primitives.createSphere(
        g_pack, redMaterial, 1.05, 18, 18,
        g_math.matrix4.translation([4, 2.0, 0]));
    var transformArmLeft = g_pack.createObject('Transform');
    transformArmLeft.parent = bendCOG;
    transformArmLeft.addShape(upper_arm_left);
    transformArmLeft.addShape(joint_arm_left);

    var lower_arm_left = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1, 4.25, 18, 10,
        g_math.matrix4.translation([4, -0.125, 0]));
    var transformLowerArmLeft = g_pack.createObject('Transform');
    transformLowerArmLeft.parent = transformArmLeft;
    transformLowerArmLeft.addShape(lower_arm_left);

    // Create arms for my character - right
    var upper_arm_right = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1, 5.25, 18, 10,
        g_math.matrix4.translation([-4, 4.625, 0]));
    var joint_arm_right = o3djs.primitives.createSphere(
        g_pack, redMaterial, 1.05, 18, 18,
        g_math.matrix4.translation([-4, 2.0, 0]));
    var transformArmRight = g_pack.createObject('Transform');
    transformArmRight.parent = bendCOG;
    transformArmRight.addShape(upper_arm_right);
    transformArmRight.addShape(joint_arm_right);

    var lower_arm_right = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1, 4.25, 18, 10,
        g_math.matrix4.translation([-4, -0.125, 0]));
    var transformLowerArmRight = g_pack.createObject('Transform');
    transformLowerArmRight.parent = transformArmRight;
    transformLowerArmRight.addShape(lower_arm_right);

    // Create legs for my character -left
    var upper_leg_left = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1.5, 6.75, 18, 10,
        g_math.matrix4.translation([1.8, -3.375, 0]));
    var knee_left = o3djs.primitives.createSphere(
        g_pack, redMaterial, 1.55, 18, 18,
        g_math.matrix4.translation([1.8, -6.75, 0]));
    var transformLegLeft = g_pack.createObject('Transform');
    transformLegLeft.parent = transformCOG;
    transformLegLeft.addShape(upper_leg_left);
    transformLegLeft.addShape(knee_left);

    var lower_leg_left = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1.5, 6, 18, 10,
        g_math.matrix4.translation([1.8, -9.75, 0]));
    var transformLowerLegLeft = g_pack.createObject('Transform');
    transformLowerLegLeft.parent = transformLegLeft;
    transformLowerLegLeft.addShape(lower_leg_left);

    var foot_left = o3djs.primitives.createBox(
        g_pack, redMaterial, 2.4, 1.2, 4.3,
        g_math.matrix4.translation([1.8, -13, 0.8]));
    var transformFootLeft = g_pack.createObject('Transform');
    transformFootLeft.parent = transformLowerLegLeft;
    transformFootLeft.addShape(foot_left);

    // Create legs for my character - right
    var upper_leg_right = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1.5, 6.75, 18, 10,
        g_math.matrix4.translation([-1.8, -3.375, 0]));
    var knee_right = o3djs.primitives.createSphere(
        g_pack, redMaterial, 1.55, 18, 18,
        g_math.matrix4.translation([-1.8, -6.75, 0]));
    var transformLegRight = g_pack.createObject('Transform');
    transformLegRight.parent = transformCOG;
    transformLegRight.addShape(upper_leg_right);
    transformLegRight.addShape(knee_right);

    var lower_leg_right = o3djs.primitives.createCylinder(
        g_pack, redMaterial, 1.5, 6, 18, 10,
        g_math.matrix4.translation([-1.8, -9.75, 0]));
    var transformLowerLegRight = g_pack.createObject('Transform');
    transformLowerLegRight.parent = transformLegRight;
    transformLowerLegRight.addShape(lower_leg_right);

    var foot_right = o3djs.primitives.createBox(
        g_pack, redMaterial, 2.4, 1.2, 4.3,
        g_math.matrix4.translation([-1.8, -13, 0.8]));
    var transformFootRight = g_pack.createObject('Transform');
    transformFootRight.parent = transformLowerLegRight;
    transformFootRight.addShape(foot_right);

    g_playerTransform[0] = transformCOG;
    g_playerTransform[1] = bendCOG;
    g_playerTransform[2] = transformArmLeft;
    g_playerTransform[3] = transformArmRight;
    g_playerTransform[4] = transformLegLeft;
    g_playerTransform[5] = transformLegRight;
    g_playerTransform[6] = transformHead;
    g_playerTransform[7] = transformLowerArmLeft;
    g_playerTransform[8] = transformLowerArmRight;
    g_playerTransform[9] = transformLowerLegLeft;
    g_playerTransform[10] = transformLowerLegRight;
    g_playerTransform[11] = transformFootLeft;
    g_playerTransform[12] = transformFootRight;

    g_playerJoint[0] = new Joint(0, 0, 0, 0);
    g_playerJoint[1] = new Joint(1, 0, 0, 0);
    g_playerJoint[2] = new Joint(2, 4, 7.5, 0);
    g_playerJoint[3] = new Joint(3, -4, 7.5, 0);
    g_playerJoint[4] = new Joint(4, 1.8, 0, 0);
    g_playerJoint[5] = new Joint(5, -1.8, 0, 0);
    g_playerJoint[6] = new Joint(6, 0, 8, 0);
    g_playerJoint[7] = new Joint(7, 4, 2, 0);
    g_playerJoint[8] = new Joint(8, -4, 2, 0);
    g_playerJoint[9] = new Joint(9, 1.8, -6.75, 0);
    g_playerJoint[10] = new Joint(10, -1.8, -6.75, 0);
    g_playerJoint[11] = new Joint(11, 1.8, -13, 0);
    g_playerJoint[12] = new Joint(12, -1.8, -13, 0);

    // Setup a render callback for per frame processing.
    g_client.setRenderCallback(onRender);

    o3djs.event.addEventListener(g_o3dElement, 'keydown', onKeyDown);
    o3djs.event.addEventListener(g_o3dElement, 'keyup', onKeyUp);
}

// constructor for Joint Class
function Joint(t_index, distx, disty, distz)
{
    this.transform_index = t_index;
    this.x = distx;			// distance from origin x
    this.y = disty;
    this.z = distz;
}

// constructor for Movement Class
function SingleMovement(x, y, z, xrot, yrot, zrot, time, index)
{
    this.cId = "SingleMovement";
    this.x_loc = x;
    this.y_loc = y;
    this.z_loc = z;
    this.x_rot = xrot;
    this.y_rot = yrot;
    this.z_rot = zrot;
    this.time = time;
    this.index = index;			// index of the joint for the movement

}

// constructor for Movement Class
function SingleMovementTo(x, y, z, time, index)
{
    this.cId = "SingleMovementTo";
    this.x_loc = x;
    this.y_loc = y;
    this.z_loc = z;
    this.time = time;
    this.index = index;			// index of the joint for the movement

}

// constructor for identity movement class
function Identity(index)
{
    this.cId = "Identity";
    this.index = index;			// index of the joint for the movement

}

function OrderMovements(arr)
{
    this.cId = "OrderMovements";
    this.movements = [];
    for (var i=0; i<arr.length; i++) {
        this.movements.push(arr[i]);
    }
}

function TogetherMovements(arr)
{
    this.cId = "TogetherMovements";
    this.movements = [];
    for (var i=0; i<arr.length; i++) {
        this.movements.push(arr[i]);
    }
}

function UserFunction(name, cmds, args)
{
    this.name = name;
    this.commands = cmds;
    this.arg_names = args;
}


// loop through all the animations and execute
function animate(time_inc) {
    for (var i=0; i < g_playerMovement.length; i++) {
        move = g_playerMovement[i];
        execute_move(move, time_inc);
    }
}

// recursive function to execute single moves, moves in order, or moves done together
function execute_move(move, etime) {
    var movex, movey, movez, rotx, roty, rotz;
    var i;
    var next_move, executed;

    switch (move.cId) {

        case "SingleMovement":

            if (move.time > 0) {
                if (etime > move.time) {
                    etime = move.time;
                }

                movex = etime * move.x_loc / move.time;
                movey = etime * move.y_loc / move.time;
                movez = etime * move.z_loc / move.time;
                rotx = etime * move.x_rot / move.time;
                roty = etime * move.y_rot / move.time;
                rotz = etime * move.z_rot / move.time;

                g_playerTransform[move.index].translate(g_playerJoint[move.index].x, g_playerJoint[move.index].y, g_playerJoint[move.index].z);
                g_playerTransform[move.index].translate(movex, movey, movez);
                g_playerTransform[move.index].rotateX(rotx);
                g_playerTransform[move.index].rotateY(roty);
                g_playerTransform[move.index].rotateZ(rotz);
                g_playerTransform[move.index].translate(-g_playerJoint[move.index].x, -g_playerJoint[move.index].y, -g_playerJoint[move.index].z);

                move.x_loc -= movex;
                move.y_loc -= movey;
                move.z_loc -= movez;
                move.x_rot -= rotx;
                move.y_rot -= roty;
                move.z_rot -= rotz;
                move.time -= etime;
                return true;

            } else { return false; }

            break;

        case "SingleMovementTo":

            if (move.time > 0) {
                if (etime > move.time) {
                    etime = move.time;
                }

                l_matrix = g_playerTransform[move.index].localMatrix[3];

                movex = etime * (move.x_loc - l_matrix[0]) / move.time;
                movey = etime * (move.y_loc - l_matrix[1]) / move.time;
                movez = etime * (move.z_loc - l_matrix[2]) / move.time;

                g_playerTransform[move.index].translate(g_playerJoint[move.index].x, g_playerJoint[move.index].y, g_playerJoint[move.index].z);
                g_playerTransform[move.index].translate(movex, movey, movez);
                g_playerTransform[move.index].translate(-g_playerJoint[move.index].x, -g_playerJoint[move.index].y, -g_playerJoint[move.index].z);

                move.x_rot -= rotx;
                move.y_rot -= roty;
                move.z_rot -= rotz;
                move.time -= etime;
                return true;

            } else { return false; }

            break;

        case "Identity":

            g_playerTransform[move.index].identity();
            return true;

        // if we can pop off empty movements, this will be easier
        case "OrderMovements":
            for (i=0; i < move.movements.length; i++) {
                next_move = move.movements[i];
                executed = execute_move(next_move, etime);
                if (executed) {
                    return true;
                }
            }
            return false;

        case "TogetherMovements":
            executed = false;
            for (i=0; i < move.movements.length; i++) {
                next_move  = move.movements[i];
                if (execute_move(next_move, etime)) {
                    executed = true;
                }
            }
            return executed;
    }
}

function reset_all() {
    g_playerMovement = [];		// reset player movements
    g_functions = [];
    g_values = [];
    g_names = [];
    reset_me();
}

function reset_me() {
    for (var i=0; i < g_playerTransform.length; i++) {
        g_playerTransform[i].identity();
    }

    g_current_time = 0;
}


function stop_user_script() {
    g_playerMovement = [];		// reset player movements
    g_functions = [];
    g_values = [];
    g_names = [];
}

/**
 * Called every frame.
 * @param {!o3d.RenderEvent} renderEvent Rendering Information.
 */
function onRender(renderEvent) {
    var elapsedTime = renderEvent.elapsedTime;

    updateClientSize();
    animate(elapsedTime);
}

/**
 * Remove any callbacks so they don't get called after the page has unloaded.
 */
function unload() {
    if (g_client) {
        g_client.cleanup();
    }
}
