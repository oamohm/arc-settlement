'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { abi } from '../../utils/abi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  const handleSettle = () => {
    if (!to || !amount) return;
    const value = BigInt(Math.floor(parseFloat(amount) * 1_000_000));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, value],
    });
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Arc Settlement</h1>
      <ConnectButton />
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p>Account: {address}</p>
          <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={handleSettle}>Settle</button>
        </div>
      )}
    </main>
  );
}
