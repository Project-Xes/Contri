import { useState } from 'react';
import { useWallet } from './useWallet';

interface MockTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
}

export const useContracts = () => {
  const { address, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const getContriTokenContract = () => {
    return {
      totalSupply: async (): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return '1000000';
      },
      balanceOf: async (address: string): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return (Math.random() * 10000).toFixed(2);
      },
    };
  };

  const getContributionControllerContract = () => {
    return {
      submitContribution: async (
        title: string,
        description: string,
        ipfsCID: string
      ): Promise<MockTransaction> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockTx: MockTransaction = {
          hash: '0x' + Math.random().toString(16).slice(2),
          from: address || '0x0000000000000000000000000000000000000000',
          to: '0xContributionController000000000000000000',
          value: '0',
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: Date.now(),
        };

        setIsLoading(false);
        return mockTx;
      },
      claimReward: async (contributionId: string): Promise<MockTransaction> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockTx: MockTransaction = {
          hash: '0x' + Math.random().toString(16).slice(2),
          from: address || '0x0000000000000000000000000000000000000000',
          to: '0xContributionController000000000000000000',
          value: (Math.random() * 100).toFixed(2),
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: Date.now(),
        };

        setIsLoading(false);
        return mockTx;
      },
      getContribution: async (contributionId: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          id: contributionId,
          title: 'Sample Contribution',
          contributor: address,
          ipfsCID: 'QmExample123456789',
          citations: Math.floor(Math.random() * 20),
          rewardAmount: (Math.random() * 100).toFixed(2),
          claimed: Math.random() > 0.5,
        };
      },
    };
  };

  return {
    getContriTokenContract,
    getContributionControllerContract,
    isLoading,
    isConnected,
  };
};
