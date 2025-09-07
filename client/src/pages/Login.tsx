import { FormEvent, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Nav from '../components/Nav'

function pwIssues(pw: string) {
  const errs: string[] = []
  if (pw.length < 8) errs.push('At least 8 characters')
  if (!/[a-z]/.test(pw)) errs.push('One lowercase letter')
  if (!/[A-Z]/.test(pw)) errs.push('One uppercase letter')
  if (!/[0-9]/.test(pw)) errs.push('One number')
  if (!/[^\w\s]/.test(pw)) errs.push('One special character (!@#$...)')
  return errs
}

export default function Login() {
  const n = useNavigate()
  const [params, setParams] = useSearchParams()
  const initialTab = params.get('tab') === 'register' ? 'register' : 'login'
  const [tab, setTab] = useState<'login'|'register'>(initialTab)

  useEffect(() => { params.set('tab', tab); setParams(params, { replace: true }) }, [tab])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [fieldErrs, setFieldErrs] = useState<Record<string,string[]>>({})
  const livePwIssues = useMemo(()=>pwIssues(password), [password])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null); setFieldErrs({})
    try {
      if (tab === 'register') {
        if (livePwIssues.length) { setErr('Please satisfy the password rules.'); return }
        await api.post('/api/auth/register', { email, password, name })
      }
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('hb_token', res.data.token)
      localStorage.setItem('hb_user', JSON.stringify(res.data.user))
      n('/feed')
    } catch (e: any) {
      const fe = e?.response?.data?.error?.fieldErrors
      if (fe) setFieldErrs(fe)
      setErr(e?.response?.data?.error?.message || e?.response?.data?.error || 'Request failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 relative">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-rose-300/40 blur-3xl" />
      <Nav />

      <div className="relative z-10 max-w-md mx-auto px-6 pt-10">
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur p-6 shadow-xl">
          <div className="flex gap-2 mb-4">
            <button className={`px-3 py-1 rounded-xl ${tab==='login'?'bg-black text-white':'border'}`} onClick={()=>setTab('login')}>Login</button>
            <button className={`px-3 py-1 rounded-xl ${tab==='register'?'bg-black text-white':'border'}`} onClick={()=>setTab('register')}>Register</button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {tab==='register' && (
              <>
                <label className="block text-sm font-medium">Name</label>
                <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
                {fieldErrs?.name?.length && <p className="text-xs text-rose-600">{fieldErrs.name.join(', ')}</p>}
              </>
            )}

            <label className="block text-sm font-medium">Email</label>
            <input className="input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            {fieldErrs?.email?.length && <p className="text-xs text-rose-600">{fieldErrs.email.join(', ')}</p>}

            <label className="block text-sm font-medium">Password</label>
            <input className="input" type="password" placeholder="********" value={password} onChange={e=>setPassword(e.target.value)} />

            {tab==='register' && (
              <ul className="text-xs mt-1 space-y-0.5">
                {['At least 8 characters','One lowercase letter','One uppercase letter','One number','One special character (!@#$...)'].map(r=>{
                  const ok = !livePwIssues.includes(r)
                  return <li key={r} className={ok ? 'text-green-600' : 'text-gray-500'}>{ok ? '✓':'•'} {r}</li>
                })}
              </ul>
            )}
            {fieldErrs?.password?.length && <p className="text-xs text-rose-600">{fieldErrs.password.join(', ')}</p>}
            {err && <p className="text-sm text-rose-600">{err}</p>}

            <button className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:scale-[1.02] transition">
              {tab==='login'?'Login':'Create account'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
