import { useAccount, useConnect, useBalance, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState, useEffect } from 'react';
import { abi } from '../../utils/abi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  // 'query' पैरामीटर जोड़ने से बैलेंस रेंडरिंग अधिक स्थिर हो जाती है
  const { data: balance, isLoading, refetch } = useBalance({ 
    address, 
    query: { enabled: !!address } 
  });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  // वॉलेट कनेक्ट होते ही बैलेंस को रिफ्रेश करें
  useEffect(() => {
    if (isConnected) refetch();
  }, [isConnected, refetch]);

  const handleSettle = () => {
    if (!to || !amount) return;
    const value = BigInt(Math.floor(parseFloat(amount) * 1_000_000));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, value],
    });
  };

  return (
    <main style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })}>Connect Wallet</button>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Account:</strong> {address}</p>
          <p><strong>Balance:</strong> {isLoading ? 'Loading...' : balance ? `${balance.formatted} ${balance.symbol}` : '0'}</p>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} style={{ display: 'block', margin: '10px auto' }} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', margin: '10px auto' }} />
          <button onClick={handleSettle} style={{ padding: '10px 20px' }}>Settle</button>
        </div>
      )}
    </main>
  );
}
