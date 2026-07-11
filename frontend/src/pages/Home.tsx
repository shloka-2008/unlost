import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { 
  Search, Plus, PlusCircle, Calendar, MapPin, Tag, ChevronRight, Eye, Bookmark, 
  Share2, Smartphone, Watch, Backpack, Key, Wallet, Map, 
  Activity, Clock, CheckCircle2, ChevronLeft, QrCode, PhoneCall, 
  HelpCircle, Shield, X, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'Lost' | 'Found';
  date: string;
  reporter_email: string;
  image_file: string | null;
  security_question?: string;
  isMock?: boolean;
}

// 25 Realistic Mock Items
const mockItems: Item[] = [
  {
    id: 'mock-1',
    title: 'Black Leather Wallet',
    description: 'Bifold leather wallet containing some cash, a transit card, and gym membership. No credit cards inside.',
    category: 'Wallets',
    location: 'Student Center Cafeteria',
    status: 'Lost',
    date: '2026-07-11',
    reporter_email: 'clara.jones@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-2',
    title: 'Apple AirPods Pro',
    description: 'Found a pair of AirPods Pro in their wireless charging case. Case has a small green silicone cover with a key ring.',
    category: 'Electronics',
    location: 'Library 2nd Floor Study Desks',
    status: 'Found',
    date: '2026-07-10',
    reporter_email: 'alex.smith@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-3',
    title: 'Blue Herschel Backpack',
    description: 'Blue canvas backpack with brown leather straps. Contains a math textbook, notebook, and a blue pencil case.',
    category: 'Bags',
    location: 'Science Lecture Hall Room 302',
    status: 'Lost',
    date: '2026-07-09',
    reporter_email: 'jake.miller@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-4',
    title: 'Student ID Card - Alex Rivera',
    description: 'Found ID card for sophomore Alex Rivera. Left near the check-in desk at the gym entrance.',
    category: 'Documents',
    location: 'Gym Locker Rooms',
    status: 'Found',
    date: '2026-07-11',
    reporter_email: 'gym.staff@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-5',
    title: 'Toyota Car Keys',
    description: 'Keyring with a Toyota key fob, two house keys, and a miniature rubber duck keychain.',
    category: 'Keys',
    location: 'Campus Parking Lot B',
    status: 'Lost',
    date: '2026-07-08',
    reporter_email: 'mariah.d@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-6',
    title: 'Silver Rolex Oyster Watch',
    description: 'Men silver wrist watch with blue dial face. Found on the bottom benches near the track field.',
    category: 'Accessories',
    location: 'Sports Center Stadium',
    status: 'Found',
    date: '2026-07-10',
    reporter_email: 'coach.bill@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-7',
    title: 'Hydro Flask Water Bottle',
    description: 'Mint green 32oz Hydro Flask with a metal straw lid and a few national park stickers.',
    category: 'Others',
    location: 'Main Hall Lobby',
    status: 'Lost',
    date: '2026-07-11',
    reporter_email: 'henry.t@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-8',
    title: 'MacBook USB-C Charger',
    description: '87W Apple brand power brick with a 2-meter USB-C cable wrapped around it.',
    category: 'Electronics',
    location: 'Engineering Building',
    status: 'Found',
    date: '2026-07-09',
    reporter_email: 'eng.lab@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-9',
    title: 'Black Compact Umbrella',
    description: 'Totes umbrella, black color, wet. Found standing in the umbrella rack by the main double doors.',
    category: 'Clothing',
    location: 'Humanities Hall Entryway',
    status: 'Found',
    date: '2026-07-10',
    reporter_email: 'sam.r@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-10',
    title: 'TI-84 Graphing Calculator',
    description: 'Texas Instruments TI-84 Plus CE. Has "Property of Sarah" written in silver sharpie on the back cover.',
    category: 'Electronics',
    location: 'Mathematics Annex Room 104',
    status: 'Lost',
    date: '2026-07-07',
    reporter_email: 'sarah.k@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-11',
    title: 'Leather Moleskine Notebook',
    description: 'Black ruled paper notebook. Left on one of the benches inside the art corridor.',
    category: 'Others',
    location: 'Fine Arts Gallery',
    status: 'Found',
    date: '2026-07-11',
    reporter_email: 'curator@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-12',
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Black over-ear active noise canceling headphones in their gray zippered travel case.',
    category: 'Electronics',
    location: 'Library Quiet Zone',
    status: 'Lost',
    date: '2026-07-10',
    reporter_email: 'lucas.p@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-13',
    title: 'US Passport',
    description: 'US Passport under the name of Ethan Zhao. Found inside a blue passport holder sleeve.',
    category: 'Documents',
    location: 'International Office lobby',
    status: 'Found',
    date: '2026-07-08',
    reporter_email: 'advising@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-14',
    title: 'Ray-Ban Wayfarer Glasses',
    description: 'Classic tortoiseshell frame prescription glasses. Left at the corner table on the outdoor patio.',
    category: 'Accessories',
    location: 'Starbucks Patio',
    status: 'Lost',
    date: '2026-07-10',
    reporter_email: 'oliver.g@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-15',
    title: 'iPhone 14 Pro Max',
    description: 'Space Gray iPhone 14 Pro Max with a transparent OtterBox case. The lock screen shows a dog wallpaper.',
    category: 'Electronics',
    location: 'Science Quad courtyard',
    status: 'Found',
    date: '2026-07-11',
    reporter_email: 'security@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-16',
    title: 'Specialized Bicycle Helmet',
    description: 'White and red specialized cycling helmet. Left locked or hanging on the bike racks.',
    category: 'Clothing',
    location: 'Gym Bike Racks',
    status: 'Lost',
    date: '2026-07-09',
    reporter_email: 'cyclist99@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-17',
    title: 'SanDisk 128GB USB Drive',
    description: 'Red and black slide-out USB flash drive. Found plugged into Desktop workstation number 14.',
    category: 'Electronics',
    location: 'Library Computer Lab',
    status: 'Found',
    date: '2026-07-11',
    reporter_email: 'lib.tech@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-18',
    title: 'Yeti Metal Lunch Box',
    description: 'Navy blue Yeti Daytrip lunch box with insulated interior. Has a key strap clip on the top handle.',
    category: 'Others',
    location: 'Chemistry Lab benches',
    status: 'Lost',
    date: '2026-07-11',
    reporter_email: 'chem.major@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-19',
    title: 'Canon EOS Rebel Camera',
    description: 'Canon DSLR camera with an 18-55mm kit lens. Found on a wooden trail bench near the rose garden.',
    category: 'Electronics',
    location: 'Botanical Gardens',
    status: 'Found',
    date: '2026-07-07',
    reporter_email: 'garden.staff@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-20',
    title: 'Anker Power Bank',
    description: 'Black heavy duty external battery charger. Left at the charging kiosk in the student center.',
    category: 'Electronics',
    location: 'Student Center Lounge',
    status: 'Lost',
    date: '2026-07-08',
    reporter_email: 'sophie.m@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-21',
    title: 'Blue Denim Jacket',
    description: 'Levis denim jacket size Medium. Found draped over a wooden chair in the middle lawn.',
    category: 'Clothing',
    location: 'Quad Lawn',
    status: 'Found',
    date: '2026-07-10',
    reporter_email: 'quad.crew@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-22',
    title: 'Gold Hoop Earrings',
    description: 'A pair of thin, classic gold hoop earrings. Lost somewhere near the amphitheater steps.',
    category: 'Accessories',
    location: 'Arts Amphitheater',
    status: 'Lost',
    date: '2026-07-09',
    reporter_email: 'lisa.v@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-23',
    title: 'Resident Parking Permit',
    description: 'Decal sticker parking permit numbered #R-8492. Dropped near the reception counter.',
    category: 'Documents',
    location: 'Admissions Office',
    status: 'Lost',
    date: '2026-07-11',
    reporter_email: 'parking.help@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-24',
    title: 'Keyring with 4 Keys',
    description: 'Four silver keys on a loop. Found on the shelf in the stationary aisle of the bookstore.',
    category: 'Keys',
    location: 'Bookstore checkout',
    status: 'Found',
    date: '2026-07-11',
    reporter_email: 'retail.staff@univ.edu',
    image_file: null,
    isMock: true
  },
  {
    id: 'mock-25',
    title: 'Patagonia Fleece Pullover',
    description: 'Gray synchilla snap-T fleece jacket size Large. Left in the back row of seats in the lounge.',
    category: 'Clothing',
    location: 'Student Union Lounge',
    status: 'Lost',
    date: '2026-07-10',
    reporter_email: 'student.life@univ.edu',
    image_file: null,
    isMock: true
  }
];

