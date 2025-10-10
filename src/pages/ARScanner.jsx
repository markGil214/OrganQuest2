import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { trackOrganExploration } from '../lib/organTracker';

// Global stream storage outside component scope
let globalCameraStream = null;

const ARScanner = () => {
  const [organId, setOrganId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const isCleaningUp = useRef(false); // Prevent multiple cleanup calls

  // Extract organ ID from hash
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/ar-scanner\/(.+)/);
    if (match) {
      setOrganId(match[1]);
    }
  }, []);

  // Organ data
  const organData = {
    heart: {
      name: 'Heart',
      emoji: '❤️',
      color: '#e74c3c',
      facts: [
        'Your heart beats about 100,000 times per day!',
        'It pumps about 5 liters of blood every minute.',
        'The heart has 4 chambers: 2 atria and 2 ventricles.'
      ]
    },
    brain: {
      name: 'Brain',
      emoji: '🧠',
      color: '#9b59b6',
      facts: [
        'Your brain uses 20% of your body\'s energy!',
        'It contains about 86 billion neurons.',
        'The brain processes information faster than any computer!'
      ]
    },
    lungs: {
      name: 'Lungs',
      emoji: '🫁',
      color: '#3498db',
      facts: [
        'You breathe about 20,000 times per day!',
        'Your lungs contain about 300 million air sacs.',
        'They help remove carbon dioxide from your blood.'
      ]
    },
    liver: {
      name: 'Liver',
      emoji: '🍃',
      color: '#e67e22',
      facts: [
        'Your liver performs over 300 different functions!',
        'It can regenerate itself if damaged.',
        'It helps filter toxins from your blood.'
      ]
    },
    kidney: {
      name: 'Kidneys',
      emoji: '🫘',
      color: '#27ae60',
      facts: [
        'Your kidneys filter about 50 gallons of blood daily!',
        'You have two kidneys, but can live with just one.',
        'They help control your blood pressure.'
      ]
    },
    skin: {
      name: 'Skin',
      emoji: '🧴',
      color: '#f39c12',
      facts: [
        'Your skin is your body\'s largest organ!',
        'It completely replaces itself every 28 days!',
        'It has millions of tiny sensors to feel touch!'
      ]
    }
  };

  const currentOrgan = organData[organId] || organData.heart;

  // Initialize camera
  const initializeCamera = async () => {
    try {
      setError('');
      console.log('Initializing camera...');
      
      // Stop any existing stream first
      if (streamRef.current) {
        console.log('Existing stream found, stopping it first...');
        stopCamera();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('Camera stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks());
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        globalCameraStream = stream; // Store globally as backup
        window.activeStream = stream; // Store in window as ultimate backup
        console.log('Stream assigned to refs, global variable, and window');
        setHasPermission(true);
        setIsScanning(true);
        
        // Track organ exploration when camera starts
        trackOrganExploration(organId);
      } else {
        console.error('Video ref is null!');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Unable to access camera. Please check permissions and try again.');
      }
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  // Cleanup camera stream - immediate and synchronous
  const stopCamera = () => {
    // Prevent multiple cleanup calls
    if (isCleaningUp.current) {
      console.log('Already cleaning up camera, skipping...');
      return;
    }
    
    isCleaningUp.current = true;
    console.log('Stopping camera immediately...');
    console.log('streamRef.current:', streamRef.current);
    console.log('videoRef.current:', videoRef.current);
    console.log('videoRef.current.srcObject:', videoRef.current?.srcObject);
    
    // Try to get stream from video element if streamRef is null
    let streamToStop = streamRef.current;
    if (!streamToStop && videoRef.current && videoRef.current.srcObject) {
      console.log('Stream ref is null, trying to get stream from video element...');
      streamToStop = videoRef.current.srcObject;
    }
    
    // Stop media tracks first - this turns off the camera light
    if (streamToStop) {
      console.log('Stream exists, checking tracks...');
      const tracks = streamToStop.getTracks();
      console.log(`Found ${tracks.length} tracks to stop`);
      
      try {
        tracks.forEach((track, index) => {
          console.log(`Track ${index}: kind=${track.kind}, readyState=${track.readyState}, enabled=${track.enabled}`);
          
          // First disable the track
          track.enabled = false;
          
          if (track.readyState === 'live') {
            track.stop();
            console.log(`✓ Stopped ${track.kind} track`);
          } else {
            console.log(`⚠ Track ${track.kind} was already ${track.readyState}`);
          }
          
          // Double-check the track is really stopped
          console.log(`Track ${index} after stop: readyState=${track.readyState}, enabled=${track.enabled}`);
        });
      } catch (err) {
        console.error('Error stopping tracks:', err);
      }
      
      streamRef.current = null;
      globalCameraStream = null; // Clear global reference too
      console.log('Stream reference cleared');
    } else {
      console.log('No stream to stop');
    }
    
    // Clear video element completely
    if (videoRef.current) {
      console.log('Clearing video element...');
      const video = videoRef.current;
      
      // Stop video playback
      video.pause();
      
      // Clear all possible sources
      video.srcObject = null;
      video.src = '';
      video.load(); // Force reload to clear any cached streams
      
      console.log('Video element cleared and reloaded');
    }
    
    // Update states
    setIsScanning(false);
    setHasPermission(false);
    
    console.log('Camera stopped - all cleanup complete');
    
    // Reset cleanup flag immediately
    isCleaningUp.current = false;
  };

  // Handle component cleanup only
  useEffect(() => {
    return () => {
      // Synchronous cleanup on unmount
      console.log('Component unmounting, cleaning up camera');
      
      // Get stream from video element if refs are cleared
      const video = document.querySelector('.camera-feed');
      const stream = video?.srcObject;
      
      if (stream) {
        console.log('Found stream in video element, stopping tracks...');
        stream.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.enabled = false;
            track.stop();
            console.log(`Stopped ${track.kind} track on unmount`);
          }
        });
        
        if (video) {
          video.pause();
          video.srcObject = null;
          video.src = '';
          video.load();
        }
      }
      
      // Also try refs if they still exist
      if (streamRef.current && !isCleaningUp.current) {
        streamRef.current.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.enabled = false;
            track.stop();
          }
        });
        streamRef.current = null;
      }
      
      // Try global stream as final fallback
      if (globalCameraStream) {
        console.log('Using global stream as final fallback...');
        globalCameraStream.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.enabled = false;
            track.stop();
            console.log(`Stopped ${track.kind} track via global fallback`);
          }
        });
        globalCameraStream = null;
      }
      
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      
      console.log('Component unmount cleanup complete');
    };
  }, []); // Empty dependency array - only runs on mount/unmount

  const handleStartScan = () => {
    initializeCamera();
  };

  // Helper to synchronously stop camera and then reload to AR scanner
  const navigateWithCameraStop = () => {
    // Stop camera synchronously while video element is still present
    const videoElement = videoRef.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject;
      try {
        stream.getTracks().forEach(track => {
          track.enabled = false;
          track.stop();
        });
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
      videoElement.pause();
      videoElement.srcObject = null;
      videoElement.src = '';
    }
    globalCameraStream = null;
    window.activeStream = null;
    if (streamRef.current) streamRef.current = null;
    // Set hash to AR scanner and reload
    window.location.hash = '#scan-explore';
    window.location.reload();
  };

  const handleBack = () => {
    console.log('Back button clicked - stopping camera and navigating...');
    navigateWithCameraStop();
  };

  const handleMainMenu = () => {
    console.log('Menu button clicked - stopping camera and navigating...');
    navigateWithCameraStop();
  };

  if (!organId) {
    return (
      <div className="ar-scanner error-state">
        <div className="error-content">
          <h2>Organ not found</h2>
          <button onClick={handleBack} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-scanner" style={{ '--organ-color': currentOrgan.color }}>
      <header className="ar-header">
        <button 
          className="back-button"
          onClick={handleBack}
          aria-label="Go back to organ selection"
        >
          <span className="back-icon">←</span>
        </button>
        
        <div className="organ-info">
          <span className="organ-emoji">{currentOrgan.emoji}</span>
          <h1 className="organ-title">{currentOrgan.name} AR Scanner</h1>
        </div>

        <button 
          className="menu-button"
          onClick={handleMainMenu}
          aria-label="Go to main menu"
        >
          <span className="menu-icon">⚙️</span>
        </button>
      </header>

      <main className="ar-content">
        {!hasPermission && !error && (
          <div className="permission-request">
            <div className="permission-content">
              <div className="camera-icon">📷</div>
              <h2>Camera Permission Required</h2>
              <p>To explore the {currentOrgan.name} in AR, we need access to your camera.</p>
              <button 
                className="start-button"
                onClick={handleStartScan}
              >
                <span className="button-icon">🔍</span>
                Start AR Scanning
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <h2>Camera Error</h2>
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={handleStartScan}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="ar-view">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-feed"
            />
            
            <div className="ar-overlay">
              <div className="scan-frame">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>
              
              <div className="scan-instructions">
                <p>Point your camera at a flat surface</p>
                <div className="scanning-indicator">
                  <div className="pulse"></div>
                  <span>Scanning...</span>
                </div>
              </div>
            </div>

            <div className="ar-controls">
              <button 
                className="stop-button"
                onClick={() => {
                  console.log('Stop button clicked');
                  stopCamera();
                }}
              >
                <span className="stop-icon">⏹️</span>
                Stop Scanning
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="organ-facts">
        <h3>Fun Facts about the {currentOrgan.name}:</h3>
        <ul>
          {currentOrgan.facts.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ARScanner;
