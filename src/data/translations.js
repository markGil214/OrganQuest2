// Language translations for OrganQuest
// Supports English and Filipino languages

export const translations = {
  // Common/General
  common: {
    english: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      back: 'Back',
      continue: 'Continue',
      cancel: 'Cancel',
      submit: 'Submit',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
      next: 'Next',
      previous: 'Previous'
    },
    filipino: {
      login: 'Mag-login',
      register: 'Magrehistro',
      logout: 'Mag-logout',
      back: 'Bumalik',
      continue: 'Magpatuloy',
      cancel: 'Kanselahin',
      submit: 'Ipasa',
      save: 'I-save',
      delete: 'Tanggalin',
      edit: 'I-edit',
      loading: 'Naglo-load...',
      error: 'May Mali',
      success: 'Tagumpay',
      yes: 'Oo',
      no: 'Hindi',
      close: 'Isara',
      next: 'Susunod',
      previous: 'Nakaraan'
    }
  },

  // Login Page
  login: {
    english: {
      title: 'Welcome Back!',
      subtitle: 'Login to continue your anatomy adventure',
      username: 'Username',
      password: 'Password',
      usernamePlaceholder: 'Enter your username',
      passwordPlaceholder: 'Enter your password',
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      noAccount: "Don't have an account?",
      createAccount: 'Create New Account',
      loginFailed: 'Login failed. Please try again.',
      emptyFields: 'Please fill in all fields.'
    },
    filipino: {
      title: 'Maligayang Pagbabalik!',
      subtitle: 'Mag-login upang ipagpatuloy ang iyong paglalakbay sa anatomiya',
      username: 'Username',
      password: 'Password',
      usernamePlaceholder: 'Ilagay ang iyong username',
      passwordPlaceholder: 'Ilagay ang iyong password',
      loginButton: 'Mag-login',
      loggingIn: 'Nag-lo-login...',
      noAccount: 'Walang account?',
      createAccount: 'Gumawa ng Bagong Account',
      loginFailed: 'Hindi matagumpay ang pag-login. Subukan ulit.',
      emptyFields: 'Pakipunan ang lahat ng patlang.'
    }
  },

  // Register Page
  register: {
    english: {
      title: 'Create Account',
      fullName: 'Full Name',
      username: 'Username',
      password: 'Password',
      age: 'Age',
      grade: 'Grade',
      selectAvatar: 'Select your avatar:',
      selectLanguage: 'Select language:',
      fullNamePlaceholder: 'Enter your full name',
      usernamePlaceholder: 'Choose a username',
      passwordPlaceholder: 'Create a password',
      agePlaceholder: 'Age',
      registerButton: 'Register',
      registering: 'Registering...',
      registrationFailed: 'Registration failed. Please try again.',
      haveAccount: 'Already have an account?',
      loginNow: 'Login Now',
      grades: {
        '4th': '4th Grade',
        '5th': '5th Grade',
        '6th': '6th Grade'
      }
    },
    filipino: {
      title: 'Gumawa ng Account',
      fullName: 'Buong Pangalan',
      username: 'Username',
      password: 'Password',
      age: 'Edad',
      grade: 'Baitang',
      selectAvatar: 'Pumili ng iyong avatar:',
      selectLanguage: 'Pumili ng wika:',
      fullNamePlaceholder: 'Ilagay ang iyong buong pangalan',
      usernamePlaceholder: 'Pumili ng username',
      passwordPlaceholder: 'Gumawa ng password',
      agePlaceholder: 'Edad',
      registerButton: 'Magrehistro',
      registering: 'Nagrerehistro...',
      registrationFailed: 'Hindi matagumpay ang pagrehistro. Subukan ulit.',
      haveAccount: 'Mayroon nang account?',
      loginNow: 'Mag-login Ngayon',
      grades: {
        '4th': 'Ika-4 na Baitang',
        '5th': 'Ika-5 na Baitang',
        '6th': 'Ika-6 na Baitang'
      }
    }
  },

  // Welcome Page
  welcome: {
    english: {
      greeting: 'Welcome',
      successMessage: 'Your account has been created successfully.',
      readyMessage: 'Ready to explore the amazing world of human anatomy?',
      continueButton: 'Continue to Explorer'
    },
    filipino: {
      greeting: 'Maligayang Pagdating',
      successMessage: 'Matagumpay na nagawa ang iyong account.',
      readyMessage: 'Handa ka na bang tuklasin ang kahanga-hangang mundo ng anatomiya ng tao?',
      continueButton: 'Magpatuloy sa Explorer'
    }
  },

  // Main Menu
  mainMenu: {
    english: {
      greeting: 'Hello',
      subtitle: 'Ready to explore?',
      appTitle: 'OrganQuest',
      tagline: 'Learn • Explore • Discover',
      scanExplore: 'Scan & Explore',
      scanExploreSubtitle: 'Discover amazing organs!',
      quizPuzzles: 'Quiz & Puzzles',
      quizPuzzlesSubtitle: 'Test your knowledge!',
      learnMore: 'Learn More',
      learnMoreSubtitle: 'Fun facts & stories!',
      exit: 'Exit',
      exitSubtitle: 'See you next time!'
    },
    filipino: {
      greeting: 'Kumusta',
      subtitle: 'Handa ka nang magtuklas?',
      appTitle: 'OrganQuest',
      tagline: 'Matuto • Tuklasin • Alamin',
      scanExplore: 'I-scan at Tuklasin',
      scanExploreSubtitle: 'Tuklasin ang mga kahanga-hangang organ!',
      quizPuzzles: 'Quiz at Palaisipan',
      quizPuzzlesSubtitle: 'Subukin ang iyong kaalaman!',
      learnMore: 'Matuto Pa',
      learnMoreSubtitle: 'Mga kawili-wiling katotohanan at kuwento!',
      exit: 'Lumabas',
      exitSubtitle: 'Hanggang sa muli!'
    }
  },

  // Quiz Menu
  quizMenu: {
    english: {
      title: 'Quiz & Puzzles',
      subtitle: 'Choose your favorite game mode!',
      multipleChoice: 'Multiple Choice',
      multipleChoiceDesc: 'Test your knowledge with fun questions about human anatomy!',
      memoryMatching: 'Memory Matching',
      memoryMatchingDesc: 'Match organ pairs and boost your memory skills!',
      timedChallenge: 'Timed Challenge',
      timedChallengeDesc: 'Race against time to answer as many questions as possible!'
    },
    filipino: {
      title: 'Quiz at Palaisipan',
      subtitle: 'Pumili ng iyong paboritong laro!',
      multipleChoice: 'Multiple Choice',
      multipleChoiceDesc: 'Subukin ang iyong kaalaman sa masayang mga tanong tungkol sa anatomiya ng tao!',
      memoryMatching: 'Memory Matching',
      memoryMatchingDesc: 'Itugma ang mga pares ng organ at pahusayin ang iyong memorya!',
      timedChallenge: 'Timed Challenge',
      timedChallengeDesc: 'Makipaglaban sa oras upang masagutan ang maraming tanong!'
    }
  },

  // Profile Modal
  profile: {
    english: {
      title: 'My Profile',
      username: 'Username',
      fullName: 'Full Name',
      age: 'Age',
      grade: 'Grade',
      language: 'Language',
      stats: 'Statistics',
      quizzesTaken: 'Quizzes Taken',
      totalScore: 'Total Score',
      highScore: 'High Score',
      organsExplored: 'Organs Explored',
      settings: 'Settings',
      changeAvatar: 'Change Avatar',
      changeLanguage: 'Change Language',
      logoutButton: 'Logout',
      closeButton: 'Close'
    },
    filipino: {
      title: 'Aking Profile',
      username: 'Username',
      fullName: 'Buong Pangalan',
      age: 'Edad',
      grade: 'Baitang',
      language: 'Wika',
      stats: 'Mga Estadistika',
      quizzesTaken: 'Mga Natapos na Quiz',
      totalScore: 'Kabuuang Puntos',
      highScore: 'Pinakamataas na Puntos',
      organsExplored: 'Mga Organ na Tinuklas',
      settings: 'Mga Setting',
      changeAvatar: 'Palitan ang Avatar',
      changeLanguage: 'Palitan ang Wika',
      logoutButton: 'Mag-logout',
      closeButton: 'Isara'
    }
  },

  // Scan & Explore
  scanExplore: {
    english: {
      title: 'Scan & Explore',
      subtitle: 'Choose how you want to discover organs!',
      arScanner: 'AR Scanner',
      arScannerDesc: 'Use your camera to scan markers and see organs in 3D!',
      organGallery: 'Organ Gallery',
      organGalleryDesc: 'Browse and learn about different organs!',
      scanNow: 'Scan Now',
      explore: 'Explore'
    },
    filipino: {
      title: 'I-scan at Tuklasin',
      subtitle: 'Pumili kung paano mo gustong tuklasin ang mga organ!',
      arScanner: 'AR Scanner',
      arScannerDesc: 'Gamitin ang iyong camera upang i-scan ang mga marker at makita ang mga organ sa 3D!',
      organGallery: 'Organ Gallery',
      organGalleryDesc: 'Mag-browse at matuto tungkol sa iba\'t ibang organ!',
      scanNow: 'I-scan Ngayon',
      explore: 'Tuklasin'
    }
  },

  // Organs (Filipino translations)
  organs: {
    english: {
      heart: 'Heart',
      lungs: 'Lungs',
      brain: 'Brain',
      liver: 'Liver',
      kidney: 'Kidney',
      stomach: 'Stomach',
      intestine: 'Intestine',
      bladder: 'Bladder',
      spleen: 'Spleen',
      pancreas: 'Pancreas',
      eyes: 'Eyes',
      tongue: 'Tongue',
      thyroidGland: 'Thyroid Gland',
      diaphragm: 'Diaphragm',
      pelvisFemur: 'Pelvis & Femur'
    },
    filipino: {
      heart: 'Puso',
      lungs: 'Baga',
      brain: 'Utak',
      liver: 'Atay',
      kidney: 'Bato',
      stomach: 'Tiyan',
      intestine: 'Bituka',
      bladder: 'Pantog',
      spleen: 'Lapay',
      pancreas: 'Pancreas',
      eyes: 'Mata',
      tongue: 'Dila',
      thyroidGland: 'Thyroid Gland',
      diaphragm: 'Diaphragm',
      pelvisFemur: 'Pelvis at Femur'
    }
  },

  // Quiz/Game Messages
  quiz: {
    english: {
      score: 'Score',
      question: 'Question',
      of: 'of',
      timeLeft: 'Time Left',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      tryAgain: 'Try Again',
      nextQuestion: 'Next Question',
      finish: 'Finish',
      yourScore: 'Your Score',
      congratulations: 'Congratulations!',
      goodJob: 'Good Job!',
      keepPracticing: 'Keep Practicing!',
      playAgain: 'Play Again',
      backToMenu: 'Back to Menu',
      startQuiz: 'Start Quiz',
      instructions: 'Instructions',
      ready: 'Ready?',
      go: 'Go!'
    },
    filipino: {
      score: 'Puntos',
      question: 'Tanong',
      of: 'sa',
      timeLeft: 'Natitira',
      correct: 'Tama!',
      incorrect: 'Mali',
      tryAgain: 'Subukan Muli',
      nextQuestion: 'Susunod na Tanong',
      finish: 'Tapusin',
      yourScore: 'Iyong Puntos',
      congratulations: 'Binabati Kita!',
      goodJob: 'Mahusay!',
      keepPracticing: 'Magsanay Pa!',
      playAgain: 'Maglaro Muli',
      backToMenu: 'Bumalik sa Menu',
      startQuiz: 'Simulan ang Quiz',
      instructions: 'Mga Tagubilin',
      ready: 'Handa na?',
      go: 'Simulan!'
    }
  },

  // Admin Dashboard
  admin: {
    english: {
      title: 'Admin Dashboard',
      overview: 'Overview',
      users: 'Users',
      quizzes: 'Quizzes',
      reports: 'Reports',
      settings: 'Settings',
      totalStudents: 'Total Students',
      activeUsers: 'Active Users',
      quizzesCompleted: 'Quizzes Completed',
      averageScore: 'Average Score',
      manageUsers: 'Manage Users',
      viewReports: 'View Reports',
      addContent: 'Add Content'
    },
    filipino: {
      title: 'Admin Dashboard',
      overview: 'Pangkalahatang-tanaw',
      users: 'Mga User',
      quizzes: 'Mga Quiz',
      reports: 'Mga Ulat',
      settings: 'Mga Setting',
      totalStudents: 'Kabuuang Mag-aaral',
      activeUsers: 'Mga Aktibong User',
      quizzesCompleted: 'Mga Natapos na Quiz',
      averageScore: 'Average na Puntos',
      manageUsers: 'Pamahalaan ang mga User',
      viewReports: 'Tingnan ang mga Ulat',
      addContent: 'Magdagdag ng Content'
    }
  },

  // Error Messages
  errors: {
    english: {
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      invalidCredentials: 'Invalid username or password.',
      userExists: 'Username already exists.',
      requiredFields: 'Please fill in all required fields.',
      invalidAge: 'Please enter a valid age.',
      passwordTooShort: 'Password must be at least 6 characters.',
      somethingWrong: 'Something went wrong. Please try again.'
    },
    filipino: {
      networkError: 'May problema sa koneksyon. Pakisuri ang iyong internet.',
      serverError: 'May problema sa server. Subukan ulit mamaya.',
      invalidCredentials: 'Mali ang username o password.',
      userExists: 'Ang username ay ginagamit na.',
      requiredFields: 'Pakipunan ang lahat ng kinakailangang patlang.',
      invalidAge: 'Maglagay ng tamang edad.',
      passwordTooShort: 'Ang password ay dapat hindi bababa sa 6 na karakter.',
      somethingWrong: 'May nangyaring mali. Subukan ulit.'
    }
  }
};

// Helper function to get translation
export const getTranslation = (section, key, language = 'english') => {
  try {
    return translations[section][language][key] || translations[section]['english'][key] || key;
  } catch (error) {
    console.warn(`Translation not found: ${section}.${key} in ${language}`);
    return key;
  }
};

// Helper function to get all translations for a section
export const getSectionTranslations = (section, language = 'english') => {
  try {
    return translations[section][language] || translations[section]['english'] || {};
  } catch (error) {
    console.warn(`Section not found: ${section} in ${language}`);
    return {};
  }
};

export default translations;
