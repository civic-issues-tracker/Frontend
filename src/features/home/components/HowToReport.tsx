import { MapPin, BellRing, Camera, Send } from 'lucide-react';

const HowToReport = () => {
  const steps = [
    {
      id: "01",
      title: "Pin the Location",
      desc: "Use your GPS or the search bar to mark the exact spot of the problem on a map.", 
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "02",
      title: "Add Issue Details",
      desc: "Describe the situation and upload a clear photo. Our AI will help prioritize the case.", 
      icon: <Camera className="w-4 h-4" />,
    },
    {
      id: "03",
      title: "Send Your Report",
      desc: "Submit your report to be instantly routed to the responsible city department for immediate action.", 
      icon: <Send className="w-4 h-4" />,
    },
    {
      id: "04",
      title: "Track the Fix",
      desc: "Monitor progress on your profile and get a notification as soon as the issue is resolved.", 
      icon: <BellRing className="w-4 h-4" />,
    },
  ];

  return (
    <section id="how-to-report" className="relative bg-secondary  pt-15 pb-16 overflow-clip">
      {/* Wave Header Background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-10 fill-primary">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-20 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-black tracking-[0.3em] uppercase text-[9px]">Workflow</span>
          <h2 className="text-primary text-2xl md:text-4xl font-header font-black mt-1 uppercase">How to Report</h2>
        </div>

        <div className="relative">
          {/* S-Curve Dotted Path  */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-30 -translate-x-1/2 pointer-events-none opacity-20">
             <svg width="100%" height="100%" viewBox="0 0 100 800" fill="none" preserveAspectRatio="none">
                <path d="M50 0 C 100 100, 0 200, 50 350 C 100 500, 0 600, 50 750" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="6 6" />
             </svg>
          </div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => {
              const isRight = index % 2 === 1;
              
              return (
                <div key={step.id} className={`flex flex-col md:flex-row items-center justify-center md:h-40 relative ${isRight ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* 1. TEXT BUBBLE  */}
                  <div className={`w-full md:w-[45%] flex ${isRight ? 'justify-start' : 'justify-end'}`}>
                    <div className="relative group bg-primary py-4 px-6 rounded-full shadow-lg max-w-[320px] transition-all hover:scale-105 border border-primary/20">
                      {/* Triangle Pointer */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-primary ${isRight ? '-left-1.5' : '-right-1.5'}`} />
                      
                      <div className="pr-10">
                        
                        <h3 className="text-secondary font-black text-sm uppercase leading-none mb-1.5">{step.title}</h3>
                        <p className="text-secondary/80 text-[11px] leading-relaxed font-body italic">{step.desc}</p>
                      </div>

                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-secondary shadow-md flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {/* 2. CENTER NODE */}
                  <div className="hidden md:flex w-[10%] justify-center relative z-20">
                     <div className="w-6 h-6 rounded-full border-[3px] border-secondary bg-primary flex items-center justify-center shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                     </div>
                  </div>

                  {/* 3. STEP NUMBER  */}
                  <div className={`w-full md:w-[45%] flex flex-col ${isRight ? 'items-end md:pr-8' : 'items-start md:pl-8'} mt-4 md:mt-0`}>
                     <span className="text-primary/10 font-black text-3xl md:text-5xl font-header leading-none tracking-tighter">
                        {step.id}
                     </span>
                     <span className="text-primary/60 font-bold text-[9px] uppercase tracking-[0.2em] -mt-1">Step</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telegram Box */}
        <div className="mt-16 flex flex-col items-center">
            <p className="text-primary/40 text-[10px] uppercase font-black tracking-widest mb-3">
              Prefer Telegram?
            </p>
            
            <a 
              href="https://t.me/YegnaFixBot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 pr-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all shadow-lg"
            >
              {/* Solid Telegram Icon with fill */}
              <div className="w-8 h-8 rounded-lg bg-[#229ED9] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                <Send className="w-4 h-4 -rotate-12 fill-current translate-x-[-0.5px] translate-y-[0.5px]" />
              </div>
              
              <div className="flex flex-col">
                <p className="text-primary text-[9px] font-medium opacity-70 leading-none mb-1">
                  Start reporting with
                </p>
                <p className="text-primary text-xs font-black tracking-tight">
                  @YegnaFixBot
                </p>
              </div>
            </a>
          </div>
      </div>
    </section>
  );
};

export default HowToReport;