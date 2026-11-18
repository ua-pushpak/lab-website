import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    home: 'Home',
    research: 'Research',
    team: 'Team',
    publications: 'Publications',
    news: 'News',
    contact: 'Contact',
    heroTagline: 'Urban Data Science Lab',
    heroTitle: 'Futuristic City Data Analytics',
    heroSubtitle: 'Harnessing the power of data science and drone technology to build smarter, more efficient cities.',
    exploreResearch: 'Explore Research',
    viewDatasets: 'View Datasets',
    dataPoints: 'Data Points',
    models: 'Models',
    projects: 'Projects',
    researchers: 'Researchers',
    researchAreas: 'Research Areas',
    researchSubtitle: 'Exploring key areas in drone technology and autonomous systems.',
    all: 'All',
    loading: 'Loading...',
    ourTeam: 'Our Team',
    teamSubtitle: 'Meet the brilliant minds behind our innovations',
    publicationsTitle: 'Publications',
    publicationsSubtitle: 'Our latest research papers and findings',
    allYears: 'All Years',
    latestNews: 'Latest News',
    newsSubtitle: 'Stay updated with our latest announcements and achievements',
    readMore: 'Read More',
    getInTouch: 'Get in Touch',
    contactSubtitle: 'Have questions about our research? We would love to hear from you.',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    hours: 'Hours',
    name: 'Name',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    messageSent: 'Message sent successfully! We will get back to you soon.',
    quickLinks: 'Quick Links',
    researchAreasFooter: 'Research Areas',
    contactUs: 'Contact',
    stayUpdated: 'Stay Updated',
    subscribe: 'Subscribe',
    newsletterText: 'Subscribe to our newsletter for the latest research updates.',
    yourEmail: 'Your email',
    allRightsReserved: 'All rights reserved.',
    ongoing: 'Ongoing',
    completed: 'Completed',
    planned: 'Planned',
  },
  hi: {
    home: 'होम',
    research: 'अनुसंधान',
    team: 'टीम',
    publications: 'प्रकाशन',
    news: 'समाचार',
    contact: 'संपर्क',
    heroTagline: 'शहरी डेटा विज्ञान प्रयोगशाला',
    heroTitle: 'भविष्य का शहर डेटा एनालिटिक्स',
    heroSubtitle: 'डेटा विज्ञान और ड्रोन प्रौद्योगिकी की शक्ति का उपयोग करके स्मार्ट शहरों का निर्माण।',
    exploreResearch: 'अनुसंधान देखें',
    viewDatasets: 'डेटासेट देखें',
    dataPoints: 'डेटा पॉइंट्स',
    models: 'मॉडल',
    projects: 'परियोजनाएं',
    researchers: 'शोधकर्ता',
    researchAreas: 'अनुसंधान क्षेत्र',
    researchSubtitle: 'ड्रोन प्रौद्योगिकी में प्रमुख क्षेत्रों की खोज।',
    all: 'सभी',
    loading: 'लोड हो रहा है...',
    ourTeam: 'हमारी टीम',
    teamSubtitle: 'हमारे नवाचारों के पीछे के लोगों से मिलें',
    publicationsTitle: 'प्रकाशन',
    publicationsSubtitle: 'हमारे नवीनतम शोध पत्र',
    allYears: 'सभी वर्ष',
    latestNews: 'ताज़ा समाचार',
    newsSubtitle: 'नवीनतम घोषणाओं से अपडेट रहें',
    readMore: 'और पढ़ें',
    getInTouch: 'संपर्क करें',
    contactSubtitle: 'हमारे शोध के बारे में प्रश्न हैं?',
    address: 'पता',
    phone: 'फोन',
    email: 'ईमेल',
    hours: 'समय',
    name: 'नाम',
    subject: 'विषय',
    message: 'संदेश',
    sendMessage: 'संदेश भेजें',
    sending: 'भेजा जा रहा है...',
    messageSent: 'संदेश सफलतापूर्वक भेजा गया!',
    quickLinks: 'त्वरित लिंक',
    researchAreasFooter: 'अनुसंधान क्षेत्र',
    contactUs: 'संपर्क',
    stayUpdated: 'अपडेट रहें',
    subscribe: 'सदस्यता लें',
    newsletterText: 'नवीनतम शोध अपडेट के लिए सदस्यता लें।',
    yourEmail: 'आपका ईमेल',
    allRightsReserved: 'सभी अधिकार सुरक्षित।',
    ongoing: 'चालू',
    completed: 'पूर्ण',
    planned: 'योजनाबद्ध',
  },
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};