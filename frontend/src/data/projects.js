import yantraMain from '../assets/yantra_main.png';
import yantra1 from '../assets/yantra_1.png';
import yantra2 from '../assets/yantra_2.png';

import lifeSyncMain from '../assets/lifesync_main.png';
import lifeSync1 from '../assets/lifesync_1.png';
import lifeSync2 from '../assets/lifesync_2.png';

import uniMartMain from '../assets/unimart_main.png';
import uniMart1 from '../assets/unimart_1.png';
import uniMart2 from '../assets/unimart_2.png';

import inningsLabMain from '../assets/inningsLab_main.png';
import inningsLab1 from '../assets/inningsLab_1.png';
import inningsLab2 from '../assets/inningsLab_2.png';

import travelEaseMain from '../assets/travelease_main.png';
import travelEase1 from '../assets/travelease_1.png';
import travelEase2 from '../assets/travelease_2.png';

import splashersMain from '../assets/splashers_main.png';
import splashers1 from '../assets/splashers_1.png';
import splashers2 from '../assets/splashers_2.png';

import dreamDesignerMain from '../assets/dreamdesigner_main.png';
import dreamDesigner1 from '../assets/dreamdesigner_1.png';
import dreamDesigner2 from '../assets/dreamdesigner_2.png';

const projects = [
  {
    id: 1,
    num: '01',
    name: "UniMart",
    category: "webapp",
    categoryLabel: "Web App",
    tech: ["React", "Node", "Express", "MongoDB", "JWT", "Resend"],
    description: "A student peer-to-peer marketplace built for university campuses. It helps students buy, sell, and discover useful items locally with a smooth and simple experience. Designed to make campus trading fast, practical, and community-driven.",
    mainImage: uniMartMain,
    screenshots: [uniMartMain, uniMart1, uniMart2],
    liveUrl: "https://unimart.study",
    stickyTop: 120,
  },
  {
    id: 2,
    num: '02',
    name: "Yantra",
    category: "webapp",
    categoryLabel: "Web App",
    tech: ["React", "Node", "Express", "MongoDB", "JWT"],
    description: "A trading simulator for learning stock market strategies without risking real money. It uses virtual funds paired with real-time market data, making practice feel realistic and engaging. Built to help users explore investing concepts in a safe environment.",
    mainImage: yantraMain,
    screenshots: [yantraMain, yantra1, yantra2],
    liveUrl: "https://github.com/aenishkhullar/yantra",
    stickyTop: 140,
  },
  {
    id: 3,
    num: '03',
    name: "LifeSync",
    category: "webapp",
    categoryLabel: "Web App",
    tech: ["React", "Node", "Express", "MongoDB", "JWT"],
    description: "A subscription manager designed to track, organize, and simplify recurring payments. It provides AI-powered insights to help users understand spending patterns and make smarter decisions. Built for effortless subscription control and financial clarity.",
    mainImage: lifeSyncMain,
    screenshots: [lifeSyncMain, lifeSync1, lifeSync2],
    liveUrl: "https://github.com/aenishkhullar/LifeSync",
    stickyTop: 160,
  },
  {
    id: 4,
    num: '04',
    name: "The Dream Designer",
    category: "webapp",
    categoryLabel: "Web App",
    tech: ["React", "Express", "Node", "MongoDB", "JWT", "Resend"],
    description: "A complete digital platform for architects and interior designers. It combines a polished portfolio website with a client management app for tracking customer projects, payments, invoices, timelines, and design assets in one organized workspace.",
    mainImage: dreamDesignerMain,
    screenshots: [dreamDesignerMain, dreamDesigner1, dreamDesigner2],
    liveUrl: "https://github.com/aenishkhullar/the-dream-designer",
    stickyTop: 180,
  },
  {
    id: 5,
    num: '05',
    name: "TravelEase",
    category: "website",
    categoryLabel: "Website",
    tech: ["HTML5", "Vanilla CSS", "JavaScript", "GSAP"],
    description: "A homestay booking platform built for business travelers visiting Lansdowne. It lets users browse, book, and pay securely for comfortable local stays. Designed to make work trips smooth, hassle-free, and locally connected.",
    mainImage: travelEaseMain,
    screenshots: [travelEaseMain, travelEase1, travelEase2],
    liveUrl: "https://github.com/aenishkhullar/travelease",
    stickyTop: 200,
  },
  {
    id: 6,
    num: '06',
    name: "Splashers",
    category: "landing",
    categoryLabel: "Landing Page",
    tech: ["HTML5", "Vanilla CSS", "JavaScript", "GSAP"],
    description: "An event management company built for curated social and private gatherings. It lets you collaborate with their team to plan and book events at exclusive properties. Designed to turn every occasion into a seamless, vibrant, and unforgettable experience.",
    mainImage: splashersMain,
    screenshots: [splashersMain, splashers1, splashers2],
    liveUrl: "https://github.com/aenishkhullar/splashers",
    stickyTop: 220,
  },
  {
    id: 7,
    num: '07',
    name: "Innings Lab",
    category: "landing",
    categoryLabel: "Landing Page",
    tech: ["HTML5", "Vanilla CSS", "JavaScript", "GSAP", "Anime.js", "Chart.js"],
    description: "A cricket player statistics maintenance dashboard with visually rich data charts. It helps manage and analyze player performance in a clean, intuitive interface. Designed to turn raw match data into actionable insights.",
    mainImage: inningsLabMain,
    screenshots: [inningsLabMain, inningsLab1, inningsLab2],
    liveUrl: "https://github.com/aenishkhullar/innings-lab",
    stickyTop: 240,
  },
];

export default projects;
