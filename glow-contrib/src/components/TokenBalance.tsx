import { Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useBalances } from '@/hooks/useBalances';
import { useWallet } from '@/hooks/useWallet';

interface TokenBalanceProps {
  className?: string;
}

export const TokenBalance = ({ className }: TokenBalanceProps) => {
  const { ethBalance, tokenBalance, isLoading } = useBalances();
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <Card className={`glass ${className}`}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Connect wallet to view balances</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ETH Balance</p>
                <p className="text-xl font-bold">
                  {isLoading ? '...' : `${ethBalance} ETH`}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CTRI Balance</p>
                <p className="text-xl font-bold">
                  {isLoading ? '...' : `${tokenBalance} CTRI`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
