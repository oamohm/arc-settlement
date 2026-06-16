import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';

const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const abi = ['function balanceOf(address) view returns (uint256)'];

export default function Home() {
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState('');

  const { data: balance } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi,
    functionName: 'balanceOf',
    args: [address],
  });

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton />
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p>आपका Arc USDC बैलेंस: {balance ? balance.toString() : '0'}</p>
          <input 
            type="number" 
            placeholder="राशि लिखें" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '10px', marginRight: '10px' }}
          />
          <button onClick={() => alert(`ट्रांजैक्शन: ${amount} USDC`)}>
            सेंड सेटलमेंट
          </button>
        </div>
      )}
    </div>
  );
}
