import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await apiService.getNews();
      const visibleNews = response.data.data.filter(n => n.isVisible !== false);
      setNews(visibleNews);
      setLoading(false);
    } catch (error) {
      setNews([]);
      setLoading(false);
    }
  };

  return (
    <section className={`py-20 pt-32 ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Latest News</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Stay updated</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Loading...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item._id} className={`p-6 rounded-xl border transition-all ${
                isDark ? 'bg-[#1e293b] border-white/10 hover:border-drone-blue/40' : 'bg-gray-50 border-gray-200 hover:border-drone-blue/40'
              }`}>
                <span className="inline-block px-2 py-1 bg-drone-blue/20 text-drone-blue text-xs font-medium rounded-full mb-3">
                  {item.category}
                </span>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.content}</p>
                {item.date && (
                  <p className={`text-xs mt-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;