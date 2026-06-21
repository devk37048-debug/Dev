import React, { useState } from "react";
import { Send, Terminal, ShieldCheck, Mail, MessageSquare, Terminal as TerminalIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    projectType: "Custom 3D Scene",
    message: "",
    acceptTerms: true,
  });

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      setFormState("error");
      return;
    }

    setFormState("submitting");

    // Simulate futuristic upload delay
    setTimeout(() => {
      const generatedTicket = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedTicket);
      setFormState("success");
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      projectType: "Custom 3D Scene",
      message: "",
      acceptTerms: true,
    });
    setFormState("idle");
  };

  return (
    <section id="contact" className="py-20 relative max-w-4xl mx-auto px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="border border-slate-800 bg-slate-950/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse" />

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* General system terminal info */}
          <div className="flex-1 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-purple-400 font-mono bg-purple-950/50 px-3 py-1 rounded-full border border-purple-500/30">
                PIPELINE CONTACT
              </span>
              <h3 className="text-3xl font-bold font-sans mt-4 text-white tracking-tight">
                Initiate Creative Commission
              </h3>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              Need custom 3D models, bespoke shader systems, or custom-tailored marketing animations? Submit your criteria, and our automated network will assign a designer.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 text-gray-300">
                <div id="contact-icon-mail" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">SECURE TRANSCRIPTION</div>
                  <div className="text-sm font-sans text-white">commissions@neomotion.studio</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div id="contact-icon-status" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400">
                  <TerminalIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono">PIPELINE BOUNDARY</div>
                  <div className="text-sm font-sans text-white">ACTIVE - SECURE (TLS 1.3)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-[1.3] relative min-h-[400px]">
            {formState === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col justify-center text-center p-6 bg-slate-900/60 rounded-2xl border border-cyan-500/20"
              >
                <div className="mx-auto w-16 h-16 bg-cyan-950/80 border border-cyan-400 rounded-full flex items-center justify-center text-cyan-400 mb-6 shadow-lg shadow-cyan-400/15">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white font-sans">Transmission Successful</h4>
                <p className="text-xs text-cyan-300 font-mono mt-1 uppercase tracking-wider">TICKET SECURED</p>

                <div className="my-6 p-4 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-left text-xs text-cyan-400">
                  <div className="flex justify-between border-b border-slate-900 pb-2 mb-2 text-gray-500 font-bold">
                    <span>TRANSMISSION RECEIPT</span>
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1.5">
                    <div><span className="text-gray-500">ID:</span> {ticketId}</div>
                    <div><span className="text-gray-500">FROM:</span> {formData.fullName}</div>
                    <div><span className="text-gray-500">EMAIL:</span> {formData.email}</div>
                    <div><span className="text-gray-500">TYPE:</span> {formData.projectType}</div>
                    <div><span className="text-gray-400">STATUS:</span> <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold">QUEUED</span></div>
                  </div>
                </div>

                <p className="text-gray-400 text-xs font-sans max-w-sm mx-auto leading-relaxed">
                  Our network nodes are reviewing your parameters. Watch your secure mailbox for a transmission notification of our diagnostic response.
                </p>

                <button
                  id="btn-commission-reset"
                  onClick={handleReset}
                  className="mt-6 mx-auto px-6 py-2 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-all uppercase tracking-wider"
                >
                  New Transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Your Full Name</label>
                  <input
                    id="input-contact-name"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter dynamic visual identity..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-sans transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Secure Mail Address</label>
                  <input
                    id="input-contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@agency.com"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-sans transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Project Criteria</label>
                  <select
                    id="select-contact-type"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-sans transition-all"
                  >
                    <option value="Custom 3D Scene">Custom 3D Scene & Shader Development</option>
                    <option value="Logo Animation">Logo Reveal & Cybernetic Brand Entrances</option>
                    <option value="Virtual Product Loop">Corporate 3D Product Interactive Loop</option>
                    <option value="Gaming Intro/Trailer">Sci-Fi gaming Intro & Cinematic Outro</option>
                    <option value="Enterprise Integration">Enterprise Volume licensing Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Pipeline Core Directives</label>
                  <textarea
                    id="textarea-contact-msg"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify project resolution requirements, custom color spectra, or timing parameters..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-sm placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-sans transition-all resize-none"
                  />
                </div>

                {formState === "error" && (
                  <p className="text-xs text-red-400 font-mono">
                    ⚠️ Fatal exception: Please populate all vector input states correctly.
                  </p>
                )}

                <button
                  id="btn-contact-submit"
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-bold font-mono uppercase text-sm tracking-wider shadow-lg shadow-cyan-950/40 hover:shadow-cyan-400/15 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-55"
                >
                  {formState === "submitting" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Matrices...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Directive</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
