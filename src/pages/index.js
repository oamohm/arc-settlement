import { useState, useEffect } from 'react';
import { createPublicClient, http, formatEther, parseEther } from 'viem';

// Arc Testnet RPC
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
      
      // यहाँ हमने 'gas' और 'data' फील्ड को हटा दिया है ताकि वॉलेट सीधे नेटिव टोकन ट्रांसफर करे
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ 
          from: accounts[0], 
          to: address, 
          value: '0x' + valueInWei.toString(16),
          // 'gasPrice' और 'gasLimit' को ऑटोमैटिक छोड़ दिया है ताकि ARC नेटवर्क खुद इसे हैंडल करे
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
      
      <p>Balance: {balance} ARC</p>
      <input placeholder="Receiver" onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="Amount" type="number" onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleSend}>Send ARC</button>

      <h2>History</h2>
      {history.map((tx, i) => (
        <div key={i} style={{ border: '1px solid #ccc', padding: '5px', margin: '5px 0' }}>
          <p>To: {tx.to.slice(0, 10)}... | Amount: {tx.amount}</p>
          <a href={`https://testnet.arcscan.app/transaction/${tx.hash}`} target="_blank">Verify</a>
        </div>
      ))}
    </main>
  );
}
