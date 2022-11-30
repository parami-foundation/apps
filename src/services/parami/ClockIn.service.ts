export const QueryClockIn = async (nftId: string) => {
  console.log('Query ClockIn', nftId);
  return {
    nftId: '42',
    payoutBase: '1000000000000000000',
    payoutMin: '2000000000000000000',
    payoutMax: '3000000000000000000',
    metadata: {
      icon: 'https://ipfs.parami.io/ipfs/QmWi3Eh3J8DKZ6M4BD6rBK2kRwQw1YNRaiSqeowiaKA8fk',
      poster: 'https://ipfs.parami.io/ipfs/QmPWKwog3R4fyvtW9DC2gPKqciMcxVUagehs57gPXmPREG',
      content: 'some text',
      link: 'https://www.google.com'
    },
    tags: ['Twitter', 'KaiReward'],
    status: 'enabled',
    remainingBudget: '365000000000000000000',
    symbol: 'Kai'
  };
}