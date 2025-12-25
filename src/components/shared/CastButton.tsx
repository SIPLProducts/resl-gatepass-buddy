import { Cast, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCast } from '@/hooks/useCast';
import { toast } from 'sonner';

export function CastButton() {
  const { castSession, isCastAvailable, startCasting, stopCasting } = useCast();

  const handleCastClick = async () => {
    if (castSession.isConnected) {
      stopCasting();
      toast.success('Disconnected from display');
    } else {
      const success = await startCasting();
      if (success) {
        toast.success('Connected to external display');
      } else {
        toast.error('Could not connect to display. Please ensure a compatible device is available.');
      }
    }
  };

  if (!isCastAvailable) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCastClick}
          className={`h-9 w-9 ${castSession.isConnected ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {castSession.isConnected ? (
            <MonitorSmartphone className="h-4 w-4" />
          ) : (
            <Cast className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {castSession.isConnected
          ? `Connected to ${castSession.deviceName || 'display'}`
          : 'Cast to external display'}
      </TooltipContent>
    </Tooltip>
  );
}
