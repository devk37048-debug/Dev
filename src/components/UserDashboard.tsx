import React, { useState } from "react";
import {
  User,
  Download,
  FolderHeart,
  CreditCard,
  History,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Eye,
  LogOut,
  Sparkles,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Collection, MotionVideo, Format, Resolution, LicenseType } from "../types";
import { MOCK_VIDEOS } from "../data/mockVideos";

interface DownloadRecord {
  videoId: string;
  filename: string;
  format: Format;
  resolution: Resolution;
  license: LicenseType;
  date: string;
}

interface UserDashboardProps {
  profile: UserProfile;
  onChangeProfile: (updated: UserProfile) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  collections: Collection[];
  removeVideoFromCollection: (collectionId: string, videoId: string) => void;
  deleteCollection: (id: string) => void;
  downloadHistory: DownloadRecord[];
  uploadedVideosList: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    proceduralType: string;
    color: string;
    date: string;
  }>;
  onSelectVideo: (video: MotionVideo) => void;
}

export default function UserDashboard({
  profile,
  onChangeProfile,
  favorites,
  toggleFavorite,
  collections,
  removeVideoFromCollection,
  deleteCollection,
  downloadHistory,
  uploadedVideosList,
  onSelectVideo,
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "downloads" | "collections" | "subscription" | "uploads">("profile");

  // Local editable variables
  const [editableName, setEditableName] = useState(profile.name);
  const [editableEmail, setEditableEmail] = useState(profile.email);
  const [saveIndicator, setSaveIndicator] = useState(false);

  const sidebarTabs = [
    { id: "profile", name: "Profile Control", icon: User },
    { id: "downloads", name: "Downloads & Receipts", icon: Download },
    { id: "collections", name: "Collections & Favs", icon: FolderHeart },
    { id: "subscription", name: "Licensing & Billing", icon: CreditCard },
    { id: "uploads", name: "My Custom Imports", icon: History },
  ] as const;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProfile({
      ...profile,
      name: editableName,
      email: editableEmail,
    });
    setSaveIndicator(true);
    setTimeout(() => {
      setSaveIndicator(false);
    }, 2200);
  };

  // Safe helper to find original video info
  const getVideoDetails = (id: string) => {
    return MOCK_VIDEOS.find((v) => v.id === id);
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto pb-24 text-left">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{profile.name}</span>
        </h1>
        <p className="text-gray-400 font-sans mt-2">
          Review downloaded assets, license registrations, custom collections, and subscription configurations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side control tabs */}
        <div className="w-full lg:w-64 shrink-0 border border-slate-900 bg-slate-950/60 p-4 rounded-3xl backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-3 p-3.5 border-b border-slate-900/60 mb-3">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-10 h-10 object-cover rounded-full border border-cyan-400/30"
            />
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">{profile.tier}</div>
              <div className="text-xs text-gray-500 font-sans truncate max-w-[120px]">{profile.email}</div>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`btn-dash-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-3 ${
                    activeTab === tab.id
                      ? "bg-slate-905 border border-slate-800 text-cyan-400 shadow-md shadow-cyan-950/20"
                      : "text-gray-400 hover:text-white hover:bg-slate-900/40"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side active workspace contents */}
        <div className="flex-1 w-full border border-slate-900 bg-slate-950/40 rounded-3xl p-6 md:p-8 min-h-[460px] backdrop-blur-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* PROFILE PANEL */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">Core Profile Parameters</h3>
                  <p className="text-gray-500 text-xs font-sans mt-0.5">Edit username, digital mail routing, and system parameters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase mb-2">Display Username</label>
                      <input
                        id="dash-input-name"
                        type="text"
                        required
                        value={editableName}
                        onChange={(e) => setEditableName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase mb-2">Transcribed Email Address</label>
                      <input
                        id="dash-input-email"
                        type="email"
                        required
                        value={editableEmail}
                        onChange={(e) => setEditableEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {saveIndicator && (
                      <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Core profile values synced to system registries successfully!
                      </p>
                    )}

                    <button
                      id="btn-save-dash-profile"
                      type="submit"
                      className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all hover:shadow-lg shadow-cyan-950/40"
                    >
                      Update Profile Node
                    </button>
                  </form>

                  <div className="p-6 bg-slate-950/80 border border-slate-900 rounded-2xl relative space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-full border-2 border-purple-500 relative flex items-center justify-center p-0.5">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1 border border-slate-950">
                          <Award className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold font-sans flex items-center gap-1.5">
                          {profile.name} <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full inline-block">VERIFIED</span>
                        </h4>
                        <p className="text-xs text-gray-500 font-sans mt-0.5">{profile.email}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500 font-mono text-[10px]">TIER LEVEL</div>
                        <div className="text-cyan-400 font-bold font-mono mt-0.5">{profile.tier.toUpperCase()}</div>
                      </div>

                      <div>
                        <div className="text-gray-500 font-mono text-[10px]">SINCE REGISTRATION</div>
                        <div className="text-white font-mono mt-0.5">{profile.joinedDate}</div>
                      </div>

                      <div className="col-span-2">
                        <div className="text-gray-500 font-mono text-[10px]">ACCESS INDEMNIFICATION</div>
                        <div className="text-gray-300 font-sans mt-0.5 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully Insured Global Clearance
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DOWNLOADED REGISTRATIONS PANEL */}
            {activeTab === "downloads" && (
              <motion.div
                key="downloads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">Active Download Archive & Licensing Receipts</h3>
                  <p className="text-gray-500 text-xs font-sans mt-0.5">
                    Whenever you execute file downloads from our content library, formal digital receipts are registered here.
                  </p>
                </div>

                {downloadHistory.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-slate-900 rounded-3xl">
                    <Download className="w-10 h-10 text-slate-800 mx-auto mb-3" />
                    <p className="text-xs text-gray-500 font-sans">Download log is empty.</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-1">Visit our Motion Graphics Library and trigger high-end download sequences.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {downloadHistory.map((d, index) => {
                      const videoItem = getVideoDetails(d.videoId);
                      return (
                        <div
                          key={`${d.videoId}-${index}`}
                          className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex items-center justify-center shrink-0">
                              {videoItem ? (
                                <div
                                  className="w-3 h-3 rounded-full animate-pulse"
                                  style={{ backgroundColor: videoItem.color }}
                                />
                              ) : (
                                <FileText className="w-5 h-5 text-cyan-400" />
                              )}
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-white font-sans leading-tight">
                                {videoItem ? videoItem.title : d.filename}
                              </h4>
                              <p className="text-xs text-gray-500 font-sans mt-0.5">Filename: {d.filename}</p>
                              <div className="flex gap-2 text-[10px] font-mono text-gray-400 mt-1.5 flex-wrap">
                                <span className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">{d.resolution}</span>
                                <span className="bg-slate-900 px-1.5 py-0.5 rounded text-purple-300">{d.format}</span>
                                <span className="bg-slate-900 px-1.5 py-0.5 rounded text-yellow-300">{d.license}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                            <span className="text-[10px] font-mono text-gray-500">{d.date}</span>
                            
                            {/* Render download receipt receipt detail trigger */}
                            <button
                              id={`btn-view-orig-${d.videoId}-${index}`}
                              onClick={() => {
                                if (videoItem) onSelectVideo(videoItem);
                              }}
                              className="p-2 bg-slate-900 text-cyan-400 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 text-xs transition flex items-center gap-1.5 font-mono"
                              title="View Original Asset Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* COLLECTIONS & FAVORITES TAB */}
            {activeTab === "collections" && (
              <motion.div
                key="collections"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Favorites Sub-List */}
                <div>
                  <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                    <FolderHeart className="w-5 h-5 text-red-500" /> My Starred Favorites ({favorites.length})
                  </h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favorites.length === 0 ? (
                      <div className="col-span-full py-8 text-center bg-slate-950/60 border border-slate-900 rounded-2xl text-[11px] text-gray-600 font-mono uppercase tracking-wider">
                        Zero Favorites Starred
                      </div>
                    ) : (
                      favorites.map((favId) => {
                        const videoItem = getVideoDetails(favId);
                        if (!videoItem) return null;
                        return (
                          <div
                            key={favId}
                            className="p-3 bg-slate-950 border border-slate-900 hover:border-red-900/60 rounded-xl flex items-center justify-between text-left relative overflow-hidden group"
                          >
                            <div className="min-w-0 pr-2">
                              <h4 className="text-xs font-bold text-white truncate font-sans">{videoItem.title}</h4>
                              <p className="text-[10px] text-gray-500 truncate mt-0.5">{videoItem.category}</p>
                            </div>

                            <div className="flex gap-1.5 opacity-90 group-hover:opacity-100 shrink-0">
                              <button
                                id={`btn-fav-pre-${favId}`}
                                onClick={() => onSelectVideo(videoItem)}
                                className="p-1 px-1.5 bg-slate-900 text-[10px] text-cyan-400 rounded hover:bg-slate-850"
                              >
                                Play
                              </button>
                              <button
                                id={`btn-fav-rem-${favId}`}
                                onClick={() => toggleFavorite(favId)}
                                className="p-1 bg-red-950/60 text-red-400 rounded hover:bg-red-900 text-xs"
                                title="Remove Favorite"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Collections lists manager */}
                <div className="pt-6 border-t border-slate-900">
                  <h3 className="text-lg font-bold text-white font-sans">Active Curated Collections ({collections.length})</h3>
                  <div className="mt-4 space-y-4">
                    {collections.length === 0 ? (
                      <div className="py-8 text-center bg-slate-950/60 border border-slate-900 rounded-2xl text-[11px] text-gray-600 font-mono">
                        No active collections created. Use the library modal to create specialized list folders.
                      </div>
                    ) : (
                      collections.map((col) => (
                        <div
                          key={col.id}
                          className="p-5 bg-slate-955 border border-slate-900 rounded-2xl space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-white font-sans">{col.name}</h4>
                              <p className="text-xs text-gray-500 font-sans mt-0.5">{col.description}</p>
                            </div>
                            <button
                              id={`btn-col-del-${col.id}`}
                              onClick={() => deleteCollection(col.id)}
                              className="p-1 px-2 border border-red-900/40 text-red-400 hover:text-white hover:bg-red-950 rounded-lg text-[10px] font-mono uppercase transition"
                            >
                              Delete Collection
                            </button>
                          </div>

                          {/* Children video assets inside collection row */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {col.videoIds.length === 0 ? (
                              <span className="text-[10px] text-gray-650 font-mono italic">
                                Collection is empty. Load assets in library page.
                              </span>
                            ) : (
                              col.videoIds.map((vId) => {
                                const asset = getVideoDetails(vId);
                                if (!asset) return null;
                                return (
                                  <div
                                    key={vId}
                                    className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 text-xs"
                                  >
                                    <span className="text-gray-300 font-sans truncate max-w-[120px]">{asset.title}</span>
                                    <button
                                      id={`btn-col-item-rem-${col.id}-${vId}`}
                                      onClick={() => removeVideoFromCollection(col.id, vId)}
                                      className="text-red-500 hover:text-white text-xs font-bold font-mono"
                                    >
                                      ×
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* BILLING & SUBSCRIPTIONS TAB */}
            {activeTab === "subscription" && (
              <motion.div
                key="subscription"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">Licensing Matrix & Active Billing</h3>
                  <p className="text-gray-500 text-xs font-sans mt-0.5">
                    Sync status counters and upcoming premium subscription renewals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 text-left">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">CURRENT TIER</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{profile.tier}</span>
                    <div className="mt-3 text-xs text-gray-400 font-sans leading-snug">
                      {profile.subscriptionActive ? "✓ Synchronized active recurring billing" : "⚠️ Subscription suspended or inactive"}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 text-left">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">BILLING PERIOD</span>
                    <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">Monthly</span>
                    <div className="mt-3 text-xs text-gray-400 font-sans leading-snug">
                      Renews on: <span className="font-mono text-white">July 11, 2026</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 text-left col-span-1 md:col-span-1">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">REGISTERED LICENSES</span>
                    <span className="text-2xl font-black text-yellow-400 font-mono mt-1 block">
                      {downloadHistory.length} registered
                    </span>
                    <div className="mt-3 text-xs text-gray-400 font-sans leading-snug">
                      Royalty clearances applied to 100% of downloads.
                    </div>
                  </div>
                </div>

                {/* Quick sub advantages card */}
                <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl text-left space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 text-cyan-400">
                    <Sparkles className="w-4 h-4" /> ACTIVE STUDIO PRIVILEGE
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-300 font-sans leading-relaxed">
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Infinite 3D procedural parameter adjustments & exports</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Capped download formats (MOV ProRes, raw Lottie Vector)</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Dedicated low latency GPU rendering pipelines</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Dual-seat multi worksites licensing clearance</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* MY CUSTOM UPLOADS PANEL */}
            {activeTab === "uploads" && (
              <motion.div
                key="uploads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">My Custom Imported Loops</h3>
                  <p className="text-gray-500 text-xs font-sans mt-0.5">
                    External video files that you completed processing in the Admin Import panel.
                  </p>
                </div>

                {uploadedVideosList.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-slate-900 rounded-3xl">
                    <Award className="w-10 h-10 text-slate-800 mx-auto mb-3" />
                    <p className="text-xs text-gray-500 font-sans">No imports completed during current session.</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-1">Navigate to Video Import Dashboard, upload dummy presets, and assign values.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedVideosList.map((ul) => (
                      <div
                        key={ul.id}
                        className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: ul.color }}
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white font-sans">{ul.title}</h4>
                            <p className="text-xs text-gray-500 font-sans mt-0.5">Category: {ul.category}</p>
                            <span className="text-[10px] font-mono text-gray-500 bg-slate-900 px-2 py-0.5 mt-1.5 inline-block rounded uppercase">
                              {ul.proceduralType} Vector Engine
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <span className="text-[10px] font-mono text-gray-500">{ul.date}</span>
                          <button
                            id={`btn-view-uploaded-${ul.id}`}
                            onClick={() => {
                              // Map internal procedural attributes back to rich representation to render preview
                              const dummyVideo: MotionVideo = {
                                id: ul.id,
                                title: ul.title,
                                description: ul.description,
                                category: ul.category as any,
                                duration: 15,
                                downloads: 1,
                                rating: 5.0,
                                creator: {
                                  name: "Me (Import Operator)",
                                  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
                                  verified: true,
                                },
                                fileFormat: "MP4",
                                resolution: "4K",
                                tags: ["IMPORTED"],
                                publishDate: ul.date,
                                proceduralType: ul.proceduralType as any,
                                color: ul.color,
                                baseSpeed: 1,
                              };
                              onSelectVideo(dummyVideo);
                            }}
                            className="p-2 bg-slate-900 text-cyan-400 hover:text-white rounded-xl border border-slate-800 text-xs transition font-mono flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
