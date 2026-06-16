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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Arc Settlement Engine</h1>
      {/* showBalance={false} से बटन वाला बैलेंस गायब हो जाएगा */}
      <ConnectButton showBalance={false} />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <h3>Account: {address}</h3>
          <p>Available Balance: {balance ? Number(balance.value) / 10**18 : '0'} USDC</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
            <input placeholder="Amount (USDC)" onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleSend} disabled={isConfirming}>
              {isConfirming ? 'Processing...' : 'Send USDC'}
            </button>
          </div>

          {hash && <p>TX Hash: {hash}</p>}
          {isConfirmed && <p>Success: Verified on ArcScan</p>}
        </div>
      )}
    </div>
  );
}
