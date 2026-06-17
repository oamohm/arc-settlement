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
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, BigInt(amount || 0)],
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>arc settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>connect wallet</button>
      ) : (
        <div>
          <p>account: {address}</p>
          <p>balance: {balance?.formatted} {balance?.symbol}</p>
          <input placeholder="to" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="amount" type="number" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={execute} disabled={isPending}>{isPending ? 'pending' : 'settle'}</button>
          {isConfirming && <p>confirming...</p>}
          {isConfirmed && <p style={{color: 'green'}}>success</p>}
        </div>
      )}
    </div>
  );
}
