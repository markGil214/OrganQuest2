// Interactive Organ Configurations - Add new interactive organs here easily!
const interactiveConfigs = {
	heart: {
		modelPath: '/models/heart/scene.gltf',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#ff6b6b',
			secondary: '#e55656',
			accent: '#ff5252'
		},
		emoji: '❤️',
		name: 'Heart',
		title: '❤️ Interactive Heart Explorer',
		description: 'Explore the amazing human heart up close! Discover its chambers, valves, and learn how it pumps blood throughout your body.',
		funFacts: [
			'🔴 Your heart beats about 100,000 times every day!',
			'💪 The heart muscle never gets tired - it works 24/7!',
			'📏 Your heart is about the size of your fist.',
			'🩸 It pumps about 2,000 gallons of blood daily!'
		],
		animationType: 'beating',
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
		},
		annotations: [
			{ position: { x: 0.5, y: 0.3, z: 0 }, text: 'Right Ventricle', info: 'Pumps blood to the lungs' },
			{ position: { x: -0.5, y: 0.3, z: 0 }, text: 'Left Ventricle', info: 'Pumps blood to the body' },
			{ position: { x: 0.3, y: 0.7, z: 0 }, text: 'Right Atrium', info: 'Receives blood from the body' },
			{ position: { x: -0.3, y: 0.7, z: 0 }, text: 'Left Atrium', info: 'Receives blood from the lungs' }
		]
	},
	brain: {
		modelPath: '/models/brain/scene.gltf',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#8e44ad',
			secondary: '#7a3a96',
			accent: '#9b59b6'
		},
		emoji: '🧠',
		name: 'Brain',
		title: '🧠 Interactive Brain Explorer',
		description: 'Journey through the incredible human brain! Discover different regions and learn how they control your thoughts, movements, and memories.',
		funFacts: [
			'🧠 Your brain has about 86 billion neurons!',
			'⚡ Brain signals travel at speeds up to 268 mph!',
			'💭 Your brain uses 20% of your total energy.',
			'🔄 It can store the equivalent of 2.5 million gigabytes!'
		],
		animationType: 'pulsing',
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
		},
		annotations: [
			{ position: { x: 0, y: 0.5, z: 0.5 }, text: 'Frontal Lobe', info: 'Controls decision making and personality' },
			{ position: { x: -0.3, y: 0, z: 0.3 }, text: 'Temporal Lobe', info: 'Processes hearing and memory' },
			{ position: { x: 0, y: -0.3, z: 0 }, text: 'Cerebellum', info: 'Controls balance and coordination' },
			{ position: { x: 0, y: 0.3, z: -0.5 }, text: 'Occipital Lobe', info: 'Processes vision' }
		]
	},
	lungs: {
		modelPath: '/models/lungs/scene.gltf',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#4ecdc4',
			secondary: '#45b7aa',
			accent: '#26d0ce'
		},
		emoji: '🫁',
		name: 'Lungs',
		title: '🫁 Interactive Lungs Explorer',
		description: 'Breathe in the wonders of your respiratory system! Explore how your lungs extract oxygen from the air and remove carbon dioxide.',
		funFacts: [
			'🫁 You breathe about 20,000 times every day!',
			'💨 Your lungs can hold up to 6 liters of air.',
			'🎈 If spread out, lung surfaces would cover a tennis court!',
			'🔄 You exchange 17,000 liters of air daily!'
		],
		animationType: 'breathing',
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
		},
		annotations: [
			{ position: { x: 0.4, y: 0.3, z: 0 }, text: 'Right Lung', info: 'Has 3 lobes and is slightly larger' },
			{ position: { x: -0.4, y: 0.3, z: 0 }, text: 'Left Lung', info: 'Has 2 lobes, making room for the heart' },
			{ position: { x: 0, y: 0.7, z: 0 }, text: 'Trachea', info: 'Main airway to the lungs' },
			{ position: { x: 0.2, y: 0, z: 0.3 }, text: 'Bronchi', info: 'Main branches leading to each lung' }
		]
	},
	liver: {
		modelPath: '/models/liver/scene.gltf',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#ff9f43',
			secondary: '#e6882d',
			accent: '#ffa726'
		},
		emoji: '🫀',
		name: 'Liver',
		title: '🫀 Interactive Liver Explorer',
		description: 'Discover your body\'s amazing chemical factory! Learn how the liver detoxifies your blood and performs over 500 vital functions.',
		funFacts: [
			'🫀 Your liver can regenerate itself completely!',
			'🏭 It performs over 500 different functions!',
			'🩸 Processes 1.4 liters of blood every minute.',
			'🔄 Can regrow to full size from just 25% of its mass!'
		],
		animationType: 'pulsing',
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
		},
		annotations: [
			{ position: { x: 0.3, y: 0.2, z: 0 }, text: 'Right Lobe', info: 'Largest section of the liver' },
			{ position: { x: -0.2, y: 0.2, z: 0 }, text: 'Left Lobe', info: 'Smaller but equally important section' },
			{ position: { x: 0, y: -0.3, z: 0.2 }, text: 'Hepatic Artery', info: 'Supplies oxygen-rich blood' },
			{ position: { x: 0.1, y: 0, z: -0.3 }, text: 'Portal Vein', info: 'Brings nutrients from intestines' }
		]
	},
	kidney: {
		modelPath: '/models/kidney/kidney.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#26de81',
			secondary: '#1dd1a1',
			accent: '#2ed573'
		},
		emoji: '🫘',
		name: 'Kidneys',
		title: '🫘 Interactive Kidney Explorer',
		description: 'Explore your body\'s amazing filtration system! Learn how kidneys clean your blood and maintain the perfect chemical balance.',
		funFacts: [
			'🫘 Your kidneys filter 50 gallons of blood daily!',
			'💧 They produce about 1-2 liters of urine per day.',
			'🔍 Each kidney contains about 1 million tiny filters!',
			'⚖️ They help maintain your body\'s pH balance!'
		],
		animationType: 'pulsing',
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
		},
		annotations: [
			{ position: { x: 0, y: 0.4, z: 0.3 }, text: 'Renal Cortex', info: 'Outer layer containing filtering units' },
			{ position: { x: 0, y: 0.1, z: 0.2 }, text: 'Renal Medulla', info: 'Inner layer that concentrates urine' },
			{ position: { x: 0, y: -0.2, z: 0 }, text: 'Renal Pelvis', info: 'Collects urine before it goes to bladder' },
			{ position: { x: 0.3, y: 0.2, z: 0 }, text: 'Nephrons', info: 'Tiny filtering units - 1 million per kidney!' }
		]
	}
};

