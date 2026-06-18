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

  const handleSettle = () => {
    // यहाँ 10**6 का फिक्स है ताकि USDC ट्रांसफर सही हो
    const bigIntAmount = BigInt(Math.floor(Number(amount) * 10**6));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, bigIntAmount],
    });
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: 'auto' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div>
          <div style={{ background: '#eee', padding: '10px', marginBottom: '10px' }}>
            <p>Account: {address}</p>
            <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          </div>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ display: 'block', marginBottom: '10px', width: '100%' }} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', marginBottom: '10px', width: '100%' }} />
          <button onClick={handleSettle} disabled={isPending}>
            {isPending ? 'Processing...' : 'Settle'}
          </button>
          {isConfirmed && <p style={{ color: 'green' }}>Transaction Successful!</p>}
        </div>
      )}
    </main>
  );
}
