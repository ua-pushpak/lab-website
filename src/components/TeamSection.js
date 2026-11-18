import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await apiService.getTeamMembers();
      const visibleMembers = response.data.data.filter(m => m.isVisible !== false);
      setTeamMembers(visibleMembers);
      setLoading(false);
    } catch (error) {
      setTeamMembers([]);
      setLoading(false);
    }
  };

  const pis = teamMembers.filter(m => m.role === 'PI' || m.role === 'Co-PI');
  const otherMembers = teamMembers.filter(m => m.role !== 'PI' && m.role !== 'Co-PI');

  const getFilteredMembers = () => {
    let filtered = otherMembers;
    
    switch (filter) {
      case 'current':
        filtered = otherMembers.filter(m => m.status === 'current');
        break;
      case 'completed':
        filtered = otherMembers.filter(m => m.status === 'alumni' || m.status === 'completed');
        break;
      default:
        filtered = otherMembers;
    }

    return filtered.sort((a, b) => {
      const statusOrder = { 'current': 0, 'alumni': 1, 'completed': 1, 'visiting': 2 };
      const aStatus = statusOrder[a.status] || 0;
      const bStatus = statusOrder[b.status] || 0;
      
      if (aStatus !== bStatus) return aStatus - bStatus;
      
      return a.name.localeCompare(b.name);
    });
  };

  const getRoleLabel = (role) => {
    const labels = {
      'PI': 'Principal Investigator',
      'Co-PI': 'Co-Principal Investigator',
      'phd': 'PhD Student',
      'masters': 'Masters Student',
      'researcher': 'Researcher',
      'engineer': 'Engineer',
      'student': 'Student',
      'advisor': 'Advisor',
    };
    return labels[role] || role;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'current': 'Current',
      'alumni': 'Alumni',
      'visiting': 'Visiting',
      'completed': 'Completed',
    };
    return labels[status] || status;
  };

  const filteredMembers = getFilteredMembers();

  return (

   
    <section className={`py-20 pt-32 ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Team</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Meet our researchers</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Loading...</p>
          </div>
        ) : (
          <>
            {pis.length > 0 && (
              <div className="mb-20">
                <div className="flex justify-center flex-wrap gap-8">
                  {pis.map((pi) => (
                    <div 
                      key={pi._id} 
                      className={`rounded-3xl border-2 p-12 text-center w-full max-w-lg transition-all hover:shadow-2xl ${
                        isDark 
                          ? 'bg-[#1e293b] border-drone-blue/50 hover:border-drone-blue/80' 
                          : 'bg-gray-50 border-drone-blue/50 hover:border-drone-blue/80'
                      }`}
                    >
                      <div className="relative w-48 h-48 mx-auto mb-8">
                        {pi.photoUrl ? (
                          <img
                            src={pi.photoUrl}
                            alt={pi.name}
                            className="w-48 h-48 rounded-full object-cover"
                            style={{ borderWidth: '5px', borderColor: '#0ea5e9', borderStyle: 'solid' }}
                          />
                        ) : (
                          <div 
                            className={`w-48 h-48 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-drone-dark' : 'bg-gray-200'
                            }`}
                            style={{ borderWidth: '5px', borderColor: '#0ea5e9', borderStyle: 'solid' }}
                          >
                            <i className={`fas fa-user text-8xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`}></i>
                          </div>
                        )}
                        
                        <span className={`absolute bottom-2 right-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                          pi.status === 'current' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {getStatusLabel(pi.status)}
                        </span>
                      </div>

                      <h3 className={`font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {pi.name}
                      </h3>
                      <p className="text-drone-blue text-xl font-semibold mb-5">
                        {getRoleLabel(pi.role)}
                      </p>

                      {pi.researchInterests && pi.researchInterests.length > 0 && (
                        <p className={`text-base leading-relaxed mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {pi.researchInterests.join('  •  ')}
                        </p>
                      )}

                      {pi.bio && (
                        <p className={`text-base leading-relaxed mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {pi.bio}
                        </p>
                      )}

                      {pi.email && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(pi.email).then(() => {
                              alert('Email copied: ' + pi.email);
                            });
                          }}
                          className={`mt-6 text-base hover:underline cursor-pointer inline-flex items-center gap-3 ${
                            isDark ? 'text-gray-400 hover:text-drone-blue' : 'text-gray-500 hover:text-drone-blue'
                          }`}
                          title={`Click to copy: ${pi.email}`}
                        >
                          <i className="fas fa-envelope"></i>
                          {pi.email}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3 mb-10">
              {[
                { key: 'all', label: 'All' },
                { key: 'current', label: 'Current' },
                { key: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-drone-blue text-white'
                      : isDark
                        ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <div 
                  key={member._id} 
                  className={`rounded-xl border p-6 transition-all hover:shadow-lg ${
                    isDark 
                      ? 'bg-[#1e293b] border-white/10 hover:border-drone-blue/40' 
                      : 'bg-gray-50 border-gray-200 hover:border-drone-blue/40'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 mb-4">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-24 h-24 rounded-full object-cover"
                          style={{ borderWidth: '3px', borderColor: '#0ea5e9', borderStyle: 'solid' }}
                        />
                      ) : (
                        <div 
                          className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-drone-dark' : 'bg-gray-200'
                          }`}
                          style={{ borderWidth: '3px', borderColor: '#0ea5e9', borderStyle: 'solid' }}
                        >
                          <i className={`fas fa-user text-4xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`}></i>
                        </div>
                      )}
                      
                      <span className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'current' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {getStatusLabel(member.status)}
                      </span>
                    </div>

                    <h3 className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                    </h3>
                    <p className="text-drone-blue text-sm font-medium mb-3">
                      {getRoleLabel(member.role)}
                    </p>

                    {member.researchInterests && member.researchInterests.length > 0 && (
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {member.researchInterests.join('  •  ')}
                      </p>
                    )}

                    {member.email && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(member.email).then(() => {
                            alert('Email copied: ' + member.email);
                          });
                        }}
                        className={`mt-4 text-sm hover:underline cursor-pointer inline-flex items-center gap-2 ${
                          isDark ? 'text-gray-400 hover:text-drone-blue' : 'text-gray-500 hover:text-drone-blue'
                        }`}
                        title={`Click to copy: ${member.email}`}
                      >
                        <i className="fas fa-envelope text-xs"></i>
                        {member.email}
                      </button>
                    )}

                    {member.graduationYear && member.status !== 'current' && (
                      <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Graduated: {member.graduationYear}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TeamSection;