import { useState, useCallback, useRef } from 'react';

interface CastSession {
  isConnected: boolean;
  deviceName: string | null;
}

export function useCast() {
  const [castSession, setCastSession] = useState<CastSession>({
    isConnected: false,
    deviceName: null,
  });
  const castWindowRef = useRef<Window | null>(null);

  const startCasting = useCallback(async () => {
    try {
      // Open the app in a new popup window for casting to external display
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;
      
      const castWindow = window.open(
        window.location.origin + '/dashboard',
        'CastWindow',
        `width=${width},height=${height},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,fullscreen=yes`
      );

      if (castWindow) {
        castWindowRef.current = castWindow;
        
        // Try to move to secondary display if available
        castWindow.moveTo(window.screen.availWidth, 0);
        
        // Make it fullscreen-like
        castWindow.resizeTo(width, height);
        
        setCastSession({
          isConnected: true,
          deviceName: 'External Window',
        });

        // Monitor if window is closed
        const checkWindow = setInterval(() => {
          if (castWindow.closed) {
            clearInterval(checkWindow);
            setCastSession({
              isConnected: false,
              deviceName: null,
            });
            castWindowRef.current = null;
          }
        }, 1000);

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to start casting:', error);
      return false;
    }
  }, []);

  const stopCasting = useCallback(() => {
    if (castWindowRef.current && !castWindowRef.current.closed) {
      castWindowRef.current.close();
    }
    castWindowRef.current = null;
    setCastSession({
      isConnected: false,
      deviceName: null,
    });
  }, []);

  return {
    castSession,
    isCastAvailable: true,
    startCasting,
    stopCasting,
  };
}
