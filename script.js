/**
 * script.js
 * Core engine for Udayan Website & Secure Transactions Console.
 * Manages Light/Dark themes, on-site authentications, role permissions,
 * subscription ledger billing, event participant rosters, and forms queue audits.
 */

// --- GLOBAL SHARE KEYS ---
const STORAGE_KEYS = {
  PERSONS: 'social_org_db_persons',
  EVENTS: 'social_org_db_events',
  DEPARTMENTS: 'social_org_db_departments',
  USERS: 'social_org_users_database',
  SESSION: 'social_org_auth_session'
};

// --- DEFAULT SYSTEM DATABASE FALLBACKS (If not pre-seeded by app) ---
const DEFAULT_USERS_DB = {
  admin: { username: 'admin', password: 'admin123', name: 'System Admin', role: 'Admin' },
  teacher: { username: 'teacher', password: 'teacher123', name: 'Teacher Rep', role: 'Teacher' },
  student: { username: 'student', password: 'student123', name: 'Student Rep', role: 'Student' },
  member: { username: 'member', password: 'member123', name: 'General Member', role: 'Member' }
};

const SEED_DEPARTMENTS = [
  {
    id: 'cultural-art-school',
    name: 'Art School',
    category: 'Cultural',
    icon: '🎨',
    about: 'Nurturing creative minds since 2012. Our Art School offers professional guidance in drawing, classical watercolors, clay sculpting, and oil painting for students of all age groups.',
    timings: 'Saturdays & Sundays, 10:00 AM - 12:30 PM',
    admissionFees: '₹500',
    monthlyFees: '₹250',
    poc: { name: 'Arundhati Sen', role: 'Teacher', phone: '9876543210' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=80', title: 'Watercolor Class' },
      { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80', title: 'Creative Painting' },
      { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80', title: 'Art Exhibition' }
    ]
  },
  {
    id: 'cultural-recitation',
    name: 'Recitation',
    category: 'Cultural',
    icon: '🗣️',
    about: 'Unlocking the power of spoken word. Dedicated to the fine art of voice modulation, emotional expression, poetry reading, and elocution training.',
    timings: 'Wednesdays, 5:30 PM - 7:00 PM',
    admissionFees: '₹300',
    monthlyFees: '₹150',
    poc: { name: 'Arundhati Sen', role: 'Teacher', phone: '9876543210' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80', title: 'Stage Mic' },
      { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', title: 'Poetry Books' },
      { url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=400&q=80', title: 'Vocal Performance' }
    ]
  },
  {
    id: 'cultural-ghungur',
    name: 'Ghungur',
    category: 'Cultural',
    icon: '💃',
    about: 'Reviving classical heritage. Ghungur Dance Academy specializes in Kathak, Bharatnatyam, and creative folk dance forms, preparing students for annual cultural events.',
    timings: 'Fridays, 4:30 PM - 6:30 PM & Sundays, 8:00 AM - 10:00 AM',
    admissionFees: '₹600',
    monthlyFees: '₹300',
    poc: { name: 'Keya Das', role: 'Student Coordinator', phone: '9883012345' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1615592389070-bbe97aa8c5a1?auto=format&fit=crop&w=400&q=80', title: 'Classical Dance' },
      { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80', title: 'Ghungroo Bells' },
      { url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=400&q=80', title: 'Dance Rehearsal' }
    ]
  },
  {
    id: 'library',
    name: 'Library',
    category: 'Library',
    icon: '📚',
    about: "A sanctuary for knowledge seekers. Over 10,000 volumes covering classical literature, history, reference archives, children's corner, and free daily newspapers.",
    timings: 'Daily (except Thursdays), 4:00 PM - 8:00 PM',
    admissionFees: '₹200 (Refundable Deposit)',
    monthlyFees: '₹50',
    poc: { name: 'Subrata Dey', role: 'Member Rep', phone: '9830098300' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80', title: 'Library Shelves' },
      { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80', title: 'Old Books collection' },
      { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80', title: 'Quiet Reading Room' }
    ]
  },
  {
    id: 'sports-mohila-yogasana',
    name: 'Mohila Yogasana',
    category: 'Sports',
    icon: '🧘‍♀️',
    about: 'Empowering women through wellness. Focused yogic postures, flexibility training, strengthening, and stress relief exercises specifically curated for women.',
    timings: 'Mondays & Thursdays, 7:00 AM - 8:30 AM',
    admissionFees: '₹400',
    monthlyFees: '₹200',
    poc: { name: 'Sulata Ghosh', role: 'Member Coordinator', phone: '9433123456' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80', title: 'Outdoor Asanas' },
      { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80', title: 'Meditation Circle' },
      { url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80', title: 'Peaceful Mindset' }
    ]
  },
  {
    id: 'sports-pranayam',
    name: 'Pranayam',
    category: 'Sports',
    icon: '💨',
    about: 'Mastering the life force. Scientific breathing exercises (Anulom-Vilom, Kapalbhati, Bhastrika) to boost immunity, expand lung capacity, and improve mental focus.',
    timings: 'Tuesdays & Saturdays, 6:00 AM - 7:30 AM',
    admissionFees: '₹300',
    monthlyFees: '₹150',
    poc: { name: 'Subrata Dey', role: 'Member Rep', phone: '9830098300' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80', title: 'Morning Breathing' },
      { url: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=400&q=80', title: 'Sunrise Meditation' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80', title: 'Nature Connection' }
    ]
  },
  {
    id: 'sports-park',
    name: 'Park',
    category: 'Sports',
    icon: '🌳',
    about: "Connecting with green spaces. A beautiful community park featuring children's play equipment, safe jogging tracks, open-air PT facilities, and seasonal flower gardens.",
    timings: 'Open Daily, 5:00 AM - 10:00 AM & 4:00 PM - 8:00 PM',
    admissionFees: 'Free for members',
    monthlyFees: 'Free',
    poc: { name: 'Rohan Banerjee', role: 'Sports Coordinator', phone: '8017001234' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=400&q=80', title: 'Green Park Pathways' },
      { url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=400&q=80', title: 'Children Play Area' },
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80', title: 'Fitness Walks' }
    ]
  },
  {
    id: 'social-service-dispensary',
    name: 'Dispensary',
    category: 'Social Service',
    icon: '🏥',
    about: 'Healing hands for the community. Offering daily doctor consultations, vital medical diagnostics, and distribution of generic drugs at subsidized rates to citizens in need.',
    timings: 'Daily (except Sundays), 9:00 AM - 12:00 PM & 5:00 PM - 7:00 PM',
    admissionFees: '₹20 (Registration card)',
    monthlyFees: '₹0 (Consultations Free)',
    poc: { name: 'Bimal Krishna Roy', role: 'Volunteer Head', phone: '9163012345' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80', title: 'Community Dispensary' },
      { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80', title: 'Medical Checkup' },
      { url: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3c72?auto=format&fit=crop&w=400&q=80', title: 'Subsidized Pharmacy' }
    ]
  },
  {
    id: 'social-service-others',
    name: 'Others Service',
    category: 'Social Service',
    icon: '🤝',
    about: 'Serving beyond boundaries. Coordinating blanket drives, free clothing distribution, local blood donation camps, relief efforts during crises, and environment cleanups.',
    timings: 'As per planned activities & emergency drives',
    admissionFees: 'Free to participate',
    monthlyFees: 'None',
    poc: { name: 'Bimal Krishna Roy', role: 'Volunteer Head', phone: '9163012345' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80', title: 'Volunteer Group' },
      { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80', title: 'Food Distribution' },
      { url: 'https://images.unsplash.com/photo-1578351612726-994df7e7cf50?auto=format&fit=crop&w=400&q=80', title: 'Warm Blanket Drives' }
    ]
  }
];

const SEED_PERSONS = [
  {
    id: 'p-1',
    name: 'Arundhati Sen',
    category: 'Teacher',
    phone: '9876543210',
    email: 'arundhati.sen@gmail.com',
    departments: ['cultural-art-school', 'cultural-recitation'],
    subscriptionClearedUpto: '2026-08',
    lastSubPaidOn: '2026-05-12',
    lastSubBillNo: 'BILL-2026-101'
  },
  {
    id: 'p-2',
    name: 'Subrata Dey',
    category: 'Member',
    phone: '9830098300',
    email: 'subrata.dey@example.com',
    departments: ['sports-pranayam', 'social-service-dispensary'],
    subscriptionClearedUpto: '2026-04',
    lastSubPaidOn: '2026-04-05',
    lastSubBillNo: 'BILL-2026-095'
  },
  {
    id: 'p-3',
    name: 'Sulata Ghosh',
    category: 'Member',
    phone: '9433123456',
    email: 'sulata.ghosh@outlook.com',
    departments: ['sports-mohila-yogasana', 'sports-pranayam', 'social-service-dispensary'],
    subscriptionClearedUpto: '2026-06',
    lastSubPaidOn: '2026-05-20',
    lastSubBillNo: 'BILL-2026-112'
  },
  {
    id: 'p-4',
    name: 'Rohan Banerjee',
    category: 'Student',
    phone: '8017001234',
    email: 'rohan.b@gmail.com',
    departments: ['cultural-art-school', 'sports-park'],
    subscriptionClearedUpto: '2026-03',
    lastSubPaidOn: '2026-03-01',
    lastSubBillNo: 'BILL-2026-084'
  },
  {
    id: 'p-5',
    name: 'Keya Das',
    category: 'Student',
    phone: '9883012345',
    email: 'keyadas@hotmail.com',
    departments: ['cultural-ghungur'],
    subscriptionClearedUpto: '2026-07',
    lastSubPaidOn: '2026-05-15',
    lastSubBillNo: 'BILL-2026-105'
  },
  {
    id: 'p-6',
    name: 'Bimal Krishna Roy',
    category: 'Well Wishers',
    phone: '9163012345',
    email: 'bimalroy@gmail.com',
    departments: ['social-service-dispensary'],
    subscriptionClearedUpto: '2026-05',
    lastSubPaidOn: '2026-05-02',
    lastSubBillNo: 'BILL-2026-098'
  }
];

const SEED_EVENTS = [
  {
    id: 'e-1',
    title: 'Yoga & Pranayam Morning Session',
    date: '2026-05-28',
    location: 'Park Complex, Udayan',
    description: 'Early morning wellness camp focusing on basic breathing patterns, Pranayam, and beginner yogasanas for senior citizens.',
    participants: ['p-2', 'p-3']
  },
  {
    id: 'e-2',
    title: 'Free Health Screening Clinic',
    date: '2026-06-05',
    location: 'Dispensary Main Hall',
    description: 'Our monthly general medical checkup day in the dispensary. Providing free consultations, blood sugar tests, and basic medications.',
    participants: ['p-2', 'p-3', 'p-6']
  },
  {
    id: 'e-3',
    title: 'Annual Rabindra Jayanti Celebrations',
    date: '2026-06-15',
    location: 'Community Auditorium, Lake Road',
    description: 'Rabindrasangeet recitations, classical dance pieces, and art exhibition showcasing sketches drawn by our art school students.',
    participants: ['p-1', 'p-4', 'p-5']
  }
];

const SEED_INQUIRIES = [
  {
    id: 'inq-1',
    name: 'Rahul Sen',
    email: 'rahul.sen@yahoo.com',
    type: 'Inquiry',
    subject: 'Drawing batch timings',
    details: 'Could you please confirm if there are any drawing classes available for children on weekdays after school hours?',
    submittedAt: '2026-05-29T11:20:00Z',
    status: 'pending'
  },
  {
    id: 'inq-2',
    name: 'Priya Roy',
    phone: '9830598305',
    email: 'priyaroy@outlook.com',
    type: 'Join Application',
    wingName: 'Dispensary',
    details: 'Interested to enroll as volunteer nurse. I hold a completed paramedical certificate and am free on weekends.',
    submittedAt: '2026-05-29T14:45:00Z',
    status: 'pending'
  }
];

// --- ACTIVE STATE CACHES ---
let activeUserSession = null;
let databasePersons = [];
let databaseEvents = [];
let currentSelectedEventId = null;

// --- INITIALIZE BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initStickyHeader();
  initMobileMenu();
  initDatabaseState();
  
  // Render local storage database stats immediately as pre-render
  updateHeroStatistics();
  updateHeroEventCard();
  updateCommitteesList();
  
  // Initialize secure cloud connection and trigger landing sync
  initCloudDatabase();
  await syncCloudDataOnLanding();
  
  initDonationWidget();
  initFormsHandler();
  initModalCloseTriggers();
  initLightboxTriggers();
  initAuthTriggers();
});

// --- LIGHT/DARK THEME persistence ---
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('udayan-theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('udayan-theme', newTheme);
    updateThemeIcon(newTheme);
    showToast('Theme Updated', `Switched to ${newTheme} mode.`, 'success');
  });
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// --- STICKY NAV scroll ---
function initStickyHeader() {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// --- MOBILE MENU HAMBURGER ---
function initMobileMenu() {
  const hamburger = document.getElementById('mobile-hamburger');
  const navMenuBar = document.getElementById('nav-menu-bar');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenuBar.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenuBar.classList.remove('active');
    });
  });
}

// --- LOCAL DATA SEED SYNCHRONIZER ---
function initDatabaseState() {
  // 1. Core Users DB
  let users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS_DB));
  }

  // 2. Members DB
  let storedPersons = localStorage.getItem(STORAGE_KEYS.PERSONS);
  if (!storedPersons) {
    localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(SEED_PERSONS));
    databasePersons = SEED_PERSONS;
  } else {
    try {
      databasePersons = JSON.parse(storedPersons);
    } catch (e) {
      databasePersons = SEED_PERSONS;
    }
  }

  // 3. Events DB
  let storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!storedEvents) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
    databaseEvents = SEED_EVENTS;
  } else {
    try {
      databaseEvents = JSON.parse(storedEvents);
    } catch (e) {
      databaseEvents = SEED_EVENTS;
    }
  }

  // 4. Inquiries Log Queue
  let storedInq = localStorage.getItem('udayan_submitted_enquiries');
  if (!storedInq) {
    localStorage.setItem('udayan_submitted_enquiries', JSON.stringify(SEED_INQUIRIES));
  }

  // 5. Departments DB
  let storedDepts = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
  if (!storedDepts) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(SEED_DEPARTMENTS));
  }
}

