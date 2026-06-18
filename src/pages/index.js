'use client';
import { useState } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../utils/abi'; // ABI को अलग फाइल से कॉल करें

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash });

  const executeSettlement = async () => {
    try {
      writeContract({
        address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
        abi,
        functionName: 'settle',
        args: [to, BigInt(amount || 0)],
      });
    } catch (err) {
      console.error("Execution Failed:", err);
    }
  };

  return (
    <main style={{ padding: '24px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', margin: '0' }}>Arc Settlement OS</h1>
        <p style={{ fontSize: '12px', opacity: 0.6 }}>AGENT STATUS: {isConnected ? 'ONLINE' : 'OFFLINE'}</p>
      </header>

      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })} style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>CONNECT PASSPORT</button>
      ) : (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '16px', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>ADDRESS: {address}</p>
            <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{balance?.formatted} {balance?.symbol}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd' }} />
            <input placeholder="Amount (WEI)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd' }} />
          </div>

          <button onClick={executeSettlement} disabled={isPending} style={{ padding: '16px', background: isPending ? '#ccc' : '#000', color: '#fff', border: 'none' }}>
            {isPending ? 'VALIDATING...' : 'EXECUTE SETTLEMENT'}
          </button>
          
          {isConfirming && <p style={{ fontSize: '12px' }}>VERIFYING ON-CHAIN...</p>}
          {isConfirmed && <p style={{ color: 'green', fontSize: '12px' }}>[SUCCESS] LEDGER UPDATED & ASSET SETTLED</p>}
          {(writeError || confirmError) && <p style={{ color: 'red', fontSize: '12px' }}>[ERROR] EXECUTION FAILED</p>}
        </section>
      )}
    </main>
  );
}
