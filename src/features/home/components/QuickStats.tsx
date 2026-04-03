import { BarChart3, CheckCircle2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const QuickStats = () => {
  const { t } = useTranslation();
  const stats = [
    {
      label: t('stats.total.label'),
      value: "312",
      icon: <Zap className="w-4 h-4 opacity-30" />,
      trend: t('stats.total.trend'),
      className: "md:col-start-2 md:row-start-1 md:mt-12" 
    },
    {
      label: t('stats.fixed.label'),
      value: "89",
      icon: <CheckCircle2 className="w-4 h-4 opacity-30" />,
      trend: "94%",
      className: "md:col-start-3 md:row-start-1" 
    },
    {
      label: t('stats.weekly.label'),
      value: "124",
      icon: <BarChart3 className="w-4 h-4 opacity-30" />,
      trend: "+12%",
      className: "md:col-start-3 md:row-start-2 md:-mt-5 lg:-mt-3"
    },
  ];

  return (
    <section className="bg-secondary py-14 px-6 mb-8 md:mb-5 overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        <div className="w-full lg:w-2/5 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">
              {t('stats.systemMetrics')}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-header font-black text-primary leading-tight mb-4">
            {t('stats.mainTitle')}
          </h2>
          <p className="text-primary/60 text-[15px] leading-relaxed mb-6 max-w-xs mx-auto lg:mx-0 font-body">
            {t('stats.description')}
          </p>
          <div className="w-20 h-px bg-primary/20 mx-auto lg:mx-0" />
        </div>

        <div className="w-full lg:w-3/5 grid grid-cols-1 justify-center sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative">
          {stats.map((stat, index) => (
            <div key={index} className={`relative flex flex-col justify-between p-6 min-h-40 w-full bg-primary rounded-2xl shadow-xl transition-all duration-500 hover:-translate-y-2 ${stat.className}`}>
              <div className="absolute top-0 right-0 w-1.5 h-full bg-secondary rounded-r-2xl opacity-80" />
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black tracking-widest text-secondary/50 leading-tight uppercase">{stat.label}</p>
                {stat.icon}
              </div>
              <div className="mt-6">
                <h3 className="text-4xl font-black font-header text-secondary tracking-tighter mb-1">{stat.value}</h3>
                <div className="flex items-center gap-1.5">
                   {stat.trend === t('stats.total.trend') && (
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  )}
                  <span className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">{stat.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStats;