import { motion } from "framer-motion";

export default function SolutionSection() {
  const steps = [
    {
      num: "1",
      icon: "🎯",
      title: "Pick Your Course",
      description: "Python or AI. Both structured for real outcomes."
    },
    {
      num: "2",
      icon: "📖",
      title: "Learn Section by Section",
      description: "Read, understand, scroll through every page."
    },
    {
      num: "3",
      icon: "💻",
      title: "Write Real Code",
      description: "Solve problems in the built-in editor. No skipping."
    },
    {
      num: "4",
      icon: "🏆",
      title: "Get Certified",
      description: "Complete all lectures and earn a verified certificate."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#05050a]">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-[#6b7280] mb-4 block">THE VIDYAVERSE WAY</span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            A focused path from beginner to certified.
          </h2>
        </motion.div>

        <div className="relative flex flex-col md:flex-row gap-8 justify-between">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-px bg-white/10 -z-10" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative flex flex-col items-start md:flex-1"
            >
              {/* Background faint number */}
              <div className="absolute -top-12 left-0 text-8xl font-black text-white opacity-5 pointer-events-none select-none">
                0{step.num}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#0d0d16] border border-white/10 flex items-center justify-center text-xl mb-6 relative z-10">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
              <p className="text-[#6b7280] leading-relaxed relative z-10 pr-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
