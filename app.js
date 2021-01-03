global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
import fragment from "./fragment.glsl";
import vertex from "./vertex.glsl";

const canvasSketch = require("canvas-sketch");

const settings = {
  animate: true,
  context: "webgl",
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, -3, -0.75);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  const geometry = new THREE.BufferGeometry();

  let count = 500;

  let position = new Float32Array(count * count * 3);
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      let u = Math.random() * 2 * Math.PI;
      let v = Math.random() * 2 * Math.PI;

      position.set(
        [(i / count - 0.5) * 15, (j / count - 0.5) * 15, 0],
        3 * (count * i + j)
      );
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

  const material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0 },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1),
      },
    },
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      // time += 0.05;
      material.uniforms.time.value = time;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
