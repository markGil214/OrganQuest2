import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './InteractiveHeartViewer.css';

const InteractiveHeartViewer = ({ organType = 'heart' }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);
  const raycasterRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  const clickablePartsRef = useRef([]);

  const [isAnimating, setIsAnimating] = useState(true);
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Heart part information
  const heartParts = {
    'left_atrium': {
      name: 'Left Atrium',
      icon: '❤️',
      description: 'The left atrium receives oxygen-rich blood from the lungs through the pulmonary veins. It then pumps this blood into the left ventricle.',
      facts: [
        'Receives oxygenated blood from 4 pulmonary veins',
        'Has thinner walls than the ventricles',
        'Contracts to push blood into the left ventricle',
        'Holds about 85ml of blood when full'
      ]
    },
    'right_atrium': {
      name: 'Right Atrium',
      icon: '💙',
      description: 'The right atrium receives oxygen-poor blood from the body through the superior and inferior vena cava. It pumps this blood into the right ventricle.',
      facts: [
        'Receives deoxygenated blood from the body',
        'Contains the sinoatrial (SA) node - the heart\'s natural pacemaker',
        'Has three openings: superior vena cava, inferior vena cava, and coronary sinus',
        'Smaller and thinner-walled than the left atrium'
      ]
    },
    'left_ventricle': {
      name: 'Left Ventricle',
      icon: '💪',
      description: 'The left ventricle is the heart\'s main pumping chamber. It receives oxygen-rich blood from the left atrium and pumps it to the entire body through the aorta.',
      facts: [
        'Has the thickest muscular walls (about 3 times thicker than right ventricle)',
        'Pumps blood to the entire body except the lungs',
        'Generates pressures of 120 mmHg or higher',
        'Does the most work of any heart chamber'
      ]
    },
    'right_ventricle': {
      name: 'Right Ventricle',
      icon: '🫁',
      description: 'The right ventricle pumps oxygen-poor blood from the right atrium to the lungs through the pulmonary artery, where it picks up oxygen.',
      facts: [
        'Pumps blood only to the nearby lungs',
        'Generates lower pressure than left ventricle (about 25 mmHg)',
        'Has thinner walls than the left ventricle',
        'Shaped like a crescent wrapping around the left ventricle'
      ]
    },
    'aorta': {
      name: 'Aorta',
      icon: '🔴',
      description: 'The aorta is the body\'s largest artery. It carries oxygen-rich blood from the left ventricle to the rest of the body.',
      facts: [
        'About 1 inch (2.5 cm) in diameter',
        'Can handle blood flow speeds up to 1 meter per second',
        'Branches into smaller arteries throughout the body',
        'Elastic walls help maintain blood pressure between heartbeats'
      ]
    },
    'pulmonary_artery': {
      name: 'Pulmonary Artery',
      icon: '🫁',
      description: 'The pulmonary artery carries oxygen-poor blood from the right ventricle to the lungs for oxygenation.',
      facts: [
        'Only artery in the body that carries deoxygenated blood',
        'Splits into left and right branches for each lung',
        'Shorter and wider than the aorta',
        'Lower pressure system than systemic circulation'
      ]
    },
    'septum': {
      name: 'Septum',
      icon: '🧱',
      description: 'The septum is the muscular wall that divides the left and right sides of the heart, preventing oxygen-rich and oxygen-poor blood from mixing.',
      facts: [
        'Consists of atrial septum (between atria) and ventricular septum (between ventricles)',
        'The ventricular septum is much thicker',
        'Essential for efficient circulation',
        'Defects in the septum are among the most common congenital heart defects'
      ]
    }
  };

  // Configuration
  const config = {
    modelPath: '/models/heartSliced/heart.glb',
    scale: { x: 3.0, y: 3.0, z: 3.0 },
    position: { y: 0 },
    colors: {
      primary: '#ff6b6b',
      secondary: '#e55656',
      accent: '#ff5252'
    },
    cameraControls: {
      enableZoom: true,
      enableRotate: true,
      enablePan: true,
      autoRotate: false,
      minDistance: 2,
      maxDistance: 10
    },
    lighting: {
      ambientIntensity: 0.6,
      directionalIntensity: 0.8,
      spotlightIntensity: 1.0
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

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

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, config.lighting.ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, config.lighting.directionalIntensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff, config.lighting.spotlightIntensity, 100, Math.PI / 6, 0.1);
    spotLight.position.set(0, 10, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Load model
    const loader = new GLTFLoader();
    console.log('Loading model from:', config.modelPath);

    loader.load(
      config.modelPath,
      (gltf) => {
        console.log('✅ Model loaded successfully!', gltf);
        const model = gltf.scene;
        modelRef.current = model;

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

              // Store original material for hover effect
              child.userData.originalColor = child.material.color.clone();
            }

            // Make this part clickable
            clickablePartsRef.current.push(child);
            child.userData.clickable = true;

            console.log('Clickable part found:', child.name || 'unnamed');
          }
        });

        scene.add(model);
        console.log('✅ Model added to scene. Clickable parts:', clickablePartsRef.current.length);
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total * 100).toFixed(2);
          console.log('📦 Loading progress:', percent + '%');
        }
      },
      (error) => {
        console.error('❌ Error loading model:', error);
      }
    );

    // Mouse click handler
    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.intersectObjects(clickablePartsRef.current, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const partName = clickedObject.name.toLowerCase().replace(/\s+/g, '_');

        console.log('Clicked part:', clickedObject.name);

        if (heartParts[partName]) {
          setSelectedPart(heartParts[partName]);
          setModalVisible(true);
        } else {
          // Try to match partial names
          for (const key in heartParts) {
            if (partName.includes(key) || key.includes(partName)) {
              setSelectedPart(heartParts[key]);
              setModalVisible(true);
              return;
            }
          }
          console.log('No info found for part:', partName);
        }
      }
    };

    // Mouse move handler for hover effects
    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.intersectObjects(clickablePartsRef.current, true);

      // Reset all parts to original color
      clickablePartsRef.current.forEach(part => {
        if (part.material && part.userData.originalColor) {
          part.material.color.copy(part.userData.originalColor);
        }
      });

      // Highlight hovered part
      if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        if (hoveredObject.material) {
          hoveredObject.material.color.setHex(0xffaa00); // Orange highlight
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      controls.update();

      // Apply animation if enabled
      if (isAnimating && modelRef.current) {
        modelRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      controls.dispose();
    };
  }, [isAnimating]);

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.reset();
    }
  };

  const handleToggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const handleToggleInfo = () => {
    setInfoPanelVisible(!infoPanelVisible);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPart(null);
  };

  return (
    <div className="interactive-heart-viewer">
      {/* 3D Canvas */}
      <div ref={mountRef} className="viewer-canvas" />

      {/* Control Buttons */}
      <div className="control-buttons">
        <button onClick={handleReset} className="control-btn" title="Reset View">
          🔄 Reset
        </button>
        <button onClick={handleToggleAnimation} className="control-btn" title="Toggle Animation">
          {isAnimating ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={handleToggleInfo} className="control-btn" title="Info">
          ℹ️ Info
        </button>
        <button onClick={() => window.history.back()} className="control-btn" title="Back">
          ← Back
        </button>
      </div>

      {/* Info Panel */}
      <div className={`info-panel ${infoPanelVisible ? 'visible' : ''}`}>
        <div className="info-header">
          <h3>❤️ Interactive Heart Explorer</h3>
          <button onClick={handleToggleInfo} className="close-btn">×</button>
        </div>
        <div className="info-content">
          <p>Explore the amazing human heart up close! Click on different parts to learn more.</p>
          <h4>✨ Fun Facts</h4>
          <ul>
            <li>🔴 Your heart beats about 100,000 times every day!</li>
            <li>💪 The heart muscle never gets tired - it works 24/7!</li>
            <li>📏 Your heart is about the size of your fist.</li>
            <li>🩸 It pumps about 2,000 gallons of blood daily!</li>
          </ul>
        </div>
      </div>

      {/* Part Info Modal */}
      {modalVisible && selectedPart && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            <div className="modal-header">
              <span className="modal-icon">{selectedPart.icon}</span>
              <h2>{selectedPart.name}</h2>
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedPart.description}</p>
              <div className="modal-facts">
                <h4>✨ Interesting Facts</h4>
                <ul>
                  {selectedPart.facts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveHeartViewer;
