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
    // Cast the CURRENT page in a new window by adding cast=1 to the URL.
    const url = new URL(window.location.origin + location.pathname);
    const params = new URLSearchParams(location.search);
    params.set('cast', '1');
    url.search = params.toString();

    const res = await openCastWindow(url.toString());

    if (res.ok) {
      toast.success('Cast window opened');
      return;
    }

    if ('reason' in res && res.reason === 'popup_blocked') {
      toast.error('Popup blocked. Opening cast view in this tab…');
      window.location.assign(url.toString());
      return;
    }

    toast.error('Could not start casting. Please try again.');
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
          Cast This Page
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
