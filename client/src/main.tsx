import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Landing from './pages/Landing'
import Feed from './pages/Feed'
import Idea from './pages/Idea'
import Login from './pages/Login'
import NewIdea from './pages/NewIdea'

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },     // NEW landing
  { path: '/feed', element: <Feed /> },    // moved feed
  { path: '/idea/:id', element: <Idea /> },
  { path: '/login', element: <Login /> },
  { path: '/new', element: <NewIdea /> },
])

const qc = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
