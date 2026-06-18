import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains'; // यहाँ अपनी चेन का सही चेन ऑब्जेक्ट डालें
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'wagmi';

const config = getDefaultConfig({
  appName: 'Arc Settlement',
  projectId: 'YOUR_PROJECT_ID', // इसे walletconnect से प्राप्त करें
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
