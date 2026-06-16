import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Arc Testnet के लिए सही USDC एड्रेस
const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

export default function Home() {
  const { address, isConnected } = useAccount();

  // 18 डेसिमल के साथ बैलेंस पढ़ना
  const { data: balance } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi: ['function balanceOf(address owner) view returns (uint256)'],
    functionName: 'balanceOf',
    args: [address],
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton />
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p>Network: Arc Testnet</p>
          <p>
            Available USDC: {balance ? (Number(balance) / 10**18).toFixed(2) : '0'}
          </p>
        </div>
      )}
    </div>
  );
}
