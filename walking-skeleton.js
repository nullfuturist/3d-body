// Walking skeleton model definition

// Create the joint system
const jointSystem = new JointSystem();

// Build the skeleton structure
const lowerTorso = addObject([0, 0, 0], [0, 1, 0], 0.6, 0.25, 0.2, 0.32, 0.24, null, null);
const upperTorso = addObject([0, 0, 0], [0, 1, 0], 0.6, 0.32, 0.24, 0.45, 0.26, lowerTorso, null);
const neck = addObject([0, 0, 0], [0, 1, 0], 0.3, 0.15, 0.15, 0.15, 0.15, upperTorso, null);

const head1 = addObject([0, 0, 0], [0, 1, 0], 0.25, 0.24, 0.22, 0.26, 0.23, neck, null);
const head2 = addObject([0, 0, 0], [0, 1, 0], 0.2, 0.26, 0.23, 0.28, 0.24, head1, null);

const rUpperArm = addObject([0, 0, 0], [0.8, -0.2, 0], 0.8, 0.15, 0.15, 0.12, 0.12, upperTorso, {index: 0, atEnd: true});
const rLowerArm = addObject([0, 0, 0], [0.7, -0.3, 0], 0.7, 0.12, 0.12, 0.1, 0.1, rUpperArm, null);
const rHand1 = addObject([0, 0, 0], [0.4, 0, 0], 0.15, 0.18, 0.04, 0.15, 0.03, rLowerArm, null);
const rHand2 = addObject([0, 0, 0], [0.35, 0, 0], 0.12, 0.15, 0.025, 0.12, 0.02, rHand1, null);

const lUpperArm = addObject([0, 0, 0], [-0.8, -0.2, 0], 0.8, 0.15, 0.15, 0.12, 0.12, upperTorso, {index: 3, atEnd: true});
const lLowerArm = addObject([0, 0, 0], [-0.7, -0.3, 0], 0.7, 0.12, 0.12, 0.1, 0.1, lUpperArm, null);
const lHand1 = addObject([0, 0, 0], [-0.4, 0, 0], 0.15, 0.18, 0.04, 0.15, 0.03, lLowerArm, null);
const lHand2 = addObject([0, 0, 0], [-0.35, 0, 0], 0.12, 0.15, 0.025, 0.12, 0.02, lHand1, null);

const rThigh = addObject([0, 0, 0], [0.1, -1, 0], 0.9, 0.18, 0.18, 0.15, 0.15, lowerTorso, {index: 0, atEnd: false});
const rLowerLeg = addObject([0, 0, 0], [0, -1, 0.1], 0.9, 0.15, 0.15, 0.12, 0.12, rThigh, null);
const rFoot1 = addObject([0, 0, 0], [0, -0.05, 0.5], 0.18, 0.13, 0.1, 0.12, 0.06, rLowerLeg, null);
const rFoot2 = addObject([0, 0, 0], [0, 0.02, 0.6], 0.14, 0.12, 0.05, 0.1, 0.04, rFoot1, null);

const lThigh = addObject([0, 0, 0], [-0.1, -1, 0], 0.9, 0.18, 0.18, 0.15, 0.15, lowerTorso, {index: 3, atEnd: false});
const lLowerLeg = addObject([0, 0, 0], [0, -1, 0.1], 0.9, 0.15, 0.15, 0.12, 0.12, lThigh, null);
const lFoot1 = addObject([0, 0, 0], [0, -0.05, 0.5], 0.18, 0.13, 0.1, 0.12, 0.06, lLowerLeg, null);
const lFoot2 = addObject([0, 0, 0], [0, 0.02, 0.6], 0.14, 0.12, 0.05, 0.1, 0.04, lFoot1, null);

// Define joints with parent-child relationships
// Neck - subtle side-to-side rotation
const neckJoint = jointSystem.addJoint({
    obj: neck,
    baseDir: [0, 1, 0],
    axis: [0, 1, 0],
    min: -0.3,
    max: 0.3,
    speed: 0.5,
    offset: 0
});

// Right arm chain
const rShoulderJoint = jointSystem.addJoint({
    obj: rUpperArm,
    baseDir: [0.8, -0.2, 0],
    axis: [0, 0, 1],
    min: -0.4,
    max: 0.6,
    speed: 0.6,
    offset: 0
});

const rElbowJoint = jointSystem.addJoint({
    obj: rLowerArm,
    baseDir: [0.7, -0.3, 0],
    axis: [0, 0, 1],
    min: 0.1,
    max: 2.0,
    speed: 0.7,
    offset: Math.PI
});

const rWristJoint = jointSystem.addJoint({
    obj: rHand1,
    baseDir: [0.4, 0, 0],
    axis: [1, 0, 0],
    min: -0.2,
    max: 0.3,
    speed: 0.8,
    offset: 0.5
});

// Left arm chain
const lShoulderJoint = jointSystem.addJoint({
    obj: lUpperArm,
    baseDir: [-0.8, -0.2, 0],
    axis: [0, 0, 1],
    min: -0.4,
    max: 0.6,
    speed: 0.6,
    offset: Math.PI
});

const lElbowJoint = jointSystem.addJoint({
    obj: lLowerArm,
    baseDir: [-0.7, -0.3, 0],
    axis: [0, 0, 1],
    min: -2.0,
    max: -0.1,
    speed: 0.7,
    offset: 0
});

const lWristJoint = jointSystem.addJoint({
    obj: lHand1,
    baseDir: [-0.4, 0, 0],
    axis: [1, 0, 0],
    min: -0.3,
    max: 0.2,
    speed: 0.8,
    offset: 2.5
});

// Right leg chain
const rHipJoint = jointSystem.addJoint({
    obj: rThigh,
    baseDir: [0.1, -1, 0],
    axis: [1, 0, 0],
    min: -0.3,
    max: 0.5,
    speed: 0.55,
    offset: 0,
    children: [10, 11] // Right knee and ankle will have their axes updated
});

const rKneeJoint = jointSystem.addJoint({
    obj: rLowerLeg,
    baseDir: [0, -1, 0.1],
    axis: [1, 0, 0],
    min: -1.8,
    max: -0.1,
    speed: 0.65,
    offset: 0.3,
    children: [11] // Right ankle
});

const rAnkleJoint = jointSystem.addJoint({
    obj: rFoot1,
    baseDir: [0, -0.05, 0.5],
    axis: [1, 0, 0],
    min: -0.2,
    max: 0.3,
    speed: 0.75,
    offset: 1.0
});

// Left leg chain
const lHipJoint = jointSystem.addJoint({
    obj: lThigh,
    baseDir: [-0.1, -1, 0],
    axis: [0, 0, 0],
    min: -0.3,
    max: 0.5,
    speed: 0.55,
    offset: Math.PI,
    children: [13, 14] // Left knee and ankle will have their axes updated
});

const lKneeJoint = jointSystem.addJoint({
    obj: lLowerLeg,
    baseDir: [0, -1, 0.1],
    axis: [1, 0, 0],
    min: -1.8,
    max: -0.1,
    speed: 0.65,
    offset: Math.PI + 0.3,
    children: [14] // Left ankle
});

const lAnkleJoint = jointSystem.addJoint({
    obj: lFoot1,
    baseDir: [0, -0.05, 0.5],
    axis: [1, 0, 0],
    min: -0.2,
    max: 0.3,
    speed: 0.75,
    offset: Math.PI + 1.0
});

// Start the animation
jointSystem.animate();
