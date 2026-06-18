import { useAccount, useConnect, useBalance, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState } from 'react';
import { abi } from '../../utils/abi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { data: balance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  const handleSettle = () => {
    const value = BigInt(Math.floor(parseFloat(amount) * 1_000_000));
    writeContract({
      address: '0x5AD1C3710D65Fc824576A71143Dd63b2C30C6174',
      abi,
      functionName: 'settle',
      args: [to, value],
    });
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Arc Settlement</h1>
      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })}>Connect Wallet</button>
      ) : (
        <div>
          <p>Account: {address}</p>
          <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          <input placeholder="To" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount" type="number" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={handleSettle}>Settle</button>
        </div>
      )}
    </main>
  );
}
