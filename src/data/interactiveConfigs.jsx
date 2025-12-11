// Interactive Organ Configurations - React version
export const interactiveConfigs = {
	heart: {
		modelPath: '/models/heartSliced/heart.glb',
		scale: { x: 1.6, y: 1.6, z: 1.6 },
		position: { y: 0 },
		cameraPosition: { x: 0, y: 0, z: 5 },
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
					'Carries deoxygenated blood to the lungs',
					'Only artery that carries oxygen-poor blood',
					'Splits into left and right branches',
					'About 5cm long and 3cm in diameter'
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
				icon: '💜',
				position: { x: -0.53, y: 0.22, z: 0.15 },
				description: 'The right atrium receives oxygen-poor blood from the body through the vena cava and pumps it into the right ventricle.',
				facts: [
					'Receives deoxygenated blood from body',
					'Blood enters from superior and inferior vena cava',
					'Contains the heart\'s natural pacemaker',
					'Thinner walls compared to ventricles'
				],
				diseases: [
					'Atrial Fibrillation - Irregular heartbeat starting in the atria',
					'Right Atrial Enlargement - Stretched from increased pressure',
					'Sick Sinus Syndrome - Problems with the heart\'s pacemaker',
					'Atrial Flutter - Rapid but regular abnormal heart rhythm'
				]
			},
			{
				id: 7,
				name: 'Interventricular Septum',
				key: 'septum',
				icon: '🧱',
				position: { x: 0.09, y: -0.17, z: 0.42 },
				description: 'The interventricular septum is the muscular wall that separates the left and right ventricles, preventing oxygen-rich and oxygen-poor blood from mixing.',
				facts: [
					'Separates left and right ventricles',
					'Prevents mixing of oxygenated and deoxygenated blood',
					'Thickest in the ventricular region',
					'Contains part of the heart\'s electrical system'
				],
				diseases: [
					'Ventricular Septal Defect - Hole in the wall between ventricles',
					'Hypertrophic Cardiomyopathy - Abnormal thickening of septum',
					'Septal Rupture - Life-threatening tear in the septum',
					'Bundle Branch Block - Electrical conduction problem'
				]
			}
		],
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
					'Right Lower Lobe Pneumonia - Infection causing inflammation and fluid accumulation in the right lower lobe, common bacterial infection',
					'Right Lung Atelectasis - Partial or complete collapse of the right lung or a section of it, often post-surgery',
					'Right Pleural Effusion - Excess fluid between pleural layers on the right side, can indicate heart failure or infection',
					'Right Lung Tumor - Abnormal mass in the right lung, can be benign or malignant, requires medical evaluation'
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
					'Left Lung Tuberculosis - Bacterial infection causing granulomas, weight loss, and night sweats, requires long-term antibiotics',
					'Left Upper Lobe Collapse - Collapse of the left upper lobe, often due to mucus plugging or tumor obstruction',
					'Left Lung Cancer - Malignant tumor in the left lung, often linked to smoking, requires oncology treatment',
					'Left Pleural Thickening - Scarring and thickening of the pleural membrane, can restrict lung expansion'
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
					'Tracheal Stenosis - Narrowing of the trachea, can cause breathing difficulty, often from prolonged intubation',
					'Tracheomalacia - Weakening of tracheal walls causing collapse during breathing, affects infants and adults',
					'Tracheal Tumor - Benign or malignant growth in the trachea, can obstruct airflow and cause coughing',
					'Tracheitis - Inflammation of the trachea from bacterial or viral infection, causes cough and difficulty breathing'
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
					'Bronchitis - Inflammation of the bronchial tubes causing cough and mucus production, can be acute or chronic',
					'Bronchiectasis - Permanent widening of the bronchi from repeated infections, causes chronic cough and infections',
					'Bronchial Asthma - Chronic inflammation causing airway narrowing, wheezing, and difficulty breathing',
					'Bronchial Obstruction - Blockage of bronchi from tumor, foreign body, or mucus plug, requires immediate treatment'
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
					'Pleurisy - Inflammation of the pleura causing sharp chest pain with breathing, often from viral infection',
					'Pleural Mesothelioma - Rare cancer of the pleural lining, strongly linked to asbestos exposure',
					'Pneumothorax - Air in the pleural space causing lung collapse, can be spontaneous or traumatic',
					'Hemothorax - Blood accumulation in pleural space, usually from trauma or surgery, requires drainage'
				]
			}
		]
	},
	liver: {
		modelPath: '/models/liver/liver.glb',
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
					'Right Lobe Hepatoma - Primary liver cancer originating in the right lobe, often in cirrhotic livers',
					'Right Lobe Abscess - Pus collection in the right lobe from bacterial infection, causes fever and pain',
					'Right Lobe Fatty Infiltration - Excessive fat accumulation in the right lobe, associated with obesity and diabetes',
					'Right Lobe Hemangioma - Benign blood vessel tumor in the right lobe, usually asymptomatic and requires monitoring'
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
					'Left Lobe Cirrhosis - Chronic scarring of the left lobe from alcohol, hepatitis, or other liver diseases',
					'Left Lobe Metastasis - Cancer spread to the left lobe from other organs, common in colon and breast cancer',
					'Left Lobe Cyst - Fluid-filled sac in the left lobe, usually benign but may require monitoring',
					'Left Lobe Atrophy - Shrinkage of the left lobe from chronic disease or vascular compromise'
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
					'Gallstones - Hard deposits of cholesterol or bilirubin causing pain and inflammation, may require surgery',
					'Cholecystitis - Inflammation of the gallbladder from gallstone obstruction, causes severe right upper abdominal pain',
					'Gallbladder Polyps - Small growths on the gallbladder wall, usually benign but may require removal if large',
					'Gallbladder Cancer - Rare malignant tumor of the gallbladder, often discovered late and has poor prognosis'
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
					'Bile Duct Obstruction - Blockage from gallstones or tumors causing jaundice and pain, requires urgent treatment',
					'Cholangitis - Bacterial infection of bile ducts causing fever, jaundice, and abdominal pain',
					'Primary Sclerosing Cholangitis - Chronic inflammation and scarring of bile ducts, associated with ulcerative colitis',
					'Bile Duct Cancer - Malignant tumor in the bile ducts, difficult to detect early and requires specialized treatment'
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
					'Glomerulonephritis - Inflammation of the kidney filters causing blood and protein in urine, can lead to kidney failure',
					'Cortical Necrosis - Death of cortical tissue from severe blood flow reduction, medical emergency requiring dialysis',
					'Focal Segmental Glomerulosclerosis - Scarring of some glomeruli causing protein loss and kidney dysfunction',
					'Membranous Nephropathy - Thickening of glomerular membranes causing nephrotic syndrome with protein loss'
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
					'Medullary Sponge Kidney - Congenital disorder causing cysts in collecting ducts, leads to kidney stones and infections',
					'Medullary Cystic Kidney Disease - Inherited disorder causing cysts and progressive kidney failure',
					'Pyelonephritis - Bacterial infection of the kidney causing fever, back pain, and painful urination',
					'Papillary Necrosis - Death of renal papillae from infection or diabetes, causes blood in urine and kidney dysfunction'
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
					'Hydronephrosis - Swelling of the renal pelvis from urine backup due to obstruction, requires urgent treatment',
					'Renal Pelvis Cancer - Transitional cell carcinoma of the renal pelvis, causes blood in urine',
					'Pelviureteric Junction Obstruction - Blockage at the junction between pelvis and ureter, often congenital',
					'Pyelitis - Inflammation of the renal pelvis from infection, causes pain and fever'
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
					'Renal Artery Stenosis - Narrowing of the renal artery causing high blood pressure and kidney dysfunction',
					'Renal Artery Thrombosis - Blood clot blocking the renal artery, causes sudden kidney failure and severe pain',
					'Fibromuscular Dysplasia - Abnormal artery wall growth causing stenosis, more common in young women',
					'Renal Artery Aneurysm - Bulging of the artery wall that can rupture, requires monitoring or surgical repair'
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
					'Ureteral Stones - Kidney stones lodged in the ureter causing severe pain and obstruction, requires lithotripsy or surgery',
					'Ureteral Stricture - Narrowing of the ureter from scarring or injury, causes urine backup and kidney damage',
					'Ureterocele - Bulging of the ureter into the bladder, congenital defect that may require surgical correction',
					'Ureteral Cancer - Malignant tumor in the ureter causing blood in urine, requires removal of kidney and ureter'
				]
			}
		]
	}
};

export default interactiveConfigs;