// Easy template for adding new interactive organs:
// 
// newOrgan: {
// 	modelPath: '/models/newOrgan/scene.gltf',      // Path to your 3D model
// 	scale: { x: 3.0, y: 3.0, z: 3.0 },           // Model size (usually 3.0 for interactive)
// 	position: { y: 0 },                           // Model position (usually y: 0 for interactive)
// 	colors: {
// 		primary: '#yourColor',                     // Main theme color
// 		secondary: '#darkerVersion',               // Slightly darker version
// 		accent: '#lighterVersion'                  // Accent color for highlights
// 	},
// 	emoji: '🔬',                                   // Emoji for the organ
// 	name: 'New Organ',                            // Display name
// 	title: '🔬 Interactive New Organ Explorer',   // Header title
// 	description: 'Detailed description of the organ and what users will learn.', // Main description
// 	funFacts: [                                   // Array of fun facts (3-4 recommended)
// 		'🎯 Amazing fact #1 about the organ!',
// 		'⚡ Incredible fact #2 with numbers!',
// 		'💪 Cool fact #3 about function!',
// 		'🔬 Scientific fact #4 with details!'
// 	],
// 	animationType: 'pulsing',                     // Animation: 'beating', 'breathing', 'pulsing'
// 	cameraControls: {                             // Camera interaction settings
// 		enableZoom: true,
// 		enableRotate: true,
// 		enablePan: true,
// 		autoRotate: false,
// 		minDistance: 2,
// 		maxDistance: 10
// 	},
// 	lighting: {                                   // Lighting configuration
// 		ambientIntensity: 0.6,
// 		directionalIntensity: 0.8,
// 		spotlightIntensity: 1.0
// 	},
// 	annotations: [                                // 3D annotations/hotspots (3-4 recommended)
// 		{ position: { x: 0.3, y: 0.2, z: 0 }, text: 'Part Name', info: 'Description of this part' },
// 		{ position: { x: -0.2, y: 0.1, z: 0.3 }, text: 'Another Part', info: 'What this part does' },
// 		{ position: { x: 0, y: -0.1, z: -0.2 }, text: 'Important Area', info: 'Why this area matters' }
// 	]
// }