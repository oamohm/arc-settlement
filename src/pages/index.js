import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleSend = () => {
    if (!to || !amount) return;
    sendTransaction({ to, value: parseEther(amount) });
  };

  // एड्रेस को छोटा करने का फंक्शन
  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <h3>Account: {truncatedAddress}</h3>
          <p>Available Balance: {balance ? Number(balance.value) / 10**18 : '0'} USDC</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <input 
              placeholder="Receiver Address" 
              onChange={(e) => setTo(e.target.value)} 
              style={{ padding: '8px' }}
            />
            <input 
              placeholder="Amount (USDC)" 
              onChange={(e) => setAmount(e.target.value)} 
              style={{ padding: '8px' }}
            />
            <button 
              onClick={handleSend} 
              disabled={isConfirming}
              style={{ padding: '10px', cursor: 'pointer' }}
            >
              {isConfirming ? 'Processing...' : 'Send USDC'}
            </button>
          </div>

          {hash && (
            <p>
              TX Hash: <a 
                href={`https://testnet.arcscan.io/tx/${hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'blue' }}
              >
                {hash.slice(0, 10)}... (View on ArcScan)
              </a>
            </p>
          )}
          {isConfirmed && <p style={{ color: 'green', fontWeight: 'bold' }}>Transaction Confirmed & Settled!</p>}
        </div>
      )}
    </div>
  );
}
