import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Post from './pages/Post'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Notes from './pages/Notes'
import CreateNote from './pages/CreateNote'
import EditNote from './pages/EditNote'
import Note from './pages/Note'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Dashboard />} />
        <Route path="/register" element={!user ? <Register /> : <Dashboard />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
        <Route path="/create-post" element={user ? <CreatePost /> : <Login />} />
        <Route path="/edit-post/:id" element={user ? <EditPost /> : <Login />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/create-note" element={user ? <CreateNote /> : <Login />} />
        <Route path="/edit-note/:id" element={user ? <EditNote /> : <Login />} />
        <Route path="/note/:id" element={<Note />} />
      </Routes>
    </Layout>
  )
}

export default App
