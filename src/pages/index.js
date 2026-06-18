'use client';
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../utils/abi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({ hash });

  // ट्रांजैक्शन लॉजिक जो जीरो अमाउंट को रोकता है
  const executeSettle = () => {
    if (!to || !amount) return;
    const formattedAmount = BigInt(Math.floor(Number(amount) * 1000000));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, formattedAmount],
    });
  };

  return (
    <main style={{ padding: '24px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })} style={{ padding: '12px', width: '100%' }}>Connect Wallet</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
            <p><strong>Account:</strong> {address?.slice(0, 8)}...{address?.slice(-6)}</p>
            <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
          </div>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ padding: '10px' }} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ padding: '10px' }} />
          <button onClick={executeSettle} disabled={isPending} style={{ padding: '12px', background: '#000', color: '#fff', border: 'none' }}>
            {isPending ? 'Processing...' : 'Settle'}
          </button>
          {isConfirmed && <p style={{ color: 'green' }}>Transaction Confirmed</p>}
          {isError && <p style={{ color: 'red' }}>Transaction Failed</p>}
        </div>
      )}
    </main>
  );
}
