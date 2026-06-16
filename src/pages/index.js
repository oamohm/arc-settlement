import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Arc Testnet कॉन्फ़िगरेशन
const USDC_CONTRACT = '0x3600000000000000000000000000000000000000';
const ARC_SCAN_URL = "https://testnet.arcscan.io";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({ 
    address, 
    token: USDC_CONTRACT 
  });
  
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  // ट्रांजैक्शन हुक्स
  const { data: hash, sendTransaction, isPending: isTxPending, error: txError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // ट्रांजैक्शन सक्सेस होने पर बैलेंस अपडेट करें
  if (isConfirmed) refetchBalance();

  const handleSend = async () => {
    if (!to || !amount) return;
    try {
      // 6 decimals के साथ सुरक्षित ट्रांजैक्शन
      sendTransaction({ 
        to, 
        value: parseUnits(amount, 6) 
      });
    } catch (err) {
      console.error("ट्रांजैक्शन में गड़बड़:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '450px', margin: 'auto' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton accountStatus="none" chainStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '15px', background: '#f0f0f0', borderRadius: '10px' }}>
            <p><strong>Account:</strong> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</p>
            <p><strong>Balance:</strong> {balance ? balance.formatted : '0'} USDC</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <input 
              placeholder="Receiver Address" 
              onChange={(e) => setTo(e.target.value)} 
              disabled={isTxPending || isConfirming}
              style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input 
              placeholder="Amount (USDC)" 
              onChange={(e) => setAmount(e.target.value)} 
              disabled={isTxPending || isConfirming} 
              style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={handleSend} 
              disabled={isTxPending || isConfirming || !to || !amount}
              style={{ padding: '15px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              {isTxPending ? 'Confirm in Wallet...' : isConfirming ? 'Settling on Chain...' : 'Send USDC'}
            </button>
          </div>

          {txError && <p style={{ color: 'red', marginTop: '10px' }}>Error: {txError.message.slice(0, 50)}...</p>}

          {hash && (
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #0070f3', borderRadius: '5px' }}>
              <p>Status: <a href={`${ARC_SCAN_URL}/tx/${hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
                {isConfirmed ? 'Success! View on ArcScan' : 'Confirming on Chain...'}
              </a></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
