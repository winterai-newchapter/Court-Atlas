/* Court Atlas data — 2026 season, compiled 5 Oct 2026 from Wikipedia season, Masters 1000, WTA 1000 and ranking pages.
   w: the Wikipedia page behind each tour's results. scripts/fetch-draws.mjs reads these and writes src/draws.js (draws, matches, TODAY). */

const T = [
 {id:'uc',name:'United Cup',city:'Perth & Sydney',co:'Australia',lat:-31.95,lon:115.86,s:'2026-01-02',e:'2026-01-11',lv:'Team',tour:'BOTH',sf:'hard',w:{Team:"2026 United Cup"},res:[{t:'Mixed',w:'Poland',r:'Switzerland',sc:'2–1'}]},
 {id:'bri',name:'Brisbane International',city:'Brisbane',co:'Australia',lat:-27.47,lon:153.03,s:'2026-01-04',e:'2026-01-11',lv:'250',tour:'ATP',sf:'hard',w:{ATP:"2026 Brisbane International – Men's singles"},res:[{t:'ATP',w:'Daniil Medvedev',r:'Brandon Nakashima',sc:'6–2, 7–6(1)'}]},
 {id:'hk',name:'Hong Kong Open',city:'Hong Kong',co:'China',lat:22.32,lon:114.17,s:'2026-01-04',e:'2026-01-11',lv:'250',tour:'ATP',sf:'hard',w:{ATP:"2026 ATP Hong Kong Tennis Open – Singles"},res:[{t:'ATP',w:'Alexander Bublik',r:'Lorenzo Musetti',sc:'7–6(2), 6–3'}]},
 {id:'ade',name:'Adelaide International',city:'Adelaide',co:'Australia',lat:-34.93,lon:138.6,s:'2026-01-11',e:'2026-01-17',lv:'250',tour:'ATP',sf:'hard',w:{ATP:"2026 Adelaide International – Men's singles"},res:[{t:'ATP',w:'Tomáš Macháč',r:'Ugo Humbert',sc:'6–4, 6–7(2), 6–2'}]},
 {id:'auk',name:'ASB Classic',city:'Auckland',co:'New Zealand',lat:-36.85,lon:174.76,s:'2026-01-11',e:'2026-01-17',lv:'250',tour:'ATP',sf:'hard',w:{ATP:"2026 ASB Classic – Men's singles"},res:[{t:'ATP',w:'Jakub Menšík',r:'Sebastián Báez',sc:'6–3, 7–6(7)'}]},
 {id:'ao',name:'Australian Open',city:'Melbourne',co:'Australia',lat:-37.82,lon:144.98,s:'2026-01-18',e:'2026-02-01',lv:'GS',tour:'BOTH',sf:'hard',w:{ATP:"2026 Australian Open – Men's singles",WTA:"2026 Australian Open – Women's singles"},res:[{t:'ATP',w:'Carlos Alcaraz',r:'Novak Djokovic',sc:'2–6, 6–2, 6–3, 7–5'},{t:'WTA',w:'Elena Rybakina',r:'Aryna Sabalenka',sc:'6–4, 4–6, 6–4'}],note:'Alcaraz completed the career Grand Slam at 22 years, 272 days, the youngest man to do it.'},
 {id:'mpl',name:'Open Occitanie',city:'Montpellier',co:'France',lat:43.61,lon:3.88,s:'2026-02-02',e:'2026-02-08',lv:'250',tour:'ATP',sf:'hard',indoor:true,w:{ATP:"2026 Open Occitanie – Singles"},res:[{t:'ATP',w:'Félix Auger-Aliassime',r:'Adrian Mannarino',sc:'6–3, 7–6(4)'}]},
 {id:'dal',name:'Dallas Open',city:'Dallas',co:'USA',lat:32.78,lon:-96.8,s:'2026-02-09',e:'2026-02-15',lv:'500',tour:'ATP',sf:'hard',indoor:true,w:{ATP:"2026 Dallas Open – Singles"},res:[{t:'ATP',w:'Ben Shelton',r:'Taylor Fritz',sc:'3–6, 6–3, 7–5'}]},
 {id:'rot',name:'Rotterdam Open',city:'Rotterdam',co:'Netherlands',lat:51.92,lon:4.48,s:'2026-02-09',e:'2026-02-15',lv:'500',tour:'ATP',sf:'hard',indoor:true,w:{ATP:"2026 ABN AMRO Open – Singles"},res:[{t:'ATP',w:'Alex de Minaur',r:'Félix Auger-Aliassime',sc:'6–3, 6–2'}]},
 {id:'bue',name:'Argentina Open',city:'Buenos Aires',co:'Argentina',lat:-34.6,lon:-58.38,s:'2026-02-09',e:'2026-02-15',lv:'250',tour:'ATP',sf:'clay',w:{ATP:"2026 Argentina Open – Singles"},res:[{t:'ATP',w:'Francisco Cerúndolo',r:'Luciano Darderi',sc:'6–4, 6–2'}]},
 {id:'dohw',name:'Qatar Open (WTA)',city:'Doha',co:'Qatar',lat:25.29,lon:51.53,s:'2026-02-08',e:'2026-02-14',lv:'1000',tour:'WTA',sf:'hard',w:{WTA:"2026 Qatar TotalEnergies Open – Singles"},res:[{t:'WTA',w:'Karolína Muchová',r:'Victoria Mboko',sc:'6–4, 7–5'}]},
 {id:'duxw',name:'Dubai Championships (WTA)',city:'Dubai',co:'UAE',lat:25.2,lon:55.27,s:'2026-02-15',e:'2026-02-21',lv:'1000',tour:'WTA',sf:'hard',w:{WTA:"2026 Dubai Tennis Championships – Women's singles"},res:[{t:'WTA',w:'Jessica Pegula',r:'Elina Svitolina',sc:'6–2, 6–4'}]},
 {id:'doha',name:'Qatar Open (ATP)',city:'Doha',co:'Qatar',lat:25.29,lon:51.53,s:'2026-02-16',e:'2026-02-21',lv:'500',tour:'ATP',sf:'hard',w:{ATP:"2026 Qatar ExxonMobil Open – Singles"},res:[{t:'ATP',w:'Carlos Alcaraz',r:'Arthur Fils',sc:'6–2, 6–1'}]},
 {id:'rio',name:'Rio Open',city:'Rio de Janeiro',co:'Brazil',lat:-22.91,lon:-43.17,s:'2026-02-16',e:'2026-02-22',lv:'500',tour:'ATP',sf:'clay',w:{ATP:"2026 Rio Open – Singles"},res:[{t:'ATP',w:'Tomás Martín Etcheverry',r:'Alejandro Tabilo',sc:'3–6, 7–6(3), 6–4'}]},
 {id:'del',name:'Delray Beach Open',city:'Delray Beach',co:'USA',lat:26.46,lon:-80.07,s:'2026-02-16',e:'2026-02-22',lv:'250',tour:'ATP',sf:'hard',w:{ATP:"2026 Delray Beach Open – Singles"},res:[{t:'ATP',w:'Sebastian Korda',r:'Tommy Paul',sc:'6–4, 6–3'}]},
 {id:'dub',name:'Dubai Championships (ATP)',city:'Dubai',co:'UAE',lat:25.2,lon:55.27,s:'2026-02-23',e:'2026-02-28',lv:'500',tour:'ATP',sf:'hard',w:{ATP:"2026 Dubai Tennis Championships – Men's singles"},res:[{t:'ATP',w:'Daniil Medvedev',r:'Tallon Griekspoor',sc:'Walkover'}]},
 {id:'aca',name:'Mexican Open',city:'Acapulco',co:'Mexico',lat:16.85,lon:-99.82,s:'2026-02-23',e:'2026-02-28',lv:'500',tour:'ATP',sf:'hard',w:{ATP:"2026 Abierto Mexicano Telcel – Singles"},res:[{t:'ATP',w:'Flavio Cobolli',r:'Frances Tiafoe',sc:'7–6(4), 6–4'}]},
 {id:'scl',name:'Chile Open',city:'Santiago',co:'Chile',lat:-33.45,lon:-70.67,s:'2026-02-23',e:'2026-03-01',lv:'250',tour:'ATP',sf:'clay',w:{ATP:"2026 Chile Open – Singles"},res:[{t:'ATP',w:'Luciano Darderi',r:'Yannick Hanfmann',sc:'7–6(6), 7–5'}]},
 {id:'iw',name:'Indian Wells Open',city:'Indian Wells',co:'USA',lat:33.72,lon:-116.31,s:'2026-03-04',e:'2026-03-15',lv:'1000',tour:'BOTH',sf:'hard',w:{ATP:"2026 BNP Paribas Open – Men's singles",WTA:"2026 BNP Paribas Open – Women's singles"},res:[{t:'ATP',w:'Jannik Sinner',r:'Daniil Medvedev',sc:'7–6(6), 7–6(4)'},{t:'WTA',w:'Aryna Sabalenka',r:'Elena Rybakina',sc:'3–6, 6–3, 7–6(6)'}]},
 {id:'mia',name:'Miami Open',city:'Miami',co:'USA',lat:25.76,lon:-80.19,s:'2026-03-17',e:'2026-03-29',lv:'1000',tour:'BOTH',sf:'hard',w:{ATP:"2026 Miami Open – Men's singles",WTA:"2026 Miami Open – Women's singles"},res:[{t:'ATP',w:'Jannik Sinner',r:'Jiří Lehečka',sc:'6–4, 6–4'},{t:'WTA',w:'Aryna Sabalenka',r:'Coco Gauff',sc:'6–2, 4–6, 6–3'}]},
 {id:'mc',name:'Monte-Carlo Masters',city:'Monte Carlo',co:'Monaco',lat:43.74,lon:7.42,s:'2026-04-05',e:'2026-04-12',lv:'1000',tour:'ATP',sf:'clay',w:{ATP:"2026 Monte-Carlo Masters – Singles"},res:[{t:'ATP',w:'Jannik Sinner',r:'Carlos Alcaraz',sc:'7–6(5), 6–3'}]},
 {id:'mad',name:'Madrid Open',city:'Madrid',co:'Spain',lat:40.42,lon:-3.7,s:'2026-04-21',e:'2026-05-03',lv:'1000',tour:'BOTH',sf:'clay',w:{ATP:"2026 Mutua Madrid Open – Men's singles",WTA:"2026 Mutua Madrid Open – Women's singles"},res:[{t:'ATP',w:'Jannik Sinner',r:'Alexander Zverev',sc:'6–1, 6–2'},{t:'WTA',w:'Marta Kostyuk',r:'Mirra Andreeva',sc:'6–3, 7–5'}],note:'With Rome to follow, Sinner became the first player to win the first five Masters 1000 events of a season.'},
 {id:'rom',name:'Italian Open',city:'Rome',co:'Italy',lat:41.93,lon:12.45,s:'2026-05-05',e:'2026-05-17',lv:'1000',tour:'BOTH',sf:'clay',w:{ATP:"2026 Italian Open – Men's singles",WTA:"2026 Italian Open – Women's singles"},res:[{t:'ATP',w:'Jannik Sinner',r:'Casper Ruud',sc:'6–4, 6–4'},{t:'WTA',w:'Elina Svitolina',r:'Coco Gauff',sc:'6–4, 6–7(3), 6–2'}]},
 {id:'rg',name:'Roland Garros',city:'Paris',co:'France',lat:48.85,lon:2.25,s:'2026-05-24',e:'2026-06-07',lv:'GS',tour:'BOTH',sf:'clay',w:{ATP:"2026 French Open – Men's singles",WTA:"2026 French Open – Women's singles"},res:[{t:'ATP',w:'Alexander Zverev',r:'Flavio Cobolli',sc:'6–1, 4–6, 6–4, 6–7(5), 6–1'},{t:'WTA',w:'Mirra Andreeva',r:'Maja Chwalińska',sc:'Score not recorded'}],note:"Zverev's first major, and the first French Open title for a German man since 1937."},
 {id:'wim',name:'Wimbledon',city:'London',co:'United Kingdom',lat:51.43,lon:-0.21,s:'2026-06-29',e:'2026-07-12',lv:'GS',tour:'BOTH',sf:'grass',w:{ATP:"2026 Wimbledon Championships – Men's singles",WTA:"2026 Wimbledon Championships – Women's singles"},res:[{t:'ATP',w:'Jannik Sinner',r:'Alexander Zverev',sc:'6–7(7), 7–6(2), 6–3, 6–4'},{t:'WTA',w:'Linda Nosková',r:'Karolína Muchová',sc:'Score not recorded'}],note:'Sinner defended his Wimbledon title for his fifth major.'},
 {id:'can',name:'Canadian Open (ATP)',city:'Montreal',co:'Canada',lat:45.5,lon:-73.57,s:'2026-08-02',e:'2026-08-13',lv:'1000',tour:'ATP',sf:'hard',w:{ATP:"2026 National Bank Open – Men's singles"},res:[{t:'ATP',w:'Ben Shelton',r:'Brandon Nakashima',sc:'6–3, 7–6(4)'}]},
 {id:'canw',name:'Canadian Open (WTA)',city:'Toronto',co:'Canada',lat:43.65,lon:-79.38,s:'2026-08-02',e:'2026-08-13',lv:'1000',tour:'WTA',sf:'hard',w:{WTA:"2026 National Bank Open – Women's singles"},res:[{t:'WTA',w:'Iga Świątek',r:'Elena Rybakina',sc:'6–2, 6–3'}]},
 {id:'cin',name:'Cincinnati Open',city:'Mason, Ohio',co:'USA',lat:39.36,lon:-84.31,s:'2026-08-13',e:'2026-08-24',lv:'1000',tour:'BOTH',sf:'hard',w:{ATP:"2026 Cincinnati Open – Men's singles",WTA:"2026 Cincinnati Open – Women's singles"},res:[{t:'ATP',w:'Arthur Fils',r:'Frances Tiafoe',sc:'6–3, 1–6, 6–0'},{t:'WTA',w:'Coco Gauff',r:'Jessica Pegula',sc:'6–2, 6–4'}]},
 {id:'uso',name:'US Open',city:'New York',co:'USA',lat:40.75,lon:-73.85,s:'2026-08-30',e:'2026-09-13',lv:'GS',tour:'BOTH',sf:'hard',w:{ATP:"2026 US Open – Men's singles",WTA:"2026 US Open – Women's singles"},res:[{t:'ATP',w:'Alexander Zverev',r:'Ben Shelton',sc:'6–3, 7–6(2), 5–7, 6–2'},{t:'WTA',w:'Elena Rybakina',r:'Aryna Sabalenka',sc:'Score not recorded'}],note:'Zverev became the fourth man in the Open Era to win his first two majors in the same year.'},
 {id:'bei',name:'China Open (WTA)',city:'Beijing',co:'China',lat:39.9,lon:116.4,s:'2026-09-30',e:'2026-10-11',lv:'1000',tour:'WTA',sf:'hard',w:{WTA:"2026 China Open – Women's singles"},res:[]},
 {id:'beia',name:'China Open (ATP)',city:'Beijing',co:'China',lat:39.9,lon:116.4,s:'2026-09-30',e:'2026-10-06',lv:'500',tour:'ATP',sf:'hard',w:{ATP:"2026 China Open – Men's singles"},res:[]},
 {id:'tyo',name:'Japan Open',city:'Tokyo',co:'Japan',lat:35.64,lon:139.79,s:'2026-09-30',e:'2026-10-06',lv:'500',tour:'ATP',sf:'hard',w:{ATP:"2026 Japan Open Tennis Championships – Singles"},res:[]},
 {id:'sha',name:'Shanghai Masters',city:'Shanghai',co:'China',lat:31.23,lon:121.47,s:'2026-10-07',e:'2026-10-18',lv:'1000',tour:'ATP',sf:'hard',w:{ATP:"2026 Rolex Shanghai Masters – Singles"},res:[]},
 {id:'wuh',name:'Wuhan Open',city:'Wuhan',co:'China',lat:30.59,lon:114.3,s:'2026-10-12',e:'2026-10-18',lv:'1000',tour:'WTA',sf:'hard',res:[]},
 {id:'tyow',name:'Pan Pacific Open',city:'Tokyo',co:'Japan',lat:35.64,lon:139.79,s:'2026-10-26',e:'2026-11-01',lv:'500',tour:'WTA',sf:'hard',res:[]},
 {id:'par',name:'Paris Masters',city:'Paris',co:'France',lat:48.84,lon:2.38,s:'2026-11-02',e:'2026-11-08',lv:'1000',tour:'ATP',sf:'hard',indoor:true,res:[]},
 {id:'wtaf',name:'WTA Finals',city:'Riyadh',co:'Saudi Arabia',lat:24.71,lon:46.68,s:'2026-11-01',e:'2026-11-08',lv:'Finals',tour:'WTA',sf:'hard',indoor:true,res:[],approx:true},
 {id:'atpf',name:'ATP Finals',city:'Turin',co:'Italy',lat:45.07,lon:7.69,s:'2026-11-15',e:'2026-11-22',lv:'Finals',tour:'ATP',sf:'hard',indoor:true,res:[],approx:true},
 {id:'dc',name:'Davis Cup Final 8',city:'Bologna',co:'Italy',lat:44.49,lon:11.34,s:'2026-11-24',e:'2026-11-29',lv:'Team',tour:'ATP',sf:'hard',indoor:true,res:[],approx:true},
];
const LV = {GS:{n:'Grand Slam',r:9},Finals:{n:'Season Finals',r:7.5},'1000':{n:'1000',r:7},Team:{n:'Team event',r:6},'500':{n:'500',r:5.5},'250':{n:'250',r:4.5}};
const SF = {hard:'Hard',clay:'Clay',grass:'Grass'};

