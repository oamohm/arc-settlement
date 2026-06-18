'use client';
import { useState } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return (
    <main style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #333', marginBottom: '20px' }}>
        <h1>arc settlement os</h1>
        <p>status: {isConnected ? 'system active' : 'system offline'}</p>
      </header>

      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })} style={{ width: '100%', padding: '10px' }}>initiate connection</button>
      ) : (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: '#f0f0f0', padding: '15px' }}>
            <p><strong>wallet:</strong> {address}</p>
            <p><strong>balance:</strong> {balance?.formatted} {balance?.symbol}</p>
          </div>
          
          <input placeholder="receiver address" onChange={(e) => setTo(e.target.value)} style={{ padding: '10px' }} />
          <input placeholder="amount (wei)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ padding: '10px' }} />
          
          <button onClick={() => writeContract({
            address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
            abi: [{ "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}], "name": "settle", "type": "function", "stateMutability": "nonpayable" }],
            functionName: 'settle',
            args: [to, BigInt(amount || 0)],
          })} disabled={isPending} style={{ padding: '10px', background: isPending ? '#ccc' : '#000', color: '#fff' }}>
            {isPending ? 'executing...' : 'settle transaction'}
          </button>
          
          {isConfirmed && <div style={{ padding: '10px', border: '1px solid green', color: 'green' }}>ledger updated: tx successful</div>}
        </section>
      )}
    </main>
  );
}