// --- WINGS DYNAMIC DISPLAY ---
function syncAndRenderWings() {
  const deptsGrid = document.getElementById('depts-list-grid');
  if (!deptsGrid) return;

  let departments = [];
  try {
    const rawData = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    if (rawData) {
      departments = JSON.parse(rawData).filter(d => d.id !== 'general');
    }
  } catch (e) {
    console.warn('Could not read departments storage.');
  }

  if (departments.length === 0) {
    departments = SEED_DEPARTMENTS;
  }

  renderFilteredWings(departments, 'all');

  const filterBtns = document.querySelectorAll('#dept-filters-wrapper .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFilteredWings(departments, btn.getAttribute('data-filter'));
    });
  });

  deptsGrid.addEventListener('click', (e) => {
    const detailsBtn = e.target.closest('.btn-view-details');
    if (detailsBtn) {
      const deptId = detailsBtn.getAttribute('data-id');
      const deptData = departments.find(d => d.id === deptId);
      if (deptData) {
        openDeptDetailsModal(deptData);
      }
    }
  });
}

function renderFilteredWings(departments, filter) {
  const deptsGrid = document.getElementById('depts-list-grid');
  deptsGrid.innerHTML = '';

  const filtered = filter === 'all' 
    ? departments 
    : departments.filter(d => d.category.toLowerCase() === filter.toLowerCase());

  if (filtered.length === 0) {
    deptsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No wings found under this category.</div>`;
    return;
  }

  filtered.forEach(dept => {
    deptsGrid.innerHTML += compileCardHtml(dept);
  });
}

function compileCardHtml(dept) {
  const defaultImg = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80';
  const mainImg = dept.gallery && dept.gallery.length > 0 ? dept.gallery[0].url : defaultImg;
  
  return `
    <div class="dept-card" data-category="${dept.category}">
      <div class="dept-card-media">
        <img src="${mainImg}" alt="${dept.name} showcase" loading="lazy">
        <div class="dept-card-overlay">${dept.icon || '🏢'}</div>
        <span class="dept-card-category">${dept.category}</span>
      </div>
      <div class="dept-card-content">
        <h3>${dept.name}</h3>
        <p>${dept.about}</p>
        <div class="dept-meta-grid">
          <div class="meta-item"><i class="fa-solid fa-clock"></i> <span>Weekly Programs</span></div>
          <div class="meta-item"><i class="fa-solid fa-indian-rupee-sign"></i> <span>Dues Setup</span></div>
        </div>
        <div class="dept-card-actions">
          <button class="btn btn-secondary btn-card-action btn-view-details" data-id="${dept.id}">
            <i class="fa-solid fa-circle-info"></i> Full Details
          </button>
          <a href="#contact" class="btn btn-primary btn-card-action" onclick="preselectWing('${dept.id}')">
            <i class="fa-solid fa-user-plus"></i> Join Wing
          </a>
        </div>
      </div>
    </div>
  `;
}

// --- EVENTS DYNAMIC COMPILER ---
function syncAndRenderEvents() {
  const eventsGrid = document.getElementById('events-list-grid');
  if (!eventsGrid) return;

  // Refresh current cache
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (raw) databaseEvents = JSON.parse(raw);
  } catch(e) {}

  const today = new Date().toISOString().split('T')[0];
  databaseEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  eventsGrid.innerHTML = '';
  databaseEvents.forEach(evt => {
    const status = evt.date < today ? 'past' : 'upcoming';
    const dateFormatted = new Date(evt.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    
    eventsGrid.innerHTML += `
      <div class="event-card ${status === 'past' ? 'past' : ''}">
        <span class="event-date-badge">
          <i class="fa-solid ${status === 'past' ? 'fa-calendar-check' : 'fa-hourglass-half'}"></i>
          ${status === 'past' ? 'Past' : 'Upcoming'} Event
        </span>
        <h3>${evt.title}</h3>
        <p>${evt.description}</p>
        <div class="event-details">
          <div class="event-details-row"><i class="fa-solid fa-calendar-day"></i> <span><strong>Date:</strong> ${dateFormatted}</span></div>
          <div class="event-details-row"><i class="fa-solid fa-map-pin"></i> <span><strong>Venue:</strong> ${evt.location || 'Lake Road Hall'}</span></div>
        </div>
        ${status !== 'past' ? `
          <button class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 0.85rem;" onclick="registerForEvent('${evt.title}')">
            <i class="fa-solid fa-signature"></i> Register to Attend
          </button>
        ` : `
          <button class="btn btn-secondary" style="width: 100%; justify-content: center; font-size: 0.85rem; cursor: not-allowed;" disabled>
            <i class="fa-solid fa-ban"></i> Event Closed
          </button>
        `}
      </div>
    `;
  });
}

// --- DETAILS Prospectus MODAL ---
function openDeptDetailsModal(dept) {
  const modalOverlay = document.getElementById('site-modal-overlay');
  const modalTitle = document.getElementById('site-modal-title');
  const modalBody = document.getElementById('site-modal-body');

  modalTitle.textContent = `${dept.icon || '🏢'} ${dept.name} - Detailed Prospectus`;
  
  let galleryHtml = '';
  if (dept.gallery && dept.gallery.length > 0) {
    galleryHtml = `
      <h4 style="margin-top:24px; margin-bottom:12px; font-size:1.05rem;"><i class="fa-solid fa-images" style="color:var(--primary);"></i> Campus Gallery</h4>
      <div class="modal-gallery">
        ${dept.gallery.map(img => `
          <div class="modal-gallery-img" onclick="zoomPhoto('${img.url}', '${img.title || dept.name}')">
            <img src="${img.url}" alt="${img.title || dept.name}" title="Click to zoom image" loading="lazy">
          </div>
        `).join('')}
      </div>
    `;
  }

  modalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div>
        <h4 style="font-size:1.05rem; margin-bottom:6px;"><i class="fa-solid fa-circle-info" style="color:var(--primary);"></i> About Department</h4>
        <p style="font-size:0.925rem; line-height:1.6;">${dept.about}</p>
      </div>

      <div style="background-color:var(--background); border:1px solid var(--border); border-radius:var(--radius-md); padding:18px; display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <h5 style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Weekly Timings</h5>
          <p style="font-size:0.9rem; font-weight:600; color:var(--text-main);"><i class="fa-regular fa-clock" style="color:var(--primary); margin-right:4px;"></i> ${dept.timings || 'Contact administration'}</p>
        </div>
        <div>
          <h5 style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Course & Enrolment Fees</h5>
          <p style="font-size:0.9rem; font-weight:600; color:var(--text-main);"><i class="fa-solid fa-indian-rupee-sign" style="color:var(--secondary); margin-right:4px;"></i> Admission: ${dept.admissionFees || 'Free'} / Monthly: ${dept.monthlyFees || 'Free'}</p>
        </div>
      </div>

      <div style="border-top:1px dashed var(--border); padding-top:16px;">
        <h4 style="font-size:1.05rem; margin-bottom:8px;"><i class="fa-solid fa-user-shield" style="color:var(--primary);"></i> Point of Contact</h4>
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
          <div>
            <p style="font-size:0.9rem; font-weight:700;">${dept.poc ? dept.poc.name : 'Subrata Dey'}</p>
            <p style="font-size:0.8rem; color:var(--text-muted);">${dept.poc ? dept.poc.role : 'President'}</p>
          </div>
          <div style="display:flex; gap:8px;">
            ${dept.poc ? `<a href="tel:${dept.poc.phone}" class="btn btn-secondary" style="font-size:0.75rem; padding:8px 12px;"><i class="fa-solid fa-phone"></i> Call Representative</a>` : ''}
            <a href="#contact" class="btn btn-primary" onclick="closeSiteModal(); preselectWing('${dept.id}')" style="font-size:0.75rem; padding:8px 12px;"><i class="fa-solid fa-user-plus"></i> Enroll Now</a>
          </div>
        </div>
      </div>

      ${galleryHtml}
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSiteModal() {
  document.getElementById('site-modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function initModalCloseTriggers() {
  const closeBtn = document.getElementById('site-modal-close');
  const overlay = document.getElementById('site-modal-overlay');
  closeBtn.addEventListener('click', closeSiteModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSiteModal(); });
}

// --- LIGHTBOX PREVIEW ---
function zoomPhoto(imgUrl, caption) {
  const lightbox = document.getElementById('site-lightbox-overlay');
  const lightboxImg = document.getElementById('site-lightbox-img');
  lightboxImg.src = imgUrl;
  lightbox.classList.add('active');
}

function closeLightbox() {
  document.getElementById('site-lightbox-overlay').classList.remove('active');
}

function initLightboxTriggers() {
  const closeBtn = document.getElementById('site-lightbox-close');
  const overlay = document.getElementById('site-lightbox-overlay');
  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
}

// --- INTERACTIVE FORMS LOGIC ---
function initFormsHandler() {
  const tabs = document.querySelectorAll('#contact-form-tabs .form-tab-btn');
  const forms = document.querySelectorAll('.interactive-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetFormId = tab.getAttribute('data-form');
      forms.forEach(form => {
        if (form.getAttribute('id') === targetFormId) {
          form.classList.add('active');
        } else {
          form.classList.remove('active');
        }
      });
    });
  });

  // Submit Contact Inquiry
  const msgForm = document.getElementById('contact-msg-form');
  msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('msg-name').value.trim();
    const email = document.getElementById('msg-email').value.trim();
    const subject = document.getElementById('msg-subject').value.trim();
    const message = document.getElementById('msg-text').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Validation Error', 'All form fields are required.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Validation Error', 'Please enter a valid email.', 'error');
      return;
    }

    // Write to shared admin ledger queue!
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      type: 'Inquiry',
      subject,
      details: message,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    saveSubmittedInquiry(newInquiry);
    showToast('Inquiry Received', `Thank you, ${name}! Your inquiry has been sent to our desk.`, 'success');
    msgForm.reset();
  });

  // Submit Join Application
  const joinForm = document.getElementById('contact-join-form');
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('join-name').value.trim();
    const phone = document.getElementById('join-phone').value.trim();
    const email = document.getElementById('join-email').value.trim();
    const wingId = document.getElementById('join-wing').value;
    const remarks = document.getElementById('join-remarks').value.trim();

    if (!name || !phone || !email || !wingId || !remarks) {
      showToast('Validation Error', 'All fields must be completed.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Validation Error', 'Enter a valid email address.', 'error');
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      showToast('Validation Error', 'Phone must be exactly 10 digits.', 'error');
      return;
    }

    const wingSelect = document.getElementById('join-wing');
    const wingName = wingSelect.options[wingSelect.selectedIndex].text;

    // Write to shared queue
    const newJoin = {
      id: `inq-${Date.now()}`,
      name,
      phone,
      email,
      type: 'Join Application',
      wingName,
      details: remarks,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    saveSubmittedInquiry(newJoin);
    showToast('Application Logged', `Welcome, ${name}! Your application has been logged.`, 'success');
    joinForm.reset();
  });
}

function saveSubmittedInquiry(inq) {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('udayan_submitted_enquiries') || '[]');
  } catch(e) {}
  list.unshift(inq);
  localStorage.setItem('udayan_submitted_enquiries', JSON.stringify(list));
  
  // Re-render inquiries if administrator is logged in
  if (activeUserSession) {
    loadEnquiriesQueue();
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
}

window.preselectWing = function(wingId) {
  document.getElementById('tab-join').click();
  const select = document.getElementById('join-wing');
  if (select) select.value = wingId;
};

window.registerForEvent = function(eventTitle) {
  window.location.hash = '#contact';
  preselectWing('general-volunteer');
  const joinRemarks = document.getElementById('join-remarks');
  if (joinRemarks) {
    joinRemarks.value = `Hi, I would like to register to attend the event: "${eventTitle}". Please confirm my seat.`;
  }
  showToast('Form Ready', 'Complete details to register for event.', 'success');
};

// --- INTERACTIVE DONATION PORTAL ---
function initDonationWidget() {
  const amountBtns = document.querySelectorAll('#donation-amount-group .amt-btn');
  const customInput = document.getElementById('donation-custom-input');
  const causeSelect = document.getElementById('donation-cause-select');
  const donateBtn = document.getElementById('btn-donate-now');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customInput.value = btn.getAttribute('data-amt');
    });
  });

  customInput.addEventListener('input', () => {
    const val = parseFloat(customInput.value);
    amountBtns.forEach(btn => {
      if (parseFloat(btn.getAttribute('data-amt')) === val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  });

  donateBtn.addEventListener('click', () => {
    const amt = parseFloat(customInput.value);
    const causeName = causeSelect.options[causeSelect.selectedIndex].text;

    if (isNaN(amt) || amt < 50) {
      showToast('Validation Error', 'Minimum donation amount is ₹50.', 'error');
      return;
    }

    openDonationReceipt(amt, causeName);
  });
}

function openDonationReceipt(amount, cause) {
  const modalOverlay = document.getElementById('site-modal-overlay');
  const modalTitle = document.getElementById('site-modal-title');
  const modalBody = document.getElementById('site-modal-body');

  const refNumber = `REF-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  modalTitle.textContent = `🎉 Contribution Acknowledged!`;
  modalBody.innerHTML = `
    <div class="receipt-wrapper">
      <div class="receipt-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h3>Thank You for Your Support!</h3>
      <p style="font-size:0.875rem; color:var(--text-muted);">Your transaction was processed successfully in demo mode.</p>
      
      <div class="receipt-amount">₹${amount.toLocaleString('en-IN')}</div>
      
      <div class="receipt-details-list">
        <div class="receipt-row">
          <span class="label">Priority Cause:</span>
          <span class="val">${cause}</span>
        </div>
        <div class="receipt-row">
          <span class="label">Reference ID:</span>
          <span class="val" style="font-family:monospace; color:var(--primary);">${refNumber}</span>
        </div>
        <div class="receipt-row">
          <span class="label">Date & Time:</span>
          <span class="val">${dateStr}</span>
        </div>
        <div class="receipt-row">
          <span class="label">Status:</span>
          <span class="val" style="color:var(--success);">Demo Secured</span>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <button class="btn btn-primary" onclick="closeSiteModal(); printReceiptMockup('${refNumber}', ${amount})" style="width:100%; justify-content:center;">
          <i class="fa-solid fa-print"></i> Download Voucher PDF
        </button>
        <button class="btn btn-secondary" onclick="closeSiteModal()" style="width:100%; justify-content:center;">
          Return to Website
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.printReceiptMockup = function(ref, amt) {
  alert(`[Demo Printer Stack]\nReceipt Reference: ${ref}\nContribution Amount: ₹${amt}\n\nYour PDF voucher receipt download completed.`);
};

// ==============================================
// AUTHENTICATION & SINGLE-SIGN-ON LOGIC
// ==============================================
function initAuthTriggers() {
  const loginBtn = document.getElementById('btn-login-trigger');
  const logoutBtn = document.getElementById('btn-logout');
  const loginModal = document.getElementById('site-login-modal-overlay');
  const loginClose = document.getElementById('site-login-modal-close');
  const loginForm = document.getElementById('on-site-login-form');
  const joinCtaLogin = document.getElementById('btn-cta-login-nav');
  const footerLogin = document.getElementById('btn-footer-login-nav');
  const footerSecured = document.getElementById('btn-footer-secured-login');

  // Modal Open/Close
  const openLogin = (e) => {
    if (e) e.preventDefault();
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeLogin = () => {
    loginModal.classList.remove('active');
    document.body.style.overflow = '';
    loginForm.reset();
  };

  loginBtn.addEventListener('click', openLogin);
  if (joinCtaLogin) joinCtaLogin.addEventListener('click', openLogin);
  if (footerLogin) footerLogin.addEventListener('click', openLogin);
  if (footerSecured) footerSecured.addEventListener('click', openLogin);
  loginClose.addEventListener('click', closeLogin);

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLogin();
  });

  // Log in form submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userVal = document.getElementById('login-username').value.trim();
    const passVal = document.getElementById('login-password').value.trim();
    const rememberMe = document.getElementById('login-remember').checked;

    if (!userVal || !passVal) {
      showToast('Log In Failed', 'Please supply both username and password.', 'error');
      return;
    }

    try {
      const usersDb = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
      const normalized = userVal.toLowerCase();
      const matched = usersDb[normalized];

      if (matched && matched.password === passVal) {
        const session = {
          username: matched.username,
          name: matched.name,
          role: matched.role,
          loggedInAt: new Date().toISOString()
        };

        // Write shared single sign-on authentication key!
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        localStorage.setItem(`${STORAGE_KEYS.SESSION}_remember`, rememberMe ? 'true' : 'false');

        closeLogin();
        evaluateSessionState();
        showToast('Login Successful', `Welcome back, ${matched.name}!`, 'success');
        
        // Smooth scroll to Console panel
        setTimeout(() => {
          document.getElementById('transactions-console').scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        showToast('Authentication Error', 'Invalid username or password credentials.', 'error');
      }
    } catch(err) {
      showToast('System Error', 'Database parsing error: ' + err.message, 'error');
    }
  });

  // Log out action
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(`${STORAGE_KEYS.SESSION}_remember`);
    
    evaluateSessionState();
    showToast('Logged Out', 'You have been signed out of Udayan.', 'success');
  });

  // Run initial state checks
  evaluateSessionState();
}

function evaluateSessionState() {
  const remember = localStorage.getItem(`${STORAGE_KEYS.SESSION}_remember`) === 'true';
  const storage = remember ? localStorage : sessionStorage;
  const rawSession = storage.getItem(STORAGE_KEYS.SESSION);

  const loginBtn = document.getElementById('btn-login-trigger');
  const profileBox = document.getElementById('profile-info-nav');
  const profileUser = document.getElementById('profile-user-display');
  const profileRole = document.getElementById('profile-role-display');
  const consoleSection = document.getElementById('transactions-console');

  if (rawSession) {
    try {
      activeUserSession = JSON.parse(rawSession);
      
      // Update Navbar States
      loginBtn.style.display = 'none';
      profileBox.style.display = 'flex';
      profileUser.textContent = activeUserSession.name;
      profileRole.textContent = activeUserSession.role;

      // Reveal Secure Transactions Dashboard Section
      consoleSection.style.display = 'block';
      const badgeEl = document.getElementById('console-role-display-badge');
      if (badgeEl) {
        badgeEl.textContent = `Role: ${activeUserSession.role}`;
      }

      // Compile and render dynamic welcome card
      renderWelcomeCard();

      // Initialize Console Hub logic
      initConsoleSystem();
    } catch(e) {
      console.error('Session evaluation error:', e);
      activeUserSession = null;
    }
  } else {
    activeUserSession = null;
    loginBtn.style.display = 'block';
    profileBox.style.display = 'none';
    consoleSection.style.display = 'none';
  }
}

// ==============================================
// ADMINISTRATIVE TRANSACTIONS SYSTEM & PERMISSIONS
// ==============================================
function initConsoleSystem() {
  const tabs = document.querySelectorAll('#console-dashboard-tabs .console-tab-btn');
  const panels = document.querySelectorAll('.console-view-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetPanelId = tab.getAttribute('data-panel');
      panels.forEach(panel => {
        if (panel.getAttribute('id') === targetPanelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // Evaluate role-based permissions layers
  const role = activeUserSession.role;

  // 1. Subscription Ledger Permission Check
  const subContent = document.getElementById('subscriptions-auth-content');
  if (role === 'Admin') {
    subContent.innerHTML = getSubscriptionDashboardHtml('full');
    loadSubscriptions(false);
    initSubscriptionBillingTriggers();
  } else if (role === 'Member' || role === 'Student') {
    // Render gorgeous Digital Membership Card
    subContent.innerHTML = renderDigitalMembershipCard(role);
  } else {
    // Restricted block for Teacher
    subContent.innerHTML = getRestrictedAccessOverlay('Subscriptions Ledger', 'Teacher accounts are restricted from accessing financial dues ledger databases.');
  }

  // 2. Event Registries Permission Check
  const eventContent = document.getElementById('events-auth-content');
  if (role === 'Admin' || role === 'Teacher') {
    eventContent.style.display = 'grid';
    loadEventRegistries(false); // Editable access
  } else if (role === 'Student') {
    eventContent.style.display = 'grid';
    loadEventRegistries(true); // Read only view (No registrations or removals allowed)
  } else {
    // Restricted block for Member
    eventContent.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.id = 'events-restricted';
    wrapper.innerHTML = getRestrictedAccessOverlay('Event Registries Roster', 'General members are restricted from accessing participant registration planners.');
    eventContent.parentNode.insertBefore(wrapper, eventContent);
    // Delete any existing restricted block first if re-rendering
    const oldBlock = document.getElementById('events-restricted-old');
    if (oldBlock) oldBlock.remove();
    wrapper.id = 'events-restricted-old';
  }

  // 3. Enquiries Inbox Permission Check
  const inquiriesContent = document.getElementById('inquiries-auth-content');
  if (role === 'Admin') {
    inquiriesContent.style.display = 'block';
    loadEnquiriesQueue();
    initInquiriesQueueControls();
  } else {
    inquiriesContent.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.id = 'inq-restricted';
    wrapper.innerHTML = getRestrictedAccessOverlay('Enrolment Inbox applications log', `${role} accounts are restricted from accessing submitted inquiries logs.`);
    inquiriesContent.parentNode.insertBefore(wrapper, inquiriesContent);
    const oldBlock = document.getElementById('inq-restricted-old');
    if (oldBlock) oldBlock.remove();
    wrapper.id = 'inq-restricted-old';
  }

  // 4. Wings Ledger Permission Check
  const wingsContent = document.getElementById('wings-auth-content');
  if (role === 'Admin' || role === 'Teacher') {
    wingsContent.style.display = 'block';
    loadWingsLedger(role);
    initWingsLedgerControls(role);
  } else {
    wingsContent.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.id = 'wings-restricted';
    wrapper.innerHTML = getRestrictedAccessOverlay('Wings & Programs Ledger database', `${role} accounts are restricted from modifying departments databases.`);
    wingsContent.parentNode.insertBefore(wrapper, wingsContent);
    const oldBlock = document.getElementById('wings-restricted-old');
    if (oldBlock) oldBlock.remove();
    wrapper.id = 'wings-restricted-old';
  }
}

function getRestrictedAccessOverlay(title, reason) {
  return `
    <div class="restricted-overlay">
      <i class="fa-solid fa-user-lock"></i>
      <h3>${title} Restricted</h3>
      <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto;">${reason}</p>
    </div>
  `;
}

function getSubscriptionDashboardHtml(mode) {
  if (mode === 'full') {
    return `
      <div class="payment-drawer-grid">
        <div>
          <div class="console-filter-bar">
            <input type="text" class="console-search-input" id="sub-ledger-search" placeholder="Search members by name...">
            <select id="sub-status-filter" class="form-control" style="width: 160px; padding: 10px;">
              <option value="all">All States</option>
              <option value="cleared">Cleared Dues</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div class="table-responsive">
            <table class="transaction-table" id="subs-table-el">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Category</th>
                  <th>Phone</th>
                  <th>Cleared Upto</th>
                  <th>Last Invoice</th>
                  <th>Dues status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="subs-table-body"></tbody>
            </table>
          </div>
        </div>
        <div class="payment-form-card">
          <h3><i class="fa-solid fa-indian-rupee-sign" style="color: var(--secondary);"></i> Record Member Payment</h3>
          <form id="record-payment-form" novalidate>
            <div class="form-group">
              <label for="payment-member-select">Select Member</label>
              <select id="payment-member-select" class="form-control" required>
                <option value="" disabled selected>Select a member...</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="payment-amount">Payment Amount (₹)</label>
                <input type="number" id="payment-amount" class="form-control" placeholder="300" required min="50">
              </div>
              <div class="form-group">
                <label for="payment-months">Extend Upto (Month)</label>
                <input type="month" id="payment-months" class="form-control" required>
              </div>
            </div>
            <div class="form-group">
              <label for="payment-bill">Invoice Reference / Bill Number</label>
              <input type="text" id="payment-bill" class="form-control" placeholder="Auto-Generated" readonly>
            </div>
            <button type="submit" class="btn btn-primary" id="btn-submit-payment" style="width: 100%; justify-content: center; padding: 12px;">
              <i class="fa-solid fa-cash-register"></i> Complete Billing Transaction
            </button>
          </form>
          <div class="activity-logs-card" style="margin-top: 24px; padding: 18px 0 0 0; border: none; box-shadow: none;">
            <h3 style="font-size: 0.95rem; border-bottom: 1px dashed var(--border); padding-bottom: 6px; margin-bottom: 12px;"><i class="fa-solid fa-clock-rotate-left"></i> Session Logs</h3>
            <ul class="activity-list" id="billing-activity-logs">
              <li style="color: var(--text-muted); font-size: 0.75rem;">No payment transactions completed in this session.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  } else {
    // Read only personalized ledger profile view
    return `
      <div>
        <h3 style="font-size: 1.1rem; margin-bottom: 12px; color: var(--primary);"><i class="fa-solid fa-user-check"></i> Your Personal Subscription Profile</h3>
        <div class="table-responsive">
          <table class="transaction-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Category</th>
                <th>Phone</th>
                <th>Dues Cleared Upto</th>
                <th>Last Billing Date</th>
                <th>Receipt Bill Reference</th>
                <th>Dues status</th>
              </tr>
            </thead>
            <tbody id="subs-table-body"></tbody>
          </table>
        </div>
      </div>
    `;
  }
}

