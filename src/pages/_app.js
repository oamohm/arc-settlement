import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// हम डिफ़ॉल्ट रूप से mainnet का उपयोग कर रहे हैं ताकि वॉलेट कनेक्ट हो जाए
// नेटवर्क स्विचिंग आपके वॉलेट से होगी
const config = getDefaultConfig({
  appName: 'Arc Settlement',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet], 
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
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
