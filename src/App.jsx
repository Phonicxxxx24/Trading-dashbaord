import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend, ReferenceLine,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  LayoutDashboard, BarChart2, History, Bell, Search, 
  ChevronDown, Zap, TrendingUp, 
  Activity, AlertCircle, Shield, Flame, Globe, Cpu, Clock, Target, 
  Filter, Calendar, Download, Edit3, Tag, Layers, BarChart3, TrendingDown, Eye, Plus, X, ArrowRight,
  Wallet, Lock, LogOut, CheckCircle2, Loader2, ArrowUpDown, Info, ChevronLeft, ChevronRight, CalendarDays
} from 'lucide-react';

// --- Landing Page Component with 3D Globe ---

const GlobeAnimation = ({ isExiting }) => {
  const canvasRef = useRef(null);
  const exitingRef = useRef(isExiting);

  useEffect(() => {
    exitingRef.current = isExiting;
  }, [isExiting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Globe parameters
    const BASE_RADIUS = Math.min(width, height) * 0.45; 
    const DOT_RADIUS = 3; 
    const DOT_COUNT = 600; 
    const PROJECTION_CENTER_X = width / 2;
    const PROJECTION_CENTER_Y = height / 2;
    const FIELD_OF_VIEW = width * 0.8;

    class Dot {
      constructor() {
        this.theta = Math.random() * 2 * Math.PI; 
        this.phi = Math.acos((Math.random() * 2) - 1); 
        this.x = 0;
        this.y = 0;
        this.z = 0;
      }

      draw(ctx, rotation, radiusScale) {
        const radius = BASE_RADIUS * radiusScale;
        this.x = radius * Math.sin(this.phi) * Math.cos(this.theta);
        this.y = radius * Math.cos(this.phi);
        this.z = radius * Math.sin(this.phi) * Math.sin(this.theta);

        const rotX = this.x * Math.cos(rotation) - this.z * Math.sin(rotation);
        const rotZ = this.z * Math.cos(rotation) + this.x * Math.sin(rotation);
        
        const scale = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ + radius);
        const x2d = (rotX * scale) + PROJECTION_CENTER_X;
        const y2d = (this.y * scale) + PROJECTION_CENTER_Y;

        const alpha = Math.max(0.05, (scale - 0.5) * 1.2); 
        const currentDotRadius = isExiting ? DOT_RADIUS * scale * 3 : DOT_RADIUS * scale;

        ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`; 
        ctx.beginPath();
        ctx.arc(x2d, y2d, currentDotRadius, 0, Math.PI * 2);
        ctx.fill();
        
        if (scale > 1.2 && !isExiting) {
           ctx.shadowBlur = 15;
           ctx.shadowColor = 'rgba(249, 115, 22, 0.6)';
        } else {
           ctx.shadowBlur = 0;
        }
      }
    }

    const dots = Array.from({ length: DOT_COUNT }, () => new Dot());

    let rotation = 0;
    let radiusScale = 1.0;
    let animationFrameId;

    const render = () => {
      if (exitingRef.current) {
         ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
         ctx.fillRect(0, 0, width, height);
      } else {
         ctx.clearRect(0, 0, width, height);
         const gradient = ctx.createRadialGradient(width/2, height/2, BASE_RADIUS * 0.2, width/2, height/2, BASE_RADIUS * 1.5);
         gradient.addColorStop(0, 'rgba(249, 115, 22, 0.15)');
         gradient.addColorStop(0.6, 'rgba(249, 115, 22, 0.02)');
         gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
         ctx.fillStyle = gradient;
         ctx.fillRect(0, 0, width, height);
      }
      
      if (exitingRef.current) {
         radiusScale *= 1.05; 
         rotation += 0.005; 
      } else {
         rotation += 0.002; 
      }

      dots.forEach(dot => {
        dot.draw(ctx, rotation, radiusScale);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

const LandingPage = ({ onStartExit, onExitComplete }) => {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    onStartExit(); 
    setTimeout(() => {
      onExitComplete();
    }, 1500); 
  };

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] overflow-hidden bg-[#050505] transition-opacity duration-1000 ${exiting ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 z-0">
         <GlobeAnimation isExiting={exiting} />
      </div>
      
      <div className={`relative z-10 text-center space-y-8 p-4 max-w-2xl mx-auto transition-all duration-500 transform ${exiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
        <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shrink-0 shadow-[0_0_60px_rgba(249,115,22,0.6)] animate-pulse border-4 border-black/20">
              <Zap className="w-10 h-10 text-white fill-current" />
            </div>
            <div>
              <span className="text-6xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-2xl block">Deriverse</span>
              <span className="text-orange-500 text-sm md:text-base font-mono tracking-[0.4em] uppercase mt-4 block">Decentralized Analytics</span>
            </div>
        </div>
          
        <p className="text-gray-400 text-sm md:text-lg max-w-md mx-auto font-light leading-relaxed">
            Next-gen on-chain trading intelligence.
        </p>

        <button 
          onClick={handleEnter}
          className="group relative px-12 py-5 bg-transparent overflow-hidden rounded-full transition-all duration-300 hover:shadow-[0_0_60px_rgba(249,115,22,0.4)] border border-orange-500/40 hover:border-orange-500 mt-8"
        >
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-500 ease-out group-hover:w-full opacity-100"></div>
          <span className="relative flex items-center gap-3 text-white font-bold tracking-widest uppercase text-xs z-10">
            Enter Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
};

// --- Authentication Modal ---

const WalletConnectModal = ({ isOpen, onClose, onConnect, onDemo }) => {
  const [connectingWallet, setConnectingWallet] = useState(null);

  if (!isOpen) return null;

  const handleConnectClick = (walletName) => {
    setConnectingWallet(walletName);
    // Simulate network delay and signature request
    setTimeout(() => {
      onConnect(walletName);
      setConnectingWallet(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#161616] border border-[#333] rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <div className="text-center mb-8">
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-900/40 relative">
              {connectingWallet ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">
             {connectingWallet ? 'Requesting Access' : 'Connect Wallet'}
           </h2>
           <p className="text-gray-400 text-sm">
             {connectingWallet 
               ? 'Please approve the Read-Only request in your wallet.' 
               : 'Securely connect to analyze your on-chain portfolio.'}
           </p>
        </div>

        <div className="space-y-3">
           <button 
             onClick={() => handleConnectClick('Phantom')} 
             disabled={!!connectingWallet}
             className="w-full flex items-center justify-between p-4 rounded-xl bg-[#222] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed border border-[#333] hover:border-orange-500/50 transition-all group"
           >
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#512da8] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                 </div>
                 <span className="font-bold text-white">Phantom <span className="text-gray-500 font-normal ml-1">(Demo)</span></span>
              </div>
              <span className="text-xs text-gray-500 group-hover:text-white transition-colors">Detected</span>
           </button>
           
           <button 
             onClick={() => handleConnectClick('Solflare')} 
             disabled={!!connectingWallet}
             className="w-full flex items-center justify-between p-4 rounded-xl bg-[#222] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed border border-[#333] hover:border-orange-500/50 transition-all group"
           >
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#fc6003] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                 </div>
                 <span className="font-bold text-white">Solflare <span className="text-gray-500 font-normal ml-1">(Demo)</span></span>
              </div>
           </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3">
           <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
           <div className="text-xs text-orange-200/80 leading-relaxed">
              <span className="font-bold text-orange-500 block mb-1">Demo Mode:</span>
              Wallet connection is simulated using mock on-chain data. No transactions, signatures, or real funds are involved.
           </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-[#222]">
           <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Security First</span>
           </div>
           <p className="text-center text-[10px] text-gray-600">
              Made for Deriverse Bounty. <br/>
              This application requests <strong>Read-Only</strong> permissions only.
           </p>
        </div>
      </div>
    </div>
  );
};

// --- Mock Data (Recalibrated for 2k-5k range) ---

const generateJournalData = () => {
  const assets = ['SOL', 'JUP', 'PYTH', 'WIF', 'BONK', 'RAY'];
  const types = ['Long', 'Short'];
  const strategies = ['Breakout', 'Mean Reversion', 'Trend Following', 'News'];
  const data = [];
  
  for (let i = 0; i < 25; i++) {
    const isWin = Math.random() > 0.45;
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const sizeMultiplier = asset === 'BONK' ? 100000 : asset === 'WIF' ? 100 : 10; 
    const size = Math.floor(Math.random() * 50 * sizeMultiplier);
    
    let basePrice = 100;
    if (asset === 'JUP') basePrice = 0.5;
    if (asset === 'PYTH') basePrice = 0.4;
    if (asset === 'WIF') basePrice = 2.0;
    if (asset === 'BONK') basePrice = 0.00001;
    if (asset === 'RAY') basePrice = 1.2;

    const entry = basePrice * (1 + (Math.random() * 0.1 - 0.05));
    const exit = isWin ? entry * (1 + Math.random() * 0.15) : entry * (1 - Math.random() * 0.1);
    
    const pnl = (exit - entry) * size * (type === 'Long' ? 1 : -1);
    
    data.push({
      id: `TX-${1000 + i}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
      pair: `${asset}-PERP`,
      type,
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      size: `${size} ${asset}`,
      entry: entry.toFixed(asset === 'BONK' ? 6 : 4),
      exit: exit.toFixed(asset === 'BONK' ? 6 : 4),
      pnl: parseFloat(pnl.toFixed(2)),
      pnlPercent: parseFloat(((exit - entry) / entry * 100).toFixed(2)),
      fee: (Math.random() * 2).toFixed(2),
      notes: isWin ? 'Good execution, followed plan.' : 'FOMO entry, exited too late.',
      duration: `${Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 59)}m`
    });
  }
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const portfolioMockData = {
  '1D': [
    { date: '00:00', value: 3950 }, { date: '04:00', value: 4020 },
    { date: '08:00', value: 3980 }, { date: '12:00', value: 4150 },
    { date: '16:00', value: 4100 }, { date: '20:00', value: 4250 },
  ],
  '7D': [
    { date: 'Jan 25', value: 3200 }, { date: 'Jan 26', value: 3250 },
    { date: 'Jan 27', value: 3180 }, { date: 'Jan 28', value: 3400 },
    { date: 'Jan 29', value: 3550 }, { date: 'Jan 30', value: 3480 },
    { date: 'Feb 01', value: 3600 }, { date: 'Feb 02', value: 3850 },
    { date: 'Feb 03', value: 3920 }, { date: 'Feb 04', value: 3800 },
    { date: 'Feb 05', value: 4100 }, { date: 'Feb 06', value: 4050 },
    { date: 'Feb 07', value: 4250 },
  ],
  '30D': [
    { date: 'Week 1', value: 2500 }, { date: 'Week 2', value: 3100 },
    { date: 'Week 3', value: 3400 }, { date: 'Week 4', value: 4250 },
  ],
  'ALL': [
    { date: 'Oct', value: 1200 }, { date: 'Nov', value: 1800 },
    { date: 'Dec', value: 2500 }, { date: 'Jan', value: 3800 },
    { date: 'Feb', value: 4250 },
  ]
};

const volumeMockData = {
  '1D': [
    { name: '00:00', value: 2500 }, { name: '04:00', value: 1200 },
    { name: '08:00', value: 4500 }, { name: '12:00', value: 8500 },
    { name: '16:00', value: 6800 }, { name: '20:00', value: 3200 },
  ],
  '7D': [
    { name: 'Mon', value: 25000 }, { name: 'Tue', value: 31000 },
    { name: 'Wed', value: 28000 }, { name: 'Thu', value: 45000 },
    { name: 'Fri', value: 52000 }, { name: 'Sat', value: 18000 },
    { name: 'Sun', value: 15000 },
  ],
  '30D': [
    { name: 'Week 1', value: 180000 }, { name: 'Week 2', value: 210000 },
    { name: 'Week 3', value: 160000 }, { name: 'Week 4', value: 240000 },
  ],
  'ALL': [
    { name: 'Jan', value: 650000 }, { name: 'Feb', value: 720000 },
    { name: 'Mar', value: 580000 }, { name: 'Apr', value: 810000 },
    { name: 'May', value: 790000 }, { name: 'Jun', value: 920000 },
  ]
};

// Expanded Market Data
const marketWatchData = [
  { name: 'SOL', symbol: 'SOL-PERP', price: 104.20, change: 5.2, trend: [95, 98, 96, 100, 102, 101, 104], vol: 85 },
  { name: 'JUP', symbol: 'JUP-PERP', price: 0.52, change: -2.4, trend: [0.55, 0.54, 0.53, 0.52, 0.51, 0.52, 0.52], vol: 60 },
  { name: 'PYTH', symbol: 'PYTH-PERP', price: 0.41, change: 12.5, trend: [0.35, 0.36, 0.38, 0.40, 0.42, 0.40, 0.41], vol: 92 },
  { name: 'WIF', symbol: 'WIF-PERP', price: 2.15, change: -8.1, trend: [2.4, 2.3, 2.35, 2.2, 2.1, 2.15, 2.15], vol: 75 },
  { name: 'BONK', symbol: 'BONK-PERP', price: 0.000014, change: 3.2, trend: [12, 13, 12, 13, 14, 13, 14], vol: 45 },
  { name: 'JTO', symbol: 'JTO-PERP', price: 2.45, change: 8.4, trend: [2.1, 2.2, 2.15, 2.3, 2.4, 2.35, 2.45], vol: 65 },
  { name: 'ORCA', symbol: 'ORCA-PERP', price: 3.12, change: -1.2, trend: [3.2, 3.15, 3.18, 3.12, 3.10, 3.11, 3.12], vol: 40 },
  { name: 'RAY', symbol: 'RAY-PERP', price: 1.15, change: 4.5, trend: [1.05, 1.08, 1.10, 1.12, 1.14, 1.13, 1.15], vol: 55 },
  { name: 'HNT', symbol: 'HNT-PERP', price: 7.80, change: -3.5, trend: [8.1, 8.0, 7.9, 7.85, 7.8, 7.75, 7.8], vol: 70 },
  { name: 'MSOL', symbol: 'MSOL-PERP', price: 112.50, change: 5.5, trend: [105, 108, 106, 110, 112, 111, 112.5], vol: 30 },
];

const walletStats = {
  address: '6xR9...jK42',
  fullAddress: '6xR9P...jK42',
  totalValue: 4250.75,
  currency: 'USDC',
  netPnL: 1250.50,
  pnlPercent: 41.6,
  winRate: 68,
  maxDrawdown: -8.4,
};

const riskStats = [
  { label: 'Avg Trade Size', value: '$450', icon: Activity, change: '+12%', sub: 'Balanced Sizing', positive: true },
  { label: 'Risk/Reward Ratio', value: '1 : 2.4', icon: Target, change: '+0.2', sub: 'Healthy R:R', positive: true },
  { label: 'Best Trade', value: '+$420', icon: TrendingUp, sub: 'SOL Long', positive: true },
];

// Analytics Data
const winLossData = [{ name: 'Wins', value: 68, color: '#22c55e' }, { name: 'Losses', value: 32, color: '#ef4444' }];
const longShortData = [{ name: 'Long', pnl: 1250, trades: 45 }, { name: 'Short', pnl: -350, trades: 22 }];
const assetPerformance = [
  { name: 'SOL', value: 850 }, { name: 'JUP', value: 320 },
  { name: 'PYTH', value: 150 }, { name: 'WIF', value: -120 },
  { name: 'BONK', value: -80 },
  { name: 'JTO', value: 450 }, { name: 'RAY', value: -150 }, { name: 'ORCA', value: 120 },
];

// --- Components ---

const Sidebar = ({ activeItem, setActiveItem, isCollapsed, toggleSidebar }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
    { icon: History, label: 'Journal', id: 'journal' },
    { icon: CalendarDays, label: 'Performance', id: 'calendar' }, // New Item
    { icon: BarChart2, label: 'Deep Analytics', id: 'analytics' },
  ];

  return (
    <div className={`h-screen bg-[#0f0f0f]/95 backdrop-blur-xl border-r border-[#1f1f1f] flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          {!isCollapsed && <span className="text-xl font-bold text-white tracking-tight animate-in fade-in duration-300">Deriverse</span>}
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-7 w-6 h-6 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors shadow-md z-50"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      <nav className="flex-1 mt-6 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-4 p-3 mb-2 rounded-xl transition-all duration-200 group relative ${
              activeItem === item.id 
                ? 'bg-[#1a1a1a] text-orange-500 border border-[#2a2a2a]' 
                : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${activeItem === item.id ? 'text-orange-500' : 'group-hover:text-white'}`} />
            {!isCollapsed && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">{item.label}</span>}
            
            {activeItem === item.id && !isCollapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
            )}
          </button>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 mt-auto animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-4 rounded-xl border border-[#2a2a2a] shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400">Solana TPS</span>
              <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                <Activity className="w-3 h-3" /> 2,450
              </span>
            </div>
            <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = ({ title, subtitle, connectionState, onConnectClick, onDisconnect }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-6 lg:p-8 pb-4 relative z-20">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight">{title}</h1>
        <p className="text-gray-500 text-sm lg:text-base font-medium">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-4">
        
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-[#161616]/80 hover:bg-[#202020] border border-[#2a2a2a] text-gray-400 hover:text-white transition-colors backdrop-blur-md"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#161616]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#161616] border border-[#333] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-[#2a2a2a] flex justify-between items-center">
                <span className="text-white font-bold text-sm">Notifications</span>
                <span className="text-xs text-orange-500 cursor-pointer hover:text-orange-400">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-[#2a2a2a]/50 hover:bg-[#1f1f1f] transition-colors cursor-pointer">
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-green-500 text-xs font-bold">Order Filled</span>
                      <span className="text-gray-600 text-[10px]">2m ago</span>
                   </div>
                   <p className="text-gray-300 text-xs">Buy Limit 500 SOL @ $104.20 filled completely.</p>
                </div>
                <div className="p-4 border-b border-[#2a2a2a]/50 hover:bg-[#1f1f1f] transition-colors cursor-pointer">
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-orange-500 text-xs font-bold">Price Alert</span>
                      <span className="text-gray-600 text-[10px]">1h ago</span>
                   </div>
                   <p className="text-gray-300 text-xs">JUP crossed above $0.55.</p>
                </div>
                <div className="p-4 hover:bg-[#1f1f1f] transition-colors cursor-pointer">
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-blue-500 text-xs font-bold">Funding</span>
                      <span className="text-gray-600 text-[10px]">4h ago</span>
                   </div>
                   <p className="text-gray-300 text-xs">Funding fee charged: -2.50 USDC</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Connect Logic */}
        {connectionState === 'disconnected' ? (
           <button 
             onClick={onConnectClick}
             className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-full shadow-lg shadow-orange-900/40 transition-all flex items-center gap-2"
           >
             <Wallet className="w-4 h-4" />
             <span className="hidden md:inline">Connect Wallet</span>
           </button>
        ) : (
           <div className="relative" ref={profileRef}>
              <div 
                className="flex items-center gap-3 pl-2 cursor-pointer group"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-white group-hover:text-orange-500 transition-colors">
                    {connectionState === 'demo' ? 'Phoenix The Creator' : walletStats.address}
                  </div>
                  <div className="text-xs text-gray-500">{connectionState === 'demo' ? 'Creator Mode' : 'Pro Trader'}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 border border-[#333] overflow-hidden p-[1px]">
                   <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                     <span className="font-bold text-xs text-orange-500">
                        {connectionState === 'demo' ? 'P' : 'DZ'}
                     </span>
                   </div>
                </div>
              </div>

              {showProfileMenu && (
                 <div className="absolute right-0 mt-3 w-48 bg-[#161616] border border-[#333] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                    <button onClick={onDisconnect} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm flex items-center gap-2">
                       <LogOut className="w-4 h-4" /> Disconnect
                    </button>
                 </div>
              )}
           </div>
        )}
      </div>
    </header>
  );
};

const WalletCard = () => (
  <div className="bg-[#0f0f0f]/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden border border-[#1f1f1f] shadow-2xl h-full group">
    <div className="relative perspective-1000 shrink-0 z-20">
       <div className="absolute top-6 left-6 w-[380px] h-[240px] bg-black/60 rounded-2xl transform rotate-[-3deg] blur-xl transition-all duration-500"></div>
       <div className="relative w-[380px] h-[240px] rounded-2xl p-6 text-white shadow-2xl transition-transform duration-500 transform rotate-[-6deg] hover:rotate-0 hover:scale-105 group-hover:shadow-orange-900/30 border border-white/10"
            style={{ background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 40%, #581c87 100%)' }}>
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
             <div className="flex flex-col"><div className="flex items-center gap-2"><span className="font-bold text-white text-lg">Solana</span></div></div>
             <Globe className="w-5 h-5 text-white/80" />
          </div>
          <div className="flex items-center gap-4 mb-5 relative z-10">
             <div className="w-11 h-8 rounded-md border border-yellow-200/40 bg-gradient-to-br from-yellow-200/20 to-yellow-500/10 relative flex items-center justify-center overflow-hidden backdrop-blur-sm">
                <div className="w-full h-[1px] bg-white/20 absolute top-1/2 -translate-y-1/2"></div>
                <div className="h-full w-[1px] bg-white/20 absolute left-1/2 -translate-x-1/2"></div>
             </div>
             <Cpu className="w-6 h-6 text-white/50 transform rotate-90" />
          </div>
          <div className="font-mono text-xl tracking-widest text-shadow-sm mb-4 relative z-10 flex gap-3 drop-shadow-md text-orange-50">
             <span>6xR9</span><span>....</span><span>....</span><span>jK42</span>
          </div>
       </div>
    </div>
    <div className="flex-1 w-full md:w-auto pl-0 lg:pl-10 relative z-20 flex flex-col justify-center h-full">
       <div className="flex justify-between items-center mb-4">
          <span className="text-white text-xl font-medium tracking-tight">Total Equity</span>
          <button className="bg-[#222] hover:bg-[#333] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-[#333] shadow-lg hover:shadow-orange-500/10 active:scale-95 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Phantom</button>
       </div>
       <div className="flex items-baseline gap-3 mb-10"><h2 className="text-6xl lg:text-7xl font-medium text-white tracking-tight drop-shadow-2xl">${walletStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2><span className="text-2xl text-gray-500 font-medium translate-y-[-6px]">USDC</span></div>
       
       <div className="grid grid-cols-3 gap-8 border-t border-[#2a2a2a] pt-8">
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Unrealized PnL</div>
            <div className="text-green-500 font-bold text-xl">+$350.20</div>
          </div>
          <div>
             <div className="text-gray-500 text-sm font-medium mb-1">Daily PnL</div>
             <div className="text-green-500 font-bold text-xl">+$140.50</div>
          </div>
          <div>
             <div className="text-gray-500 text-sm font-medium mb-1">Open Positions</div>
             <div className="text-white font-bold text-xl">3 Active</div>
          </div>
       </div>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, change, sub, positive }) => (
  <div className="bg-[#161616]/60 backdrop-blur-md p-6 rounded-2xl border border-[#222] hover:border-[#333] transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 h-full">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-[#1f1f1f] text-gray-400 group-hover:text-orange-500 group-hover:bg-[#2a2a2a] transition-colors shadow-inner"><Icon className="w-6 h-6" /></div>
      {change && (<span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{change}</span>)}
    </div>
    <div><p className="text-gray-500 text-base font-medium mb-1">{label}</p><h3 className={`text-3xl font-bold ${positive === false ? 'text-red-400' : 'text-white'}`}>{value}</h3>{sub && <p className="text-sm text-gray-600 mt-1">{sub}</p>}</div>
  </div>
);

// --- VIEWS ---

const DashboardView = () => {
  const [volRange, setVolRange] = useState('7D');
  const currentVolumeData = volumeMockData[volRange];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Row: Full Width Wallet Card */}
      <div className="w-full">
        <WalletCard />
      </div>

      {/* Middle Row: Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {riskStats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Bottom Row: Volume Chart */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-8 border border-[#2a2a2a] shadow-xl relative z-20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-orange-500" /> Trading Volume
              </h3>
              <div className="flex items-center gap-3">
                 <span className="text-4xl font-bold text-white">
                   ${currentVolumeData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                 </span>
                 <span className="text-gray-500 text-base font-medium">Total Volume ({volRange})</span>
              </div>
            </div>
            
            <div className="flex bg-[#0f0f0f] p-1.5 rounded-xl border border-[#2a2a2a]">
              {['1D', '7D', '30D', 'ALL'].map((period) => (
                <button 
                  key={period} 
                  onClick={() => setVolRange(period)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    volRange === period 
                      ? 'bg-[#252525] text-white shadow-sm border border-[#333]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentVolumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 13 }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 13 }} 
                  tickFormatter={(val) => `$${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : (val/1000).toFixed(0) + 'k'}`} 
                />
                <Tooltip 
                  cursor={{fill: '#2a2a2a'}} 
                  contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '12px', color: '#fff', padding: '12px' }} 
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#888', marginBottom: '8px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#f97316" 
                  radius={[6, 6, 0, 0]} 
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const JournalView = () => {
  const [filter, setFilter] = useState('All');
  // Initialize with the generator so we can add new trades
  const [trades, setTrades] = useState(generateJournalData());
  const [showModal, setShowModal] = useState(false);
  const [newTrade, setNewTrade] = useState({
    pair: 'SOL-PERP',
    type: 'Long',
    entry: '',
    exit: '',
    size: '',
    strategy: 'Breakout',
    notes: ''
  });

  const filteredData = useMemo(() => {
    if (filter === 'All') return trades;
    return trades.filter(item => item.pair.includes(filter));
  }, [filter, trades]);

  const handleExportCSV = () => {
    const headers = ['Date', 'ID', 'Pair', 'Type', 'Strategy', 'Size', 'Entry', 'Exit', 'PnL', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...trades.map(t => [
        t.date, t.id, t.pair, t.type, t.strategy, t.size, t.entry, t.exit, t.pnl, 'Closed', `"${t.notes}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'trading_journal.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTrade = (e) => {
    e.preventDefault();
    if (!newTrade.entry || !newTrade.exit || !newTrade.size) return;

    const entryPrice = parseFloat(newTrade.entry);
    const exitPrice = parseFloat(newTrade.exit);
    const sizeNum = parseFloat(newTrade.size);
    const direction = newTrade.type === 'Long' ? 1 : -1;
    const pnlPercent = ((exitPrice - entryPrice) / entryPrice * 100 * direction).toFixed(2);
    const pnlTotal = (parseFloat(pnlPercent) * 20).toFixed(2);

    const tradeToAdd = {
      id: `TX-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      pair: newTrade.pair,
      type: newTrade.type,
      strategy: newTrade.strategy,
      size: `${newTrade.size} Units`,
      entry: entryPrice.toFixed(4),
      exit: exitPrice.toFixed(4),
      pnl: parseFloat(pnlTotal),
      pnlPercent: parseFloat(pnlPercent),
      fee: '0.50',
      notes: newTrade.notes || 'Manual Entry',
      duration: '0h 0m'
    };

    setTrades([tradeToAdd, ...trades]);
    setShowModal(false);
    setNewTrade({ pair: 'SOL-PERP', type: 'Long', entry: '', exit: '', size: '', strategy: 'Breakout', notes: '' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      <div className="bg-[#161616]/60 backdrop-blur-md rounded-2xl p-4 border border-[#2a2a2a] flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-[#0f0f0f] border border-[#333] rounded-xl text-sm text-white focus:border-orange-500 outline-none appearance-none"
            >
              <option value="All">All Pairs</option>
              <option value="SOL">SOL-PERP</option>
              <option value="JUP">JUP-PERP</option>
              <option value="WIF">WIF-PERP</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-3 h-3 text-gray-500 pointer-events-none" />
          </div>
          
          <div className="relative hidden md:block">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Date Range" className="pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 outline-none w-40" />
          </div>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={handleExportCSV}
             className="flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] hover:bg-[#222] border border-[#333] text-white rounded-xl text-sm transition-colors"
           >
             <Download className="w-4 h-4" /> Export CSV
           </button>
           <button 
             onClick={() => setShowModal(true)}
             className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-orange-900/20"
           >
             <Edit3 className="w-4 h-4" /> Add Trade
           </button>
        </div>
      </div>

      <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-[#2a2a2a]">
                <th className="pb-4 pl-2">Date / ID</th>
                <th className="pb-4">Market / Strategy</th>
                <th className="pb-4">Side</th>
                <th className="pb-4">Entry / Exit</th>
                <th className="pb-4 text-right">Size</th>
                <th className="pb-4 text-right">PnL</th>
                <th className="pb-4 pl-6">Journal Notes</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.map((trade) => (
                <tr key={trade.id} className="group border-b border-[#222] last:border-0 hover:bg-[#1f1f1f]/50 transition-colors">
                  <td className="py-4 pl-2">
                    <div className="font-bold text-white">{trade.date}</div>
                    <div className="text-xs text-gray-500 font-mono">{trade.id}</div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{trade.pair}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2a2a] text-gray-400 border border-[#333]">{trade.strategy}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${trade.type === 'Long' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="text-gray-300">{trade.entry} <span className="text-gray-600">→</span> {trade.exit}</div>
                  </td>
                  <td className="py-4 text-right font-mono text-gray-400">{trade.size}</td>
                  <td className="py-4 text-right">
                    <div className={`font-bold ${trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                    </div>
                    <div className="text-xs text-gray-500">{trade.pnl > 0 ? '+' : ''}{trade.pnlPercent}%</div>
                  </td>
                  <td className="py-4 pl-6">
                    <div className="flex items-start gap-2 max-w-xs">
                       <Tag className="w-3 h-3 text-gray-600 mt-1 shrink-0" />
                       <span className="text-gray-400 text-xs truncate group-hover:whitespace-normal group-hover:text-white transition-colors">{trade.notes}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161616] border border-[#333] p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-white mb-6">Log New Trade</h2>
            <form onSubmit={handleAddTrade} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Pair</label>
                  <select value={newTrade.pair} onChange={e => setNewTrade({...newTrade, pair: e.target.value})} className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-orange-500 outline-none">
                    <option>SOL-PERP</option>
                    <option>JUP-PERP</option>
                    <option>WIF-PERP</option>
                    <option>BONK-PERP</option>
                    <option>PYTH-PERP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Type</label>
                  <div className="flex bg-[#0f0f0f] p-1 rounded-xl border border-[#333]">
                     <button type="button" onClick={() => setNewTrade({...newTrade, type: 'Long'})} className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${newTrade.type === 'Long' ? 'bg-green-500/20 text-green-500' : 'text-gray-500 hover:text-gray-300'}`}>Long</button>
                     <button type="button" onClick={() => setNewTrade({...newTrade, type: 'Short'})} className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${newTrade.type === 'Short' ? 'bg-red-500/20 text-red-500' : 'text-gray-500 hover:text-gray-300'}`}>Short</button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Entry Price</label>
                  <input type="number" step="any" required value={newTrade.entry} onChange={e => setNewTrade({...newTrade, entry: e.target.value})} placeholder="0.00" className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Exit Price</label>
                  <input type="number" step="any" required value={newTrade.exit} onChange={e => setNewTrade({...newTrade, exit: e.target.value})} placeholder="0.00" className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-orange-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Position Size</label>
                  <input type="number" step="any" required value={newTrade.size} onChange={e => setNewTrade({...newTrade, size: e.target.value})} placeholder="Amount" className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Strategy</label>
                  <select value={newTrade.strategy} onChange={e => setNewTrade({...newTrade, strategy: e.target.value})} className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-orange-500 outline-none">
                    <option>Breakout</option>
                    <option>Trend Following</option>
                    <option>Mean Reversion</option>
                    <option>News</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Notes</label>
                <textarea rows="3" value={newTrade.notes} onChange={e => setNewTrade({...newTrade, notes: e.target.value})} placeholder="Why did you take this trade?" className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:border-orange-500 outline-none resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-900/30 mt-2">Save Trade Log</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsView = () => {
  const [portfolioRange, setPortfolioRange] = useState('7D');
  const currentPortfolioData = portfolioMockData[portfolioRange];
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const [pnlSortOrder, setPnlSortOrder] = useState('highToLow'); // 'highToLow' or 'lowToHigh'

  const displayedMarkets = showAllMarkets ? marketWatchData : marketWatchData.slice(0, 5);

  const sortedAssets = useMemo(() => {
    return [...assetPerformance].sort((a, b) => {
      return pnlSortOrder === 'highToLow' ? b.value - a.value : a.value - b.value;
    });
  }, [pnlSortOrder]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl relative z-20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Portfolio Performance</h3>
              <div className="flex items-center gap-2"><span className="text-3xl font-bold text-white">+$1,250.50</span><span className="text-green-500 text-sm font-medium flex items-center bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20"><TrendingUp className="w-3 h-3 mr-1" /> +41.6%</span></div>
            </div>
            <div className="flex bg-[#0f0f0f] p-1 rounded-xl border border-[#2a2a2a]">
              {['1D', '7D', '30D', 'ALL'].map((period) => (
                <button 
                  key={period} 
                  onClick={() => setPortfolioRange(period)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    portfolioRange === period 
                      ? 'bg-[#252525] text-white shadow-sm border border-[#333]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentPortfolioData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#888', marginBottom: '4px' }} />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-orange-500"/> Fee Breakdown</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'Maker', fee: 12, rebate: 2 },
                   { name: 'Taker', fee: 45, rebate: 0 },
                   { name: 'Funding', fee: 8, rebate: 0 }
                 ]}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#888'}} />
                   <Tooltip cursor={{fill: '#2a2a2a'}} contentStyle={{backgroundColor: '#111', borderColor: '#333', color: '#fff'}} />
                   <Bar dataKey="fee" stackId="a" fill="#ea580c" />
                   <Bar dataKey="rebate" stackId="a" fill="#22c55e" />
                   <Legend />
                 </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500"/> Hourly Performance</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { hour: '00-04', pnl: -12 }, { hour: '04-08', pnl: 45 },
                    { hour: '08-12', pnl: 89 }, { hour: '12-16', pnl: -23 },
                    { hour: '16-20', pnl: 120 }, { hour: '20-24', pnl: 15 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill:'#888'}} />
                    <Tooltip cursor={{fill: '#2a2a2a'}} contentStyle={{backgroundColor: '#111', borderColor: '#333', color: '#fff'}} />
                    <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                      {
                        [ -12, 45, 89, -23, 120, 15 ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry > 0 ? '#22c55e' : '#ef4444'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold text-white flex items-center gap-2"><Eye className="w-5 h-5 text-orange-500" /> Market Volatility & Trend Scanner</h3>
           <button 
             onClick={() => setShowAllMarkets(!showAllMarkets)}
             className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-colors flex items-center gap-1"
           >
             {showAllMarkets ? 'Show Less' : 'View All Markets'}
             <ChevronDown className={`w-4 h-4 transition-transform ${showAllMarkets ? 'rotate-180' : ''}`} />
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
           {displayedMarkets.map((asset, i) => (
               <div key={i} className="bg-[#0f0f0f] p-4 rounded-xl border border-[#2a2a2a] hover:border-orange-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-bold text-xs text-gray-400">{asset.name.substring(0,1)}</div>
                        <div>
                          <div className="font-bold text-white text-sm">{asset.name}</div>
                          <div className="text-[10px] text-gray-500">{asset.symbol}</div>
                        </div>
                     </div>
                     <div className={`text-xs font-bold ${asset.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.change > 0 ? '+' : ''}{asset.change}%
                     </div>
                  </div>
                  
                  <div className="h-12 mt-2 mb-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={asset.trend.map((val, idx) => ({ idx, val }))}>
                           <Line type="monotone" dataKey="val" stroke={asset.change > 0 ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-[#222]">
                     <span className="text-xs text-gray-500 font-medium">${asset.price.toLocaleString()}</span>
                     <div className="flex items-center gap-1">
                        <div className="h-1.5 w-12 bg-[#222] rounded-full overflow-hidden">
                           <div className="h-full bg-orange-500" style={{width: `${asset.vol}%`}}></div>
                        </div>
                     </div>
                  </div>
               </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl relative z-20">
          <h3 className="text-lg font-bold text-white mb-4">Win/Loss Ratio</h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={winLossData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {winLossData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-bold text-white">68%</span><span className="text-xs text-gray-500 uppercase tracking-wider">Win Rate</span></div>
          </div>
        </div>

        <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl relative z-20">
          <h3 className="text-lg font-bold text-white mb-4">Long vs Short PnL</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={longShortData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '8px' }} cursor={{fill: '#2a2a2a'}} />
                <ReferenceLine y={0} stroke="#444" />
                <Bar dataKey="pnl" fill="#f97316" radius={[4, 4, 0, 0]}>
                  {longShortData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? '#22c55e' : '#ef4444'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#161616]/60 backdrop-blur-md rounded-3xl p-6 border border-[#222] shadow-xl relative z-20">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-white">PnL by Asset</h3>
             <button 
                onClick={() => setPnlSortOrder(prev => prev === 'highToLow' ? 'lowToHigh' : 'highToLow')}
                className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white transition-colors"
                title={pnlSortOrder === 'highToLow' ? "Sort Lowest to Highest" : "Sort Highest to Lowest"}
             >
                <ArrowUpDown className="w-4 h-4" />
             </button>
          </div>
          <div className="space-y-4">
            {sortedAssets.map((asset, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#252525] border border-[#333] flex items-center justify-center text-xs font-bold text-gray-400">{asset.name.substring(0, 1)}</div>
                  <span className="text-sm font-medium text-white">{asset.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${asset.value > 0 ? 'text-green-500' : 'text-red-500'}`}>{asset.value > 0 ? '+' : ''}{asset.value.toLocaleString()}</div>
                  <div className="w-24 h-1 bg-[#2a2a2a] rounded-full mt-1 ml-auto overflow-hidden"><div className={`h-full rounded-full ${asset.value > 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(asset.value) / 1000, 100)}%` }}></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center bg-[#161616]/60 backdrop-blur-md rounded-2xl p-6 border border-[#2a2a2a] shadow-xl mt-2">
         <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold text-white mb-1">Methodology & Metric Calculations</h3>
            <p className="text-gray-500 text-sm">Transparent breakdown of how we calculate PnL, Win Rate, and Risk Metrics.</p>
         </div>
         <a 
            href="" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#222] hover:bg-[#333] border border-[#333] hover:border-orange-500/30 text-white rounded-xl text-sm font-bold transition-all group"
         >
            View Documentation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-orange-500" />
         </a>
      </div>
    </div>
  );
};

const PerformanceCalendarView = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState({ month: 1, year: 2026 }); // Feb 2026
  const [calendarGrid, setCalendarGrid] = useState([]);
  
  // Modal Local State
  const [logType, setLogType] = useState('profit');
  const [logAmount, setLogAmount] = useState('');
  const [logNotes, setLogNotes] = useState('');

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Mon start (0=Mon, 6=Sun)
  };

  const generateDataForMonth = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const startDay = getFirstDayOfMonth(month, year);
    const weeks = [];
    let currentWeek = Array(startDay).fill(null); 

    let allowData = false;
    let dayLimit = 31;

    if (year === 2026) {
        if (month === 0) { // Jan
            allowData = true;
            dayLimit = 31;
        } else if (month === 1) { // Feb
            allowData = true;
            dayLimit = 15;
        } else {
            allowData = false;
        }
    }

    for (let i = 1; i <= daysInMonth; i++) {
      let dayData = { day: i, pnl: 0, trades: 0, active: false };

      if (allowData && i <= dayLimit) {
         const hasTrade = Math.random() > 0.3;
         if (hasTrade) {
           const isProfit = Math.random() > 0.45;
           dayData.pnl = isProfit ? Math.floor(Math.random() * 800) + 50 : Math.floor(Math.random() * -600) - 50;
           dayData.trades = Math.floor(Math.random() * 5) + 1;
           dayData.active = true;
         }
      }

      currentWeek.push(dayData);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while(currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }
    return weeks;
  };

  // Generate initial data when month changes
  useEffect(() => {
    const data = generateDataForMonth(currentMonth.month, currentMonth.year);
    setCalendarGrid(data);
  }, [currentMonth]);

  // Recalculate Weekly Stats based on current calendarGrid state
  const weeklyStats = useMemo(() => {
    return calendarGrid.map(week => {
      const weekPnl = week.reduce((sum, day) => sum + (day ? day.pnl : 0), 0);
      const weekTrades = week.reduce((sum, day) => sum + (day ? day.trades : 0), 0);
      return { pnl: weekPnl, trades: weekTrades };
    });
  }, [calendarGrid]);

  const handlePrevMonth = () => {
      setCurrentMonth(prev => {
          let newMonth = prev.month - 1;
          let newYear = prev.year;
          if (newMonth < 0) { newMonth = 11; newYear -= 1; }
          return { month: newMonth, year: newYear };
      });
  };

  const handleNextMonth = () => {
      setCurrentMonth(prev => {
          let newMonth = prev.month + 1;
          let newYear = prev.year;
          if (newMonth > 11) { newMonth = 0; newYear += 1; }
          return { month: newMonth, year: newYear };
      });
  };

  const handleSaveDayLog = () => {
    if (!selectedDay || !logAmount) return;

    const amount = parseFloat(logAmount);
    const finalAmount = logType === 'profit' ? Math.abs(amount) : -Math.abs(amount);

    // Deep copy grid to update state
    const newGrid = calendarGrid.map(week => week.map(day => {
        if (day && day.day === selectedDay.day) {
            return {
                ...day,
                pnl: day.pnl + finalAmount, // Add to existing or set new
                trades: day.trades + 1,
                active: true,
                notes: logNotes // Ideally stored in a real object, simplifying here
            };
        }
        return day;
    }));

    setCalendarGrid(newGrid);
    setSelectedDay(null);
    setLogAmount('');
    setLogNotes('');
  };

  const openDayModal = (day) => {
      setSelectedDay(day);
      setLogAmount('');
      setLogNotes('');
      setLogType('profit');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      {/* Calendar Header */}
      <div className="bg-[#161616]/60 backdrop-blur-md rounded-2xl p-6 border border-[#2a2a2a] flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white mb-1 w-48">{monthNames[currentMonth.month]} {currentMonth.year}</h2>
            <div className="flex bg-[#0f0f0f] rounded-lg border border-[#333]">
                <button onClick={handlePrevMonth} className="p-2 hover:text-white text-gray-500 transition-colors border-r border-[#333]"><ChevronLeft className="w-4 h-4"/></button>
                <button onClick={handleNextMonth} className="p-2 hover:text-white text-gray-500 transition-colors"><ChevronRight className="w-4 h-4"/></button>
            </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              <span className="text-gray-400">Profit</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <span className="text-gray-400">Loss</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
        {/* Main Calendar Grid */}
        <div className="lg:col-span-7 bg-[#161616]/60 backdrop-blur-md rounded-3xl border border-[#2a2a2a] p-6 shadow-xl">
           <div className="grid grid-cols-7 gap-4 mb-4 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                 <div key={day} className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{day}</div>
              ))}
           </div>
           
           <div className="space-y-4">
              {calendarGrid.map((week, weekIdx) => (
                 <div key={weekIdx} className="grid grid-cols-7 gap-4">
                    {week.map((day, dayIdx) => (
                       <div key={dayIdx} className="h-full">
                          {day ? (
                             <div 
                                onClick={() => openDayModal(day)}
                                className={`h-24 rounded-xl border border-[#333] p-3 flex flex-col justify-between cursor-pointer transition-all hover:scale-105 ${
                                   day.active 
                                     ? day.pnl > 0 
                                        ? 'bg-green-500/10 hover:bg-green-500/20 border-green-500/30' 
                                        : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30'
                                     : 'bg-[#1a1a1a] hover:bg-[#222]'
                                }`}
                             >
                                <span className={`text-xs font-bold ${day.active ? 'text-white' : 'text-gray-600'}`}>{day.day}</span>
                                {day.active && (
                                   <div className="text-center">
                                      <div className={`font-bold text-sm ${day.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                         {day.pnl > 0 ? '+' : ''}${Math.abs(day.pnl)}
                                      </div>
                                      <div className="text-[10px] text-gray-500 mt-1">{day.trades} trade{day.trades !== 1 ? 's' : ''}</div>
                                   </div>
                                )}
                             </div>
                          ) : (
                             <div className="h-24"></div> 
                          )}
                       </div>
                    ))}
                 </div>
              ))}
           </div>
        </div>

        {/* Weekly Stats Column */}
        <div className="lg:col-span-1 space-y-4 pt-10 lg:pt-10">
           {weeklyStats.map((week, idx) => (
              <div key={idx} className="h-24 flex flex-col justify-center items-center bg-[#111] rounded-xl border border-[#2a2a2a] p-2 shadow-lg">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Week {idx + 1}</span>
                 <div className={`text-lg font-bold ${week.pnl > 0 ? 'text-green-500' : week.pnl < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {week.pnl > 0 ? '+' : ''}${Math.abs(week.pnl)}
                 </div>
                 <div className="text-xs text-gray-600">{week.trades} trade{week.trades !== 1 ? 's' : ''}</div>
              </div>
           ))}
        </div>
      </div>

      {/* Daily Detail Modal */}
      {selectedDay && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#161616] border border-[#333] p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
               <button 
                 onClick={() => setSelectedDay(null)}
                 className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
               
               <div className="mb-6">
                  <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">{monthNames[currentMonth.month]} {selectedDay.day}, {currentMonth.year}</span>
                  <div className="flex items-baseline gap-3 mt-1">
                     <h2 className={`text-3xl font-bold ${selectedDay.pnl > 0 ? 'text-green-500' : selectedDay.pnl < 0 ? 'text-red-500' : 'text-white'}`}>
                        {selectedDay.pnl > 0 ? '+' : ''}${Math.abs(selectedDay.pnl)}
                     </h2>
                     <span className="text-gray-400 text-sm">Net PnL</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Log Session</label>
                     <div className="flex gap-2 mb-2">
                        <div className="flex-1 bg-[#0f0f0f] border border-[#333] rounded-lg p-1 flex">
                            <button 
                                onClick={() => setLogType('profit')}
                                className={`flex-1 text-xs font-bold rounded py-1 transition-all ${logType === 'profit' ? 'bg-green-500/20 text-green-500 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                            >Profit</button>
                            <button 
                                onClick={() => setLogType('loss')}
                                className={`flex-1 text-xs font-bold rounded py-1 transition-all ${logType === 'loss' ? 'bg-red-500/20 text-red-500 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                            >Loss</button>
                        </div>
                        <input 
                            type="number" 
                            value={logAmount}
                            onChange={(e) => setLogAmount(e.target.value)}
                            placeholder="Amount ($)" 
                            className="w-24 bg-[#0f0f0f] border border-[#333] rounded-lg px-3 text-white text-sm outline-none focus:border-orange-500" 
                        />
                     </div>
                     <textarea 
                       value={logNotes}
                       onChange={(e) => setLogNotes(e.target.value)}
                       className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:border-orange-500 outline-none resize-none min-h-[80px]"
                       placeholder="Journal your emotions and strategy..."
                     ></textarea>
                  </div>
                  
                  <button onClick={handleSaveDayLog} className="w-full py-3 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold transition-colors">
                     Save & Close
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeItem, setActiveItem] = useState('overview');
  const [startTransition, setStartTransition] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected'); // 'disconnected', 'demo', 'connected'
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleStartExit = () => {
    setStartTransition(true);
  };

  const handleExitComplete = () => {
    setShowLanding(false);
    // Automatically show wallet modal if not connected/demo on first entry
    if (connectionState === 'disconnected') {
       setShowWalletModal(true);
    }
  };

  const handleConnect = (walletType) => {
     setConnectionState('connected');
     setShowWalletModal(false);
  };

  const handleDemo = () => {
     setConnectionState('demo');
     setShowWalletModal(false);
  };

  const handleDisconnect = () => {
     setConnectionState('disconnected');
     setShowWalletModal(true); // Re-prompt
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen overflow-hidden relative">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      
      {showLanding && <LandingPage onStartExit={handleStartExit} onExitComplete={handleExitComplete} />}

      <WalletConnectModal 
         isOpen={showWalletModal} 
         onClose={() => setShowWalletModal(false)} // Optional closing logic if needed
         onConnect={handleConnect}
         onDemo={handleDemo}
      />

      {/* Main Dashboard - Rendered but manipulated for transition effect */}
      <div 
        className={`flex min-h-screen font-sans selection:bg-orange-500/30 relative transition-all duration-1000 ease-in-out transform ${!startTransition && showLanding ? 'scale-95 opacity-0 blur-sm pointer-events-none' : 'scale-100 opacity-100 blur-0'} ${connectionState === 'disconnected' && !showLanding ? 'blur-sm pointer-events-none brightness-50' : ''}`}
      >
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-blob"></div>
           <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
           <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className={`flex-1 p-4 lg:p-6 transition-all duration-300 relative z-10 overflow-y-auto h-screen ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <Header 
             title={activeItem === 'overview' ? 'Dashboard' : activeItem === 'journal' ? 'Trading Journal' : activeItem === 'calendar' ? 'Performance Calendar' : 'Deep Analytics'} 
             subtitle={activeItem === 'overview' ? 'Portfolio Overview' : activeItem === 'journal' ? 'Track & Analyze your execution' : activeItem === 'calendar' ? 'Monthly PnL Visualization' : 'Advanced Performance Metrics'}
             connectionState={connectionState}
             onConnectClick={() => setShowWalletModal(true)}
             onDisconnect={handleDisconnect}
          />

          <div className="max-w-7xl mx-auto pb-10">
            {activeItem === 'overview' && <DashboardView />}
            {activeItem === 'journal' && <JournalView />}
            {activeItem === 'calendar' && <PerformanceCalendarView />}
            {activeItem === 'analytics' && <AnalyticsView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;