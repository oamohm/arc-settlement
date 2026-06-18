'use client';
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract } from 'wagmi';
import { abi } from '../../utils/abi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance, refetch } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  // वॉलेट कनेक्ट होने पर बैलेंस को फोर्स रिफ्रेश करें
  useEffect(() => {
    if (isConnected) refetch();
  }, [isConnected, refetch]);

  const handleSettle = () => {
    if (!to || !amount) return;
    const value = BigInt(Math.floor(Number(amount) * 1000000));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, value],
    });
  };

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#f4f4f4', padding: '10px' }}>
            <p>Account: {address}</p>
            <p>Balance: {balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}</p>
          </div>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={handleSettle}>Settle</button>
        </div>
      )}
    </main>
  );
}
