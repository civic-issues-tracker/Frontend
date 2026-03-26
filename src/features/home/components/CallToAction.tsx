import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] } 
  }
};

const Counter = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {value}
    </motion.span>
  );
};

const CallToAction:React.FC = () => {
  return (
    <section className="w-full bg-primary py-14 px-10 md:px-10 overflow-hidden relative border-t border-secondary/5">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-275 mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-end"
      >
        
        <div className="space-y-6">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-header font-light text-secondary tracking-tight uppercase leading-[1.1]">
            Better Cities <br />
            <span className="text-secondary/20 italic">start with you</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-secondary/50 text-[15px] max-w-xs font-body font-light leading-relaxed">
            A centralized digital record designed to replace manual reporting. Join the network ensuring every issue reaches its department in seconds.
          </motion.p>

          <motion.div variants={fadeInUp} className="pt-2">
            <button className="group border-secondary/40 px-4 py-2 border rounded-full flex items-center gap-4 text-secondary hover:text-secondary hover:translate-y-1 transition-all">
              <span className="text-1xl  font-bold uppercase tracking-[0.4em]">Get Started</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <div className="flex flex-col md:items-end space-y-8">
          
          {/* Main Stat */}
          <motion.div variants={fadeInUp} className="flex flex-col md:items-end">
            <div className="flex items-baseline gap-1 text-secondary">
              <span className="text-6xl font-light tracking-tighter">
                <Counter value={98} />
              </span>
              <span className="text-xl font-light opacity-20">%</span>
            </div>
            <p className="text-secondary/20 text-[11px] font-bold uppercase tracking-[0.5em] -mt-1">
              Resolution Rate
            </p>
          </motion.div>

          {/* Sub Stats Row */}
          <div className="flex gap-12 pt-6 border-t border-secondary/5 w-full md:w-auto md:justify-end">
            <motion.div variants={fadeInUp} className="space-y-1">
              <span className="text-xl font-light text-secondary">
                <Counter value={312} />
              </span>
              <span className="text-secondary/30 text-[10px] font-bold uppercase tracking-[0.2em] block">
                Live Reports
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-1">
              <span className="text-xl font-light text-secondary">
                <Counter value={89} />
              </span>
              <span className="text-secondary/30 text-[10px] font-bold uppercase tracking-[0.2em] block">
                Fixed Month
              </span>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default CallToAction;