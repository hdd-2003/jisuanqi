import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Skull, 
  Frown, 
  Construction, 
  Bomb, 
  Ghost, 
  Clock, 
  RefreshCcw, 
  Zap,
  TrendingDown,
  Coins,
  HeartPulse,
  Trash2,
  ExternalLink,
  Award,
  Plus,
  RotateCcw,
  Crown,
  Activity,
  AlertCircle,
  Smile,
  Leaf,
  DollarSign,
  X,
  FileText,
  TrendingUp,
  Music,
  Pause
} from 'lucide-react';

const BITTER_QUOTES = [
  "这哪是买东西啊，这是在割我腰子啊！",
  "老板：你再努力点，我的劳斯莱斯就能换新款了。",
  "我以为我在赚钱，后来发现我只是在给物业和房东打工。",
  "别买了，再买你连呼吸都要收手续费了。",
  "现在的我，比四大皆空还要空，我的钱包甚至有回音。",
  "摸鱼一小时，相当于白嫖老板 50 块，这才是真正的赚钱！",
  "上班的心情比上坟还沉重，但下班的速度比闪电还快。",
  "如果努力有用的话，生产队的驴早就当上总裁了。",
  "我的命，在老板眼里大概也就是一堆耗材吧。",
  "这个世界如果没有班上，我该有多么快乐啊！",
  "你以为在消费？不，你是在透支余生的自由时间。"
];

