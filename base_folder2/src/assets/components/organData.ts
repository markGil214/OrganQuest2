export type Organ = {
  id: string;
  name: string;
  image: string;
  modelPath: string;
  description: string;
  icon?: string;
  color?: string;
  funFacts?: string[];
  instructions?: string;
};

export const organs: Organ[] = [
  {
    id: "brain",
    name: "Brain",
    image: "/brain.png",
    modelPath: "/brain/scene.gltf",
    description: "The brain controls thoughts, memory, emotion, touch, motor skills, vision, breathing, and every process that regulates your body.",
    icon: "🧠",
    color: "167, 139, 250",
    funFacts: [
      "Your brain has billions of tiny brain cells!",
      "It never stops working, even when you sleep!",
      "It uses 20% of your body's energy!"
    ],
    instructions: "Point your camera at your head to scan your brain!"
  },
  {
    id: "heart",
    name: "Heart",
    image: "/heart.png",
    modelPath: "/realistic_human_heart/scene.gltf",
    description: "The heart pumps blood throughout the body, supplying oxygen and nutrients to the tissues.",
    icon: "❤️",
    color: "255, 107, 157",
    funFacts: [
      "Your heart beats about 100,000 times every day!",
      "It's about the size of your fist!",
      "It pumps 5 liters of blood every minute!"
    ],
    instructions: "Point your camera at your chest area to scan your heart!"
  },
  {
    id: "kidney",
    name: "Kidneys",
    image: "/kidneys.png",
    modelPath: "/new_kidney/kidney.glb",
    description: "The kidneys filter blood to remove waste and extra fluid, which becomes urine.",
    icon: "🫘",
    color: "34, 197, 94",
    funFacts: [
      "You have two kidneys but can live with just one!",
      "They clean your blood like a washing machine!",
      "They filter 50 gallons of blood every day!"
    ],
    instructions: "Point your camera at your back to scan your kidneys!"
  },
  {
    id: "lungs",
    name: "Lungs",
    image: "/lungs.png",
    modelPath: "/lungs/scene.gltf",
    description: "The lungs are responsible for the exchange of oxygen and carbon dioxide between the air and blood.",
    icon: "🫁",
    color: "96, 165, 250",
    funFacts: [
      "You breathe about 20,000 times a day!",
      "They help you talk and sing!",
      "They have 300 million tiny air sacs!"
    ],
    instructions: "Point your camera at your chest to scan your lungs!"
  },
  {
    id: "skin",
    name: "Skin",
    image: "/skin.png",
    modelPath: "/skin/scene.gltf",
    description: "The skin protects the body from the environment and helps regulate body temperature.",
    icon: "🧴",
    color: "245, 158, 11",
    funFacts: [
      "Your skin is your body's largest organ!",
      "It completely replaces itself every 28 days!",
      "It has millions of tiny sensors to feel touch!"
    ],
    instructions: "Point your camera at your arm to scan your skin!"
  },
];
