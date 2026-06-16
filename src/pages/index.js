import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton />
      {isConnected && (
        <div>
          <p>Address: {address}</p>
          <p>Network is connected correctly.</p>
        </div>
      )}
    </div>
  );
}
