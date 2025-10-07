// Organ Configurations - Add new organs here easily!
const organConfigs = {
	heart: {
		modelPath: '/models/heart/scene.gltf',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#ff6b6b',
			secondary: '#e55656',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '❤️',
		name: 'Heart',
		title: '❤️ Heart Explorer',
		funFact: '🎯 Did you know? Your heart beats about 100,000 times every day!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'beating',
		instructions: 'Point your camera at the AR marker to see a beating heart! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the heart\'s chambers!',
		transitionMessage: '🚀 Taking you inside the heart!'
	},
	brain: {
		modelPath: '/models/brain/scene.gltf',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#8e44ad',
			secondary: '#7a3a96',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🧠',
		name: 'Brain',
		title: '🧠 Brain Explorer',
		funFact: '🎯 Did you know? Your brain has about 86 billion neurons!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see a thinking brain! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the brain\'s regions!',
		transitionMessage: '🚀 Taking you inside the brain!'
	},
	lungs: {
		modelPath: '/models/lungs/scene.gltf',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#4ecdc4',
			secondary: '#45b7aa',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫁',
		name: 'Lungs',
		title: '🫁 Lungs Explorer',
		funFact: '🎯 Did you know? You breathe about 20,000 times every day!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'breathing',
		instructions: 'Point your camera at the AR marker to see breathing lungs! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the lungs\' chambers!',
		transitionMessage: '🚀 Taking you inside the lungs!'
	},
	liver: {
		modelPath: '/models/liver/scene.gltf',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#ff9f43',
			secondary: '#e6882d',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫀',
		name: 'Liver',
		title: '🫀 Liver Explorer',
		funFact: '🎯 Did you know? Your liver can regenerate itself!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the liver! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the liver\'s structure!',
		transitionMessage: '🚀 Taking you inside the liver!'
	},
	kidney: {
		modelPath: '/models/kidney/kidney.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#26de81',
			secondary: '#1dd1a1',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫘',
		name: 'Kidneys',
		title: '🫘 Kidney Explorer',
		funFact: '🎯 Did you know? Your kidneys filter 50 gallons of blood every day!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the kidneys! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the kidney\'s structure!',
		transitionMessage: '🚀 Taking you inside the kidneys!'
	},
	
	// New organs added
	stomach: {
		modelPath: '/models/stomach/stomach.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#f39c12',
			secondary: '#e67e22',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫃',
		name: 'Stomach',
		title: '🫃 Stomach Explorer',
		funFact: '🎯 Did you know? Your stomach can stretch to hold up to 1.5 liters of food!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the stomach! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the stomach\'s structure!',
		transitionMessage: '🚀 Taking you inside the stomach!'
	},
	
	pancreas: {
		modelPath: '/models/Pancreas/Pancreas.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#e84393',
			secondary: '#d63384',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫀',
		name: 'Pancreas',
		title: '🫀 Pancreas Explorer',
		funFact: '🎯 Did you know? Your pancreas produces insulin to regulate blood sugar!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the pancreas! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the pancreas\'s structure!',
		transitionMessage: '🚀 Taking you inside the pancreas!'
	},
	
	intestine: {
		modelPath: '/models/Intestine/Intestine.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#00b894',
			secondary: '#00a085',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🌀',
		name: 'Intestines',
		title: '🌀 Intestine Explorer',
		funFact: '🎯 Did you know? Your small intestine is about 20 feet long!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the intestines! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the intestine\'s structure!',
		transitionMessage: '🚀 Taking you inside the intestines!'
	},
	
	spleen: {
		modelPath: '/models/Spleen/Spleen.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#6c5ce7',
			secondary: '#5f3dc4',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🩸',
		name: 'Spleen',
		title: '🩸 Spleen Explorer',
		funFact: '🎯 Did you know? Your spleen helps filter old blood cells!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the spleen! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the spleen\'s structure!',
		transitionMessage: '🚀 Taking you inside the spleen!'
	},
	
	bladder: {
		modelPath: '/models/bladder/bladder.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#fdcb6e',
			secondary: '#e17055',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '💧',
		name: 'Bladder',
		title: '💧 Bladder Explorer',
		funFact: '🎯 Did you know? Your bladder can hold up to 500ml of urine!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the bladder! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the bladder\'s structure!',
		transitionMessage: '🚀 Taking you inside the bladder!'
	},
	
	eyes: {
		modelPath: '/models/Eyes/Eyes.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#0984e3',
			secondary: '#74b9ff',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '👀',
		name: 'Eyes',
		title: '👀 Eyes Explorer',
		funFact: '🎯 Did you know? Your eyes can distinguish about 10 million colors!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the eyes! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the eye\'s structure!',
		transitionMessage: '🚀 Taking you inside the eyes!'
	},
	
	thyroid: {
		modelPath: '/models/thyroid-gland/thyroid-gland.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#a29bfe',
			secondary: '#6c5ce7',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🦋',
		name: 'Thyroid',
		title: '🦋 Thyroid Explorer',
		funFact: '🎯 Did you know? Your thyroid gland controls your metabolism!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the thyroid! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the thyroid\'s structure!',
		transitionMessage: '🚀 Taking you inside the thyroid!'
	},
	
	// Additional organs
	diaphragm: {
		modelPath: '/models/diaphragm/diaphragm.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#55efc4',
			secondary: '#00b894',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫁',
		name: 'Diaphragm',
		title: '🫁 Diaphragm Explorer',
		funFact: '🎯 Did you know? Your diaphragm is the main muscle that helps you breathe!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'breathing',
		instructions: 'Point your camera at the AR marker to see the diaphragm! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the diaphragm\'s structure!',
		transitionMessage: '🚀 Taking you inside the diaphragm!'
	},
	
	heart3d: {
		modelPath: '/models/heart3D/scene.gltf',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#fd79a8',
			secondary: '#e84393',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '💗',
		name: 'Heart 3D',
		title: '💗 Detailed Heart Explorer',
		funFact: '🎯 Did you know? Your heart has its own electrical system to control heartbeat!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'beating',
		instructions: 'Point your camera at the AR marker to see a detailed 3D heart! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the heart\'s detailed structure!',
		transitionMessage: '🚀 Taking you inside the detailed heart!'
	},
	
	heartsliced: {
		modelPath: '/models/heartSliced/heart.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#ff7675',
			secondary: '#d63031',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '💔',
		name: 'Heart Sliced',
		title: '💔 Heart Cross-Section Explorer',
		funFact: '🎯 Did you know? You can see all 4 heart chambers in a cross-section!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'beating',
		instructions: 'Point your camera at the AR marker to see a sliced heart! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the heart\'s internal chambers!',
		transitionMessage: '🚀 Taking you inside the sliced heart!'
	},
	
	pelvis: {
		modelPath: '/models/pelvis-femur/pelvis-femur.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#fab1a0',
			secondary: '#e17055',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🦴',
		name: 'Pelvis & Femur',
		title: '🦴 Pelvis & Femur Explorer',
		funFact: '🎯 Did you know? Your pelvis connects your spine to your legs!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the pelvis and femur! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the bone structure!',
		transitionMessage: '🚀 Taking you inside the pelvis!'
	},
	
	tongue: {
		modelPath: '/models/tongue/tongue.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#ff7675',
			secondary: '#d63031',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '👅',
		name: 'Tongue',
		title: '👅 Tongue Explorer',
		funFact: '🎯 Did you know? Your tongue has about 10,000 taste buds!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the tongue! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the tongue\'s structure!',
		transitionMessage: '🚀 Taking you inside the tongue!'
	},
	
	// Sliced versions for detailed exploration
	brainsliced: {
		modelPath: '/models/slicedBrain/sliced_brain.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#a29bfe',
			secondary: '#6c5ce7',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🧠',
		name: 'Brain Sliced',
		title: '🧠 Brain Cross-Section Explorer',
		funFact: '🎯 Did you know? You can see different brain regions in a cross-section!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see a sliced brain! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the brain\'s internal structure!',
		transitionMessage: '🚀 Taking you inside the sliced brain!'
	},
	
	kidneysliced: {
		modelPath: '/models/slicedKidney/slicedKidney.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#00cec9',
			secondary: '#00b894',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫘',
		name: 'Kidney Sliced',
		title: '🫘 Kidney Cross-Section Explorer',
		funFact: '🎯 Did you know? You can see the kidney\'s filtering units in a cross-section!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see a sliced kidney! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the kidney\'s internal structure!',
		transitionMessage: '🚀 Taking you inside the sliced kidney!'
	},
	
	liversliced: {
		modelPath: '/models/slicedLiver/slicedLiver.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#fdcb6e',
			secondary: '#e17055',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫀',
		name: 'Liver Sliced',
		title: '🫀 Liver Cross-Section Explorer',
		funFact: '🎯 Did you know? You can see the liver\'s complex structure in a cross-section!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see a sliced liver! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the liver\'s internal structure!',
		transitionMessage: '🚀 Taking you inside the sliced liver!'
	},
	
	lungssliced: {
		modelPath: '/models/slicedLungs/lungs.glb',
		scale: { x: 2.0, y: 2.0, z: 2.0 },
		position: { y: 0.5 },
		colors: {
			primary: '#74b9ff',
			secondary: '#0984e3',
			factBg1: '#ffeaa7',
			factBg2: '#fab1a0',
			factBorder: '#fdcb6e',
			factTextColor: '#2d3436',
			factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)',
			hintBg1: '#74b9ff',
			hintBg2: '#0984e3',
			hintBorder: '#74b9ff'
		},
		emoji: '🫁',
		name: 'Lungs Sliced',
		title: '🫁 Lungs Cross-Section Explorer',
		funFact: '🎯 Did you know? You can see the lungs\' air passages in a cross-section!',
		interactivePage: 'interactive-viewer.html',
		animationType: 'breathing',
		instructions: 'Point your camera at the AR marker to see sliced lungs! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the lungs\' internal structure!',
		transitionMessage: '🚀 Taking you inside the sliced lungs!'
	}
};

