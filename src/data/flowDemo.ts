/** Fictional demo data; these are sample amounts, not current vendor prices. */
export const flowSubscriptions = [
  { id: 'netflix', name: 'Netflix', amount: 990, category: '動画', color: '#e50914', trial: false, day: 15 },
  { id: 'spotify', name: 'Spotify', amount: 980, category: '音楽', color: '#1db954', trial: false, day: 17 },
  { id: 'adobe', name: 'Adobe CC', amount: 2728, category: '作業', color: '#7c5cfc', trial: true, day: 26 },
];
export const flowPaidTotal = flowSubscriptions.filter(item => !item.trial).reduce((total, item) => total + item.amount, 0);
export const flowProjectedTotal = flowSubscriptions.reduce((total, item) => total + item.amount, 0);
export const flowPaidBreakdown = flowSubscriptions.filter(item => !item.trial).map(item => ({ ...item, percent: Math.round(item.amount / flowPaidTotal * 100) }));
export const demoYen = (amount: number) => `¥${amount.toLocaleString('ja-JP')}`;

export const flowSampleDay = 14;
export const flowMonthlyHistory = [{ month:3, amount:980 },{ month:4, amount:980 },{ month:5, amount:1970 },{ month:6, amount:1970 },{ month:7, amount:1970 },{ month:8, amount:flowPaidTotal }];
