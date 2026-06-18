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
    writeContract({ address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174', abi, functionName: 'settle', args: [to, BigInt(amount)] });
  };

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>arc settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>connect wallet</button>
      ) : (
        <section>
          <p>account: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <p>balance: {balance?.formatted} {balance?.symbol}</p>
          <input placeholder="receiver address" onChange={(e) => setTo(e.target.value)} style={{ width: '100%', margin: '10px 0' }} />
          <input placeholder="amount (wei)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', margin: '10px 0' }} />
          <button onClick={execute} disabled={isPending}>{isPending ? 'executing...' : 'settle'}</button>
          {hash && <p>tx: {hash.slice(0, 10)}...</p>}
          {isConfirming && <p>confirming...</p>}
          {isConfirmed && <p style={{ color: 'green' }}>success</p>}
        </section>
      )}
    </main>
  );
}
