import { useState } from 'react';
import { useWriteContract } from 'wagmi';

export default function ArcSettlement() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const { writeContract } = useWriteContract();

  const handleConfirm = () => {
    // यहाँ ट्रांजैक्शन की लॉजिक है जो एरर को खत्म करेगी
    writeContract({
      address: 'YOUR_CONTRACT_ADDRESS_HERE', // यहाँ वो एड्रेस डालें जो डिप्लॉयमेंट के बाद मिलेगा
      abi: [/* यहाँ कॉन्ट्रैक्ट का ABI डालें */],
      functionName: 'settle',
      args: [to, amount],
    });
  };

  return (
    <div>
      <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
      <input placeholder="Amount (USDC)" onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleConfirm}>Confirm Transaction</button>
    </div>
  );
}
