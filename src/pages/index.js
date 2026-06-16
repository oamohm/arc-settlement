import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const USDC_CONTRACT = '0x3600000000000000000000000000000000000000';
const ARC_SCAN = "https://testnet.arcscan.io";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({ address, token: USDC_CONTRACT });
  
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  // ट्रांजैक्शन हुक्स
  const { data: hash, sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleSend = async () => {
    if (!to || !amount) return;
    try {
      // यहाँ हम सीधे ट्रांजैक्शन ट्रिगर कर रहे हैं
      sendTransaction({ to, value: parseUnits(amount, 6) });
    } catch (err) {
      console.error("Tx Error:", err);
    }
  };

  // जब कन्फर्म हो जाए, तब बैलेंस अपडेट करें
  if (isConfirmed) refetchBalance();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton accountStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Balance:</strong> {balance ? balance.formatted : '0'} USDC</p>
          
          <input placeholder="Receiver" onChange={(e) => setTo(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
          <input placeholder="Amount (USDC)" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
          
          <button 
            onClick={handleSend} 
            disabled={isTxPending || isConfirming}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            {isTxPending ? 'Confirm in Wallet...' : isConfirming ? 'Processing on Blockchain...' : 'Send USDC'}
          </button>

          {/* केवल तब दिखाएं जब ट्रांजैक्शन पेंडिंग हो या हो गया हो */}
          {hash && (
            <p style={{ marginTop: '20px' }}>
              TX: <a href={`${ARC_SCAN}/tx/${hash}`} target="_blank" rel="noreferrer">
                {isConfirmed ? 'Transaction Settled!' : 'Waiting for Blockchain Confirmation...'}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
