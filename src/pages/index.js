import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Config: यहाँ नया एक्सप्लोरर लिंक डालें
const USDC_CONTRACT = '0x3600000000000000000000000000000000000000';
const ARC_SCAN_URL = "https://testnet.arcscan.app"; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({ address, token: USDC_CONTRACT });
  
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  if (isConfirmed) refetchBalance();

  const handleSend = async () => {
    if (!to || !amount) return;
    try {
      // 6 decimals के साथ सुरक्षित ट्रांजैक्शन
      sendTransaction({ to, value: parseUnits(amount, 6) });
    } catch (err) {
      console.error("Execution Error:", err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
            <p><strong>Balance:</strong> {balance?.formatted} USDC</p>
          </div>
          
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ display: 'block', margin: '15px 0', padding: '10px', width: '90%' }} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', margin: '15px 0', padding: '10px', width: '90%' }} />
          
          <button 
            onClick={handleSend} 
            disabled={isTxPending || isConfirming || !to || !amount}
            style={{ padding: '12px 20px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            {isTxPending ? 'Confirming...' : isConfirming ? 'Settling on Chain...' : 'Send USDC'}
          </button>

          {hash && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #0070f3' }}>
              <a href={`${ARC_SCAN_URL}/tx/${hash}`} target="_blank" rel="noreferrer" style={{ color: '#0070f3' }}>
                {isConfirmed ? 'Success! View on ArcScan' : 'Confirming on Chain...'}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
