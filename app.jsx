import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function App(){
  const [tab,setTab]=useState('overview')
  const [leads,setLeads]=useState([
    {id:1,name:"Arun Kumar",phone:"9597122074",status:"Connected",time:"00:45",sales:"Mani",notes:"Interested"},
    {id:2,name:"Priya S",phone:"9876543210",status:"No Answer",time:"00:00",sales:"Mani",notes:"Callback"},
    {id:3,name:"Karthi",phone:"9000000001",status:"New",time:"00:00",sales:"Arun",notes:"New Lead"}
  ])
  const [search,setSearch]=useState('')
  const [nName,setNName]=useState('')
  const [nPhone,setNPhone]=useState('')
  const [nSales,setNSales]=useState('Mani')
  const [phone,setPhone]=useState('9597122074')
  const [calling,setCalling]=useState(false)
  const [sec,setSec]=useState(0)
  const ref=useRef(null)

  useEffect(()=>{
    if(calling) ref.current=setInterval(()=>setSec(s=>s+1),1000)
    else clearInterval(ref.current)
    return()=>clearInterval(ref.current)
  },[calling])

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const addLead = ()=>{
    if(!nName ||!nPhone) return alert("Name & Phone podu da!")
    setLeads([{id:Date.now(),name:nName,phone:nPhone,status:"New",time:"00:00",sales:nSales,notes:"New"},...leads])
    setNName(''); setNPhone('')
    alert("✅ Real Data Added!")
  }

  const filtered = leads.filter(l=> l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))

  return(
    <div className="app">
      <header>
        <div className="logo-wrap"><div className="logo-icon">📞</div><h2>PulseLine</h2></div>
        <div className="head-r"><span>⚙️</span><div className="av">M</div></div>
      </header>

      <div className="tabs">
        <div className={tab==='overview'?'tab active':'tab'} onClick={()=>setTab('overview')}>📊 Overview</div>
        <div className={tab==='leads'?'tab active':'tab'} onClick={()=>setTab('leads')}>👥 Leads</div>
        <div className={tab==='live'?'tab active':'tab'} onClick={()=>setTab('live')}>📞 Live</div>
      </div>

      <div className="content">
        {tab==='overview' && <>
          <div className="search-box"><span>🔍</span><input placeholder="Search phone or name..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <div className="stats">
            <div className="stat-card g"><h3>📞 {leads.length}</h3><p>Calls Today</p></div>
            <div className="stat-card b"><h3>📈 {leads.length?Math.round(leads.filter(x=>x.status==='Connected').length/leads.length*100):0}%</h3><p>Connect Rate</p></div>
            <div className="stat-card o"><h3>🕐 {sec?fmt(sec):"1m 2s"}</h3><p>Avg Talk</p></div>
            <div className="stat-card t"><h3>📊 {leads.length}</h3><p>Total</p></div>
          </div>
          <div className="list-card">
            <h4>Recent Activity - REAL DATA ({filtered.length})</h4>
            {filtered.map(l=><div key={l.id} className="call-row"><div><b>{l.name}</b><br/><small>{l.phone} • {l.sales}</small></div><div style={{textAlign:'right'}}><b style={{color:l.status==='Connected'?'#2ee89e':'#aaa'}}>{l.status}</b><br/><small>{l.time} • {l.notes}</small></div></div>)}
          </div>
        </>}

        {tab==='leads' && <div className="list-card">
          <h3>➕ Add Real Data</h3>
          <div className="form">
            <input placeholder="Name" value={nName} onChange={e=>setNName(e.target.value)}/>
            <input placeholder="Phone" value={nPhone} onChange={e=>setNPhone(e.target.value)}/>
            <select value={nSales} onChange={e=>setNSales(e.target.value)}><option>Mani</option><option>Arun</option><option>Priya</option></select>
            <button className="green-btn" onClick={addLead}>+ ADD LEAD</button>
          </div>
          {leads.map(l=><div key={l.id} className="call-row"><div><b>{l.name}</b><br/><small>{l.phone}</small></div><div style={{textAlign:'right'}}>{l.sales}<br/><small>{l.status}</small></div></div>)}
        </div>}

        {tab==='live' && <div className="dialer-box">
          <h3>{calling?'Calling...':'Ready'}</h3>
          <div className="timer">{fmt(sec)}</div>
          {calling && <div style={{color:'#ff4444',fontWeight:800}}>🔴 REC {fmt(sec)}</div>}
          <input className="phone-input" value={phone} onChange={e=>setPhone(e.target.value)}/>
          <div className="keypad">{['1','2','3','4','5','6','7','8','9','*','0','#'].map(k=><div key={k} onClick={()=>setPhone(p=>p+k)}>{k}</div>)}</div>
          {!calling? <button className="call-btn green" onClick={()=>{setCalling(true);setSec(0)}}>📞 CALL</button>
          : <button className="call-btn red" onClick={()=>{setCalling(false);setLeads([{id:Date.now(),name:"Live Call",phone,status:"Connected",time:fmt(sec),sales:"Mani",notes:"Live"},...leads]);setSec(0);setTab('overview')}}>✕ END {fmt(sec)}</button>}
        </div>}
      </div>
    </div>
  )
}
