import { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    provider: null,
    signer: null,
  });

  // Check if wallet is already connected on mount and bind listeners
  useEffect(() => {
    let removed = false;

    const checkConnection = async () => {
      if (typeof window.ethereum === 'undefined') return;
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          if (removed) return;
          setWalletState({
            address,
            isConnected: true,
            isConnecting: false,
            provider,
            signer,
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();

    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        checkConnection();
      }
    };
    const onChainChanged = () => {
      // Refresh signer/address on chain changes to keep state consistent
      checkConnection();
    };

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', onAccountsChanged);
      window.ethereum.on('chainChanged', onChainChanged);
    }

    return () => {
      removed = true;
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', onAccountsChanged);
        window.ethereum.removeListener('chainChanged', onChainChanged);
      }
    };
  }, []);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }

    // Prevent duplicate concurrent prompts
    if (walletState.isConnecting) return;
    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      // If already authorized, no popup; otherwise prompt
      let accounts: string[] = await provider.send('eth_accounts', []);
      if (!accounts || accounts.length === 0) {
        accounts = await provider.send('eth_requestAccounts', []);
      }

      // Ensure correct local chain (Ganache by default)
      const desiredChainId = (import.meta as any).env?.VITE_CHAIN_ID || '0x539'; // 1337
      const currentChainId: string = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChainId?.toLowerCase() !== String(desiredChainId).toLowerCase()) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainId }],
          });
        } catch (switchErr: any) {
          // If not added, add local chain then switch
          if (switchErr?.code === 4902) {
            const rpcUrl = (import.meta as any).env?.VITE_RPC_URL || 'http://127.0.0.1:7545';
            const chainName = (import.meta as any).env?.VITE_CHAIN_NAME || 'Localhost 8545/7545';
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: desiredChainId,
                chainName,
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: [rpcUrl],
              }],
            });
          } else {
            throw switchErr;
          }
        }
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletState({
        address,
        isConnected: true,
        isConnecting: false,
        provider,
        signer,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({ ...prev, isConnecting: false }));
      // Surface user-rejected request clearly
      // MetaMask rejects with code 4001
      if ((error as any)?.code === 4001) {
        throw new Error('Connection request rejected in MetaMask');
      }
      throw error instanceof Error ? error : new Error('Failed to connect wallet');
    }
  };

  const disconnect = () => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      provider: null,
      signer: null,
    });
  };

  return {
    ...walletState,
    connect,
    disconnect,
    shortAddress: walletState.address
      ? `${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}`
      : null,
  };
};

// Extend window type for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}
