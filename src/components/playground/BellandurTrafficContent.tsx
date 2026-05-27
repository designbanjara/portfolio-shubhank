import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { MEAN, N, MONTH_LABELS, MONTH_AVGS, DOW_AVGS, HIST_BUCKETS } from '@/data/bellandurTrips';
import LivelineChart from './LivelineChart';
import ScatterPlot from './ScatterPlot';
import CalendarHeatmap from './CalendarHeatmap';

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.44, 0, 0.56, 1] } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit?: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, unit = 'min avg' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-1.5 text-xs shadow-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium ml-2">{payload[0].value} {unit}</span>
    </div>
  );
};

const BellandurTrafficContent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  const axisColor = isDark ? '#555' : '#aaa';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const barColor  = isDark ? '#4da6ff' : '#1a7fdf';
  const meanColor = isDark ? 'rgba(77,166,255,0.4)' : 'rgba(26,127,223,0.4)';

  const monthlyData = MONTH_LABELS.map((label, i) => ({ label, value: MONTH_AVGS[i] }));
  const dowData = ['Mon','Tue','Wed','Thu','Fri'].map((label, i) => ({ label, value: DOW_AVGS[i] }));
  const histData = ['<30','30-39','40-49','50-59','60-69','70+'].map((label, i) => ({ label, value: HIST_BUCKETS[i] }));

  const barRadius: [number, number, number, number] = [3, 3, 0, 0];

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">

      {/* ── HEADER ── */}
      <motion.div
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <motion.h1
          variants={shouldReduceMotion ? undefined : sectionVariants}
          className="text-3xl font-custom font-bold leading-tight"
        >
          The story of my experiments with{' '}
          <span style={{ color: '#FF6A00' }}>Bellandur Traffic</span>
        </motion.h1>

        <motion.p
          variants={shouldReduceMotion ? undefined : sectionVariants}
          className="mt-3 text-muted-foreground leading-relaxed max-w-[52ch]"
        >
          Our grandparents crossed rivers, our parents walked 5k. Bellandurian-employees pass three lakes —{' '}
          a <s style={{ textDecorationColor: '#D44338' }}>commute</s> that feels like running a marathon.
        </motion.p>

        {/* Stat boxes */}
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-7 mb-10"
        >
          {[
            { val: MEAN, suffix: ' min', label: 'Mean duration', color: undefined },
            { val: N,    suffix: '',     label: 'Trips logged',  color: undefined },
            { val: '~9', suffix: ' km',  label: 'Route distance',color: undefined },
            { val: null, suffix: '',     label: 'Period',        color: undefined },
          ].map(({ val, suffix, label, color }, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3 flex flex-col gap-1">
              {val !== null ? (
                <span className="font-custom font-bold text-3xl leading-none tabular-nums" style={color ? { color } : undefined}>
                  {val}
                  {suffix && <span className="text-base font-normal text-muted-foreground ml-0.5">{suffix}</span>}
                </span>
              ) : (
                <span className="font-custom font-bold text-lg leading-snug text-muted-foreground">Jan – Jul<br />2024</span>
              )}
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <hr className="border-border my-2" />

      {/* ── PROLOGUE ── */}
      <motion.div
        className="mt-8 mb-12"
        variants={shouldReduceMotion ? undefined : sectionVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <p className="text-foreground leading-[1.8]">
          In 2024, I had to commute to my office in Bellandur 5 days a week. After just a few days, I witnessed an immense amount of pleasure, pain, emptiness, fear, anger rolled into one. Here are a few things that happened.
        </p>
      </motion.div>

      {/* ── LIVELINE ── */}
      <motion.div
        className="mb-12"
        variants={shouldReduceMotion ? undefined : sectionVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="text-xl font-custom font-bold mb-1">Visualising all the commutes</h2>
        <p className="text-sm text-muted-foreground mb-4">Streamed chronologically from real departure logs. Dashed line marks the mean.</p>
        <div className="bg-card border border-border rounded-lg p-5">
          <LivelineChart />
        </div>
      </motion.div>

      {/* ── MONTHLY + DOW ── */}
      <motion.div
        className="mb-12"
        variants={shouldReduceMotion ? undefined : sectionVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="text-xl font-custom font-bold mb-4">Monthly & day-of-week averages</h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">April reads low — COVID gap left only easier days. June–July show the monsoon creeping in.</p>
            <div className="bg-card border border-border rounded-lg p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} barSize={24} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} domain={[28, 52]} />
                  <ReferenceLine y={MEAN} stroke={meanColor} strokeDasharray="4 4" strokeWidth={1} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="value" fill={barColor} radius={barRadius} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Tuesday averages {DOW_AVGS[1]} min — {DOW_AVGS[1] - DOW_AVGS[4]} min longer than Friday. The data is emphatic about this.</p>
            <div className="bg-card border border-border rounded-lg p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dowData} barSize={32} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} domain={[28, 58]} />
                  <ReferenceLine y={MEAN} stroke={meanColor} strokeDasharray="4 4" strokeWidth={1} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="value" fill={barColor} radius={barRadius} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CALENDAR ── */}
      <motion.div
        className="mb-12"
        variants={shouldReduceMotion ? undefined : sectionVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="text-xl font-custom font-bold mb-1">Six months at a glance</h2>
        <p className="text-sm text-muted-foreground mb-4">Every weekday Jan–Jul 2024. The COVID block (mid-March) and April absences are plainly visible.</p>
        <div className="bg-card border border-border rounded-lg p-5 overflow-x-auto">
          <CalendarHeatmap />
        </div>
      </motion.div>

      {/* ── ROUTES ── */}
      <motion.div
        className="mb-12"
        variants={shouldReduceMotion ? undefined : sectionVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="text-xl font-custom font-bold mb-1">Commuting different routes</h2>
        <p className="text-sm text-muted-foreground mb-4">South along Bannerghatta Road, through Silk Board, east along the ORR — three chokepoints, nine kilometres.</p>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── TIMING ── */}
      <motion.div
        className="mb-12"
        variants={shouldReduceMotion ? undefined : sectionVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="text-xl font-custom font-bold mb-1">Commuting at different times</h2>
        <p className="text-sm text-muted-foreground mb-4">Leaving early — free till Silkboard, choked from Silkboard onward. Leaving late — jarring to Silkboard, freer ORR.</p>
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={histData} barSize={32} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip unit="trips" />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="value" fill={barColor} radius={barRadius} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
            <ScatterPlot />
          </div>
        </div>
      </motion.div>

      {/* ── HOUSING ── */}
      <motion.div
        className="mb-12"
        variants={shouldReduceMotion ? undefined : sectionVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="text-xl font-custom font-bold mb-3">Finding houses in Bellandur</h2>
        <p className="text-foreground leading-[1.8]">
          ₹40k for a 2BHK = not affordable. If surviving the commute doesn't break you, the rent will. Moving closer to work turned out to not be a viable solution — Bellandur has priced out most of the employees who are doing exactly this commute.
        </p>
      </motion.div>

      {/* ── FOOTER ── */}
      <p className="text-xs text-muted-foreground mt-12">
        {N} trips · ~9 km · avg {MEAN} min · Jan–Jul 2024
      </p>
    </div>
  );
};

export default BellandurTrafficContent;
