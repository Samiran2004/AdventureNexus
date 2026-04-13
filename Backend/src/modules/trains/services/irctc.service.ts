import axios from 'axios';
import logger from '../../../shared/utils/logger';
import { searchStationsLocal, STATIONS } from '../data/stations.data';

// ── API Configuration ──────────────────────────────────────────────────────
const RAPIDAPI_HOST   = 'irctc1.p.rapidapi.com';
const RAPIDAPI_KEY    = process.env.RAPIDAPI_KEY || '';
const INDIANAPI_KEY   = process.env.INDIANAPI_KEY || '';   // Free from indianapi.in (500/day)

// Axios instance for IRCTC RapidAPI (primary)
const irctcAxios = axios.create({
    baseURL: `https://${RAPIDAPI_HOST}`,
    headers: { 'x-rapidapi-host': RAPIDAPI_HOST, 'x-rapidapi-key': RAPIDAPI_KEY },
    timeout: 8000
});

// Axios instance for indianapi.in (free fallback)
const indianApiAxios = axios.create({
    baseURL: 'https://indianapi.in',
    headers: { 'x-api-key': INDIANAPI_KEY },
    timeout: 8000
});

const hasRapidApiKey    = (): boolean => Boolean(RAPIDAPI_KEY  && RAPIDAPI_KEY.length > 10);
const hasIndianApiKey   = (): boolean => Boolean(INDIANAPI_KEY && INDIANAPI_KEY.length > 5);

// ── Helper: station name from code ────────────────────────────────────────
function stationName(code: string): string {
    return STATIONS.find(s => s.code === code.toUpperCase())?.name || code;
}

// ── Smart Mock Train Generator ─────────────────────────────────────────────
/**
 * Generates plausible mock trains between two real station codes.
 * Uses the actual station names so the results look correct even without API.
 */
