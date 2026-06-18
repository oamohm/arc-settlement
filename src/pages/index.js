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
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const execute = () => {
    if (!to || !amount) return;
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, BigInt(amount)],
    });
  };

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <section>
          <div style={{ marginBottom: '20px', padding: '10px', background: '#eee' }}>
            <p>Account: {address?.slice(0, 8)}...</p>
            <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          </div>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input placeholder="Amount (WEI)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <button onClick={execute} disabled={isPending} style={{ width: '100%', padding: '10px' }}>
            {isPending ? 'Executing...' : 'Settle'}
          </button>
          {hash && <p>TX Hash: {hash.slice(0, 10)}...</p>}
          {isConfirming && <p>Confirming transaction...</p>}
          {isConfirmed && <p style={{ color: 'green' }}>Transaction Success!</p>}
        </section>
      )}
    </main>
  );
}
