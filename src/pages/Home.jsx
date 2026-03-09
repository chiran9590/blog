import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { Calendar, User, Heart, MessageCircle, Search, BookOpen, Code, Coffee, Terminal, Brain, Cpu, Database, Mail } from 'lucide-react'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:users(name, email)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const featuredTopics = [
    { icon: <Code size={24} />, title: 'Data Structure using C', color: 'from-blue-500 to-purple-600' },
    { icon: <Terminal size={24} />, title: 'Computer Organization', color: 'from-green-500 to-teal-600' },
    { icon: <Database size={24} />, title: 'UNIX Lab', color: 'from-orange-500 to-red-600' },
    { icon: <Brain size={24} />, title: 'Research Methodology', color: 'from-pink-500 to-rose-600' },
    { icon: <Cpu size={24} />, title: 'Operating System', color: 'from-indigo-500 to-purple-600' },
    { icon: <BookOpen size={24} />, title: 'DBMS Lab', color: 'from-cyan-500 to-blue-600' }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="text-blue-600" size={16} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden laptop-pattern">
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative floating">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                  <Code className="text-white" size={48} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-pulse delay-75"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="typing-effect">Supriya Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Exploring the fascinating world of computer science, from algorithms to artificial intelligence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/search"
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Articles
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all transform hover:scale-105"
              >
                Join Community
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <BookOpen size={20} />
                <span>100+ Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee size={20} />
                <span>CS Research</span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal size={20} />
                <span>Code Examples</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-100"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-400/20 rounded-full blur-xl animate-pulse delay-200"></div>
      </section>

      {/* Featured Topics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore Supriya's Topics
          </h2>
          
          {/* 3rd Semester */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">3rd Semester</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTopics.slice(0, 3).map((topic, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${topic.color} p-6 rounded-2xl text-white text-center card-hover cursor-pointer`}
                >
                  <div className="flex justify-center mb-3">
                    {topic.icon}
                  </div>
                  <h3 className="font-semibold">{topic.title}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* 6th Semester */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">6th Semester</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTopics.slice(3, 6).map((topic, index) => (
                <div
                  key={index + 3}
                  className={`bg-gradient-to-br ${topic.color} p-6 rounded-2xl text-white text-center card-hover cursor-pointer`}
                >
                  <div className="flex justify-center mb-3">
                    {topic.icon}
                  </div>
                  <h3 className="font-semibold">{topic.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Mrs. Supriya */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Meet the Author
          </h2>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
            
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 -mt-16">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <User className="text-white" size={48} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Mrs. Supriya</h3>
                  <p className="text-xl text-blue-600 font-semibold mb-4">Assistant Professor-II</p>
                  <p className="text-lg text-gray-700 mb-2">Department of Information Science and Engineering</p>
                  <p className="text-lg text-gray-600 mb-6 italic">Nitte Meenakshi Institute of Technology</p>
                  <p className="text-gray-600 mb-4">(Nitte Deemed to be University), Bangalore</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Coffee className="text-white" size={20} />
                        </div>
                        <h4 className="font-semibold text-gray-900">Experience</h4>
                      </div>
                      <p className="text-gray-700">12+ years of academic excellence</p>
                      <p className="text-sm text-gray-600">Worked with several reputable Institutes</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <Brain className="text-white" size={20} />
                        </div>
                        <h4 className="font-semibold text-gray-900">Research</h4>
                      </div>
                      <p className="text-gray-700">Published in reputable journals</p>
                      <p className="text-sm text-gray-600">IEEE conference presenter</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Cpu className="text-blue-600" size={20} />
                      <span>Research Interests</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'Computer Vision', 'Cyber Security'].map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full border border-blue-200"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center md:justify-start space-x-3">
                    <Mail className="text-blue-600" size={20} />
                    <a
                      href="mailto:supriya35.tintu@gmail.com"
                      className="text-lg text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      supriya35.tintu@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tech-gradient p-8 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Discover Knowledge
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search articles, algorithms, concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-lg border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-inner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Latest Articles
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="text-gray-400" size={48} />
              </div>
              <p className="text-xl text-gray-500 mb-4">
                {searchTerm ? 'No articles found matching your search.' : 'No published articles yet.'}
              </p>
              <p className="text-gray-400">Check back soon for new computer science content!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group">
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="text-white/20" size={64} />
                    </div>
                    {post.cover_image && (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover mix-blend-overlay"
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-purple-600 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {post.author?.name || 'Professor'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                      <Link to={`/post/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    {post.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                          <Heart size={18} />
                          <span className="text-sm">0</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                          <MessageCircle size={18} />
                          <span className="text-sm">0</span>
                        </div>
                      </div>
                      
                      <Link
                        to={`/post/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <span>Read More</span>
                        <span>→</span>
                      </Link>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 code-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Dive Deeper into CS?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community of learners and explore the cutting edge of computer science
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Learning
            </Link>
            <Link
              to="/notes"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              Browse Notes
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