// --- SUBSCRIPTION LEDGER TRANSACTIONS LOGIC ---
function loadSubscriptions(personalOnly = false) {
  // Sync persons cache
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PERSONS);
    if (raw) databasePersons = JSON.parse(raw);
  } catch(e) {}

  const tbody = document.getElementById('subs-table-body');
  if (!tbody) return;

  const currentYearMonth = new Date().toISOString().substring(0, 7); // e.g. "2026-05"
  
  let targetPersons = databasePersons;
  if (personalOnly) {
    // Hardcode member view filter. For student or generic user logins, let's look at Rohan Banerjee's record
    targetPersons = databasePersons.filter(p => p.name === 'Subrata Dey' || p.name === 'Sulata Ghosh');
  }

  const renderRows = (list) => {
    tbody.innerHTML = '';
    
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No members matched selection filter.</td></tr>`;
      return;
    }

    list.forEach(p => {
      const isOverdue = p.subscriptionClearedUpto < currentYearMonth;
      const statusPill = isOverdue 
        ? `<span class="status-pill status-overdue"><i class="fa-solid fa-circle-xmark"></i> Overdue</span>`
        : `<span class="status-pill status-cleared"><i class="fa-solid fa-circle-check"></i> Cleared</span>`;
      
      const actions = personalOnly 
        ? '' 
        : `<td><button class="btn btn-primary btn-pay-trigger" onclick="fillBillingForm('${p.id}')"><i class="fa-solid fa-file-invoice-dollar"></i> Bill</button></td>`;
      
      const billRef = p.lastSubBillNo ? `<span style="font-family:monospace; color:var(--primary); font-weight:600;">${p.lastSubBillNo}</span>` : 'N/A';

      tbody.innerHTML += `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td><span class="badge badge-${p.category.toLowerCase().replace(' ', '')}">${p.category}</span></td>
          <td>${p.phone}</td>
          <td>${p.subscriptionClearedUpto || 'N/A'}</td>
          <td>${p.lastSubPaidOn || 'N/A'}</td>
          <td>${billRef}</td>
          <td>${statusPill}</td>
          ${actions ? actions : ''}
        </tr>
      `;
    });
  };

  renderRows(targetPersons);

  // Set up search and status triggers if in full view
  if (!personalOnly) {
    const searchInput = document.getElementById('sub-ledger-search');
    const statusSelect = document.getElementById('sub-status-filter');
    const selectEl = document.getElementById('payment-member-select');

    // Populate the form Select dropdown
    if (selectEl) {
      selectEl.innerHTML = '<option value="" disabled selected>Select a member...</option>';
      databasePersons.forEach(p => {
        selectEl.innerHTML += `<option value="${p.id}">${p.name} (${p.category})</option>`;
      });
    }

    const runFiltering = () => {
      const query = searchInput.value.toLowerCase().trim();
      const status = statusSelect.value;

      let filtered = databasePersons.filter(p => p.name.toLowerCase().includes(query));
      
      if (status === 'cleared') {
        filtered = filtered.filter(p => p.subscriptionClearedUpto >= currentYearMonth);
      } else if (status === 'overdue') {
        filtered = filtered.filter(p => p.subscriptionClearedUpto < currentYearMonth);
      }

      renderRows(filtered);
    };

    searchInput.addEventListener('input', runFiltering);
    statusSelect.addEventListener('change', runFiltering);
  }
}

// Auto fill bill recording drawers
window.fillBillingForm = function(memberId) {
  const member = databasePersons.find(p => p.id === memberId);
  if (!member) return;

  const select = document.getElementById('payment-member-select');
  const amount = document.getElementById('payment-amount');
  const months = document.getElementById('payment-months');
  const bill = document.getElementById('payment-bill');

  select.value = memberId;
  amount.value = member.category === 'Student' ? 150 : 250;
  
  // Advance months forward based on current record
  const current = member.subscriptionClearedUpto || '2026-05';
  const parts = current.split('-');
  let nextYr = parseInt(parts[0]);
  let nextMo = parseInt(parts[1]) + 1;
  if (nextMo > 12) {
    nextMo = 1;
    nextYr++;
  }
  const formattedMo = nextMo < 10 ? `0${nextMo}` : nextMo;
  months.value = `${nextYr}-${formattedMo}`;

  // Generate Reference invoice
  bill.value = `BILL-2026-${Math.floor(100 + Math.random() * 900)}`;
  showToast('Member Selected', `Loaded profile details for ${member.name}.`, 'success');
};

function initSubscriptionBillingTriggers() {
  const form = document.getElementById('record-payment-form');
  const select = document.getElementById('payment-member-select');
  const bill = document.getElementById('payment-bill');

  // Trigger timeline seed load
  appendSessionTimelineLog();

  select.addEventListener('change', () => {
    fillBillingForm(select.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = select.value;
    const amt = parseFloat(document.getElementById('payment-amount').value);
    const dateVal = document.getElementById('payment-months').value;
    const ref = bill.value;

    if (!id || isNaN(amt) || !dateVal || !ref) {
      showToast('Transaction Failed', 'Complete payment recording parameters.', 'error');
      return;
    }

    const index = databasePersons.findIndex(p => p.id === id);
    if (index === -1) return;

    // Execute database transactions
    updatePersonRecord(id, {
      subscriptionClearedUpto: dateVal,
      lastSubPaidOn: new Date().toISOString().split('T')[0],
      lastSubBillNo: ref
    });
    
    // Update stream log list with high-fidelity vertical timeline
    appendSessionTimelineLog(`₹${amt} Received`, `${databasePersons[index].name} • Invoice: ${ref} | Cleared: ${dateVal}`, 'paid');

    loadSubscriptions(false);
    form.reset();
    showToast('Billing Complete', `Transaction logged successfully for ${databasePersons[index].name}.`, 'success');
  });
}

// --- EVENT REGISTRIES MANAGEMENT ---
function loadEventRegistries(readOnly = false) {
  // Refresh cache
  try {
    const rawEvt = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (rawEvt) databaseEvents = JSON.parse(rawEvt);
  } catch(e) {}

  const picker = document.getElementById('event-registry-picker-list');
  if (!picker) return;

  picker.innerHTML = '';
  
  if (databaseEvents.length === 0) {
    picker.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">No active events schedules.</div>`;
    return;
  }

  // Generate picker widgets
  databaseEvents.forEach(evt => {
    const count = evt.participants ? evt.participants.length : 0;
    const dateFormatted = new Date(evt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    picker.innerHTML += `
      <div class="event-picker-item ${currentSelectedEventId === evt.id ? 'active' : ''}" data-id="${evt.id}">
        <h4>${evt.title}</h4>
        <p><i class="fa-regular fa-calendar"></i> ${dateFormatted} | <i class="fa-solid fa-users"></i> ${count} Registered</p>
      </div>
    `;
  });

  // Set default selection
  if (!currentSelectedEventId && databaseEvents.length > 0) {
    currentSelectedEventId = databaseEvents[0].id;
    // Set the first item styled as active initially
    picker.querySelector('.event-picker-item').classList.add('active');
  }

  renderSelectedEventRegistry(readOnly);

  // Setup picker click events
  picker.addEventListener('click', (e) => {
    const item = e.target.closest('.event-picker-item');
    if (item) {
      picker.querySelectorAll('.event-picker-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      currentSelectedEventId = item.getAttribute('data-id');
      renderSelectedEventRegistry(readOnly);
    }
  });

  // Setup Addition form triggers if editable
  const addForm = document.getElementById('add-participant-form');
  const addContainer = document.getElementById('event-add-participant-container');
  const registrySelect = document.getElementById('event-member-select');

  if (readOnly) {
    if (addContainer) addContainer.style.display = 'none';
  } else {
    if (addContainer) addContainer.style.display = 'block';
    
    // Populate the assignment dropdown
    if (registrySelect) {
      registrySelect.innerHTML = '<option value="" disabled selected>Choose a person...</option>';
      databasePersons.forEach(p => {
        registrySelect.innerHTML += `<option value="${p.id}">${p.name} (${p.category})</option>`;
      });
    }

    // Set up unique listeners once
    if (!addForm.dataset.listener) {
      addForm.dataset.listener = 'true';
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pId = registrySelect.value;
        if (!pId || !currentSelectedEventId) return;

        const eventIndex = databaseEvents.findIndex(evt => evt.id === currentSelectedEventId);
        if (eventIndex === -1) return;

        const activeEvent = databaseEvents[eventIndex];
        if (!activeEvent.participants) activeEvent.participants = [];

        if (activeEvent.participants.includes(pId)) {
          showToast('Assignment Rejected', 'Member is already registered for this event.', 'error');
          return;
        }

        // Execute transactions
        activeEvent.participants.push(pId);
        updateEventRecord(activeEvent.id, { participants: activeEvent.participants });
        
        loadEventRegistries(false);
        showToast('Participant Assigned', 'Roster updated successfully.', 'success');
      });
    }
  }
}

