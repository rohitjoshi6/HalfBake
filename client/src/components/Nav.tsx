import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = localStorage.getItem('hb_user')
  const onLogout = () => {
    localStorage.removeItem('hb_user')
    localStorage.removeItem('hb_token')
    navigate('/')
  }

  const linkCls = (p: string) =>
    `px-3 py-2 rounded-xl transition ${
      pathname === p ? 'bg-black/80 text-white' : 'hover:bg-black/10'
    }`

  return (
    <nav className="sticky top-0 z-40 border-b border-white/30 bg-white/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
        <Link to="/" className="font-black text-xl tracking-tight">HalfBake</Link>
        <div className="ml-2 hidden sm:flex gap-1">
          <Link to="/feed" className={linkCls('/feed')}>Home</Link>
          <Link to="/new" className={linkCls('/new')}>New Idea</Link>
        </div>
        <div className="ml-auto flex gap-2">
          {user ? (
            <>
              <Link to="/new" className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow">
                Post
              </Link>
              <button onClick={onLogout} className="px-4 py-2 rounded-2xl border">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login?tab=login" className="px-4 py-2 rounded-2xl border">Login</Link>
              <Link to="/login?tab=register" className="px-4 py-2 rounded-2xl bg-gray-900 text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
