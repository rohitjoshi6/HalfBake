import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import Nav from '../components/Nav'
import { motion } from 'framer-motion'

export default function NewIdea() {
  const n = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [tags, setTags] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [fieldErrs, setFieldErrs] = useState<Record<string, string[]>>({})

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null); setFieldErrs({})
    try {
      const payload = {
        title,
        summary,
        description: description || undefined,
        repoUrl: repoUrl || undefined,
        tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      }
      const res = await api.post('/api/ideas', payload)
      n(`/idea/${res.data.id}`)
    } catch (e: any) {
      const fe = e?.response?.data?.error?.fieldErrors
      if (fe) setFieldErrs(fe)
      setErr(e?.response?.data?.error?.message || 'Request failed (are you logged in?)')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 relative">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-rose-300/40 blur-3xl" />
      <Nav />

      <div className="relative z-10 max-w-2xl mx-auto p-6">
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur p-6 shadow-xl">
          <h1 className="text-2xl font-bold mb-3">Post a new idea</h1>

          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm font-medium">Title</label>
            <input className="input" placeholder="Short, catchy title" value={title} onChange={e=>setTitle(e.target.value)} />
            {fieldErrs?.title?.length && <p className="text-xs text-rose-600">{fieldErrs.title.join(', ')}</p>}

            <label className="block text-sm font-medium">Summary</label>
            <input className="input" placeholder="One-line summary" value={summary} onChange={e=>setSummary(e.target.value)} />
            {fieldErrs?.summary?.length && <p className="text-xs text-rose-600">{fieldErrs.summary.join(', ')}</p>}

            <label className="block text-sm font-medium">Description (optional)</label>
            <textarea className="input" rows={6} placeholder="Add enough context so others can pick it up"
              value={description} onChange={e=>setDescription(e.target.value)} />

            <label className="block text-sm font-medium">GitHub repo URL (optional)</label>
            <input className="input" placeholder="https://github.com/you/project" value={repoUrl} onChange={e=>setRepoUrl(e.target.value)} />
            {fieldErrs?.repoUrl?.length && <p className="text-xs text-rose-600">{fieldErrs.repoUrl.join(', ')}</p>}

            <label className="block text-sm font-medium">Tags (comma-separated)</label>
            <input className="input" placeholder="ai, web, tooling" value={tags} onChange={e=>setTags(e.target.value)} />

            {err && <p className="text-sm text-rose-600">{err}</p>}

            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:scale-[1.02] transition">
              Create Idea
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
