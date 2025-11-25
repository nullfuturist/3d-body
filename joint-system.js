// Reusable joint animation system

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

// Joint system class
class JointSystem {
    constructor() {
        this.joints = [];
    }
    
    addJoint(config) {
        // config: { obj, baseDir, axis, min, max, speed, offset, children }
        this.joints.push({
            ...config,
            currentAxis: config.axis ? [...config.axis] : null,
            currentBaseDir: config.baseDir ? [...config.baseDir] : null,
            children: config.children || []
        });
        return this.joints.length - 1;
    }
    
    // Recursively update child transforms based on parent rotation
    updateChildTransforms(parentJoint, parentRotation, parentCurrentDir) {
        parentJoint.children.forEach(childIndex => {
            const child = this.joints[childIndex];
            if (!child) return;
            
            // Always rotate the child's base direction - the attachment point follows the parent
            child.currentBaseDir = rotateVector(child.baseDir, parentJoint.axis, parentRotation);
            
            // Only rotate the child's rotation axis if it's aligned with the parent
            // Check alignment by seeing if axes are parallel or anti-parallel
            const dot = Math.abs(
                child.axis[0] * parentJoint.axis[0] + 
                child.axis[1] * parentJoint.axis[1] + 
                child.axis[2] * parentJoint.axis[2]
            );
            
            // If axes are aligned (dot product close to 1), rotate the child's axis too
            if (dot > 0.9) {
                child.currentAxis = rotateVector(child.axis, parentJoint.axis, parentRotation);
            } else {
                // Otherwise keep the original axis
                child.currentAxis = [...child.axis];
            }
            
            // Get the current direction for this child to pass to its children
            const childCurrentDir = child.currentBaseDir || child.baseDir;
            
            // Recursively update grandchildren
            this.updateChildTransforms(child, parentRotation, childCurrentDir);
        });
    }
    
    updateJoints(time) {
        this.joints.forEach((joint, index) => {
            if (!joint.obj || !joint.baseDir) return;
            
            const obj = objects.get(joint.obj);
            if (!obj) return;
            
            // Calculate angle using sine wave for smooth back-and-forth motion
            const t = Math.sin(time * joint.speed + joint.offset) * 0.5 + 0.5;
            const angle = joint.min + (joint.max - joint.min) * t;
            
            // Use current axis and baseDir (which may have been rotated by parent)
            const axisToUse = joint.currentAxis || joint.axis;
            const baseDirToUse = joint.currentBaseDir || joint.baseDir;
            
            // Rotate from the (possibly transformed) BASE direction
            const rotated = rotateVector(baseDirToUse, axisToUse, angle);
            
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
            
            // Update child transforms if this joint has children
            if (joint.children && joint.children.length > 0) {
                this.updateChildTransforms(joint, angle, rotated);
            }
        });
    }
    
    animate(timeStep = 0.01) {
        let time = 0;
        const self = this;
        
        function render() {
            time += timeStep;
            
            // Update all joint angles
            self.updateJoints(time);
            
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
    }
}
