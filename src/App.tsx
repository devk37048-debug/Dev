import React, { useState } from "react";
import {
  Film,
  Search,
  Sparkles,
  TrendingUp,
  Tv,
  Flame,
  ShieldCheck,
  Layers,
  Globe,
  HelpCircle,
  Send,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Lock,
  Plus,
  Play,
  FolderPlus,
  FolderOpen,
  ArrowUpRight,
  MessageSquare,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import ThreeCanvas from "./components/ThreeCanvas";
import PricingSection from "./components/PricingSection";
import ContactForm from "./components/ContactForm";
import MotionLibrary from "./components/MotionLibrary";
import VideoImportDashboard from "./components/VideoImportDashboard";
import UserDashboard from "./components/UserDashboard";
import ProceduralPlayer from "./components/ProceduralPlayer";

import { MOCK_VIDEOS } from "./data/mockVideos";
import { UserProfile, Collection, MotionVideo, Format, Resolution, LicenseType } from "./types";

interface DownloadRecord {
  videoId: string;
  filename: string;
  format: Format;
  resolution: Resolution;
  license: LicenseType;
  date: string;
}

export default function App() {
  const [activePage, setActivePage] = useState<"home" | "library" | "import" | "dashboard">("home");

  // Shared User Profile, Syncing Subscription plan across application
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sonu Kumar",
    email: "sonuk6474@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    tier: "Pro Studio",
    subscriptionActive: true,
    joinedDate: "2026-06-11",
  });

  // Shared Library State variables
  const [favorites, setFavorites] = useState<string[]>(["mv-01", "mv-03"]);
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "coll-01",
      name: "High Tech Promos",
      description: "Quick templates for corporate overlays and cyber displays.",
      videoIds: ["mv-01", "mv-04"],
      createdAt: "2026-06-11",
    },
    {
      id: "coll-02",
      name: "UI Micro-interactives",
      description: "Interactive assets for mobile layout responses.",
      videoIds: ["mv-03"],
      createdAt: "2026-06-11",
    }
  ]);

  const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>([
    {
      videoId: "mv-01",
      filename: "Quantum_Nexus_Grid_4K.mp4",
      format: "MP4",
      resolution: "4K",
      license: "Standard License",
      date: "2026-06-11 07:12",
    },
    {
      videoId: "mv-03",
      filename: "Cyberpunk_Ring_1080p.json",
      format: "Lottie JSON",
      resolution: "1080p",
      license: "Free License",
      date: "2026-06-11 07:15",
    }
  ]);

  const [uploadedVideosList, setUploadedVideosList] = useState<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    proceduralType: "ring" | "particles" | "sine" | "dna" | "matrix" | "quantum" | "gravity" | "hologram";
    color: string;
    date: string;
  }>>([
    {
      id: "upl-01",
      title: "Glitch Spectrum Analyzer",
      description: "Custom uploaded audio responder waveform loop.",
      category: "Futuristic",
      proceduralType: "sine",
      color: "#FF00E5",
      date: "2026-06-11 07:18",
    }
  ]);

  // Handle subscriber tier update from pricing
  const handleOnSubscribe = (tierName: "Free Member" | "Pro Studio" | "Enterprise Partner") => {
    setProfile(prev => ({
      ...prev,
      tier: tierName,
      subscriptionActive: true,
    }));
    alert(`Registration Confirmed: Welcome to our premium "${tierName}" membership level! Your workspace privileges have updated.`);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const createCollection = (name: string, description: string) => {
    const newColl: Collection = {
      id: `coll-${Date.now()}`,
      name,
      description,
      videoIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCollections(prev => [...prev, newColl]);
  };

  const deleteCollection = (colId: string) => {
    setCollections(prev => prev.filter(c => c.id !== colId));
  };

  const addVideoToCollection = (collectionId: string, videoId: string) => {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId
          ? { ...c, videoIds: c.videoIds.includes(videoId) ? c.videoIds : [...c.videoIds, videoId] }
          : c
      )
    );
  };

  const removeVideoFromCollection = (collectionId: string, videoId: string) => {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId ? { ...c, videoIds: c.videoIds.filter(id => id !== videoId) } : c
      )
    );
  };

  const handleDownloadCompleted = (
    videoId: string,
    filename: string,
    format: Format,
    resolution: Resolution,
    license: LicenseType
  ) => {
    const newRecord: DownloadRecord = {
      videoId,
      filename,
      format,
      resolution,
      license,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setDownloadHistory(prev => [newRecord, ...prev]);

    // Increment downloads count in original mocked reference dynamically
    const found = MOCK_VIDEOS.find(v => v.id === videoId);
    if (found) {
      found.downloads += 1;
    }
  };

  const handleAddNewUploadedVideo = (videoData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    fileFormat: Format;
    proceduralType: "ring" | "particles" | "sine" | "dna" | "matrix" | "quantum" | "gravity" | "hologram";
    color: string;
  }) => {
    const newId = `upl-${Date.now()}`;
    const newUpl = {
      id: newId,
      title: videoData.title,
      description: videoData.description,
      category: videoData.category,
      proceduralType: videoData.proceduralType,
      color: videoData.color,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setUploadedVideosList(prev => [newUpl, ...prev]);

    // Construct full library simulation item to inject dynamically
    const newLibItem: MotionVideo = {
      id: newId,
      title: videoData.title,
      description: videoData.description,
      category: videoData.category as Category,
      duration: 12,
      downloads: 120,
      rating: 4.9,
      creator: {
        name: "NeoMotion AI Creator",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
        verified: true,
      },
      fileFormat: videoData.fileFormat,
      resolution: "4K",
      tags: videoData.tags.length > 0 ? videoData.tags : ["AI_GENERATED", "PROCEDURAL", "KINETIC"],
      publishDate: new Date().toISOString().split("T")[0],
      proceduralType: videoData.proceduralType,
      color: videoData.color,
      secondaryColor: "#ffffff",
      baseSpeed: 1.2,
    };

    MOCK_VIDEOS.unshift(newLibItem);
  };

  // Helper state to open Library Modal from external pages (e.g., Homepage Carousel)
  const [selectedVideoShared, setSelectedVideoShared] = useState<MotionVideo | null>(null);

  // Home slider active carousel item index
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselItems = MOCK_VIDEOS.slice(0, 4);

  const shiftCarousel = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCarouselIdx(prev => (prev === 0 ? carouselItems.length - 1 : prev - 1));
    } else {
      setCarouselIdx(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div id="neomotion-app-root" className="min-h-screen bg-[#050816] text-[#dee2e6] relative overflow-x-hidden font-sans">
      {/* Immersive interactive Canvas Background */}
      <ThreeCanvas />

      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050816]/75 backdrop-blur-md border-b border-slate-900/60 px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          {/* Logo brand */}
          <button
            id="btn-nav-home-logo"
            onClick={() => setActivePage("home")}
            className="flex items-center gap-3 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-slate-950 font-black relative overflow-hidden shadow-lg shadow-cyan-900/40 group-hover:scale-105 transition-all">
              <Film className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-wider text-white inline-block">
                NEOMOTION
              </span>
              <span className="text-[10px] font-mono text-cyan-400 block tracking-widest leading-none">
                STUDIO R4
              </span>
            </div>
          </button>

          {/* Navigation Controls */}
          <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
            <button
              id="btn-nav-home"
              onClick={() => setActivePage("home")}
              className={`px-4 py-2 rounded-xl transition ${
                activePage === "home" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-gray-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              id="btn-nav-library"
              onClick={() => setActivePage("library")}
              className={`px-4 py-2 rounded-xl transition ${
                activePage === "library" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-gray-400 hover:text-white"
              }`}
            >
              Motion Library
            </button>
            <button
              id="btn-nav-import"
              onClick={() => setActivePage("import")}
              className={`px-4 py-2 rounded-xl transition ${
                activePage === "import" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-gray-400 hover:text-white"
              }`}
            >
              Video Ingest
            </button>
            <button
              id="btn-nav-dashboard"
              onClick={() => setActivePage("dashboard")}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activePage === "dashboard" ? "bg-slate-900 text-cyan-400 border border-slate-800" : "text-gray-400 hover:text-white"
              }`}
            >
              User Portal
              {favorites.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-ping" />
              )}
            </button>
          </nav>

          {/* Quick Member indicator / CTA */}
          <div className="flex items-center gap-3">
            <button
              id="btn-header-tier-cta"
              onClick={() => {
                setActivePage("dashboard");
              }}
              className="hidden lg:flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 hover:border-cyan-400/30 transition-all group font-mono text-xs text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
              <div>
                <span className="text-[9px] text-gray-505 block leading-none">MEMBER STATUS</span>
                <span className="text-white font-bold tracking-wide group-hover:text-cyan-300 transition-colors">
                  {profile.tier}
                </span>
              </div>
            </button>

            <button
              id="btn-header-commission-cta"
              onClick={() => {
                setActivePage("home");
                setTimeout(() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }, 200);
              }}
              className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition shadow-md shadow-cyan-950/30 active:scale-95"
            >
              Hire Studio
            </button>
          </div>
        </div>
      </header>

      {/* Pages Container with clean transitions */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* IMMERSIVE 3D HERO SECTION */}
              <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20 px-4">
                {/* Visual grid floating widget overlays representing HUD */}
                <div className="absolute top-1/4 left-10 hidden xl:block p-3.5 bg-slate-950/80 border border-cyan-500/20 rounded-2xl font-mono text-[9px] space-y-1.5 text-left text-cyan-400 pointer-events-none shadow-2xl">
                  <div className="border-b border-cyan-500/10 pb-1 mb-1 font-bold">ATMOSPHERIC TELEMETRY</div>
                  <div>SURFACE_LATENCY: 1.14MS</div>
                  <div>GPU_THREADS: 256 / 256</div>
                  <div>SENSORS: ONLINE</div>
                </div>

                <div className="absolute bottom-1/4 right-10 hidden xl:block p-3.5 bg-slate-950/80 border border-purple-500/20 rounded-2xl font-mono text-[9px] space-y-1.5 text-left text-purple-400 pointer-events-none shadow-2xl">
                  <div className="border-b border-purple-500/10 pb-1 mb-1 font-bold">ENGINE COORDINATES</div>
                  <div>PROJ: THREE_CANVAS_2D</div>
                  <div>ANGLES: ROTATING_HELIX_3D</div>
                  <div>COMPRESSION: LOTTIE_COMPLIANT</div>
                </div>

                <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10 select-none">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono bg-cyan-950/60 px-4 py-1.5 rounded-full border border-cyan-500/30">
                      Bring Ideas To Life In Motion
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-white leading-tight"
                  >
                    Cinematic 3D Animations For <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-cyan-400 to-neon-purple drop-shadow-lg">Futuristic Digital Pipelines</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed"
                  >
                    Premium 3D Animation, Motion Graphics, Product Visualization & Creative Video Solutions. Tune assets dynamically, optimize bit-rates, and download royalty-free layouts instantly.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-4 pt-6"
                  >
                    <button
                      id="btn-hero-explore"
                      onClick={() => setActivePage("library")}
                      className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold tracking-wider uppercase text-sm shadow-xl shadow-cyan-950/50 hover:shadow-cyan-400/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explore Library</span>
                    </button>

                    <button
                      id="btn-hero-portfolio"
                      onClick={() => {
                        document.getElementById("latest-projects")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-8 py-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-mono font-bold tracking-wider uppercase text-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <span>View Portfolio</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </motion.div>
                </div>

                {/* Sub-scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 text-gray-500 text-[10px] uppercase font-mono animate-bounce">
                  <span>DISCOVER PIPELINE SYSTEMS</span>
                  <div className="w-[1px] h-6 bg-cyan-400/50" />
                </div>
              </section>

              {/* CLIENT LOGOS BAND */}
              <section className="py-12 border-y border-slate-950/60 bg-slate-950/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-around gap-8 text-center text-xs text-gray-500 font-mono font-bold tracking-widest">
                  <span className="hover:text-cyan-400 transition-colors">SAMSUNG DESIGN</span>
                  <span className="hover:text-cyan-400 transition-colors">NVIDIA HORIZON</span>
                  <span className="hover:text-cyan-400 transition-colors">ADOBE STOCK INC</span>
                  <span className="hover:text-cyan-400 transition-colors">AUTODESK CREATOR</span>
                  <span className="hover:text-cyan-400 transition-colors">EPIC METAVERSE</span>
                </div>
              </section>

              {/* FEATURED VIDEOS CAROUSEL */}
              <section className="py-20 max-w-7xl mx-auto px-4 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                      CURATED SELECTION
                    </span>
                    <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-3">
                      Cinematic Featured Showcase
                    </h2>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      id="btn-carousel-left"
                      onClick={() => shiftCarousel("left")}
                      className="p-3 bg-slate-950 border border-slate-900 rounded-xl hover:text-cyan-400 hover:border-slate-800 transition"
                      title="Previous Asset"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      id="btn-carousel-right"
                      onClick={() => shiftCarousel("right")}
                      className="p-3 bg-slate-950 border border-slate-900 rounded-xl hover:text-cyan-400 hover:border-slate-800 transition"
                      title="Next Asset"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Carousel Card presentation */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-950/80 p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-2xl min-h-[460px]">
                  {/* Glowing dynamic backwash */}
                  <div
                    className="absolute inset-0 opacity-[0.08] blur-3xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${carouselItems[carouselIdx].color} 0%, transparent 60%)`,
                    }}
                  />

                  {/* Visual Preview slot */}
                  <div className="flex-1 aspect-video w-full rounded-2xl relative overflow-hidden bg-black border border-slate-900 shadow-inner flex items-center justify-center">
                    {/* Spinning preview node */}
                    <div className="absolute inset-4 opacity-75">
                      <ProceduralPlayer
                        proceduralType={carouselItems[carouselIdx].proceduralType}
                        color={carouselItems[carouselIdx].color}
                        secondaryColor={carouselItems[carouselIdx].secondaryColor}
                        speedMultiplier={0.8}
                        glowOn={true}
                        intensity={4}
                        isPlaying={true}
                      />
                    </div>
                  </div>

                  {/* Details block */}
                  <div className="flex-1 space-y-6 text-left w-full lg:max-w-md">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-800/20 font-bold uppercase">
                        {carouselItems[carouselIdx].category}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-white font-bold">★ {carouselItems[carouselIdx].rating} Rated</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-sans font-extrabold text-white leading-tight">
                      {carouselItems[carouselIdx].title}
                    </h3>

                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-sans">
                      {carouselItems[carouselIdx].description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-y border-slate-900 py-4 font-mono text-xs text-gray-400">
                      <div>
                        <span className="text-gray-600 block">RENDER SPEC</span>
                        <span className="text-white font-bold">{carouselItems[carouselIdx].resolution} @ {carouselItems[carouselIdx].fileFormat}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">GLOBAL DOWNLOADS</span>
                        <span className="text-cyan-400 font-bold">{carouselItems[carouselIdx].downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        id={`btn-carousel-inspect-${carouselIdx}`}
                        onClick={() => {
                          setSelectedVideoShared(carouselItems[carouselIdx]);
                        }}
                        className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold uppercase text-xs tracking-wider transition-all hover:shadow-md cursor-pointer"
                      >
                        Adjust & Download Asset
                      </button>

                      <button
                        id="btn-goto-library-featured"
                        onClick={() => setActivePage("library")}
                        className="px-5 py-3.5 rounded-xl border border-slate-900 bg-slate-950 hover:bg-slate-900 text-xs text-gray-300 hover:text-white transition-all font-mono uppercase font-bold flex items-center gap-1.5"
                      >
                        Browse Library
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* LATEST PROJECTS PORTFOLIO */}
              <section id="latest-projects" className="py-20 bg-slate-950/10 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <span className="text-xs uppercase tracking-widest text-purple-400 font-mono bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
                    PORTFOLIO RELEASES
                  </span>
                  <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight mt-4">
                    Pioneering Spatial Graphics
                  </h2>
                  <p className="text-gray-400 mt-4 max-w-2xl mx-auto font-sans text-sm sm:text-base leading-relaxed">
                    Check out some of our custom tailored high-impact kinetic templates launched recently by our global motion directors.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-950/80 border border-slate-900 rounded-3xl space-y-4 text-left group hover:border-slate-850 transition">
                    <div className="aspect-[16/9] bg-black rounded-2xl overflow-hidden relative border border-slate-900/60 flex items-center justify-center">
                      <div className="absolute inset-0 bg-radial-at-t from-cyan-400/10 to-transparent" />
                      {/* Spinning procedurals molecule helix */}
                      <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-all">
                        <ProceduralPlayer
                          proceduralType="dna"
                          color="#7B61FF"
                          secondaryColor="#FF007A"
                          speedMultiplier={0.4}
                          glowOn={true}
                          intensity={3}
                          isPlaying={true}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase">Interactive Genome Loop • Web HUD</span>
                      <h3 className="text-lg font-bold text-white font-sans mt-1">Sino-Biotech Virtual Projections</h3>
                      <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                        Bespot 3D genetic molecule render created for a flagship global medical presentation. Optimized using lightweight CSS matrix buffers.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-950/80 border border-slate-900 rounded-3xl space-y-4 text-left group hover:border-slate-850 transition">
                    <div className="aspect-[16/9] bg-black rounded-2xl overflow-hidden relative border border-slate-900/60 flex items-center justify-center">
                      <div className="absolute inset-0 bg-radial-at-t from-cyan-400/10 to-transparent" />
                      {/* Interactive ring orbits */}
                      <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-all">
                        <ProceduralPlayer
                          proceduralType="quantum"
                          color="#00E5FF"
                          secondaryColor="#7B61FF"
                          speedMultiplier={0.5}
                          glowOn={true}
                          intensity={4}
                          isPlaying={true}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">Logo Reveal • Quantum Cellular</span>
                      <h3 className="text-lg font-bold text-white font-sans mt-1">Superconductor Quantum Particle Reactor</h3>
                      <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                        Futuristic HUD layout tracking nuclear energy spins. Fully custom-tailored with reactive user cursor orbits.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SERVICES SECTION */}
              <section id="services" className="py-20 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-slate-950/70 border border-slate-900 rounded-2xl text-left space-y-4">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-cyan-400 shadow-md">
                      <Tv className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-sans">Bespoke 3D Kinetic Pipelines</h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans">
                      Need specialized custom-fit layouts? Our animation experts design brand vectors, sci-fi intro animations, and volumetric product sequences.
                    </p>
                  </div>

                  <div className="p-8 bg-slate-950/70 border border-slate-900 rounded-2xl text-left space-y-4">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-purple-400 shadow-md">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-sans">Interactive WebGL Overlays</h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans">
                      We export fully lightweight web formats including Lottie JSON and WebM files with alpha channels to overlay directly over active layout headers.
                    </p>
                  </div>

                  <div className="p-8 bg-slate-950/70 border border-slate-900 rounded-2xl text-left space-y-4">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-emerald-400 shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-sans">Dual worksite royalty safety</h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans">
                      Clear copyright protection protocols included with every download tier. Use templates with complete piece of mind on client projects.
                    </p>
                  </div>
                </div>
              </section>

              {/* CLIENT TESTIMONIALS */}
              <section id="testimonials" className="py-20 border-t border-slate-950 bg-slate-950/20">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-16">
                    <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                      NETWORK REVIEWS
                    </span>
                    <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight mt-4">
                      Client Endorsements
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="p-8 bg-slate-950 border border-slate-900 rounded-3xl relative space-y-4">
                      <div className="text-yellow-400 flex gap-1">
                        {[1, 2, 3, 4, 5].map(n => <span key={n}>★</span>)}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed italic font-sans">
                        &ldquo;The interactive procedural rendering is a total game-changer. We customized and downloaded a dynamic technological logo in seconds directly from the browser.&rdquo;
                      </p>
                      <div className="flex gap-3 items-center pt-2">
                        <div className="w-10 h-10 rounded-full bg-slate-800 font-bold flex items-center justify-center text-cyan-400 text-xs">
                          AV
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Alexis Vance</div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase">VP OF CREATIVE • SPATIAL AGENCY</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-slate-950 border border-slate-900 rounded-3xl relative space-y-4">
                      <div className="text-yellow-400 flex gap-1">
                        {[1, 2, 3, 4, 5].map(n => <span key={n}>★</span>)}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed italic font-sans">
                        &ldquo;Outstanding cinema-grade 3D assets that compile cleanly onto web screens without hurting CPU bounds. Highly requested by our branding pipeline operators.&rdquo;
                      </p>
                      <div className="flex gap-3 items-center pt-2">
                        <div className="w-10 h-10 rounded-full bg-slate-800 font-bold flex items-center justify-center text-purple-400 text-xs">
                          MB
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Marcus Brody</div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase">LEAD ARTIST • EPIC VOXEL</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* PRICING PLANS */}
              <PricingSection currentTier={profile.tier} onSubscribe={handleOnSubscribe} />

              {/* CALL-TO-ACTION SECTION */}
              <section className="py-20 bg-gradient-to-tr from-cyan-950/30 to-purple-950/30 border-y border-slate-900">
                <div className="max-w-3xl mx-auto text-center px-4 space-y-6">
                  <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight leading-tight">
                    Power Up Your Creative Pipelines
                  </h2>
                  <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                    Instantly browse our full catalog, download raw MP4 preview layers, and test parameter vectors directly in our real-time sandbox.
                  </p>
                  <button
                    id="btn-cta-browse-catalog"
                    onClick={() => setActivePage("library")}
                    className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold tracking-wider uppercase text-xs hover:shadow-lg hover:shadow-cyan-400/10 transition cursor-pointer"
                  >
                    Open Motion Library
                  </button>
                </div>
              </section>

              {/* CONTACT FORM */}
              <ContactForm />
            </motion.div>
          )}

          {activePage === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MotionLibrary
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                collections={collections}
                createCollection={createCollection}
                addVideoToCollection={addVideoToCollection}
                removeVideoFromCollection={removeVideoFromCollection}
                onDownloadCompleted={handleDownloadCompleted}
                userTier={profile.tier}
              />
            </motion.div>
          )}

          {activePage === "import" && (
            <motion.div
              key="import"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VideoImportDashboard onAddUploadedVideo={handleAddNewUploadedVideo} />
            </motion.div>
          )}

          {activePage === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UserDashboard
                profile={profile}
                onChangeProfile={setProfile}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                collections={collections}
                removeVideoFromCollection={removeVideoFromCollection}
                deleteCollection={deleteCollection}
                downloadHistory={downloadHistory}
                uploadedVideosList={uploadedVideosList}
                onSelectVideo={(videoItem) => {
                  // Direct modal play trigger anywhere in portal
                  setSelectedVideoShared(videoItem);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Interactive Video Preview overlay routing (if triggered externally) */}
      {selectedVideoShared && (
        <div className="relative">
          {/* We import MotionLibrary internally to handle this shared preview modal cleanly */}
          <MotionLibrary
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            collections={collections}
            createCollection={createCollection}
            addVideoToCollection={addVideoToCollection}
            removeVideoFromCollection={removeVideoFromCollection}
            onDownloadCompleted={handleDownloadCompleted}
            userTier={profile.tier}
          />
          {/* Quick inline overlay injector trick */}
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-[#050816] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch text-left"
            >
              <div className="flex-1 min-h-[300px] flex flex-col justify-between p-6 bg-slate-950 border-r border-slate-900">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono bg-slate-900 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase">
                    {selectedVideoShared.category}
                  </span>
                </div>
                
                {/* 3D Render box */}
                <div className="aspect-[16/10] bg-black h-72 rounded-2xl relative overflow-hidden border border-slate-900 flex items-center justify-center mb-6">
                  <ProceduralPlayer
                    proceduralType={selectedVideoShared.proceduralType}
                    color={selectedVideoShared.color}
                    secondaryColor={selectedVideoShared.secondaryColor}
                    speedMultiplier={selectedVideoShared.baseSpeed}
                    glowOn={true}
                    intensity={4}
                    isPlaying={true}
                  />
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 font-mono text-[10px] text-gray-500 leading-relaxed text-left">
                  SYSTEM STATUS: INTEGRITY RESOLVED ACTIVE
                  <br />
                  COSMIC ENGINE MODE: {selectedVideoShared.proceduralType.toUpperCase()}
                  <br />
                  GLOW COLOR SPECTRA: {selectedVideoShared.color}
                </div>
              </div>

              {/* Meta Right bar */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto relative text-left">
                <button
                  id="btn-close-shared-overlay"
                  onClick={() => setSelectedVideoShared(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-gray-400 hover:text-white transition cursor-pointer z-15"
                >
                  <X className="w-5 h-5 text-cyan-400" />
                </button>

                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-sans text-white leading-tight pr-6">
                    {selectedVideoShared.title}
                  </h2>
                  <p className="text-gray-400 text-xs font-sans mt-3 leading-relaxed">
                    {selectedVideoShared.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {selectedVideoShared.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono bg-slate-900 px-2.5 py-1 rounded text-gray-400">
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900 text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">FORMAT:</span>
                      <span className="text-white font-bold">{selectedVideoShared.fileFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">NATIVE RESOLUTION:</span>
                      <span className="span text-cyan-400 font-bold">{selectedVideoShared.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PUBLISH ROOT:</span>
                      <span className="text-white">{selectedVideoShared.publishDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-900/60 pt-6 space-y-3">
                  <button
                    id="btn-open-full-library-overlay-cta"
                    onClick={() => {
                      setSelectedVideoShared(null);
                      setActivePage("library");
                    }}
                    className="w-full py-4 bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider text-xs font-mono rounded-xl hover:bg-cyan-300 transition-all shadow-lg text-center"
                  >
                    Adjust parameters in full sandbox
                  </button>
                  <button
                    id="btn-close-shared-back"
                    onClick={() => setSelectedVideoShared(null)}
                    className="w-full py-3 border border-slate-800 text-gray-405 font-mono text-[10px] uppercase tracking-wider rounded-xl hover:bg-slate-900 transition-all text-center"
                  >
                    Close Preview Drawer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Cyberpunk Footer */}
      <footer className="bg-[#03050c] border-t border-slate-900 py-12 px-4 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-display font-black text-white text-base tracking-wider block">NEOMOTION STUDIO</span>
            <span className="text-[10px] text-gray-600 font-mono mt-0.5 block">
              © 2026 NEOMOTION INTEL. LICENSED UNDER SYSTEM SECURE PATENTS.
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-gray-500 tracking-wider uppercase font-bold justify-center">
            <button id="btn-footer-home" onClick={() => setActivePage("home")} className="hover:text-cyan-400">Overview</button>
            <span>•</span>
            <button id="btn-footer-library" onClick={() => setActivePage("library")} className="hover:text-cyan-400">Library</button>
            <span>•</span>
            <button id="btn-footer-contact" onClick={() => { setActivePage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-cyan-400">Commission Pipeline</button>
            <span>•</span>
            <button id="btn-footer-dashboard" onClick={() => setActivePage("dashboard")} className="hover:text-cyan-400">Diagnostics (Dashboard)</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Inline mock-X-button element
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