// Easy template for adding new organs:
// 
// newOrgan: {
// 	modelPath: '/models/newOrgan/scene.gltf',      // Path to your 3D model
// 	scale: { x: 2.0, y: 2.0, z: 2.0 },           // Model size (adjust as needed)
// 	position: { y: 0.5 },                         // Model position (usually y: 0.5)
// 	rotation: { y: 0 },                           // Optional: model rotation
// 	colors: {
// 		primary: '#yourColor',                     // Main theme color
// 		secondary: '#darkerVersion',               // Slightly darker version
// 		factBg1: '#ffeaa7',                       // Fact bubble gradient start
// 		factBg2: '#fab1a0',                       // Fact bubble gradient end
// 		factBorder: '#fdcb6e',                    // Fact bubble border
// 		factTextColor: '#2d3436',                 // Fact text color
// 		factTextShadow: '1px 1px 2px rgba(255,255,255,0.8)', // Fact text shadow
// 		hintBg1: '#74b9ff',                       // Hint popup gradient start
// 		hintBg2: '#0984e3',                       // Hint popup gradient end
// 		hintBorder: '#74b9ff'                     // Hint popup border
// 	},
// 	emoji: '🔬',                                   // Emoji for the organ
// 	name: 'New Organ',                            // Display name
// 	title: '🔬 New Organ Explorer',               // Header title
// 	funFact: '🎯 Did you know? Amazing fact about the organ!', // Fun fact text
// 	interactivePage: 'newOrgan-interactive.html', // Interactive page filename
// 	animationType: 'pulsing',                     // Animation type: 'beating', 'breathing', 'pulsing'
// 	instructions: 'Point your camera at the AR marker to see the new organ!', // Instruction text
// 	hintText: '🔍 Zoom all the way in to explore the organ\'s details!', // Zoom hint text
// 	transitionMessage: '🚀 Taking you inside the new organ!' // Transition message
// }