function renderSelectedEventRegistry(readOnly) {
  const activeEvent = databaseEvents.find(evt => evt.id === currentSelectedEventId);
  const roster = document.getElementById('active-registry-roster');
  const title = document.getElementById('active-registry-title');
  const meta = document.getElementById('active-registry-meta');

  if (!activeEvent || !roster) return;

  title.textContent = activeEvent.title;
  const dateStr = new Date(activeEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  meta.innerHTML = `<i class="fa-regular fa-calendar"></i> ${dateStr} | <i class="fa-solid fa-location-dot"></i> ${activeEvent.location || 'Lake Road Hall'}`;

  roster.innerHTML = '';
  const list = activeEvent.participants || [];

  if (list.length === 0) {
    roster.innerHTML = `<li style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding:20px; border:1px dashed var(--border); border-radius: var(--radius-sm);">No members assigned to roster yet.</li>`;
    return;
  }

  list.forEach(pId => {
    const member = databasePersons.find(p => p.id === pId);
    if (!member) return;

    const delAction = readOnly 
      ? '' 
      : `<button class="btn-remove-participant" onclick="deRegisterMember('${pId}')" title="De-register member"><i class="fa-solid fa-trash-can"></i></button>`;

    roster.innerHTML += `
      <li class="participant-row">
        <div>
          <span class="p-name">${member.name}</span>
          <span class="p-cat badge-${member.category.toLowerCase().replace(' ', '')}">${member.category}</span>
        </div>
        ${delAction}
      </li>
    `;
  });
}

window.deRegisterMember = function(memberId) {
  if (!currentSelectedEventId) return;

  const confirmRemoval = confirm('Are you sure you want to remove this participant from the roster?');
  if (!confirmRemoval) return;

  const eventIndex = databaseEvents.findIndex(evt => evt.id === currentSelectedEventId);
  if (eventIndex === -1) return;

  const activeEvent = databaseEvents[eventIndex];
  activeEvent.participants = activeEvent.participants.filter(pId => pId !== memberId);
  
  updateEventRecord(activeEvent.id, { participants: activeEvent.participants });
  loadEventRegistries(false);
  showToast('Roster updated', 'Member removed from event registry.', 'success');
};

// --- ENROLMENT INBOX APPLICATIONS LOG ---
function loadEnquiriesQueue() {
  const container = document.getElementById('inbox-cards-container');
  const countInfo = document.getElementById('inquiries-count-info');
  if (!container) return;

  let queue = [];
  try {
    queue = JSON.parse(localStorage.getItem('udayan_submitted_enquiries') || '[]');
  } catch(e) {}

  const pendingCount = queue.filter(q => q.status === 'pending').length;
  countInfo.textContent = `${pendingCount} pending applications in queue`;

  container.innerHTML = '';
  
  if (queue.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted); border:1px dashed var(--border); border-radius: var(--radius-lg);"><i class="fa-solid fa-inbox" style="font-size:2rem; margin-bottom:12px;"></i><br>Inbox is completely clean.</div>`;
    return;
  }

  queue.forEach(item => {
    const isJoin = item.type === 'Join Application';
    const tagClass = isJoin ? 'badge-member' : 'badge-teacher';
    const dateFormatted = new Date(item.submittedAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    const bodyDetails = isJoin
      ? `<p><span class="lbl">Apply Wing:</span><strong>${item.wingName}</strong></p>
         <p><span class="lbl">Phone:</span>${item.phone}</p>
         <p><span class="lbl">Email:</span>${item.email}</p>`
      : `<p><span class="lbl">Subject:</span><strong>${item.subject}</strong></p>
         <p><span class="lbl">Email:</span>${item.email}</p>`;

    const actionBtn = item.status === 'pending'
      ? `<button class="btn btn-primary" onclick="markInquiryResolved('${item.id}')" style="font-size:0.75rem; padding:6px 12px;"><i class="fa-solid fa-check"></i> Process</button>`
      : `<span style="color:var(--success); font-size:0.8rem; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Processed</span>`;

    container.innerHTML += `
      <div class="inbox-card ${isJoin ? 'join' : ''} ${item.status === 'processed' ? 'processed' : ''}">
        <div class="inbox-card-header">
          <div>
            <span class="badge ${tagClass}" style="margin-bottom:6px; display:inline-block;">${item.type}</span>
            <h4>${item.name}</h4>
          </div>
          <span style="font-size:0.7rem; color:var(--text-muted);">${dateFormatted}</span>
        </div>
        <div class="inbox-card-body">
          ${bodyDetails}
          <p style="margin-top:10px; font-style:italic; font-size:0.8rem; background:var(--background); padding:8px; border-radius:4px; border:1px solid var(--border); color:var(--text-muted);">${item.details}</p>
        </div>
        <div class="inbox-card-actions">
          ${actionBtn}
        </div>
      </div>
    `;
  });
}

function initInquiriesQueueControls() {
  const clearBtn = document.getElementById('btn-clear-inbox');
  clearBtn.addEventListener('click', () => {
    let queue = [];
    try {
      queue = JSON.parse(localStorage.getItem('udayan_submitted_enquiries') || '[]');
    } catch(e) {}

    const remaining = queue.filter(q => q.status === 'pending');
    localStorage.setItem('udayan_submitted_enquiries', JSON.stringify(remaining));
    
    loadEnquiriesQueue();
    showToast('Inbox Cleared', 'Processed logs deleted successfully.', 'success');
  });
}

window.markInquiryResolved = function(id) {
  let queue = [];
  try {
    queue = JSON.parse(localStorage.getItem('udayan_submitted_enquiries') || '[]');
  } catch(e) {}

  const index = queue.findIndex(item => item.id === id);
  if (index !== -1) {
    queue[index].status = 'processed';
    localStorage.setItem('udayan_submitted_enquiries', JSON.stringify(queue));
    loadEnquiriesQueue();
    showToast('Record Processed', 'Application marked as resolved.', 'success');
  }
};

// --- TOAST NOTIFICATIONS BANNER ---
function showToast(title, body, type = 'success') {
  const container = document.getElementById('site-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fa-solid fa-circle-check toast-icon"></i>' 
    : '<i class="fa-solid fa-circle-exclamation toast-icon"></i>';

  toast.innerHTML = `
    ${icon}
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${body}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.3s ease reverse forwards';
    setTimeout(() => { toast.remove(); }, 300);
  }, 4000);
}

// ==============================================
// WINGS LEDGER & DYNAMIC MODIFICATIONS CONTROLLERS
// ==============================================
let currentEditGallery = [];

function loadWingsLedger(role) {
  let departments = [];
  try {
    const rawData = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    if (rawData) {
      departments = JSON.parse(rawData).filter(d => d.id !== 'general');
    }
  } catch (e) {
    console.warn('Could not read departments array.');
  }

  if (departments.length === 0) {
    departments = SEED_DEPARTMENTS;
  }

  const countInfo = document.getElementById('wings-count-info');
  countInfo.textContent = `${departments.length} active departments configured`;

  const tbody = document.getElementById('wings-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  departments.forEach(dept => {
    const fees = `Adm: ${dept.admissionFees || 'Free'} / Mon: ${dept.monthlyFees || 'Free'}`;
    const pocName = dept.poc ? dept.poc.name : 'Subrata Dey';
    const pocRole = dept.poc ? dept.poc.role : 'President';

    tbody.innerHTML += `
      <tr>
        <td style="font-size:1.5rem; text-align:center;">${dept.icon || '🏢'}</td>
        <td><strong>${dept.name}</strong></td>
        <td><span class="badge badge-student" style="background:var(--primary-light); color:var(--primary);">${dept.category}</span></td>
        <td style="max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${dept.timings}">${dept.timings || 'N/A'}</td>
        <td>${fees}</td>
        <td>
          <div style="font-size:0.85rem; font-weight:600;">${pocName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${pocRole}</div>
        </td>
        <td>
          <button class="btn btn-primary btn-pay-trigger" onclick="openEditWingDrawer('${dept.id}')" style="padding:6px 12px; font-size:0.75rem;">
            <i class="fa-solid fa-edit"></i> Edit Details
          </button>
        </td>
      </tr>
    `;
  });
}

function initWingsLedgerControls(role) {
  const addBtn = document.getElementById('btn-add-wing-trigger');
  const cancelBtn = document.getElementById('btn-wing-form-cancel');
  const form = document.getElementById('wing-action-form');
  const addPhotoBtn = document.getElementById('btn-wing-add-photo');

  // Admin role gets addition button, Teacher role gets edit-only
  if (role === 'Admin') {
    addBtn.style.display = 'inline-block';
  } else {
    addBtn.style.display = 'none';
  }

  // Open Create Drawer
  addBtn.addEventListener('click', () => {
    form.reset();
    document.getElementById('wing-action-mode').value = 'create';
    document.getElementById('wing-action-id').value = '';
    document.getElementById('wing-drawer-title').innerHTML = '<i class="fa-solid fa-square-plus"></i> Create New Department';
    
    // Hide Gallery Manager for new departments (gallery loaded on edit just like the app!)
    document.getElementById('wing-form-gallery-manager').style.display = 'none';
    document.getElementById('wing-category-form-group').style.display = 'block';

    document.getElementById('wing-action-drawer').style.display = 'block';
    document.getElementById('wing-action-drawer').scrollIntoView({ behavior: 'smooth' });
  });

  // Cancel Button
  cancelBtn.addEventListener('click', () => {
    document.getElementById('wing-action-drawer').style.display = 'none';
    form.reset();
    currentEditGallery = [];
  });

  // Add Photo trigger
  addPhotoBtn.addEventListener('click', () => {
    const url = document.getElementById('wing-new-photo-url').value.trim();
    const caption = document.getElementById('wing-new-photo-caption').value.trim() || 'Gallery Showcase';

    if (!url) {
      showToast('Validation Error', 'Please paste an Unsplash image URL.', 'error');
      return;
    }

    currentEditGallery.push({ url, title: caption });
    document.getElementById('wing-new-photo-url').value = '';
    document.getElementById('wing-new-photo-caption').value = '';

    renderEditGalleryThumbnails();
    showToast('Photo Cached', 'Image appended to wing showcase gallery.', 'success');
  });

  // Handle Form Submit
  if (!form.dataset.listener) {
    form.dataset.listener = 'true';
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const mode = document.getElementById('wing-action-mode').value;
      const wingId = document.getElementById('wing-action-id').value;

      const nameVal = document.getElementById('wing-form-name').value.trim();
      const catVal = document.getElementById('wing-form-category').value;
      const iconVal = document.getElementById('wing-form-icon').value.trim() || '🏢';
      const timingsVal = document.getElementById('wing-form-timings').value.trim();
      const admFeesVal = document.getElementById('wing-form-admission').value.trim();
      const monFeesVal = document.getElementById('wing-form-monthly').value.trim();
      const aboutVal = document.getElementById('wing-form-about').value.trim();

      const pocNameVal = document.getElementById('wing-form-poc-name').value.trim();
      const pocRoleVal = document.getElementById('wing-form-poc-role').value.trim();
      const pocPhoneVal = document.getElementById('wing-form-poc-phone').value.trim();

      if (!nameVal || !timingsVal || !admFeesVal || !monFeesVal || !aboutVal || !pocNameVal || !pocRoleVal || !pocPhoneVal) {
        showToast('Validation Error', 'Please complete all parameters.', 'error');
        return;
      }

      if (pocPhoneVal.length !== 10 || isNaN(pocPhoneVal)) {
        showToast('Validation Error', 'POC phone number must be exactly 10 digits.', 'error');
        return;
      }

      let depts = [];
      try {
        depts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
      } catch(err) {}

      if (depts.length === 0) {
        depts = SEED_DEPARTMENTS.concat(DEPARTMENTS_DB.filter(d => d.id === 'general'));
      }

      if (mode === 'create') {
        // Dynamic slug generation matching the app
        const catSlug = catVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const nameSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const customId = `${catSlug}-${nameSlug}`;

        // Check duplicates
        if (depts.some(d => d.id === customId)) {
          showToast('Duplicate Wing', 'A department with this name already exists.', 'error');
          return;
        }

        const newDept = {
          id: customId,
          name: nameVal,
          category: catVal,
          icon: iconVal,
          about: aboutVal,
          timings: timingsVal,
          admissionFees: admFeesVal,
          monthlyFees: monFeesVal,
          poc: { name: pocNameVal, role: pocRoleVal, phone: pocPhoneVal },
          gallery: [],
          executiveCommittee: [],
          subCommittee: []
        };

        addDepartmentRecord(newDept);
        showToast('Department Added', `Department "${nameVal}" created successfully!`, 'success');
      } else {
        // Edit Mode
        const index = depts.findIndex(d => d.id === wingId);
        if (index === -1) return;

        updateDepartmentRecord(wingId, {
          name: nameVal,
          icon: iconVal,
          about: aboutVal,
          timings: timingsVal,
          admissionFees: admFeesVal,
          monthlyFees: monFeesVal,
          poc: { name: pocNameVal, role: pocRoleVal, phone: pocPhoneVal },
          gallery: currentEditGallery
        });
        showToast('Department Saved', `Updates successfully saved for ${nameVal}.`, 'success');
      }

      // Refresh both dashboards and hide drawers
      document.getElementById('wing-action-drawer').style.display = 'none';
      form.reset();
      currentEditGallery = [];

      loadWingsLedger(role);
      syncAndRenderWings();
      
      // Update statistics count if new wing was added
      const rawCount = depts.filter(d => d.id !== 'general').length;
      document.getElementById('hero-stat-depts').textContent = `${rawCount}+`;
    });
  }
}

window.openEditWingDrawer = function(wingId) {
  let depts = [];
  try {
    depts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
  } catch(err) {}

  if (depts.length === 0) depts = SEED_DEPARTMENTS;

  const wing = depts.find(d => d.id === wingId);
  if (!wing) return;

  document.getElementById('wing-action-mode').value = 'edit';
  document.getElementById('wing-action-id').value = wingId;
  document.getElementById('wing-drawer-title').innerHTML = `<i class="fa-solid fa-edit"></i> Modify Details: ${wing.name}`;

  document.getElementById('wing-form-name').value = wing.name;
  document.getElementById('wing-form-category').value = wing.category;
  document.getElementById('wing-form-icon').value = wing.icon || '🏢';
  document.getElementById('wing-form-timings').value = wing.timings || '';
  document.getElementById('wing-form-admission').value = wing.admissionFees || '';
  document.getElementById('wing-form-monthly').value = wing.monthlyFees || '';
  document.getElementById('wing-form-about').value = wing.about || '';

  const poc = wing.poc || { name: 'Subrata Dey', role: 'President', phone: '9830098300' };
  document.getElementById('wing-form-poc-name').value = poc.name;
  document.getElementById('wing-form-poc-role').value = poc.role;
  document.getElementById('wing-form-poc-phone').value = poc.phone;

  // Reveal gallery manager
  document.getElementById('wing-form-gallery-manager').style.display = 'block';
  document.getElementById('wing-category-form-group').style.display = 'none'; // category locked during edit

  // Pre-load showcase photo collections
  currentEditGallery = wing.gallery ? [...wing.gallery] : [];
  renderEditGalleryThumbnails();

  document.getElementById('wing-action-drawer').style.display = 'block';
  document.getElementById('wing-action-drawer').scrollIntoView({ behavior: 'smooth' });
};

function renderEditGalleryThumbnails() {
  const container = document.getElementById('wing-gallery-thumbnails-list');
  if (!container) return;

  container.innerHTML = '';
  
  if (currentEditGallery.length === 0) {
    container.innerHTML = `<p style="font-size:0.75rem; color:var(--text-muted); padding:10px; border:1px dashed var(--border); width:100%; text-align:center;">No photos uploaded to this wing showcase catalog.</p>`;
    return;
  }

  currentEditGallery.forEach((img, idx) => {
    container.innerHTML += `
      <div style="position:relative; width:80px; height:60px; border-radius:6px; border:1px solid var(--border); overflow:hidden; background:var(--background);" title="${img.title}">
        <img src="${img.url}" style="width:100%; height:100%; object-fit:cover;">
        <button type="button" onclick="removeGalleryEditPhoto(${idx})" style="position:absolute; top:2px; right:2px; background:rgba(239, 68, 68, 0.9); color:white; border:none; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.6rem; cursor:pointer;" title="Delete image">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  });
}

window.removeGalleryEditPhoto = function(idx) {
  currentEditGallery.splice(idx, 1);
  renderEditGalleryThumbnails();
  showToast('Photo Removed', 'Image removed from active editing cache.', 'success');
};

// ==============================================
// PREMIUM POST-LOGIN DASHBOARD VIEW COMPILERS
// ==============================================

function renderWelcomeCard() {
  const welcomeArea = document.getElementById('console-welcome-area');
  if (!welcomeArea) return;

  const dateObj = new Date();
  const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dateStr = dateObj.getDate();

  const hrs = dateObj.getHours();
  let greeting = 'Good Evening';
  if (hrs < 12) {
    greeting = 'Good Morning';
  } else if (hrs < 17) {
    greeting = 'Good Afternoon';
  }

  const role = activeUserSession.role;
  let kpiHtml = '';

  if (role === 'Admin') {
    const totalMembers = databasePersons.length;
    const currentYearMonth = dateObj.toISOString().substring(0, 7);
    const clearedCount = databasePersons.filter(p => p.subscriptionClearedUpto >= currentYearMonth).length;
    
    let queue = [];
    try {
      queue = JSON.parse(localStorage.getItem('udayan_submitted_enquiries') || '[]');
    } catch(e) {}
    const pendingCount = queue.filter(q => q.status === 'pending').length;

    kpiHtml = `
      <div class="kpi-card">
        <span class="kpi-num">${totalMembers}</span>
        <span class="kpi-label">Total Members</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">${clearedCount}</span>
        <span class="kpi-label">Cleared Dues</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">${pendingCount}</span>
        <span class="kpi-label">Pending Inqs</span>
      </div>
    `;
  } else if (role === 'Teacher') {
    kpiHtml = `
      <div class="kpi-card">
        <span class="kpi-num">2</span>
        <span class="kpi-label">Active Wings</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">3</span>
        <span class="kpi-label">Weekly Classes</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">1</span>
        <span class="kpi-label">Assigned Event</span>
      </div>
    `;
  } else if (role === 'Student') {
    kpiHtml = `
      <div class="kpi-card">
        <span class="kpi-num">Active</span>
        <span class="kpi-label">Status</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">1</span>
        <span class="kpi-label">Active Wing</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">2</span>
        <span class="kpi-label">Event Roster</span>
      </div>
    `;
  } else { // Member
    kpiHtml = `
      <div class="kpi-card">
        <span class="kpi-num">Active</span>
        <span class="kpi-label">Membership</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">2</span>
        <span class="kpi-label">Wings Enrolled</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-num">Cleared</span>
        <span class="kpi-label">Dues Status</span>
      </div>
    `;
  }

  welcomeArea.innerHTML = `
    <div class="console-welcome-card">
      <div class="welcome-info">
        <div class="calendar-box">
          <span class="cal-month">${monthStr}</span>
          <span class="cal-date">${dateStr}</span>
        </div>
        <div class="welcome-text">
          <h2>${greeting}, ${activeUserSession.name}! <span class="welcome-role-badge">${activeUserSession.role}</span></h2>
          <p>Here is your daily transaction overview and role metrics.</p>
        </div>
      </div>
      <div class="welcome-kpis">
        ${kpiHtml}
      </div>
    </div>
  `;
}

function renderDigitalMembershipCard(role) {
  let person = databasePersons.find(p => p.name.toLowerCase() === activeUserSession.name.toLowerCase());
  if (!person) {
    if (role === 'Student') {
      person = databasePersons.find(p => p.category === 'Student') || databasePersons[3];
    } else {
      person = databasePersons.find(p => p.category === 'Member') || databasePersons[1];
    }
  }

  const digits = person.phone ? person.phone.replace(/[^0-9]/g, '') : '9876543210';
  const paddedDigits = (digits + '0000000000').substring(0, 10);
  const cardNumber = `4532 88${paddedDigits.substring(0, 2)} ${paddedDigits.substring(2, 6)} ${paddedDigits.substring(6, 10)} 85`;
  const currentYearMonth = new Date().toISOString().substring(0, 7);
  const isOverdue = person.subscriptionClearedUpto < currentYearMonth;
  const statusText = isOverdue ? 'Dues Overdue' : 'Active Member';
  
  return `
    <div class="membership-card-area">
      <div class="digital-membership-card" title="Click to view verification code" onclick="alert('Digital Card Verified successfully! Verification code: SECURE-UDAYAN-${person.id.toUpperCase()}')">
        <div class="m-card-header">
          <div class="m-card-brand">
            <div class="m-card-logo-icon">
              <i class="fa-solid fa-sun"></i>
            </div>
            <span>UDAYAN</span>
          </div>
          <span class="m-card-status-badge" style="background: ${isOverdue ? 'var(--error)' : 'var(--success)'}; color: white;">
            ${statusText}
          </span>
        </div>
        
        <div class="m-card-chip"></div>
        
        <div class="m-card-body">
          <div class="m-card-number">${cardNumber}</div>
        </div>
        
        <div class="m-card-footer">
          <div class="m-card-holder">
            <h5>Cardholder</h5>
            <p>${person.name}</p>
          </div>
          <div class="m-card-valid">
            <h5>Cleared Upto</h5>
            <p>${person.subscriptionClearedUpto || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); margin-top: 20px;">
      <h4 style="font-size: 1rem; margin-bottom: 12px; color: var(--primary);"><i class="fa-solid fa-file-invoice-dollar"></i> Membership Card Details</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Registration Category</span>
          <strong style="font-size: 0.95rem; color: var(--text-main);">${person.category} Scholar</strong>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Phone Number</span>
          <strong style="font-size: 0.95rem; color: var(--text-main);">${person.phone}</strong>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Last Sub Payment</span>
          <strong style="font-size: 0.95rem; color: var(--text-main);">${person.lastSubPaidOn || 'N/A'}</strong>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Receipt Reference</span>
          <strong style="font-size: 0.95rem; color: var(--text-main); font-family: monospace;">${person.lastSubBillNo || 'N/A'}</strong>
        </div>
      </div>
    </div>
  `;
}

function appendSessionTimelineLog(title, text, type = 'paid') {
  const logList = document.getElementById('billing-activity-logs');
  if (!logList) return;
  
  const isFirstTime = !logList.classList.contains('activity-timeline-wrapper');
  
  if (isFirstTime) {
    logList.className = 'activity-timeline-wrapper';
    logList.innerHTML = '';
    
    // Seed some timeline logs!
    const seedLogs = [
      { title: 'System Initialized', text: 'Local offline-first databases verified.', type: 'wing', offsetMin: 2 },
      { title: 'Session Authenticated', text: `Successfully credentialed as ${activeUserSession.role}.`, type: 'inquiry', offsetMin: 0 }
    ];
    
    seedLogs.forEach(log => {
      const logTime = new Date(Date.now() - log.offsetMin * 60000);
      const timeStr = logTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      let iconClass = log.type;
      let iconHTML = '<i class="fa-solid fa-diagram-project"></i>';
      if (log.type === 'inquiry') iconHTML = '<i class="fa-solid fa-inbox"></i>';
      
      logList.innerHTML += `
        <div class="timeline-log-item">
          <div class="timeline-icon-badge ${iconClass}">
            ${iconHTML}
          </div>
          <div class="timeline-log-content">
            <h4>${log.title}</h4>
            <p>${log.text}</p>
          </div>
          <div class="timeline-log-time">${timeStr}</div>
        </div>
      `;
    });
  }
  
  if (title && text) {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    let iconClass = 'paid';
    let iconHTML = '<i class="fa-solid fa-credit-card"></i>';
    if (type === 'event') {
      iconClass = 'event';
      iconHTML = '<i class="fa-solid fa-calendar-check"></i>';
    } else if (type === 'inquiry') {
      iconClass = 'inquiry';
      iconHTML = '<i class="fa-solid fa-inbox"></i>';
    } else if (type === 'wing') {
      iconClass = 'wing';
      iconHTML = '<i class="fa-solid fa-diagram-project"></i>';
    }
    
    const logItemHtml = `
      <div class="timeline-log-item" style="animation: fadeIn 0.4s ease forwards;">
        <div class="timeline-icon-badge ${iconClass}">
          ${iconHTML}
        </div>
        <div class="timeline-log-content">
          <h4>${title}</h4>
          <p>${text}</p>
        </div>
        <div class="timeline-log-time">${timeStr}</div>
      </div>
    `;
    
    logList.innerHTML = logItemHtml + logList.innerHTML;
  }
}

// ==============================================
// CLOUD GATEWAY CONFIG & DATA SYNCHRONIZATION
// ==============================================

const CLOUD_CONFIG_KEY = 'social_org_cloud_config';

// Embedded Secure Public Credentials for Auto-Sync
const EMBEDDED_CLOUD_CONFIG = {
  provider: 'supabase',
  supabaseUrl: 'https://dkdcwhtohheiuticaqir.supabase.co',
  supabaseAnonKey: 'sb_publishable_Z42Ykj1AJ0C7VnxImcP8ww_XdcUVGlG'
};

let activeCloudProvider = 'none'; // 'none', 'supabase', 'firebase'
let supabaseClientInstance = null;
let firebaseDbInstance = null;

function initCloudDatabase() {
  const badgeText = document.getElementById('db-sync-text');
  const badgeDot = document.getElementById('db-sync-dot');

  try {
    const config = JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY) || '{"provider":"none"}');
    activeCloudProvider = config.provider || 'none';
    supabaseClientInstance = null;
    firebaseDbInstance = null;

    let url = config.supabaseUrl;
    let anonKey = config.supabaseAnonKey;

    // Use secure embedded credentials if local browser storage has no configured cloud
    if (activeCloudProvider === 'none') {
      activeCloudProvider = EMBEDDED_CLOUD_CONFIG.provider;
      url = EMBEDDED_CLOUD_CONFIG.supabaseUrl;
      anonKey = EMBEDDED_CLOUD_CONFIG.supabaseAnonKey;
    }

    if (activeCloudProvider === 'supabase' && url && anonKey) {
      if (window.supabase) {
        supabaseClientInstance = window.supabase.createClient(url, anonKey);
        console.log('Supabase client initialized successfully on website using credentials gateway.');
        if (badgeText && badgeDot) {
          badgeText.textContent = 'Supabase Connected';
          badgeDot.style.background = 'var(--success)';
        }
      } else {
        console.warn('Supabase SDK not loaded yet.');
      }
    } else if (activeCloudProvider === 'firebase' && config.firebaseConfig) {
      if (window.firebase) {
        const parsedConfig = JSON.parse(config.firebaseConfig);
        let app;
        if (window.firebase.apps.length === 0) {
          app = window.firebase.initializeApp(parsedConfig);
        } else {
          app = window.firebase.app();
        }
        firebaseDbInstance = window.firebase.firestore(app);
        console.log('Firebase client initialized successfully on website.');
        if (badgeText && badgeDot) {
          badgeText.textContent = 'Firebase Connected';
          badgeDot.style.background = 'var(--success)';
        }
      } else {
        console.warn('Firebase SDK not loaded yet.');
      }
    } else {
      if (badgeText && badgeDot) {
        badgeText.textContent = 'Offline Cache Active';
        badgeDot.style.background = 'var(--warning)';
      }
    }
  } catch (err) {
    console.error('Error initializing cloud database:', err);
    activeCloudProvider = 'none';
    if (badgeText && badgeDot) {
      badgeText.textContent = 'Offline Cache Active';
      badgeDot.style.background = 'var(--warning)';
    }
  }
}

