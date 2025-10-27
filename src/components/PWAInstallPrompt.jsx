import { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');

    if (!isInstalled && !hasSeenPrompt) {
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // For iOS or browsers without install prompt
      setShowPrompt(false);
      localStorage.setItem('pwaPromptSeen', 'true');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwaPromptSeen', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptSeen', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-2xl z-50 animate-slideUp">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📱</span>
          <div>
            <h3 className="font-bold text-lg">Install OrganQuest</h3>
            <p className="text-sm text-white/90">
              {isIOS
                ? 'Tap the Share button (⬆️) and select "Add to Home Screen"'
                : 'Add to your home screen for quick access!'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
          >
            Later
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PWAInstallPrompt;
