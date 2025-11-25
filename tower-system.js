// tower-system.js
const objects = new Map();
const geometryCache = new Map();
let nextId = 0;

function getOrCreateGeometry(widthStart, depthStart, widthEnd, depthEnd) {
    const key = `${widthStart},${depthStart},${widthEnd},${depthEnd}`;
    if (geometryCache.has(key)) {
        return geometryCache.get(key);
    }
    
    const geometry = createTowerGeometry(10, SIDES, widthStart, depthStart, widthEnd, depthEnd);
    
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
    
    const normBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.normals, gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
    
    const result = { posBuffer, normBuffer, indexBuffer, indexCount: geometry.indices.length };
    geometryCache.set(key, result);
    return result;
}

function addObject(point, direction, length, widthStart, depthStart, widthEnd, depthEnd, parent = null, attachVertex = null) {
    const id = nextId++;
    objects.set(id, { point, direction, length, widthStart, depthStart, widthEnd, depthEnd, parent, attachVertex });
    return id;
}

function removeObject(id) {
    objects.delete(id);
}

function updateObject(id, point, direction, length, widthStart, depthStart, widthEnd, depthEnd, parent, attachVertex) {
    if (objects.has(id)) {
        objects.set(id, { point, direction, length, widthStart, depthStart, widthEnd, depthEnd, parent, attachVertex });
    }
}

function getVertexPosition(obj, vertexIndex, atEnd) {
    const base = getBasePoint(obj);
    const dir = normalize(obj.direction);
    
    let right, newUp;
    if (Math.abs(dir[1]) > 0.999) {
        right = [1, 0, 0];
        newUp = [0, 0, dir[1] > 0 ? 1 : -1];
    } else {
        const up = [0, 1, 0];
        right = normalize([
            up[1]*dir[2] - up[2]*dir[1],
            up[2]*dir[0] - up[0]*dir[2],
            up[0]*dir[1] - up[1]*dir[0]
        ]);
        newUp = [
            dir[1]*right[2] - dir[2]*right[1],
            dir[2]*right[0] - dir[0]*right[2],
            dir[0]*right[1] - dir[1]*right[0]
        ];
    }
    
    const width = atEnd ? obj.widthEnd : obj.widthStart;
    const depth = atEnd ? obj.depthEnd : obj.depthStart;
    const yOffset = atEnd ? obj.length : 0;
    
    const angle = (vertexIndex * 2 * Math.PI) / SIDES;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    
    return [
        base[0] + right[0] * x * width + newUp[0] * z * depth + dir[0] * yOffset,
        base[1] + right[1] * x * width + newUp[1] * z * depth + dir[1] * yOffset,
        base[2] + right[2] * x * width + newUp[2] * z * depth + dir[2] * yOffset
    ];
}

function getBasePoint(obj) {
    if (obj.parent === null) {
        return obj.point;
    }
    const parent = objects.get(obj.parent);
    if (!parent) return obj.point;
    
    if (obj.attachVertex === null) {
        const parentBase = getBasePoint(parent);
        const dir = normalize(parent.direction);
        return [
            parentBase[0] + dir[0] * parent.length,
            parentBase[1] + dir[1] * parent.length,
            parentBase[2] + dir[2] * parent.length
        ];
    } else {
        const isEnd = obj.attachVertex.atEnd;
        const vertexIndex = obj.attachVertex.index;
        return getVertexPosition(parent, vertexIndex, isEnd);
    }
}

function createModelMatrix(obj) {
    const base = getBasePoint(obj);
    const dir = normalize(obj.direction);
    
    let right, newUp;
    if (Math.abs(dir[1]) > 0.999) {
        right = [1, 0, 0];
        newUp = [0, 0, dir[1] > 0 ? 1 : -1];
    } else {
        const up = [0, 1, 0];
        right = normalize([
            up[1]*dir[2] - up[2]*dir[1],
            up[2]*dir[0] - up[0]*dir[2],
            up[0]*dir[1] - up[1]*dir[0]
        ]);
        newUp = [
            dir[1]*right[2] - dir[2]*right[1],
            dir[2]*right[0] - dir[0]*right[2],
            dir[0]*right[1] - dir[1]*right[0]
        ];
    }
    
    return [
        right[0], right[1], right[2], 0,
        dir[0] * obj.length, dir[1] * obj.length, dir[2] * obj.length, 0,
        newUp[0], newUp[1], newUp[2], 0,
        base[0], base[1], base[2], 1
    ];
}

function renderAll() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    objects.forEach(obj => {
        const geom = getOrCreateGeometry(obj.widthStart, obj.depthStart, obj.widthEnd, obj.depthEnd);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.posBuffer);
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geom.normBuffer);
        gl.enableVertexAttribArray(aNormal);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.indexBuffer);
        
        const modelMatrix = createModelMatrix(obj);
        gl.uniformMatrix4fv(uModel, false, modelMatrix);
        gl.drawElements(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0);
    });
}