const CloudApiService = {
  getPersons: async () => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      try {
        const { data, error } = await supabaseClientInstance
          .from('persons')
          .select('*');
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase fetch persons failed:', err);
      }
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      try {
        const snapshot = await firebaseDbInstance.collection('persons').get();
        const data = [];
        snapshot.forEach(doc => data.push(doc.data()));
        return data;
      } catch (err) {
        console.error('Firebase fetch persons failed:', err);
      }
    }
    return null;
  },

  updatePerson: async (id, updatedData) => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      const { error } = await supabaseClientInstance
        .from('persons')
        .update(updatedData)
        .eq('id', id);
      if (error) throw error;
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      await firebaseDbInstance.collection('persons').doc(id).update(updatedData);
    }
  },

  getDepartments: async () => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      try {
        const { data, error } = await supabaseClientInstance
          .from('departments')
          .select('*');
        if (error) throw error;
        return data.map(d => ({
          ...d,
          poc: typeof d.poc === 'string' ? JSON.parse(d.poc) : d.poc,
          gallery: typeof d.gallery === 'string' ? JSON.parse(d.gallery) : d.gallery,
          executiveCommittee: typeof d.executiveCommittee === 'string' ? JSON.parse(d.executiveCommittee) : d.executiveCommittee,
          subCommittee: typeof d.subCommittee === 'string' ? JSON.parse(d.subCommittee) : d.subCommittee
        }));
      } catch (err) {
        console.error('Supabase fetch departments failed:', err);
      }
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      try {
        const snapshot = await firebaseDbInstance.collection('departments').get();
        const data = [];
        snapshot.forEach(doc => data.push(doc.data()));
        return data;
      } catch (err) {
        console.error('Firebase fetch departments failed:', err);
      }
    }
    return null;
  },

  updateDepartment: async (id, updatedData) => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      const { error } = await supabaseClientInstance
        .from('departments')
        .update(updatedData)
        .eq('id', id);
      if (error) throw error;
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      await firebaseDbInstance.collection('departments').doc(id).set(updatedData, { merge: true });
    }
  },

  addDepartment: async (newDept) => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      const { error } = await supabaseClientInstance
        .from('departments')
        .insert([newDept]);
      if (error) throw error;
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      await firebaseDbInstance.collection('departments').doc(newDept.id).set(newDept);
    }
  },

  getEvents: async () => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      try {
        const { data, error } = await supabaseClientInstance
          .from('events')
          .select('*');
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase fetch events failed:', err);
      }
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      try {
        const snapshot = await firebaseDbInstance.collection('events').get();
        const data = [];
        snapshot.forEach(doc => data.push(doc.data()));
        return data;
      } catch (err) {
        console.error('Firebase fetch events failed:', err);
      }
    }
    return null;
  },

  updateEvent: async (id, updatedData) => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      const { error } = await supabaseClientInstance
        .from('events')
        .update(updatedData)
        .eq('id', id);
      if (error) throw error;
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      await firebaseDbInstance.collection('events').doc(id).update(updatedData);
    }
  },

  getUserAccounts: async () => {
    if (activeCloudProvider === 'supabase' && supabaseClientInstance) {
      try {
        const { data, error } = await supabaseClientInstance
          .from('users_accounts')
          .select('*');
        if (error) throw error;
        const users = {};
        data.forEach(u => {
          users[u.username.toLowerCase()] = u;
        });
        return users;
      } catch (err) {
        console.error('Supabase fetch user accounts failed:', err);
      }
    } else if (activeCloudProvider === 'firebase' && firebaseDbInstance) {
      try {
        const snapshot = await firebaseDbInstance.collection('users_accounts').get();
        const users = {};
        snapshot.forEach(doc => {
          const u = doc.data();
          users[u.username.toLowerCase()] = u;
        });
        return users;
      } catch (err) {
        console.error('Firebase fetch user accounts failed:', err);
      }
    }
    return null;
  }
};

