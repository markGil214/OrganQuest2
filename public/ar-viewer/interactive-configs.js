// Interactive Organ Configurations - Add new interactive organs here easily!
const interactiveConfigs = {
	heart: {
		modelPath: '/models/heartSliced/heart.glb',
		scale: { x: 1.6, y: 1.6, z: 1.6 },
		position: { y: 0 },
		colors: {
			primary: '#ff6b6b',
			secondary: '#e55656',
			accent: '#ff5252'
		},
		emoji: '❤️',
		name: 'Heart',
		title: '❤️ Interactive Heart Explorer',
		description: 'Explore the amazing human heart up close! Click on different parts to learn more. Discover its chambers, valves, and learn how it pumps blood throughout your body.',
		funFacts: [
			'🔴 Your heart beats about 100,000 times every day!',
			'💪 The heart muscle never gets tired - it works 24/7!',
			'📏 Your heart is about the size of your fist.',
			'🩸 It pumps about 2,000 gallons of blood daily!'
		],
		animationType: 'beating',
		cameraControls: {
			enableZoom: false,
			enableRotate: false,
			enablePan: false,
			autoRotate: false,
			minDistance: 2,
			maxDistance: 10
		},
		lighting: {
			ambientIntensity: 0.6,
			directionalIntensity: 0.8,
			spotlightIntensity: 1.0
		},
		labels: [
			{
				id: 1,
				name: 'Aorta',
				key: 'aorta',
				icon: '🔴',
				position: { x: -0.07, y: 0.71, z: -0.07 },
				description: 'The aorta is the largest artery in the body. It carries oxygen-rich blood from the left ventricle to all parts of the body.',
				facts: [
					'The largest artery in the human body',
					'About 30cm long and 2.5cm in diameter',
					'Carries oxygenated blood to the entire body',
					'Can withstand high pressure from the left ventricle'
				]
			},
			{
				id: 2,
				name: 'Left Ventricle',
				key: 'left_ventricle',
				icon: '💪',
				position: { x: 0.49, y: -0.42, z: 0.07 },
				description: 'The left ventricle is the heart\'s main pumping chamber. It receives blood from the left atrium and pumps it through the aorta to supply oxygen-rich blood to the entire body.',
				facts: [
					'Has the thickest muscular walls of all chambers',
					'Pumps blood at high pressure throughout the body',
					'Can generate pressures up to 120 mmHg',
					'The most powerful chamber of the heart'
				]
			},
			{
				id: 3,
				name: 'Right Ventricle',
				key: 'right_ventricle',
				icon: '🫀',
				position: { x: -0.20, y: -0.55, z: 0.05 },
				description: 'The right ventricle receives blood from the right atrium and pumps it to the lungs through the pulmonary artery, where it picks up oxygen.',
				facts: [
					'Pumps blood to the lungs for oxygenation',
					'Has thinner walls than the left ventricle',
					'Works at lower pressure than left ventricle',
					'Pumps the same volume as the left ventricle'
				]
			},
			{
				id: 4,
				name: 'Left Atrium',
				key: 'left_atrium',
				icon: '❤️',
				position: { x: 0.44, y: 0.27, z: -0.16 },
				description: 'The left atrium receives oxygen-rich blood from the lungs through the pulmonary veins. It then pumps this blood into the left ventricle.',
				facts: [
					'Receives oxygenated blood from 4 pulmonary veins',
					'Has thinner walls than the ventricles',
					'Contracts to push blood into the left ventricle',
					'Holds about 85ml of blood when full'
				]
			},
			{
				id: 5,
				name: 'Pulmonary Artery',
				key: 'pulmonary_artery',
				icon: '💙',
				position: { x: 0.11, y: 0.39, z: 0.31 },
				description: 'The pulmonary artery carries oxygen-poor blood from the right ventricle to the lungs, where it picks up oxygen and releases carbon dioxide.',
				facts: [
					'Only artery in the body that carries deoxygenated blood',
					'Splits into left and right branches for each lung',
					'Works at lower pressure than the aorta',
					'Critical for gas exchange in the lungs'
				]
			},
			{
				id: 6,
				name: 'Right Atrium',
				key: 'right_atrium',
				icon: '💙',
				position: { x: -0.52, y: 0.22, z: -0.50 },
				description: 'The right atrium receives oxygen-poor blood from the body through the superior and inferior vena cava. It pumps this blood into the right ventricle.',
				facts: [
					'Receives deoxygenated blood from the body',
					'Connected to two large veins (vena cava)',
					'Contains the sinoatrial (SA) node - the heart\'s natural pacemaker',
					'Contracts slightly before the right ventricle'
				]
			}
		],
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
	},
	eyes: {
		modelPath: '/models/Eyes/Eyes.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#3742fa',
			secondary: '#2f3542',
			accent: '#5352ed'
		},
		emoji: '👁️',
		name: 'Eyes',
		title: '👁️ Interactive Eye Explorer',
		description: 'See the amazing world of vision! Discover how your eyes capture light and turn it into the beautiful images you see every day.',
		funFacts: [
			'👁️ Your eyes can distinguish 10 million colors!',
			'⚡ Eyes move 50 times per second when reading!',
			'📸 Each eye has 6 muscles controlling movement.',
			'🔍 The eye is the second most complex organ after the brain!'
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
			{ position: { x: 0, y: 0, z: 0.4 }, text: 'Cornea', info: 'Clear front layer that focuses light' },
			{ position: { x: 0, y: 0, z: 0.2 }, text: 'Iris', info: 'Colored part that controls light entry' },
			{ position: { x: 0, y: 0, z: 0 }, text: 'Lens', info: 'Focuses light onto the retina' },
			{ position: { x: 0, y: 0, z: -0.3 }, text: 'Retina', info: 'Light-sensitive layer that creates images' }
		]
	},
	stomach: {
		modelPath: '/models/stomach/stomach.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#ff6348',
			secondary: '#e55039',
			accent: '#ff7675'
		},
		emoji: '🍽️',
		name: 'Stomach',
		title: '🍽️ Interactive Stomach Explorer',
		description: 'Digest the amazing facts about your stomach! Learn how this muscular sac breaks down food and prepares nutrients for your body.',
		funFacts: [
			'🍽️ Your stomach can hold up to 4 liters of food!',
			'💪 Stomach muscles churn food 3 times per minute.',
			'🧪 Stomach acid is strong enough to dissolve metal!',
			'🔄 Your stomach lining replaces itself every 3-5 days!'
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
			{ position: { x: 0, y: 0.4, z: 0.2 }, text: 'Fundus', info: 'Upper curved part of the stomach' },
			{ position: { x: 0, y: 0, z: 0.3 }, text: 'Body', info: 'Main central region of the stomach' },
			{ position: { x: 0.2, y: -0.3, z: 0 }, text: 'Antrum', info: 'Lower section that grinds food' },
			{ position: { x: 0.3, y: -0.4, z: 0 }, text: 'Pylorus', info: 'Exit valve to small intestine' }
		]
	},
	intestine: {
		modelPath: '/models/Intestine/Intestine.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#f39c12',
			secondary: '#d68910',
			accent: '#f4b942'
		},
		emoji: '🎢',
		name: 'Intestines',
		title: '🎢 Interactive Intestine Explorer',
		description: 'Take a journey through your amazing digestive highway! Discover how your intestines absorb nutrients and complete digestion.',
		funFacts: [
			'🎢 Your small intestine is 20 feet long!',
			'🔬 It has millions of tiny villi for absorption.',
			'⏱️ Food spends 3-5 hours in the small intestine.',
			'💧 Your large intestine absorbs 90% of water!'
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
			{ position: { x: 0.3, y: 0.2, z: 0 }, text: 'Small Intestine', info: 'Where most nutrient absorption happens' },
			{ position: { x: -0.2, y: 0.3, z: 0 }, text: 'Large Intestine', info: 'Absorbs water and forms waste' },
			{ position: { x: 0.1, y: 0, z: 0.3 }, text: 'Villi', info: 'Tiny finger-like projections that absorb nutrients' },
			{ position: { x: -0.3, y: -0.2, z: 0 }, text: 'Colon', info: 'Final processing before elimination' }
		]
	},
	pancreas: {
		modelPath: '/models/Pancreas/Pancreas.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#e17055',
			secondary: '#d63031',
			accent: '#fab1a0'
		},
		emoji: '🥞',
		name: 'Pancreas',
		title: '🥞 Interactive Pancreas Explorer',
		description: 'Discover your body\'s dual-purpose organ! Learn how the pancreas produces insulin for blood sugar control and enzymes for digestion.',
		funFacts: [
			'🥞 Your pancreas is both an organ and a gland!',
			'🍯 It produces insulin to control blood sugar.',
			'💊 Makes digestive enzymes to break down food.',
			'⚖️ Produces 1-3 liters of pancreatic juice daily!'
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
			{ position: { x: -0.3, y: 0.1, z: 0 }, text: 'Head', info: 'Widest part near the duodenum' },
			{ position: { x: 0, y: 0.1, z: 0.2 }, text: 'Body', info: 'Central section of the pancreas' },
			{ position: { x: 0.3, y: 0.1, z: 0 }, text: 'Tail', info: 'Narrow end near the spleen' },
			{ position: { x: 0, y: -0.2, z: 0.3 }, text: 'Islets of Langerhans', info: 'Insulin-producing cells' }
		]
	},
	spleen: {
		modelPath: '/models/Spleen/Spleen.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#6c5ce7',
			secondary: '#5f3dc4',
			accent: '#a29bfe'
		},
		emoji: '🛡️',
		name: 'Spleen',
		title: '🛡️ Interactive Spleen Explorer',
		description: 'Explore your body\'s blood filter and immune system helper! Learn how the spleen cleans your blood and fights infections.',
		funFacts: [
			'🛡️ Your spleen filters blood like a coffee filter!',
			'🩸 It stores red blood cells for emergencies.',
			'⚔️ Helps fight infections by making antibodies.',
			'🔄 Filters 5 ounces of blood every minute!'
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
			{ position: { x: 0, y: 0.3, z: 0.2 }, text: 'Red Pulp', info: 'Filters old red blood cells' },
			{ position: { x: 0.2, y: 0, z: 0.3 }, text: 'White Pulp', info: 'Contains immune system cells' },
			{ position: { x: -0.2, y: 0.2, z: 0 }, text: 'Splenic Artery', info: 'Brings blood to the spleen' },
			{ position: { x: 0.3, y: -0.2, z: 0 }, text: 'Capsule', info: 'Protective outer covering' }
		]
	},
	diaphragm: {
		modelPath: '/models/diaphragm/diaphragm.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#00b894',
			secondary: '#00a085',
			accent: '#55efc4'
		},
		emoji: '💨',
		name: 'Diaphragm',
		title: '💨 Interactive Diaphragm Explorer',
		description: 'Discover your main breathing muscle! Learn how the diaphragm moves up and down to help you breathe automatically.',
		funFacts: [
			'💨 Your diaphragm is your most important breathing muscle!',
			'🔄 It moves up and down 20,000 times per day.',
			'💪 This dome-shaped muscle separates chest from abdomen.',
			'⚡ Controlled by the phrenic nerve from your neck!'
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
			{ position: { x: 0, y: 0.3, z: 0 }, text: 'Central Tendon', info: 'Strong fibrous center of diaphragm' },
			{ position: { x: 0.3, y: 0, z: 0.2 }, text: 'Muscle Fibers', info: 'Contract to pull diaphragm down' },
			{ position: { x: -0.2, y: 0.1, z: 0.3 }, text: 'Phrenic Nerve', info: 'Controls diaphragm movement' },
			{ position: { x: 0, y: -0.2, z: 0 }, text: 'Attachments', info: 'Connected to ribs and spine' }
		]
	},
	bladder: {
		modelPath: '/models/bladder/bladder.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#f39c12',
			secondary: '#e67e22',
			accent: '#f4b942'
		},
		emoji: '🫧',
		name: 'Bladder',
		title: '🫧 Interactive Bladder Explorer',
		description: 'Discover your body\'s storage tank! Learn how the bladder stores and releases urine to keep your body clean.',
		funFacts: [
			'🫧 Your bladder can hold up to 2 cups of urine!',
			'💪 It\'s made of stretchy muscle that expands like a balloon.',
			'⏰ Most people need to empty it every 3-4 hours.',
			'🧠 Your brain tells you when it\'s time to go!'
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
			{ position: { x: 0, y: 0.3, z: 0.2 }, text: 'Dome', info: 'Top part that expands when full' },
			{ position: { x: 0.2, y: 0, z: 0.3 }, text: 'Detrusor Muscle', info: 'Muscle that contracts to empty bladder' },
			{ position: { x: 0, y: -0.3, z: 0 }, text: 'Neck', info: 'Opening that controls urine flow' },
			{ position: { x: -0.2, y: 0.2, z: 0 }, text: 'Ureters', info: 'Tubes bringing urine from kidneys' }
		]
	},
	thyroid: {
		modelPath: '/models/thyroid-gland/thyroid-gland.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#ff6b9d',
			secondary: '#e55a87',
			accent: '#ff7675'
		},
		emoji: '🦋',
		name: 'Thyroid',
		title: '🦋 Interactive Thyroid Explorer',
		description: 'Meet your body\'s speed controller! Learn how the thyroid gland controls your energy and growth.',
		funFacts: [
			'🦋 Your thyroid is shaped like a butterfly!',
			'⚡ It controls how fast your body uses energy.',
			'📏 It helps you grow taller and stronger.',
			'🧠 It\'s controlled by your brain through special signals!'
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
			{ position: { x: 0.2, y: 0.1, z: 0 }, text: 'Right Lobe', info: 'One wing of the butterfly shape' },
			{ position: { x: -0.2, y: 0.1, z: 0 }, text: 'Left Lobe', info: 'Other wing of the butterfly shape' },
			{ position: { x: 0, y: 0, z: 0.3 }, text: 'Isthmus', info: 'Bridge connecting the two lobes' },
			{ position: { x: 0, y: 0.3, z: 0 }, text: 'Follicles', info: 'Tiny factories making thyroid hormones' }
		]
	},
	tongue: {
		modelPath: '/models/tongue/tongue.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#fd79a8',
			secondary: '#e84393',
			accent: '#ff7675'
		},
		emoji: '👅',
		name: 'Tongue',
		title: '👅 Interactive Tongue Explorer',
		description: 'Taste the amazing world of flavors! Learn how your tongue helps you taste, eat, and speak.',
		funFacts: [
			'👅 Your tongue has about 10,000 taste buds!',
			'💪 It\'s one of the strongest muscles in your body.',
			'🗣️ It helps you speak clearly and make sounds.',
			'🍯 It can taste 5 different flavors: sweet, sour, salty, bitter, and umami!'
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
			{ position: { x: 0, y: 0.3, z: 0.2 }, text: 'Tip', info: 'Most sensitive part for tasting' },
			{ position: { x: 0.2, y: 0, z: 0.3 }, text: 'Taste Buds', info: 'Tiny sensors that detect flavors' },
			{ position: { x: 0, y: -0.2, z: 0 }, text: 'Root', info: 'Back part attached to throat' },
			{ position: { x: -0.3, y: 0.1, z: 0 }, text: 'Papillae', info: 'Bumps containing taste buds' }
		]
	},
	pelvis: {
		modelPath: '/models/pelvis-femur/pelvis-femur.glb',
		scale: { x: 3.0, y: 3.0, z: 3.0 },
		position: { y: 0 },
		colors: {
			primary: '#a29bfe',
			secondary: '#6c5ce7',
			accent: '#74b9ff'
		},
		emoji: '🦴',
		name: 'Pelvis & Femur',
		title: '🦴 Interactive Pelvis & Femur Explorer',
		description: 'Discover your body\'s strong foundation! Learn how your pelvis and thigh bones support your entire body.',
		funFacts: [
			'🦴 Your femur is the longest and strongest bone in your body!',
			'🏠 Your pelvis protects important organs inside.',
			'🚶 These bones help you walk, run, and jump.',
			'💪 They can support many times your body weight!'
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
			{ position: { x: 0, y: 0.4, z: 0 }, text: 'Pelvis', info: 'Hip bones that form a protective bowl' },
			{ position: { x: 0.3, y: -0.2, z: 0 }, text: 'Femur Head', info: 'Ball that fits into hip socket' },
			{ position: { x: 0.2, y: -0.5, z: 0 }, text: 'Femur Shaft', info: 'Long strong part of thigh bone' },
			{ position: { x: 0, y: 0.2, z: 0.3 }, text: 'Hip Joint', info: 'Where pelvis and femur connect' }
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