import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1 style={{fontSize:22, marginBottom:8}}>منصة الأسهم</h1>
        <p>مرحباً — استخدم شريط التنقل للوصول للصفحات. جرب إضافة رمز في قائمة المتابعة أو افتح صفحة سهم عبر المسار /stock/رمز</p>
        <p style={{marginTop:8, fontSize:13, color:'#475569'}}>مثال: <code>/stock/AAPL</code></p>
      </div>
    </div>
  );
}

function Analysis() {
  return (
    <div className="container">
      <div className="card">
        <h2>التحليل</h2>
        <p>صفحة التحليل — ستحوي مخططات ومؤشرات لاحقاً.</p>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="container">
      <div className="card">
        <h2>الإعدادات</h2>
        <p>إعدادات المستخدم والمنصة.</p>
      </div>
    </div>
  );
}

function StockDetails() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=demo`);
        const json = await res.json();
        setData(json);

        // mock series for chart
        const mock = [];
        const base = json.c || 100;
        for (let i=0;i<20;i++){
          mock.push({ time: i, price: Number((base + Math.sin(i/3)*2 + (Math.random()-0.5)).toFixed(2)) });
        }
        setSeries(mock);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchData();
  }, [symbol]);

  if (loading) return <div className="container"><div className="card">جاري تحميل البيانات...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <h2>تفاصيل السهم: {symbol}</h2>
        {data && data.c ? (
          <div>
            <p>السعر الحالي: {data.c}</p>
            <p style={{color:'#64748b'}}>أعلى: {data.h} — أدنى: {data.l} — افتتاح: {data.o}</p>
            <div style={{height:300, marginTop:10}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="time" />
                  <YAxis domain={['dataMin - 5','dataMax + 5']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#0f172a" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p>لا توجد بيانات للسهم.</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{padding:18}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
          <div style={{fontWeight:700}}>منصة الأسهم</div>
          <nav style={{display:'flex', gap:12}}>
            <Link to="/">الرئيسية</Link>
            <Link to="/analysis">تحليل</Link>
            <Link to="/settings">إعدادات</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/analysis" element={<Analysis/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/stock/:symbol" element={<StockDetails/>} />
        </Routes>

        <footer style={{textAlign:'center', marginTop:20, fontSize:12, color:'#64748b'}}>نسخة تجريبية — Finnhub demo token</footer>
      </div>
    </Router>
  );
}
