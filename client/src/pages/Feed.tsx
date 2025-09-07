import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Link, useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'
import { motion } from 'framer-motion'
import IdeaCard, { Idea } from '../components/IdeaCard'

export default function Feed() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const tag = params.get('tag') || ''
  const { data, isLoading, error } = useQuery({
    queryKey: ['ideas', q, tag],
    queryFn: async () => (await api.get(`/api/ideas`, { params: { q, tag } })).data,
  })

  const onTagClick = (name: string) => {
    params.set('tag', name)
    setParams(params)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 relative">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-rose-300/40 blur-3xl" />
      <Nav />

      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur p-4 shadow flex flex-col md:flex-row gap-2 md:items-center mb-8">
          <input
            className="input md:flex-1"
            placeholder="Search ideas..."
            value={q}
            onChange={(e) => { params.set('q', e.target.value); setParams(params, { replace: true }) }}
          />
          <input
            className="input md:w-64"
            placeholder="Filter by tag..."
            value={tag}
            onChange={(e) => { params.set('tag', e.target.value); setParams(params, { replace: true }) }}
          />
          <Link to="/new" className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-center">
            Post idea
          </Link>
        </div>

        {isLoading && <p className="mt-6 text-gray-600">Loading ideas…</p>}
        {error && <p className="mt-6 text-rose-600">Failed to load ideas</p>}

        <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8">
          {(data || []).map((i: Idea, idx: number) => (
            <li key={i.id}>
              <IdeaCard idea={i} onTagClick={onTagClick} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
