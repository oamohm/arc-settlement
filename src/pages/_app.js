// _app.js के अंदर यह हिस्सा बदलें
const arcTestnet = {
  id: 11155111, // अस्थायी रूप से Sepolia ID का उपयोग करें ताकि कनेक्शन बने
  name: 'Arc Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
  blockExplorers: { default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' } },
  testnet: true,
};
