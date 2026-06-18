import { WagmiProvider, createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Arc Testnet का कॉन्फ़िगरेशन (इसे अपने नेटवर्क के अनुसार सही करें)
const arcTestnet = defineChain({
  id: 12345, // यहाँ अपना सही Chain ID डालें
  name: 'Arc Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['YOUR_RPC_URL'] } }, // यहाँ अपना RPC URL डालें
});

const config = createConfig({
  chains: [arcTestnet],
  transports: { [arcTestnet.id]: http() },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
