const arcTestnet = {
  id: 5042002, // सही Chain ID[span_5](end_span)
  name: 'Arc Testnet',
  nativeCurrency: { 
    name: 'USDC', 
    symbol: 'USDC', 
    decimals: 18 // यह 18 होना अनिवार्य है
  },
  rpcUrls: { 
    default: { http: ['https://rpc.testnet.arc.network'] } 
  },
  blockExplorers: { 
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' } 
  },
  testnet: true
};
