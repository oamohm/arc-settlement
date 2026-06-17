import { useState } from 'react';
import { useWriteContract, useAccount, useConnect } from 'wagmi';

export default function ArcSettlement() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Arc Settlement Engine</h1>
      
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div>
          <p>Wallet Connected</p>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
          <input placeholder="Amount (USDC)" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
          <button onClick={() => writeContract({ 
            address: '0x...', // यहाँ कॉन्ट्रैक्ट एड्रेस आएगा
            abi: [], 
            functionName: 'settle', 
            args: [to, amount] 
          })}>
            Confirm Transaction
          </button>
        </div>
      )}
    </div>
  );
}
