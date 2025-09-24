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
		interactivePage: 'heart-interactive.html',
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
		interactivePage: 'brain-interactive.html',
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
		interactivePage: 'lungs-interactive.html',
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
		interactivePage: 'liver-interactive.html',
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
		interactivePage: 'kidney-interactive.html',
		animationType: 'pulsing',
		instructions: 'Point your camera at the AR marker to see the kidneys! Use zoom controls to explore!',
		hintText: '🔍 Zoom all the way in to explore the kidney\'s structure!',
		transitionMessage: '🚀 Taking you inside the kidneys!'
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