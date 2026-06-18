import { createPublicClient, http, formatEther } from 'viem';
import { useState, useEffect } from 'react';

const client = createPublicClient({
  transport: http('https://rpc.testnet.arc.network') // आपका RPC
});

export default function Home() {
  const [balance, setBalance] = useState('0');

  const fetchBalance = async (address) => {
    const bal = await client.getBalance({ address });
    setBalance(formatEther(bal));
  };

  // जब भी वॉलेट एड्रेस मिले, बैलेंस तुरंत फेंच करें
  return (
    <main style={{ padding: '20px' }}>
      <h1>Arc Settlement</h1>
      <p>Balance: {balance} USDC</p>
    </main>
  );
}
