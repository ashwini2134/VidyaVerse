import { motion } from "framer-motion";
import { Code, Award, Users, Flame, Terminal } from "lucide-react";

export default function WhyVIDYAVERSESection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="why-vidyaverse" 
      className="py-24 max-w-6xl mx-auto px-6 border-t border-white/5"
    >
      <div className="max-w-2xl text-left mb-16">
        <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold">Why VIDYAVERSE</h2>
        <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3">
          Built for active learning, not passive consumption.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-8 rounded-2xl border border-white/10 bg-[#0d121f]/60 text-left flex flex-col h-full hover:scale-[1.03] hover:border-blue-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
            <Terminal className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Learning by Doing</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Skip theoretical slides. Run and compile code instantly inside browser sandboxes configured specifically for each lecture module.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#0d121f]/60 text-left flex flex-col h-full hover:scale-[1.03] hover:border-blue-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
            <Code className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Real Projects</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Graduate from basic code syntax. Code complete scripts and applications that are automatically verified using test assertions.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#0d121f]/60 text-left flex flex-col h-full hover:scale-[1.03] hover:border-blue-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Skill Verification</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Earn digitally signed certificates that reflect true project completion metrics, suitable for professional credentials.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#0d121f]/60 text-left flex flex-col h-full hover:scale-[1.03] hover:border-blue-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Portfolio Building</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Automatically track your completed assignments and projects, rendering them into a clean, public profile for review.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#0d121f]/60 text-left flex flex-col h-full md:col-span-2 lg:col-span-1 hover:scale-[1.03] hover:border-blue-500/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
            <Flame className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Consistent Progress</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Build developer routines with built-in daily streaks and milestone indicators that measure actual hands-on coding time.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
