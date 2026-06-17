'use client';
import { useState } from 'react';
import { useWriteContract, useAccount, useBalance, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../utils/abi';

export default function ArcSettlement() {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleSettlement = () => {
    if (!to || !amount) return;
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi: abi,
      functionName: 'settle',
      args: [to, BigInt(amount)],
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? <p>wallet disconnected</p> : (
        <div>
          <p>address: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <p>balance: {balance?.formatted} {balance?.symbol}</p>
          <input placeholder="receiver address" onChange={(e) => setTo(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
          <input placeholder="amount (wei)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
          <button onClick={handleSettlement} disabled={isPending}>
            {isPending ? 'confirming...' : 'execute transaction'}
          </button>
          
          {hash && <div>tx hash: {hash.slice(0, 10)}...</div>}
          {isConfirming && <div>waiting for confirmation...</div>}
          {isConfirmed && <div style={{ color: 'green' }}>transaction successful</div>}
        </div>
      )}
    </div>
  );
}
