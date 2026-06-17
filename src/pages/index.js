import { useState } from 'react';
import { useWriteContract, useAccount, useConnect } from 'wagmi';
import { abi } from '../utils/abi'; 

export default function ArcSettlement() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  const handleSettlement = async () => {
    try {
      if (!to || !amount) {
        alert("कृपया सभी फील्ड भरें");
        return;
      }
      writeContract({
        address: 'YOUR_CONTRACT_ADDRESS', // यहाँ एड्रेस डालें
        abi: abi,
        functionName: 'settle',
        args: [to, BigInt(amount * 10**6)],
      });
    } catch (err) {
      console.error("ट्रांजैक्शन में गलती:", err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address?.substring(0,6)}...</p>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
          <br/>
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} />
          <br/>
          <button onClick={handleSettlement}>Confirm Transaction</button>
        </div>
      )}
    </div>
  );
}
