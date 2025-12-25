import { useState, useCallback, useEffect } from 'react';

interface CastSession {
  isConnected: boolean;
  deviceName: string | null;
}

declare global {
  interface Navigator {
    presentation?: {
      defaultRequest: PresentationRequest | null;
      receiver: unknown;
    };
  }

  class PresentationRequest {
    constructor(urls: string[]);
    start(): Promise<PresentationConnection>;
    reconnect(presentationId: string): Promise<PresentationConnection>;
    getAvailability(): Promise<PresentationAvailability>;
  }

  interface PresentationConnection {
    id: string;
    url: string;
    state: 'connecting' | 'connected' | 'closed' | 'terminated';
    onconnect: (() => void) | null;
    onclose: (() => void) | null;
    onterminate: (() => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    close(): void;
    terminate(): void;
    send(message: string | Blob | ArrayBuffer | ArrayBufferView): void;
  }

  interface PresentationAvailability {
    value: boolean;
    onchange: (() => void) | null;
  }
}

export function useCast() {
  const [castSession, setCastSession] = useState<CastSession>({
    isConnected: false,
    deviceName: null,
  });
  const [isCastAvailable, setIsCastAvailable] = useState(false);

  useEffect(() => {
    // Check if the browser supports the Presentation API
    if ('presentation' in navigator) {
      setIsCastAvailable(true);
    }
  }, []);

  const startCasting = useCallback(async () => {
    if (!('presentation' in navigator)) {
      console.warn('Presentation API not supported');
      return false;
    }

    try {
      const presentationRequest = new PresentationRequest([window.location.href]);
      
      const connection = await presentationRequest.start();
      
      setCastSession({
        isConnected: true,
        deviceName: 'External Display',
      });

      connection.onclose = () => {
        setCastSession({
          isConnected: false,
          deviceName: null,
        });
      };

      connection.onterminate = () => {
        setCastSession({
          isConnected: false,
          deviceName: null,
        });
      };

      return true;
    } catch (error) {
      console.error('Failed to start casting:', error);
      return false;
    }
  }, []);

  const stopCasting = useCallback(() => {
    setCastSession({
      isConnected: false,
      deviceName: null,
    });
  }, []);

  return {
    castSession,
    isCastAvailable,
    startCasting,
    stopCasting,
  };
}