function generateMockTrains(fromCode: string, toCode: string): any[] {
    const from     = fromCode.toUpperCase();
    const to       = toCode.toUpperCase();
    const fromName = stationName(from);
    const toName   = stationName(to);

    // Well-known routes get real train data
    const knownRoutes: Record<string, any[]> = {
        'NDLS-HWH': [
            { trainNumber: '12301', trainName: 'Howrah Rajdhani Express',  from, fromName, to, toName, departureTime: '16:55', arrivalTime: '10:00+1', duration: '17h 05m', runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Second_AC', fare:1850, availability:'Available (12)' },{ class:'Third_AC', fare:1330, availability:'Available (28)' },{ class:'Sleeper', fare:520, availability:'Available (45)' }], distance: '1450 km', type: 'Rajdhani' },
            { trainNumber: '12305', trainName: 'Kolkata Rajdhani Express', from, fromName, to, toName, departureTime: '22:35', arrivalTime: '15:55+1', duration: '17h 20m', runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Second_AC', fare:1850, availability:'Available (18)' },{ class:'Third_AC', fare:1330, availability:'Available (34)' }], distance: '1450 km', type: 'Rajdhani' },
            { trainNumber: '12303', trainName: 'Poorva Express',           from, fromName, to, toName, departureTime: '08:45', arrivalTime: '06:00+1', duration: '21h 15m', runningDays: ['Mon','Wed','Fri','Sun'], classes: [{ class:'Second_AC', fare:1635, availability:'Available (5)' },{ class:'Third_AC', fare:1175, availability:'WL 3' },{ class:'Sleeper', fare:465, availability:'Available (62)' },{ class:'General', fare:230, availability:'Available' }], distance: '1450 km', type: 'Express' },
        ],
        'NDLS-SDAH': [
            { trainNumber: '12259', trainName: 'Sealdah Duronto Express',  from, fromName, to, toName, departureTime: '20:50', arrivalTime: '13:35+1', duration: '16h 45m', runningDays: ['Mon','Wed','Fri'], classes: [{ class:'Second_AC', fare:1790, availability:'Available (9)' },{ class:'Third_AC', fare:1285, availability:'Available (21)' },{ class:'Sleeper', fare:500, availability:'Available (38)' }], distance: '1452 km', type: 'Duronto' },
            { trainNumber: '12381', trainName: 'Poorabiya Express',        from, fromName, to, toName, departureTime: '23:55', arrivalTime: '05:15+2', duration: '29h 20m', runningDays: ['Mon','Thu','Sat'], classes: [{ class:'Sleeper', fare:440, availability:'Available (55)' },{ class:'General', fare:220, availability:'Available' }], distance: '1455 km', type: 'Express' },
        ],
        'MCA-HWH': [
            { trainNumber: '68003', trainName: 'MCA-HWH Passenger',        from, fromName, to, toName, departureTime: '07:30', arrivalTime: '09:15',   duration: '1h 45m',  runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'General', fare:30, availability:'Available' }], distance: '55 km', type: 'Passenger' },
            { trainNumber: '22847', trainName: 'Shalimar-Hatia Express',   from, fromName, to, toName, departureTime: '12:50', arrivalTime: '14:10',   duration: '1h 20m',  runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Sleeper', fare:75, availability:'Available (40)' },{ class:'General', fare:30, availability:'Available' }], distance: '55 km', type: 'Express' },
            { trainNumber: '12859', trainName: 'Gitanjali Express',        from, fromName, to, toName, departureTime: '15:25', arrivalTime: '16:45',   duration: '1h 20m',  runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Second_AC', fare:285, availability:'Available (8)' },{ class:'Third_AC', fare:195, availability:'Available (22)' },{ class:'Sleeper', fare:85, availability:'Available (60)' },{ class:'General', fare:30, availability:'Available' }], distance: '55 km', type: 'Superfast' },
            { trainNumber: '12809', trainName: 'Mumbai Mail',              from, fromName, to, toName, departureTime: '19:45', arrivalTime: '21:05',   duration: '1h 20m',  runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Second_AC', fare:290, availability:'Available (4)' },{ class:'Third_AC', fare:200, availability:'Available (12)' },{ class:'Sleeper', fare:90, availability:'Available (45)' }], distance: '55 km', type: 'Mail' },
        ],
        'HWH-MCA': [
            { trainNumber: '68004', trainName: 'HWH-MCA Passenger',        from, fromName, to, toName, departureTime: '10:30', arrivalTime: '12:20',   duration: '1h 50m',  runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'General', fare:30, availability:'Available' }], distance: '55 km', type: 'Passenger' },
            { trainNumber: '12860', trainName: 'Gitanjali Express',        from, fromName, to, toName, departureTime: '06:10', arrivalTime: '07:30',   duration: '1h 20m',  runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Second_AC', fare:285, availability:'Available (11)' },{ class:'Third_AC', fare:195, availability:'Available (30)' },{ class:'Sleeper', fare:85, availability:'Available (55)' }], distance: '55 km', type: 'Superfast' },
        ],
        'NDLS-BCT': [
            { trainNumber: '12951', trainName: 'Mumbai Rajdhani Express',  from, fromName, to, toName, departureTime: '16:55', arrivalTime: '08:35+1', duration: '15h 40m', runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Second_AC', fare:2880, availability:'Available (22)' },{ class:'Third_AC', fare:2035, availability:'Available (45)' }], distance: '1384 km', type: 'Rajdhani' },
            { trainNumber: '12953', trainName: 'August Kranti Rajdhani',   from, fromName, to, toName, departureTime: '17:25', arrivalTime: '10:35+1', duration: '17h 10m', runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], classes: [{ class:'Second_AC', fare:2880, availability:'Available (15)' },{ class:'Third_AC', fare:2035, availability:'WL 5' }], distance: '1384 km', type: 'Rajdhani' },
        ],
        'NDLS-MAS': [
            { trainNumber: '12433', trainName: 'Chennai Rajdhani Express', from, fromName, to, toName, departureTime: '22:30', arrivalTime: '08:55+2', duration: '34h 25m', runningDays: ['Tue','Wed','Fri','Sat'], classes: [{ class:'Second_AC', fare:3515, availability:'Available (8)' },{ class:'Third_AC', fare:2490, availability:'WL 12' }], distance: '2182 km', type: 'Rajdhani' },
        ],
        'NDLS-SBC': [
            { trainNumber: '22691', trainName: 'Rajdhani Express (SBC)',   from, fromName, to, toName, departureTime: '20:00', arrivalTime: '07:30+2', duration: '35h 30m', runningDays: ['Mon','Wed','Thu','Sat'], classes: [{ class:'Second_AC', fare:3740, availability:'Available (6)' },{ class:'Third_AC', fare:2650, availability:'WL 3' }], distance: '2367 km', type: 'Rajdhani' },
        ],
    };

    const routeKey = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;

    if (knownRoutes[routeKey]) return knownRoutes[routeKey];

    // Check reverse and swap from/to fields
    if (knownRoutes[reverseKey]) {
        return knownRoutes[reverseKey].map(t => ({
            ...t,
            from: to, fromName: toName,
            to: from, toName: fromName,
            departureTime: t.arrivalTime?.replace('+1','').replace('+2',''),
            arrivalTime: t.departureTime
        }));
    }

    // Generic route: generate 12 plausible trains across the day for a better demo experience
    const dynamicTrains = [];
    const types = ['Express', 'Passenger', 'Superfast', 'Mail', 'Intercity'];
    
    for (let i = 0; i < 12; i++) {
        // Spread departures from early morning to late night (05:00 to 22:00)
        let depHour = 5 + Math.floor(i * 1.5);
        let depMin = (i * 17) % 60;
        
        // Randomize duration between 1 to 5 hours for demo
        let durationHours = 1 + (i % 4);
        let durationMins = (i * 23) % 60;
        
        let arrHour = depHour + durationHours;
        let arrMin = depMin + durationMins;
        if (arrMin >= 60) { arrMin -= 60; arrHour += 1; }
        
        const dayStr = arrHour >= 24 ? '+1' : '';
        arrHour = arrHour % 24;

        const pad = (n: number) => n.toString().padStart(2, '0');
        const type = types[i % types.length];
        const trainNum = (12000 + i * 47).toString();

        dynamicTrains.push({
            trainNumber: trainNum,
            trainName: `${fromName} — ${toName} ${type}`,
            from, fromName, to, toName,
            departureTime: `${pad(depHour)}:${pad(depMin)}`,
            arrivalTime: `${pad(arrHour)}:${pad(arrMin)}${dayStr}`,
            duration: `${durationHours}h ${durationMins}m`,
            runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            classes: [
                { class:'Third_AC', fare: Math.floor(350 + i * 15), availability: `Available (${Math.floor(i * 3 + 12)})` },
                { class:'Sleeper',  fare: Math.floor(120 + i * 8), availability: `Available (${Math.floor(i * 5 + 30)})` },
                { class:'General',  fare: Math.floor(45 + i * 3),  availability: 'Available' }
            ],
            distance: '~180 km', 
            type: type
        });
    }
    
    return dynamicTrains;
}

// ── Timetable mock for known trains ────────────────────────────────────────
const MOCK_SCHEDULES: Record<string, any[]> = {
    '12301': [
        { stationCode:'NDLS', stationName:'New Delhi',               arrival:'--',    departure:'16:55', distance:0,    dayCount:1, halt:'--',    platformNo:16 },
        { stationCode:'CNB',  stationName:'Kanpur Central',          arrival:'20:35', departure:'20:40', distance:440,  dayCount:1, halt:'5 min', platformNo:1  },
        { stationCode:'ALD',  stationName:'Prayagraj Junction',      arrival:'22:50', departure:'22:55', distance:628,  dayCount:1, halt:'5 min', platformNo:4  },
        { stationCode:'MGS',  stationName:'Pt. DDU Junction (Mghls)',arrival:'00:43', departure:'00:45', distance:788,  dayCount:2, halt:'2 min', platformNo:2  },
        { stationCode:'GAYA', stationName:'Gaya Junction',           arrival:'02:47', departure:'02:50', distance:993,  dayCount:2, halt:'3 min', platformNo:1  },
        { stationCode:'DHN',  stationName:'Dhanbad Junction',        arrival:'05:45', departure:'05:50', distance:1179, dayCount:2, halt:'5 min', platformNo:2  },
        { stationCode:'ASN',  stationName:'Asansol Junction',        arrival:'07:00', departure:'07:05', distance:1278, dayCount:2, halt:'5 min', platformNo:1  },
        { stationCode:'BWN',  stationName:'Burdwan Junction',        arrival:'08:25', departure:'08:27', distance:1366, dayCount:2, halt:'2 min', platformNo:3  },
        { stationCode:'HWH',  stationName:'Howrah Junction',         arrival:'10:00', departure:'--',    distance:1450, dayCount:2, halt:'--',    platformNo:12 },
    ],
    '22847': [
        { stationCode:'SHM',  stationName:'Shalimar',                arrival:'--',    departure:'10:50', distance:0,   dayCount:1, halt:'--',    platformNo:2 },
        { stationCode:'SRC',  stationName:'Santragachi Junction',    arrival:'11:05', departure:'11:07', distance:8,   dayCount:1, halt:'2 min', platformNo:1 },
        { stationCode:'ULB',  stationName:'Uluberia',                arrival:'11:30', departure:'11:32', distance:30,  dayCount:1, halt:'2 min', platformNo:2 },
        { stationCode:'BRR',  stationName:'Bauria',                  arrival:'11:45', departure:'11:47', distance:38,  dayCount:1, halt:'2 min', platformNo:1 },
        { stationCode:'MCA',  stationName:'Mecheda',                 arrival:'12:50', departure:'12:52', distance:55,  dayCount:1, halt:'2 min', platformNo:1 },
        { stationCode:'PDA',  stationName:'Panskura',                arrival:'13:10', departure:'13:12', distance:68,  dayCount:1, halt:'2 min', platformNo:2 },
        { stationCode:'KGP',  stationName:'Kharagpur Junction',      arrival:'13:55', departure:'14:05', distance:115, dayCount:1, halt:'10 min', platformNo:4 },
        { stationCode:'RNC',  stationName:'Ranchi',                  arrival:'22:15', departure:'--',    distance:410, dayCount:1, halt:'--',    platformNo:3 },
    ],
    '12859': [
        { stationCode:'HWH',  stationName:'Howrah Junction',         arrival:'--',    departure:'13:45', distance:0,   dayCount:1, halt:'--',    platformNo:9  },
        { stationCode:'SRC',  stationName:'Santragachi Junction',    arrival:'14:10', departure:'14:12', distance:8,   dayCount:1, halt:'2 min', platformNo:2  },
        { stationCode:'ULB',  stationName:'Uluberia',                arrival:'14:35', departure:'14:37', distance:30,  dayCount:1, halt:'2 min', platformNo:1  },
        { stationCode:'MCA',  stationName:'Mecheda',                 arrival:'15:25', departure:'15:27', distance:55,  dayCount:1, halt:'2 min', platformNo:1  },
        { stationCode:'PDA',  stationName:'Panskura',                arrival:'15:45', departure:'15:47', distance:68,  dayCount:1, halt:'2 min', platformNo:2  },
        { stationCode:'KGP',  stationName:'Kharagpur Junction',      arrival:'16:30', departure:'16:40', distance:115, dayCount:1, halt:'10 min', platformNo:3 },
        { stationCode:'TATA', stationName:'Tatanagar Junction',      arrival:'19:05', departure:'19:10', distance:195, dayCount:1, halt:'5 min', platformNo:2  },
        { stationCode:'CSTM', stationName:'Mumbai CSMT',             arrival:'11:50', departure:'--',    distance:1968,dayCount:2, halt:'--',    platformNo:18 },
    ],
};

// ── Service Functions ──────────────────────────────────────────────────────

/**
 * Search trains between two stations.
 * Priority: RapidAPI → indianapi.in → smart mock data
 */
export async function searchTrains(fromCode: string, toCode: string, date: string): Promise<any[]> {
    const from = fromCode.toUpperCase();
    const to   = toCode.toUpperCase();

    // 1. Try RapidAPI IRCTC1 (if key present and not quota-exceeded)
    if (hasRapidApiKey()) {
        try {
            const res = await irctcAxios.get('/api/v1/searchTrain', {
                params: { fromStationCode: from, toStationCode: to, dateOfJourney: date }
            });
            if (res.data?.status && res.data?.data?.length) {
                logger.info(`[IRCTC] RapidAPI search: ${from}→${to}, ${res.data.data.length} results`);
                return res.data.data;
            }
        } catch (err: any) {
            logger.warn(`[IRCTC] RapidAPI failed: ${err?.response?.data?.message || err.message}`);
        }
    }

    // 2. Try indianapi.in (free, 500 calls/day, signup at indianapi.in)
    if (hasIndianApiKey()) {
        try {
            const res = await indianApiAxios.get('/trains', {
                params: { from, to }
            });
            // CRITICAL: Must check it's actually an Array of train objects,
            // NOT just a truthy .length (which HTML strings also have!)
            const raw = res.data?.data || res.data;
            if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'object') {
                const trains = raw.slice(0, 25); // cap at 25 to prevent browser freeze
                logger.info(`[IRCTC] indianapi.in search: ${from}→${to}, ${trains.length} results (capped from ${raw.length})`);
                return trains;
            }
            logger.warn(`[indianapi] Response was not a valid train array (type=${typeof raw})`);
        } catch (err: any) {
            logger.warn(`[indianapi] Failed: ${err?.response?.data?.message || err.message}`);
        }
    }

    // 3. Smart mock fallback — route-aware, uses real station names
    logger.warn(`[IRCTC] Using smart mock data for ${from}→${to} (no live API key)`);
    return generateMockTrains(from, to);
}

/**
 * Get the complete schedule/timetable for a train.
 */
export async function getTrainSchedule(trainNumber: string): Promise<any[]> {
    // 1. RapidAPI
    if (hasRapidApiKey()) {
        try {
            const res = await irctcAxios.get('/api/v1/getTrainSchedule', { params: { trainNo: trainNumber } });
            if (res.data?.status && res.data?.data?.length) return res.data.data;
        } catch (err: any) {
            logger.warn(`[IRCTC] Schedule RapidAPI failed: ${err.message}`);
        }
    }

    // 2. indianapi.in
    if (hasIndianApiKey()) {
        try {
            const res = await indianApiAxios.get(`/train_schedule`, { params: { train_number: trainNumber } });
            if (res.data?.data?.length) return res.data.data;
        } catch (err: any) {
            logger.warn(`[indianapi] Schedule failed: ${err.message}`);
        }
    }

    // 3. Local known schedule or generic placeholder
    return MOCK_SCHEDULES[trainNumber] || [
        { stationCode: '??',  stationName: 'Schedule not available for this train', arrival: '--', departure: '--', distance: 0, dayCount: 1, halt: '--' }
    ];
}

/**
 * Get live running status of a train.
 */
export async function getTrainLiveStatus(trainNumber: string): Promise<any> {
    if (hasRapidApiKey()) {
        try {
            const res = await irctcAxios.get('/api/v1/liveTrainStatus', { params: { trainNo: trainNumber, startingDay: 1 } });
            if (res.data?.status && res.data?.data) return res.data.data;
        } catch (err: any) {
            logger.warn(`[IRCTC] Live status failed: ${err.message}`);
        }
    }

    if (hasIndianApiKey()) {
        try {
            const res = await indianApiAxios.get('/train_status', { params: { train_number: trainNumber } });
            if (res.data?.data) return res.data.data;
        } catch (err: any) {
            logger.warn(`[indianapi] Live status failed: ${err.message}`);
        }
    }

    return {
        trainNumber,
        trainName: `Train #${trainNumber}`,
        currentStation: 'Live status unavailable',
        nextStation: 'Add INDIANAPI_KEY for real data',
        status: 'Running',
        delay: 'N/A (demo mode)',
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Search/autocomplete stations — fully offline, instant, 250+ stations.
 */
export async function searchStations(query: string): Promise<any[]> {
    // Offline database is instant and accurate — no API call needed
    return searchStationsLocal(query);
}
