// Sound Manager for click sounds and audio feedback
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.3;
  }

  // Create a simple click sound using Web Audio API
  createClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  // Create a success sound
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

  // Create an error/wrong sound
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
    if (this.enabled) {
      try {
        this.createClickSound();
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
    return this.enabled;
  }

  // Set volume (0 to 1)
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