// Stats upward counter animation helper
const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1.6;
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 12);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">{count}{suffix}</span>;
};

// Vector SVGs category generator for placeholder images
const CategoryImageFallback: React.FC<{ category: string }> = ({ category }) => {
  const cat = category.toLowerCase();
  let grad = 'from-blue-500/20 to-indigo-500/20';
  let iconColor = 'text-indigo-400';
  let Icon = Tag;

  if (cat.includes('elect')) {
    grad = 'from-cyan-500/25 to-blue-500/20';
    iconColor = 'text-cyan-400';
    Icon = Smartphone;
  } else if (cat.includes('wall')) {
    grad = 'from-amber-500/25 to-orange-500/20';
    iconColor = 'text-amber-400';
    Icon = Wallet;
  } else if (cat.includes('key')) {
    grad = 'from-teal-500/25 to-emerald-500/20';
    iconColor = 'text-teal-400';
    Icon = Key;
  } else if (cat.includes('bag')) {
    grad = 'from-violet-500/25 to-fuchsia-500/20';
    iconColor = 'text-violet-400';
    Icon = Backpack;
  } else if (cat.includes('doc')) {
    grad = 'from-rose-500/25 to-pink-500/20';
    iconColor = 'text-rose-400';
    Icon = Shield;
  } else if (cat.includes('cloth')) {
    grad = 'from-sky-500/25 to-blue-500/20';
    iconColor = 'text-sky-400';
    Icon = Tag;
  } else if (cat.includes('access')) {
    grad = 'from-pink-500/25 to-purple-500/20';
    iconColor = 'text-pink-400';
    Icon = Watch;
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center relative overflow-hidden`}>
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      {/* Drifting subtle particles inside image wrapper */}
      <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-white/10 blur-xs" />
      <div className="absolute bottom-6 right-8 w-3.5 h-3.5 rounded-full bg-white/5 blur-xs" />
      <Icon className={`w-14 h-14 ${iconColor} drop-shadow-[0_0_12px_currentColor] group-hover:scale-110 transition-transform duration-500`} />
    </div>
  );
};

const Home: React.FC = () => {
  // State management
  const [, setDbItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('All');
  
  // Custom Interactive features
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedItemModal, setSelectedItemModal] = useState<Item | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Quick Actions Menu State
  const [fabOpen, setFabOpen] = useState(false);
  
  // Map Pin Selection State
  const [hoveredMapPin, setHoveredMapPin] = useState<Item | null>(null);
  const [activeMapPin, setActiveMapPin] = useState<Item | null>(null);

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch database items and combine with mock items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        if (response.ok && data.success) {
          setDbItems(data.items);
          const combined = [...data.items, ...mockItems];
          setAllItems(combined);
          setFilteredItems(combined);
        } else {
          setAllItems(mockItems);
          setFilteredItems(mockItems);
        }
      } catch (error) {
        console.error('Error loading latest items:', error);
        setAllItems(mockItems);
        setFilteredItems(mockItems);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter application trigger
  useEffect(() => {
    let result = allItems;

    // Search query matching
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter(item => item.status === selectedStatus);
    }

    // Location filter
    if (selectedLocation !== 'All') {
      result = result.filter(item => item.location.includes(selectedLocation));
    }

    // Date range filter
    if (selectedDate !== 'All') {
      const today = new Date('2026-07-11'); // Local mockup reference date
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        const diffTime = Math.abs(today.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (selectedDate === 'Today') return diffDays <= 1;
        if (selectedDate === 'Week') return diffDays <= 7;
        if (selectedDate === 'Month') return diffDays <= 30;
        return true;
      });
    }

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, selectedStatus, selectedLocation, selectedDate, allItems]);

  // Toast notifier helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bookmark toggle operation
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bId => bId !== id));
      triggerToast('Removed item from bookmarks');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      triggerToast('Added item to bookmarks');
    }
  };

  // Clipboard share item helper
  const handleShareItem = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const mockLink = `${window.location.origin}/items?id=${item.id}`;
    navigator.clipboard.writeText(mockLink);
    triggerToast(`Copied details link to clipboard!`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Carousel slider operations
  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmt = 320;
      carouselRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth'
      });
    }
  };

  // Filter unique locations for options dropdown selector
  const locationOptions = Array.from(new Set(allItems.map(item => {
    const loc = item.location;
    if (loc.includes('Library')) return 'Library';
    if (loc.includes('Student Center') || loc.includes('Student Union')) return 'Student Center';
    if (loc.includes('Science') || loc.includes('Chemistry')) return 'Science Building';
    if (loc.includes('Gym') || loc.includes('Sports')) return 'Gymnasium';
    if (loc.includes('Arts')) return 'Art Complex';
    return null;
  }).filter(Boolean))) as string[];

  // Statistics counters numbers
  const statsList = [
    { title: 'Lost Items', value: 142, suffix: '', labelColor: 'text-rose-400', glow: 'rgba(244,63,94,0.15)' },
    { title: 'Found Items', value: 285, suffix: '', labelColor: 'text-emerald-400', glow: 'rgba(16,185,129,0.15)' },
    { title: 'Returned', value: 95, suffix: '%', labelColor: 'text-indigo-400', glow: 'rgba(99,102,241,0.15)' },
    { title: 'Active Reports', value: 34, suffix: '', labelColor: 'text-amber-400', glow: 'rgba(245,158,11,0.15)' }
  ];

  // Campus building coordinates for vector map
  const mapHotspots = [
    { name: 'Library 2nd Floor', x: 130, y: 150, category: 'Electronics', itemRef: 'mock-2' },
    { name: 'Student Center Cafeteria', x: 260, y: 190, category: 'Wallets', itemRef: 'mock-1' },
    { name: 'Science Hall 302', x: 190, y: 80, category: 'Bags', itemRef: 'mock-3' },
    { name: 'Gym Entrance', x: 70, y: 240, category: 'Documents', itemRef: 'mock-4' },
    { name: 'Parking Lot B', x: 340, y: 100, category: 'Keys', itemRef: 'mock-5' }
  ];

  return (
    <div className="space-y-10 relative pb-16">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-99999 px-5 py-3 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-indigo-300 font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs sm:text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Parallax / Glowing background blobs */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none animate-blob-1 z-0"></div>
      <div className="absolute bottom-20 right-20 w-[450px] h-[450px] bg-pink-500/5 rounded-full blur-[160px] pointer-events-none animate-blob-2 z-0"></div>

      {/* ── HERO SECTION ── */}
      <section className="relative glass-panel rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-955">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-6 max-w-2xl text-center lg:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>PORTAL UPDATED</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            Lost & Found <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Portal</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            Centralized intelligent hub to recover missing essentials. Browse reported catalog items, pin locations on map trackers, or list found objects with secure checks.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/report?status=lost"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 shadow-lg shadow-indigo-500/25 transition-all text-xs sm:text-sm font-bold flex items-center gap-2 text-white hover-glow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/report?status=found"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/5 shadow text-xs sm:text-sm font-bold flex items-center gap-2 text-slate-200 transition-all hover-glow"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Report Found Item</span>
            </Link>
          </div>
        </div>

        {/* Animated illustration of floating objects */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center z-10 overflow-visible">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl filter animate-pulse"></div>
          
          {/* Central Radar Ring */}
          <div className="absolute w-44 h-44 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute w-28 h-28 rounded-full border border-purple-500/30 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
            <Search className="w-10 h-10 text-indigo-400 animate-float" />
          </div>

          {/* Floating object SVGs / Lucide items */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 left-6 p-3 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-white/10 shadow-md text-pink-400"
          >
            <Key className="w-6 h-6" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-10 right-6 p-3 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-white/10 shadow-md text-amber-400"
          >
            <Wallet className="w-6 h-6" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            className="absolute bottom-12 left-10 p-3 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-white/10 shadow-md text-cyan-400"
          >
            <Smartphone className="w-6 h-6" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
            className="absolute bottom-6 right-12 p-3 rounded-2xl bg-slate-800/50 backdrop-blur-xs border border-white/10 shadow-md text-purple-400"
          >
            <Backpack className="w-6 h-6" />
          </motion.div>
        </div>
      </section>

      {/* ── STATISTICS SECTION ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 z-10 relative">
        {statsList.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover-glow"
            style={{ 
              background: `radial-gradient(circle at 10% 10%, ${stat.labelColor}05 0%, rgba(15,23,42,0.85) 100%)` 
            }}
          >
            <div className="text-slate-400 text-xs sm:text-sm font-semibold mb-2">{stat.title}</div>
            <div className="flex items-baseline gap-1">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" 
                style={{ width: `${Math.min(stat.value / 3, 100)}%` }}
              />
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── HORIZONTAL FEATURED FOUND CAROUSEL ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Featured Found Items</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scrollCarousel('left')}
              className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel list wrapper */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-2 px-1"
        >
          {allItems.filter(i => i.status === 'Found').slice(0, 8).map((item, idx) => (
            <div 
              key={item.id || idx}
              onClick={() => setSelectedItemModal(item)}
              className="flex-shrink-0 w-72 glass-card rounded-2xl overflow-hidden snap-start cursor-pointer hover:border-indigo-500/40 hover-glow transition-all"
            >
              <div className="h-36 w-full relative">
                <CategoryImageFallback category={item.category} />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[9px] font-black tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase select-none">
                  {item.status}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-extrabold text-sm text-slate-100 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Split section: Filter / Grid grid & Interactive widgets */}
      <div className="flex flex-col lg:flex-row gap-8 relative">

        {/* ── MAIN SEARCH / GRID PANEL ── */}
        <div className="flex-1 space-y-6">

          {/* Search bar & Live dropdown filters */}
          <div className="space-y-4 glass-panel rounded-2xl p-5 sm:p-6 border border-white/5">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by wallet, airpods, keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            {/* Dropdown Filters row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Category selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs bg-slate-950/40 border border-slate-850 rounded-lg p-2 focus:outline-none focus:border-indigo-500 text-slate-300"
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Wallets">Wallets</option>
                  <option value="Keys">Keys</option>
                  <option value="Bags">Bags</option>
                  <option value="Documents">Documents</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Status selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs bg-slate-950/40 border border-slate-850 rounded-lg p-2 focus:outline-none focus:border-indigo-500 text-slate-300"
                >
                  <option value="All">All Statuses</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
              </div>

              {/* Location Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-xs bg-slate-950/40 border border-slate-850 rounded-lg p-2 focus:outline-none focus:border-indigo-500 text-slate-300"
                >
                  <option value="All">All Locations</option>
                  {locationOptions.map((loc, i) => (
                    <option key={i} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Date Reported</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs bg-slate-950/40 border border-slate-850 rounded-lg p-2 focus:outline-none focus:border-indigo-500 text-slate-300"
                >
                  <option value="All">Any Time</option>
                  <option value="Today">Last 24 Hours</option>
                  <option value="Week">Last 7 Days</option>
                  <option value="Month">Last 30 Days</option>
                </select>
              </div>

            </div>

            {/* Category Chips Horizontal view */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
              {['All', 'Electronics', 'Wallets', 'Keys', 'Bags', 'Documents', 'Clothing', 'Accessories', 'Others'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/25' 
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Dynamic Grid list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Item Inventory ({filteredItems.length})</h3>
              {filteredItems.length === 0 && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                    setSelectedLocation('All');
                    setSelectedDate('All');
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-800/10 border border-white/5" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="glass-panel rounded-2xl p-16 text-center text-slate-500 border border-dashed border-white/5 bg-slate-900/20">
                <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-base font-semibold">No items match your selected filters.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting parameters or search input query.</p>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setSelectedItemModal(item)}
                      className="glass-card rounded-2xl flex flex-col overflow-hidden group cursor-pointer hover:border-indigo-500/40 hover-glow"
                    >
                      {/* Image fallbacks */}
                      <div className="h-44 w-full bg-slate-950/40 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                        {item.image_file ? (
                          <img 
                            src={`/static/uploads/${item.image_file}`} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <CategoryImageFallback category={item.category} />
                        )}

                        {/* Status tag badge */}
                        <span className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md select-none border ${
                          item.status === 'Lost' 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {item.status}
                        </span>

                        {/* Hover elements overlay */}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          {/* Bookmark */}
                          <button
                            onClick={(e) => toggleBookmark(item.id, e)}
                            className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(item.id) ? 'fill-indigo-500 text-indigo-400' : ''}`} />
                          </button>
                          {/* Share */}
                          <button
                            onClick={(e) => handleShareItem(item, e)}
                            className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Card Content details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-extrabold text-base text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-slate-500 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedItemModal(item)}
                          className="w-full py-2.5 rounded-xl bg-slate-900/40 hover:bg-indigo-600 border border-white/5 hover:border-indigo-500 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>

        {/* ── RIGHT PANEL WIDGETS ── */}
        <aside className="w-full lg:w-80 space-y-8">
          
          {/* Interactive SVG Campus Map */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 bg-slate-950/40">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-400" />
              <h4 className="font-bold text-sm text-white">Campus Location Map</h4>
            </div>
            
            {/* Campus SVG layout Map tracker container */}
            <div className="w-full h-64 rounded-xl border border-slate-900 bg-slate-950 relative overflow-hidden flex items-center justify-center">
              
              {/* Styled SVG layout map grid */}
              <svg className="w-full h-full text-slate-900/60" viewBox="0 0 400 300">
                {/* Grass / Park areas */}
                <rect x="20" y="20" width="360" height="260" rx="14" fill="#0f172a" />
                <path d="M 120 80 Q 200 130 280 80 T 360 80" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="80" strokeLinecap="round" />
                
                {/* Campus Paths / Roads */}
                <path d="M 50 150 L 350 150 L 200 50 L 200 250" stroke="rgba(255,255,255,0.025)" strokeWidth="12" strokeLinecap="round" />
                
                {/* Buildings landmarks */}
                <rect x="90" y="120" width="60" height="50" rx="8" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" />
                <text x="120" y="148" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold" textAnchor="middle">Library</text>

                <rect x="220" y="160" width="70" height="50" rx="8" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.2)" strokeWidth="1.5" />
                <text x="255" y="188" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold" textAnchor="middle">Cafeteria</text>

                <rect x="160" y="50" width="60" height="40" rx="8" fill="rgba(236,72,153,0.08)" stroke="rgba(236,72,153,0.2)" strokeWidth="1.5" />
                <text x="190" y="74" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold" textAnchor="middle">Science</text>

                <rect x="40" y="210" width="60" height="50" rx="8" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" />
                <text x="70" y="238" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold" textAnchor="middle">Gym</text>

                <rect x="310" y="70" width="60" height="50" rx="8" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.2)" strokeWidth="1.5" />
                <text x="340" y="98" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold" textAnchor="middle">Parking</text>
              </svg>

              {/* Pulsing Hotspot pins */}
              {mapHotspots.map((pin, index) => {
                const target = mockItems.find(m => m.id === pin.itemRef);
                const isHovered = hoveredMapPin?.id === pin.itemRef;
                const isActive = activeMapPin?.id === pin.itemRef;

                return (
                  <div 
                    key={index}
                    style={{ position: 'absolute', left: `${pin.x}px`, top: `${pin.y}px` }}
                    className="group"
                    onMouseEnter={() => target && setHoveredMapPin(target)}
                    onMouseLeave={() => setHoveredMapPin(null)}
                    onClick={() => target && setActiveMapPin(isActive ? null : target)}
                  >
                    {/* Animated Outer Pulse */}
                    <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-indigo-500/35 animate-pin-pulse" />
                    
                    {/* Pin Center Marker */}
                    <div className={`w-3.5 h-3.5 rounded-full border border-white cursor-pointer relative z-10 transition-colors shadow-md ${
                      isActive ? 'bg-pink-500' : 'bg-indigo-500 hover:bg-purple-500'
                    }`}>
                      <div className="absolute inset-1.5 rounded-full bg-white animate-pulse" />
                    </div>

                    {/* Pin Tooltip Card overlay on hover */}
                    {target && (isHovered || isActive) && (
                      <div 
                        style={{ transform: 'translate(-50%, -108%)' }}
                        className="absolute left-1.5 top-0 w-44 z-50 glass-panel rounded-xl p-3 border border-indigo-500/30 text-xs shadow-2xl bg-slate-950/95"
                      >
                        <div className="font-extrabold text-white truncate">{target.title}</div>
                        <div className="text-[10px] text-indigo-400 font-semibold mb-1 truncate">{target.location}</div>
                        <div className="text-[9px] text-slate-500 flex items-center justify-between">
                          <span>{target.category}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            target.status === 'Lost' ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'
                          }`}>{target.status}</span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 text-center">Hover over custom markers to reveal reported items details.</p>
          </div>

          {/* Recent Activity Timeline panel */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 bg-slate-955/40">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Clock className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-sm text-white">Recent Activity Timeline</h4>
            </div>

            {/* Vertical Timeline entries */}
            <div className="relative pl-6 space-y-6">
              
              {/* Vertical border timeline bar line */}
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-slate-800/80" />
              
              {[
                { text: 'Wallet found near Cafeteria', date: '10 mins ago', type: 'found', dot: 'bg-emerald-500' },
                { text: 'Phone claimed successfully', date: '1 hr ago', type: 'returned', dot: 'bg-indigo-500' },
                { text: 'Keys reported lost near Parking', date: '3 hrs ago', type: 'lost', dot: 'bg-rose-500' },
                { text: 'Backpack returned by Alex', date: 'Yesterday', type: 'found', dot: 'bg-emerald-500' },
                { text: 'ID card matched with Sarah', date: '2 days ago', type: 'matched', dot: 'bg-purple-500' }
              ].map((act, idx) => (
                <div key={idx} className="relative text-xs space-y-1">
                  
                  {/* Timeline Node Dot */}
                  <div className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border border-slate-955 ring-2 ring-slate-850 ${act.dot}`} />
                  
                  <div className="font-semibold text-slate-200">{act.text}</div>
                  <div className="text-[9px] text-slate-500 font-medium">{act.date}</div>
                </div>
              ))}

            </div>
          </div>

        </aside>

      </div>

      {/* ── EXPANDABLE QUICK ACTIONS FAB PANEL ── */}
      <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end gap-3">
        
        {/* Unfolded cluster sub-buttons */}
        <AnimatePresence>
          {fabOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              className="flex flex-col gap-3 items-end"
            >
              {[
                { icon: Plus, label: 'Report Lost', path: '/report?status=lost', color: 'bg-rose-600 hover:bg-rose-500' },
                { icon: CheckCircle2, label: 'Report Found', path: '/report?status=found', color: 'bg-emerald-600 hover:bg-emerald-500' },
                { icon: QrCode, label: 'Scan QR Code', action: () => triggerToast('QR Scanner module opened!'), color: 'bg-indigo-600 hover:bg-indigo-500' },
                { icon: PhoneCall, label: 'Contact Admin', path: '/contact', color: 'bg-purple-600 hover:bg-purple-500' },
                { icon: HelpCircle, label: 'Help Center', action: () => triggerToast('Redirecting to Help Center...'), color: 'bg-cyan-600 hover:bg-cyan-500' }
              ].map((btn, idx) => (
                <div key={idx} className="flex items-center gap-2 group cursor-pointer">
                  {/* Tooltip Label */}
                  <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-200 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                    {btn.label}
                  </span>
                  
                  {/* Button Circular Icon */}
                  {btn.path ? (
                    <Link
                      to={btn.path}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 ${btn.color}`}
                    >
                      <btn.icon className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={btn.action}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 ${btn.color}`}
                    >
                      <btn.icon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master FAB Trigger Button */}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer ${
            fabOpen ? 'bg-slate-800 rotate-45 border border-white/10' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 hover:scale-105'
          }`}
        >
          <Plus className="w-6 h-6" />
        </button>

      </div>

      {/* ── VIEW DETAILS GLASSMORPHISM MODAL ── */}
      <AnimatePresence>
        {selectedItemModal && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center px-4">
            
            {/* Dark blur background backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemModal(null)}
              className="absolute inset-0 bg-slate-955/80 backdrop-blur-sm"
            />

            {/* Glassmorphic detailed dialog modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-white/15 relative z-10 bg-slate-900/95"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedItemModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/40 text-slate-400 hover:text-white border border-white/5 cursor-pointer z-50"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Graphic Category Header */}
              <div className="h-48 w-full relative border-b border-white/10">
                {selectedItemModal.image_file ? (
                  <img 
                    src={`/static/uploads/${selectedItemModal.image_file}`} 
                    alt={selectedItemModal.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CategoryImageFallback category={selectedItemModal.category} />
                )}

                {/* Status tag */}
                <span className={`absolute top-4 left-4 px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full shadow-lg border ${
                  selectedItemModal.status === 'Lost' 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {selectedItemModal.status}
                </span>
              </div>

              {/* Detailed Content body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">{selectedItemModal.title}</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5 text-[10px] font-bold text-indigo-400">
                      {selectedItemModal.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5 text-[10px] font-bold text-purple-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedItemModal.location}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Item Description</h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 border border-white/5 p-4 rounded-xl">
                    {selectedItemModal.description}
                  </p>
                </div>

                {/* Date & reporter meta row */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/30 p-4 rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold block uppercase text-[9px] tracking-wider">Reported Date</span>
                    <span className="text-slate-200 font-bold">{formatDate(selectedItemModal.date)}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold block uppercase text-[9px] tracking-wider">Reporter Email</span>
                    <span className="text-slate-200 font-bold truncate block">{selectedItemModal.reporter_email}</span>
                  </div>
                </div>

                {/* Claim verification security query if applicable */}
                {selectedItemModal.security_question && (
                  <div className="space-y-2 text-xs bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
                    <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Security Verification Quest</span>
                    </div>
                    <p className="text-slate-300">{selectedItemModal.security_question}</p>
                  </div>
                )}

                {/* Modal actions */}
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => {
                      setSelectedItemModal(null);
                      triggerToast('Claim request details generated. Check inbox.');
                    }}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-sm hover:brightness-110 shadow-lg shadow-indigo-500/25 transition-all text-center hover-glow"
                  >
                    Claim & Recover Item
                  </button>
                  <button
                    onClick={(e) => toggleBookmark(selectedItemModal.id, e)}
                    className="px-4 rounded-2xl bg-slate-955/50 hover:bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white transition-colors"
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarkedIds.includes(selectedItemModal.id) ? 'fill-indigo-500 text-indigo-400' : ''}`} />
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