export default function App() {
  const [amount, setAmount] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('8000');
  const [workingDays, setWorkingDays] = useState('22');
  const [quote, setQuote] = useState(BITTER_QUOTES[0]);
  const [isShaking, setIsShaking] = useState(false); 
  const [isTotalShaking, setIsTotalShaking] = useState(false); 
  const [displayValue, setDisplayValue] = useState(0); 
  const [particles, setParticles] = useState([]); 
  const [activeModal, setActiveModal] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);
  
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const getSalaryComment = (salary) => {
    const s = parseFloat(salary);
    if (isNaN(s) || s < 0) return { text: "薪资被黑洞吞噬了？", color: "text-gray-400" };
    if (s === 0) return { text: "老板都要感动哭了！义务劳动？", color: "text-red-600 font-black" };
    if (s <= 2000) return { text: "用爱发电，心疼你。", color: "text-orange-600 font-bold" };
    if (s <= 5000) return { text: "生存模式，砖头烫手。", color: "text-amber-600 font-bold" };
    if (s <= 10000) return { text: "标准牛马，吃饱饭了。", color: "text-blue-600 font-bold" };
    if (s <= 20000) return { text: "高级牛马！帮老板换别墅。", color: "text-purple-600 font-bold" };
    if (s <= 50000) return { text: "金牌工具人！老板财神爷。", color: "text-indigo-600 font-bold" };
    return { text: "你是来体验生活的吧？", color: "text-emerald-600 font-black" };
  };

  const salaryComment = useMemo(() => getSalaryComment(monthlySalary), [monthlySalary]);

  const calculateLifePrice = (price, salary, days) => {
    const s = parseFloat(salary) || 0;
    const d = parseFloat(days) || 22;
    const p = parseFloat(price) || 0;

    if (s <= 0) return { value: 0, unit: '永远', sub: '义务劳动警告', rawDays: 999 };
    if (d <= 0) return { value: 0, unit: '无解', sub: '做梦吗？', rawDays: 0 };
    
    const dailyPay = s / d;
    const hourlyPay = dailyPay / 8;
    const minutePay = hourlyPay / 60;
    const daysNeeded = p / dailyPay;

    if (p >= dailyPay) {
      return { value: daysNeeded.toFixed(1), unit: '天命', sub: `坐牢 ${daysNeeded.toFixed(1)} 天`, rawDays: daysNeeded, percent: (daysNeeded / 30) * 100 };
    } else if (p >= hourlyPay) {
      const hours = p / hourlyPay;
      return { value: hours.toFixed(1), unit: '工时', sub: `敲键盘 ${hours.toFixed(1)} 小时`, rawDays: daysNeeded, percent: (hours / 8) * 100 };
    } else {
      const mins = Math.ceil(p / minutePay);
      return { value: mins, unit: '分钟', sub: `消耗自由时间 ${mins} 分钟`, rawDays: daysNeeded, percent: (mins / 60) * 100 };
    }
  };

  const stats = useMemo(() => calculateLifePrice(amount, monthlySalary, workingDays), [amount, monthlySalary, workingDays]);

  useEffect(() => {
    const target = parseFloat(stats.value) || 0;
    const start = displayValue;
    const duration = 50; 
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start + (target - start) * progress;
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [stats.value, displayValue]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    if (isPlaying) {
      audioRef.current.play().catch(err => console.log('音频播放被阻止:', err));
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying]);

  const totalMisery = useMemo(() => {
    const totalDays = items.reduce((acc, item) => acc + calculateLifePrice(item.price, monthlySalary, workingDays).rawDays, 0);
    if (totalDays === 0) return "0 天";
    if (totalDays > 365) return `${(totalDays / 365).toFixed(1)} 年`;
    if (totalDays > 30) return `${(totalDays / 30).toFixed(1)} 个月`;
    return `${totalDays.toFixed(1)} 天`;
  }, [items, monthlySalary, workingDays]);

  // 离职信内容生成
  const resignationLetter = useMemo(() => {
    const s = parseFloat(monthlySalary) || 0;
    if (s === 0) return "尊敬的老板：鉴于我目前的受难等级为‘纯粹奉献’，我发现我更适合去当志愿者而不是受罪。此致，不敬。";
    if (s < 5000) return "尊敬的老板：您的这点工资，我连维持基本生命体征都很难，更别提微笑服务了。我决定带上我仅剩的一点脊柱离开。毁灭吧，赶紧的。";
    if (s < 15000) return "尊敬的老板：我发现我的财富自由梦想和帮您实现财富自由的梦想产生了一点点物理冲突。为了拯救我的心脏，我选择先走一步。";
    return "尊敬的老板：世界那么大，我想带上我的存款去看看。如果我看累了，我会回来看看您换了什么新车。祝好。";
  }, [monthlySalary]);

  // 职业身价计算
  const careerValuation = useMemo(() => {
    const s = parseFloat(monthlySalary) || 0;
    const total = s * 12 * 30; // 假设 30 年
    return {
      rmb: total.toLocaleString(), // 修改 total 为 rmb，与 JSX 保持一致
      total: total.toLocaleString(),
      rice: Math.floor(total / 25).toLocaleString(), // 猪脚饭 25
      huaxizi: Math.floor(total / 79).toLocaleString() // 花西子 79
    };
  }, [monthlySalary]);

  // 扎心/添加触发（红色/金色粒子）
  const triggerStab = (type = 'stab') => {
    setIsShaking(true);
    const config = {
      stab: { icons: ['💀', '💸'], color: 'text-red-600' },
      create: { icons: ['💰', '￥', '✨'], color: 'text-yellow-500' }
    }[type];

    const newParticles = Array.from({ length: 8 }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      size: Math.random() * 20 + 10,
      icon: config.icons[Math.floor(Math.random() * config.icons.length)],
      color: config.color
    }));

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setIsShaking(false), 500);
    
    const particleIds = new Set(newParticles.map(p => p.id));
    setTimeout(() => setParticles(prev => prev.filter(p => !particleIds.has(p.id))), 1500);
    
    // 总计区域也晃一下
    setIsTotalShaking(true);
    setTimeout(() => setIsTotalShaking(false), 600);
  };

  // 解脱触发（绿色粒子）
  const triggerRelease = () => {
    const newParticles = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      size: Math.random() * 15 + 15,
      icon: Math.random() > 0.5 ? '🍃' : '＋命',
      color: 'text-green-500'
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    const particleIds = new Set(newParticles.map(p => p.id));
    setTimeout(() => setParticles(prev => prev.filter(p => !particleIds.has(p.id))), 1500);
    
    setIsTotalShaking(true);
    setTimeout(() => setIsTotalShaking(false), 600);
  };

  const handleRandomQuote = () => {
    let nextQuote;
    do {
      nextQuote = BITTER_QUOTES[Math.floor(Math.random() * BITTER_QUOTES.length)];
    } while (nextQuote === quote);
    setQuote(nextQuote);
    triggerStab('stab');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      price: parseFloat(newItemPrice)
    };
    setItems([newItem, ...items]);
    setNewItemName('');
    setNewItemPrice('');
    triggerStab('create'); // 触发“创造欲望”的金色动效
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    triggerRelease(); 
  };

  const handleNumberInput = (setter) => (e) => {
    const val = e.target.value;
    if (val === '') { setter(''); return; }
    const num = parseFloat(val);
    if (num < 0) return;
    setter(val);
  };

  return (
    <div className="min-h-screen bg-yellow-400 text-black font-mono p-4 flex flex-col items-center select-none overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full bg-black text-yellow-400 py-1 z-50 overflow-hidden whitespace-nowrap border-b-2 border-black text-sm font-bold">
        <div className="animate-marquee inline-block italic">
          ⚠️ 警告：正在进入打工人受难区 ⚠️ 你的每一分钱都是命换来的 ⚠️
        </div>
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed top-16 right-4 z-40 bg-black text-yellow-400 p-3 border-4 border-black font-black hover:bg-yellow-400 hover:text-black active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] group"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 group-active:rotate-180 transition-transform duration-300" />
        ) : (
          <Music className="w-6 h-6 group-active:rotate-180 transition-transform duration-300" />
        )}
      </button>

      <header className="max-w-2xl w-full text-center mb-4 mt-10">
        <div className="relative inline-block group">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter transform group-hover:scale-105 transition-transform -rotate-1 bg-black text-yellow-400 px-3 py-1 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
            命苦换算器
          </h1>
          <Skull className="absolute -top-4 -right-4 w-8 h-8 text-red-600 animate-bounce" />
        </div>
      </header>

      <main className="max-w-2xl w-full space-y-4 relative">
        {/* 飘浮粒子层 */}
        {particles.map(p => (
          <div key={p.id} className={`absolute z-[100] animate-float-up pointer-events-none font-black ${p.color}`} style={{ left: `${p.left}%`, fontSize: `${p.size}px`, bottom: '40%' }}>
            {p.icon}
          </div>
        ))}

        {/* 设置区域 */}
        <div className="bg-white border-2 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative transition-all">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                <Coins className="w-3 h-3 text-green-600 animate-spin-slow" /> 税后月薪
              </label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-black text-xs">￥</span>
                <input 
                  type="number" value={monthlySalary} onChange={handleNumberInput(setMonthlySalary)}
                  onWheel={(e) => e.target.blur()} min="0"
                  className="w-full pl-6 pr-2 py-1 bg-yellow-50 border-2 border-black outline-none font-black text-lg focus:bg-white transition-all"
                />
              </div>
              <div className={`text-[9px] h-3 leading-none truncate ${salaryComment.color}`}>
                {salaryComment.text}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" /> 月工天
              </label>
              <input 
                type="number" value={workingDays} onChange={handleNumberInput(setWorkingDays)}
                onWheel={(e) => e.target.blur()} min="1"
                className="w-full px-2 py-1 bg-yellow-50 border-2 border-black outline-none font-black text-lg focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* 核心计算区 */}
        <div className={`bg-red-600 border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white relative transition-all ${isShaking ? 'animate-heart-stab' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-yellow-300">
                <Bomb className={`w-5 h-5 ${amount ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-black uppercase tracking-widest">欲购金额攻击</span>
              </div>
              <div className="relative inline-block">
                 <input
                  type="number" placeholder="输入 RMB"
                  className="w-48 bg-black/30 border-b-4 border-white outline-none text-4xl font-black text-white px-2 py-1 placeholder:text-white/20 focus:bg-black/50 transition-colors"
                  value={amount} onChange={handleNumberInput(setAmount)} onWheel={(e) => e.target.blur()} min="0"
                />
              </div>
            </div>
            {amount && (
              <button onClick={() => setAmount('')} className="bg-black text-white px-2 py-1 border-2 border-black hover:bg-white hover:text-black active:translate-y-1 transition-all flex items-center gap-1 text-[10px] font-black">
                <Trash2 className="w-3 h-3" /> 撤退
              </button>
            )}
          </div>

          <div className={`bg-black border-4 border-white p-4 relative overflow-hidden transition-all duration-75 ${isShaking ? 'bg-red-950' : ''}`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-green-500/20 animate-scanline z-0 pointer-events-none"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className={`w-4 h-4 text-green-500 ${amount ? 'animate-ping' : ''}`} />
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">LIFE LOSS MONITOR v2.0</span>
              </div>
              
              <div className="flex items-baseline gap-2 relative">
                <span className={`text-7xl font-black italic drop-shadow-[3px_3px_0px_rgba(220,38,38,1)] text-yellow-400 tabular-nums`}>
                  {amount !== '' ? displayValue.toFixed(1) : '0.0'}
                </span>
                <span className="text-2xl font-black text-white animate-pulse">{stats.unit}</span>
              </div>

              <div className="w-full max-w-[240px] h-3 bg-gray-900 mt-4 border border-white/20 relative overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-500 ease-out relative shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
                  style={{ width: `${Math.min(stats.percent || 0, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                </div>
              </div>

              <div className="mt-4 px-3 py-1 bg-white text-red-600 text-[10px] font-black italic uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                {amount !== '' ? stats.sub : "老板正在后台查看你的屏幕"}
              </div>
            </div>
          </div>

          <button
            onClick={handleRandomQuote}
            className="w-full mt-4 py-3 bg-white text-black border-4 border-black font-black text-xl hover:bg-yellow-400 active:bg-yellow-300 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-2 group"
          >
            <RefreshCcw className="w-5 h-5 group-active:rotate-180 transition-transform duration-300" />
            <span className="skew-x-[-10deg]">点击补刀</span>
          </button>
        </div>

        {/* 咆哮气泡 */}
        <div className={`relative mt-2 ${isShaking ? 'animate-wiggle' : ''}`}>
          <div className="absolute -top-3 left-12 w-6 h-6 bg-white border-l-2 border-t-2 border-black rotate-45 z-0 transition-colors"></div>
          
          <div className="bg-white border-4 border-black p-5 rounded-2xl shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] relative z-10 flex items-center gap-4 overflow-hidden">
            <div className={`absolute inset-0 bg-red-600/10 transition-opacity duration-300 pointer-events-none ${isShaking ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className="bg-red-600 text-white font-black px-2 py-1 text-xs -rotate-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 hidden md:block">
              工位咆哮
            </div>
            
            <p className="text-lg md:text-2xl font-black italic leading-tight flex-1 relative min-h-[1.5em] flex items-center justify-center text-center">
              “{quote}”
              <span className="w-1 h-6 bg-black ml-1 animate-blink"></span>
            </p>

            <div className="shrink-0 bg-yellow-400 rounded-full border-4 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:rotate-12 transition-transform">
              <Frown className={`w-8 h-8 ${isShaking ? 'animate-bounce' : ''}`} />
            </div>
          </div>
        </div>

        {/* 价目表 */}
        <div className="bg-white border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-[1.01]">
          <div className="p-2 bg-black text-white flex justify-between items-center">
            <h3 className="font-black italic flex items-center gap-2 text-sm uppercase">
              <TrendingDown className="w-4 h-4 text-red-500 animate-pulse" />
              牛马欲望清单
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black bg-red-600 px-1 italic transition-all ${isTotalShaking ? 'scale-125 bg-red-400 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}`}>
                  累计折寿: {totalMisery}
                </span>
              </div>
              <button onClick={() => setItems([])} className="hover:text-yellow-400 active:rotate-180 transition-all">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleAddItem} className="p-2 bg-yellow-100 border-b-2 border-black flex gap-2 relative z-20">
            <input 
              type="text" placeholder="想要的东西..." value={newItemName} onChange={e => setNewItemName(e.target.value)}
              className="flex-1 px-2 py-1 border-2 border-black bg-white text-xs font-black outline-none focus:bg-yellow-50 focus:border-red-600 transition-colors"
            />
            <input 
              type="number" placeholder="价格" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)}
              className="w-20 px-2 py-1 border-2 border-black bg-white text-xs font-black outline-none focus:bg-yellow-50 focus:border-red-600 transition-colors"
            />
            <button 
              type="submit" 
              className="bg-black text-white px-3 border-2 border-black hover:bg-green-600 active:translate-x-1 active:translate-y-1 transition-all group/btn"
            >
              <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
            </button>
          </form>

          <div className="divide-y-2 divide-black max-h-56 overflow-y-auto custom-scrollbar bg-gray-50">
            {items.length > 0 ? [...items].sort((a, b) => b.price - a.price).map((item, idx) => {
               const itemStats = calculateLifePrice(item.price, monthlySalary, workingDays);
               return (
                <div 
                  key={item.id} 
                  className="p-2 flex justify-between items-center hover:bg-red-50 transition-all cursor-pointer group active:bg-yellow-100 animate-slide-down"
                  onClick={() => {
                    setAmount(item.price.toString());
                    triggerStab('stab');
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg font-black opacity-10 group-hover:opacity-100 transition-opacity">#{idx + 1}</span>
                    <div className="font-black text-sm group-hover:text-red-600 transition-colors">{item.name} <span className="text-[9px] text-gray-400 font-normal ml-1">￥{item.price}</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xl font-black text-red-600 italic">-{itemStats.value}</span>
                      <span className="text-[8px] font-black uppercase bg-black text-white px-1 ml-1">{itemStats.unit}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                      className="text-gray-300 hover:text-green-600 transform hover:scale-125 transition-all p-1"
                      title="删除即解脱"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
               );
            }) : (
              <div className="p-8 flex flex-col items-center justify-center text-gray-400 space-y-3 bg-gray-50/50 italic animate-fade-in">
                <Smile className="w-12 h-12 stroke-[1.5px]" />
                <div className="text-center">
                  <p className="text-sm font-black text-gray-500">四大皆空，老板拿你没辙</p>
                  <p className="text-[10px] mt-1 tracking-tighter uppercase font-bold">无欲则刚 · 建议下班</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-6 text-center space-y-2 pb-6 w-full scale-90">
        <div className="flex justify-center gap-3">
          <button 
            onClick={() => setActiveModal('resignation')}
            className="bg-black text-yellow-400 px-5 py-2 font-black skew-x-12 text-sm border border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-1 transition-all flex items-center gap-2 active:translate-y-0.5"
          >
            <Zap className="w-4 h-4" /> 离职申请书
          </button>
          <button 
            onClick={() => setActiveModal('valuation')}
            className="bg-black text-yellow-400 px-5 py-2 font-black -skew-x-12 text-sm border border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-1 transition-all flex items-center gap-2 active:translate-y-0.5"
          >
            <Crown className="w-5 h-5" /> 命值几毛钱?
          </button>
        </div>
        <p className="text-[10px] font-black uppercase opacity-40">© 2026 不想搬砖委员会 · 每一笔消费都是在透支生命</p>
      </footer>

      {/* 弹窗层 */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in cursor-pointer"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white border-4 border-black p-6 w-full max-w-sm relative shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] animate-pop-in cursor-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute -top-3 -right-3 bg-black text-white p-1 rounded-full border-2 border-white hover:bg-red-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'resignation' && (
              <div className="space-y-4">
                <div className="bg-red-600 text-white p-1 text-center font-black uppercase border-2 border-black skew-x-[-10deg]">
                  发疯文学离职信
                </div>
                <div className="bg-yellow-50 p-4 border-2 border-dashed border-black font-black italic text-xs leading-relaxed">
                  {resignationLetter}
                </div>
                <div className="text-[8px] font-bold opacity-50 text-center uppercase">
                  点击 ESC 或 X 键以回到工位继续受难
                </div>
              </div>
            )}

            {activeModal === 'valuation' && (
              <div className="space-y-4">
                <div className="bg-black text-yellow-400 p-1 text-center font-black uppercase border-2 border-black">
                  职业生涯总估值
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-black pb-1">
                    <span className="text-[10px] font-black opacity-40 uppercase">30年总收益</span>
                    <span className="text-base font-black text-red-600">￥{careerValuation.rmb}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-yellow-400 p-2 text-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-[8px] font-black uppercase">折合猪脚饭</div>
                      <div className="text-lg font-black italic">{careerValuation.rice} 碗</div>
                    </div>
                    <div className="bg-black text-white p-2 text-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-[8px] font-black uppercase">折合花西子</div>
                      <div className="text-lg font-black italic">{careerValuation.huaxizi} 个</div>
                    </div>
                  </div>
                  <p className="text-[8px] font-bold text-center italic mt-4 opacity-70">
                    "拼搏一生，只为这几万个眉笔。"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        @keyframes heart-stab { 
          0%, 100% { transform: translate(0, 0) scale(1); } 
          10% { transform: translate(-2px, -2px) scale(1.01); } 
          30% { transform: translate(2px, 2px) scale(0.99); } 
          50% { transform: translate(-2px, 2px) scale(1.01); } 
          70% { transform: translate(2px, -2px) scale(0.99); } 
        }
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes float-up { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-100px) rotate(360deg); opacity: 0; } }
        @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-1deg); } 75% { transform: rotate(1deg); } }
        @keyframes slide-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes pop-in { 0% { opacity: 0; transform: scale(0.8) rotate(-5deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .animate-marquee { animation: marquee 15s linear infinite; }
        .animate-heart-stab { animation: heart-stab 0.2s ease-in-out infinite; }
        .animate-scanline { animation: scanline 4s linear infinite; }
        .animate-shine { animation: shine 2s linear infinite; }
        .animate-blink { animation: blink 1s infinite; }
        .animate-float-up { animation: float-up 1.5s cubic-bezier(0.1, 0.5, 0.5, 1) forwards; }
        .animate-wiggle { animation: wiggle 0.2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-slide-down { animation: slide-down 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 10px; }

        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}} />
    </div>
  );
}