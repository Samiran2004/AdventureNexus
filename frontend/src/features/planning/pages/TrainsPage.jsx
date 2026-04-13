import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    MapPin, Calendar, Clock, Users, Search, ArrowRight, RefreshCw,
    Train, Ticket, Map, ChevronDown, ChevronUp, X, CheckCircle,
    AlertTriangle, Info, Star, Zap, ArrowLeft, Loader2,
    Navigation, List, CreditCard, User, Shield, Eye,
    TrendingUp, Phone, Mail
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/components/NavBar';
import Footer from '@/components/mvpblocks/footer-newsletter';

gsap.registerPlugin(ScrollTrigger);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// ── Class config ──────────────────────────────────────────────────────────────
const SEAT_CLASSES = {
    General:    { label: 'General (GN)', emoji: '🚂', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30', fare: 30  },
    Sleeper:    { label: 'Sleeper (SL)', emoji: '🛏️', color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',  fare: 120 },
    Third_AC:   { label: '3rd AC (3A)',  emoji: '❄️', color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',  fare: 250 },
    Second_AC:  { label: '2nd AC (2A)',  emoji: '⭐', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', fare: 380 }
};

// ── Status badge helper ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        Running: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-400' },
        Delayed:  { color: 'bg-amber-500/20  text-amber-400  border-amber-500/40',  dot: 'bg-amber-400'  },
        Cancelled:{ color: 'bg-red-500/20    text-red-400    border-red-500/40',    dot: 'bg-red-400'    },
        'On Time':{ color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-400' },
        Confirmed:{ color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-400' },
    };
    const c = config[status] || config['On Time'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`}></span>
            {status}
        </span>
    );
};

// ── Station Autocomplete ──────────────────────────────────────────────────────
const StationInput = ({ label, value, onChange, onSelect, placeholder, id }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const debounceRef = useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(val);
        if (val.length >= 2) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`${BACKEND_URL}/api/v1/trains/stations/search?q=${val}`);
                    setSuggestions(res.data.data || []);
                    setShow(true);
                } catch { setSuggestions([]); }
                setLoading(false);
            }, 300);
        } else {
            setSuggestions([]);
            setShow(false);
        }
    };

    return (
        <div className="relative">
            <label className="text-xs text-slate-400 mb-1 block">{label}</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                <input
                    id={id}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => suggestions.length > 0 && setShow(true)}
                    onBlur={() => setTimeout(() => setShow(false), 200)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-3 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    autoComplete="off"
                />
                {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-indigo-400" size={14} />}
            </div>
            {show && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-52 overflow-y-auto">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-700/60 transition-colors flex items-center gap-3"
                            onMouseDown={() => { onSelect(s); setShow(false); }}
                        >
                            <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">{s.code}</span>
                            <span className="text-sm text-white">{s.name}</span>
                            {s.state && <span className="text-xs text-slate-400 ml-auto">{s.state}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Timetable Modal ───────────────────────────────────────────────────────────
const TimetableModal = ({ train, onClose }) => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/v1/trains/schedule/${train.trainNumber}`);
                setSchedule(res.data.data || []);
            } catch { setSchedule([]); }
            setLoading(false);
        };
        fetch();
    }, [train.trainNumber]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-700/60">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🚂</span>
                            <h2 className="text-lg font-bold text-white">{train.trainName}</h2>
                            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">#{train.trainNumber}</Badge>
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">Complete Route & Timetable</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Schedule */}
                <div className="overflow-y-auto flex-1 p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="animate-spin text-indigo-400" size={32} />
                        </div>
                    ) : schedule.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">No schedule data available</p>
                    ) : (
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-500 via-slate-600 to-emerald-500" />
                            <div className="space-y-0">
                                {schedule.map((stop, i) => {
                                    const isFirst = i === 0;
                                    const isLast = i === schedule.length - 1;
                                    return (
                                        <div key={i} className="flex items-start gap-4 relative pl-4">
                                            {/* Dot */}
                                            <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-3
                                                ${isFirst ? 'bg-indigo-500' : isLast ? 'bg-emerald-500' : 'bg-slate-600 border border-slate-500'}`}>
                                                {(isFirst || isLast) && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                            {/* Info */}
                                            <div className={`flex-1 py-3 border-b border-slate-800/60 ${isLast ? 'border-0' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs font-mono text-indigo-400 mr-2">{stop.stationCode}</span>
                                                        <span className="text-sm font-medium text-white">{stop.stationName}</span>
                                                        {stop.dayCount > 1 && (
                                                            <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Day {stop.dayCount}</span>
                                                        )}
                                                    </div>
                                                    {stop.platformNo && (
                                                        <span className="text-xs text-slate-500">Platform {stop.platformNo}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1">
                                                    {stop.arrival !== '--' && (
                                                        <span className="text-xs text-slate-400">Arr: <span className="text-slate-200 font-mono">{stop.arrival}</span></span>
                                                    )}
                                                    {stop.departure !== '--' && (
                                                        <span className="text-xs text-slate-400">Dep: <span className="text-slate-200 font-mono">{stop.departure}</span></span>
                                                    )}
                                                    {stop.halt && stop.halt !== '--' && (
                                                        <span className="text-xs text-slate-500">Halt: {stop.halt}</span>
                                                    )}
                                                    {stop.distance > 0 && (
                                                        <span className="text-xs text-slate-500 ml-auto">{stop.distance} km</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Live Status Modal ──────────────────────────────────────────────────────────
const LiveStatusModal = ({ trainNumber, trainName, onClose }) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/v1/trains/live/${trainNumber}`);
                setStatus(res.data.data);
            } catch { setStatus(null); }
            setLoading(false);
        };
        fetch();
    }, [trainNumber]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-700/60">
                    <div className="flex items-center gap-2">
                        <Navigation className="text-indigo-400" size={20} />
                        <h2 className="text-lg font-bold text-white">Live Train Status</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-indigo-400" size={32} />
                        </div>
                    ) : !status ? (
                        <p className="text-center text-slate-400 py-8">Status unavailable</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-xl">
                                <span className="text-3xl">🚂</span>
                                <div>
                                    <p className="font-semibold text-white">{status.trainName || trainName}</p>
                                    <p className="text-sm text-slate-400">Train #{trainNumber}</p>
                                </div>
                                <StatusBadge status={status.status || 'Running'} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-800/40 rounded-xl">
                                    <p className="text-xs text-slate-400 mb-1">Current Station</p>
                                    <p className="text-sm font-medium text-white">{status.currentStation || 'En Route'}</p>
                                </div>
                                <div className="p-3 bg-slate-800/40 rounded-xl">
                                    <p className="text-xs text-slate-400 mb-1">Next Station</p>
                                    <p className="text-sm font-medium text-white">{status.nextStation || 'N/A'}</p>
                                </div>
                            </div>

                            {status.delay && (
                                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <AlertTriangle className="text-amber-400 flex-shrink-0" size={16} />
                                    <p className="text-sm text-amber-300">{status.delay}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <Info className="text-blue-400 flex-shrink-0" size={14} />
                                <p className="text-xs text-blue-300">
                                    Live data powered by IRCTC API. Last updated: {status.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : 'Just now'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Booking Modal (Multi-step) ────────────────────────────────────────────────
const BookingModal = ({ train, selectedClass, onClose, onSuccess }) => {
    const { user, isSignedIn } = useUser();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        passengerName: user?.fullName || '',
        passengerAge: '',
        passengerGender: 'Male',
        passengersCount: 1,
        seatClass: selectedClass || 'General',
        journeyDate: new Date().toISOString().split('T')[0]
    });

    const classInfo = SEAT_CLASSES[form.seatClass];
    const farePerPerson = train.classes?.find(c => c.class === form.seatClass)?.fare
        || classInfo?.fare * 10 || 300;
    const totalFare = farePerPerson * (form.passengersCount || 1);

    const handleBook = async () => {
        if (!isSignedIn) { toast.error('Please sign in to book tickets'); return; }
        setLoading(true);
        try {
            const payload = {
                passengerName: form.passengerName,
                passengerAge: parseInt(form.passengerAge),
                passengerGender: form.passengerGender,
                trainNumber: train.trainNumber,
                trainName: train.trainName,
                fromStation: train.fromName || train.from,
                fromStationCode: train.from,
                toStation: train.toName || train.to,
                toStationCode: train.to,
                journeyDate: new Date(form.journeyDate).toISOString(),
                departureTime: train.departureTime,
                arrivalTime: train.arrivalTime,
                seatClass: form.seatClass,
                passengersCount: parseInt(form.passengersCount),
                fareAmount: totalFare
            };
            const token = await window.__clerkSession?.getToken?.();
            const res = await axios.post(`${BACKEND_URL}/api/v1/trains/book`, payload, {
                headers: { Authorization: `Bearer ${token || ''}` },
                withCredentials: true
            });
            setResult(res.data.data);
            setStep(4);
            onSuccess?.();
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Booking failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-700/60">
                    <div className="flex items-center gap-2">
                        <Ticket className="text-indigo-400" size={20} />
                        <h2 className="text-lg font-bold text-white">Book Ticket</h2>
                    </div>
                    {step < 4 && (
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Step indicators */}
                {step < 4 && (
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800">
                        {[1,2,3].map(s => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium
                                    ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{s}</div>
                                {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-indigo-600' : 'bg-slate-700'}`} />}
                            </React.Fragment>
                        ))}
                        <span className="text-xs text-slate-400 ml-2">
                            {step === 1 ? 'Passenger' : step === 2 ? 'Class & Date' : 'Review'}
                        </span>
                    </div>
                )}

                <div className="p-5">
                    {/* Step 1: Passenger Details */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                    <input value={form.passengerName} onChange={e => setForm({...form, passengerName: e.target.value})}
                                        className="w-full pl-9 pr-3 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Passenger full name" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Age *</label>
                                    <input type="number" min="1" max="120" value={form.passengerAge}
                                        onChange={e => setForm({...form, passengerAge: e.target.value})}
                                        className="w-full px-3 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Age" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Gender *</label>
                                    <select value={form.passengerGender} onChange={e => setForm({...form, passengerGender: e.target.value})}
                                        className="w-full px-3 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <Button onClick={() => {
                                if (!form.passengerName || !form.passengerAge) { toast.error('Please fill all fields'); return; }
                                setStep(2);
                            }} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                                Continue <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Class & Date */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-2 block">Seat Class</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(SEAT_CLASSES).map(([key, cls]) => {
                                        const avail = train.classes?.find(c => c.class === key);
                                        if (!avail && train.classes?.length) return null;
                                        return (
                                            <button key={key} onClick={() => setForm({...form, seatClass: key})}
                                                className={`p-3 rounded-xl border text-left transition-all ${form.seatClass === key
                                                    ? `${cls.bg} ${cls.border} border-2` : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{cls.emoji}</span>
                                                    <span className={`text-xs font-medium ${form.seatClass === key ? cls.color : 'text-slate-300'}`}>{cls.label}</span>
                                                </div>
                                                <p className="text-sm font-bold text-white">₹{avail?.fare || cls.fare * 10}</p>
                                                {avail?.availability && <p className="text-xs text-slate-400 mt-0.5">{avail.availability}</p>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Journey Date</label>
                                    <input type="date" value={form.journeyDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={e => setForm({...form, journeyDate: e.target.value})}
                                        className="w-full px-3 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Passengers</label>
                                    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
                                        <button onClick={() => setForm({...form, passengersCount: Math.max(1, form.passengersCount - 1)})}
                                            className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 text-lg">−</button>
                                        <span className="flex-1 text-center text-white font-medium">{form.passengersCount}</span>
                                        <button onClick={() => setForm({...form, passengersCount: Math.min(6, form.passengersCount + 1)})}
                                            className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 text-lg">+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
                                    <ArrowLeft size={16} className="mr-2" /> Back
                                </Button>
                                <Button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                                    Review <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Confirm */}
                    {step === 3 && (
                        <div className="space-y-4">
                            {/* Summary card */}
                            <div className="bg-slate-800/40 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-700/60">
                                    <span className="text-2xl">🚂</span>
                                    <div>
                                        <p className="font-semibold text-white">{train.trainName}</p>
                                        <p className="text-xs text-slate-400">#{train.trainNumber} • {train.from} → {train.to}</p>
                                    </div>
                                </div>
                                {[
                                    ['Passenger', form.passengerName],
                                    ['Age / Gender', `${form.passengerAge} / ${form.passengerGender}`],
                                    ['Journey Date', new Date(form.journeyDate).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})],
                                    ['Seat Class', SEAT_CLASSES[form.seatClass]?.label],
                                    ['Departure', train.departureTime],
                                    ['Arrival', train.arrivalTime],
                                    ['Passengers', form.passengersCount],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm">
                                        <span className="text-slate-400">{k}</span>
                                        <span className="text-white font-medium">{v}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-700/60">
                                    <span className="text-slate-200">Total Fare</span>
                                    <span className="text-emerald-400">₹{totalFare}</span>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={15} />
                                <p className="text-xs text-amber-300 leading-relaxed">
                                    <strong>Demo Only:</strong> This is a simulated booking on AdventureNexus. No actual IRCTC ticket will be issued. For real train tickets, visit <a href="https://irctc.co.in" target="_blank" rel="noreferrer" className="underline">irctc.co.in</a>.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
                                    <ArrowLeft size={16} className="mr-2" /> Back
                                </Button>
                                <Button onClick={handleBook} disabled={loading} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                                    {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Booking...</> : <><CheckCircle size={16} className="mr-2" /> Confirm & Pay ₹{totalFare}</>}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && result && (
                        <div className="text-center space-y-4 py-2">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
                                <CheckCircle className="text-emerald-400" size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Booking Confirmed! 🎉</h3>
                                <p className="text-slate-400 text-sm">Your demo ticket has been generated</p>
                            </div>

                            {/* PNR */}
                            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                                <p className="text-xs text-slate-400 mb-1">PNR Number</p>
                                <p className="text-2xl font-mono font-bold text-indigo-300 tracking-wider">{result.pnrNumber}</p>
                                <p className="text-xs text-slate-500 mt-1">Save this for your records</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-800/40 rounded-xl p-3">
                                    <p className="text-xs text-slate-400">Train</p>
                                    <p className="text-white font-medium mt-0.5 truncate">{result.trainName}</p>
                                </div>
                                <div className="bg-slate-800/40 rounded-xl p-3">
                                    <p className="text-xs text-slate-400">Fare Paid</p>
                                    <p className="text-emerald-400 font-bold mt-0.5">₹{result.fareAmount}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <Shield className="text-amber-400 flex-shrink-0 mt-0.5" size={14} />
                                <p className="text-xs text-amber-300">{result.disclaimer}</p>
                            </div>

                            <Button onClick={onClose} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Train Result Card ─────────────────────────────────────────────────────────
const TrainCard = ({ train, onBook, onTimetable, onLiveStatus }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="train-card bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Train Identity */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🚂</span>
                            <div>
                                <span className="font-bold text-white text-base">{train.trainName}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-mono text-indigo-400">#{train.trainNumber}</span>
                                    {train.type && <Badge className="text-xs bg-slate-700/60 text-slate-300 border-slate-600">{train.type}</Badge>}
                                </div>
                            </div>
                        </div>

                        {/* Route timeline */}
                        <div className="flex items-center gap-3">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white font-mono">{train.departureTime}</p>
                                <p className="text-xs text-indigo-400 font-mono mt-0.5">{train.from}</p>
                                <p className="text-xs text-slate-500">{train.fromName}</p>
                            </div>

                            <div className="flex-1 flex flex-col items-center gap-1">
                                <div className="flex items-center w-full gap-1">
                                    <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/60 to-transparent" />
                                    <Train className="text-indigo-400 flex-shrink-0" size={16} />
                                    <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/60 to-transparent" />
                                </div>
                                <span className="text-xs text-slate-400">{train.duration}</span>
                                {train.distance && <span className="text-xs text-slate-500">{train.distance}</span>}
                            </div>

                            <div className="text-center">
                                <p className="text-2xl font-bold text-white font-mono">{train.arrivalTime}</p>
                                <p className="text-xs text-emerald-400 font-mono mt-0.5">{train.to}</p>
                                <p className="text-xs text-slate-500">{train.toName}</p>
                            </div>
                        </div>

                        {/* Running days */}
                        {train.runningDays && (
                            <div className="flex gap-1 mt-3">
                                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                                    <span key={d} className={`text-xs px-1.5 py-0.5 rounded-md ${train.runningDays.includes(d) ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-600'}`}>{d[0]}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Classes & Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                        {/* Available classes */}
                        <div className="space-y-1.5">
                            {(train.classes || [{ class: 'General', fare: 300, availability: 'Available' }]).slice(0,2).map((cls, i) => {
                                const clsConfig = SEAT_CLASSES[cls.class] || SEAT_CLASSES.General;
                                return (
                                    <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${clsConfig.bg} ${clsConfig.border}`}>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm">{clsConfig.emoji}</span>
                                            <span className={`text-xs font-medium ${clsConfig.color}`}>{cls.class.replace('_', ' ')}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">₹{cls.fare}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action buttons */}
                        <Button onClick={() => onBook(train, train.classes?.[0]?.class || 'General')}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm h-9">
                            <Ticket size={14} className="mr-1.5" /> Book Ticket
                        </Button>
                        <div className="grid grid-cols-2 gap-1.5">
                            <Button variant="outline" size="sm" onClick={() => onTimetable(train)}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8 text-xs">
                                <List size={12} className="mr-1" /> Route
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onLiveStatus(train)}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800 h-8 text-xs">
                                <Navigation size={12} className="mr-1" /> Live
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Expandable more classes */}
                {train.classes && train.classes.length > 2 && (
                    <button onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-3 transition-colors">
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {expanded ? 'Show less' : `+${train.classes.length - 2} more classes`}
                    </button>
                )}
                {expanded && train.classes && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-700/60">
                        {train.classes.slice(2).map((cls, i) => {
                            const clsConfig = SEAT_CLASSES[cls.class] || SEAT_CLASSES.General;
                            return (
                                <div key={i} className={`flex flex-col px-3 py-2 rounded-xl border ${clsConfig.bg} ${clsConfig.border}`}>
                                    <span className={`text-xs font-medium ${clsConfig.color}`}>{cls.class.replace('_', ' ')}</span>
                                    <span className="text-base font-bold text-white">₹{cls.fare}</span>
                                    {cls.availability && <span className="text-xs text-slate-400">{cls.availability}</span>}
                                    <button onClick={() => onBook(train, cls.class)} className="mt-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline text-left">
                                        Book this
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── My Bookings Tab ───────────────────────────────────────────────────────────
const MyBookingsTab = () => {
    const { isSignedIn } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);

    const fetchBookings = async () => {
        if (!isSignedIn) { setLoading(false); return; }
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/trains/bookings/mine`, { withCredentials: true });
            setBookings(res.data.data || []);
        } catch { setBookings([]); }
        setLoading(false);
    };

    useEffect(() => { fetchBookings(); }, [isSignedIn]);

    const handleCancel = async (id) => {
        setCancelling(id);
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/trains/bookings/${id}/cancel`, { withCredentials: true });
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Cancellation failed');
        }
        setCancelling(null);
    };

    if (!isSignedIn) {
        return (
            <div className="text-center py-16">
                <Train className="mx-auto text-slate-600 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">Sign in to view bookings</h3>
                <p className="text-slate-400 text-sm">Your train bookings will appear here after signing in.</p>
            </div>
        );
    }

    if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>;

    if (bookings.length === 0) {
        return (
            <div className="text-center py-16">
                <Ticket className="mx-auto text-slate-700 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">No bookings yet</h3>
                <p className="text-slate-400 text-sm">Book a train ticket to see it here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map(b => (
                <div key={b._id} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎫</span>
                            <div>
                                <p className="font-bold text-white">{b.trainName}</p>
                                <p className="text-xs text-indigo-400 font-mono">PNR: {b.pnrNumber}</p>
                            </div>
                        </div>
                        <StatusBadge status={b.status} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                        {[
                            ['From', b.fromStation],
                            ['To', b.toStation],
                            ['Date', new Date(b.journeyDate).toLocaleDateString('en-IN')],
                            ['Class', SEAT_CLASSES[b.seatClass]?.label || b.seatClass],
                            ['Passenger', b.passengerName],
                            ['Age', `${b.passengerAge} / ${b.passengerGender}`],
                            ['Passengers', b.passengersCount],
                            ['Fare', `₹${b.fareAmount}`],
                        ].map(([k, v]) => (
                            <div key={k} className="bg-slate-700/30 rounded-xl p-2.5">
                                <p className="text-xs text-slate-400">{k}</p>
                                <p className="text-white font-medium mt-0.5 text-sm">{v}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">Booked on {new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
                        {b.status === 'Confirmed' && (
                            <Button variant="outline" size="sm"
                                onClick={() => handleCancel(b._id)}
                                disabled={cancelling === b._id}
                                className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs h-8">
                                {cancelling === b._id ? <Loader2 className="animate-spin mr-1" size={12} /> : null}
                                Cancel Booking
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const TrainsPage = () => {
    const navigate = useNavigate();
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const resultsRef = useRef(null);

    const [activeTab, setActiveTab] = useState('search'); // 'search' | 'bookings'

    // Search state
    const [fromStation, setFromStation] = useState('New Delhi');
    const [fromCode, setFromCode] = useState('NDLS');
    const [toStation, setToStation]   = useState('Howrah Junction');
    const [toCode, setToCode]         = useState('HWH');
    const [journeyDate, setJourneyDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    });
    const [passengers, setPassengers] = useState(1);

    // Results state
    const [trains, setTrains] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    // Modals
    const [timetableModal, setTimetableModal] = useState(null);
    const [liveModal, setLiveModal] = useState(null);
    const [bookingModal, setBookingModal] = useState(null);

    // GSAP animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(heroRef.current, { y: -40, opacity: 0, duration: 1, ease: 'power2.out' });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    // Animation removed to fix visibility bug

    const handleSearch = async () => {
        if (!fromCode || !toCode) { toast.error('Please select both stations'); return; }
        setSearching(true);
        setSearched(false);
        try {
            const dd = journeyDate.split('-');
            const dateForApi = `${dd[2]}-${dd[1]}-${dd[0]}`; // DD-MM-YYYY
            const res = await axios.get(`${BACKEND_URL}/api/v1/trains/search`, {
                params: { from: fromCode, to: toCode, date: dateForApi }
            });
            const payload = res.data.data;
            setTrains(Array.isArray(payload) ? payload : []);
            setIsDemo(res.data.isDemo || false);
            setSearched(true);
            if ((res.data.data || []).length === 0) toast('No trains found for this route', { icon: '🔍' });
        } catch (e) {
            toast.error('Search failed. Please try again.');
            setTrains([]);
        }
        setSearching(false);
    };

    const swapStations = () => {
        setFromStation(toStation); setFromCode(toCode);
        setToStation(fromStation); setToCode(fromCode);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white" ref={pageRef}>
            <NavBar />

            {/* ── Hero Search ── */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-3xl" />
                    {/* Animated track */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={heroRef}>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 text-sm text-indigo-300 mb-6">
                            🚂 Indian Railway Booking • Real-time Data
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                Find Your
                            </span>
                            {' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Train
                            </span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Search trains, view timetables, track live status, and book unreserved tickets seamlessly.
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex justify-center mb-8">
                        <div className="flex bg-slate-800/60 border border-slate-700/60 rounded-xl p-1 gap-1">
                            {[['search', '🔍 Search Trains'], ['bookings', '🎫 My Bookings']].map(([t, l]) => (
                                <button key={t} onClick={() => setActiveTab(t)}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-slate-400 hover:text-slate-200'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'search' && (
                        /* ── Search Form ── */
                        <div className="max-w-4xl mx-auto bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <StationInput
                                    id="from-station"
                                    label="From Station"
                                    value={fromStation}
                                    onChange={v => setFromStation(v)}
                                    onSelect={s => { setFromStation(s.name); setFromCode(s.code); }}
                                    placeholder="e.g. New Delhi, NDLS"
                                />
                                {/* Swap button */}
                                <div className="relative">
                                    <button onClick={swapStations}
                                        className="absolute left-1/2 md:left-auto md:right-full md:top-1/2 bottom-full md:bottom-auto -translate-x-1/2 md:translate-x-3 md:-translate-y-1/2 z-10 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center transition-all shadow-lg md:-right-4 md:left-auto mb-2 md:mb-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </button>
                                    <StationInput
                                        id="to-station"
                                        label="To Station"
                                        value={toStation}
                                        onChange={v => setToStation(v)}
                                        onSelect={s => { setToStation(s.name); setToCode(s.code); }}
                                        placeholder="e.g. Howrah, HWH"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Journey Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={15} />
                                        <input type="date" value={journeyDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={e => setJourneyDate(e.target.value)}
                                            className="w-full pl-9 pr-3 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Passengers</label>
                                    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5">
                                        <Users className="text-indigo-400 flex-shrink-0" size={15} />
                                        <button onClick={() => setPassengers(p => Math.max(1, p - 1))} className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 text-base">−</button>
                                        <span className="flex-1 text-center text-white font-medium text-sm">{passengers}</span>
                                        <button onClick={() => setPassengers(p => Math.min(6, p + 1))} className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 text-base">+</button>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleSearch} disabled={searching}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-base font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                                {searching
                                    ? <><Loader2 className="animate-spin mr-2" size={20} /> Searching trains...</>
                                    : <><Search className="mr-2" size={20} /> Search Available Trains</>}
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Results / My Bookings ── */}
            <section className="pb-20" ref={resultsRef}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* My Bookings Tab */}
                    {activeTab === 'bookings' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">My Train Bookings</h2>
                            <MyBookingsTab />
                        </div>
                    )}

                    {/* Search Results */}
                    {activeTab === 'search' && searched && (
                        <div className="max-w-4xl mx-auto">
                            {/* Results header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {fromStation} → {toStation}
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">
                                        {trains.length} train{trains.length !== 1 ? 's' : ''} found •{' '}
                                        {new Date(journeyDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                {isDemo && (
                                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
                                        <Info className="text-amber-400 flex-shrink-0" size={14} />
                                        <span className="text-xs text-amber-300">Demo data (add RapidAPI key for live data)</span>
                                    </div>
                                )}
                            </div>

                            {/* Train cards */}
                            <div className="space-y-4">
                                {trains.map((train, i) => (
                                    <TrainCard
                                        key={i}
                                        train={train}
                                        onBook={(t, cls) => setBookingModal({ train: t, selectedClass: cls })}
                                        onTimetable={t => setTimetableModal(t)}
                                        onLiveStatus={t => setLiveModal(t)}
                                    />
                                ))}
                            </div>

                            {/* Info disclaimer */}
                            <div className="mt-8 flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/40 rounded-2xl">
                                <Shield className="text-indigo-400 flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="text-sm font-medium text-white mb-1">About Train Booking on AdventureNexus</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Train ticket booking here is for demo purposes only. No actual IRCTC tickets are issued.
                                        For official train bookings, please visit <a href="https://irctc.co.in" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">irctc.co.in</a>{' '}
                                        or download the <strong className="text-slate-300">RailOne / IRCTC Rail Connect</strong> app.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick info cards when no search yet */}
                    {activeTab === 'search' && !searched && (
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {[
                                    { icon: '🔍', title: 'Search Trains', desc: 'Find trains between any two stations in India with real-time availability' },
                                    { icon: '🗺️', title: 'View Timetable', desc: 'See the complete route schedule with all intermediate stations and timings' },
                                    { icon: '📍', title: 'Live Tracking', desc: 'Track your train\'s live running status and expected delays in real-time' },
                                ].map((c, i) => (
                                    <div key={i} className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-5 text-center">
                                        <span className="text-4xl mb-3 block">{c.icon}</span>
                                        <h3 className="font-semibold text-white mb-2">{c.title}</h3>
                                        <p className="text-sm text-slate-400">{c.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Popular routes */}
                            <div className="mt-8">
                                <h3 className="text-base font-semibold text-slate-300 mb-3">Popular Routes</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { from: 'NDLS', fromName: 'New Delhi', to: 'HWH', toName: 'Howrah' },
                                        { from: 'NDLS', fromName: 'New Delhi', to: 'BCT', toName: 'Mumbai' },
                                        { from: 'BCT', fromName: 'Mumbai', to: 'MAS', toName: 'Chennai' },
                                        { from: 'NDLS', fromName: 'New Delhi', to: 'SBC', toName: 'Bengaluru' },
                                    ].map((r, i) => (
                                        <button key={i} onClick={() => {
                                            setFromStation(r.fromName); setFromCode(r.from);
                                            setToStation(r.toName); setToCode(r.to);
                                        }} className="flex items-center gap-2 p-3 bg-slate-800/30 border border-slate-700/40 rounded-xl hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all text-left group">
                                            <div>
                                                <p className="text-xs font-medium text-white group-hover:text-indigo-300 transition-colors">{r.fromName}</p>
                                                <p className="text-xs text-slate-500">→ {r.toName}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Modals ── */}
            {timetableModal && <TimetableModal train={timetableModal} onClose={() => setTimetableModal(null)} />}
            {liveModal && <LiveStatusModal trainNumber={liveModal.trainNumber} trainName={liveModal.trainName} onClose={() => setLiveModal(null)} />}
            {bookingModal && (
                <BookingModal
                    train={bookingModal.train}
                    selectedClass={bookingModal.selectedClass}
                    onClose={() => setBookingModal(null)}
                    onSuccess={() => { setBookingModal(null); setActiveTab('bookings'); }}
                />
            )}

            <Footer />
        </div>
    );
};

export default TrainsPage;
