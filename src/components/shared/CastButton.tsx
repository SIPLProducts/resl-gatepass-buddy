import { Cast, MonitorSmartphone, ScreenShare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCast } from '@/hooks/useCast';
import { toast } from 'sonner';

export function CastButton() {
  const location = useLocation();
  const { castSession, openCastWindow, startScreenShare, stopCasting, isScreenShareAvailable } = useCast();

  const openCastView = async () => {
    const path = `${location.pathname}${location.search || ''}`;
    const url = `${window.location.origin}/cast?path=${encodeURIComponent(path)}`;

    const ok = await openCastWindow(url);
    if (ok) toast.success('Cast view opened in a new window');
    else toast.error('Could not open cast window. Please allow popups for this site.');
  };

  const shareScreen = async () => {
    const stream = await startScreenShare();
    if (stream) toast.success('Screen sharing started');
    else toast.error('Screen sharing failed or was blocked');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 ${castSession.isConnected ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
          aria-label="Cast options"
        >
          {castSession.isConnected ? (
            <MonitorSmartphone className="h-4 w-4" />
          ) : (
            <Cast className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={openCastView} className="cursor-pointer">
          <MonitorSmartphone className="mr-2 h-4 w-4" />
          Open Cast Display View
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={shareScreen}
          disabled={!isScreenShareAvailable}
          className="cursor-pointer"
        >
          <ScreenShare className="mr-2 h-4 w-4" />
          Share Screen (API)
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            stopCasting();
            toast.success('Casting stopped');
          }}
          disabled={!castSession.isConnected}
          className="cursor-pointer"
        >
          Stop Casting
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
