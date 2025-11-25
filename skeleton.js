// Joint configuration with angle limits (in radians)
const joints = [
    // Neck - subtle side-to-side rotation
    { obj: null, baseDir: null, axis: [0, 1, 0], min: -0.3, max: 0.3, speed: 0.5, offset: 0 },
    
    // Right shoulder - forward/back swing
    { obj: null, baseDir: null, axis: [0, 0, 1], min: -0.4, max: 0.6, speed: 0.6, offset: 0 },
    
    // Right elbow - bending
    { obj: null, baseDir: null, axis: [0, 0, 1], min: 0.1, max: 2.0, speed: 0.7, offset: Math.PI },
    
    // Right wrist - slight rotation
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -0.2, max: 0.3, speed: 0.8, offset: 0.5 },
    
    // Left shoulder - forward/back swing (opposite phase)
    { obj: null, baseDir: null, axis: [0, 0, 1], min: -0.4, max: 0.6, speed: 0.6, offset: Math.PI },
    
    // Left elbow - bending
    { obj: null, baseDir: null, axis: [0, 0, 1], min: -2.0, max: -0.1, speed: 0.7, offset: 0 },
    
    // Left wrist - slight rotation
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -0.3, max: 0.2, speed: 0.8, offset: 2.5 },
    
    // Right hip - leg swing
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -0.3, max: 0.5, speed: 0.55, offset: 0 },
    
    // Right knee - bending
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -1.8, max: -0.1, speed: 0.65, offset: 0.3 },
    
    // Right ankle - flexion
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -0.2, max: 0.3, speed: 0.75, offset: 1.0 },
    
    // Left hip - leg swing (opposite phase)
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -0.3, max: 0.5, speed: 0.55, offset: Math.PI },
    
    // Left knee - bending
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -1.8, max: -0.1, speed: 0.65, offset: Math.PI + 0.3 },
    
    // Left ankle - flexion
    { obj: null, baseDir: null, axis: [1, 0, 0], min: -0.2, max: 0.3, speed: 0.75, offset: Math.PI + 1.0 }
];

// Skeleton setup
const lowerTorso = addObject([0, 0, 0], [0, 1, 0], 0.6, 0.25, 0.2, 0.32, 0.24, null, null);
const upperTorso = addObject([0, 0, 0], [0, 1, 0], 0.6, 0.32, 0.24, 0.45, 0.26, lowerTorso, null);
const neck = addObject([0, 0, 0], [0, 1, 0], 0.3, 0.15, 0.15, 0.15, 0.15, upperTorso, null);
joints[0].obj = neck;
joints[0].baseDir = [0, 1, 0]; // Store original direction

const head1 = addObject([0, 0, 0], [0, 1, 0], 0.25, 0.24, 0.22, 0.26, 0.23, neck, null);
const head2 = addObject([0, 0, 0], [0, 1, 0], 0.2, 0.26, 0.23, 0.28, 0.24, head1, null);

const rUpperArm = addObject([0, 0, 0], [0.8, -0.2, 0], 0.8, 0.15, 0.15, 0.12, 0.12, upperTorso, {index: 0, atEnd: true});
joints[1].obj = rUpperArm;
joints[1].baseDir = [0.8, -0.2, 0];

const rLowerArm = addObject([0, 0, 0], [0.7, -0.3, 0], 0.7, 0.12, 0.12, 0.1, 0.1, rUpperArm, null);
joints[2].obj = rLowerArm;
joints[2].baseDir = [0.7, -0.3, 0];

const rHand1 = addObject([0, 0, 0], [0.4, 0, 0], 0.15, 0.18, 0.04, 0.15, 0.03, rLowerArm, null);
joints[3].obj = rHand1;
joints[3].baseDir = [0.4, 0, 0];

const rHand2 = addObject([0, 0, 0], [0.35, 0, 0], 0.12, 0.15, 0.025, 0.12, 0.02, rHand1, null);

const lUpperArm = addObject([0, 0, 0], [-0.8, -0.2, 0], 0.8, 0.15, 0.15, 0.12, 0.12, upperTorso, {index: 3, atEnd: true});
joints[4].obj = lUpperArm;
joints[4].baseDir = [-0.8, -0.2, 0];

const lLowerArm = addObject([0, 0, 0], [-0.7, -0.3, 0], 0.7, 0.12, 0.12, 0.1, 0.1, lUpperArm, null);
joints[5].obj = lLowerArm;
joints[5].baseDir = [-0.7, -0.3, 0];

