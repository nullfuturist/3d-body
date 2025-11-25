// webgl-setup.js
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const vertexShaderSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
varying vec3 vNormal;
varying vec3 vFragPos;
void main() {
    vec4 worldPos = uModel * vec4(aPosition, 1.0);
    vFragPos = worldPos.xyz;
    vNormal = mat3(uModel) * aNormal;
    gl_Position = uProjection * uView * worldPos;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vFragPos;
uniform vec3 uLightPos;
uniform vec3 uViewPos;
void main() {
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 ambient = vec3(0.2);
    vec3 diffuse = diff * vec3(1.0);
    vec3 color = (ambient + diffuse) * vec3(0.6, 0.7, 0.8);
    gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const aPosition = gl.getAttribLocation(program, 'aPosition');
const aNormal = gl.getAttribLocation(program, 'aNormal');
const uModel = gl.getUniformLocation(program, 'uModel');
const uView = gl.getUniformLocation(program, 'uView');
const uProjection = gl.getUniformLocation(program, 'uProjection');
const uLightPos = gl.getUniformLocation(program, 'uLightPos');
const uViewPos = gl.getUniformLocation(program, 'uViewPos');

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.1, 0.1, 0.15, 1.0);

function createTowerGeometry(segments, sides, widthStart, depthStart, widthEnd, depthEnd) {
    const vertices = [];
    const normals = [];
    const indices = [];
    
    let vertIndex = 0;
    for (let i = 0; i < segments; i++) {
        const t0 = i / segments;
        const t1 = (i + 1) / segments;
        
        const w0 = widthStart + (widthEnd - widthStart) * t0;
        const d0 = depthStart + (depthEnd - depthStart) * t0;
        const w1 = widthStart + (widthEnd - widthStart) * t1;
        const d1 = depthStart + (depthEnd - depthStart) * t1;
        
        for (let j = 0; j < sides; j++) {
            const angle0 = (j * 2 * Math.PI) / sides;
            const angle1 = ((j + 1) * 2 * Math.PI) / sides;
            const angleMid = (angle0 + angle1) / 2;
            
            const x0_0 = Math.cos(angle0) * w0;
            const z0_0 = Math.sin(angle0) * d0;
            const x1_0 = Math.cos(angle1) * w0;
            const z1_0 = Math.sin(angle1) * d0;
            
            const x0_1 = Math.cos(angle0) * w1;
            const z0_1 = Math.sin(angle0) * d1;
            const x1_1 = Math.cos(angle1) * w1;
            const z1_1 = Math.sin(angle1) * d1;
            
            const nx = Math.cos(angleMid);
            const nz = Math.sin(angleMid);
            
            vertices.push(
                x0_0, t0, z0_0,
                x1_0, t0, z1_0,
                x0_1, t1, z0_1,
                x1_1, t1, z1_1
            );
            
            for (let k = 0; k < 4; k++) {
                normals.push(nx, 0, nz);
            }
            
            indices.push(
                vertIndex, vertIndex + 1, vertIndex + 2,
                vertIndex + 1, vertIndex + 3, vertIndex + 2
            );
            vertIndex += 4;
        }
    }
    
    return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
}

const SIDES = 6;

function normalize(v) {
    const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return len > 0 ? [v[0]/len, v[1]/len, v[2]/len] : [0, 1, 0];
}

function createViewMatrix(eye, target, up) {
    const z = normalize([eye[0]-target[0], eye[1]-target[1], eye[2]-target[2]]);
    const x = normalize([up[1]*z[2]-up[2]*z[1], up[2]*z[0]-up[0]*z[2], up[0]*z[1]-up[1]*z[0]]);
    const y = [z[1]*x[2]-z[2]*x[1], z[2]*x[0]-z[0]*x[2], z[0]*x[1]-z[1]*x[0]];
    return [
        x[0], y[0], z[0], 0,
        x[1], y[1], z[1], 0,
        x[2], y[2], z[2], 0,
        -(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),
        -(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),
        -(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]), 1
    ];
}

function createPerspectiveMatrix(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    return [
        f/aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far+near)/(near-far), -1,
        0, 0, (2*far*near)/(near-far), 0
    ];
}

const projMatrix = createPerspectiveMatrix(Math.PI/3, canvas.width/canvas.height, 0.1, 100);
gl.uniformMatrix4fv(uProjection, false, projMatrix);
gl.uniform3f(uLightPos, 5, 5, 5);
