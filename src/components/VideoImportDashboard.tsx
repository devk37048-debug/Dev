import React, { useState } from "react";
import {
  Upload,
  Globe,
  Youtube,
  Cloud,
  FileVideo,
  FileEdit,
  Trash2,
  RefreshCw,
  Sparkles,
  Settings,
  X,
  Play,
  FolderOpen,
  Wand2,
  Cpu,
  Tv,
  Eye,
  Terminal,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, ImportVideoTask, Format, Resolution } from "../types";
import ProceduralPlayer from "./ProceduralPlayer";

interface VideoImportDashboardProps {
  onAddUploadedVideo: (videoData: {
    title: string;
    description: string;
    category: Category;
    tags: string[];
    fileFormat: Format;
    proceduralType: "ring" | "particles" | "sine" | "dna" | "matrix" | "quantum" | "gravity" | "hologram";
    color: string;
  }) => void;
}

export default function VideoImportDashboard({ onAddUploadedVideo }: VideoImportDashboardProps) {
  const [selectedSource, setSelectedSource] = useState<
    "Local Upload" | "Google Drive" | "Dropbox" | "OneDrive" | "YouTube" | "Vimeo" | "Cloud Storage"
  >("Local Upload");

  const [tasks, setTasks] = useState<ImportVideoTask[]>([]);
  
  // Pipeline mode toggler: "ai" (generate with Gemini) vs "file" (manual import)
  const [pipelineMode, setPipelineMode] = useState<"ai" | "file">("ai");

  // AI Generator state values
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStatus, setAiStatus] = useState<"idle" | "sending" | "compiling" | "completed" | "failed">("idle");
  const [aiResult, setAiResult] = useState<{
    title: string;
    description: string;
    category: Category;
    tags: string[];
    fileFormat: Format;
    resolution: Resolution;
    proceduralType: "ring" | "particles" | "sine" | "dna" | "matrix" | "quantum" | "gravity" | "hologram";
    color: string;
    secondaryColor?: string;
    baseSpeed: number;
  } | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState("");

  const promptPresets = [
    "Quantum stellar solar matrix swirling gracefully on glowing cobalt dust fields",
    "Glowing binary numerical codes cascading vertically on green cybersecurity matrix terminals",
    "Futuristic DNA double helix structures spinning with energetic purple and pink micro pulses",
    "An elegant neon pink Soundwave Oscilloscope scrolling dynamically for music tracks",
    "Warp gravity space horizontal coordinates stretching into deep golden twilight horizons"
  ];

  // Metadata fields for selected active task
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("External dynamic source loop import.");
  const [metaCategory, setMetaCategory] = useState<Category>("Futuristic");
  const [metaTags, setMetaTags] = useState<string[]>(["IMPORTED", "EXTERNAL", "CINEMATIC"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [metaProcedural, setMetaProcedural] = useState<
    "ring" | "particles" | "sine" | "dna" | "matrix" | "quantum" | "gravity" | "hologram"
  >("ring");
  const [metaGlowColor, setMetaGlowColor] = useState("#00E5FF");

  // Optimization toggles
  const [optimizeBitrate, setOptimizeBitrate] = useState(true);
  const [compressResolution, setCompressResolution] = useState(false);
  const [autoLottieConversion, setAutoLottieConversion] = useState(false);

  const sourcesList = [
    { name: "Local Upload", icon: Upload, desc: "Direct drag and drop raw MP4 / MOV" },
    { name: "Google Drive", icon: FolderOpen, desc: "Import fast from locked GDrive shares" },
    { name: "YouTube", icon: Youtube, desc: "Transcribe from public YouTube URL" },
    { name: "Dropbox", icon: Cloud, desc: "Synch directly from connected Dropbox folders" },
    { name: "OneDrive", icon: Cloud, desc: "Direct MS OneDrive workspace links" },
    { name: "Vimeo", icon: Globe, desc: "Import high qualities directly from Vimeo Pro" },
    { name: "Cloud Storage", icon: Settings, desc: "External AWS S3 or GCP Cloud Buckets" },
  ] as const;

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

  // Triggers mock upload items
  const handleSimulateAddFiles = (names: string[]) => {
    const newTasks: ImportVideoTask[] = names.map((name, index) => {
      const id = `task-${Date.now()}-${index}`;
      return {
        id,
        title: name.split(".")[0],
        source: selectedSource,
        status: "idle",
        progress: 0,
        category: "Futuristic",
        tags: ["CINEMATIC", "EXTERNAL"],
      };
    });

    setTasks((prev) => [...prev, ...newTasks]);
    
    // Automatically trigger queue processing for these tasks
    newTasks.forEach((t) => processTask(t.id));
  };

  // Run multi-tier process
  const processTask = (id: string) => {
    // Step 1: Uploading
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "uploading", progress: 5 } : t))
    );

    let progress = 5;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Step 2: Shifting to optimizing
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "optimizing", progress: 100 } : t))
        );

        // Simulate file optimization & rendering analyzer (2.2s delay)
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
          );
        }, 2200);
      } else {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, progress } : t)));
      }
    }, 450);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  // Edit metadata form selector config
  const handleSelectTaskForEditing = (task: ImportVideoTask) => {
    setActiveTaskId(task.id);
    setMetaTitle(task.title);
    setMetaCategory(task.category);
    setMetaTags(task.tags);
  };

  // Send the template request prompt directly to Express full-stack endpoint
  const handleGenerateAiMotion = async () => {
    if (!aiPrompt.trim()) return;
    setAiStatus("sending");
    setAiErrorMessage("");
    setAiResult(null);

    try {
      const res = await fetch("/api/generate-motion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      setAiStatus("compiling");
      const data = await res.json();
      if (!data.success || !data.asset) {
        throw new Error(data.error || "System failed to resolve motion specifications.");
      }

      // Simulate compilation sequence for modern sensory feedback
      setTimeout(() => {
        setAiResult(data.asset);
        setAiStatus("completed");
      }, 1800);
    } catch (err: any) {
      console.error(err);
      setAiErrorMessage(err.message || "An unknown compilation error occurred.");
      setAiStatus("failed");
    }
  };

  const handleInjectToLibrary = () => {
    if (!aiResult) return;

    onAddUploadedVideo({
      title: aiResult.title,
      description: aiResult.description,
      category: aiResult.category,
      tags: aiResult.tags,
      fileFormat: aiResult.fileFormat,
      proceduralType: aiResult.proceduralType,
      color: aiResult.color,
    });

    // Clear form states
    setAiPrompt("");
    setAiResult(null);
    setAiStatus("idle");
  };

  // Commit changes back to system
  const handleConfirmImport = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Trigger parent callback to populate general application state
    onAddUploadedVideo({
      title: metaTitle || task.title,
      description: metaDesc,
      category: metaCategory,
      tags: metaTags,
      fileFormat: "MP4",
      proceduralType: metaProcedural,
      color: metaGlowColor,
    });

    // Remove task or mark as finalized inside current list
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)));
    alert(`Success: "${metaTitle || task.title}" has been successfully optimized and injected to global library databases.`);
    
    // Clear active editor selection
    setActiveTaskId(null);
  };

  // Tags controller helpers
  const handleAddTag = () => {
    if (newTagInput && !metaTags.includes(newTagInput.toUpperCase())) {
      setMetaTags([...metaTags, newTagInput.toUpperCase()]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setMetaTags(metaTags.filter((t) => t !== tag));
  };

  const getSourceIconStr = (src: ImportVideoTask["source"]) => {
    if (src === "YouTube") return "🎬 YouTube Embed";
    if (src === "Google Drive") return "💾 Google Drive";
    return "📁 Dynamic Cloud Link";
  };

  return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 md:px-8 pb-24">
      <div className="mb-10 text-center">
        <span className="text-xs uppercase tracking-widest text-purple-400 font-mono bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
          ADMIN INGEST PIPELINE
        </span>
        <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white mt-4">
          Video Import & Node Dashboard
        </h1>
        <p className="text-gray-400 font-sans mt-3 max-w-2xl mx-auto">
          Drag and drop external MP4 assets or link digital cloud drives. Our rendering cluster compresses, optimizes, and prepares web-friendly WebGL configurations.
        </p>
      </div>

      {/* Sources selection matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {sourcesList.map((src) => {
          const IconComp = src.icon;
          const isSelected = selectedSource === src.name;
          return (
            <button
              key={src.name}
              id={`btn-source-${src.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedSource(src.name as any)}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 justify-center ${
                isSelected
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-950/40"
                  : "bg-slate-950/70 border-slate-900 text-gray-400 hover:text-white hover:border-slate-800"
              }`}
            >
              <IconComp className="w-5 h-5" />
              <span className="text-[11px] font-mono tracking-wider uppercase font-bold">{src.name}</span>
            </button>
          );
        })}
      </div>

      {/* Uploader section & Editing panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Upload Controller */}
        <div className="flex-1 space-y-6">
          {/* Main drag area */}
          <div className="border-2 border-dashed border-slate-800 bg-slate-950/40 hover:bg-slate-950/60 transition-all rounded-3xl p-10 text-center relative group">
            <input
              type="file"
              multiple
              accept="video/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const names = Array.from(e.target.files).map((f: any) => f.name);
                  handleSimulateAddFiles(names);
                }
              }}
            />
            
            <div className="max-w-md mx-auto space-y-4 pointer-events-none">
              <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto group-hover:scale-110 group-hover:border-cyan-400/40 transition-all shadow-lg">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  Simulate Drag & Drop or Click to Upload
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-1">
                  Supports .MP4, .MOV, .WEBM files up to 500MB (Automatically converted to procedural vectors)
                </p>
              </div>

              {/* Preset buttons to help user easily trigger demo uploading */}
              <div className="pt-3 flex flex-wrap gap-2 justify-center pointer-events-auto">
                <span className="text-[10px] text-gray-500 font-mono self-center pr-1">CHOOSE DEMO TEMPLATES:</span>
                <button
                  id="btn-import-preset-hud"
                  onClick={() => handleSimulateAddFiles(["cyber_hud_interface.mov", "particle_nebula_drift.mp4"])}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-gray-300 font-mono rounded cursor-pointer"
                >
                  + Add 2 HD Videos
                </button>
                <button
                  id="btn-import-preset-typography"
                  onClick={() => handleSimulateAddFiles(["rotating_helix_genome.webm"])}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-gray-300 font-mono rounded cursor-pointer"
                >
                  + Add 1 8K Molecule
                </button>
              </div>
            </div>
          </div>

          {/* Active Task Queue */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-3xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-4">
              <span className="text-xs font-bold font-mono text-white tracking-widest uppercase flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" /> INGEST QUEUE ({tasks.length})
              </span>
              <button
                id="btn-clear-queue"
                disabled={tasks.length === 0}
                onClick={() => setTasks([])}
                className="text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-wider disabled:opacity-50"
              >
                Clear Queue
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-10">
                <FileVideo className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-sans">Queue is empty. Load files in the container above to begin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const isActive = activeTaskId === task.id;
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleSelectTaskForEditing(task)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? "bg-slate-900 border-cyan-500/40 shadow-inner"
                          : "bg-slate-950/80 border-slate-900 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate font-sans">{task.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mt-0.5">
                            <span className="text-cyan-400">{task.source}</span>
                            <span>•</span>
                            <span className="uppercase text-purple-400">{task.status}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {task.status === "uploading" && (
                            <span className="text-xs font-mono text-cyan-400">{task.progress}%</span>
                          )}
                          {task.status === "optimizing" && (
                            <span className="text-[9px] font-mono bg-purple-950 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full animate-pulse">
                              OPTIMIZING
                            </span>
                          )}
                          {task.status === "completed" && (
                            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full">
                              READY FOR COMPILER
                            </span>
                          )}

                          <button
                            id={`btn-del-task-${task.id}`}
                            onClick={(e) => handleDeleteTask(task.id, e)}
                            className="p-1.5 text-gray-600 hover:text-red-400 rounded hover:bg-slate-90/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Line loader */}
                      {task.status === "uploading" && (
                        <div className="w-full bg-slate-950 h-1 rounded-full mt-3 overflow-hidden">
                          <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${task.progress}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Metadata Editor panel */}
        <div className="w-full lg:w-[420px] shrink-0">
          <AnimatePresence mode="wait">
            {activeTaskId ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-950 border border-slate-850 rounded-3xl p-6.5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-6">
                  <span className="text-xs font-bold font-mono text-white uppercase tracking-widest flex items-center gap-1.5">
                    <FileEdit className="w-4 h-4 text-cyan-400" /> METADATA STUDIO
                  </span>
                  <button
                    id="btn-close-editor"
                    onClick={() => setActiveTaskId(null)}
                    className="p-1 hover:bg-slate-900 rounded text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 text-left">
                  {/* Title editor */}
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1.5">Motion Graphic Title</label>
                    <input
                      id="input-meta-title"
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1.5">Asset Description</label>
                    <textarea
                      id="textarea-meta-desc"
                      rows={2}
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
                    />
                  </div>

                  {/* Category dropdown selection mapping 20 categories requested */}
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1.5">Assign Category</label>
                    <select
                      id="select-meta-category"
                      value={metaCategory}
                      onChange={(e) => setMetaCategory(e.target.value as Category)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Procedural mapping configuration */}
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1.5">Procedural Canvas Preset</label>
                    <select
                      id="select-meta-procedural-config"
                      value={metaProcedural}
                      onChange={(e) => setMetaProcedural(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="quantum">QUANTUM CELLULAR CORE (NODE WEBS)</option>
                      <option value="dna">DNA ROTATOR DOUBLE HELIX (SCI-TECH)</option>
                      <option value="ring">CYBER TORUS GLOW (LOGOS)</option>
                      <option value="particles">CONSTELLATION DRIFTER (MINIMAL)</option>
                      <option value="sine">TRIGNOMETRIC NEON OSCILLATOR (WAVES)</option>
                      <option value="matrix">waterfall binary rain (telemetry)</option>
                      <option value="gravity">warp horizon space (warp velocity)</option>
                      <option value="hologram">holographic scan wireframe (visualizers)</option>
                    </select>
                  </div>

                  {/* Glowing Spectra picker */}
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1.5">Primary Neon Theme Spectrum</label>
                    <div className="flex gap-2">
                      <input
                        id="input-meta-glow-hex"
                        type="color"
                        value={metaGlowColor}
                        onChange={(e) => setMetaGlowColor(e.target.value)}
                        className="w-10 h-10 rounded border border-slate-800 bg-transparent cursor-pointer"
                      />
                      <input
                        id="input-meta-glow-text"
                        type="text"
                        value={metaGlowColor}
                        onChange={(e) => setMetaGlowColor(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Tag additions */}
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1.5">Tag Management</label>
                    <div className="flex gap-1.5 mb-2">
                      <input
                        id="input-new-tag"
                        type="text"
                        placeholder="ADD TAG..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 text-[10px] text-white focus:outline-none"
                      />
                      <button
                        id="btn-add-tag"
                        onClick={handleAddTag}
                        className="bg-slate-900 hover:bg-slate-850 px-3 py-2 text-[10px] text-cyan-400 font-mono rounded-lg border border-slate-800"
                      >
                        + Tags
                      </button>
                    </div>
                    {/* Active tags mapping list */}
                    <div className="flex flex-wrap gap-1">
                      {metaTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-900 text-gray-300 font-mono text-[9px] px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                        >
                          {tag}
                          <button
                            id={`btn-remove-tag-${tag}`}
                            onClick={() => handleRemoveTag(tag)}
                            className="text-red-400 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Optimization controls */}
                  <div className="pt-4 border-t border-slate-900/60 font-mono text-[10px] text-gray-400 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>CRUSH BITRATE ENVELOPE</span>
                      <input
                        id="checkbox-optimize-bitrate"
                        type="checkbox"
                        checked={optimizeBitrate}
                        onChange={(e) => setOptimizeBitrate(e.target.checked)}
                        className="accent-cyan-400"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>RESOLVE AS STANDARDIZED LOTTIE JSON</span>
                      <input
                        id="checkbox-optimize-lottie"
                        type="checkbox"
                        checked={autoLottieConversion}
                        onChange={(e) => setAutoLottieConversion(e.target.checked)}
                        className="accent-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Form trigger submission */}
                  <div className="pt-4">
                    <button
                      id="btn-confirm-import-trigger"
                      onClick={() => handleConfirmImport(activeTaskId)}
                      className="w-full py-3.5 bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider text-xs font-mono rounded-xl hover:bg-cyan-300 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-current animate-spin" /> Apply Metrics & Inject To Library
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="border border-slate-900 bg-slate-950/20 rounded-3xl p-8 text-center text-gray-500 font-sans h-full flex flex-col justify-center items-center min-y-[400px]">
                <FileEdit className="w-12 h-12 text-slate-850 mb-3" />
                <h4 className="text-white font-bold text-sm">Select Active Asset For Optimization</h4>
                <p className="text-xs text-gray-650 mt-1 max-w-sm">
                  Once your imported items enter the Ingest Queue above, click any of them to open parameters metadata modifiers and configure WebGL properties.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
