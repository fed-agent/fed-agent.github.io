// chartClient.ts - renders line charts (data-fig from charts.json) and
// distribution bar charts (data-dist from distributions.json). Single init per page.
import Chart from 'chart.js/auto';

const INDIGO = '#2a2f6c';
const GREY = '#9aa0b4';

const COLORS: Record<string, string> = {
  Centralized: GREY, FedAgent: INDIGO,
  'ω=0.01': GREY, 'ω=0.99': INDIGO,
  'ξ=1': INDIGO, 'ξ=256': GREY,
  'ξ′=1': INDIGO, 'ξ′=256': GREY,
  Uniform: GREY,
  'Catalog Split': '#2e7d32', 'Field-Subset Index': '#e0a93a', 'BM25 Reweighting': '#3f8f7a',
  'Lookalike Injection': '#e8662a', 'Rank Wrapper': '#c0392b',
  '100 samples/round': INDIGO, '500 samples/round': '#3f8f7a', '1000 samples/round': '#e0a93a',
  '1 client/round': GREY, '2 client/round': INDIGO, '4 client/round': '#e0a93a',
  '1 ep/round': GREY, '3 ep/round': INDIGO, '5 ep/round': '#e0a93a',
};
const DASHED = new Set(['Centralized', 'Uniform']);
const FALLBACK = [INDIGO, '#3f8f7a', '#e0a93a', '#c0392b', GREY, '#4a56c9'];
const colorFor = (label: string, i: number) => COLORS[label] || FALLBACK[i % FALLBACK.length];

let _b: Promise<any> | null = null;
let _d: Promise<any> | null = null;
const loadLines = () => (_b = _b || fetch('/data/charts.json').then((r) => r.json()));
const loadDist = () => (_d = _d || fetch('/data/distributions.json').then((r) => r.json()));

const instances = new WeakMap<HTMLCanvasElement, Chart>();
const kill = (c: HTMLCanvasElement) => { const p = instances.get(c); if (p) p.destroy(); };

const axisFont = { family: 'Inter', size: 12, weight: '600' as const };
const tickFont = { family: 'Inter', size: 11 };

function renderLine(canvas: HTMLCanvasElement, b: any) {
  const fig = b?.figures?.[canvas.dataset.fig!];
  if (!fig) return;
  const axis = fig.axes.find((a: any) => a.key === canvas.dataset.axis) || fig.axes[0];
  kill(canvas);
  const datasets = axis.series.map((s: any, i: number) => {
    const c = colorFor(s.label, i);
    const hero = s.label === 'FedAgent';
    return {
      label: s.label, data: s.x.map((xi: number, j: number) => ({ x: xi, y: s.y[j] })),
      borderColor: c, backgroundColor: c, borderWidth: hero ? 3 : 2.3,
      borderDash: DASHED.has(s.label) ? [6, 5] : [], tension: 0.3,
      pointRadius: 0, pointHoverRadius: 4, pointHitRadius: 8, fill: false, order: hero ? 0 : 1,
    };
  });
  const ymax = Math.max(axis.ymax || 73, ...axis.series.flatMap((s: any) => s.y));
  instances.set(canvas, new Chart(canvas, {
    type: 'line', data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      scales: {
        x: { type: 'linear', min: 0, max: 212, title: { display: true, text: axis.xlabel || 'Training Epoch', font: axisFont, color: '#6b7186' }, ticks: { stepSize: 50, font: tickFont, color: '#9aa0b4' }, grid: { display: false }, border: { color: '#d7dae6' } },
        y: { min: 0, max: Math.ceil(ymax / 5) * 5, title: { display: true, text: axis.ylabel || 'Success Rate (%)', font: axisFont, color: '#6b7186' }, ticks: { font: tickFont, color: '#9aa0b4' }, grid: { color: '#eef0f5' }, border: { display: false } },
      },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'line', boxWidth: 22, font: { family: 'Inter', size: 12 }, color: '#3e4358', padding: 12 } },
        tooltip: { backgroundColor: 'rgba(29,32,48,.95)', padding: 10, cornerRadius: 8, callbacks: { title: (it: any) => `Epoch ${Math.round(it[0].parsed.x)}`, label: (it: any) => ` ${it.dataset.label}: ${it.parsed.y.toFixed(1)}%` } },
      },
    },
  }));
}

function renderDist(canvas: HTMLCanvasElement, db: any) {
  const fig = db?.figures?.[canvas.dataset.dist!];
  if (!fig) return;
  const axis = fig.axes.find((a: any) => a.key === canvas.dataset.axis) || fig.axes[0];
  kill(canvas);
  const multi = axis.datasets.length > 1;
  const datasets = axis.datasets.map((d: any, i: number) => ({
    label: d.label || `series ${i + 1}`,
    data: d.data,
    backgroundColor: multi ? d.color : INDIGO,
    borderWidth: 0, barPercentage: 1.0, categoryPercentage: 1.0,
  }));
  instances.set(canvas, new Chart(canvas, {
    type: 'bar', data: { labels: axis.x, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { stacked: axis.stacked, title: { display: true, text: axis.xlabel || 'Client ID', font: axisFont, color: '#6b7186' }, grid: { display: false }, border: { color: '#d7dae6' }, ticks: { font: tickFont, color: '#9aa0b4', autoSkip: false, maxRotation: 0, callback: (_v: any, i: number) => (axis.x[i] % 20 === 0 ? axis.x[i] : '') } },
        y: { stacked: axis.stacked, min: 0, max: axis.ymax || undefined, title: { display: true, text: axis.ylabel || '', font: axisFont, color: '#6b7186' }, ticks: { font: tickFont, color: '#9aa0b4' }, grid: { color: '#eef0f5' }, border: { display: false } },
      },
      plugins: {
        legend: { display: multi, position: 'top', labels: { usePointStyle: true, pointStyle: 'rect', boxWidth: 12, font: { family: 'Inter', size: 11 }, color: '#3e4358', padding: 10 } },
        tooltip: { backgroundColor: 'rgba(29,32,48,.95)', padding: 9, cornerRadius: 8, callbacks: { title: (it: any) => `Client ${it[0].label}`, label: (it: any) => ` ${it.dataset.label}: ${it.parsed.y}` } },
      },
    },
  }));
}

const dispatch = (canvas: HTMLCanvasElement, b: any, db: any) =>
  canvas.dataset.dist ? renderDist(canvas, db) : renderLine(canvas, b);

async function init() {
  if ((window as any).__fedChartsInit) return;
  (window as any).__fedChartsInit = true;
  const needLines = document.querySelector('canvas[data-fig], [data-chart-toggle] button[data-fig]');
  const needDist = document.querySelector('canvas[data-dist], [data-chart-toggle] button[data-dist]');
  const [b, db] = await Promise.all([
    needLines ? loadLines() : Promise.resolve(null),
    needDist ? loadDist() : Promise.resolve(null),
  ]);

  document.querySelectorAll<HTMLCanvasElement>('canvas[data-fig], canvas[data-dist]').forEach((c) => dispatch(c, b, db));

  document.querySelectorAll<HTMLElement>('[data-chart-toggle]').forEach((group) => {
    const canvas = document.getElementById(group.dataset.target!) as HTMLCanvasElement | null;
    if (!canvas) return;
    group.querySelectorAll<HTMLButtonElement>('button[data-axis]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.fig) canvas.dataset.fig = btn.dataset.fig;
        if (btn.dataset.dist) canvas.dataset.dist = btn.dataset.dist;
        canvas.dataset.axis = btn.dataset.axis!;
        group.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
        btn.classList.add('active');
        dispatch(canvas, b, db);
      });
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
