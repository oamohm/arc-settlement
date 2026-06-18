'use client';
import { useState } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../utils/abi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const executeSettle = () => {
    if (!to || !amount) return;
    const formattedAmount = BigInt(Math.floor(Number(amount) * 10**6));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, formattedAmount],
    });
  };

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })} style={{ width: '100%', padding: '15px' }}>Connect Passport</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ padding: '10px', border: '1px solid #ccc' }}>
            <p>Account: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          </div>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ padding: '10px' }} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ padding: '10px' }} />
          <button onClick={executeSettle} disabled={isPending} style={{ padding: '15px', background: isPending ? '#ccc' : '#000', color: '#fff' }}>
            {isPending ? 'Processing...' : 'Settle'}
          </button>
          {isConfirmed && <p style={{ color: 'green' }}>Transaction Successful!</p>}
        </div>
      )}
    </main>
  );
}
