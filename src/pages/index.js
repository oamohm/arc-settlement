import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Config
const USDC_CONTRACT = '0x3600000000000000000000000000000000000000';
const ARC_SCAN_URL = "https://testnet.arcscan.app"; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({ address, token: USDC_CONTRACT });
  
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // ट्रांजैक्शन पूरा होते ही स्टेट रिफ्रेश
  if (isConfirmed) refetchBalance();

  const handleSend = async () => {
    if (!to || !amount) return;
    try {
      // 6 decimals के लिए parseUnits
      sendTransaction({ to, value: parseUnits(amount, 6) });
    } catch (err) {
      console.error("Execution Error:", err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'monospace', maxWidth: '400px', margin: '0 auto', border: '1px solid #333' }}>
      <h1 style={{ fontSize: '18px', marginBottom: '20px' }}>ARC SETTLEMENT ENGINE</h1>
      
      <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '15px', background: '#000', color: '#fff', borderRadius: '4px' }}>
            <p>balance: {balance?.formatted} usdc</p>
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              placeholder="receiver address" 
              onChange={(e) => setTo(e.target.value)} 
              disabled={isTxPending || isConfirming}
              style={{ padding: '12px', border: '1px solid #ddd' }}
            />
            <input 
              placeholder="amount (usdc)" 
              type="number"
              onChange={(e) => setAmount(e.target.value)} 
              disabled={isTxPending || isConfirming} 
              style={{ padding: '12px', border: '1px solid #ddd' }}
            />
            
            <button 
              onClick={handleSend} 
              disabled={isTxPending || isConfirming || !to || !amount}
              style={{ padding: '15px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isTxPending ? 'confirming...' : isConfirming ? 'settling...' : 'send transaction'}
            </button>
          </div>

          {hash && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px dashed #333' }}>
              <p>tx hash: {hash.slice(0, 10)}...</p>
              <a href={`${ARC_SCAN_URL}/tx/${hash}`} target="_blank" rel="noreferrer" style={{ color: '#0070f3' }}>
                {isConfirmed ? 'view on explorer' : 'waiting for network...'}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
