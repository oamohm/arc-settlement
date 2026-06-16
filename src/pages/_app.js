// ... (बाकी सब वही रखें)

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* locale="en-US" जोड़ने से पूरा UI इंग्लिश में रहेगा */}
        <RainbowKitProvider locale="en-US">
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
