import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { TRIPS, MEAN, BEST, WORST } from '@/data/bellandurTrips';

function parseTime(s: string) {
  const [h, m] = (s || '8:00').split(':').map(Number);
  return h * 60 + (m || 0);
}

const ScatterPlot: React.FC = () => {
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
      const W = Math.max(260, wrap!.clientWidth);
      const H = 260;
      canvas!.width = W * dpr; canvas!.height = H * dpr;
      canvas!.style.width = W + 'px'; canvas!.style.height = H + 'px';
      const ctx = canvas!.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const BG    = dark ? '#141414' : '#ffffff';
      const MUTED = dark ? '#666' : '#999';
      const GRID  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      const PRI   = dark ? '#4da6ff' : '#1a7fdf';
      const FONT  = '9px Inter,sans-serif';

      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

      const pL = 44, pR = 16, pT = 16, pB = 36;
      const minX = 450, maxX = 545, minY = 20, maxY = 80;
      const xAt = (v: number) => pL + (v - minX) / (maxX - minX) * (W - pL - pR);
      const yAt = (v: number) => pT + (1 - (v - minY) / (maxY - minY)) * (H - pT - pB);

      [25, 30, 40, 50, 60, 70].forEach(g => {
        const y = yAt(g);
        ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(W - pR, y);
        ctx.strokeStyle = GRID; ctx.setLineDash([]); ctx.lineWidth = 0.5; ctx.stroke();
        ctx.fillStyle = MUTED; ctx.font = FONT; ctx.textAlign = 'right';
        ctx.fillText(g + 'm', pL - 3, y + 3.5);
      });

      const meanY = yAt(MEAN);
      ctx.beginPath(); ctx.moveTo(pL, meanY); ctx.lineTo(W - pR, meanY);
      ctx.strokeStyle = PRI + '33'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = PRI + '88'; ctx.font = FONT; ctx.textAlign = 'left';
      ctx.fillText('avg ' + MEAN + 'm', W - pR - 36, meanY - 4);

      [460, 480, 500, 520, 540].forEach(t => {
        const h = Math.floor(t / 60), m = t % 60;
        const lbl = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
        const x = xAt(t); if (x < pL || x > W - pR) return;
        ctx.beginPath(); ctx.moveTo(x, pT); ctx.lineTo(x, H - pB);
        ctx.strokeStyle = GRID; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.fillStyle = MUTED; ctx.font = FONT; ctx.textAlign = 'center'; ctx.fillText(lbl, x, H - pB + 12);
      });

      ctx.fillStyle = MUTED; ctx.font = FONT; ctx.textAlign = 'center';
      ctx.fillText('DEPARTURE TIME', W / 2, H - 2);
      ctx.save(); ctx.translate(11, H / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('DURATION (MIN)', 0, 0); ctx.restore();

      // linear regression trend line
      const pts = TRIPS.map(t => ({ x: parseTime(t.start), y: t.dur }));
      const n = pts.length;
      const mx = pts.reduce((s, p) => s + p.x, 0) / n;
      const my = pts.reduce((s, p) => s + p.y, 0) / n;
      const num = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
      const den = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0);
      const slope = den ? num / den : 0, int = my - slope * mx;
      ctx.beginPath();
      ctx.moveTo(xAt(minX), yAt(slope * minX + int));
      ctx.lineTo(xAt(maxX), yAt(slope * maxX + int));
      ctx.strokeStyle = PRI + '22'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);

      TRIPS.forEach(t => {
        const tx = parseTime(t.start);
        let px = xAt(tx), py = yAt(t.dur);
        if (tx > maxX) px = W - pR - 8;
        const c = t.dur > 55 ? '#D44338' : t.dur < 35 ? '#2E9B7A' : '#FF6A00';
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = c + 'bb'; ctx.shadowBlur = 4; ctx.shadowColor = c + '44'; ctx.fill(); ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.strokeStyle = c; ctx.lineWidth = 0.8; ctx.stroke();
      });

      [
        { t: TRIPS.find(t => t.dur === WORST), label: WORST + ' min', side: 'left' },
        { t: TRIPS.find(t => t.dur === BEST),  label: BEST  + ' min', side: 'right' },
      ].forEach(({ t, label, side }) => {
        if (!t) return;
        const tx = parseTime(t.start), px = Math.min(xAt(tx), W - pR - 8), py = yAt(t.dur);
        ctx.fillStyle = t.dur > 55 ? '#D44338' : '#2E9B7A';
        ctx.font = '8px Inter,sans-serif';
        ctx.textAlign = side === 'left' ? 'right' : 'left';
        ctx.fillText(label, side === 'left' ? px - 7 : px + 7, py + 3);
      });
    }

    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [theme]);

  return (
    <div ref={wrapRef} className="w-full overflow-x-auto">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default ScatterPlot;
