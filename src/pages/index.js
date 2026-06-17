import { useState } from 'react';
import { useWriteContract, useAccount, useConnect, useConfig } from 'wagmi';
import { abi } from '../utils/abi'; 

export default function ArcSettlement() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  
  const { writeContract, isPending, isError, error } = useWriteContract();

  const handleSettlement = () => {
    if (!to || !amount) return;
    writeContract({
      address: 'YOUR_CONTRACT_ADDRESS', // यहाँ डिप्लॉयमेंट के बाद एड्रेस डालें
      abi: abi,
      functionName: 'settle',
      args: [to, BigInt(amount * 10**6)], // USDC के लिए 6 डेसिमल
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement</h1>
      
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p>Connected: {address?.substring(0,6)}...</p>
          <input placeholder="Recipient Address" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} />
          
          <button onClick={handleSettlement} disabled={isPending}>
            {isPending ? 'Processing...' : 'Confirm Transaction'}
          </button>
          
          {isError && <p style={{ color: 'red' }}>Error: {error?.message.slice(0, 50)}</p>}
        </div>
      )}
    </div>
  );
}
