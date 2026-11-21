export interface ProjectPhase {
  phase: string;
  title: string;
  detail: string;
}

export interface ProjectGalleryItem {
  src: string;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  context: string;
  summary: string;
  problem: string;
  approach: string;
  deliverables: string[];
  architecture?: ProjectPhase[];
  gallery?: ProjectGalleryItem[];
  stack: string[];
  format: "video" | "long-scroll" | "mobile" | "cards";
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export const SITE_CONFIG = {
  name: "ROHITH EP",
  role: "Software Engineer · AI Developer",
  tagline: "I turn ideas into intelligent products.",
  pitch:
    "MCA 2026 graduate building AI applications, full-stack web platforms, and high-converting e-commerce systems. Open to full-time roles (relocatable) and remote freelance projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rohithep.online",
  email: "rohith.ep.dev@gmail.com",
  github: "https://github.com/rohithep",
  linkedin: "https://linkedin.com/in/rohith-ep",
  whatsapp: "https://wa.me/918137018488",
  resumePath: "/resume/rohith-ep-resume.pdf",
  location: "Kerala, India · Relocatable / Remote",
  showTestimonials: false,
};

export const TIMELINE_CHAPTERS = [
  {
    id: "01",
    period: "+1 & +2",
    title: "Higher Secondary — Bio Science",
    place: "Farook College, Kozhikode",
    description:
      "Completed higher secondary education in Bio Science, building analytical and scientific problem-solving foundations before transitioning into computer science.",
    tags: ["Bio Science", "Higher Secondary"],
  },
  {
    id: "02",
    period: "2021 — 2023",
    title: "BSc Computer Science",
    place: "Farook College, Kozhikode",
    description:
      "Built core foundations in algorithms, databases, and software engineering. Shipped Aluminate (Alumni Management System) with 3-tier role approval and Razorpay donations as my degree capstone project.",
    tags: ["CS Foundations", "Web Systems", "Aluminate Platform"],
  },
  {
    id: "03",
    period: "2024 — 2026",
    title: "Master of Computer Applications (MCA) · First Class with Distinction",
    place: "College of Engineering Thalassery (CUSAT)",
    description:
      "Graduated with First Class with Distinction. Studied Machine Learning, Deep Learning, IoT, Software Engineering, Python, Web Technologies, and Cryptography, and engineered MCAverse (the MCA department association web & mobile platform).",
    tags: ["First Class Distinction", "ML & Deep Learning", "MCAverse App", "Cryptography"],
  },
  {
    id: "04",
    period: "Jan 2026 · 3 Months",
    title: "Software & AI Engineering Internship",
    place: "Mexilet Technologies",
    description:
      "Completed a 3-month internship starting January 2026, engineering the AI Property Video Generator (MakePropertyVideo) using Frappe, MariaDB, OpenAI Whisper, Amazon Bedrock, ElevenLabs TTS, and Razorpay.",
    tags: ["Frappe & MariaDB", "Amazon Bedrock", "Whisper & ElevenLabs", "Razorpay"],
  },
  {
    id: "05",
    period: "Ongoing",
    title: "Independent Freelance Builder",
    place: "Remote Worldwide",
    description:
      "Partnering with brands and agencies to ship custom Shopify stores, Kanaa.online, conversion landing pages, SEO, and Meta Ads growth.",
    tags: ["Shopify", "Next.js", "SEO & Meta Ads"],
  },
];

export const SKILL_GROUPS = [
  {
    category: "AI & Python",
    skills: [
      "AI Application Development",
      "LLM APIs",
      "Claude",
      "Gemini",
      "Open-Source LLMs",
      "Python",
    ],
  },
  {
    category: "Frontend",
    skills: ["Next.js", "React", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
  },
  {
    category: "Backend & Data",
    skills: [
      "Node.js & Express.js",
      "Python Django",
      "Frappe",
      "REST APIs",
      "MongoDB",
      "Supabase",
      "Firebase & Firestore",
      "PostgreSQL / MariaDB",
    ],
  },
  {
    category: "Mobile",
    skills: ["Flutter"],
  },
  {
    category: "Commerce & Growth",
    skills: ["Shopify", "SEO Optimisation", "Meta Ads"],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      "AWS",
      "Docker",
      "VPS Deployment",
      "Vercel & Render",
      "Cloudflare",
      "Cloudinary",
      "Git & GitHub",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    slug: "ai-property-video-generator",
    title: "AI Property Video Generator",
    category: "AI Application · Internship",
    year: "2026",
    role: "AI & Backend Engineer Intern",
    context: "Mexilet Technologies",
    summary:
      "Automated AI platform that converts property URLs, brochure PDFs, voice notes, text descriptions, and images into narrated, ready-to-publish real-estate marketing videos.",
    problem:
      "Real-estate teams and brokers spent hours manually extracting listing details from brochures or websites, writing scripts, recording voiceovers, sequencing room photos, and editing walkthrough videos.",
    approach:
      "Engineered a three-phase automated production pipeline on Frappe and MariaDB—combining OpenAI Whisper for voice-note transcription, Amazon Bedrock for AI narration scripts, ElevenLabs for lifelike Text-to-Speech, CLIP & FFmpeg for visual sequencing and video assembly, and Razorpay for seamless regional payments.",
    deliverables: [
      "Structured text extraction & OpenAI Whisper multilingual audio transcription pipeline",
      "Automated property narration script generation using Amazon Bedrock LLMs",
      "Natural voiceover synthesis integrated via ElevenLabs Text-to-Speech (TTS)",
      "Razorpay payment gateway integration supporting UPI, cards, and net banking",
      "End-to-end workflow orchestration on Frappe Server with MariaDB, CLIP room ordering, and FFmpeg rendering",
    ],
    architecture: [
      {
        phase: "Phase 01",
        title: "Multi-Modal Data & Audio Extraction",
        detail:
          "Processes raw user text descriptions into structured property data and transcribes voice notes using the OpenAI Whisper speech recognition model (chosen over Google STT and Azure Speech for superior multilingual accuracy). Paired with Selenium for dynamic URL extraction and Python PDF parsing for property brochures.",
      },
      {
        phase: "Phase 02",
        title: "AI Narration & Lifelike Speech Synthesis",
        detail:
          "Generates engaging, scene-by-scene property narration scripts via Amazon Bedrock and converts scripts into realistic voiceovers using ElevenLabs Text-to-Speech. Property photos are classified and ordered logically (Exterior → Entrance → Living Room → Bedroom → Kitchen) using the CLIP vision-language model.",
      },
      {
        phase: "Phase 03",
        title: "Frappe Backend, FFmpeg Rendering & Razorpay",
        detail:
          "Built on a modular Frappe framework backend with MariaDB storage. Integrates Razorpay (UPI, cards, and net banking) for pay-per-video checkout and uses FFmpeg to combine ordered visuals, ElevenLabs narration audio, and property metadata into a finished marketing video.",
      },
    ],
    stack: [
      "Python",
      "Frappe",
      "MariaDB",
      "Amazon Bedrock",
      "ElevenLabs TTS",
      "OpenAI Whisper",
      "CLIP",
      "FFmpeg",
      "Razorpay",
    ],
    format: "video",
    image: "/projects/propertyvideoai.png",
    liveUrl: "https://makepropertyvideo.in/",
    featured: true,
  },
  {
    slug: "kanaa-online",
    title: "Kanaa.online",
    category: "Full-Stack E-Commerce · Live Client",
    year: "2026",
    role: "Full-Stack Engineer & SEO Specialist",
    context: "Handcrafted Artisan Storefront",
    summary:
      "Custom full-stack e-commerce platform and brand storefront built with Next.js, Python Django, and Supabase—featuring Google OAuth & OTP member accounts, live order tracking, verified customer reviews, a complete admin inventory/order dashboard, and Google Search Console SEO indexing.",
    problem:
      "The handmade brand needed more than a generic template: they required an editorial, story-driven storefront coupled with customer accounts for order tracking and reviews, plus a dedicated admin dashboard to upload products and manage incoming orders without technical overhead.",
    approach:
      "Architected a custom Next.js frontend paired with a Python Django backend and Supabase database. Implemented Google Account OAuth & WhatsApp/SMS OTP authentication, a multi-filter product catalog, customer review & order-tracking flows, a full admin management dashboard, custom domain deployment, and end-to-end technical SEO registered with Google Search Console.",
    deliverables: [
      "Bespoke editorial landing page & responsive multi-filter product catalog (category, size, search, wishlist, discounts)",
      "Customer authentication via Google OAuth & WhatsApp/SMS OTP with personal accounts for live order tracking and posting product reviews",
      "Complete Admin Dashboard to upload new products with rich details, manage inventory, and process all customer orders",
      "Full-stack architecture combining Next.js frontend, Python Django backend APIs, and Supabase database/storage",
      "Technical SEO optimisation, sitemap/metadata indexing in Google Search Console, and custom domain hosting (kanaa.online)",
    ],
    architecture: [
      {
        phase: "01 · Storefront & Catalog",
        title: "Next.js Editorial Experience & Filtering",
        detail:
          "Crafted a warm, tactile storefront for handcrafted jewellery, pendants, keychains, and apparel with instant category/size filtering, search, wishlists, and promotional pricing.",
      },
      {
        phase: "02 · Member Accounts & Auth",
        title: "Google OAuth, Order Tracking & Reviews",
        detail:
          "Integrated Google Account sign-in alongside WhatsApp/SMS OTP so customers have persistent accounts to save delivery addresses, track live order statuses, and publish verified product reviews.",
      },
      {
        phase: "03 · Admin & SEO Growth",
        title: "Django + Supabase Admin & Search Console",
        detail:
          "Built a dedicated admin panel powered by Python Django and Supabase where store owners upload products, manage pricing/stock, and fulfill orders—backed by full SEO optimisation and Google Search Console indexing on a custom domain.",
      },
    ],
    gallery: [
      {
        src: "/projects/kanaa-collections.jpg",
        caption: "Curated Handcrafted Collections Showcase",
      },
      {
        src: "/projects/kanaa-catalog.jpg",
        caption: "Multi-Filter Shop Catalog (Category, Size, Search & Discounts)",
      },
      {
        src: "/projects/kanaa-auth.png",
        caption: "Member Access Modal — Google OAuth & WhatsApp/SMS OTP Login",
      },
      {
        src: "/projects/kanaa-footer.jpg",
        caption: "Editorial Campaign Banner & Custom Work Inquiry Footer",
      },
    ],
    stack: [
      "Next.js",
      "Python",
      "Django",
      "Supabase",
      "Google OAuth",
      "Tailwind CSS",
      "SEO",
      "Google Search Console",
    ],
    format: "long-scroll",
    image: "/projects/kanaa.png",
    liveUrl: "https://kanaa.online",
    featured: true,
  },
  {
    slug: "custom-shopify-jewellery-store",
    title: "Custom Jewellery Shopify Store",
    category: "Shopify E-Commerce · Live Client",
    year: "2026",
    role: "Shopify & E-Commerce Developer",
    context: "Violet & Wine Jewels",
    summary:
      "Bespoke luxury jewellery storefront for Violet & Wine Jewels featuring a custom wine-and-ivory editorial design system, Razorpay payment gateway integration, complete merchant-compliance policy pages, and Google Search Console SEO.",
    problem:
      "Standard e-commerce templates lacked the quiet-luxury editorial aesthetic needed for fine jewellery, and launching paid campaigns + Razorpay checkout required a fully compliant storefront with verified legal, shipping, and refund policies.",
    approach:
      "Designed and engineered a custom Shopify storefront with a curated wine, ivory, and espresso color palette, serif editorial typography, collection showcases (Rings, Earrings, Necklaces, Bracelets), Razorpay payment integration, Shop account order tracking, full legal compliance pages, and Google Search Console indexing.",
    deliverables: [
      "Custom design system & luxury color palette (Burgundy Wine, Warm Ivory & Espresso) with editorial serif typography",
      "Razorpay payment gateway integration for seamless domestic checkout alongside customer account & order tracking",
      "Curated collection architecture (Rings, Earrings, Necklaces, Bracelets) and dedicated customer inquiry flow",
      "Complete merchant-compliance legal suite: Privacy Policy, Refund Policy, Shipping Policy, Terms of Service, Contact Information, and Legal Notice",
      "Technical SEO optimisation and property indexing in Google Search Console",
    ],
    architecture: [
      {
        phase: "01 · Brand & UI Design",
        title: "Custom Luxury Color Palette & Editorial Layout",
        detail:
          "Crafted a quiet-luxury visual identity for Violet & Wine Jewels ('Quiet radiance, made to be kept') pairing deep velvet wine tones with warm ivory backgrounds and refined collection grids.",
      },
      {
        phase: "02 · Payments & Compliance",
        title: "Razorpay Integration & Full Policy Suite",
        detail:
          "Integrated Razorpay checkout and structured all mandatory merchant-compliance pages—Privacy Policy, Refund Policy, Shipping Policy, Terms of Service, Contact Information, and Legal Notice.",
      },
      {
        phase: "03 · Accounts & Search",
        title: "Customer Order Portal & Search Console",
        detail:
          "Configured Shop customer sign-in (Orders & Profile management), dedicated client-care contact workflows, and Google Search Console indexing for organic discovery.",
      },
    ],
    gallery: [
      {
        src: "/projects/violet-wine-hero.jpg",
        caption: "Hero Landing Page — Custom Wine & Ivory Editorial Palette",
      },
      {
        src: "/projects/violet-wine-collections.jpg",
        caption: "Curated Jewellery Collections (Rings, Earrings, Necklaces, Bracelets)",
      },
      {
        src: "/projects/violet-wine-contact.png",
        caption: "Client Care Contact Page & Customer Account / Order Sign-In",
      },
      {
        src: "/projects/violet-wine-footer.jpg",
        caption: "Complete Legal & Compliance Suite (Privacy, Refund, Shipping, Terms & Legal Notice)",
      },
    ],
    stack: [
      "Shopify",
      "Razorpay",
      "Custom Theme Design",
      "JavaScript",
      "HTML & CSS",
      "Google Search Console",
      "SEO",
    ],
    format: "long-scroll",
    image: "/projects/violet-wine-mockup.jpg",
    featured: true,
  },
  {
    slug: "mca-association-platform",
    title: "MCAverse — MCA Association App",
    category: "Mobile & Web Platform · MCA Project",
    year: "2026",
    role: "Lead Full-Stack & Mobile Developer",
    context: "College of Engineering Thalassery (CUSAT)",
    summary:
      "Unified department community and academic platform featuring Firebase role-based access (Student, Faculty, Admin & Guest), real-time public group and 1-on-1 personal chats, a Cloudinary-powered photo/video gallery with faculty moderation, notes & question-paper archive, events, announcements, and birthday alerts.",
    problem:
      "Department communications, academic notes, previous question papers, event notices, and student directories were scattered across multiple chat groups with no role-based moderation or searchable member database.",
    approach:
      "Engineered MCAverse using Flutter, Firebase Authentication, Cloud Firestore, and Cloudinary. Implemented multi-role access control (Students, Faculty, Admin, and Guest login), real-time public and private messaging, a moderated photo/video media gallery, an academic resource vault, automated member birthday alerts, and multi-criteria directory filtering.",
    deliverables: [
      "Firebase Authentication with role-based access control for Students, Faculty, and Admin, plus a dedicated Guest Login mode",
      "Real-time Live Public Group Chat and 1-on-1 Personal Chat between department members powered by Cloud Firestore",
      "Shared Photo & Video Media Gallery stored on Cloudinary where everyone can upload and Admin/Faculty have moderation permissions to remove items",
      "Academic Resource Hub hosting class notes, schedules, and previous-year university question papers alongside Events & Announcements feeds",
      "Rich User Profiles, automated member Birthday Alerts, and multi-filter member directory searchable by batch year, name, and hometown/place",
    ],
    architecture: [
      {
        phase: "01 · Auth & Role Governance",
        title: "Firebase Auth (Student, Faculty, Admin & Guest)",
        detail:
          "Secured registration and login via Firebase Authentication with granular permissions across Student, Faculty, and Admin roles, plus a read-only Guest login for prospective students and visitors.",
      },
      {
        phase: "02 · Real-Time Chat & Media",
        title: "Firestore Messaging & Cloudinary Gallery",
        detail:
          "Built live department-wide group chat and 1-on-1 direct messaging on Cloud Firestore. Profile photos and gallery photos/videos are hosted on Cloudinary with Admin and Faculty deletion controls.",
      },
      {
        phase: "03 · Academics & Community",
        title: "Notes Vault, Birthday Alerts & Directory Filters",
        detail:
          "Centralized study notes, classes, and question papers alongside events, official announcements, automated birthday alerts, and instant member filtering by year, name, and place.",
      },
    ],
    stack: [
      "Flutter",
      "Firebase Auth",
      "Cloud Firestore",
      "Cloudinary",
      "React / Web",
      "Real-Time Chat",
      "Role-Based Access",
    ],
    format: "mobile",
    image: "/projects/mcaverse-mockup.jpg",
    featured: true,
  },
  {
    slug: "alumni-management-system",
    title: "Aluminate — Alumni Management System",
    category: "Full-Stack Platform · BSc Capstone",
    year: "2023",
    role: "Full-Stack Developer",
    context: "Farook College, Kozhikode",
    summary:
      "Three-tier college alumni platform (Admin, Faculty, Student) featuring hierarchical registration approval, a Razorpay-integrated donation portal, blood donation directory, student batch filtering, event notice board, and member profiles.",
    problem:
      "Maintaining verified graduate records, coordinating alumni events, collecting campus donations, and reaching alumni for urgent blood donation requests manually led to fragmented spreadsheets and unverified accounts.",
    approach:
      "Engineered Aluminate with a strict three-module role hierarchy where Admin approves Faculty and Faculty verifies Student/Alumni registrations—paired with a Razorpay donation portal, a searchable blood donor registry, advanced batch/department student filters, an event notice board, and a dedicated admin dashboard.",
    deliverables: [
      "Three-tier role architecture (Admin, Faculty, Student) with hierarchical verification: Admin approves Faculty, and Faculty approves Student registrations",
      "Integrated Razorpay Donation Portal enabling secure alumni contributions toward college and department initiatives",
      "Blood Donation Section to filter and contact willing alumni/student donors by blood group during emergencies",
      "Advanced Student Filter Directory, rich User Profiles, and an Event Notice Board for reunions and campus updates",
      "Dedicated Admin Dashboard for platform governance, faculty verification, event moderation, and donation tracking",
    ],
    architecture: [
      {
        phase: "01 · Admin & Faculty Governance",
        title: "Two-Step Hierarchical Approval Chain",
        detail:
          "Eliminates fake alumni sign-ups through a chained verification flow: the Admin module verifies and approves Faculty accounts, and department Faculty verify and approve Student/Alumni registrations.",
      },
      {
        phase: "02 · Community & Blood Registry",
        title: "Student Filtering, Profiles & Blood Donation",
        detail:
          "Provides verified members with rich user profiles, multi-criteria student/batch filtering, an event notice board, and a dedicated Blood Donation directory for urgent medical requests.",
      },
      {
        phase: "03 · Razorpay Donations",
        title: "Integrated Alumni Donation Portal",
        detail:
          "Built a seamless fundraising portal integrated with Razorpay so alumni can contribute directly to campus funds and track campaigns, managed end-to-end from the dedicated Admin page.",
      },
    ],
    stack: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "Razorpay",
      "Role-Based Auth",
      "HTML & CSS",
    ],
    format: "cards",
    image: "/projects/aluminate-mockup.jpg",
    featured: true,
  },
  {
    slug: "digital-agency-website",
    title: "Violet & Wine Digitals — Agency Website",
    category: "Digital Agency · Live Client",
    year: "2026",
    role: "Full-Stack Web & Growth Developer",
    context: "Violet & Wine Digitals",
    summary:
      "High-converting agency platform for Violet & Wine Digitals showcasing custom digital wedding invitations (WhatsApp cards & 4K Story Reels), Shopify & web development, Reels/Shorts production, and Paid Social (Meta Ads) campaigns.",
    problem:
      "The agency needed a unified, modern web presence capable of converting two distinct audiences—couples & families ordering bespoke 4K digital invitations, and growing brands commissioning Shopify storefronts and paid social campaigns.",
    approach:
      "Designed and engineered a rich violet-and-obsidian editorial landing experience with interactive floating service cards, format previews (9:16, 4:5, 1:1), clear process/portfolio sections, fast lead capture ('Plan your project'), technical SEO, and edge deployment on Vercel & Cloudflare.",
    deliverables: [
      "Interactive hero showcase with floating preview cards for Digital Invitations (WhatsApp Cards & 4K Story Reels), Reels/Shorts, and Paid Social formats (9:16, 4:5, 1:1)",
      "Service architecture bridging creative event invitations, custom websites, Shopify stores, and Meta Ads growth",
      "Streamlined project inquiry and client onboarding flow ('Start a project' / 'Plan your project')",
      "Technical SEO optimisation, responsive performance tuning, and global edge deployment via Vercel and Cloudflare",
    ],
    architecture: [
      {
        phase: "01 · Interactive Hero & UI",
        title: "Floating Service & Format Previews",
        detail:
          "Built a deep-violet glassmorphic hero showcasing real agency deliverables—from 4K Story Reel wedding invites to Instagram Stories, Reels & Shorts, and aspect-ratio selectors (9:16, 4:5, 1:1).",
      },
      {
        phase: "02 · Multi-Service Funnel",
        title: "Invitations, Shopify Stores & Paid Social",
        detail:
          "Structured dedicated service pathways for couples, families, and brands so visitors can explore creative collections, review the agency's process, and start a project in seconds.",
      },
      {
        phase: "03 · Performance & Edge Deploy",
        title: "Next.js, SEO & Cloudflare Edge",
        detail:
          "Engineered with Next.js and Tailwind CSS for instant load times, structured SEO metadata, and reliable deployment on Vercel and Cloudflare.",
      },
    ],
    stack: [
      "Next.js",
      "Tailwind CSS",
      "Vercel",
      "Cloudflare",
      "Technical SEO",
      "Meta Ads",
    ],
    format: "long-scroll",
    image: "/projects/violet-wine-digitals.jpg",
    featured: true,
  },
];
