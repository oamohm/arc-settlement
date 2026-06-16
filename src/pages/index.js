// src/pages/index.js (Final Configured Version)

import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem'; // 6 decimals के लिए parseEther की जगह parseUnits का उपयोग करें
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Arc Testnet Config
const ARC_TESTNET_SCAN = "https://testnet.arcscan.io"; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({ 
    address, 
    token: '0x3600000000000000000000000000000000000000' // USDC Contract
  });
  
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  if (isConfirmed) refetchBalance();

  const handleSend = () => {
    if (!to || !amount) return;
    // 6 decimals के साथ ट्रांजैक्शन
    sendTransaction({ to, value: parseUnits(amount, 6) });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton accountStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p>Account: {address?.slice(0,6)}...{address?.slice(-4)}</p>
          <p>Balance: {balance ? balance.formatted : '0'} USDC</p>
          
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount (USDC)" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={handleSend} disabled={isTxPending}>
            {isTxPending ? 'Sending...' : 'Send USDC'}
          </button>

          {hash && (
            <p>
              Status: <a href={`${ARC_TESTNET_SCAN}/tx/${hash}`} target="_blank">
                {isConfirmed ? 'Confirmed' : 'Pending...'}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
