import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const PublicationsSection = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [toast, setToast] = useState(null);
  const [selectedPub, setSelectedPub] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchPublications = async () => {
    try {
      const response = await apiService.getPublications();
      const visiblePublications = response.data.data.filter(p => p.isVisible !== false);
      setPublications(visiblePublications);
      setLoading(false);
    } catch (error) {
      setPublications([]);
      setLoading(false);
    }
  };

  const handleCopyEmail = async (author) => {
    try {
      await navigator.clipboard.writeText(author.email);
      setToast(`Email copied: ${author.email}`);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = author.email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setToast(`Email copied: ${author.email}`);
    }
  };

  const openAbstract = (pub) => {
    setSelectedPub(pub);
  };

  const closeAbstract = () => {
    setSelectedPub(null);
  };

  const getCategoryStyles = (category) => {
    if (category === 'journal') {
      return {
        ribbonText: 'JOURNAL',
        ribbonColor: '#f97316',
        borderColor: '#f97316',
        ribbonBg: '#f97316',
      };
    } else if (category === 'conference') {
      return {
        ribbonText: 'CONFERENCE',
        ribbonColor: '#eab308',
        borderColor: '#eab308',
        ribbonBg: '#eab308',
      };
    } else {
      return {
        ribbonText: 'PREPRINT',
        ribbonColor: '#94a3b8',
        borderColor: '#94a3b8',
        ribbonBg: '#94a3b8',
      };
    }
  };

  const years = ['all', ...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
  
  const filteredPublications = selectedYear === 'all' 
    ? publications 
    : publications.filter(p => p.year === parseInt(selectedYear));

  return (
    <section className={`py-20 pt-32 ${isDark ? 'bg-[#1e293b]' : 'bg-[#f5f5f7]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Publications</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Our latest research papers</p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedYear === year
                  ? 'bg-drone-blue text-white'
                  : isDark
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {year === 'all' ? 'All Years' : year}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((pub) => {
              const categoryStyle = getCategoryStyles(pub.category);
              
              return (
                <div 
                  key={pub._id} 
                  className={`relative rounded-xl overflow-hidden ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}
                  style={{ border: `1px solid ${categoryStyle.borderColor}` }}
                >
                  <div 
                    className="absolute left-0 top-0 h-full flex items-center justify-center"
                    style={{ backgroundColor: categoryStyle.ribbonBg, width: '32px' }}
                  >
                    <span 
                      className="text-white font-bold text-xs tracking-wider"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '2px' }}
                    >
                      {categoryStyle.ribbonText}
                    </span>
                  </div>

                  <div className="pl-12 p-6">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{pub.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {pub.authors?.map((author, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>,</span>}
                          <button
                            onClick={() => handleCopyEmail(author)}
                            className="text-drone-blue hover:text-drone-cyan hover:underline transition-colors cursor-pointer"
                            title={`Click to copy email: ${author.email}`}
                          >
                            {author.name}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {pub.journal} • {pub.year}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() => openAbstract(pub)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-book-open text-xs"></i>
                        View Abstract
                      </button>
                      
                      {pub.doi && (
                        <a
                          href={pub.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2 bg-drone-blue/20 border border-drone-blue/40 rounded-lg text-drone-blue text-sm font-medium hover:bg-drone-blue hover:text-white transition-all"
                        >
                          <i className="fas fa-file-pdf text-xs"></i>
                          Paper Link
                        </a>
                      )}
                      
                      {pub.citations > 0 && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-400 text-sm">
                          <i className="fas fa-quote-right text-xs"></i>
                          {pub.citations} citations
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border ${
            isDark ? 'bg-[#1e293b] border-drone-blue/40' : 'bg-white border-drone-blue/40'
          }`}>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-green-500 text-sm"></i>
            </div>
            <div>
              <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Email copied successfully!
              </div>
              <div className="text-xs text-gray-400">{toast.replace('Email copied: ', '')}</div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {selectedPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeAbstract}>
          <div 
            className={`max-w-2xl w-full rounded-2xl shadow-2xl border overflow-hidden ${
              isDark ? 'bg-[#1e293b] border-white/20' : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Abstract
              </h3>
              <button
                onClick={closeAbstract}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedPub.title}
              </h4>

              <div className="mb-4">
                <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Authors:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPub.authors?.map((author, index) => (
                    <button
                      key={index}
                      onClick={() => handleCopyEmail(author)}
                      className="text-drone-blue hover:text-drone-cyan hover:underline text-sm transition-colors cursor-pointer"
                      title={`Click to copy: ${author.email}`}
                    >
                      {author.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedPub.category === 'journal' ? 'Journal' : 
                   selectedPub.category === 'conference' ? 'Conference' : 
                   selectedPub.category === 'preprint' ? 'Preprint' : 'Publication'}:
                </div>
                <p className={isDark ? 'text-white text-sm' : 'text-gray-900 text-sm'}>
                  {selectedPub.journal} • {selectedPub.year}
                </p>
              </div>

              <div>
                <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Abstract:
                </div>
                <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedPub.abstract || 'No abstract available for this publication.'}
                </p>
              </div>
            </div>

            <div className={`p-4 border-t flex justify-end gap-3 ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              {selectedPub.doi && (
                <a
                  href={selectedPub.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-drone-blue/20 border border-drone-blue/40 rounded-lg text-drone-blue text-sm font-medium hover:bg-drone-blue hover:text-white transition-all"
                >
                  <i className="fas fa-file-pdf text-xs"></i>
                  Paper Link
                </a>
              )}
              <button
                onClick={closeAbstract}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PublicationsSection;