import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // ट्रांजैक्शन सक्सेस होने पर बैलेंस रिफ्रेश करना
  if (isConfirmed) {
    refetchBalance();
  }

  const handleSend = () => {
    if (!to || !amount) return;
    sendTransaction({ to, value: parseEther(amount) });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: 'auto' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton accountStatus="none" chainStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '15px', paddingBottom: '10px' }}>
            <strong>Account:</strong> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            <br />
            <strong>Balance:</strong> {balance ? Number(balance.value) / 10**18 : '0'} USDC
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              placeholder="Receiver Address" 
              onChange={(e) => setTo(e.target.value)} 
              disabled={isTxPending || isConfirming} 
              style={{ padding: '10px' }}
            />
            <input 
              placeholder="Amount (USDC)" 
              onChange={(e) => setAmount(e.target.value)} 
              disabled={isTxPending || isConfirming} 
              style={{ padding: '10px' }}
            />
            
            <button 
              onClick={handleSend} 
              disabled={isTxPending || isConfirming || !to || !amount}
              style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {isTxPending ? 'Confirm in Wallet...' : isConfirming ? 'Processing Settlement...' : 'Send USDC'}
            </button>
          </div>

          {hash && (
            <div style={{ marginTop: '20px', padding: '10px', background: '#f4f4f4' }}>
              <p>TX Status: <a href={`https://testnet.arcscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                {isConfirmed ? 'Confirmed & Settled' : 'Pending...'}
              </a></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
