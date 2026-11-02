import { motion } from "framer-motion";
import { TerminalSquare, BarChart3, GraduationCap } from "lucide-react";

export default function PlatformValueSection() {
  const features = [
    {
      icon: <TerminalSquare className="w-6 h-6 text-blue-500" />,
      title: "Built-in Code Editor",
      description: "Write and run Python directly in your browser. No setup needed."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      title: "Progress Tracking",
      description: "See exactly which lectures you've completed across every course."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
      title: "Verified Certificates",
      description: "Earn credentials that actually reflect what you built and completed."
    }
  ];

  return (
    <section className="py-32 px-6 bg-[#050508]">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4 block">Why VIDYAVERSE</span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Everything you need. Nothing you don't.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group p-8 rounded-2xl border border-white/5 bg-transparent hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all duration-300"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
