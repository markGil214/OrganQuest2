// Sound Manager for click sounds and audio feedback
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.3;
    this.bgMusicVolume = 0.2;
    this.bgMusic = null;
    this.initializeSounds();
    this.initializeBackgroundMusic();
  }

  // Initialize sound files
  initializeSounds() {
    // Preload click sound
    this.sounds.click = new Audio('/sounds/pop.mp3');
    this.sounds.click.volume = this.volume;
  }

  // Initialize background music
  initializeBackgroundMusic() {
    this.bgMusic = new Audio('/sounds/bg music loop.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.bgMusicVolume;
  }

  // Start background music
  startBackgroundMusic() {
    if (this.bgMusic && this.enabled) {
      this.bgMusic.play().catch(err => {
        console.log('Background music autoplay prevented:', err);
      });
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  // Toggle background music
  toggleBackgroundMusic() {
    if (this.bgMusic) {
      if (this.bgMusic.paused) {
        this.startBackgroundMusic();
        return true;
      } else {
        this.stopBackgroundMusic();
        return false;
      }
    }
    return false;
  }

  // Set background music volume
  setBackgroundMusicVolume(vol) {
    this.bgMusicVolume = Math.max(0, Math.min(1, vol));
    if (this.bgMusic) {
      this.bgMusic.volume = this.bgMusicVolume;
    }
  }

  // Create a success sound using Web Audio API
  createSuccessSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 523.25; // C5 note
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);

    // Add second note for pleasant sound
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      oscillator2.frequency.value = 659.25; // E5 note
      oscillator2.type = 'sine';
      gainNode2.gain.setValueAtTime(this.volume * 0.8, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.2);
    }, 100);
  }

  // Create an error/wrong sound using Web Audio API
  createErrorSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(this.volume * 0.6, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  // Play click sound
  playClick() {
    if (this.enabled && this.sounds.click) {
      try {
        // Clone the audio to allow multiple simultaneous plays
        const clickSound = this.sounds.click.cloneNode();
        clickSound.volume = this.volume;
        clickSound.play().catch(err => console.log('Click sound failed:', err));
      } catch (error) {
        console.log('Sound playback failed:', error);
      }
    }
  }

  // Play success sound
  playSuccess() {
    if (this.enabled) {
      try {
        this.createSuccessSound();
      } catch (error) {
        console.log('Sound playback failed:', error);
      }
    }
  }

  // Play error sound
  playError() {
    if (this.enabled) {
      try {
        this.createErrorSound();
      } catch (error) {
        console.log('Sound playback failed:', error);
      }
    }
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
    return this.enabled;
  }

  // Set volume (0 to 1)
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.sounds.click) {
      this.sounds.click.volume = this.volume;
    }
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
