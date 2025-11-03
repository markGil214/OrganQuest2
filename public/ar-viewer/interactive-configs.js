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
				],
				diseases: [
					'Aortic Aneurysm - Bulging or weakening of the aorta wall that can rupture',
					'Aortic Dissection - Tear in the inner layer causing life-threatening bleeding',
					'Aortic Stenosis - Narrowing of the aorta that restricts blood flow',
					'Atherosclerosis - Plaque buildup causing hardening and narrowing'
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
				],
				diseases: [
					'Left Ventricular Hypertrophy - Thickening of the heart muscle wall',
					'Heart Failure - Unable to pump enough blood to meet body needs',
					'Cardiomyopathy - Disease of the heart muscle causing weakness',
					'Myocardial Infarction - Heart attack from blocked blood flow'
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
				],
				diseases: [
					'Right Ventricular Failure - Inability to pump blood to the lungs',
					'Pulmonary Hypertension - High blood pressure in lung arteries',
					'Arrhythmogenic RV Cardiomyopathy - Genetic heart muscle disease',
					'Tricuspid Regurgitation - Leaky valve between right chambers'
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
				],
				diseases: [
					'Atrial Fibrillation - Irregular, rapid heartbeat in the atria',
					'Left Atrial Enlargement - Stretched atrium from high pressure',
					'Atrial Septal Defect - Hole between left and right atria',
					'Mitral Valve Disease - Problems with valve between atrium and ventricle'
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
				],
				diseases: [
					'Pulmonary Embolism - Blood clot blocking the pulmonary artery',
					'Pulmonary Stenosis - Narrowing that restricts blood flow to lungs',
					'Pulmonary Hypertension - High blood pressure in lung arteries',
					'Patent Ductus Arteriosus - Birth defect with abnormal connection'
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
				],
				diseases: [
					'Atrial Fibrillation - Irregular heartbeat starting in the atria',
					'Right Atrial Enlargement - Stretched from increased pressure',
					'Sick Sinus Syndrome - Problems with the heart\'s pacemaker',
					'Atrial Flutter - Rapid but regular abnormal heart rhythm'
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
		modelPath: '/models/slicedBrain/sliced_brain.glb',
		scale: { x: 3, y: 3, z: 3 },
		position: { y: 0 },
		cameraPosition: { x: 10, y: 0, z: 5 },
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
				name: 'Frontal Lobe',
				key: 'frontal_lobe',
				icon: '🎯',
				position: { x: 0.05, y: 0.62, z: 0.43 },
				description: 'The frontal lobe is responsible for higher cognitive functions including reasoning, planning, problem-solving, and controlling behavior and emotions.',
				facts: [
					'Controls decision making and personality',
					'Responsible for motor control and speech production',
					'Manages complex cognitive behaviors',
					'The last part of the brain to fully develop (around age 25)'
				],
				diseases: [
					'Frontotemporal Dementia - Progressive brain disorder affecting personality and behavior',
					'Brain Tumors - Abnormal growth in the frontal region',
					'Traumatic Brain Injury - Damage from accidents affecting judgment',
					'Frontal Lobe Epilepsy - Seizures originating in frontal region'
				]
			},
			{
				id: 2,
				name: 'Parietal Lobe',
				key: 'parietal_lobe',
				icon: '✋',
				position: { x: 0.13, y: 0.41, z: -0.58 },
				description: 'The parietal lobe processes sensory information from the body including touch, temperature, and pain. It also helps with spatial awareness and navigation.',
				facts: [
					'Processes sensory information from the body',
					'Integrates touch, temperature, and pain signals',
					'Helps with spatial awareness and navigation',
					'Crucial for hand-eye coordination'
				],
				diseases: [
					'Gerstmann Syndrome - Difficulty with writing, math, and finger recognition',
					'Hemispatial Neglect - Ignoring one side of space after stroke',
					'Parietal Lobe Lesions - Damage causing sensory and spatial problems',
					'Apraxia - Difficulty performing learned movements'
				]
			},
			{
				id: 3,
				name: 'Temporal Lobe',
				key: 'temporal_lobe',
				icon: '👂',
				position: { x: -0.47, y: -0.24, z: 0.22 },
				description: 'The temporal lobe processes auditory information and is essential for memory formation, language comprehension, and emotional responses.',
				facts: [
					'Processes hearing and sound recognition',
					'Critical for memory formation and recall',
					'Contains the hippocampus (memory center)',
					'Helps recognize faces and objects'
				],
				diseases: [
					'Temporal Lobe Epilepsy - Most common form of epilepsy in adults',
					'Alzheimer\'s Disease - Memory loss starting in temporal region',
					'Wernicke\'s Aphasia - Difficulty understanding language',
					'Auditory Processing Disorder - Problems processing sounds'
				]
			},
			{
				id: 4,
				name: 'Occipital Lobe',
				key: 'occipital_lobe',
				icon: '👁️',
				position: { x: 0.14, y: -0.08, z: -0.78 },
				description: 'The occipital lobe is the visual processing center of the brain, interpreting what your eyes see and making sense of colors, shapes, and movement.',
				facts: [
					'Primary visual processing center',
					'Interprets colors, shapes, and movement',
					'Damage can cause blindness despite healthy eyes',
					'Processes visual information from both eyes'
				],
				diseases: [
					'Cortical Blindness - Vision loss from occipital damage, not eye problems',
					'Visual Agnosia - Inability to recognize objects despite seeing them',
					'Prosopagnosia - Face blindness, inability to recognize faces',
					'Occipital Lobe Stroke - Loss of vision in parts of visual field'
				]
			},
			{
				id: 5,
				name: 'Cerebellum',
				key: 'cerebellum',
				icon: '🤸',
				position: { x: 0.2, y: -0.46, z: -0.52 },
				description: 'The cerebellum coordinates voluntary movements, maintains balance and posture, and helps with motor learning and fine-tuning movements.',
				facts: [
					'Controls balance and coordination',
					'Contains more neurons than the rest of the brain',
					'Fine-tunes motor movements',
					'Helps learn and remember motor skills'
				],
				diseases: [
					'Ataxia - Loss of balance and coordination',
					'Cerebellar Stroke - Damage causing dizziness and movement problems',
					'Spinocerebellar Degeneration - Progressive loss of coordination',
					'Cerebellar Hypoplasia - Underdeveloped cerebellum from birth'
				]
			},
			{
				id: 6,
				name: 'Brainstem',
				key: 'brainstem',
				icon: '💓',
				position: { x: 0.19, y: -0.67, z: -0.14 },
				description: 'The brainstem controls vital life functions like breathing, heart rate, and blood pressure. It connects the brain to the spinal cord.',
				facts: [
					'Controls automatic functions like breathing',
					'Regulates heart rate and blood pressure',
					'Connects brain to spinal cord',
					'Contains centers for sleep and consciousness'
				],
				diseases: [
					'Brainstem Stroke - Life-threatening damage to vital functions',
					'Brain Death - Loss of all brainstem functions',
					'Locked-in Syndrome - Paralysis except for eye movements',
					'Central Sleep Apnea - Breathing stops during sleep'
				]
			},
			{
				id: 7,
				name: 'Corpus Callosum',
				key: 'corpus_callosum',
				icon: '🌉',
				position: { x: -0.08, y: 0.32, z: 0.29 },
				description: 'The corpus callosum is a thick bundle of nerve fibers that connects the left and right hemispheres, allowing them to communicate and share information.',
				facts: [
					'Largest white matter structure in the brain',
					'Contains about 200-250 million nerve fibers',
					'Enables communication between brain hemispheres',
					'Allows the two sides of the brain to work together'
				],
				diseases: [
					'Agenesis of Corpus Callosum - Born without this structure',
					'Multiple Sclerosis - Damage to nerve fibers in corpus callosum',
					'Marchiafava-Bignami Disease - Degeneration from alcohol abuse',
					'Corpus Callosum Infarction - Stroke affecting this region'
				]
			}
		]
	},
	lungs: {
		modelPath: '/models/slicedLungs/lungs.glb',
		scale: { x: 1.6, y: 1.6, z: 1.6 },
		position: { y: 0 },
		cameraPosition: { x: 0, y: 0, z: 5 },
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
				name: 'Right Lung',
				key: 'right_lung',
				icon: '🫁',
				position: { x: -0.67, y: 0.2, z: 0.05 },
				description: 'The right lung is slightly larger than the left and has three lobes: superior, middle, and inferior. It handles about 55% of your breathing capacity.',
				facts: [
					'Has 3 lobes (superior, middle, inferior)',
					'Slightly larger than the left lung',
					'Handles about 55% of total lung capacity',
					'Contains about 300 million alveoli'
				],
				diseases: [
					'Pneumonia - Infection causing inflammation of air sacs',
					'Lung Cancer - Uncontrolled cell growth in lung tissue',
					'Chronic Bronchitis - Long-term inflammation of airways',
					'Pulmonary Fibrosis - Scarring and stiffening of lung tissue'
				]
			},
			{
				id: 2,
				name: 'Left Lung',
				key: 'left_lung',
				icon: '🫁',
				position: { x: 0.67, y: 0.22, z: 0.03 },
				description: 'The left lung has two lobes and is smaller to make room for the heart. It shares the chest cavity with your heart on the left side.',
				facts: [
					'Has 2 lobes (superior and inferior)',
					'Smaller to accommodate the heart',
					'Contains a cardiac notch for the heart',
					'Handles about 45% of total lung capacity'
				],
				diseases: [
					'Pneumothorax - Collapsed lung from air in chest cavity',
					'Tuberculosis - Bacterial infection primarily in lungs',
					'Emphysema - Damage to alveoli causing breathing problems',
					'Pleural Effusion - Fluid buildup around the lung'
				]
			},
			{
				id: 3,
				name: 'Trachea',
				key: 'trachea',
				icon: '🌬️',
				position: { x: 0.02, y: 0.68, z: -0.01 },
				description: 'The trachea, or windpipe, is the main airway that connects your throat to your lungs. It\'s reinforced with cartilage rings to stay open.',
				facts: [
					'About 10-12 cm long and 2 cm wide',
					'Lined with tiny hairs called cilia',
					'Has C-shaped cartilage rings for support',
					'Filters and warms air before it reaches lungs'
				],
				diseases: [
					'Tracheitis - Inflammation of the trachea from infection',
					'Tracheal Stenosis - Narrowing that restricts breathing',
					'Tracheomalacia - Weak and floppy tracheal walls',
					'Tracheal Tumors - Abnormal growths obstructing airway'
				]
			},
			{
				id: 4,
				name: 'Bronchi',
				key: 'bronchi',
				icon: '🌳',
				position: { x: 0.02, y: 0.12, z: 0.3 },
				description: 'The bronchi are the main air passages that branch from the trachea into each lung. They further divide into smaller bronchioles throughout the lungs.',
				facts: [
					'Primary bronchi branch into each lung',
					'Divide into smaller and smaller bronchioles',
					'Like an upside-down tree structure',
					'Lead to tiny air sacs called alveoli'
				],
				diseases: [
					'Bronchitis - Inflammation of bronchial tubes',
					'Bronchiectasis - Permanent widening and damage',
					'Asthma - Narrowing and swelling with extra mucus',
					'Bronchiolitis - Inflammation of small airways'
				]
			},
			{
				id: 5,
				name: 'Pleura',
				key: 'pleura',
				icon: '🛡️',
				position: { x: -0.42, y: 0.68, z: 0.05 },
				description: 'The pleura is a thin, protective membrane that covers the lungs and lines the chest cavity. It produces fluid that helps lungs glide smoothly during breathing.',
				facts: [
					'Double-layered protective membrane',
					'Produces lubricating fluid',
					'Reduces friction during breathing',
					'Helps lungs expand and contract smoothly'
				],
				diseases: [
					'Pleurisy - Inflammation causing sharp chest pain',
					'Pleural Mesothelioma - Cancer of pleural lining',
					'Pleural Effusion - Excess fluid between layers',
					'Pneumothorax - Air leak causing lung collapse'
				]
			}
		]
	},
	liver: {
		modelPath: '/models/slicedLiver/slicedLiver.glb',
		scale: { x: 5, y: 5, z: 5 },
		position: { y: 0 },
		cameraPosition: { x: 8, y: 0, z: 5 },
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
				name: 'Right Lobe',
				key: 'right_lobe',
				icon: '🟤',
				position: { x: 0.34, y: 0.13, z: -0.06 },
				description: 'The right lobe is the largest section of the liver, making up about 60-70% of the total liver mass. It performs the majority of the liver\'s metabolic functions.',
				facts: [
					'Largest section of the liver (60-70% of mass)',
					'Has 4 functional segments',
					'Handles majority of metabolic functions',
					'Can independently regenerate if damaged'
				],
				diseases: [
					'Hepatocellular Carcinoma - Primary liver cancer',
					'Cirrhosis - Scarring from chronic liver damage',
					'Fatty Liver Disease - Fat buildup in liver cells',
					'Hepatitis - Viral inflammation of the liver'
				]
			},
			{
				id: 2,
				name: 'Left Lobe',
				key: 'left_lobe',
				icon: '🟤',
				position: { x: -0.22, y: 0.14, z: 0.03 },
				description: 'The left lobe is smaller but equally important, making up about 30-40% of the liver. It works in harmony with the right lobe to perform vital functions.',
				facts: [
					'Smaller section (30-40% of liver mass)',
					'Has 2 functional segments',
					'Works in harmony with right lobe',
					'Also capable of regeneration'
				],
				diseases: [
					'Liver Metastases - Cancer spread from other organs',
					'Liver Abscess - Pus-filled pocket from infection',
					'Hemangioma - Benign blood vessel tumor',
					'Focal Nodular Hyperplasia - Benign growth'
				]
			},
			{
				id: 3,
				name: 'Gallbladder',
				key: 'gallbladder',
				icon: '💚',
				position: { x: 0.17, y: -0.09, z: 0.35 },
				description: 'The gallbladder is a small pouch that stores and concentrates bile produced by the liver. It releases bile to help digest fats when you eat.',
				facts: [
					'Stores and concentrates bile',
					'About 7-10 cm long',
					'Can hold up to 50 ml of bile',
					'Releases bile when you eat fatty foods'
				],
				diseases: [
					'Gallstones - Hard deposits blocking bile ducts',
					'Cholecystitis - Inflammation of gallbladder',
					'Gallbladder Cancer - Rare malignancy',
					'Biliary Dyskinesia - Poor gallbladder emptying'
				]
			},
			{
				id: 4,
				name: 'Bile Ducts',
				key: 'bile_ducts',
				icon: '🟢',
				position: { x: -0.06, y: -0.15, z: 0.04 },
				description: 'The bile ducts form a network of tubes that carry bile from the liver to the gallbladder and small intestine. Bile helps digest fats and absorb vitamins.',
				facts: [
					'Network of tubes carrying bile',
					'Common bile duct connects to small intestine',
					'Bile helps digest fats and oils',
					'Helps absorb fat-soluble vitamins (A, D, E, K)'
				],
				diseases: [
					'Cholangitis - Infection of bile ducts',
					'Bile Duct Cancer - Rare but serious cancer',
					'Primary Sclerosing Cholangitis - Chronic scarring',
					'Bile Duct Obstruction - Blockage preventing bile flow'
				]
			}
		]
	},
	kidney: {
		modelPath: '/models/slicedKidney/slicedKidney.glb',
		scale: { x: 6, y: 6, z: 6 },
		position: { y: 0 },
		cameraPosition: { x: 8, y: 0, z: 5 },
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
				name: 'Renal Cortex',
				key: 'renal_cortex',
				icon: '🟤',
				position: { x: 0.09, y: 0.4, z: 0.12 },
				description: 'The renal cortex is the outer layer of the kidney containing the filtering units called nephrons. This is where blood filtration begins.',
				facts: [
					'Outer layer of the kidney',
					'Contains millions of nephrons (filtering units)',
					'Receives 20-25% of cardiac output',
					'First stage of blood filtration occurs here'
				],
				diseases: [
					'Glomerulonephritis - Inflammation of kidney filters',
					'Acute Tubular Necrosis - Damage to tubule cells',
					'Cortical Necrosis - Death of cortex tissue',
					'IgA Nephropathy - Antibody buildup in kidneys'
				]
			},
			{
				id: 2,
				name: 'Renal Medulla',
				key: 'renal_medulla',
				icon: '🔴',
				position: { x: 0.16, y: 0.33, z: -0.01 },
				description: 'The renal medulla is the inner region of the kidney that concentrates urine. It contains pyramid-shaped structures that collect and transport urine.',
				facts: [
					'Inner layer of the kidney',
					'Contains renal pyramids',
					'Concentrates urine as it passes through',
					'Maintains body\'s salt and water balance'
				],
				diseases: [
					'Medullary Sponge Kidney - Cyst formation in tubules',
					'Renal Papillary Necrosis - Death of inner kidney tissue',
					'Pyelonephritis - Kidney infection starting in pelvis',
					'Renal Tuberculosis - TB infection of kidney'
				]
			},
			{
				id: 3,
				name: 'Renal Pelvis',
				key: 'renal_pelvis',
				icon: '💛',
				position: { x: 0, y: 0.11, z: -0.01 },
				description: 'The renal pelvis is a funnel-shaped structure that collects urine from the kidney and channels it to the ureter, which leads to the bladder.',
				facts: [
					'Funnel-shaped collection area',
					'Collects urine from the kidney',
					'Connects to the ureter',
					'Sends urine to the bladder for storage'
				],
				diseases: [
					'Hydronephrosis - Swelling from urine backup',
					'Kidney Stones - Hard deposits causing blockage',
					'Renal Pelvis Cancer - Transitional cell carcinoma',
					'Ureteropelvic Junction Obstruction - Blockage at ureter connection'
				]
			},
			
			{
				id: 4,
				name: 'Renal Artery',
				key: 'renal_artery',
				icon: '🔴',
				position: { x: -0.18, y: 0.08, z: -0.35 },
				description: 'The renal artery brings oxygen-rich blood from the heart to the kidney for filtration. It branches into smaller vessels throughout the kidney.',
				facts: [
					'Supplies blood to the kidney',
					'Carries about 1.2 liters of blood per minute',
					'Branches into smaller arterioles',
					'Delivers blood to nephrons for filtering'
				],
				diseases: [
					'Renal Artery Stenosis - Narrowing reducing blood flow',
					'Renal Artery Thrombosis - Blood clot blocking artery',
					'Fibromuscular Dysplasia - Abnormal cell growth in artery wall',
					'Renal Artery Aneurysm - Bulging weakened artery'
				]
			},
			{
				id: 5,
				name: 'Ureter',
				key: 'ureter',
				icon: '💧',
				position: { x: 0.01, y: -0.35, z: -0.09 },
				description: 'The ureter is a tube that carries urine from the kidney to the bladder. Muscles in the ureter walls push urine downward in waves.',
				facts: [
					'Tube connecting kidney to bladder',
					'About 25-30 cm long',
					'Uses peristaltic waves to move urine',
					'Can pass about 2 liters of urine daily'
				],
				diseases: [
					'Ureteral Stricture - Narrowing from scarring',
					'Ureteritis - Inflammation from infection',
					'Ureteral Cancer - Rare malignancy of ureter',
					'Vesicoureteral Reflux - Backward flow of urine'
				]
			}
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