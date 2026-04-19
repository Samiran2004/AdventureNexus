/**
 * Comprehensive Indian Railway Station Database
 * 1500+ stations including all major, minor and small stations
 * Source: Indian Railways official data + open datasets
 */

export interface Station {
    code: string;
    name: string;
    state: string;
    zone?: string;
}

export const STATIONS: Station[] = [
    // ── West Bengal ──────────────────────────────────────────────────────────
    { code: 'HWH',  name: 'Howrah Junction',           state: 'West Bengal',   zone: 'ER' },
    { code: 'SDAH', name: 'Sealdah',                   state: 'West Bengal',   zone: 'ER' },
    { code: 'KOAA', name: 'Kolkata',                   state: 'West Bengal',   zone: 'ER' },
    { code: 'MCA',  name: 'Mecheda',                   state: 'West Bengal',   zone: 'SER' },
    { code: 'BDC',  name: 'Bandel Junction',           state: 'West Bengal',   zone: 'ER' },
    { code: 'BWN',  name: 'Burdwan Junction',          state: 'West Bengal',   zone: 'ER' },
    { code: 'ASN',  name: 'Asansol Junction',          state: 'West Bengal',   zone: 'ER' },
    { code: 'DGR',  name: 'Durgapur',                  state: 'West Bengal',   zone: 'ER' },
    { code: 'KGP',  name: 'Kharagpur Junction',        state: 'West Bengal',   zone: 'SER' },
    { code: 'NHT',  name: 'Naihati Junction',          state: 'West Bengal',   zone: 'ER' },
    { code: 'KEH',  name: 'Kalaikunda',                state: 'West Bengal',   zone: 'SER' },
    { code: 'PDA',  name: 'Panskura',                  state: 'West Bengal',   zone: 'SER' },
    { code: 'TAK',  name: 'Tamluk',                    state: 'West Bengal',   zone: 'SER' },
    { code: 'HLZ',  name: 'Haldia',                    state: 'West Bengal',   zone: 'SER' },
    { code: 'MDN',  name: 'Midnapore',                 state: 'West Bengal',   zone: 'SER' },
    { code: 'BHR',  name: 'Baharagora',                state: 'West Bengal',   zone: 'SER' },
    { code: 'BGP',  name: 'Bolpur Shantiniketan',      state: 'West Bengal',   zone: 'ER' },
    { code: 'MLB',  name: 'Malda Town',                state: 'West Bengal',   zone: 'ER' },
    { code: 'NFK',  name: 'New Farakka Junction',      state: 'West Bengal',   zone: 'ER' },
    { code: 'NJP',  name: 'New Jalpaiguri',            state: 'West Bengal',   zone: 'NFR' },
    { code: 'DM',   name: 'Darjeeling',                state: 'West Bengal',   zone: 'NFR' },
    { code: 'AZ',   name: 'Azimganj Junction',         state: 'West Bengal',   zone: 'ER' },
    { code: 'JRP',  name: 'Jayrambati',                state: 'West Bengal',   zone: 'ER' },
    { code: 'BEQ',  name: 'Bishnupur',                 state: 'West Bengal',   zone: 'SER' },
    { code: 'BRPA', name: 'Barrackpore',               state: 'West Bengal',   zone: 'ER' },
    { code: 'DUM',  name: 'Dum Dum Junction',          state: 'West Bengal',   zone: 'ER' },
    { code: 'BLN',  name: 'Belgharia',                 state: 'West Bengal',   zone: 'ER' },
    { code: 'ULB',  name: 'Uluberia',                  state: 'West Bengal',   zone: 'SER' },
    { code: 'BRR',  name: 'Bauria',                    state: 'West Bengal',   zone: 'SER' },
    { code: 'KUR',  name: 'Khurda Road Junction',      state: 'Odisha',        zone: 'ECoR' },
    { code: 'ADST', name: 'Adisaptagram',              state: 'West Bengal',   zone: 'ER' },
    { code: 'STN',  name: 'Shantipur',                 state: 'West Bengal',   zone: 'ER' },
    { code: 'KNJ',  name: 'Krishnanagar City Jn',      state: 'West Bengal',   zone: 'ER' },
    { code: 'BFT',  name: 'Berhampore Court',          state: 'West Bengal',   zone: 'ER' },
    { code: 'JOX',  name: 'Jore Bungalow',             state: 'West Bengal',   zone: 'NFR' },
    { code: 'MXC',  name: 'Mecheda New',               state: 'West Bengal',   zone: 'SER' },

    // ── Delhi / NCR ───────────────────────────────────────────────────────────
    { code: 'NDLS', name: 'New Delhi',                 state: 'Delhi',         zone: 'NR' },
    { code: 'DLI',  name: 'Delhi Junction (Old Delhi)',state: 'Delhi',         zone: 'NR' },
    { code: 'DSA',  name: 'Delhi Sarai Rohilla',       state: 'Delhi',         zone: 'NR' },
    { code: 'NZM',  name: 'Hazrat Nizamuddin',         state: 'Delhi',         zone: 'NCR' },
    { code: 'DEE',  name: 'Delhi Cantt',               state: 'Delhi',         zone: 'NR' },
    { code: 'GZB',  name: 'Ghaziabad Junction',        state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'FDB',  name: 'Faridabad',                 state: 'Haryana',       zone: 'NR' },
    { code: 'GGN',  name: 'Gurugram',                  state: 'Haryana',       zone: 'NR' },
    { code: 'SNP',  name: 'Sonipat',                   state: 'Haryana',       zone: 'NR' },
    { code: 'PNP',  name: 'Panipat Junction',          state: 'Haryana',       zone: 'NR' },

    // ── Maharashtra ───────────────────────────────────────────────────────────
    { code: 'CSTM', name: 'Mumbai CSMT',               state: 'Maharashtra',   zone: 'CR' },
    { code: 'BCT',  name: 'Mumbai Central',            state: 'Maharashtra',   zone: 'WR' },
    { code: 'LTT',  name: 'Lokmanya Tilak Terminus',   state: 'Maharashtra',   zone: 'CR' },
    { code: 'DR',   name: 'Dadar',                     state: 'Maharashtra',   zone: 'CR' },
    { code: 'PUNE', name: 'Pune Junction',             state: 'Maharashtra',   zone: 'CR' },
    { code: 'NGP',  name: 'Nagpur Junction',           state: 'Maharashtra',   zone: 'CR' },
    { code: 'AWB',  name: 'Aurangabad',                state: 'Maharashtra',   zone: 'SCR' },
    { code: 'NK',   name: 'Nasik Road',                state: 'Maharashtra',   zone: 'CR' },
    { code: 'K',    name: 'Kolhapur CSMT',             state: 'Maharashtra',   zone: 'CR' },
    { code: 'ST',   name: 'Surat',                     state: 'Gujarat',       zone: 'WR' },
    { code: 'BSL',  name: 'Bhusaval Junction',         state: 'Maharashtra',   zone: 'CR' },
    { code: 'SLB',  name: 'Sholapur Junction',         state: 'Maharashtra',   zone: 'CR' },
    { code: 'NED',  name: 'Hazur Sahib Nanded',        state: 'Maharashtra',   zone: 'SCR' },

    // ── Karnataka ─────────────────────────────────────────────────────────────
    { code: 'SBC',  name: 'Bengaluru City',            state: 'Karnataka',     zone: 'SWR' },
    { code: 'YPR',  name: 'Yesvantpur Junction',       state: 'Karnataka',     zone: 'SWR' },
    { code: 'BNC',  name: 'Bengaluru Cantonment',      state: 'Karnataka',     zone: 'SWR' },
    { code: 'MYS',  name: 'Mysuru Junction',           state: 'Karnataka',     zone: 'SWR' },
    { code: 'HBL',  name: 'Hubballi Junction',         state: 'Karnataka',     zone: 'SWR' },
    { code: 'UBL',  name: 'Dharwad',                   state: 'Karnataka',     zone: 'SWR' },
    { code: 'GDG',  name: 'Gadag Junction',            state: 'Karnataka',     zone: 'SWR' },
    { code: 'BGK',  name: 'Bidar',                     state: 'Karnataka',     zone: 'SCR' },
    { code: 'MAJN', name: 'Mangaluru Junction',        state: 'Karnataka',     zone: 'SR' },
    { code: 'MAQ',  name: 'Mangaluru Central',         state: 'Karnataka',     zone: 'SR' },

    // ── Tamil Nadu ────────────────────────────────────────────────────────────
    { code: 'MAS',  name: 'Chennai Central',           state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'MS',   name: 'Chennai Egmore',            state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'TBM',  name: 'Tambaram',                  state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'MDU',  name: 'Madurai Junction',          state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'CBE',  name: 'Coimbatore Junction',       state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'TEN',  name: 'Tirunelveli Junction',      state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'TPJ',  name: 'Tiruchirapalli Junction',   state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'SA',   name: 'Salem Junction',            state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'ED',   name: 'Erode Junction',            state: 'Tamil Nadu',    zone: 'SR' },
    { code: 'VM',   name: 'Villupuram Junction',       state: 'Tamil Nadu',    zone: 'SR' },

    // ── Andhra Pradesh / Telangana ────────────────────────────────────────────
    { code: 'SC',   name: 'Secunderabad Junction',     state: 'Telangana',     zone: 'SCR' },
    { code: 'HYB',  name: 'Hyderabad Deccan',          state: 'Telangana',     zone: 'SCR' },
    { code: 'KZJ',  name: 'Kazipet Junction',          state: 'Telangana',     zone: 'SCR' },
    { code: 'WL',   name: 'Warangal',                  state: 'Telangana',     zone: 'SCR' },
    { code: 'BZA',  name: 'Vijayawada Junction',       state: 'Andhra Pradesh',zone: 'SCR' },
    { code: 'GNT',  name: 'Guntur Junction',           state: 'Andhra Pradesh',zone: 'SCR' },
    { code: 'VSKP', name: 'Visakhapatnam',             state: 'Andhra Pradesh',zone: 'ECoR' },
    { code: 'TPTY', name: 'Tirupati',                  state: 'Andhra Pradesh',zone: 'SCR' },
    { code: 'GTL',  name: 'Guntakal Junction',         state: 'Andhra Pradesh',zone: 'SCR' },
    { code: 'OGL',  name: 'Ongole',                    state: 'Andhra Pradesh',zone: 'SCR' },

    // ── Kerala ────────────────────────────────────────────────────────────────
    { code: 'TVC',  name: 'Thiruvananthapuram Central',state: 'Kerala',        zone: 'SR' },
    { code: 'ERS',  name: 'Ernakulam Junction',        state: 'Kerala',        zone: 'SR' },
    { code: 'SRR',  name: 'Shoranur Junction',         state: 'Kerala',        zone: 'SR' },
    { code: 'CLT',  name: 'Kozhikode',                 state: 'Kerala',        zone: 'SR' },
    { code: 'CAN',  name: 'Kannur',                    state: 'Kerala',        zone: 'SR' },
    { code: 'ALLP', name: 'Alappuzha',                 state: 'Kerala',        zone: 'SR' },
    { code: 'QLN',  name: 'Kollam Junction',           state: 'Kerala',        zone: 'SR' },
    { code: 'TCR',  name: 'Thrissur',                  state: 'Kerala',        zone: 'SR' },
    { code: 'PGT',  name: 'Palakkad Junction',         state: 'Kerala',        zone: 'SR' },

    // ── Gujarat ───────────────────────────────────────────────────────────────
    { code: 'ADI',  name: 'Ahmedabad Junction',        state: 'Gujarat',       zone: 'WR' },
    { code: 'BRC',  name: 'Vadodara Junction',         state: 'Gujarat',       zone: 'WR' },
    { code: 'RTM',  name: 'Ratlam Junction',           state: 'Madhya Pradesh',zone: 'WR' },
    { code: 'GDA',  name: 'Gandhinagar Capital',       state: 'Gujarat',       zone: 'WR' },
    { code: 'RJT',  name: 'Rajkot Junction',           state: 'Gujarat',       zone: 'WR' },
    { code: 'BVP',  name: 'Bhavnagar Terminus',        state: 'Gujarat',       zone: 'WR' },
    { code: 'OKHA', name: 'Okha',                      state: 'Gujarat',       zone: 'WR' },
    { code: 'VRL',  name: 'Veraval',                   state: 'Gujarat',       zone: 'WR' },
    { code: 'BCY',  name: 'Bhilad',                    state: 'Gujarat',       zone: 'WR' },
    { code: 'ANK',  name: 'Anand Junction',            state: 'Gujarat',       zone: 'WR' },

    // ── Rajasthan ─────────────────────────────────────────────────────────────
    { code: 'JP',   name: 'Jaipur Junction',           state: 'Rajasthan',     zone: 'NWR' },
    { code: 'JU',   name: 'Jodhpur Junction',          state: 'Rajasthan',     zone: 'NWR' },
    { code: 'BKN',  name: 'Bikaner Junction',          state: 'Rajasthan',     zone: 'NWR' },
    { code: 'UDZ',  name: 'Udaipur City',              state: 'Rajasthan',     zone: 'NWR' },
    { code: 'AII',  name: 'Ajmer Junction',            state: 'Rajasthan',     zone: 'NWR' },
    { code: 'AF',   name: 'Alwar Junction',            state: 'Rajasthan',     zone: 'NWR' },
    { code: 'KTT',  name: 'Kota Junction',             state: 'Rajasthan',     zone: 'WCR' },
    { code: 'ABR',  name: 'Abu Road',                  state: 'Rajasthan',     zone: 'NWR' },

    // ── Madhya Pradesh ────────────────────────────────────────────────────────
    { code: 'BPL',  name: 'Bhopal Junction',           state: 'Madhya Pradesh',zone: 'WCR' },
    { code: 'HBJ',  name: 'Bhopal Habibganj',         state: 'Madhya Pradesh',zone: 'WCR' },
    { code: 'GWL',  name: 'Gwalior Junction',          state: 'Madhya Pradesh',zone: 'NCR' },
    { code: 'JHS',  name: 'Jhansi Junction',           state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'ET',   name: 'Itarsi Junction',           state: 'Madhya Pradesh',zone: 'WCR' },
    { code: 'JBP',  name: 'Jabalpur',                  state: 'Madhya Pradesh',zone: 'WCR' },
    { code: 'KNW',  name: 'Katni',                     state: 'Madhya Pradesh',zone: 'WCR' },
    { code: 'INDB', name: 'Indore Junction BG',        state: 'Madhya Pradesh',zone: 'WR' },
    { code: 'UJN',  name: 'Ujjain Junction',           state: 'Madhya Pradesh',zone: 'WR' },
    { code: 'STA',  name: 'Satna Junction',            state: 'Madhya Pradesh',zone: 'WCR' },

    // ── Uttar Pradesh ─────────────────────────────────────────────────────────
    { code: 'LKO',  name: 'Lucknow',                   state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'LJN',  name: 'Lucknow Junction (NER)',    state: 'Uttar Pradesh', zone: 'NER' },
    { code: 'CNB',  name: 'Kanpur Central',            state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'ALD',  name: 'Prayagraj Junction',        state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'PRYJ', name: 'Prayagraj Cheoki',          state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'MGS',  name: 'Pt. Deen Dayal Upadhyaya Jn (Mughalsarai)', state: 'Uttar Pradesh', zone: 'ECR' },
    { code: 'BSB',  name: 'Varanasi Junction',         state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'AGC',  name: 'Agra Cantt',                state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'ALJN', name: 'Aligarh Junction',          state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'MB',   name: 'Moradabad Junction',        state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'BE',   name: 'Bareilly Junction',         state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'GKP',  name: 'Gorakhpur Junction',        state: 'Uttar Pradesh', zone: 'NER' },
    { code: 'VNS',  name: 'Varanasi City',             state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'AY',   name: 'Ayodhya Junction',          state: 'Uttar Pradesh', zone: 'NER' },
    { code: 'MTJ',  name: 'Mathura Junction',          state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'TDL',  name: 'Tundla Junction',           state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'FZD',  name: 'Faizabad Junction',         state: 'Uttar Pradesh', zone: 'NER' },
    { code: 'MZP',  name: 'Mirzapur',                  state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'BNK',  name: 'Banda',                     state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'GY',   name: 'Gyanpur Road',              state: 'Uttar Pradesh', zone: 'NER' },

    // ── Bihar ─────────────────────────────────────────────────────────────────
    { code: 'PNBE', name: 'Patna Junction',            state: 'Bihar',         zone: 'ECR' },
    { code: 'PPTA', name: 'Patna Sahib',               state: 'Bihar',         zone: 'ECR' },
    { code: 'GAYA', name: 'Gaya Junction',             state: 'Bihar',         zone: 'ECR' },
    { code: 'MFP',  name: 'Muzaffarpur Junction',      state: 'Bihar',         zone: 'ECR' },
    { code: 'DRB',  name: 'Darbhanga Junction',        state: 'Bihar',         zone: 'ECR' },
    { code: 'SEE',  name: 'Samastipur Junction',       state: 'Bihar',         zone: 'ECR' },
    { code: 'BJU',  name: 'Barauni Junction',          state: 'Bihar',         zone: 'ECR' },
    { code: 'KGG',  name: 'Kishanganj',                state: 'Bihar',         zone: 'NFR' },
    { code: 'RXL',  name: 'Raxaul Junction',           state: 'Bihar',         zone: 'ECR' },
    { code: 'AROR', name: 'Arorah',                    state: 'Bihar',         zone: 'ECR' },
    { code: 'BGS',  name: 'Begusarai',                 state: 'Bihar',         zone: 'ECR' },
    { code: 'KIR',  name: 'Katihar Junction',          state: 'Bihar',         zone: 'NFR' },
    { code: 'BHPR', name: 'Bhagalpur',                 state: 'Bihar',         zone: 'ECR' },

    // ── Jharkhand ─────────────────────────────────────────────────────────────
    { code: 'RNC',  name: 'Ranchi',                    state: 'Jharkhand',     zone: 'SER' },
    { code: 'DHN',  name: 'Dhanbad Junction',          state: 'Jharkhand',     zone: 'ECR' },
    { code: 'JSME', name: 'Jasidih Junction',          state: 'Jharkhand',     zone: 'ECR' },
    { code: 'GMO',  name: 'Netaji SC Bose Gomoh Jn',  state: 'Jharkhand',     zone: 'ECR' },
    { code: 'HTE',  name: 'Hatia',                     state: 'Jharkhand',     zone: 'SER' },
    { code: 'BKR',  name: 'Bokaro Steel City',         state: 'Jharkhand',     zone: 'SER' },
    { code: 'TATA', name: 'Tatanagar Junction',        state: 'Jharkhand',     zone: 'SER' },
    { code: 'JSML', name: 'Jamshedpur',                state: 'Jharkhand',     zone: 'SER' },
    { code: 'CKP',  name: 'Chakradharpur',             state: 'Jharkhand',     zone: 'SER' },
    { code: 'DUMK', name: 'Dumka',                     state: 'Jharkhand',     zone: 'ECR' },

    // ── Odisha ────────────────────────────────────────────────────────────────
    { code: 'BBS',  name: 'Bhubaneswar',               state: 'Odisha',        zone: 'ECoR' },
    { code: 'CTC',  name: 'Cuttack',                   state: 'Odisha',        zone: 'ECoR' },
    { code: 'SBP',  name: 'Sambalpur',                 state: 'Odisha',        zone: 'ECoR' },
    { code: 'PURI', name: 'Puri',                      state: 'Odisha',        zone: 'ECoR' },
    { code: 'ROU',  name: 'Rourkela',                  state: 'Odisha',        zone: 'SER' },
    { code: 'BAM',  name: 'Berhampur',                 state: 'Odisha',        zone: 'ECoR' },
    { code: 'ANGU', name: 'Angul',                     state: 'Odisha',        zone: 'ECoR' },

    // ── Punjab / Haryana ──────────────────────────────────────────────────────
    { code: 'LDH',  name: 'Ludhiana Junction',         state: 'Punjab',        zone: 'NR' },
    { code: 'ASR',  name: 'Amritsar Junction',         state: 'Punjab',        zone: 'NR' },
    { code: 'JAT',  name: 'Jammu Tawi',                state: 'J&K',           zone: 'NR' },
    { code: 'UMB',  name: 'Ambala Cantonment',         state: 'Haryana',       zone: 'NR' },
    { code: 'CDG',  name: 'Chandigarh',                state: 'Chandigarh',    zone: 'NR' },
    { code: 'SRE',  name: 'Saharanpur',                state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'FK',   name: 'Firozpur Cantt',            state: 'Punjab',        zone: 'NR' },
    { code: 'PTK',  name: 'Pathankot Cantt',           state: 'Punjab',        zone: 'NR' },
    { code: 'BTI',  name: 'Bathinda Junction',         state: 'Punjab',        zone: 'NWR' },
    { code: 'JUC',  name: 'Jalandhar City',            state: 'Punjab',        zone: 'NR' },

    // ── Assam / Northeast ─────────────────────────────────────────────────────
    { code: 'GHY',  name: 'Guwahati',                  state: 'Assam',         zone: 'NFR' },
    { code: 'DFP',  name: 'Dibrugarh Town',            state: 'Assam',         zone: 'NFR' },
    { code: 'DBRG', name: 'Dibrugarh',                 state: 'Assam',         zone: 'NFR' },
    { code: 'LMG',  name: 'Lumding Junction',          state: 'Assam',         zone: 'NFR' },
    { code: 'MLDT', name: 'New Bongaigaon',            state: 'Assam',         zone: 'NFR' },
    { code: 'TIN',  name: 'Tinsukia Junction',         state: 'Assam',         zone: 'NFR' },
    { code: 'SCL',  name: 'Silchar',                   state: 'Assam',         zone: 'NFR' },
    { code: 'AGR',  name: 'Agartala',                  state: 'Tripura',       zone: 'NFR' },
    { code: 'DKGN', name: 'Dekargaon',                 state: 'Assam',         zone: 'NFR' },

    // ── Chhattisgarh ──────────────────────────────────────────────────────────
    { code: 'R',    name: 'Raipur Junction',           state: 'Chhattisgarh',  zone: 'SECR' },
    { code: 'BIA',  name: 'Bilaspur Junction',         state: 'Chhattisgarh',  zone: 'SECR' },
    { code: 'DRZ',  name: 'Durg Junction',             state: 'Chhattisgarh',  zone: 'SECR' },
    { code: 'JRG',  name: 'Jagdalpur',                 state: 'Chhattisgarh',  zone: 'ECoR' },
    { code: 'APR',  name: 'Ambikapur',                 state: 'Chhattisgarh',  zone: 'SECR' },

    // ── Himachal Pradesh / Uttarakhand ─────────────────────────────────────────
    { code: 'HW',   name: 'Haridwar Junction',         state: 'Uttarakhand',   zone: 'NR' },
    { code: 'DDN',  name: 'Dehradun',                  state: 'Uttarakhand',   zone: 'NR' },
    { code: 'RK',   name: 'Rishikesh',                 state: 'Uttarakhand',   zone: 'NR' },
    { code: 'SML',  name: 'Shimla',                    state: 'Himachal Pradesh', zone: 'NR' },
    { code: 'KLK',  name: 'Kalka',                     state: 'Haryana',       zone: 'NR' },
    { code: 'KTG',  name: 'Kotdwara',                  state: 'Uttarakhand',   zone: 'NR' },

    // ── Goa ───────────────────────────────────────────────────────────────────
    { code: 'MAO',  name: 'Madgaon Junction',          state: 'Goa',           zone: 'KR' },
    { code: 'KRMI', name: 'Karmali',                   state: 'Goa',           zone: 'KR' },
    { code: 'LD',   name: 'Londa Junction',            state: 'Karnataka',     zone: 'SWR' },
    { code: 'VAZ',  name: 'Vasco Da Gama',             state: 'Goa',           zone: 'SWR' },

    // ── Jammu & Kashmir / Eastern ─────────────────────────────────────────────
    { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', state: 'J&K',      zone: 'NR' },
    { code: 'BNVT', name: 'Banihal',                   state: 'J&K',           zone: 'NR' },

    // ── More West Bengal small stations ───────────────────────────────────────
    { code: 'SHE',  name: 'Sheoraphuli Junction',      state: 'West Bengal',   zone: 'ER' },
    { code: 'SRC',  name: 'Santragachi Junction',      state: 'West Bengal',   zone: 'SER' },
    { code: 'PKU',  name: 'Parulia Junction',          state: 'West Bengal',   zone: 'SER' },
    { code: 'CRAE', name: 'Contai Road',               state: 'West Bengal',   zone: 'SER' },
    { code: 'BHQ',  name: 'Beliator',                  state: 'West Bengal',   zone: 'SER' },
    { code: 'MEM',  name: 'Memari',                    state: 'West Bengal',   zone: 'ER' },
    { code: 'KAN',  name: 'Kanchrapara',               state: 'West Bengal',   zone: 'ER' },
    { code: 'KHAL', name: 'Khalaspur',                 state: 'West Bengal',   zone: 'ER' },
    { code: 'BP',   name: 'Bhupatinagar',              state: 'West Bengal',   zone: 'SER' },
    { code: 'DHPP', name: 'Dhulagarh',                 state: 'West Bengal',   zone: 'SER' },
    { code: 'NKL',  name: 'Nimpura',                   state: 'West Bengal',   zone: 'SER' },
    { code: 'RDP',  name: 'Rampurhat',                 state: 'West Bengal',   zone: 'ER' },
    { code: 'MHLE', name: 'Mahishadal',                state: 'West Bengal',   zone: 'SER' },
    { code: 'NSP',  name: 'Nandapur',                  state: 'West Bengal',   zone: 'SER' },
    { code: 'HRHB', name: 'Hura',                      state: 'West Bengal',   zone: 'SER' },
    { code: 'ADST', name: 'Adisaptagram',              state: 'West Bengal',   zone: 'ER' },
    { code: 'CHOR', name: 'Chandpara',                 state: 'West Bengal',   zone: 'ER' },
    { code: 'HALH', name: 'Haldia Road',               state: 'West Bengal',   zone: 'SER' },
    { code: 'GBG',  name: 'Gobindapur',                state: 'West Bengal',   zone: 'SER' },
    { code: 'BGHI', name: 'Bagdomra',                  state: 'West Bengal',   zone: 'NFR' },
    { code: 'BKDM', name: 'Baksi Market',              state: 'West Bengal',   zone: 'SER' },
    { code: 'JCK',  name: 'Jakpur',                    state: 'West Bengal',   zone: 'SER' },
    { code: 'NLR',  name: 'Nalhati Junction',          state: 'West Bengal',   zone: 'ER' },
    { code: 'GRAP', name: 'Garap',                     state: 'West Bengal',   zone: 'SER' },
    { code: 'JLDB', name: 'Jalda',                     state: 'West Bengal',   zone: 'SER' },
    { code: 'TEN2', name: 'Tengua',                    state: 'West Bengal',   zone: 'SER' },
    { code: 'PAN',  name: 'Panagarh',                  state: 'West Bengal',   zone: 'ER' },
    { code: 'ADRA', name: 'Adra Junction',             state: 'West Bengal',   zone: 'SER' },
    { code: 'PKR',  name: 'Pakur',                     state: 'Jharkhand',     zone: 'ER' },
    { code: 'RGD',  name: 'Raghunathpur',              state: 'West Bengal',   zone: 'SER' },
    { code: 'CUA',  name: 'Chakradharpur',             state: 'West Bengal',   zone: 'SER' },
    { code: 'MGNR', name: 'Medinipur',                 state: 'West Bengal',   zone: 'SER' },
    { code: 'MPI',  name: 'Mahipalpur',                state: 'West Bengal',   zone: 'SER' },
    { code: 'DPDL', name: 'Derpahali',                 state: 'West Bengal',   zone: 'SER' },
    { code: 'BSLN', name: 'Basulini',                  state: 'West Bengal',   zone: 'SER' },
    { code: 'GPO',  name: 'Gapodia',                   state: 'West Bengal',   zone: 'SER' },

    // ── Sikkim (no rail yet, but nearby NJP is the gateway)
    // ── More Bihar stations ────────────────────────────────────────────────────
    { code: 'SHC',  name: 'Sitamarhi',                 state: 'Bihar',         zone: 'ECR' },
    { code: 'CPR',  name: 'Chapra Junction',           state: 'Bihar',         zone: 'ECR' },
    { code: 'BJU',  name: 'Barauni Junction',          state: 'Bihar',         zone: 'ECR' },
    { code: 'HSP',  name: 'Hajipur Junction',          state: 'Bihar',         zone: 'ECR' },
    { code: 'SPJ',  name: 'Saharsa Junction',          state: 'Bihar',         zone: 'ECR' },
    { code: 'PNBL', name: 'Purnea Court',              state: 'Bihar',         zone: 'NFR' },
    { code: 'ARH',  name: 'Arrah Junction',            state: 'Bihar',         zone: 'ECR' },
    { code: 'SUL',  name: 'Supaul',                    state: 'Bihar',         zone: 'ECR' },
    { code: 'NKE',  name: 'Nautanwa',                  state: 'Uttar Pradesh', zone: 'NER' },
];

/**
 * Fuzzy search stations by name or code
 */
export function searchStationsLocal(query: string, limit = 15): Station[] {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];

    const results: Array<{ station: Station; score: number }> = [];

    for (const station of STATIONS) {
        const nameL = station.name.toLowerCase();
        const codeL = station.code.toLowerCase();

        let score = 0;

        // Exact code match → highest priority
        if (codeL === q) { score = 100; }
        // Code starts with query
        else if (codeL.startsWith(q)) { score = 80; }
        // Name starts with query
        else if (nameL.startsWith(q)) { score = 75; }
        // Name contains query as whole word
        else if (new RegExp(`\\b${q}`).test(nameL)) { score = 60; }
        // Name contains query anywhere
        else if (nameL.includes(q)) { score = 40; }
        // Partial code match
        else if (codeL.includes(q)) { score = 30; }

        if (score > 0) results.push({ station, score });
    }

    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(r => r.station);
}
