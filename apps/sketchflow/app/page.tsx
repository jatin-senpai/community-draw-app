"use client";

import { useState } from 'react';
import { Palette, Users, Sparkles, Star, Check, Menu, X, Shield, Code, Brush, Github, Linkedin, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">SketchFlow</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">Features</a>
              <a href="#about" className="text-gray-300 hover:text-yellow-400 transition-colors">About</a>
              <div className="flex items-center space-x-3">
                <button onClick={() => router.push("/signin")} className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
                  Sign In
                </button>
                <button onClick={() => router.push("/signup")} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full hover:shadow-lg transition-all font-semibold">
                  Sign Up
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-black border-b border-yellow-400/20 shadow-lg">
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-gray-300">Features</a>
                <a href="#about" className="block text-gray-300">About</a>
                <div className="space-y-2">
                  <button className="w-full text-gray-300 hover:text-yellow-400 transition-colors font-semibold py-2">
                    Sign In
                  </button>
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-full font-semibold">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Visual thinking made
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent"> effortless</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into visual stories. Collaborate in real-time, 
              brainstorm freely, and create with SketchFlow.
            </p>
            
            <div className="mb-12">
              <p className="text-2xl font-semibold text-yellow-400 italic">
                Let the creativity flow
              </p>
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-yellow-400/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>3 collaborators online</span>
                  </div>
                </div>
                
                {/* Canvas Preview */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
                  {/* Simulated drawing elements */}
                  <div className="absolute top-8 left-8 w-24 h-16 bg-yellow-400 rounded-lg transform rotate-3"></div>
                  <div className="absolute top-12 right-12 w-20 h-20 bg-yellow-300 rounded-full"></div>
                  <div className="absolute bottom-8 left-1/4 w-32 h-8 bg-yellow-500 rounded-full"></div>
                  <div className="absolute bottom-16 right-1/4 w-16 h-24 bg-yellow-400 rounded-lg transform -rotate-6"></div>
                  
                  {/* Center message */}
                  <div className="text-center z-10">
                    <Palette className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-gray-400">Your creative canvas awaits</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-4 -left-4 bg-yellow-500 text-black p-3 rounded-lg shadow-lg animate-pulse">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful features for seamless collaboration
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with modern technologies to deliver the best creative experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/20 hover:shadow-lg hover:border-yellow-400/40 transition-all">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-time Multi-user Collaboration</h3>
              <p className="text-gray-300">
                Work together seamlessly with WebSocket-powered real-time collaboration. 
                See changes instantly as your team creates together.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/20 hover:shadow-lg hover:border-yellow-400/40 transition-all">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brush className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Freehand Drawing & Shape Tools</h3>
              <p className="text-gray-300">
                Express your ideas with intuitive drawing tools, perfect shapes, 
                and a comprehensive toolkit for visual creativity.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/20 hover:shadow-lg hover:border-yellow-400/40 transition-all">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">JWT-based Authentication</h3>
              <p className="text-gray-300">
                Secure user authentication with JSON Web Tokens ensures your 
                creative work is protected and accessible only to you.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/20 hover:shadow-lg hover:border-yellow-400/40 transition-all">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Prisma Data Security</h3>
              <p className="text-gray-300">
                Your creations are safely stored with Prisma ORM, ensuring 
                reliable data persistence and seamless synchronization.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/20 hover:shadow-lg hover:border-yellow-400/40 transition-all">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Next.js & TypeScript</h3>
              <p className="text-gray-300">
                Built with modern web technologies including Next.js, TypeScript, 
                and WebSockets for optimal performance and reliability.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/20 hover:shadow-lg hover:border-yellow-400/40 transition-all">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Modern Tech Stack</h3>
              <p className="text-gray-300">
                Built with cutting-edge technologies including Next.js, TypeScript, 
                and WebSockets for optimal performance and developer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            About SketchFlow
          </h2>
          <div className="bg-gray-900 p-8 md:p-12 rounded-2xl shadow-lg border border-yellow-400/20">
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              SketchFlow was built to help creators, developers, and teams visualize their ideas in real-time. 
              Designed and developed by <span className="font-semibold text-yellow-400">Jatin</span>, it combines 
              real-time collaboration with powerful drawing tools in a sleek, intuitive interface.
            </p>
            
            <div className="flex justify-center items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">J</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Jatin</p>
                <p className="text-gray-300">Creator & Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Ready to bring your ideas to life?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Join the creative community using SketchFlow to visualize and collaborate on amazing projects.
          </p>
          <p className="text-2xl font-semibold text-black italic">
            Let the creativity flow
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">SketchFlow</span>
              </div>
              <p className="text-gray-400 mb-6">
                Visual thinking made effortless for creative teams worldwide.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/jatin-senpai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/jatin-yadav-145202220/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-yellow-400 transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-yellow-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Bug Reports</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 flex items-center justify-center">
              © 2025 SketchFlow. Built with <Heart className="w-4 h-4 mx-1 text-red-500" /> by Jatin. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}