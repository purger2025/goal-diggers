import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { 
  Menu, Bell, ArrowRightLeft, Download, DollarSign, MessageSquare, 
  Search, X, CheckCircle, Loader, User, Lock, Mail, Settings, 
  Zap, Home, PieChart, Send, CreditCard, Eye, EyeOff, Copy
} from 'lucide-react'

// --- THEME ENGINE ---
const THEMES = {
  monochrome: {
    bg: '#0f172a', card: '#1e293b', text: 'white', accent: '#3b82f6', 
    gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
    btn: '#3b82f6', cardGradient: 'linear-gradient(135deg, #1e293b, #0f172a)'
  },
  nature: {
    bg: '#14532d', card: '#166534', text: '#f0fdf4', accent: '#4ade80',
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)',
    btn: '#22c55e', cardGradient: 'linear-gradient(135deg, #166534, #14532d)'
  },
  technicolor: {
    bg: '#4c1d95', card: '#6d28d9', text: '#f5f3ff', accent: '#d8b4fe',
    gradient: 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
    btn: '#e879f9', cardGradient: 'linear-gradient(135deg, #db2777, #7c3aed)'
  }
}

export default function App() {
  const [view, setView] = useState('splash') 
  const [dashView, setDashView] = useState('home') // home, analytics, cards, zelle
  const [authMode, setAuthMode] = useState('login') 
  const [theme, setTheme] = useState('monochrome')
  const [overlay, setOverlay] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [showCardNum, setShowCardNum] = useState(false)
  
  // INPUTS
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [amount, setAmount] = useState('')
  const [zelleEmail, setZelleEmail] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setView('auth'), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleAuth = () => {
    setCurrentUser({ name: 'Client Demo', balance: 50000.00, account: '8829 1029 4829' })
    setView('dashboard')
  }

  const t = THEMES[theme]
  const s = {
    container: { minHeight: '100vh', backgroundColor: t.bg, color: t.text, fontFamily: 'sans-serif', paddingBottom: '90px', transition: '0.3s' },
    input: { width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', marginBottom: '12px', fontSize: '16px', outline: 'none' },
    btn: { width: '100%', padding: '16px', backgroundColor: t.btn, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', boxShadow: `0 4px 15px ${t.btn}60` },
    card: { background: t.card, padding: '20px', borderRadius: '20px', marginBottom: '15px' },
    nav: { position: 'fixed', bottom: 0, width: '100%', backgroundColor: t.card, padding: '15px', display: 'flex', justifyContent: 'space-around', borderTop: `1px solid ${t.accent}20`, borderTopLeftRadius: '25px', borderTopRightRadius: '25px', zIndex: 40 },
    navItem: (active) => ({ color: active ? t.accent : 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 'bold' })
  }

  // --- SUB-VIEWS ---

  const HomeView = () => (
    <>
      <div style={{padding: '20px', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Menu onClick={() => setOverlay('settings')} />
        <div style={{width: '35px', height: '35px', backgroundColor: t.btn, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
          {currentUser.name.charAt(0)}
        </div>
      </div>
      
      <div style={{padding: '0 20px'}}>
        <h1 style={{fontSize: '32px', fontWeight: 'bold'}}>Hi, {currentUser.name.split(' ')[0]}</h1>
        <p style={{opacity: 0.6}}>Total Balance</p>
        <h2 style={{fontSize: '48px', fontWeight: 'bold', margin: '10px 0'}}>${currentUser.balance.toLocaleString()}</h2>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', padding: '20px'}}>
        <button style={{...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none'}} onClick={() => setDashView('zelle')}>
          <Zap color={t.accent} /> <span style={{fontSize: '12px', marginTop: '5px'}}>Zelle</span>
        </button>
        <button style={{...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none'}} onClick={() => alert("Transfer")}>
          <ArrowRightLeft color={t.accent} /> <span style={{fontSize: '12px', marginTop: '5px'}}>Transfer</span>
        </button>
        <button style={{...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none'}} onClick={() => alert("Pay")}>
          <DollarSign color={t.accent} /> <span style={{fontSize: '12px', marginTop: '5px'}}>Pay</span>
        </button>
        <button style={{...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none'}} onClick={() => alert("Chat")}>
          <MessageSquare color={t.accent} /> <span style={{fontSize: '12px', marginTop: '5px'}}>Chat</span>
        </button>
      </div>

      <div style={{padding: '0 20px'}}>
        <h3 style={{fontWeight: 'bold', marginBottom: '15px'}}>Recent Activity</h3>
        {[1,2,3].map(i => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: `1px solid ${t.accent}20`}}>
            <div style={{display: 'flex', gap: '15px'}}>
               <div style={{padding: '10px', borderRadius: '12px', backgroundColor: `${t.accent}20`}}><DollarSign size={18} color={t.accent}/></div>
               <div><p style={{fontWeight: 'bold'}}>Payment #{i}92</p><p style={{fontSize: '12px', opacity: 0.5}}>Today</p></div>
            </div>
            <span style={{fontWeight: 'bold'}}>-${(i * 45).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </>
  )

  const CardsView = () => (
    <div style={{padding: '20px', paddingTop: '40px'}}>
      <h2 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '20px'}}>My Cards</h2>
      {/* VIRTUAL CARD */}
      <div style={{height: '200px', background: t.gradient, borderRadius: '20px', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `0 10px 30px ${t.btn}40`, border: `1px solid ${t.accent}50`}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{fontWeight: 'bold', fontSize: '18px'}}>Atlas Infinite</span>
          <span style={{opacity: 0.7}}>DEBIT</span>
        </div>
        <div>
          <p style={{fontSize: '22px', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '10px'}}>
            {showCardNum ? '4829 1029 4829 9921' : '•••• •••• •••• 9921'}
          </p>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <p style={{fontSize: '10px', opacity: 0.7}}>CARD HOLDER</p>
              <p style={{fontWeight: 'bold'}}>{currentUser.name.toUpperCase()}</p>
            </div>
            <div onClick={() => setShowCardNum(!showCardNum)}>
              {showCardNum ? <EyeOff size={20}/> : <Eye size={20}/>}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{marginTop: '30px'}}>
        <h3 style={{fontWeight: 'bold', marginBottom: '15px'}}>Card Settings</h3>
        <div style={s.card}><div style={{display: 'flex', justifyContent: 'space-between'}}><span>Freeze Card</span><Lock size={18}/></div></div>
        <div style={s.card}><div style={{display: 'flex', justifyContent: 'space-between'}}><span>View Pin</span><Eye size={18}/></div></div>
      </div>
    </div>
  )

  const AnalyticsView = () => (
    <div style={{padding: '20px', paddingTop: '40px'}}>
      <h2 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '20px'}}>Analytics</h2>
      <div style={{display: 'flex', justifyContent: 'center', margin: '40px 0'}}>
        {/* CSS PIE CHART */}
        <div style={{
          width: '200px', height: '200px', borderRadius: '50%', 
          background: `conic-gradient(${t.accent} 0% 60%, ${t.btn} 60% 85%, #ffffff 85% 100%)`,
          position: 'relative', boxShadow: `0 0 30px ${t.accent}40`
        }}>
          <div style={{position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: t.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontWeight: 'bold'}}>$4.2k</span>
          </div>
        </div>
      </div>
      <div style={s.card}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}><div style={{width: '10px', height: '10px', background: t.accent, borderRadius: '50%'}}></div><span>Shopping (60%)</span></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}><div style={{width: '10px', height: '10px', background: t.btn, borderRadius: '50%'}}></div><span>Bills (25%)</span></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><div style={{width: '10px', height: '10px', background: 'white', borderRadius: '50%'}}></div><span>Savings (15%)</span></div>
      </div>
    </div>
  )

  const ZelleView = () => (
    <div style={{padding: '20px', paddingTop: '40px'}}>
      <h2 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#a855f7'}}>Zelle®</h2>
      <div style={s.card}>
        <p style={{marginBottom: '10px', opacity: 0.7}}>Send money to friends and family.</p>
        <input placeholder="Email or Mobile Number" style={s.input} value={zelleEmail} onChange={e => setZelleEmail(e.target.value)} />
        <input placeholder="$0.00" type="number" style={s.input} value={amount} onChange={e => setAmount(e.target.value)} />
        <button style={{...s.btn, backgroundColor: '#a855f7'}} onClick={() => {alert("Sent!"); setDashView('home')}}>Send with Zelle</button>
      </div>
    </div>
  )

  // --- MAIN RENDER ---
  if (view === 'splash') return (
    <div style={{height: '100vh', background: t.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', color: t.text}}>
      <h1 style={{fontSize: '80px', fontWeight: '900', animation: 'pulse 2s infinite'}}>AL</h1>
    </div>
  )

  if (view === 'auth') return (
    <div style={{height: '100vh', backgroundImage: 'url("https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000")', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
      <div style={{background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4))', padding: '40px 20px'}}>
        <h1 style={{fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '20px'}}>Financial Peace.</h1>
        <button onClick={handleAuth} style={{...s.btn, backgroundColor: 'white', color: 'black'}}>Log In</button>
      </div>
    </div>
  )

  return (
    <div style={s.container}>
      {/* DYNAMIC CONTENT AREA */}
      {dashView === 'home' && <HomeView />}
      {dashView === 'cards' && <CardsView />}
      {dashView === 'analytics' && <AnalyticsView />}
      {dashView === 'zelle' && <ZelleView />}

      {/* BOTTOM NAVIGATION */}
      <div style={s.nav}>
        <div style={s.navItem(dashView === 'home')} onClick={() => setDashView('home')}>
          <Home size={24} /> Home
        </div>
        <div style={s.navItem(dashView === 'analytics')} onClick={() => setDashView('analytics')}>
          <PieChart size={24} /> Insights
        </div>
        <div style={{backgroundColor: t.btn, padding: '12px', borderRadius: '50%', marginTop: '-40px', boxShadow: `0 8px 20px ${t.btn}60`}} onClick={() => setDashView('zelle')}>
          <Send size={24} color="white" />
        </div>
        <div style={s.navItem(dashView === 'cards')} onClick={() => setDashView('cards')}>
          <CreditCard size={24} /> Cards
        </div>
        <div style={s.navItem(false)} onClick={() => setOverlay('settings')}>
          <Settings size={24} /> Settings
        </div>
      </div>

      {/* SETTINGS OVERLAY */}
      {overlay === 'settings' && (
        <div style={{position: 'fixed', bottom: 0, width: '100%', background: t.card, padding: '30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', zIndex: 50}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h2 style={{fontSize: '20px', fontWeight: 'bold'}}>Themes</h2>
            <X onClick={() => setOverlay(null)} />
          </div>
          <button onClick={() => setTheme('monochrome')} style={{...s.btn, background: '#0f172a', marginBottom: '10px'}}>Monochrome</button>
          <button onClick={() => setTheme('nature')} style={{...s.btn, background: '#14532d', marginBottom: '10px'}}>Nature</button>
          <button onClick={() => setTheme('technicolor')} style={{...s.btn, background: '#4c1d95'}}>TechniColor</button>
        </div>
      )}
    </div>
  )
}
