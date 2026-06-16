import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();

  // native gas token (USDC) का बैलेंस सीधे Wagmi के useBalance हुक से
  const { data: balance } = useBalance({
    address: address,
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Arc Settlement Engine</h1>
      <ConnectButton />
      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p>Network: Arc Testnet</p>
          <p>
            Balance: {balance ? balance.formatted : '0'} {balance?.symbol}
          </p>
        </div>
      )}
    </div>
  );
}