async function syncCloudDataOnLanding() {
  if (activeCloudProvider === 'none') {
    console.log('[Udayan Sync] No cloud sync provider configured, using local seeding fallbacks.');
    updateHeroStatistics();
    updateHeroEventCard();
    return;
  }

  console.log('[Udayan Sync] Initializing hybrid landing gateway sync from: ' + activeCloudProvider);
  try {
    // 1. Sync User Accounts
    const cloudUsers = await CloudApiService.getUserAccounts();
    if (cloudUsers && Object.keys(cloudUsers).length > 0) {
      const localUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
      const mergedUsers = { ...localUsers, ...cloudUsers };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mergedUsers));
      console.log('[Udayan Sync] Verified credentials registers sync.');
    }

    // 2. Sync Departments / Wings
    const cloudDepts = await CloudApiService.getDepartments();
    if (cloudDepts && cloudDepts.length > 0) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(cloudDepts));
      console.log('[Udayan Sync] Live wings listings synchronized.');
    }

    // 3. Sync Persons Directory
    const cloudPersons = await CloudApiService.getPersons();
    if (cloudPersons && cloudPersons.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(cloudPersons));
      databasePersons = cloudPersons;
      console.log('[Udayan Sync] Persons database verified.');
    }

    // 4. Sync Events Schedules
    const cloudEvents = await CloudApiService.getEvents();
    if (cloudEvents && cloudEvents.length > 0) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(cloudEvents));
      databaseEvents = cloudEvents;
      console.log('[Udayan Sync] Community event planners synchronized.');
    }

    // Refresh rendering grids and stats dynamically with live cloud database
    syncAndRenderWings();
    syncAndRenderEvents();
    updateHeroStatistics();
    updateHeroEventCard();
    updateCommitteesList();
    
    if (activeUserSession) {
      renderWelcomeCard();
      initConsoleSystem();
    }
  } catch (err) {
    console.warn('[Udayan Sync] Cloud synchronization failed, loading offline-first storage:', err);
    updateHeroStatistics();
    updateHeroEventCard();
  }
}

