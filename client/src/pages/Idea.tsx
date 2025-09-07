import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import Nav from '../components/Nav'

export default function Idea() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['idea', id],
    queryFn: async () => (await api.get(`/api/ideas/${id}`)).data,
  })
  if (isLoading) return <p className="p-6">Loading...</p>
  if (!data) return <p className="p-6">Not found</p>
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="text-gray-600">{data.summary}</p>
        <div className="mt-4 whitespace-pre-wrap">{data.description}</div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {data.tags?.map((t: any) => (
            <span key={t.tag.id} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t.tag.name}</span>
          ))}
        </div>
        {data.repoUrl && (
          <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" className="btn mt-4">
            Contribute on GitHub
          </a>
        )}
      </div>
    </div>
  )
}
