import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { TRIPS, MEAN } from '@/data/bellandurTrips';

const WIN = 20;

interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; r: number; color: string;
}

const LivelineChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pauseBtnRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isDarkRef = useRef(theme === 'dark');

  const restartFnRef = useRef<() => void>(() => {});
  const pauseFnRef = useRef<() => void>(() => {});

  useEffect(() => { isDarkRef.current = theme === 'dark'; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let allPts: typeof TRIPS = [];
    let idx = 0;
    let paused = false;
    let lerpY = MEAN, targetY = MEAN;
    let particles: Particle[] = [];
    let pendingBurst: string | null = null;
    let shakeFrames = 0;
    let scrubX = -1;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let af = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = wrap.clientWidth * dpr;
      canvas.height = wrap.clientHeight * dpr;
      canvas.getContext('2d')?.scale(dpr, dpr);
    }

    function emitBurst(x: number, y: number, color: string, n = 10) {
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const s = 1 + Math.random() * 2.5;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.8, life: 1, r: 1.5 + Math.random() * 1.5, color });
      }
    }

    function draw() {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const W = wrap.clientWidth, H = wrap.clientHeight;
      const pL = 40, pR = 14, pT = 16, pB = 28;
      const FONT = '9px Inter,system-ui,sans-serif';
      const dark = isDarkRef.current;

      const COL_BG    = dark ? '#141414' : '#ffffff';
      const COL_GRID  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      const COL_MUTED = dark ? '#666' : '#999';
      const COL_FG    = dark ? '#fff' : '#121212';
      const COL_GOOD  = '#2E9B7A', COL_BAD = '#D44338';
      const COL_PRI   = dark ? '#4da6ff' : '#1a7fdf';

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = COL_BG;
      ctx.fillRect(0, 0, W, H);

      if (shakeFrames > 0) {
        ctx.save();
        const m = shakeFrames * 0.5;
        ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
      }

      if (allPts.length < 1) {
        ctx.fillStyle = COL_MUTED; ctx.font = FONT; ctx.textAlign = 'center';
        ctx.fillText('Starting…', W / 2, H / 2);
        if (shakeFrames > 0) ctx.restore();
        return;
      }

      const pts = allPts.slice(-WIN);
      const vals = pts.map(p => p.dur);
      const dataMin = Math.min(...vals), dataMax = Math.max(...vals);
      const spread = Math.max(dataMax - dataMin, 6), mid = (dataMin + dataMax) / 2;
      const minV = mid - spread / 2 - 2, maxV = mid + spread / 2 + 2;
      const xStep = (W - pL - pR) / (WIN - 1);
      const xAt = (i: number) => pL + (WIN - pts.length + i) * xStep;
      const yAt = (v: number) => pT + (1 - (v - minV) / (maxV - minV)) * (H - pT - pB);

      const gridVals = [Math.round(minV / 5) * 5, MEAN, Math.round(maxV / 5) * 5]
        .filter((g, _, a) => a.indexOf(g) === a.lastIndexOf(g) && g > minV && g < maxV);
      gridVals.forEach(g => {
        const y = yAt(g);
        ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(W - pR, y);
        if (g === MEAN) {
          ctx.strokeStyle = dark ? 'rgba(77,166,255,0.2)' : 'rgba(26,127,223,0.2)';
          ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = COL_GRID; ctx.setLineDash([]); ctx.lineWidth = 0.5;
        }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = g === MEAN ? COL_PRI : COL_MUTED;
        ctx.font = FONT; ctx.textAlign = 'right';
        ctx.fillText(g + 'm', pL - 3, y + 3.5);
      });

      if (MEAN > minV && MEAN < maxV) {
        ctx.fillStyle = COL_PRI; ctx.font = FONT; ctx.textAlign = 'left';
        ctx.fillText('avg', W - pR - 22, yAt(MEAN) - 4);
      }

      ctx.fillStyle = COL_MUTED; ctx.font = FONT; ctx.textAlign = 'center';
      pts.forEach((p, i) => {
        if (i % 5 === 0 || i === pts.length - 1) {
          const d = new Date(p.date + 'T00:00:00');
          ctx.fillText(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), xAt(i), H - 4);
        }
      });

      const liveY = yAt(lerpY);
      const grad = ctx.createLinearGradient(0, pT, 0, H - pB);
      grad.addColorStop(0, COL_PRI + (dark ? '28' : '18'));
      grad.addColorStop(1, COL_PRI + '00');
      ctx.beginPath();
      pts.forEach((p, i) => {
        const x = xAt(i), y = i < pts.length - 1 ? yAt(p.dur) : liveY;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.lineTo(xAt(pts.length - 1), H - pB); ctx.lineTo(xAt(0), H - pB); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();

      ctx.beginPath(); ctx.strokeStyle = COL_PRI; ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      pts.forEach((p, i) => {
        const x = xAt(i), y = i < pts.length - 1 ? yAt(p.dur) : liveY;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      const lx = xAt(pts.length - 1);
      const last = pts[pts.length - 1].dur;
      const dc = last > 55 ? COL_BAD : last < 35 ? COL_GOOD : COL_PRI;
      if (pendingBurst) { emitBurst(lx, liveY, dc); pendingBurst = null; }

      ctx.beginPath(); ctx.arc(lx, liveY, 4, 0, Math.PI * 2);
      ctx.fillStyle = dc; ctx.shadowBlur = 8; ctx.shadowColor = dc; ctx.fill(); ctx.shadowBlur = 0;
      ctx.font = 'bold 10px Inter,sans-serif';
      const lbl = Math.round(lerpY) + ' min', lw = ctx.measureText(lbl).width;
      const overflows = lx + 8 + lw > W - pR;
      ctx.fillStyle = dc; ctx.textAlign = overflows ? 'right' : 'left';
      ctx.fillText(lbl, overflows ? lx - 8 : lx + 8, liveY + 4);

      particles.forEach(p => {
        const al = Math.max(0, p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * al, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(al * 180).toString(16).padStart(2, '0');
        ctx.fill();
      });

      if (scrubX >= pL && scrubX <= W - pR && pts.length > 1) {
        const rawI = (scrubX - pL) / xStep - (WIN - pts.length);
        const i = Math.max(0, Math.min(pts.length - 1, Math.round(rawI)));
        const pt = pts[i]; const px = xAt(i), py = i === pts.length - 1 ? liveY : yAt(pt.dur);
        ctx.beginPath(); ctx.moveTo(px, pT); ctx.lineTo(px, H - pB);
        ctx.strokeStyle = COL_GRID; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fillStyle = COL_FG; ctx.fill();
        const d = new Date(pt.date + 'T00:00:00');
        const tipLabel = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', weekday: 'short' }) + ' · ' + pt.dur + ' min';
        ctx.font = 'bold 10px Inter,sans-serif';
        const tw = ctx.measureText(tipLabel).width + 14, th = 20;
        let tx = px + 8, ty = py - 26;
        if (tx + tw > W - pR) tx = px - tw - 4;
        if (ty < pT) ty = py + 8;
        ctx.fillStyle = COL_BG; ctx.strokeStyle = COL_GRID; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = pt.dur > 55 ? COL_BAD : pt.dur < 35 ? COL_GOOD : COL_PRI;
        ctx.textAlign = 'left'; ctx.fillText(tipLabel, tx + 7, ty + 14);
      }

      if (shakeFrames > 0) ctx.restore();
    }

    function loop() {
      lerpY += (targetY - lerpY) * 0.08;
      particles = particles.filter(p => p.life > 0.02);
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.vx *= 0.97; p.life -= 0.04; });
      if (shakeFrames > 0) shakeFrames--;
      draw();
      af = requestAnimationFrame(loop);
    }

    function addNext() {
      if (paused || idx >= TRIPS.length) return;
      const t = TRIPS[idx];
      if (allPts.length > 0) {
        const delta = t.dur - allPts[allPts.length - 1].dur;
        if (Math.abs(delta) >= 8) {
          pendingBurst = delta > 0 ? '#D44338' : '#2E9B7A';
          shakeFrames = Math.min(14, Math.round(Math.abs(delta) * 0.6));
        }
      }
      allPts = [...allPts, t]; targetY = t.dur; idx++;
      const pill = pillRef.current;
      if (pill) {
        const c = t.dur > 55 ? '#D44338' : t.dur < 35 ? '#2E9B7A' : (isDarkRef.current ? '#4da6ff' : '#1a7fdf');
        const d = new Date(t.date + 'T00:00:00');
        pill.textContent = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' — ' + t.dur + ' min';
        pill.style.color = c;
      }
      if (idx < TRIPS.length) {
        timer = setTimeout(addNext, 550 + Math.random() * 350);
      } else if (pill) {
        pill.textContent = 'Replay complete ✓';
        pill.style.color = '';
      }
    }

    function restart() {
      if (timer) clearTimeout(timer);
      cancelAnimationFrame(af);
      allPts = []; idx = 0; lerpY = MEAN; targetY = MEAN; paused = false;
      particles = []; shakeFrames = 0; pendingBurst = null;
      const btn = pauseBtnRef.current;
      if (btn) btn.textContent = '⏸ Pause';
      const pill = pillRef.current;
      if (pill) { pill.textContent = 'Starting…'; pill.style.color = ''; }
      loop(); timer = setTimeout(addNext, 900);
    }

    function togglePause() {
      paused = !paused;
      const btn = pauseBtnRef.current;
      if (btn) btn.textContent = paused ? '▶ Resume' : '⏸ Pause';
      if (!paused) timer = setTimeout(addNext, 400);
    }

    restartFnRef.current = restart;
    pauseFnRef.current = togglePause;

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      scrubX = e.clientX - r.left;
    };
    const onMouseLeave = () => { scrubX = -1; };
    const onResize = () => { resize(); draw(); };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    resize(); loop(); timer = setTimeout(addNext, 1000);

    return () => {
      if (timer) clearTimeout(timer);
      cancelAnimationFrame(af);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#2E9B7A' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#2E9B7A', animation: 'pulse 1.4s ease-in-out infinite' }} />
          Replaying 2024
        </span>
        <div ref={pillRef} className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          Starting…
        </div>
      </div>
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-md" style={{ height: 220 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '220px', display: 'block', cursor: 'crosshair' }} />
      </div>
      <div className="flex gap-2 flex-wrap mt-3">
        <button
          onClick={() => restartFnRef.current()}
          className="text-sm font-medium px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
        >
          ↺ Restart
        </button>
        <button
          ref={pauseBtnRef}
          onClick={() => pauseFnRef.current()}
          className="text-sm font-medium px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
        >
          ⏸ Pause
        </button>
      </div>
    </div>
  );
};

export default LivelineChart;
