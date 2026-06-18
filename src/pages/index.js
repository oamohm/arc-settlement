'use client';
import { useState } from 'react';
import { useAccount, useConnect, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../utils/abi'; // ABI अलग फाइल से ही रहे

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  // 1. ट्रांजैक्शन निष्पादन (Execution)
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleSettle = () => {
    // यहाँ 'amount' को सही से BigInt में बदलना जरूरी है ताकि 0 ट्रांसफर न हो
    const bigIntAmount = BigInt(Math.floor(Number(amount) * 10**6)); // मानकर कि USDC 6 decimals का है
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, bigIntAmount],
    });
  };

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement</h1>
      
      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })} style={{ width: '100%', padding: '12px' }}>Connect Passport</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Wallet Info */}
          <div style={{ background: '#f4f4f4', padding: '10px' }}>
            <p>Account: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          </div>
          
          {/* Input Fields */}
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ padding: '10px' }} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ padding: '10px' }} />
          
          {/* Action Button */}
          <button onClick={handleSettle} disabled={isPending} style={{ padding: '12px', background: '#000', color: '#fff' }}>
            {isPending ? 'Executing...' : 'Settle'}
          </button>
          
          {isConfirmed && <p style={{ color: 'green' }}>Transaction Confirmed!</p>}
        </div>
      )}
    </main>
  );
}
