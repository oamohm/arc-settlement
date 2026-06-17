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
        alert('कृपया सभी जानकारी भरें');
        return;
      }
      writeContract({
        address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
        abi: abi,
        functionName: 'settle',
        args: [to, BigInt(amount)],
      });
    } catch (err) {
      console.error('ट्रांजैक्शन में एरर:', err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div>
          <p>वॉलेट एड्रेस: {address}</p>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount (WEI)" type="number" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={handleSettlement}>Execute Transaction</button>
        </div>
      )}
    </div>
  );
}
