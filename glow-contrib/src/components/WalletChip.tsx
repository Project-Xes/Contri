import { Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

export const WalletChip = () => {
  const { isConnected, shortAddress, connect, disconnect, isConnecting } = useWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to your wallet',
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  if (isConnected) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDisconnect}
        className="gap-2 font-mono"
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">{shortAddress}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="gradient"
      size="sm"
      onClick={handleConnect}
      disabled={isConnecting}
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      <span className="hidden sm:inline">
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </Button>
  );
};
