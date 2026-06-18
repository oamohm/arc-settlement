'use client';
import { useState } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../utils/abi'; // सुनिश्चित करें कि यह फाइल मौजूद है

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash });

  const handleSettle = () => {
    if (!to || !amount) return;
    // 6 decimals (USDC standards) का उपयोग करके सही BigInt वैल्यू बनाएं
    const bigIntAmount = BigInt(Math.floor(Number(amount) * 10**6)); 
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, bigIntAmount],
    });
  };

  return (
    <main style={{ padding: '24px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '20px' }}>Arc Settlement</h1>
      
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })} style={{ width: '100%', padding: '12px' }}>Connect Passport</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: '#f4f4f4', padding: '10px', fontSize: '12px' }}>
            <p>Account: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          </div>
          
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ padding: '10px' }} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ padding: '10px' }} />
          
          <button onClick={handleSettle} disabled={isPending} style={{ padding: '12px', background: isPending ? '#ccc' : '#000', color: '#fff', border: 'none' }}>
            {isPending ? 'Executing...' : 'Settle'}
          </button>
          
          {isConfirmed && <p style={{ color: 'green', fontSize: '12px' }}>Transaction Confirmed!</p>}
          {(writeError || confirmError) && <p style={{ color: 'red', fontSize: '12px' }}>Execution Failed. Check Logs.</p>}
        </div>
      )}
    </main>
  );
}
