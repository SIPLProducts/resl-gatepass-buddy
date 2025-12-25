import { useCallback, useMemo, useRef, useState } from 'react';

type CastMode = 'window' | 'screen' | null;

interface CastSession {
  isConnected: boolean;
  deviceName: string | null;
  mode: CastMode;
}

export function useCast() {
  const [castSession, setCastSession] = useState<CastSession>({
    isConnected: false,
    deviceName: null,
    mode: null,
  });

  const castWindowRef = useRef<Window | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const isScreenShareAvailable = useMemo(
    () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia,
    []
  );

  const openCastWindow = useCallback(async (url: string) => {
    try {
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;

      const castWindow = window.open(
        url,
        'CastWindow',
        `width=${width},height=${height},left=0,top=0,menubar=no,toolbar=no,location=no,status=no`
      );

      if (!castWindow) return false;

      castWindowRef.current = castWindow;
      setCastSession({ isConnected: true, deviceName: 'Cast Window', mode: 'window' });

      const checkWindow = window.setInterval(() => {
        if (castWindow.closed) {
          window.clearInterval(checkWindow);
          castWindowRef.current = null;
          setCastSession({ isConnected: false, deviceName: null, mode: null });
        }
      }, 800);

      return true;
    } catch (e) {
      console.error('openCastWindow failed:', e);
      return false;
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      console.warn('getDisplayMedia not supported in this browser');
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30, max: 60 } },
        audio: false,
      });

      screenStreamRef.current = stream;
      setCastSession({ isConnected: true, deviceName: 'Screen Share', mode: 'screen' });

      // When user stops sharing from the browser UI
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        screenStreamRef.current = null;
        setCastSession({ isConnected: false, deviceName: null, mode: null });
      });

      return stream;
    } catch (e) {
      console.error('startScreenShare failed:', e);
      return null;
    }
  }, []);

  const stopCasting = useCallback(() => {
    if (castWindowRef.current && !castWindowRef.current.closed) {
      castWindowRef.current.close();
    }
    castWindowRef.current = null;

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    screenStreamRef.current = null;

    setCastSession({ isConnected: false, deviceName: null, mode: null });
  }, []);

  return {
    castSession,
    isScreenShareAvailable,
    openCastWindow,
    startScreenShare,
    stopCasting,
  };
}
