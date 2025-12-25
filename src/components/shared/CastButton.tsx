import { Cast, MonitorSmartphone, ScreenShare, Tv, ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCast } from '@/hooks/useCast';
import { toast } from 'sonner';
import { useState } from 'react';

export function CastButton() {
  const location = useLocation();
  const { castSession, openCastWindow, startScreenShare, stopCasting, isScreenShareAvailable } = useCast();
  const [helpOpen, setHelpOpen] = useState(false);

  const openCastView = async () => {
    // Open current page in fullscreen popup for external display
    const url = new URL(window.location.origin + location.pathname);
    const params = new URLSearchParams(location.search);
    params.set('cast', '1');
    url.search = params.toString();

    const res = await openCastWindow(url.toString());

    if (res.ok) {
      toast.success('Cast window opened - drag it to your TV/external display');
      return;
    }

    if ('reason' in res && res.reason === 'popup_blocked') {
      toast.error('Popup blocked. Opening in this tab…');
      window.location.assign(url.toString());
      return;
    }

    toast.error('Could not open cast window. Please try again.');
  };

  const shareScreen = async () => {
    const stream = await startScreenShare();
    if (stream) {
      toast.success('Screen sharing started');
    } else {
      toast.error('Screen sharing was cancelled or blocked');
    }
  };

  const triggerBrowserCast = () => {
    // Chrome/Edge: Programmatically trigger cast is NOT possible via JS.
    // We guide the user instead.
    setHelpOpen(true);
  };

  return (
    <>
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

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem onClick={triggerBrowserCast} className="cursor-pointer">
            <Tv className="mr-2 h-4 w-4" />
            Cast to Chromecast / TV
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openCastView} className="cursor-pointer">
            <MonitorSmartphone className="mr-2 h-4 w-4" />
            Open Fullscreen Window
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={shareScreen}
            disabled={!isScreenShareAvailable}
            className="cursor-pointer"
          >
            <ScreenShare className="mr-2 h-4 w-4" />
            Share Screen
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

      {/* Help Dialog for Chromecast */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tv className="h-5 w-5" />
              Cast to Chromecast / Android TV
            </DialogTitle>
            <DialogDescription>
              Follow these steps to cast this app to your TV:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </div>
                <p className="text-sm text-foreground">
                  Click the <strong>three-dot menu (⋮)</strong> in your browser's top-right corner
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </div>
                <p className="text-sm text-foreground">
                  Select <strong>"Cast…"</strong> or <strong>"Cast, save, and share"</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </div>
                <p className="text-sm text-foreground">
                  Choose your <strong>Chromecast / Android TV</strong> from the list
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  4
                </div>
                <p className="text-sm text-foreground">
                  Select <strong>"Cast tab"</strong> to show this page on your TV
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Keyboard shortcut:</strong> Press{' '}
                <kbd className="rounded bg-background px-1.5 py-0.5 text-xs font-mono border">Ctrl</kbd>{' '}
                +{' '}
                <kbd className="rounded bg-background px-1.5 py-0.5 text-xs font-mono border">Shift</kbd>{' '}
                +{' '}
                <kbd className="rounded bg-background px-1.5 py-0.5 text-xs font-mono border">U</kbd>{' '}
                (Chrome) to open Cast quickly.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setHelpOpen(false)}>
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
