import React from "react";
import { Check, Flame, Pocket, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface PricingSectionProps {
  currentTier: string;
  onSubscribe: (tierName: "Free Member" | "Pro Studio" | "Enterprise Partner") => void;
}

export default function PricingSection({ currentTier, onSubscribe }: PricingSectionProps) {
  const plans = [
    {
      name: "Free Member",
      id: "Free Member",
      price: "$0",
      period: "forever",
      description: "Perfect for testing rendering profiles and procedural previews.",
      features: [
        "Standard MP4, WEBM downloads",
        "Up to 1080p full resolution options",
        "Personal use only license style",
        "Interactive canvas configuration",
        "Access to basic tag library",
      ],
      icon: Pocket,
      color: "border-gray-800 text-gray-400 focus-ring hover:border-gray-600",
      accent: "#718096",
      btnText: "Current Plan",
    },
    {
      name: "Pro Studio",
      id: "Pro Studio",
      price: "$49",
      period: "month",
      description: "For elite designers, video makers, and spatial agency operators.",
      features: [
        "Uncapped 4K & 8K cinematic exports",
        "All output formats including Lottie JSON and raw MOV",
        "Commercial clearance & Royalty safety",
        "Full bulk drag-and-drop video import access",
        "Priority GPU cloud-rendering pipelines",
        "Holographic UI customizations unlocked",
      ],
      icon: Flame,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/20 shadow-cyan-950/50 hover:border-cyan-400",
      accent: "#00E5FF",
      isPopular: true,
      btnText: "Upgrade to Pro",
    },
    {
      name: "Enterprise Partner",
      id: "Enterprise Partner",
      price: "$199",
      period: "month",
      description: "Corporate networks needing unlimited scale and multi-seat seats.",
      features: [
        "Multi-seat organization permission matrix",
        "Unlimited high-resolution cinematic video exports",
        "Enterprise clearance & custom copyright terms",
        "Dedicated account technical executive support",
        "API webhook notifications for automated workspace injection",
        "Custom procedural pattern creations",
      ],
      icon: Sparkles,
      color: "border-purple-500/40 text-purple-400 bg-purple-950/20 shadow-purple-950/50 hover:border-purple-400",
      accent: "#7B61FF",
      btnText: "Join Enterprise",
    },
  ];

  return (
    <section id="pricing" className="py-20 relative px-4 max-w-7xl mx-auto">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-16 relative">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
          PRO-TIER SYSTEMS
        </span>
        <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-white mt-4">
          Flexible Licensing, Unlimited Motion
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto font-sans leading-relaxed">
          Unlock high-fidelity 3D assets, vector streams, and raw source materials designed directly for cinematic and web pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {plans.map((p, index) => {
          const IconComponent = p.icon;
          const isCurrent = currentTier === p.id;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className={`flex flex-col p-8 rounded-2xl border bg-slate-950/70 backdrop-blur-md relative overflow-hidden transition-all shadow-xl ${
                p.isPopular ? "border-cyan-500/50 shadow-cyan-950/60" : "border-slate-800"
              }`}
            >
              {p.isPopular && (
                <div className="absolute top-0 right-0 bg-cyan-400 text-slate-950 font-mono text-[10px] uppercase font-black px-4 py-1.5 rounded-bl-xl tracking-wider">
                  Highly Requested
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2.5 rounded-lg border bg-slate-900"
                  style={{
                    borderColor: `${p.accent}33`,
                    color: p.accent,
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white font-sans">{p.name}</h3>
              </div>

              <p className="text-gray-400 text-sm font-sans mb-6 min-h-[40px]">
                {p.description}
              </p>

              <div className="flex items-baseline gap-2 mb-8 border-b border-slate-900 pb-6">
                <span className="text-4xl font-extrabold text-white font-sans">{p.price}</span>
                <span className="text-gray-500 font-mono text-sm">/{p.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-sm text-gray-300 font-sans leading-snug">
                    <Check
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: p.accent }}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                id={`btn-subscribe-${p.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => onSubscribe(p.id as any)}
                disabled={isCurrent}
                className={`w-full py-3.5 rounded-xl text-sm font-mono tracking-wider uppercase font-bold border transition-all ${
                  isCurrent
                    ? "bg-slate-900 border-slate-800 text-gray-500 cursor-default"
                    : p.isPopular
                    ? "bg-cyan-400 text-slate-950 border-cyan-400 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 active:scale-95"
                    : "bg-slate-900 text-white border-slate-800 hover:bg-slate-850 hover:border-slate-700 active:scale-95"
                }`}
              >
                {isCurrent ? "Active Plan" : p.btnText}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
