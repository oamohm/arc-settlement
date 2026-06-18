'use client';
import { useState } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract } from 'wagmi';
import { abi } from '../../utils/abi'; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  const settle = () => {
    // यहाँ हम अमाउंट को पक्का BigInt में बदल रहे हैं, ताकि '0' वाली समस्या न आए
    const val = BigInt(Math.floor(Number(amount) * 10**6));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, val],
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div>
          <p>Account: {address}</p>
          <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          <input placeholder="To" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={settle}>Settle</button>
        </div>
      )}
    </div>
  );
}
