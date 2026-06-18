import { useState } from 'react';
import { createPublicClient, http, formatEther } from 'viem';

const client = createPublicClient({
  transport: http('https://rpc.testnet.arc.network')
});

export default function Home() {
  const [balance, setBalance] = useState('0');
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setAccount(address);
        
        const rawBalance = await client.getBalance({ address });
        setBalance(formatEther(rawBalance));
      } catch (error) {
        console.error("Connection failed:", error);
      }
    } else {
      alert("Please install a Web3 wallet like MetaMask.");
    }
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Account: {account}</p>
          <p>Balance: {balance} USDC</p>
        </div>
      )}
    </main>
  );
}
