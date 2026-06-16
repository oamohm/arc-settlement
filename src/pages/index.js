import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// आर्क का असली USDC कॉन्ट्रैक्ट एड्रेस
const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

export default function Home() {
  const { address, isConnected } = useAccount();

  // डेसिमल को 18 के हिसाब से रीड करें
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
          <p>नेटवर्क: Arc Testnet</p>
          <p>उपलब्ध USDC: {balance ? (Number(balance) / 10**18).toFixed(2) : '0'}</p>
        </div>
      )}
    </div>
  );
}