const PLAYERS = {
 ATP:[
  {rk:1,n:'Jannik Sinner',co:'Italy',pts:11000,b:'2001-08-16',h:'Right-handed · two-handed backhand',gs:5,racket:'Head Speed series',style:'Takes the ball early from the baseline with low, flat, fast groundstrokes and keeps control of rallies.'},
  {rk:2,n:'Alexander Zverev',co:'Germany',pts:9630,b:'1997-04-20',h:'Right-handed · two-handed backhand',gs:2,racket:'Head Gravity series',style:'A 6 ft 6 in server with one of the best two-handed backhands on tour.'},
  {rk:3,n:'Carlos Alcaraz',co:'Spain',pts:5060,b:'2003-05-05',h:'Right-handed · two-handed backhand',gs:7,racket:'Babolat Pure Aero 98',style:'All-court player who mixes an explosive forehand with drop shots and net rushes.'},
  {rk:4,n:'Ben Shelton',co:'USA',pts:4680,b:'2002-10-09',h:'Left-handed · two-handed backhand',gs:0,racket:'—',style:'A left-handed serve that regularly passes 140 mph is his biggest weapon.'},
  {rk:5,n:'Félix Auger-Aliassime',co:'Canada',pts:3890,b:'2000-08-08',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Big serve and forehand, at his best on indoor hard courts.'},
  {rk:6,n:'Daniil Medvedev',co:'Russia',pts:3860,b:'1996-02-11',h:'Right-handed · two-handed backhand',gs:1,racket:'Tecnifibre TF40',style:'Defends from far behind the baseline and counterpunches with flat, deep returns.'},
  {rk:7,n:'Flavio Cobolli',co:'Italy',pts:3680,b:'2002-05-06',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'High-energy baseliner who is especially dangerous on clay.'},
  {rk:8,n:'Frances Tiafoe',co:'USA',pts:3380,b:'1998-01-20',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Athletic shotmaker who likes to finish points at the net.'},
  {rk:9,n:'Arthur Fils',co:'France',pts:3150,b:'2004-06-12',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Very fast racket-head speed produces one of the heaviest forehands on tour.'},
  {rk:10,n:'Alex de Minaur',co:'Australia',pts:3150,b:'1999-02-17',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Elite foot speed and relentless counterpunching.'},
 ],
 WTA:[
  {rk:1,n:'Elena Rybakina',co:'Kazakhstan',pts:9901,b:'1999-06-17',h:'Right-handed · two-handed backhand',gs:3,racket:'—',style:'Compact technique that produces a huge serve and flat, penetrating groundstrokes.'},
  {rk:2,n:'Aryna Sabalenka',co:'Belarus',pts:7810,b:'1998-05-05',h:'Right-handed · two-handed backhand',gs:4,racket:'Wilson Blade series',style:'Hits the heaviest ball on the WTA Tour from both wings.'},
  {rk:3,n:'Jessica Pegula',co:'USA',pts:7265,b:'1994-02-24',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Takes the ball on the rise and creates sharp angles; a hard-court specialist.'},
  {rk:4,n:'Coco Gauff',co:'USA',pts:7244,b:'2004-03-13',h:'Right-handed · two-handed backhand',gs:2,racket:'—',style:'Exceptional court coverage, a strong backhand and a big first serve.'},
  {rk:5,n:'Mirra Andreeva',co:'Russia',pts:5841,b:'2007-04-29',h:'Right-handed · two-handed backhand',gs:1,racket:'—',style:'Tactically sharp all-rounder who reached the top five as a teenager.'},
  {rk:6,n:'Linda Nosková',co:'Czech Republic',pts:5328,b:'2004-11-17',h:'Right-handed · two-handed backhand',gs:1,racket:'—',style:'Fast-tempo, aggressive groundstrokes.'},
  {rk:7,n:'Elina Svitolina',co:'Ukraine',pts:4809,b:'1994-09-12',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Consistent rallying and veteran match management.'},
  {rk:8,n:'Karolína Muchová',co:'Czech Republic',pts:4683,b:'1996-08-21',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Varied game built on slices, touch and net play.'},
  {rk:9,n:'Iga Świątek',co:'Poland',pts:4119,b:'2001-05-31',h:'Right-handed · two-handed backhand',gs:6,racket:'Tecnifibre',style:'Former No. 1 whose heavy topspin forehand has dominated clay.'},
  {rk:10,n:'Marta Kostyuk',co:'Ukraine',pts:4040,b:'2002-06-28',h:'Right-handed · two-handed backhand',gs:0,racket:'—',style:'Aggressive returner with quick feet.'},
 ]
};

const HISTORY = [
 {y:'1874',t:'Wingfield patents lawn tennis',d:'Major Walter Clopton Wingfield sold boxed sets of a game he called "Sphairistikè", splitting the modern game off from real tennis.'},
 {y:'1877',t:'The first Wimbledon',d:'The All England Club held its first Championships. The 15-30-40 scoring and court dimensions were fixed around this time.',big:true},
 {y:'1881',t:'U.S. National Championships begin',d:'The forerunner of the US Open. It moved to Flushing Meadows and hard courts in 1978.'},
 {y:'1891',t:'French Championships begin',d:'Open only to members of French clubs until 1925. Stade Roland Garros opened in 1928.'},
 {y:'1900',t:'Davis Cup founded',d:'Started as a USA vs. Great Britain match. The women’s competition, now the Billie Jean King Cup, followed in 1963.'},
 {y:'1905',t:'Australasian Championships',d:'The forerunner of the Australian Open. It moved from grass to hard courts at Melbourne Park in 1988.'},
 {y:'1938',t:'Don Budge wins the first calendar Grand Slam',d:'All four majors in one year. Among men, only Rod Laver (1962, 1969) has done it since.'},
 {y:'1968',t:'The Open Era begins',d:'Professionals were allowed into the majors, putting amateurs and pros in the same draws.',big:true},
 {y:'1972–73',t:'ATP, WTA and computer rankings',d:'The ATP formed in 1972 and Billie Jean King led the founding of the WTA in 1973. ATP computer rankings started that year, and the US Open paid men and women equally for the first time.'},
 {y:'1988',t:'Steffi Graf’s Golden Slam',d:'All four majors plus Olympic gold in Seoul, the year tennis returned as a full Olympic sport.',big:true},
 {y:'2006',t:'Hawk-Eye challenges arrive',d:'Electronic review debuted in Miami and at the US Open and changed how calls are disputed.'},
 {y:'2022',t:'One final-set tiebreak for all majors',d:'All four Grand Slams adopted a 10-point tiebreak at 6–6 in the deciding set.'},
 {y:'2025',t:'Wimbledon replaces line judges',d:'After 148 years, every court switched to electronic line calling.'},
 {y:'2026',t:'Alcaraz completes the career Grand Slam',d:'He won the Australian Open at 22. Later that year Zverev won Roland Garros and the US Open back to back.',big:true},
];
const RECORDS = [
 ['Men','Novak Djokovic','Serbia',24],['Men','Rafael Nadal','Spain',22],['Men','Roger Federer','Switzerland',20],
 ['Women','Margaret Court','Australia',24],['Women','Serena Williams','USA',23],['Women','Steffi Graf','Germany',22],
];
const SLAMS = [
 {n:'Australian Open',sf:'hard',d:'January · Melbourne · since 1905 · hard (GreenSet)'},
 {n:'Roland Garros',sf:'clay',d:'May–June · Paris · since 1891 · red clay'},
 {n:'Wimbledon',sf:'grass',d:'June–July · London · since 1877 · grass, all-white dress code'},
 {n:'US Open',sf:'hard',d:'Aug–Sept · New York · since 1881 · hard (Laykold)'},
];
const RACKETS = [
 {m:'Babolat Pure Aero 98',h:98,w:305,p:'16×20',who:'Carlos Alcaraz'},
 {m:'Babolat Pure Drive',h:100,w:300,p:'16×19',who:''},
 {m:'Head Speed MP',h:100,w:300,p:'16×19',who:'Jannik Sinner (Speed line)'},
 {m:'Head Speed Pro',h:100,w:310,p:'18×20',who:'Novak Djokovic (Speed line)'},
 {m:'Head Gravity Pro',h:100,w:315,p:'18×20',who:'Alexander Zverev (Gravity line)'},
 {m:'Wilson Pro Staff 97',h:97,w:315,p:'16×19',who:''},
 {m:'Wilson Blade 98 16×19',h:98,w:305,p:'16×19',who:'Aryna Sabalenka (Blade line)'},
 {m:'Wilson Clash 100',h:100,w:295,p:'16×19',who:''},
 {m:'Yonex EZONE 98',h:98,w:305,p:'16×19',who:''},
 {m:'Yonex VCORE 98',h:98,w:305,p:'16×19',who:''},
 {m:'Tecnifibre TF40 305',h:98,w:305,p:'16×19',who:'Daniil Medvedev'},
];
/* pr: price tier 1–4; usd: approximate US retail price of one 12 m set, October 2026 */
const STRINGS = [
 {k:'syn',pr:1,usd:[4,8],t:'Synthetic gut',ex:'Prince Synthetic Gut, Gamma Synthetic Gut',p:3,c:3,s:2,cf:3,d:3,kg:[23,25],who:'Beginners and anyone who wants a cheap, all-round string.',note:'Solid nylon core. Cheap, balanced, and a good starting point.'},
 {k:'multi',pr:3,usd:[12,22],t:'Multifilament',ex:'Wilson NXT, Tecnifibre X-One Biphase',p:4,c:3,s:2,cf:4,d:2,kg:[23,25],who:'Players with arm or elbow pain, and anyone who wants easy depth.',note:'Hundreds of twisted fibres give a gut-like feel that is easy on the elbow.'},
 {k:'gut',pr:4,usd:[35,50],t:'Natural gut',ex:'Babolat VS Touch, Luxilon Natural Gut',p:5,c:3,s:3,cf:5,d:2,kg:[24,26],who:'Players who want the best feel and arm comfort and don’t mind the price.',note:'Made from cow intestine. Holds tension best of any string and costs the most.'},
 {k:'soft',pr:2,usd:[10,18],t:'Soft polyester',ex:'Babolat RPM Soft, Solinco Hyper-G Soft',p:3,c:4,s:4,cf:2,d:4,kg:[21,23],who:'Club players with fast topspin swings who break softer strings.',note:'A softer poly that keeps most of the spin and control with less shock.'},
 {k:'poly',pr:2,usd:[8,20],t:'Polyester (mono)',ex:'Luxilon ALU Power, Babolat RPM Blast, Solinco Hyper-G',p:2,c:5,s:5,cf:1,d:5,kg:[21,23],who:'Strong, advanced players with long, fast swings and healthy arms.',note:'Used by most tour players. Loses tension quickly, so it needs frequent restringing.'},
 {k:'hybrid',pr:3,usd:[10,30],t:'Hybrid',ex:'Poly mains + multifilament crosses, or gut mains + poly crosses (Federer’s setup)',p:4,c:4,s:4,cf:4,d:4,kg:[22,24],who:'Players who want poly’s control and spin with a softer feel.',note:'Different strings in the mains and crosses to combine their strengths.'},
];

/* String library for the Strings guide and String Finder.
   ty: poly | multi | gut | syn | hybrid · tier: relative price per set, 1 (cheapest) to 4 · g: gauges in mm sold by the maker
   tags drive the String Finder: spin, control, power, comfort, durability, feel, value. Ratings are editorial, not lab data. */
const STRING_DB = [
 {n:'Babolat RPM Blast', b:'Babolat', ty:'poly', sh:'Octagonal', g:[1.20,1.25,1.30,1.35], tier:2, tags:['spin','control','durability'], note:'Eight-sided poly built for heavy topspin; associated with Rafael Nadal. Firm, so not for sore arms.'},
 {n:'Luxilon ALU Power', b:'Luxilon', ty:'poly', sh:'Round, smooth', g:[1.25,1.30], tier:3, tags:['control','feel','power'], note:'The tour benchmark poly: crisp, precise and livelier than most. Loses tension fast, so restring often.'},
 {n:'Solinco Hyper-G', b:'Solinco', ty:'poly', sh:'Square', g:[1.20,1.25,1.30], tier:2, tags:['spin','control','value'], note:'Square co-poly with strong bite on the ball at a mid price. A popular step up from RPM Blast.'},
 {n:'Solinco Tour Bite', b:'Solinco', ty:'poly', sh:'Square, sharp edges', g:[1.20,1.25,1.30], tier:2, tags:['spin','control','durability'], note:'One of the most aggressive spin strings. Very firm: best for big swingers with healthy arms.'},
 {n:'Yonex Poly Tour Pro', b:'Yonex', ty:'poly', sh:'Round', g:[1.20,1.25,1.30], tier:2, tags:['comfort','control','feel'], note:'One of the softer co-polys. A good first poly or a choice for players who find most poly harsh.'},
 {n:'Babolat RPM Soft', b:'Babolat', ty:'poly', sh:'Octagonal', g:[1.25,1.30], tier:2, tags:['spin','comfort'], note:'A softer take on RPM Blast for club players who want spin without as much stiffness.'},
 {n:'Head Lynx Tour', b:'Head', ty:'poly', sh:'Hexagonal', g:[1.25,1.30], tier:2, tags:['spin','control','value'], note:'Six-sided co-poly with good spin and tension holding for the price.'},
 {n:'Tecnifibre Razor Code', b:'Tecnifibre', ty:'poly', sh:'Round', g:[1.20,1.25,1.30], tier:2, tags:['control','durability'], note:'A low-power, control-first co-poly that holds tension well for a poly.'},
 {n:'Wilson NXT', b:'Wilson', ty:'multi', sh:'Round', g:[1.24,1.30], tier:2, tags:['comfort','power','feel'], note:'A long-standing multifilament: soft, powerful and easy on the elbow.'},
 {n:'Tecnifibre X-One Biphase', b:'Tecnifibre', ty:'multi', sh:'Round', g:[1.24,1.30], tier:3, tags:['comfort','power','feel'], note:'Premium multifilament often described as the closest thing to gut. Frays and breaks sooner than poly.'},
 {n:'Tecnifibre NRG2', b:'Tecnifibre', ty:'multi', sh:'Round', g:[1.24,1.32], tier:3, tags:['comfort','power'], note:'A very soft multifilament for players with arm trouble or a short, compact swing.'},
 {n:'Babolat VS Touch', b:'Babolat', ty:'gut', sh:'Round', g:[1.25,1.30,1.35], tier:4, tags:['comfort','power','feel'], note:'Natural gut: the most comfortable string with the best tension holding. Expensive and dislikes moisture.'},
 {n:'Wilson Natural Gut', b:'Wilson', ty:'gut', sh:'Round', g:[1.25,1.30], tier:4, tags:['comfort','power','feel'], note:'Natural gut used in Wilson’s Champion’s Choice hybrid. Best for arm-sensitive players who can afford it.'},
 {n:'Prince Synthetic Gut Duraflex', b:'Prince', ty:'syn', sh:'Round', g:[1.25,1.30], tier:1, tags:['value','comfort'], note:'The classic budget all-rounder. Fine for beginners, juniors and players who rarely break strings.'},
 {n:'Gamma Synthetic Gut', b:'Gamma', ty:'syn', sh:'Round', g:[1.25,1.30], tier:1, tags:['value'], note:'Cheap, consistent, available everywhere. A sensible default for a first restring.'},
 {n:'Wilson Champion’s Choice', b:'Wilson', ty:'hybrid', sh:'Gut + textured poly', g:[1.30,1.25], tier:4, tags:['feel','control','comfort'], note:'Natural gut mains with Luxilon ALU Power Rough crosses: the hybrid Roger Federer used.'},
];
const STRING_TYPE = {poly:'Polyester', multi:'Multifilament', gut:'Natural gut', syn:'Synthetic gut', hybrid:'Hybrid'};

/* Shopping links. Leave tags empty until an affiliate account is approved: links still work, they just earn nothing.
   amazonTag: your Associates tracking ID (e.g. 'tennisroam-20').
   shops: extra retailers; {q} is replaced with the URL-encoded string name. Example after approval through an affiliate network:
   {name:'Tennis Express', url:'https://YOUR-NETWORK-DEEPLINK?url=https%3A%2F%2Fwww.tennisexpress.com%2Fsearch%3Fq%3D{q}'} */
const SHOP = {amazonTag:'', shops:[]};

/* Questions for the Strings FAQ, rendered as HTML and as FAQPage structured data */
const STRING_FAQ = [
 ['What tennis string should a beginner use?', 'A synthetic gut or a multifilament at a mid tension, around 24–25 kg (53–55 lbs). Both are cheap or comfortable enough that you can learn what you like before spending more. Avoid stiff polyester until your swing is long and fast enough to use it.'],
 ['Is polyester string bad for your arm?', 'It can be. Polyester is the stiffest common string and goes dead quickly, which sends more shock to the arm. If you have elbow, wrist or shoulder pain, switch to multifilament or natural gut, or at least use a soft co-poly strung 1–2 kg lower.'],
 ['How often should I restring my racket?', 'A common rule is to restring as many times a year as you play per week, so three times a week means about three restrings a year. Polyester loses tension faster than other materials, so many poly users restring every 15–20 hours of play even if the string has not broken.'],
 ['What tension should I string at?', 'Start in the middle of the range printed on your racket, often 23–26 kg (50–58 lbs). Go 1–2 kg lower for more power, comfort and a softer feel, especially with polyester. Go higher only if the ball is flying long and your arm feels fine.'],
 ['What is the difference between 16 and 17 gauge?', '16 gauge is about 1.26–1.33 mm and 17 gauge about 1.18–1.25 mm. Thinner 17 gauge strings bite the ball more and feel livelier, but they break sooner. If you break strings often, go thicker.'],
 ['What is a hybrid string setup?', 'Using one string in the mains (the long, vertical strings) and another in the crosses. Common setups pair a durable, spin-friendly poly in the mains with a softer multifilament or gut in the crosses for comfort, or the reverse, as Roger Federer did with gut mains and poly crosses.'],
 ['Do shaped strings really add spin?', 'Shaped and textured polys can grip the ball a little more, but most extra spin comes from strings snapping back into place after sliding, which smooth polys also do well. String material, tension and an open string pattern matter more than shape.'],
];

/* Grand Slam singles champions 2000–2025, in order [Australian Open, Roland Garros, Wimbledon, US Open]. null = not held. 2026 comes from T. */
const PAST_SLAMS = {
 ATP:{
  2000:['Andre Agassi','Gustavo Kuerten','Pete Sampras','Marat Safin'],
  2001:['Andre Agassi','Gustavo Kuerten','Goran Ivanišević','Lleyton Hewitt'],
  2002:['Thomas Johansson','Albert Costa','Lleyton Hewitt','Pete Sampras'],
  2003:['Andre Agassi','Juan Carlos Ferrero','Roger Federer','Andy Roddick'],
  2004:['Roger Federer','Gastón Gaudio','Roger Federer','Roger Federer'],
  2005:['Marat Safin','Rafael Nadal','Roger Federer','Roger Federer'],
  2006:['Roger Federer','Rafael Nadal','Roger Federer','Roger Federer'],
  2007:['Roger Federer','Rafael Nadal','Roger Federer','Roger Federer'],
  2008:['Novak Djokovic','Rafael Nadal','Rafael Nadal','Roger Federer'],
  2009:['Rafael Nadal','Roger Federer','Roger Federer','Juan Martín del Potro'],
  2010:['Roger Federer','Rafael Nadal','Rafael Nadal','Rafael Nadal'],
  2011:['Novak Djokovic','Rafael Nadal','Novak Djokovic','Novak Djokovic'],
  2012:['Novak Djokovic','Rafael Nadal','Roger Federer','Andy Murray'],
  2013:['Novak Djokovic','Rafael Nadal','Andy Murray','Rafael Nadal'],
  2014:['Stan Wawrinka','Rafael Nadal','Novak Djokovic','Marin Čilić'],
  2015:['Novak Djokovic','Stan Wawrinka','Novak Djokovic','Novak Djokovic'],
  2016:['Novak Djokovic','Novak Djokovic','Andy Murray','Stan Wawrinka'],
  2017:['Roger Federer','Rafael Nadal','Roger Federer','Rafael Nadal'],
  2018:['Roger Federer','Rafael Nadal','Novak Djokovic','Novak Djokovic'],
  2019:['Novak Djokovic','Rafael Nadal','Novak Djokovic','Rafael Nadal'],
  2020:['Novak Djokovic','Rafael Nadal',null,'Dominic Thiem'],
  2021:['Novak Djokovic','Novak Djokovic','Novak Djokovic','Daniil Medvedev'],
  2022:['Rafael Nadal','Rafael Nadal','Novak Djokovic','Carlos Alcaraz'],
  2023:['Novak Djokovic','Novak Djokovic','Carlos Alcaraz','Novak Djokovic'],
  2024:['Jannik Sinner','Carlos Alcaraz','Carlos Alcaraz','Jannik Sinner'],
  2025:['Jannik Sinner','Carlos Alcaraz','Jannik Sinner','Carlos Alcaraz'],
 },
 WTA:{
  2000:['Lindsay Davenport','Mary Pierce','Venus Williams','Venus Williams'],
  2001:['Jennifer Capriati','Jennifer Capriati','Venus Williams','Venus Williams'],
  2002:['Jennifer Capriati','Serena Williams','Serena Williams','Serena Williams'],
  2003:['Serena Williams','Justine Henin','Serena Williams','Justine Henin'],
  2004:['Justine Henin','Anastasia Myskina','Maria Sharapova','Svetlana Kuznetsova'],
  2005:['Serena Williams','Justine Henin','Venus Williams','Kim Clijsters'],
  2006:['Amélie Mauresmo','Justine Henin','Amélie Mauresmo','Maria Sharapova'],
  2007:['Serena Williams','Justine Henin','Venus Williams','Justine Henin'],
  2008:['Maria Sharapova','Ana Ivanovic','Venus Williams','Serena Williams'],
  2009:['Serena Williams','Svetlana Kuznetsova','Serena Williams','Kim Clijsters'],
  2010:['Serena Williams','Francesca Schiavone','Serena Williams','Kim Clijsters'],
  2011:['Kim Clijsters','Li Na','Petra Kvitová','Samantha Stosur'],
  2012:['Victoria Azarenka','Maria Sharapova','Serena Williams','Serena Williams'],
  2013:['Victoria Azarenka','Serena Williams','Marion Bartoli','Serena Williams'],
  2014:['Li Na','Maria Sharapova','Petra Kvitová','Serena Williams'],
  2015:['Serena Williams','Serena Williams','Serena Williams','Flavia Pennetta'],
  2016:['Angelique Kerber','Garbiñe Muguruza','Serena Williams','Angelique Kerber'],
  2017:['Serena Williams','Jeļena Ostapenko','Garbiñe Muguruza','Sloane Stephens'],
  2018:['Caroline Wozniacki','Simona Halep','Angelique Kerber','Naomi Osaka'],
  2019:['Naomi Osaka','Ashleigh Barty','Simona Halep','Bianca Andreescu'],
  2020:['Sofia Kenin','Iga Świątek',null,'Naomi Osaka'],
  2021:['Naomi Osaka','Barbora Krejčíková','Ashleigh Barty','Emma Raducanu'],
  2022:['Ashleigh Barty','Iga Świątek','Elena Rybakina','Iga Świątek'],
  2023:['Aryna Sabalenka','Iga Świątek','Markéta Vondroušová','Coco Gauff'],
  2024:['Aryna Sabalenka','Iga Świątek','Barbora Krejčíková','Aryna Sabalenka'],
  2025:['Madison Keys','Coco Gauff','Iga Świątek','Aryna Sabalenka'],
 },
};
