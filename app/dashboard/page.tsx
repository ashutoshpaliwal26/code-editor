'use client'

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  User,
  ChevronDown,
  Folder,
  Users,
  FolderOpen,
  MoreHorizontal,
  Star,
  X,
  Settings,
  LogOut,
  UserCircle,
  Shield,
  CreditCard,
  Globe,
  Lock,
  Github,
  Code,
  Database,
  Smartphone,
  Monitor,
  Layers
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { serverAuthentication } from '@/lib/apiClient';
import { setUser } from '@/store/auth/authSlice';
import Link from 'next/link';

interface App {
  id: string;
  name: string;
  lastModified: string;
  size: string;
  isPublic: boolean;
  icon: string;
}

const Dashboard: React.FC = () => {
  const [apps] = useState<App[]>([
    {
      id: '1',
      name: "test-project",
      lastModified: '10 min ago',
      size: '208.58 MiB',
      isPublic: true,
      icon: 'T'
    },
  ]);
  const user = "ashutosh paliwal";
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'javascript',
    visibility: 'public',
    connectGithub: false,
    githubRepo: ''
  });

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: Code },
    { value: 'typescript', label: 'TypeScript', icon: Code },
    { value: 'python', label: 'Python', icon: Code },
    { value: 'java', label: 'Java', icon: Code },
    { value: 'react', label: 'React', icon: Layers },
    { value: 'vue', label: 'Vue.js', icon: Layers },
    { value: 'nodejs', label: 'Node.js', icon: Database },
    { value: 'flutter', label: 'Flutter', icon: Smartphone },
    { value: 'nextjs', label: 'Next.js', icon: Monitor },
  ];

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating app:', formData);
    setShowCreateModal(false);
    // Reset form
    setFormData({
      name: '',
      description: '',
      language: 'javascript',
      visibility: 'public',
      connectGithub: false,
      githubRepo: ''
    });
  };

  useEffect(() => {
    // dispatch(setUser(JSON.parse(localStorage.getItem('user')! as string)))
    const uuid = localStorage.getItem("uuid");
    if (uuid) {
      const token = JSON.parse(uuid);
      if (token) {
        const api = async () => {
          if (await serverAuthentication(token.access)) {
            setLoading(false);
          }
        }
        api();
      }
    }

  }, [])

  if (loading) {
    return (<>
      <div className='w-screen h-screen flex items-center justify-center bg-blue-900 text-white'>
        Loading...
      </div>
    </>)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search & run commands"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              Ctrl + .
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </button>
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">AP</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 transform transition-all duration-200 animate-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{`${user.slice(0, 1)}${user.split(" ")[1]?.slice(0, 1)}`}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{user}</p>
                      <p className="text-sm text-gray-400">{user}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200 group">
                    <UserCircle className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <span className="text-gray-300 group-hover:text-white">Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200 group">
                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <span className="text-gray-300 group-hover:text-white">Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200 group">
                    <Shield className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <span className="text-gray-300 group-hover:text-white">Privacy & Security</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200 group">
                    <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    <span className="text-gray-300 group-hover:text-white">Billing</span>
                  </button>
                </div>

                <div className="border-t border-gray-700 py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors duration-200 group">
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                    <span className="text-gray-300 group-hover:text-red-400">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 min-h-screen border-r border-gray-700 p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold flex items-center space-x-2">
                <Folder className="w-6 h-6" />
                <span>Apps</span>
                <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded-full">
                  (23/10) Apps
                </span>
              </h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </button>
            </div>

            <div className="text-sm text-gray-400 mb-6">All /</div>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
              <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-white" />
              <span className="text-gray-300 group-hover:text-white">New folder</span>
              <Star className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
              <Users className="w-5 h-5 text-gray-400 group-hover:text-white" />
              <span className="text-gray-300 group-hover:text-white">Shared with me</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
              <Folder className="w-5 h-5 text-gray-400 group-hover:text-white" />
              <span className="text-gray-300 group-hover:text-white">Unnamed (13)</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-1">
            {apps.map((app, index) => (
              <Link href={`/project/${app.name}`} 
                key={app.id}
                className="flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg transition-all duration-200 group cursor-pointer transform hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <Link href={`/project/${app.name}`} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-semibold text-white">
                    {app.icon}
                  </div>

                  <div>
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors duration-200">
                      {app.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                        <span>Public</span>
                      </span>
                      <span>{app.lastModified}</span>
                      <span>{app.size}</span>
                    </div>
                  </div>
                </Link>

                <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded-lg transition-all duration-200">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* Create App Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Create New App</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="p-6 space-y-6">
              {/* App Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter app name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Brief description of your app"
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language/Framework *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Visibility
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === 'public'}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Public</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === 'private'}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Private</span>
                  </label>
                </div>
              </div>

              {/* GitHub Integration */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.connectGithub}
                    onChange={(e) => setFormData({ ...formData, connectGithub: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <Github className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Connect to GitHub</span>
                </label>

                {formData.connectGithub && (
                  <div className="mt-3 ml-6">
                    <input
                      type="text"
                      value={formData.githubRepo}
                      onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="username/repository-name"
                    />
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 transform hover:scale-105"
                >
                  Create App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;