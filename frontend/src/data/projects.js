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
    category: "website",
    categoryLabel: "Website",
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
    name: "Innings Lab",
    category: "landing",
    categoryLabel: "Landing Page",
    tech: ["HTML5", "Vanilla CSS", "JavaScript", "GSAP", "Anime.js", "Chart.js"],
    description: "A cricket player statistics maintenance dashboard with visually rich data charts. It helps manage and analyze player performance in a clean, intuitive interface. Designed to turn raw match data into actionable insights.",
    mainImage: inningsLabMain,
    screenshots: [inningsLabMain, inningsLab1, inningsLab2],

    liveUrl: "https://github.com/aenishkhullar/innings-lab",
    stickyTop: 180,
  },
];

export default projects;
