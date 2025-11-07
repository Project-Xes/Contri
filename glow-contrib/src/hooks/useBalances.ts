import { useState, useEffect } from 'react';
import { formatEther } from 'ethers';
import { useWallet } from './useWallet';

export const useBalances = () => {
  const { address, provider, isConnected } = useWallet();
  const [ethBalance, setEthBalance] = useState<string>('0.0');
  const [tokenBalance, setTokenBalance] = useState<string>('0.0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setEthBalance('0.0');
      setTokenBalance('0.0');
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        if (provider) {
          // Get ETH balance
          const balance = await provider.getBalance(address);
          setEthBalance(parseFloat(formatEther(balance)).toFixed(4));
        } else {
          // Mock balances for demo
          setEthBalance('1.2345');
        }

        // Mock token balance
        const mockTokenBalance = Math.random() * 10000;
        setTokenBalance(mockTokenBalance.toFixed(2));
      } catch (error) {
        console.error('Error fetching balances:', error);
        // Use mock values on error
        setEthBalance('1.2345');
        setTokenBalance('1200.50');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [address, provider, isConnected]);

  return {
    ethBalance,
    tokenBalance,
    isLoading,
  };
};
