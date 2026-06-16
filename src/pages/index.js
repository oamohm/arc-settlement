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

  const { data: hash, sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // ट्रांजैक्शन सक्सेस होने पर बैलेंस रिफ्रेश और क्लियरिंग
  if (isConfirmed) {
    refetchBalance();
  }

  const handleSend = async () => {
    if (!to || !amount) return;
    try {
      sendTransaction({ 
        to, 
        value: parseUnits(amount, 6) 
      });
    } catch (err) {
      console.error("Execution Error:", err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', margin: '0' }}>Arc Settlement Engine</h1>
      </header>
      
      <ConnectButton accountStatus="none" chainStatus="none" showBalance={false} />
      
      {isConnected && (
        <section style={{ marginTop: '24px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f4f4f4', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px' }}>Account: {address?.slice(0, 6)}...{address?.slice(-4)}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Balance: {balance?.formatted} USDC</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              placeholder="Receiver Address" 
              onChange={(e) => setTo(e.target.value)} 
              disabled={isTxPending || isConfirming}
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input 
              placeholder="Amount (USDC)" 
              onChange={(e) => setAmount(e.target.value)} 
              disabled={isTxPending || isConfirming} 
              style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            
            <button 
              onClick={handleSend} 
              disabled={isTxPending || isConfirming || !to || !amount}
              style={{ padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isTxPending ? 'Confirming...' : isConfirming ? 'Settling...' : 'Send USDC'}
            </button>
          </div>

          {hash && (
            <div style={{ marginTop: '20px', padding: '12px', border: '1px solid #000' }}>
              <a href={`${ARC_SCAN_URL}/tx/${hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>
                {isConfirmed ? 'Success. View on ArcScan' : 'Confirming on Chain...'}
              </a>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
