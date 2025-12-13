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
  const [showDiseases, setShowDiseases] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);

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
      window.innerWidth / window.innerHeight,
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    // Mobile and low-end device optimizations
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isEmulator = /sdk_gphone|Emulator/i.test(navigator.userAgent);
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isLowMemory || isAndroid || isEmulator || isMobile) {
      console.log('🔧 Mobile/Low-end device detected, applying optimizations...');
      
      if (rendererRef.current) {
        // Reduce pixel ratio for better performance
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        
        // Disable shadows on low-end devices
        rendererRef.current.shadowMap.enabled = false;
        
        console.log('✅ Renderer optimized for mobile');
      }
      
      if (sceneRef.current) {
        // Reduce light complexity
        sceneRef.current.children.forEach(child => {
          if (child.isLight) {
            if (child.type === 'SpotLight') {
              child.intensity *= 0.6;
              child.castShadow = false;
            }
            if (child.type === 'DirectionalLight') {
              child.intensity *= 0.8;
              child.castShadow = false;
            }
          }
        });
        
        console.log('✅ Lighting optimized for performance');
      }
    }

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
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
    setSelectedDisease(null);
    setShowModal(true);
  };

  const handleDiseaseClick = (disease, partName) => {
    setSelectedDisease({ disease, partName });
    setSelectedPart(null);
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

  const toggleDiseases = () => {
    setShowDiseases(!showDiseases);
  };

  const handleBack = () => {
    window.location.hash = 'scan-explore';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPart(null);
    setSelectedDisease(null);
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

      {/* Back Button - Top Left */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 z-20 backdrop-blur-sm"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="absolute top-16 md:top-4 left-0 right-0 px-6 pt-2 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center drop-shadow-lg">
          {config.title}
        </h1>
        <p className="text-white text-center mt-2 text-xs md:text-sm max-w-2xl mx-auto">
          {config.description}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        <button
          onClick={toggleDiseases}
          className={`px-4 py-2 ${showDiseases ? 'bg-red-700' : 'bg-red-600'} hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2`}
        >
          ⚠️ Diseases
        </button>
        <button
          onClick={toggleInfo}
          className={`px-4 py-2 ${showInfo ? 'bg-green-700' : 'bg-green-600'} hover:bg-green-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2`}
        >
          ℹ️ Info
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-24 md:top-28 right-4 md:right-6 bg-black/80 backdrop-blur-sm text-white p-4 md:p-6 rounded-xl shadow-2xl max-w-xs md:max-w-sm z-20 animate-fadeIn max-h-[70vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              {config.emoji} {config.name}
            </h2>
            <button
              onClick={toggleInfo}
              className="text-white hover:text-red-400 text-xl transition-colors ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <p className="text-xs md:text-sm mb-4 text-gray-300">{config.description}</p>
          <div className="space-y-2">
            <h3 className="font-semibold text-base md:text-lg mb-2">Fun Facts:</h3>
            {config.funFacts.map((fact, index) => (
              <p key={index} className="text-xs md:text-sm text-gray-300">
                {fact}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Diseases Panel */}
      {showDiseases && (
        <div className="absolute top-24 md:top-28 left-4 md:left-6 bg-black/80 backdrop-blur-sm text-white p-4 md:p-6 rounded-xl shadow-2xl max-w-xs md:max-w-sm z-20 animate-fadeIn border border-red-500/30 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-red-400">
              ⚠️ Common Diseases
            </h2>
            <button
              onClick={toggleDiseases}
              className="text-white hover:text-red-400 text-xl transition-colors ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <p className="text-xs md:text-sm mb-4 text-gray-300">
            Click on a disease to learn more about it.
          </p>
          <div className="space-y-2">
            {config.labels && config.labels.length > 0 ? (
              (() => {
                // Collect all diseases from all labels
                const allDiseases = [];
                config.labels.forEach((label) => {
                  if (label.diseases && label.diseases.length > 0) {
                    label.diseases.forEach((disease) => {
                      allDiseases.push({ disease, partName: label.name });
                    });
                  }
                });

                return allDiseases.length > 0 ? (
                  allDiseases.map((item, index) => {
                    const [diseaseName, ...descParts] = item.disease.split(' - ');
                    const description = descParts.join(' - ');
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleDiseaseClick(item.disease, item.partName)}
                        className="w-full bg-red-900/20 hover:bg-red-900/40 rounded-lg p-3 border border-red-500/30 text-left transition-all duration-200 cursor-pointer"
                      >
                        <p className="font-semibold text-sm md:text-base text-red-400 mb-1">
                          {diseaseName}
                        </p>
                        {description && (
                          <p className="text-xs text-gray-400">
                            {description}
                          </p>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs md:text-sm text-gray-400 italic">
                    No disease information available for this organ.
                  </p>
                );
              })()
            ) : (
              <p className="text-xs md:text-sm text-gray-400 italic">
                No disease information available for this organ.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (selectedPart || selectedDisease) && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Show Disease Info */}
              {selectedDisease && (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">⚠️</span>
                      <div>
                        <h2 className="text-2xl font-bold text-red-400">
                          {selectedDisease.disease.split(' - ')[0]}
                        </h2>
                        <p className="text-sm text-gray-300">Affects: {selectedDisease.partName}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-white hover:text-red-400 text-2xl transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Description */}
                  <div className="bg-red-900/20 backdrop-blur-sm rounded-lg p-4 mb-4 border border-red-500/30">
                    <p className="text-gray-200 leading-relaxed">
                      {selectedDisease.disease.split(' - ').slice(1).join(' - ') || 'A medical condition affecting this organ part.'}
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      ℹ️ Important Information
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      This disease affects the <span className="font-semibold text-red-400">{selectedDisease.partName}</span> of the {config.name.toLowerCase()}. 
                      If you experience symptoms related to this condition, please consult with a healthcare professional for proper diagnosis and treatment.
                    </p>
                  </div>
                </>
              )}

              {/* Show Part Info */}
              {selectedPart && (
                <>
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

                  {/* Diseases */}
                  {selectedPart.diseases && selectedPart.diseases.length > 0 && (
                    <div className="space-y-3 mt-6">
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        ⚠️ Common Diseases:
                      </h3>
                      {selectedPart.diseases.map((disease, index) => {
                        const [diseaseName, ...descParts] = disease.split(' - ');
                        const description = descParts.join(' - ');
                        
                        return (
                          <div
                            key={index}
                            className="bg-red-900/20 backdrop-blur-sm rounded-lg p-3 flex items-start gap-2 border border-red-500/30"
                          >
                            <span className="text-red-400 font-bold">⚕️</span>
                            <div>
                              <p className="text-red-400 font-semibold text-sm">{diseaseName}</p>
                              {description && (
                                <p className="text-gray-300 text-xs mt-1">{description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles for labels */}
      <style>{`
        .heart-label {
          position: absolute;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          z-index: 10;
          pointer-events: auto;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Larger touch targets on mobile */
        @media (max-width: 768px) {
          .heart-label {
            width: 55px;
            height: 55px;
            font-size: 20px;
            border: 4px solid white;
          }
        }

        .heart-label:hover,
        .heart-label:active {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        /* Prevent text selection on touch */
        .heart-label * {
          user-select: none;
          -webkit-user-select: none;
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

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .fixed.inset-0 {
            padding: 0.5rem;
          }
          
          .max-w-2xl {
            max-width: 100%;
            margin: 0.5rem;
          }

          /* Stack back button above title on mobile */
          .absolute.top-16 {
            padding-top: 0.5rem;
          }
        }

        /* Smooth scrolling for panels */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default InteractiveViewer;

