import { useState, useEffect } from 'react';
import { createPublicClient, http, formatEther, parseEther } from 'viem';

const client = createPublicClient({
  transport: http('https://rpc.testnet.arc.network')
});

export default function Home() {
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);

  const loadData = async (acc) => {
    const bal = await client.getBalance({ address: acc });
    setBalance(formatEther(bal));
  };

  const handleSend = async () => {
    if (!window.ethereum || !address || !amount) return;
    
    try {
      const valueInWei = parseEther(amount);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ 
          from: accounts[0], 
          to: address, 
          value: '0x' + valueInWei.toString(16)
        }],
      });

      const newEntry = { hash: txHash, to: address, amount: amount };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('txHistory', JSON.stringify(updatedHistory));
      
      alert("Transaction Successful!");
      loadData(accounts[0]);
    } catch (err) {
      alert("Transaction Failed: " + err.message);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('txHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Arc Settlement</h1>
      <button onClick={async () => {
        const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
        loadData(accs[0]);
      }}>Connect & Refresh Balance</button>
      
      <div style={{ marginTop: '20px' }}>
        <p>Balance: {balance} ARC</p>
        <input placeholder="Receiver Address" onChange={(e) => setAddress(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />
        <input placeholder="Amount" type="number" onChange={(e) => setAmount(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />
        <button onClick={handleSend}>Send ARC</button>
      </div>

      <h2>Transaction History</h2>
      {history.map((tx, i) => (
        <div key={i} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>To: {tx.to.slice(0, 10)}... | Amount: {tx.amount} ARC</p>
          <a href={`https://testnet.arcscan.app/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
            Verify on ArcScan
          </a>
        </div>
      ))}
    </main>
  );
}
