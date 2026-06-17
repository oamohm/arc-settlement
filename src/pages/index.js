import { useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, encodeFunctionData, parseAbi } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const USDC_CONTRACT = '0x3600000000000000000000000000000000000000';
const erc20Abi = parseAbi(['function transfer(address to, uint256 amount) returns (bool)']);

export default function Home() {
  const { isConnected } = useAccount();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const { data: hash, sendTransaction, isPending } = useSendTransaction();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSend = () => {
    if (!to || !amount) return;
    const amountInUnits = parseUnits(amount, 6);
    sendTransaction({
      to: USDC_CONTRACT,
      data: encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [to, amountInUnits] })
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton />
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <input placeholder="Receiver Address" onChange={(e) => setTo(e.target.value)} />
          <input placeholder="Amount (USDC)" type="number" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={handleSend} disabled={isPending || isLoading}>
            {isPending ? 'Sending...' : 'Confirm Transaction'}
          </button>
        </div>
      )}
    </div>
  );
}

