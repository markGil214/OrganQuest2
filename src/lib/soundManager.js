// Sound Manager for OrganQuest2
// Handles all audio effects for button clicks and quiz feedback

class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.3;
    
    // Create audio context for Web Audio API
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      // Create audio context on user interaction
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Play click sound (short beep)
  playClick() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      // Silently fail if audio doesn't work
    }
  }

  // Play success sound (ascending notes)
  playSuccess() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const now = this.audioContext.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      notes.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = now + (index * 0.1);
        gainNode.gain.setValueAtTime(this.volume * 0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      });
    } catch (error) {
      // Silently fail if audio doesn't work
    }
  }

  // Play error sound (low buzz)
  playError() {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(this.volume * 0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      // Silently fail if audio doesn't work
    }
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Enable sounds
  enable() {
    this.enabled = true;
    if (!this.audioContext) {
      this.initAudioContext();
    }
  }

  // Disable sounds
  disable() {
    this.enabled = false;
  }
}

// Create and export singleton instance
const soundManager = new SoundManager();

// Resume audio context on user interaction (required by some browsers)
if (typeof document !== 'undefined') {
  document.addEventListener('click', () => {
    if (soundManager.audioContext && soundManager.audioContext.state === 'suspended') {
      soundManager.audioContext.resume();
    }
  }, { once: true });
}

export default soundManager;
