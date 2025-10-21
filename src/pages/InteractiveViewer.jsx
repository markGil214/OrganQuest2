import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import interactiveConfigs from '../data/interactiveConfigs';

const InteractiveViewer = () => {
  // Extract organ from hash URL (e.g., #/interactive/heart -> heart)
  const getOrganFromHash = () => {
    const hash = window.location.hash.slice(1); // Remove #
    const parts = hash.split('/');
    return parts[1]; // Get the organ part from interactive/{organ}
  };
  
  const [organ, setOrgan] = useState(getOrganFromHash());
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Three.js refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);
  const heartLabelsRef = useRef([]);
  const raycasterRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  const clickablePartsRef = useRef([]);

  const config = interactiveConfigs[organ];

  useEffect(() => {
    if (!config) {
      window.location.hash = 'scan-explore';
      return;
    }

    initThreeJS();
    setupEventListeners();

    return () => {
      cleanup();
    };
  }, [organ]);

  const initThreeJS = () => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, config.lighting.ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, config.lighting.directionalIntensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const spotlight = new THREE.SpotLight(0xffffff, config.lighting.spotlightIntensity);
    spotlight.position.set(0, 10, 0);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.3;
    spotlight.castShadow = true;
    scene.add(spotlight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = config.cameraControls.enableZoom;
    controls.enableRotate = config.cameraControls.enableRotate;
    controls.enablePan = config.cameraControls.enablePan;
    controls.autoRotate = config.cameraControls.autoRotate;
    controls.minDistance = config.cameraControls.minDistance;
    controls.maxDistance = config.cameraControls.maxDistance;
    controlsRef.current = controls;

    // Raycaster for clicking
    raycasterRef.current = new THREE.Raycaster();

    // Load model
    loadModel();

    // Animation loop
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  const loadModel = () => {
    const loader = new GLTFLoader();

    console.log('=== Loading Model ===');
    console.log('Model path:', config.modelPath);

    loader.load(
      config.modelPath,
      (gltf) => {
        console.log('✅ Model loaded successfully!', gltf);
        const model = gltf.scene;
        modelRef.current = model;

        // Apply configuration
        model.scale.set(config.scale.x, config.scale.y, config.scale.z);
        model.position.set(0, config.position.y, 0);

        // Enable shadows and make parts clickable
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              if (!child.material.color) {
                child.material.color = new THREE.Color(0xffffff);
              }
              child.material.metalness = 0.3;
              child.material.roughness = 0.7;
              child.material.needsUpdate = true;

              child.userData.originalColor = child.material.color.clone();
            }

            clickablePartsRef.current.push(child);
            child.userData.clickable = true;

            console.log('Clickable part found:', child.name || 'unnamed');
          }
        });

        sceneRef.current.add(model);
        console.log('✅ Model added to scene. Clickable parts:', clickablePartsRef.current.length);

        // Set camera position from config if available
        if (config.cameraPosition && cameraRef.current) {
          cameraRef.current.position.set(
            config.cameraPosition.x,
            config.cameraPosition.y,
            config.cameraPosition.z
          );
          console.log('📷 Camera position set to:', config.cameraPosition);
        }

        // Create labels
        createHeartLabels();

        setIsLoading(false);
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
          console.log('📦 Loading progress:', percent + '%');
        }
      },
      (error) => {
        console.error('❌ Error loading model:', error);
        console.error('Model path was:', config.modelPath);
        setIsLoading(false);
      }
    );
  };

  const createHeartLabels = () => {
    const labelParts = config.labels || [];

    if (labelParts.length === 0) {
      console.log('No labels configured for this organ');
      return;
    }

    labelParts.forEach((part) => {
      const labelElement = document.createElement('div');
      labelElement.className = 'heart-label';
      labelElement.id = `label-${part.id}`;
      labelElement.textContent = part.id;
      labelElement.dataset.partId = part.id;

      // Add click handler to show modal
      labelElement.addEventListener('click', (e) => {
        handleLabelClick(part);
      });

      document.body.appendChild(labelElement);
      heartLabelsRef.current.push({
        element: labelElement,
        position: new THREE.Vector3(part.position.x, part.position.y, part.position.z),
        part: part
      });
    });
  };

  const handleLabelClick = (part) => {
    setSelectedPart(part);
    setShowModal(true);
  };

  const updateHeartLabels = () => {
    const model = modelRef.current;
    const camera = cameraRef.current;
    if (!model || !camera) return;

    heartLabelsRef.current.forEach((label) => {
      const vector = label.position.clone();
      vector.applyMatrix4(model.matrixWorld);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

      const isVisible = vector.z < 1 && vector.z > -1;

      if (isVisible) {
        label.element.style.left = x + 'px';
        label.element.style.top = y + 'px';
        label.element.style.display = 'flex';

        const opacity = Math.max(0.6, 1 - Math.abs(vector.z));
        label.element.style.opacity = opacity;
      } else {
        label.element.style.display = 'none';
      }
    });
  };

  const applyAnimation = () => {
    const model = modelRef.current;
    if (!model || !isAnimating) return;

    const time = Date.now() * 0.001;

    switch (config.animationType) {
      case 'beating':
        const beatScale = 1 + Math.sin(time * 3) * 0.05;
        model.scale.setScalar(config.scale.x * beatScale);
        break;

      case 'breathing':
        const breathScale = 1 + Math.sin(time * 1.5) * 0.03;
        model.scale.set(
          config.scale.x * breathScale,
          config.scale.y * (1 + Math.sin(time * 1.5) * 0.02),
          config.scale.z * breathScale
        );
        break;

      case 'pulsing':
        const pulseScale = 1 + Math.sin(time * 2) * 0.02;
        model.scale.setScalar(config.scale.x * pulseScale);
        break;

      default:
        break;
    }
  };

  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate);

    const controls = controlsRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    if (controls) controls.update();
    applyAnimation();
    updateHeartLabels();

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };

  const setupEventListeners = () => {
    // Handle clicks on 3D model
    const handleClick = (event) => {
      const raycaster = raycasterRef.current;
      const mouse = mouseRef.current;
      const camera = cameraRef.current;

      if (!raycaster || !camera) return;

      const canvas = rendererRef.current.domElement;
      const rect = canvas.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickablePartsRef.current, false);

      if (intersects.length > 0) {
        const clickedPart = intersects[0].object;
        console.log('Clicked on:', clickedPart.name || 'unnamed part');
      }
    };

    if (rendererRef.current) {
      rendererRef.current.domElement.addEventListener('click', handleClick);
    }
  };

  const cleanup = () => {
    // Stop animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    // Remove labels
    heartLabelsRef.current.forEach((label) => {
      if (label.element && label.element.parentNode) {
        label.element.parentNode.removeChild(label.element);
      }
    });
    heartLabelsRef.current = [];

    // Dispose Three.js objects
    if (modelRef.current) {
      sceneRef.current?.remove(modelRef.current);
      modelRef.current.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
      }
    }
  };

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.reset();
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleBack = () => {
    window.location.hash = 'scan-explore';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPart(null);
  };

  if (!config) {
    return null;
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading {config.name}...</p>
          </div>
        </div>
      )}

      {/* Three.js Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-3xl font-bold text-white text-center drop-shadow-lg">
          {config.title}
        </h1>
        <p className="text-white text-center mt-2 text-sm max-w-2xl mx-auto">
          {config.description}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          🔄 Reset View
        </button>
        <button
          onClick={toggleAnimation}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          {isAnimating ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button
          onClick={toggleInfo}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          ℹ️ Info
        </button>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-24 right-6 bg-black/80 backdrop-blur-sm text-white p-6 rounded-xl shadow-2xl max-w-sm z-20 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            {config.emoji} {config.name}
          </h2>
          <p className="text-sm mb-4 text-gray-300">{config.description}</p>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-2">Fun Facts:</h3>
            {config.funFacts.map((fact, index) => (
              <p key={index} className="text-sm text-gray-300">
                {fact}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPart && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedPart.icon}</span>
                  <h2 className="text-2xl font-bold text-white">{selectedPart.name}</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-red-400 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-200 mb-6 leading-relaxed">{selectedPart.description}</p>

              {/* Facts */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white mb-3">Key Facts:</h3>
                {selectedPart.facts.map((fact, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-start gap-2"
                  >
                    <span className="text-purple-400 font-bold">✓</span>
                    <p className="text-gray-200 text-sm">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles for labels */}
      <style>{`
        .heart-label {
          position: absolute;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          z-index: 10;
          pointer-events: auto;
        }

        .heart-label:hover {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InteractiveViewer;
