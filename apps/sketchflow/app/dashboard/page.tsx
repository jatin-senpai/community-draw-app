"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  Users, 
  LogIn, 
  Loader2, 
  Palette,
  Sparkles,
  Clock,
  ArrowRight,
  Settings,
  Bell,
  User,
  LogOut,
  Search,
  Filter,
  Eye,
  Edit3
} from "lucide-react";
import { httpUrl } from "@/components/config";

interface Room {
  id: number;
  slug: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = rooms.filter(room =>
    room.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function fetchRooms() {
    try {
      const res = await axios.get(`${httpUrl}/rooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRooms(res.data.rooms);
    } catch (e) {
      console.error("Failed to fetch rooms", e);
    }
  }

  async function createRoom() {
    if (!newRoom) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${httpUrl}/create-room`,
        { name: newRoom },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewRoom("");
      await fetchRooms();
    } catch (e: any) {
      setError(
        e.response?.data?.error || "Failed to create room. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function joinRoom() {
    if (!joinSlug) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${httpUrl}/rooms/join/${joinSlug}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setJoinSlug("");
      await fetchRooms();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to join room. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Enhanced Header */}
      <header className="bg-black/90 backdrop-blur-md z-50 border-b border-yellow-400/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">SketchFlow</span>
              </div>
              <div className="hidden md:block">
                <nav className="flex space-x-6">
                  <a href="#" className="text-white font-medium">Dashboard</a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Templates</a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Team</a>
                </nav>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-yellow-400 rounded-lg hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-yellow-400 rounded-lg hover:bg-gray-800 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/signin");
                  }}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Manage your creative spaces and collaborate with your team.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Rooms</p>
                <p className="text-2xl font-bold text-white">{rooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-white">{Math.floor(rooms.length * 0.6)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-400/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Collaborators</p>
                <p className="text-2xl font-bold text-white">{rooms.length * 3}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create Room Card */}
          <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 p-6 rounded-2xl border border-yellow-400/20 shadow-lg hover:shadow-xl hover:border-yellow-400/40 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-xl font-semibold text-white">Create New Room</h2>
            </div>
            <p className="text-gray-400 mb-4">Start a new collaborative space for your team</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter room name..."
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                className="flex-1 rounded-lg px-4 py-3 bg-gray-800 border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 outline-none text-white placeholder-gray-400 transition-all"
              />
              <button
                onClick={createRoom}
                disabled={loading || !newRoom.trim()}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Create</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Join Room Card */}
          <div className="bg-gradient-to-br from-blue-400/10 to-purple-500/10 p-6 rounded-2xl border border-blue-400/20 shadow-lg hover:shadow-xl hover:border-blue-400/40 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Join Existing Room</h2>
            </div>
            <p className="text-gray-400 mb-4">Enter a room slug to join a collaborative session</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter room slug..."
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
                className="flex-1 rounded-lg px-4 py-3 bg-gray-800 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 outline-none text-white placeholder-gray-400 transition-all"
              />
              <button
                onClick={joinRoom}
                disabled={loading || !joinSlug.trim()}
                className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Your Creative Spaces ({filteredRooms.length})</h2>
            
            {rooms.length > 0 && (
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-yellow-400 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Palette className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {rooms.length === 0 ? "No rooms yet" : "No rooms found"}
              </h3>
              <p className="text-gray-400 mb-6">
                {rooms.length === 0 
                  ? "Create your first room to start collaborating with your team" 
                  : "Try adjusting your search terms"
                }
              </p>
              {rooms.length === 0 && (
                <button
                  onClick={() => (document.querySelector('input[placeholder="Enter room name..."]') as HTMLInputElement | null)?.focus()}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Create Your First Room
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room, index) => {
                const gradients = [
                  'bg-gradient-to-br from-yellow-400 to-orange-500',
                  'bg-gradient-to-br from-blue-400 to-purple-500',
                  'bg-gradient-to-br from-green-400 to-blue-500',
                  'bg-gradient-to-br from-purple-400 to-pink-500',
                  'bg-gradient-to-br from-orange-400 to-red-500',
                  'bg-gradient-to-br from-teal-400 to-cyan-500'
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <div
                    key={room.id}
                    className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl hover:border-yellow-400/30 transition-all cursor-pointer group"
                    onClick={() => router.push(`/canva/${room.id}`)}
                  >
                    <div className={`h-32 ${gradient} flex items-center justify-center relative overflow-hidden`}>
                      <Palette className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white text-lg group-hover:text-yellow-400 transition-colors">
                          {room.slug}
                        </h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 5) + 1}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-4">
                        Room ID: {room.id}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Active now</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-500 font-medium">Live</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="flex-1 bg-gray-700 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-2 rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center justify-center space-x-1">
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}