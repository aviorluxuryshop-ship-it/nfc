import { media } from '@/lib/media'

import type { Dictionary } from './types'

export const en: Dictionary = {
  locale: 'en',
  meta: {
    homeTitle: 'Socialp Media — Social Media Agency · Istanbul',
    homeDescription:
      'Socialp Media is an Istanbul-based agency: social media management, photo and video production, web design, and Meta & Google advertising.',
    aboutTitle: 'About',
    aboutDescription:
      'Founded in 2021, Socialp Media brings strategy, content and management together for hundreds of brands across different industries.',
    contactTitle: 'Contact',
    contactDescription:
      'Get in touch with Socialp Media: +1 437 231 1432 · business@socialpmedia.com · Istanbul office: +90 (540) 034 69 69 · hello@socialpmedia.com.',
  },
  nav: {
    services: 'Services',
    work: 'Work',
    about: 'About',
    contact: 'Contact',
    cta: 'Start a project',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    skip: 'Skip to content',
    mainNav: 'Main menu',
  },
  common: {
    explore: 'Explore',
    allServices: 'All services',
    whatsapp: 'Message on WhatsApp',
    call: 'Call',
    email: 'Email',
    instagram: 'Instagram',
    scroll: 'Scroll',
    next: 'Next',
    prev: 'Previous',
    playVideo: 'Play video',
    pauseVideo: 'Pause video',
    playSlides: 'Play slideshow',
    pauseSlides: 'Pause slideshow',
    carousel: 'carousel',
    slide: 'slide',
  },
  hero: {
    eyebrow: 'Social media agency — Istanbul, since 2021',
    titleA: 'Your digital',
    titleB: 'solution partner.',
    body: 'Different ideas, original content. We take on strategy, production and ad management end to end — and move your brand one step ahead online.',
    primary: 'Start a project',
    secondary: 'Behind the scenes',
  },
  clients: {
    eyebrow: 'Clients',
    title: 'Trusted by hundreds of brands.',
    body: 'From beauty to banking, we partner with brands from many industries on their growth journey.',
    more: '100+',
    moreLabel: 'brands and counting',
  },
  manifesto: {
    eyebrow: 'Who we are',
    text: 'We started in 2021 to help brands build a strong, sustainable and compelling presence online. We believe every brand has its own language — so we bring strategy, content and management together into a digital signature that speaks it.',
    facts: [
      { value: '2021', label: 'Founded' },
      { value: '100+', label: 'Brands partnered with' },
      { value: '5 countries', label: 'International contact line' },
    ],
    link: 'Our story',
  },
  servicesSection: {
    eyebrow: 'Services',
    title: 'A strong brand starts with the right strategy.',
    body: 'Through content creation, web solutions and performance-driven advertising, we build sustainable digital growth and connect your brand with its audience.',
  },
  services: {
    social: {
      id: 'social',
      number: '01',
      title: 'Social Media Management',
      short: 'Social Media Management',
      tagline: 'Content is made with strategy, not by chance.',
      lead: 'We manage your brand’s digital identity end to end: audience-led strategy, original shoots, creative design and a steady content plan.',
      intro: [
        'Every brand has a different audience and a different voice. We build content strategies for your audience, run original photo and video shoots, create the designs and keep a regular content calendar.',
        'With account management, community engagement and performance analysis we do more than keep your accounts active — we plan everything from pre-production to post-publishing so your brand grows sustainably.',
      ],
      bullets: [
        'Content strategy',
        'Photo & video production',
        'Creative design',
        'Content planning',
        'Account & community management',
        'Performance analysis',
      ],
      featuresTitle: 'Social media, end to end',
      features: [
        {
          title: 'Content strategy',
          body: 'We analyse your brand, industry and audience to define your voice and your content roadmap.',
        },
        {
          title: 'Photo & video production',
          body: 'On location or in the studio — promo films, interviews, product and concept shoots, all with our own crew.',
        },
        {
          title: 'Creative design',
          body: 'From posts to stories, original and eye-catching designs that fit your brand identity.',
        },
        {
          title: 'Regular content plan',
          body: 'We plan what goes out, where and when — keeping your accounts consistent and active.',
        },
        {
          title: 'Account & community management',
          body: 'We run your accounts professionally and keep the conversation with your followers alive.',
        },
        {
          title: 'Performance analysis',
          body: 'We measure results regularly and keep refining the strategy based on the data.',
        },
      ],
      metaTitle: 'Social Media Management',
      metaDescription:
        'End-to-end social media management: content strategy, photo and video production, creative design, content planning, account management and performance analysis.',
    },
    web: {
      id: 'web',
      number: '02',
      title: 'Web Design & Development',
      short: 'Web Design & Development',
      tagline: 'Make a strong first impression online.',
      lead: 'We design and build websites that reflect your business — mobile-friendly, fast-loading and built on an SEO-ready foundation.',
      intro: [
        'We design modern, user-focused websites. Mobile-friendly, fast and SEO-ready, they help you earn your visitors’ trust from the first click.',
        'From corporate websites and service pages to contact forms and custom solutions, we represent your brand professionally online.',
      ],
      bullets: ['Modern design', 'Mobile-first build', 'SEO foundation', 'Fast & secure', 'Post-launch support'],
      featuresTitle: 'Flawless on every screen',
      features: [
        {
          title: 'Modern design',
          body: 'Aesthetic, professional design aligned with your identity. Experience-first websites that build trust and get noticed.',
        },
        {
          title: 'Mobile-friendly',
          body: 'Works flawlessly on phones, tablets and desktops — fast, fluid and easy to use on every screen.',
        },
        {
          title: 'SEO foundation',
          body: 'A search-engine-ready build that raises your visibility and makes it easier for customers to find you.',
        },
        {
          title: 'Fast and secure',
          body: 'High-performance infrastructure and security-focused development for a seamless, reliable experience.',
        },
      ],
      metaTitle: 'Web Design & Development',
      metaDescription:
        'Modern, mobile-friendly, fast and SEO-ready corporate and e-commerce websites — from analysis to launch and post-launch support.',
    },
    ads: {
      id: 'ads',
      number: '03',
      title: 'Meta & Google Ads',
      short: 'Meta & Google Ads',
      tagline: 'Not impressions. Customers.',
      lead: 'We run your Instagram, Facebook and Google campaigns from audience analysis to reporting. The goal is measurable success.',
      intro: [
        'We professionally manage Meta (Instagram & Facebook) and Google ad campaigns so your brand reaches the right audience.',
        'Through audience analysis, ad strategy, creative planning, campaign optimisation and performance reporting, we make every part of your ad budget work harder.',
      ],
      bullets: ['Audience analysis', 'Ad strategy', 'Continuous optimisation', 'Transparent reporting'],
      featuresTitle: 'Your budget, on the right people',
      features: [
        {
          title: 'Audience analysis',
          body: 'Using age, interest, location and behaviour data, we find the right audience and put your ads in front of potential customers.',
        },
        {
          title: 'Ad strategy',
          body: 'Campaigns built around your goals — brand awareness, engagement, website traffic or sales.',
        },
        {
          title: 'Continuous optimisation',
          body: 'We review live ads regularly and optimise targeting, creative and budget to lift performance.',
        },
        {
          title: 'Performance reporting',
          body: 'Detailed reports on reach, clicks, conversions and return on investment — shared with you transparently.',
        },
      ],
      metaTitle: 'Meta & Google Ads',
      metaDescription:
        'Instagram, Facebook and Google ads management: audience analysis, ad strategy, continuous optimisation and transparent performance reporting.',
    },
  },
  featured: {
    eyebrow: 'Selected project',
    title: 'Dlux Professional',
    by: 'by Selin Demirel',
    body: 'An e-commerce website for Dlux Professional, a beauty and lash brand — product categories, a shopping flow and the brand’s story in a single experience.',
    rows: [
      { label: 'Service', value: 'Web Design & Development' },
      { label: 'Type', value: 'E-commerce website' },
      { label: 'Industry', value: 'Beauty & lashes' },
    ],
    link: 'See web design',
    url: 'Dlux Professional',
  },
  production: {
    eyebrow: 'Production',
    title: 'Behind the scenes.',
    body: 'From cafés to showrooms, interviews to concept shoots — we plan every step from pre-production to publishing, and we’re the crew on set.',
    items: [
      { ...media.cafe, alt: 'Phone camera filming food and interior in a café', caption: 'Café promo film' },
      { ...media.showroom, alt: 'Gimbal and lighting set up in a car showroom', caption: 'Showroom shoot' },
      { ...media.interview, alt: 'Camera and monitor during an interview shoot', caption: 'Interview shoot' },
      { ...media.beauty, alt: 'Photographing in front of a nail polish wall at a beauty centre', caption: 'Beauty centre shoot' },
      { ...media.conceptVideo, alt: 'Black-and-white still from a concept video', caption: 'Concept video' },
      { ...media.restaurant, alt: 'Food content shoot at a restaurant table', caption: 'Restaurant content shoot' },
      { ...media.venue, alt: 'Softbox lighting set up in a luxury venue', caption: 'Venue shoot' },
      { ...media.stage, alt: 'Stage with lights and camera, a laptop running an edit', caption: 'Stage shoot' },
      { ...media.conceptMagazine, alt: 'Model reading a magazine at a manicure table, concept photo shoot', caption: 'Concept photo shoot' },
      { ...media.beautySet, alt: 'Tripod and lighting set up in a beauty salon', caption: 'Beauty salon shoot' },
      { ...media.interviewStudio, alt: 'Studio interview set with a speaker at a desk', caption: 'Studio interview' },
      { ...media.socialDesign, alt: 'Social media design created for an electrical infrastructure company', caption: 'Social media design' },
    ],
  },
  process: {
    eyebrow: 'How we work',
    title: 'From pre-production to post.',
    steps: [
      {
        title: 'Strategy',
        body: 'We analyse your brand, industry and audience, and define your voice and content strategy.',
      },
      {
        title: 'Production',
        body: 'We run original photo and video shoots and create the designs tailored to your brand.',
      },
      {
        title: 'Publish & manage',
        body: 'We manage your accounts on a regular content plan and keep your community engaged.',
      },
      {
        title: 'Analyse',
        body: 'We measure performance and keep optimising strategy, content and ads with data.',
      },
    ],
  },
  testimonials: {
    eyebrow: 'From our clients',
    items: [
      {
        quote:
          'An agency with a real command of the industry that manages social media with meticulous care. It made a significant difference in no time. We can call it the Socialp Media difference!',
        topic: 'Social media management',
      },
      {
        quote:
          'If you want to be visible online and make your name and brand known, you need to make the right move. Socialp Media is definitely the first step. A team you need to know and work with.',
        topic: 'Digital visibility',
      },
      {
        quote:
          'We had a fantastic rapport with the team during the commercial shoot. Professional, energetic and very attentive. The working environment was as high-quality as the final product.',
        topic: 'Commercial shoot',
      },
    ],
  },
  marquee: ['Different ideas', 'Original content', 'Your digital solution partner'],
  cta: {
    eyebrow: 'We make it for your brand',
    title: 'Make a strong appearance online.',
    body: 'Tell us your goals, and let’s map out the road for your brand together.',
  },
  footer: {
    statement: 'Different ideas, original content.',
    servicesTitle: 'Services',
    agencyTitle: 'Agency',
    turkeyTitle: 'Istanbul office',
    intlTitle: 'International',
    intlCountries: 'United States · Canada · United Kingdom · Australia · Germany',
    followTitle: 'Follow',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
  servicePage: {
    eyebrow: 'Service',
    otherServices: 'Other services',
    processTitle: 'Our process',
    processEyebrow: 'Process',
    socialGalleryTitle: 'From our shoots',
    socialDesignTitle: 'Design, too.',
    socialDesignBody:
      'We turn the footage we shoot into posts that speak your brand’s language. The example shown is a social media design we created for an electrical infrastructure company.',
    webBuildsTitle: 'What we build',
    webBuilds: ['Corporate websites', 'E-commerce websites', 'Service pages', 'Contact forms', 'Custom solutions'],
    webSectorsTitle: 'Who is it for?',
    webSectorsBody: 'Every industry’s visitors look for something different. We shape the site around that.',
    webSectors: [
      { ...media.sectorBeauty, alt: 'Beauty centres', label: 'Beauty centres' },
      { ...media.sectorRestaurant, alt: 'Restaurants and cafés', label: 'Restaurants & cafés' },
      { ...media.sectorEducation, alt: 'Educational institutions', label: 'Educational institutions' },
      { ...media.sectorEcommerce, alt: 'E-commerce brands', label: 'E-commerce brands' },
      { ...media.sectorConstruction, alt: 'Construction companies', label: 'Construction companies' },
      { ...media.sectorCorporate, alt: 'Corporate firms', label: 'Corporate firms' },
    ],
    webProcess: [
      {
        title: 'Analysis & plan',
        body: 'We analyse your brand, industry and audience, and draw up a strategic plan for the site’s purpose, structure and user experience.',
      },
      {
        title: 'Design',
        body: 'We design an interface that reflects your identity, balances aesthetics with function and is easy to navigate.',
      },
      {
        title: 'Development',
        body: 'We build the approved design on a professional foundation that meets mobile, performance, security and SEO standards.',
      },
      {
        title: 'Test & launch',
        body: 'We test every page, link and form meticulously, then launch your site without a hitch.',
      },
      {
        title: 'Support',
        body: 'We stay with you after launch, with quick answers for updates, technical support and new development.',
      },
    ],
    webFeaturedTitle: 'Live work',
    adsPlatformsTitle: 'Platforms we manage',
    adsObjectivesTitle: 'Campaigns built around goals',
    adsObjectives: ['Brand awareness', 'Engagement', 'Website traffic', 'Sales'],
    adsReportTitle: 'Every number, in the open.',
    adsReportBody: 'We track ad results with detailed reports and share all the data with you openly.',
    adsMetrics: ['Reach', 'Clicks', 'Conversions', 'Return on investment'],
    adsGoal:
      'Our goal isn’t just more impressions — it’s more customers, higher conversion rates and success you can measure.',
  },
  about: {
    eyebrow: 'About',
    title: 'We make it for your brand.',
    paragraphs: [
      'Founded in 2021, our agency set out to help brands build a strong, sustainable and compelling presence online. Since day one we have worked with hundreds of brands from different industries, developing a tailored strategy for each.',
      'We offer end-to-end services in social media management, content creation and digital strategy. The aim isn’t only to be visible — it’s to reach the right audience and build real engagement with it.',
      'With a firm grasp of ever-changing digital dynamics, we plan not only for today but for tomorrow. Every project gets the same care and professionalism.',
    ],
    pillars: [
      {
        title: 'A strong digital signature',
        body: 'We bring strategy, content and management together to unlock each brand’s potential online. A data-driven approach and creative content connect brands with the right audience.',
      },
      {
        title: 'A vision powered by creativity',
        body: 'Partnering with hundreds of brands sharpens our expertise every day. We believe every brand has its own language, and we create original content that speaks it.',
      },
    ],
    closing: 'We approach every project with the same care, aiming to move your brand one step ahead online.',
    clientsTitle: 'Some of the brands we work with',
  },
  contactPage: {
    eyebrow: 'Contact',
    title: 'Let’s talk about your project.',
    body: 'Social media, a website or advertising — tell us where you want to start and we’ll find the right solution together.',
    turkey: 'Istanbul',
    intl: 'International',
    address: 'Address',
    openMap: 'Open in Maps',
    social: 'Social',
    form: {
      title: 'Leave a short brief',
      body: 'Fill in the form and your message opens ready to send in WhatsApp or your email app.',
      name: 'Your name',
      company: 'Brand / company',
      interest: 'Services you’re interested in',
      message: 'Message',
      messagePlaceholder: 'Tell us a little about your brand and your goals…',
      sendWhatsapp: 'Send via WhatsApp',
      sendEmail: 'Send via email',
      note: 'Nothing is stored on this site; the message is sent straight from your own app.',
      greeting: 'Hello Socialp Media,',
      subject: 'New project',
      other: 'Other',
      required: 'Please add your name and a short message.',
    },
  },
  notFound: {
    title: 'This page doesn’t exist.',
    body: 'The page you’re looking for may have moved, or never existed.',
    home: 'Back to home',
  },
}
