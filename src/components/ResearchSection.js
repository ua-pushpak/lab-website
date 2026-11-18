import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const ResearchSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects();
      const visibleProjects = response.data.data.filter(p => p.isVisible !== false);
      setProjects(visibleProjects);
      setLoading(false);
    } catch (error) {
      setProjects([]);
      setLoading(false);
    }
  };

  const categories = ['all', 'Autonomy', 'Swarm', 'Vision', 'Energy', 'Communication'];
  
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section className={`py-20 pt-32 ${isDark ? 'bg-[#1e293b]' : 'bg-[#f5f5f7]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Research Areas</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Exploring key areas in drone technology</p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-drone-blue text-white'
                  : isDark
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Loading...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id} className={`p-6 rounded-xl border transition-all ${
                isDark ? 'bg-[#0f172a] border-white/10 hover:border-drone-blue/40' : 'bg-white border-gray-200 hover:border-drone-blue/40'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-drone-blue">{project.category}</span>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{project.status}</span>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResearchSection;