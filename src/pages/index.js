import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';
const abi = ['function balanceOf(address owner) view returns (uint256)'];

export default function Home() {
  const { isConnected, address, chain } = useAccount();
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  // बैलेंस रीड करने का हुक
  const { data: balance, refetch } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi,
    functionName: 'balanceOf',
    args: [address],
  });

  // ऑटो-रिफ्रेश बैलेंस
  useEffect(() => {
    if (isConnected) refetch();
  }, [isConnected, refetch]);

  const handleSend = () => {
    if (!amount) return;
    alert(`ट्रांजैक्शन इनिशिएट: ${amount} USDC आर्क नेटवर्क पर`);
    // यहाँ बाद में असली कॉन्ट्रैक्ट कॉल जुड़ेगा
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton />
      
      {isConnected && (
        <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px' }}>
          <p>नेटवर्क: {chain?.name || 'Loading...'}</p>
          <p style={{ fontWeight: 'bold' }}>
            उपलब्ध USDC: {balance ? (Number(balance) / 10**6).toString() : '0'}
          </p>
          
          <div style={{ marginTop: '20px' }}>
            <input 
              type="number" 
              placeholder="राशि डालें" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ padding: '10px', width: '200px' }}
            />
            <button 
              onClick={handleSend}
              style={{ marginLeft: '10px', padding: '10px 20px', cursor: 'pointer' }}
            >
              सेंड सेटलमेंट
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