// Write-through mutations helpers

async function updatePersonRecord(id, updatedData) {
  const index = databasePersons.findIndex(p => p.id === id);
  if (index === -1) return;
  
  databasePersons[index] = { ...databasePersons[index], ...updatedData };
  localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(databasePersons));
  
  if (activeCloudProvider !== 'none') {
    try {
      await CloudApiService.updatePerson(id, updatedData);
      console.log('[Udayan Write] Cloud sync successful for Person: ' + id);
    } catch (err) {
      console.error('[Udayan Write] Cloud update sync failed for Person:', err);
    }
  }
}

async function updateEventRecord(eventId, updatedData) {
  const index = databaseEvents.findIndex(e => e.id === eventId);
  if (index === -1) return;
  
  databaseEvents[index] = { ...databaseEvents[index], ...updatedData };
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(databaseEvents));
  
  if (activeCloudProvider !== 'none') {
    try {
      await CloudApiService.updateEvent(eventId, updatedData);
      console.log('[Udayan Write] Cloud sync successful for Event: ' + eventId);
    } catch (err) {
      console.error('[Udayan Write] Cloud event sync failed:', err);
    }
  }
}

async function addDepartmentRecord(newDept) {
  let depts = [];
  try {
    depts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
  } catch(e) {}
  depts.push(newDept);
  localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
  
  updateHeroStatistics();
  
  if (activeCloudProvider !== 'none') {
    try {
      await CloudApiService.addDepartment(newDept);
      console.log('[Udayan Write] Cloud sync successful for Department Addition: ' + newDept.id);
    } catch(err) {
      console.error('[Udayan Write] Cloud department creation failed:', err);
    }
  }
}

