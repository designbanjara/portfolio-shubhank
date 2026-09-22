import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { TRIPS } from '@/data/bellandurTrips';

// Polyfill for older browsers
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x: number, y: number, w: number, h: number, r: number) {
    this.beginPath();
    this.moveTo(x + r, y); this.lineTo(x + w - r, y); this.arcTo(x + w, y, x + w, y + r, r);
    this.lineTo(x + w, y + h - r); this.arcTo(x + w, y + h, x + w - r, y + h, r);
    this.lineTo(x + r, y + h); this.arcTo(x, y + h, x, y + h - r, r);
    this.lineTo(x, y + r); this.arcTo(x, y, x + r, y, r); this.closePath();
  };
}

const lookup: Record<string, number> = {};
TRIPS.forEach(t => { lookup[t.date] = t.dur; });

const covidDates = new Set<string>();
for (let d = 12; d <= 21; d++) covidDates.add('2024-03-' + String(d).padStart(2, '0'));

const missedDates = new Set([
  '2024-04-01','2024-04-02',
  '2024-04-12','2024-04-13','2024-04-14','2024-04-15','2024-04-16',
  '2024-04-17','2024-04-18','2024-04-19','2024-04-20','2024-04-21',
]);

function durColor(v: number) {
  if (v < 35) return '#2E9B7A';
  if (v > 55) return '#D44338';
  const t = (v - 35) / 20;
  return `rgb(${Math.round(46 + t * (212 - 46))},${Math.round(155 + t * (160 - 155))},${Math.round(122 + t * (32 - 122))})`;
}

const CalendarHeatmap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    function draw() {
      const dark = theme === 'dark';
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(320, wrap!.clientWidth);
      const H = 200;
      canvas!.width = W * dpr; canvas!.height = H * dpr;
      canvas!.style.width = W + 'px'; canvas!.style.height = H + 'px';
      const ctx = canvas!.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const BG     = dark ? '#141414' : '#ffffff';
      const MUTED  = dark ? '#666' : '#999';
      const WKEND  = dark ? '#1c1c1c' : '#f0f0f0';
      const EMPTY  = dark ? '#1f1f1f' : '#ebebeb';
      const BORDER = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      const FONT   = '8px Inter,sans-serif';

      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

      const pL = 28, pT = 20, pR = 4, pB = 8;
      const cellW = Math.floor((W - pL - pR) / 26);
      const cellH = Math.floor((H - pT - pB) / 7);
      const gap = 2;

      ['M','T','W','T','F','S','S'].forEach((d, i) => {
        ctx.fillStyle = MUTED; ctx.font = FONT; ctx.textAlign = 'right';
        ctx.fillText(d, pL - 3, pT + i * cellH + cellH / 2 + 2.5);
      });

      const startDate = new Date('2024-01-29T00:00:00');
      const endDate = new Date('2024-07-07T00:00:00');
      const mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];
      let week = 0, prevMonth = -1;

      for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 7), week++) {
        for (let dow = 0; dow < 7; dow++) {
          const cur = new Date(d); cur.setDate(cur.getDate() + dow);
          const iso = cur.toISOString().slice(0, 10);
          const m = cur.getMonth();
          const x = pL + week * cellW, y = pT + dow * cellH;
          const cw = cellW - gap, ch = cellH - gap;

          if (dow === 0 && m !== prevMonth) {
            ctx.fillStyle = MUTED; ctx.font = FONT; ctx.textAlign = 'left';
            ctx.fillText(mNames[m], x, pT - 5); prevMonth = m;
          }

          ctx.beginPath(); ctx.roundRect(x, y, cw, ch, 1.5);

          if (lookup[iso] !== undefined) {
            const v = lookup[iso];
            ctx.fillStyle = durColor(v); ctx.fill();
            if (cw > 18) {
              ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '6.5px Inter,sans-serif'; ctx.textAlign = 'center';
              ctx.fillText(String(v), x + cw / 2, y + ch / 2 + 2.5);
            }
          } else if (covidDates.has(iso)) {
            ctx.fillStyle = dark ? '#2a1a1a' : '#FFE8E5'; ctx.fill();
            ctx.strokeStyle = dark ? '#5a1a1a' : '#FFBDB8'; ctx.lineWidth = 0.5; ctx.stroke();
          } else if (missedDates.has(iso)) {
            ctx.fillStyle = dark ? '#1a1a2a' : '#E8EEFF'; ctx.fill();
          } else if (dow >= 5) {
            ctx.fillStyle = WKEND; ctx.fill();
          } else {
            ctx.fillStyle = EMPTY; ctx.fill();
            ctx.strokeStyle = BORDER; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
    }

    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [theme]);

  return (
    <div ref={wrapRef} className="w-full overflow-x-auto">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <div className="flex gap-2 flex-wrap mt-3">
        {[
          { color: '#2E9B7A', label: '<35 min' },
          { color: '#c8a020', label: '35–55 min' },
          { color: '#D44338', label: '55+ min' },
        ].map(({ color, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeatmap;
