import React, { useState, useEffect } from "react";
import {
  Search,
  Mic,
  MicOff,
  SlidersHorizontal,
  Sparkles,
  Heart,
  Grid,
  SquareStack,
  FolderPlus,
  ArrowDownToLine,
  X,
  Share2,
  Play,
  Pause,
  Calendar,
  Layers,
  Star,
  User,
  Plus,
  Folder,
  Check,
  ChevronRight,
  Info,
  Sliders,
  CheckCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MOCK_VIDEOS } from "../data/mockVideos";
import { MotionVideo, Category, Format, Resolution, LicenseType, Collection } from "../types";
import ProceduralPlayer from "./ProceduralPlayer";

interface MotionLibraryProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  collections: Collection[];
  createCollection: (name: string, description: string) => void;
  addVideoToCollection: (collectionId: string, videoId: string) => void;
  removeVideoFromCollection: (collectionId: string, videoId: string) => void;
  onDownloadCompleted: (videoId: string, filename: string, format: Format, resolution: Resolution, license: LicenseType) => void;
  userTier: string;
}

export default function MotionLibrary({
  favorites,
  toggleFavorite,
  collections,
  createCollection,
  addVideoToCollection,
  removeVideoFromCollection,
  onDownloadCompleted,
  userTier,
}: MotionLibraryProps) {
  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedSort, setSelectedSort] = useState<string>("Trending");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewStyle, setViewStyle] = useState<"grid" | "masonry">("grid");

  // Voice Search States
  const [isListening, setIsListening] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState<number[]>(Array(10).fill(10));

  // Search Helpers
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recentSearches = ["quantum", "lottie animation", "HUD vector", "cinematic gold"];
  const trendingSearches = ["DNA Core", "Cyberpunk Ring", "Neon Wave", "Futuristic HUD"];

  // Active Selected Video for Modal Preview
  const [selectedVideo, setSelectedVideo] = useState<MotionVideo | null>(null);

  // Modal Customization State
  const [modalSpeed, setModalSpeed] = useState<number>(1.0);
  const [modalGlow, setModalGlow] = useState<boolean>(true);
  const [modalIntensity, setModalIntensity] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Modal Output Parameters
  const [chosenFormat, setChosenFormat] = useState<Format>("MP4");
  const [chosenResolution, setChosenResolution] = useState<Resolution>("1080p");
  const [chosenLicense, setChosenLicense] = useState<LicenseType>("Standard License");

  // Download simulation parameters
  const [downloadingState, setDownloadingState] = useState<"idle" | "preparing" | "downloading" | "finished">("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [downloadSize, setDownloadSize] = useState("");

  // Share Simulation
  const [shareFeedback, setShareFeedback] = useState(false);

  // New Collection creation helper inside library page
  const [newCollName, setNewCollName] = useState("");
  const [newCollDesc, setNewCollDesc] = useState("");
  const [showCollCreatorInput, setShowCollCreatorInput] = useState(false);
  const [addToCollId, setAddToCollId] = useState("");

  // Categories list retrieved from standard filters requirement
  const categories: Category[] = [
    "3D Animation",
    "Motion Graphics",
    "Technology",
    "Advertising",
    "Brands",
    "Social Media",
    "Corporate",
    "Product Animation",
    "Logo Reveal",
    "Typography",
    "Transitions",
    "Cinematic",
    "Infographics",
    "UI Animation",
    "Gaming",
    "NFT",
    "AI Technology",
    "Futuristic",
    "Medical",
    "Education",
  ];

  const sortingOptions = ["Trending", "Newest", "Most Downloaded", "Highest Rated", "Featured"];

  // Handle voice search activation
  const startVoiceSearch = () => {
    setIsListening(true);
    let interval = setInterval(() => {
      // Simulate moving speech level bars
      setVoiceVolume(Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 10));
    }, 100);

    // After 2.5 seconds, complete mock audio search
    setTimeout(() => {
      clearInterval(interval);
      setIsListening(false);
      const randomTrend = trendingSearches[Math.floor(Math.random() * trendingSearches.length)];
      setSearchQuery(randomTrend);
    }, 2800);
  };

  // Filter & Sort video array
  const filteredVideos = MOCK_VIDEOS.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (selectedSort === "Newest") {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
    if (selectedSort === "Most Downloaded") {
      return b.downloads - a.downloads;
    }
    if (selectedSort === "Highest Rated") {
      return b.rating - a.rating;
    }
    if (selectedSort === "Featured") {
      return a.id.localeCompare(b.id); // arbitrary mock deterministic logic
    }
    // Default "Trending": Downloads * rating weight
    return b.downloads * b.rating - a.downloads * a.rating;
  });

  // Open Preview Modal helper
  const handleOpenPreview = (video: MotionVideo) => {
    setSelectedVideo(video);
    setModalSpeed(video.baseSpeed);
    setModalGlow(true);
    setModalIntensity(3);
    setChosenFormat(video.fileFormat);
    setChosenResolution(video.resolution);
    setIsPlaying(true);
    // Reset downloads
    setDownloadingState("idle");
    setDownloadProgress(0);
  };

  // Trigger simulated file export
  const handleBeginDownload = () => {
    if (!selectedVideo) return;
    setDownloadingState("preparing");
    setDownloadProgress(3);

    setTimeout(() => {
      setDownloadingState("downloading");

      let currentPrg = 5;
      const speedMb = (Math.random() * 10 + 5).toFixed(1);
      const calculatedWeight = chosenResolution === "8K" ? 180 : chosenResolution === "4K" ? 95 : chosenResolution === "2K" ? 45 : 22;
      setDownloadSpeed(`${speedMb} MB/s`);
      setDownloadSize(`${calculatedWeight} MB`);

      const progressTimer = setInterval(() => {
        currentPrg += Math.floor(Math.random() * 15) + 6;
        if (currentPrg >= 100) {
          currentPrg = 100;
          clearInterval(progressTimer);
          setDownloadingState("finished");
          onDownloadCompleted(
            selectedVideo.id,
            `${selectedVideo.title.replace(/\s+/g, "_")}_${chosenResolution}.${chosenFormat.toLowerCase().replace("lottie json", "json")}`,
            chosenFormat,
            chosenResolution,
            chosenLicense
          );
        }
        setDownloadProgress(currentPrg);
      }, 200);
    }, 1200);
  };

  // Safe simulated share link
  const triggerMockShareCopy = () => {
    if (!selectedVideo) return;
    setShareFeedback(true);
    navigator.clipboard?.writeText(
      `${window.location.origin}/preview/${selectedVideo.id}?res=${chosenResolution}&format=${chosenFormat}`
    );
    setTimeout(() => setShareFeedback(false), 2000);
  };

  // Related items filter
  const relatedVideos = selectedVideo
    ? MOCK_VIDEOS.filter((v) => v.category === selectedVideo.category && v.id !== selectedVideo.id).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto pb-24">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[700px] h-[700px] bg-cyan-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Advanced search section */}
      <div className="mb-10 text-center relative py-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans max-w-3xl mx-auto leading-tight">
          Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">3D Kinetic Assets</span>
        </h1>
        <p className="text-gray-400 font-sans mt-3 max-w-2xl mx-auto">
          Explore thousands of procedural motion graphics templates. Adjust vectors, glow metrics, and speed multipliers natively in our real-time 3D sandbox.
        </p>

        {/* Real search system container */}
        <div className="max-w-2xl mx-auto mt-8 relative">
          <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-1.5 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 shadow-2xl transition-all">
            <Search className="w-5 h-5 text-gray-500 left-4 shrink-0 ml-3" />
            <input
              id="library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search animations, templates, transitions, motion graphics..."
              className="w-full bg-transparent px-3 py-3 font-sans text-sm text-white focus:outline-none placeholder:text-gray-600"
            />

            {/* Voice Search Trigger buttons */}
            <div className="flex items-center gap-1.5 px-2">
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  onClick={() => setSearchQuery("")}
                  className="p-2 text-gray-500 hover:text-white hover:bg-slate-900 rounded-xl"
                  title="Clear Query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                id="btn-voice-search"
                onClick={startVoiceSearch}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? "bg-red-950 border-red-500 text-red-400 animate-pulse"
                    : "bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-850 hover:border-slate-700"
                }`}
                title="Voice Search"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Holographic Voice Microphone wave indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 top-full left-0 right-0 mt-3 p-4 bg-slate-950 border border-red-900/60 rounded-2xl flex flex-col items-center shadow-2xl shadow-red-950/30 font-mono text-xs"
              >
                <div className="text-red-400 uppercase font-bold tracking-widest flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                  SYS.MIC ACTIVE - TRANSMITTING DATASTREAM
                </div>
                <div className="flex gap-1 h-12 items-center px-4 mb-2">
                  {voiceVolume.map((vol, index) => (
                    <div
                      key={index}
                      className="w-1.5 bg-red-500 rounded-full transition-all duration-75"
                      style={{ height: `${vol}%` }}
                    />
                  ))}
                </div>
                <div className="text-gray-500 text-[10px]">Listening to cosmic design vibrations...</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Autosuggestions overlay */}
          {showSuggestions && !isListening && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl p-4 z-20 text-left">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">QUERY RECOMMENDATIONS</span>
                <button
                  id="btn-close-suggestions"
                  onClick={() => setShowSuggestions(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 font-sans mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Recent Search Terms
                  </h4>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left text-sm py-1.5 px-2.5 rounded-lg hover:bg-slate-900/70 text-gray-300 font-sans transition-all hover:text-white flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-gray-500 rounded-full" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-400 font-sans mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> Popular Trending Now
                  </h4>
                  <div className="space-y-1">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left text-sm py-1.5 px-2.5 rounded-lg hover:bg-slate-900/70 text-gray-300 font-sans transition-all hover:text-cyan-400 flex items-center gap-2"
                      >
                        <ChevronRight className="w-3 h-3 text-cyan-400" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main layout container with sidebar and grid options */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Toggleable Sidebar for Filters */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "280px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="w-full lg:w-72 shrink-0 border border-slate-900 rounded-2xl bg-slate-950/40 p-5 backdrop-blur-sm self-start relative"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
                <span className="flex items-center gap-2 text-sm font-bold font-mono text-white">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> CRITERIA FILTERS
                </span>
                <button
                  id="btn-hide-sidebar"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categorization scroll container */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono text-gray-500 uppercase mb-3">Categories ({categories.length})</h4>
                  <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                    <button
                      id="btn-cat-all"
                      onClick={() => setSelectedCategory("All")}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl font-mono transition-all flex justify-between items-center ${
                        selectedCategory === "All"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "text-gray-400 hover:bg-slate-900/50 hover:text-white"
                      }`}
                    >
                      <span>ALL DEPOSITORIES</span>
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-gray-500">{MOCK_VIDEOS.length}</span>
                    </button>

                    {categories.map((cat, idx) => {
                      const count = MOCK_VIDEOS.filter((v) => v.category === cat).length;
                      return (
                        <button
                          key={cat}
                          id={`btn-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-sans transition-all flex justify-between items-center ${
                            selectedCategory === cat
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold"
                              : "text-gray-400 hover:bg-slate-900/40 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          {count > 0 && (
                            <span className="bg-slate-900 px-1 rounded text-[9px] text-gray-400">{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort selector inside sidebar */}
                <div>
                  <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">Sorting Order</h4>
                  <div className="space-y-1">
                    {sortingOptions.map((opt) => (
                      <button
                        key={opt}
                        id={`btn-sort-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setSelectedSort(opt)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg font-sans transition-all flex items-center justify-between ${
                          selectedSort === opt
                            ? "text-cyan-400 font-semibold bg-slate-900/60"
                            : "text-gray-400 hover:text-white hover:bg-slate-950/30"
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedSort === opt && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collections lists sidebar integration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-mono text-gray-500 uppercase">My Collections</h4>
                    <Folder className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto">
                    {collections.length === 0 ? (
                      <div className="text-[10px] p-2 text-gray-600 font-mono text-center border border-dashed border-slate-900 rounded-lg">
                        Empty collections array
                      </div>
                    ) : (
                      collections.map((col) => (
                        <div
                          key={col.id}
                          className="p-2 bg-slate-950/60 rounded-lg border border-slate-900 text-[11px] flex justify-between items-center"
                        >
                          <span className="font-semibold text-gray-300 truncate max-w-[130px]">{col.name}</span>
                          <span className="text-[9px] font-mono bg-purple-950 text-purple-400 px-1 rounded">
                            {col.videoIds.length} assets
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900">
                  <div className="text-[10px] text-gray-600 font-mono leading-relaxed">
                    SECURED MATRIX LICENSE INCLUDES ENHANCED CLEARANCE STATUS.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Container */}
        <div className="flex-1 w-full">
          {/* Top action bar: Sidebar toggle, search status, grid style toggle */}
          <div className="flex items-center justify-between mb-6 bg-slate-950/60 p-4 border border-slate-900 rounded-2xl">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  id="btn-show-sidebar"
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-cyan-400 hover:border-slate-700 transition"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Shows Filters
                </button>
              )}
              <span className="text-xs text-gray-400 font-mono">
                Showing <span className="text-white font-bold">{filteredVideos.length}</span> animations
              </span>
            </div>

            {/* Grid & Masonry controls */}
            <div className="flex items-center gap-2">
              <button
                id="btn-view-grid"
                onClick={() => setViewStyle("grid")}
                className={`p-2 rounded-xl border transition-all ${
                  viewStyle === "grid"
                    ? "bg-slate-900 border-cyan-500/30 text-cyan-400"
                    : "border-slate-850 text-gray-500 hover:text-white"
                }`}
                title="Netflix Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-masonry"
                onClick={() => setViewStyle("masonry")}
                className={`p-2 rounded-xl border transition-all ${
                  viewStyle === "masonry"
                    ? "bg-slate-900 border-cyan-500/30 text-cyan-400"
                    : "border-slate-850 text-gray-500 hover:text-white"
                }`}
                title="Staggered Masonry feel"
              >
                <SquareStack className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fallback for zero matching assets */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-20 bg-slate-950/30 border border-slate-900 rounded-2xl">
              <Sparkles className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white font-sans">Zero Particles Matching</h3>
              <p className="text-sm text-gray-500 font-sans mt-2 max-w-sm mx-auto">
                No active motion graphics assets met your query parameters. Try choosing another category or clearing filters.
              </p>
              <button
                id="btn-reset-filters"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-6 px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 hover:text-white rounded-xl transition"
              >
                Reset Search States
              </button>
            </div>
          )}

          {/* Cards Grid representation */}
          <div
            className={`grid gap-6 ${
              viewStyle === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1 md:grid-cols-3 xl:grid-cols-3 items-start"
            }`}
          >
            {filteredVideos.map((video, vIdx) => {
              const isFav = favorites.includes(video.id);
              const customBorderColor = `${video.color}33`; // custom Tailwind glow color hex
              return (
                <motion.div
                  key={video.id}
                  id={`card-video-${video.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(vIdx * 0.05, 0.4) }}
                  whileHover={{ y: -6 }}
                  className="flex flex-col bg-slate-950/70 border border-slate-900 rounded-2xl overflow-hidden relative group hover:border-slate-800 transition-all hover:shadow-2xl hover:shadow-slate-950/80"
                  style={{
                    borderColor: isFav ? video.color : undefined,
                  }}
                >
                  {/* Aspect-like box indicating vector procedural */}
                  <div className="aspect-[16/10] bg-slate-950 border-b border-slate-900/60 relative overflow-hidden flex items-center justify-center">
                    {/* Glowing color gradient background mesh */}
                    <div
                      className="absolute inset-0 opacity-15 blur-2xl transition-all duration-300 group-hover:scale-125"
                      style={{
                        background: `radial-gradient(circle, ${video.color} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Preview procedural vectors in thumbnail frame (non-interactive, slowly spins) */}
                    <div className="absolute inset-2 z-0 opacity-55 saturate-50 group-hover:opacity-100 transition-all pointer-events-none">
                      <ProceduralPlayer
                        proceduralType={video.proceduralType}
                        color={video.color}
                        secondaryColor={video.secondaryColor}
                        speedMultiplier={0.25}
                        glowOn={true}
                        intensity={2}
                        isPlaying={true}
                      />
                    </div>

                    {/* Hover items or overlay info */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex flex-col justify-between p-4">
                      {/* Favorite & Quick Collection add buttons */}
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-mono px-2 py-1 bg-slate-900 border border-slate-800 text-cyan-400 rounded-full">
                          {video.resolution} @ {video.fileFormat}
                        </span>
                        
                        <div className="flex gap-1.5">
                          <button
                            id={`btn-fav-card-${video.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(video.id);
                            }}
                            className={`p-2 rounded-xl transition ${
                              isFav ? "bg-red-950 border border-red-800 text-red-500" : "bg-slate-900/90 text-gray-400 hover:text-white"
                            }`}
                            title="Add/Remove Favorite"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Large Center Play Icon triggering Preview */}
                      <button
                        id={`btn-play-trigger-${video.id}`}
                        onClick={() => handleOpenPreview(video)}
                        className="mx-auto w-12 h-12 bg-cyan-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/20 transform scale-75 group-hover:scale-100 hover:bg-white transition-all cursor-pointer"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>

                      {/* Timeline duration info bottom row */}
                      <div className="flex justify-between text-[11px] font-mono text-gray-400">
                        <span>{video.duration}s rendering loop</span>
                        <span className="text-cyan-400 font-bold">{video.proceduralType.toUpperCase()} Engine</span>
                      </div>
                    </div>

                    {/* Default visible badges before hovering */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center pointer-events-none group-hover:opacity-0 transition-opacity">
                      <span className="text-[9px] font-mono uppercase bg-slate-950/90 border border-slate-900 px-2 py-0.5 rounded text-gray-400">
                        {video.category}
                      </span>
                      <span className="text-[9px] font-mono bg-cyan-950/90 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded">
                        ★ {video.rating}
                      </span>
                    </div>
                  </div>

                  {/* Description Info area */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-sans font-bold text-base group-hover:text-cyan-400 transition">
                        {video.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1.5 font-sans leading-relaxed line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    {/* Publisher node detail */}
                    <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={video.creator.avatarUrl}
                          alt={video.creator.name}
                          className="w-5.5 h-5.5 rounded-full object-cover border border-slate-800"
                        />
                        <span className="text-gray-400 font-sans truncate max-w-[120px]">{video.creator.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                        <ArrowDownToLine className="w-3 h-3 text-cyan-400" />
                        <span>{video.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAILED HUD PREVIEW MODAL */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch"
            >
              {/* Left Cinematic Player side */}
              <div className="flex-1 min-h-[300px] md:min-h-auto flex flex-col justify-between p-6 bg-slate-950 relative border-r border-slate-900">
                <div className="flex justify-between items-center mb-4 z-10">
                  <span className="text-xs font-mono uppercase bg-slate-900 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
                    {selectedVideo.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      id="btn-play-pause-modal"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-slate-900 hover:bg-slate-850 rounded-xl text-white transition"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Real-time Renderer Player box container */}
                <div className="aspect-[16/10] bg-black h-72 rounded-2xl relative overflow-hidden border border-slate-900 flex items-center justify-center mb-6">
                  <ProceduralPlayer
                    proceduralType={selectedVideo.proceduralType}
                    color={selectedVideo.color}
                    secondaryColor={selectedVideo.secondaryColor}
                    speedMultiplier={modalSpeed}
                    glowOn={modalGlow}
                    intensity={modalIntensity}
                    isPlaying={isPlaying}
                  />
                </div>

                {/* Live Sandbox tuning parameters */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4.5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-slate-900/60">
                    <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-purple-400" /> LIVE PARAMETER SANDBOX</span>
                    <span className="text-cyan-400 text-[10px]">Real-Time WebGL</span>
                  </div>

                  {/* Velocity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-gray-400">
                      <span>FLOW SPEED MULTIPLIER</span>
                      <span className="text-white">{modalSpeed.toFixed(2)}x</span>
                    </div>
                    <input
                      id="slider-model-speed"
                      type="range"
                      min="0.25"
                      max="3.0"
                      step="0.05"
                      value={modalSpeed}
                      onChange={(e) => setModalSpeed(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Render Density sliders */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-gray-400">
                      <span>PARTICLE GLOW VOLUMES</span>
                      <span className="text-white">Intensity {modalIntensity}/5</span>
                    </div>
                    <input
                      id="slider-model-intensity"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={modalIntensity}
                      onChange={(e) => setModalIntensity(parseInt(e.target.value))}
                      className="w-full accent-purple-400"
                    />
                  </div>

                  {/* Holographic bloom toggles */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-gray-400">ATMOSPHERIC RENDER BLOOM</span>
                    <button
                      id="btn-toggle-glow"
                      onClick={() => setModalGlow(!modalGlow)}
                      className={`px-3 py-1 text-[10px] font-mono rounded border transition-all ${
                        modalGlow
                          ? "bg-cyan-950/40 text-cyan-400 border-cyan-500/30 font-black"
                          : "bg-slate-900 text-gray-500 border-slate-800"
                      }`}
                    >
                      {modalGlow ? "SYS_BLUR: ENABLED" : "SYS_BLUR: DISABLED"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right metadata controls side */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto bg-slate-950">
                {/* Close modal button top right */}
                <button
                  id="btn-close-modal"
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-gray-400 hover:text-white transition cursor-pointer z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* General metadata text card info */}
                <div>
                  <h2 className="text-2xl font-bold font-sans text-white pr-8 leading-tight">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-400 text-xs font-sans mt-3 leading-relaxed">
                    {selectedVideo.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {selectedVideo.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono bg-slate-900 px-2.5 py-1 rounded text-gray-400">
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* File parameters download selection */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-900">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">TARGET RESOLUTION</label>
                      <select
                        id="select-download-res"
                        value={chosenResolution}
                        onChange={(e) => setChosenResolution(e.target.value as Resolution)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-sans focus:outline-none"
                      >
                        <option value="720p">720p (Personal Preview)</option>
                        <option value="1080p">1080p (Full Standard HD)</option>
                        <option value="2K">2K Quad High-Definition</option>
                        <option value="4K">4K Master (Pro Studio unlock)</option>
                        <option value="8K">8K Cinema (Enterprise partner)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">OUTPUT FILE FORMAT</label>
                      <select
                        id="select-download-format"
                        value={chosenFormat}
                        onChange={(e) => setChosenFormat(e.target.value as Format)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-sans focus:outline-none"
                      >
                        <option value="MP4">Standard MP4 (H.264)</option>
                        <option value="MOV">MOV (Apple ProRes raw)</option>
                        <option value="WEBM">WebM Video (Alpha channel support)</option>
                        <option value="GIF">Animated Web GIF</option>
                        <option value="Lottie JSON">Lottie JSON Vector</option>
                      </select>
                    </div>
                  </div>

                  {/* Licensing tier matrix description */}
                  <div className="mt-5">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">LICENSING SYSTEM TYPE</label>
                    <select
                      id="select-download-license"
                      value={chosenLicense}
                      onChange={(e) => {
                        setChosenLicense(e.target.value as LicenseType);
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-sans focus:outline-none"
                    >
                      <option value="Free License">Free License (Attribute Required)</option>
                      <option value="Standard License">Standard Studio License (Single Worksite)</option>
                      <option value="Commercial License">Commercial Broadcast Clearance (royalty safety)</option>
                      <option value="Enterprise License">Enterprise global distribution buyout</option>
                    </select>

                    <p className="text-[10px] text-gray-400 mt-2 font-mono leading-relaxed bg-slate-950 border border-slate-900 p-2.5 rounded-lg flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      {chosenLicense === "Free License" && "Permitted on personal prototypes. Author credit must link back to NeoMotion Studio."}
                      {chosenLicense === "Standard License" && "Single commercial project. Uncapped broadcast impressions, client layout representation."}
                      {chosenLicense === "Commercial License" && "Royalty safety blanket. Multiple advertisements, broadcasting on streaming channels."}
                      {chosenLicense === "Enterprise License" && "Buyout. Full patent matrix protections, indemnification package included."}
                    </p>
                  </div>

                  {/* Add to collection system list */}
                  <div className="mt-5 border-t border-slate-900 pt-4">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">SAVE TO CHOSEN COLLECTION</label>
                    <div className="flex gap-2 items-center">
                      <select
                        id="select-target-collection"
                        value={addToCollId}
                        onChange={(e) => setAddToCollId(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-sans focus:outline-none"
                      >
                        <option value="">-- Choose active collection --</option>
                        {collections.map((col) => {
                          const alreadyIn = col.videoIds.includes(selectedVideo.id);
                          return (
                            <option key={col.id} value={col.id}>
                              {col.name} {alreadyIn ? "(CONTAINS ASSET)" : "(empty)"}
                            </option>
                          );
                        })}
                      </select>

                      <button
                        id="btn-add-to-coll"
                        disabled={!addToCollId}
                        onClick={() => {
                          const col = collections.find((c) => c.id === addToCollId);
                          if (!col) return;
                          if (col.videoIds.includes(selectedVideo.id)) {
                            removeVideoFromCollection(addToCollId, selectedVideo.id);
                          } else {
                            addVideoToCollection(addToCollId, selectedVideo.id);
                          }
                          // trigger mock soft state shift
                          setAddToCollId("");
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-mono border border-slate-800 disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {addToCollId && collections.find((c) => c.id === addToCollId)?.videoIds.includes(selectedVideo.id) ? (
                          <>
                            <X className="w-3.5 h-3.5 text-red-500" /> Remove
                          </>
                        ) : (
                          <>
                            <FolderPlus className="w-3.5 h-3.5 text-purple-400" /> Append
                          </>
                        )}
                      </button>
                    </div>

                    {/* Collection Creator helper if user wishes to create a list */}
                    <div className="mt-2.5">
                      {!showCollCreatorInput ? (
                        <button
                          id="btn-toggle-coll-creator"
                          onClick={() => setShowCollCreatorInput(true)}
                          className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Initialize new custom collection folder
                        </button>
                      ) : (
                        <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-900">
                          <input
                            id="input-new-coll-name"
                            type="text"
                            placeholder="Collection Name (e.g. Website Overlays)..."
                            value={newCollName}
                            onChange={(e) => setNewCollName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs text-white"
                          />
                          <input
                            id="input-new-coll-desc"
                            type="text"
                            placeholder="Description..."
                            value={newCollDesc}
                            onChange={(e) => setNewCollDesc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs text-white"
                          />
                          <div className="flex gap-1.5 justify-end">
                            <button
                              id="btn-cancel-new-coll"
                              onClick={() => setShowCollCreatorInput(false)}
                              className="px-2 py-1 bg-slate-900 text-gray-400 text-[10px] rounded"
                            >
                              Cancel
                            </button>
                            <button
                              id="btn-save-new-coll"
                              onClick={() => {
                                if (newCollName) {
                                  createCollection(newCollName, newCollDesc);
                                  setNewCollName("");
                                  setNewCollDesc("");
                                  setShowCollCreatorInput(false);
                                }
                              }}
                              className="px-2.5 py-1 bg-cyan-400 text-slate-950 text-[10px] rounded font-bold"
                            >
                              Create Folder
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Download progress and triggers */}
                <div className="mt-8 border-t border-slate-900/60 pt-6">
                  {downloadingState !== "idle" && (
                    <div className="mb-4 bg-slate-900/70 p-4 border border-slate-800 rounded-2xl relative overflow-hidden">
                      <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-1.5">
                        <span className="text-cyan-400 uppercase tracking-widest font-bold">
                          {downloadingState === "preparing" ? "ANALYZING CHANNELS..." : downloadingState === "downloading" ? "DOWNLOADING ASSETS..." : "EXPORT SECURED"}
                        </span>
                        <span>{downloadProgress}%</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full transition-all duration-100"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>

                      {downloadingState === "downloading" && (
                        <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-2">
                          <span>Speed: {downloadSpeed}</span>
                          <span>Weight: {downloadSize}</span>
                        </div>
                      )}

                      {downloadingState === "finished" && (
                        <div className="flex items-center gap-1.5 text-xs font-mono text-green-400 mt-2">
                          <CheckCheck className="w-4 h-4" /> Export successfully resolved to User Dashboard.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      id="btn-download-center-trigger"
                      onClick={handleBeginDownload}
                      disabled={downloadingState !== "idle" && downloadingState !== "finished"}
                      className="flex-1 py-4 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 hover:shadow-cyan-400/20 active:scale-[0.98] transition font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>{downloadingState === "finished" ? "Download Again" : "Download Vector Module"}</span>
                    </button>

                    <button
                      id="btn-share-trigger"
                      onClick={triggerMockShareCopy}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white hover:border-slate-700 hover:bg-slate-850 active:scale-95 transition-all relative"
                      title="Generate Clipboard Share Link"
                    >
                      <Share2 className="w-5 h-5" />
                      {shareFeedback && (
                        <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2.5 py-1 bg-cyan-400 text-slate-950 font-mono text-[10px] rounded shadow-lg uppercase font-bold tracking-wider pointer-events-none whitespace-nowrap">
                          Copied
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Related recommended items section */}
                {relatedVideos.length > 0 && (
                  <div className="mt-8 border-t border-slate-900 pt-6">
                    <h4 className="text-xs font-mono text-gray-500 uppercase mb-3">RELATED SAME-DEPOT ANIMATIONS</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {relatedVideos.map((rv) => (
                        <div
                          key={rv.id}
                          onClick={() => {
                            // Swap focus inside modal
                            handleOpenPreview(rv);
                          }}
                          className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 cursor-pointer hover:border-cyan-400/50 transition-all text-left"
                        >
                          <div className="aspect-[16/10] bg-black rounded-lg mb-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-transparent" />
                            <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-slate-950 px-1 rounded text-cyan-400">
                              {rv.resolution}
                            </span>
                          </div>
                          <h5 className="text-[11px] font-bold text-white truncate font-sans">{rv.title}</h5>
                          <p className="text-[9px] text-gray-500 font-sans mt-0.5 truncate">{rv.creator.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
