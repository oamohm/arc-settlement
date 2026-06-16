import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, encodeFunctionData, parseAbi } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const USDC_CONTRACT = '0x3600000000000000000000000000000000000000';
const ARC_SCAN_URL = "https://testnet.arcscan.app"; 

// ERC-20 Transfer ABI
const erc20Abi = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)'
]);

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
      const amountInUnits = parseUnits(amount, 6);
      
      // यहाँ हम सीधे कॉन्ट्रैक्ट कॉल कर रहे हैं
      sendTransaction({ 
        to: USDC_CONTRACT,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [to, amountInUnits]
        })
      });
    } catch (err) {
      console.error("Execution Error:", err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'monospace', maxWidth: '400px', margin: '0 auto', border: '1px solid #333' }}>
      <h1>ARC SETTLEMENT ENGINE</h1>
      <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p>balance: {balance?.formatted} usdc</p>
          <input placeholder="receiver address" onChange={(e) => setTo(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '8px' }} />
          <input placeholder="amount (usdc)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '8px' }} />
          
          <button onClick={handleSend} disabled={isTxPending || isConfirming} style={{ padding: '10px 20px', cursor: 'pointer', background: '#000', color: '#fff' }}>
            {isTxPending ? 'confirming...' : isConfirming ? 'settling...' : 'send usdc'}
          </button>

          {hash && (
            <div style={{ marginTop: '20px' }}>
              <a href={`${ARC_SCAN_URL}/tx/${hash}`} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
                {isConfirmed ? '✅ settled on chain' : '⏳ transaction pending...'}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