async function updateDepartmentRecord(deptId, updatedFields) {
  let depts = [];
  try {
    depts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]');
  } catch(e) {}
  const index = depts.findIndex(d => d.id === deptId);
  if (index === -1) return;
  depts[index] = { ...depts[index], ...updatedFields };
  localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
  
  updateHeroStatistics();
  
  if (activeCloudProvider !== 'none') {
    try {
      await CloudApiService.updateDepartment(deptId, updatedFields);
      console.log('[Udayan Write] Cloud sync successful for Department Mutation: ' + deptId);
    } catch(err) {
      console.error('[Udayan Write] Cloud department update failed:', err);
    }
  }
}

function updateHeroStatistics() {
  const membersEl = document.getElementById('hero-stat-members');
  const deptsEl = document.getElementById('hero-stat-depts');
  
  if (membersEl) {
    const membersCount = databasePersons.length;
    membersEl.textContent = `${membersCount}`;
  }
  
  if (deptsEl) {
    let departments = [];
    try {
      const rawData = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      if (rawData) {
        departments = JSON.parse(rawData).filter(d => d.id !== 'general');
      }
    } catch(e) {}
    if (departments.length === 0) {
      departments = SEED_DEPARTMENTS;
    }
    deptsEl.textContent = `${departments.length}`;
  }
}

function updateHeroEventCard() {
  const titleEl = document.getElementById('hero-event-title');
  const avatarEl = document.getElementById('hero-event-avatar');
  const locationEl = document.getElementById('hero-event-location');
  const dateEl = document.getElementById('hero-event-date');
  
  if (!titleEl || !databaseEvents || databaseEvents.length === 0) return;
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find upcoming events sorted ascending
  const upcomingEvents = databaseEvents
    .filter(evt => evt.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
  let targetEvent = null;
  if (upcomingEvents.length > 0) {
    targetEvent = upcomingEvents[0]; // Nearest upcoming
  } else {
    // If no upcoming, fall back to the most recent past event for rendering
    targetEvent = [...databaseEvents].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }
  
  if (targetEvent) {
    titleEl.innerHTML = targetEvent.title.replace(/\s&\s/g, ' &<br>').replace(/\sClinic/g, '<br>Clinic');
    
    const firstLetter = targetEvent.title ? targetEvent.title.substring(0, 1).toUpperCase() : 'E';
    if (avatarEl) avatarEl.textContent = firstLetter;
    
    if (locationEl) {
      locationEl.textContent = targetEvent.location || 'Community Hall';
    }
    
    if (dateEl) {
      const dateFormatted = new Date(targetEvent.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });
      dateEl.textContent = dateFormatted;
    }
  }
}

function updateCommitteesList() {
  const execList = document.getElementById('executive-committee-list');
  const subList = document.getElementById('sub-committee-list');
  if (!execList && !subList) return;

  const raw = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
  let depts = [];
  try {
    depts = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Could not parse departments for committees:', e);
  }
  
  // Find 'general' department
  let general = depts.find(d => d.id === 'general');
  if (!general) {
    // If not found in localStorage yet, we can use a hardcoded default that matches the initial index.html
    general = {
      id: 'general',
      executiveCommittee: [
        { name: 'Subrata Dey', role: 'President' },
        { name: 'Bimal Krishna Roy', role: 'Gen. Secretary' },
        { name: 'Sulata Ghosh', role: 'Treasurer' }
      ],
      subCommittee: [
        { name: 'Arundhati Sen', role: 'Cultural Convener' },
        { name: 'Rohan Banerjee', role: 'Sports Coordinator' },
        { name: 'Keya Das', role: 'Student Coordinator' }
      ]
    };
  }

  if (execList && general.executiveCommittee) {
    execList.innerHTML = general.executiveCommittee.map(m => 
      `<li><span>${m.name}</span> <span class="role">${m.role}</span></li>`
    ).join('');
  }
  if (subList && general.subCommittee) {
    subList.innerHTML = general.subCommittee.map(m => 
      `<li><span>${m.name}</span> <span class="role">${m.role}</span></li>`
    ).join('');
  }
}



