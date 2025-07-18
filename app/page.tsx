"use client"
import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Zap, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Github, 
  Star,
  Terminal,
  Palette,
  Layers,
  Download,
  Menu,
  X,
  Link
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const CodeEditorLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useRouter();
  
  const codeSnippets = [
    'const editor = new CodeEditor();',
    'editor.setTheme("dark");',
    'editor.enableAutoComplete();',
    'editor.run();'
  ];

  function goToDash () {
    navigate.push("/project/test-project");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < codeSnippets.length) {
        const currentSnippet = codeSnippets[currentIndex];
        if (typedText.length < currentSnippet.length) {
          setTypedText(currentSnippet.slice(0, typedText.length + 1));
        } else {
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % codeSnippets.length);
            setTypedText('');
          }, 2000);
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [typedText, currentIndex, codeSnippets]);

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Smart Code Completion",
      description: "AI-powered autocomplete that understands your code context and suggests the most relevant completions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with instant file loading, real-time syntax highlighting, and smooth scrolling."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Beautiful Themes",
      description: "Choose from dozens of carefully crafted themes or create your own custom color schemes."
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Full syntax highlighting and IntelliSense for 100+ programming languages and frameworks."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time with live cursors, comments, and shared editing."
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "Integrated Terminal",
      description: "Built-in terminal with multiple tabs, custom commands, and seamless project integration."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Code className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              New-Nine
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200">Features</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-200">Pricing</a>
            <a href="#docs" className="text-slate-300 hover:text-white transition-colors duration-200">Docs</a>
            <a href="#about" className="text-slate-300 hover:text-white transition-colors duration-200">About</a>
            <button onClick={goToDash} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700 mt-4 rounded-2xl mx-6 p-6">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#docs" className="text-slate-300 hover:text-white transition-colors duration-200">Docs</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors duration-200">About</a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 text-left">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-700">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Now with AI-powered suggestions</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Code like a
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Pro
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              Experience the future of coding with our revolutionary editor. Built for developers who demand speed, 
              elegance, and powerful features that enhance productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Try Live Demo</span>
              </button>
              
              <button className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700 hover:bg-slate-700/50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Download Free</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-slate-800"></div>
                  ))}
                </div>
                <span className="text-sm text-slate-400">10,000+ developers</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-slate-400 ml-2">4.9/5 rating</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Code Preview */}
          <div className="relative">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-400 ml-4">main.js</span>
              </div>
              
              {/* Code Content */}
              <div className="font-mono text-sm space-y-2">
                <div className="text-slate-500">// Initialize CodeFlow Editor</div>
                <div className="text-blue-400">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </div>
                <div className="text-slate-600">
                  <span className="text-green-400">// Features:</span>
                </div>
                <div className="text-slate-600">
                  <span className="text-yellow-400">// • Smart autocomplete</span>
                </div>
                <div className="text-slate-600">
                  <span className="text-purple-400">// • Real-time collaboration</span>
                </div>
                <div className="text-slate-600">
                  <span className="text-cyan-400">// • Multi-language support</span>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 animate-bounce">
                <Zap className="w-5 h-5 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-3 animate-pulse">
                <Code className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to write, debug, and deploy code faster than ever before.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-slate-700 p-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Ready to Transform Your Coding Experience?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have already made the switch to CodeFlow. 
            Start your free trial today and experience the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700 hover:bg-slate-700/50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>View on GitHub</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-slate-700/50">
        <div className="text-center text-slate-400">
          <p>© 2025 CodeFlow. Built with ❤️ for developers worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default CodeEditorLanding;