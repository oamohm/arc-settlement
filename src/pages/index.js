import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  // 1. ट्रांजैक्शन भेजने का हुक
  const { data: hash, sendTransaction, isPending: isTxPending } = useSendTransaction();
  
  // 2. ट्रांजैक्शन कन्फर्मेशन का हुक
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleSend = () => {
    if (!to || !amount) return;
    try {
      sendTransaction({ to, value: parseEther(amount) });
    } catch (err) {
      console.error("ट्रांजैक्शन फेल:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton accountStatus="none" chainStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <h3>Account: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</h3>
          <p>Balance: {balance ? Number(balance.value) / 10**18 : '0'} USDC</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} disabled={isTxPending || isConfirming} />
            <input placeholder="Amount (USDC)" onChange={(e) => setAmount(e.target.value)} disabled={isTxPending || isConfirming} />
            
            <button 
              onClick={handleSend} 
              disabled={isTxPending || isConfirming || !to || !amount}
            >
              {isTxPending ? 'Confirm in Wallet...' : isConfirming ? 'Waiting for block...' : 'Send USDC'}
            </button>
          </div>

          {hash && (
            <p>
              TX Status: <a href={`https://testnet.arcscan.io/tx/${hash}`} target="_blank" style={{ color: 'blue' }}>
                {isConfirmed ? 'Confirmed & Settled' : 'Pending...'}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
