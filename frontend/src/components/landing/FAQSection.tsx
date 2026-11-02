import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";

const FAQS = [
  {
    question: "How do I get access to VIDYAVERSE?",
    answer: "VIDYAVERSE is offered through partner institutions and organizations. If your school or company already works with VIDYAVERSE, you can sign up directly. Otherwise, reach out and we'll help you get set up."
  },
  {
    question: "Do I need prior coding experience?",
    answer: "Not for our Python course. It is designed to take you from zero to intermediate. However, our Artificial Intelligence course assumes you have basic programming knowledge (like variables, loops, and functions)."
  },
  {
    question: "How does the AI Code Review work?",
    answer: "When you submit a project via GitHub, our backend pulls your code and runs a semantic analysis using a combination of static analysis tools and LLMs (like Claude/Gemini). It checks for logic errors, best practices, and efficiency, giving you line-by-line feedback within seconds."
  },
  {
    question: "Will I get a certificate?",
    answer: "Yes! Upon successfully completing a course and passing all project reviews, you'll receive a verifiable, cryptographic certificate. You can link this certificate on LinkedIn or your resume, and employers can verify its authenticity instantly."
  },
  {
    question: "How is this different from a typical bootcamp?",
    answer: "Traditional bootcamps cost thousands and rely heavily on manual grading, which slows you down. VIDYAVERSE uses an automated, AI-driven infrastructure to give you instant feedback, letting you move at your own pace while building a real, verifiable portfolio."
  },
  {
    question: "Is my code and account data private?",
    answer: "Yes. Your account data and progress are stored securely, and we don't run third-party advertising or tracking scripts on the platform. Code you submit for a project is sent to a third-party AI provider (currently Google Gemini) purely to generate review feedback — we don't sell your data, and your portfolio stays private unless you choose to make it public. See our Privacy Policy for the full detail."
  }
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof FAQS[0], isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border border-[var(--border-primary)] rounded-2xl bg-[var(--bg-surface)] overflow-hidden transition-colors hover:border-[var(--accent-indigo)]/50">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-bold text-[var(--text-primary)] text-lg pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 w-8 h-8 rounded-full bg-[#0A0E1A] flex items-center justify-center border border-[var(--border-primary)] text-[var(--text-muted)]"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-[var(--text-secondary)] leading-relaxed text-sm">
              <div className="pt-2 border-t border-[var(--border-primary)]/50 mt-1">
                {faq.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="py-24 bg-[var(--bg-main)] border-t border-[var(--border-primary)]/60 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <Reveal delay={0.1}>
            <h2 className="text-xs uppercase tracking-widest text-[var(--accent-indigo)] font-bold font-mono">Got Questions?</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-3">Frequently Asked Questions</h3>
          </Reveal>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={0.1 + (i * 0.1)} direction="up">
              <FAQItem 
                faq={faq} 
                isOpen={openIndex === i} 
                onToggle={() => setOpenIndex(openIndex === i ? null : i)} 
              />
            </Reveal>
          ))}
        </div>
        
      </div>
    </section>
  );
}