const lHand1 = addObject([0, 0, 0], [-0.4, 0, 0], 0.15, 0.18, 0.04, 0.15, 0.03, lLowerArm, null);
joints[6].obj = lHand1;
joints[6].baseDir = [-0.4, 0, 0];

const lHand2 = addObject([0, 0, 0], [-0.35, 0, 0], 0.12, 0.15, 0.025, 0.12, 0.02, lHand1, null);

const rThigh = addObject([0, 0, 0], [0.1, -1, 0], 0.9, 0.18, 0.18, 0.15, 0.15, lowerTorso, {index: 0, atEnd: false});
joints[7].obj = rThigh;
joints[7].baseDir = [0.1, -1, 0];

const rLowerLeg = addObject([0, 0, 0], [0, -1, 0.1], 0.9, 0.15, 0.15, 0.12, 0.12, rThigh, null);
joints[8].obj = rLowerLeg;
joints[8].baseDir = [0, -1, 0.1];

const rFoot1 = addObject([0, 0, 0], [0, -0.05, 0.5], 0.18, 0.13, 0.1, 0.12, 0.06, rLowerLeg, null);
joints[9].obj = rFoot1;
joints[9].baseDir = [0, -0.05, 0.5];

const rFoot2 = addObject([0, 0, 0], [0, 0.02, 0.6], 0.14, 0.12, 0.05, 0.1, 0.04, rFoot1, null);

const lThigh = addObject([0, 0, 0], [-0.1, -1, 0], 0.9, 0.18, 0.18, 0.15, 0.15, lowerTorso, {index: 3, atEnd: false});
joints[10].obj = lThigh;
joints[10].baseDir = [-0.1, -1, 0];

const lLowerLeg = addObject([0, 0, 0], [0, -1, 0.1], 0.9, 0.15, 0.15, 0.12, 0.12, lThigh, null);
joints[11].obj = lLowerLeg;
joints[11].baseDir = [0, -1, 0.1];

const lFoot1 = addObject([0, 0, 0], [0, -0.05, 0.5], 0.18, 0.13, 0.1, 0.12, 0.06, lLowerLeg, null);
joints[12].obj = lFoot1;
joints[12].baseDir = [0, -0.05, 0.5];

const lFoot2 = addObject([0, 0, 0], [0, 0.02, 0.6], 0.14, 0.12, 0.05, 0.1, 0.04, lFoot1, null);

// Helper function to rotate a vector around an axis by angle
function rotateVector(vec, axis, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dot = axis[0] * vec[0] + axis[1] * vec[1] + axis[2] * vec[2];
    
    return [
        vec[0] * cos + (axis[1] * vec[2] - axis[2] * vec[1]) * sin + axis[0] * dot * (1 - cos),
        vec[1] * cos + (axis[2] * vec[0] - axis[0] * vec[2]) * sin + axis[1] * dot * (1 - cos),
        vec[2] * cos + (axis[0] * vec[1] - axis[1] * vec[0]) * sin + axis[2] * dot * (1 - cos)
    ];
}

function normalize(v) {
    const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return len > 0 ? [v[0]/len, v[1]/len, v[2]/len] : v;
}

// Update joint angles
function updateJoints(time) {
    joints.forEach(joint => {
        if (!joint.obj || !joint.baseDir) return;
        
        const obj = objects.get(joint.obj);
        if (!obj) return;
        
        // Calculate angle using sine wave for smooth back-and-forth motion
        const t = Math.sin(time * joint.speed + joint.offset) * 0.5 + 0.5;
        const angle = joint.min + (joint.max - joint.min) * t;
        
        // Rotate from the BASE direction (not accumulated)
        const rotated = rotateVector(joint.baseDir, joint.axis, angle);
        
        // Update the object's direction
        updateObject(
            joint.obj,
            obj.point,
            rotated,
            obj.length,
            obj.widthStart,
            obj.depthStart,
            obj.widthEnd,
            obj.depthEnd,
            obj.parent,
            obj.attachVertex
        );
    });
}

let time = 0;
function render() {
    time += 0.01;
    
    // Update all joint angles
    updateJoints(time);
    
    // Update camera
    const radius = 8;
    const camX = Math.cos(time * 0.3) * radius;
    const camZ = Math.sin(time * 0.3) * radius;
    const viewMatrix = createViewMatrix([camX, 2, camZ], [0, 1, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(uView, false, viewMatrix);
    gl.uniform3f(uViewPos, camX, 2, camZ);
    
    renderAll();
    
    requestAnimationFrame(render);
}
render();
