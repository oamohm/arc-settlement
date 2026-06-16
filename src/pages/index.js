import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton />
      
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <input 
            type="number" 
            placeholder="USDC राशि लिखें" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '10px', marginRight: '10px' }}
          />
          <button onClick={() => alert(`ट्रांजैक्शन शुरू: ${amount} USDC`)}>
            सेंड सेटलमेंट
          </button>
        </div>
      )}
    </div>
  );
}
