export interface Trip {
  date: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  start: string;
  dur: number;
}

export const TRIPS: Trip[] = [
  {date:"2024-01-31",day:"Wed",start:"8:20",dur:54},
  {date:"2024-02-01",day:"Thu",start:"8:32",dur:60},
  {date:"2024-02-02",day:"Fri",start:"8:00",dur:29},
  {date:"2024-02-05",day:"Mon",start:"8:00",dur:37},
  {date:"2024-02-06",day:"Tue",start:"7:59",dur:48},
  {date:"2024-02-07",day:"Wed",start:"7:58",dur:49},
  {date:"2024-02-08",day:"Thu",start:"8:03",dur:41},
  {date:"2024-02-12",day:"Mon",start:"8:05",dur:41},
  {date:"2024-02-13",day:"Tue",start:"8:17",dur:57},
  {date:"2024-02-14",day:"Wed",start:"8:07",dur:43},
  {date:"2024-02-15",day:"Thu",start:"8:10",dur:53},
  {date:"2024-02-16",day:"Fri",start:"8:06",dur:33},
  {date:"2024-02-19",day:"Mon",start:"8:04",dur:43},
  {date:"2024-02-22",day:"Thu",start:"8:05",dur:43},
  {date:"2024-02-23",day:"Fri",start:"8:18",dur:38},
  {date:"2024-03-01",day:"Fri",start:"8:08",dur:42},
  {date:"2024-03-04",day:"Mon",start:"8:10",dur:46},
  {date:"2024-03-05",day:"Tue",start:"8:02",dur:60},
  {date:"2024-03-06",day:"Wed",start:"10:38",dur:60},
  {date:"2024-03-08",day:"Fri",start:"8:41",dur:27},
  {date:"2024-03-11",day:"Mon",start:"8:05",dur:50},
  {date:"2024-03-22",day:"Fri",start:"8:27",dur:32},
  {date:"2024-03-26",day:"Tue",start:"8:10",dur:56},
  {date:"2024-03-27",day:"Wed",start:"8:23",dur:46},
  {date:"2024-03-28",day:"Thu",start:"8:18",dur:33},
  {date:"2024-03-29",day:"Fri",start:"8:14",dur:25},
  {date:"2024-04-03",day:"Wed",start:"8:35",dur:46},
  {date:"2024-04-04",day:"Thu",start:"8:17",dur:39},
  {date:"2024-04-05",day:"Fri",start:"8:34",dur:29},
  {date:"2024-04-08",day:"Mon",start:"8:20",dur:35},
  {date:"2024-04-09",day:"Tue",start:"8:27",dur:25},
  {date:"2024-04-11",day:"Thu",start:"8:23",dur:35},
  {date:"2024-04-22",day:"Mon",start:"8:20",dur:40},
  {date:"2024-04-23",day:"Tue",start:"8:23",dur:49},
  {date:"2024-04-24",day:"Wed",start:"8:20",dur:48},
  {date:"2024-04-25",day:"Thu",start:"8:35",dur:50},
  {date:"2024-04-26",day:"Fri",start:"8:30",dur:24},
  {date:"2024-04-29",day:"Mon",start:"8:35",dur:45},
  {date:"2024-04-30",day:"Tue",start:"8:27",dur:52},
  {date:"2024-05-02",day:"Thu",start:"8:38",dur:54},
  {date:"2024-05-03",day:"Fri",start:"8:49",dur:36},
  {date:"2024-05-09",day:"Thu",start:"8:21",dur:52},
  {date:"2024-05-10",day:"Fri",start:"8:25",dur:32},
  {date:"2024-05-16",day:"Thu",start:"8:22",dur:55},
  {date:"2024-05-17",day:"Fri",start:"8:07",dur:47},
  {date:"2024-05-20",day:"Mon",start:"8:06",dur:68},
  {date:"2024-05-21",day:"Tue",start:"8:06",dur:53},
  {date:"2024-05-22",day:"Wed",start:"8:06",dur:47},
  {date:"2024-05-23",day:"Thu",start:"8:05",dur:43},
  {date:"2024-05-24",day:"Fri",start:"8:06",dur:31},
  {date:"2024-05-27",day:"Mon",start:"8:01",dur:38},
  {date:"2024-05-28",day:"Tue",start:"8:06",dur:48},
  {date:"2024-05-29",day:"Wed",start:"8:03",dur:46},
  {date:"2024-05-31",day:"Fri",start:"8:00",dur:31},
  {date:"2024-06-03",day:"Mon",start:"8:05",dur:46},
  {date:"2024-06-04",day:"Tue",start:"8:07",dur:58},
  {date:"2024-06-06",day:"Thu",start:"8:05",dur:40},
  {date:"2024-06-07",day:"Fri",start:"8:15",dur:40},
  {date:"2024-06-11",day:"Tue",start:"7:52",dur:45},
  {date:"2024-06-12",day:"Wed",start:"7:45",dur:35},
  {date:"2024-06-14",day:"Fri",start:"7:58",dur:37},
  {date:"2024-06-17",day:"Mon",start:"8:02",dur:28},
  {date:"2024-06-18",day:"Tue",start:"8:10",dur:72},
  {date:"2024-06-19",day:"Wed",start:"8:00",dur:53},
  {date:"2024-06-20",day:"Thu",start:"8:02",dur:59},
  {date:"2024-06-21",day:"Fri",start:"8:10",dur:41},
  {date:"2024-06-25",day:"Tue",start:"7:56",dur:46},
  {date:"2024-06-26",day:"Wed",start:"8:03",dur:50},
  {date:"2024-07-01",day:"Mon",start:"7:58",dur:34},
  {date:"2024-07-02",day:"Tue",start:"7:53",dur:51},
  {date:"2024-07-03",day:"Wed",start:"7:58",dur:42},
];

const durations = TRIPS.map(t => t.dur);
export const MEAN = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
export const BEST = Math.min(...durations);
export const WORST = Math.max(...durations);
export const N = TRIPS.length;

const mMap: Record<string, string> = {
  '01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul',
};
const monthData: Record<string, number[]> = {Jan:[],Feb:[],Mar:[],Apr:[],May:[],Jun:[],Jul:[]};
TRIPS.forEach(t => {
  const m = mMap[t.date.slice(5, 7)];
  if (m) monthData[m].push(t.dur);
});
export const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul'].filter(m => monthData[m].length > 0);
export const MONTH_AVGS = MONTH_LABELS.map(m =>
  Math.round(monthData[m].reduce((a, b) => a + b, 0) / monthData[m].length)
);

const dowData: Record<string, number[]> = {Mon:[],Tue:[],Wed:[],Thu:[],Fri:[]};
TRIPS.forEach(t => { if (dowData[t.day]) dowData[t.day].push(t.dur); });
export const DOW_AVGS = ['Mon','Tue','Wed','Thu','Fri'].map(d =>
  Math.round(dowData[d].reduce((a, b) => a + b, 0) / dowData[d].length)
);

const buckets = [0, 0, 0, 0, 0, 0];
TRIPS.forEach(t => {
  if (t.dur < 30) buckets[0]++;
  else if (t.dur < 40) buckets[1]++;
  else if (t.dur < 50) buckets[2]++;
  else if (t.dur < 60) buckets[3]++;
  else if (t.dur < 70) buckets[4]++;
  else buckets[5]++;
});
export const HIST_BUCKETS = buckets;
