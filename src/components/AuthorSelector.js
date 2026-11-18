import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

const AuthorSelector = ({ selectedAuthors, onAuthorsChange }) => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '', institution: '' });
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await apiService.getAuthors();
      setAuthors(response.data.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAuthor = (author) => {
    if (!selectedAuthors.find(a => a.email === author.email)) {
      onAuthorsChange([...selectedAuthors, { name: author.name, email: author.email, authorId: author._id }]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveAuthor = (email) => {
    onAuthorsChange(selectedAuthors.filter(a => a.email !== email));
  };

  const handleCreateNewAuthor = async () => {
    if (!newAuthor.name || !newAuthor.email) return;
    
    try {
      const response = await apiService.createAuthor(newAuthor);
      const createdAuthor = response.data.data;
      
      if (!selectedAuthors.find(a => a.email === createdAuthor.email)) {
        onAuthorsChange([...selectedAuthors, { name: createdAuthor.name, email: createdAuthor.email, authorId: createdAuthor._id }]);
      }
      
      setNewAuthor({ name: '', email: '', institution: '' });
      setShowAddForm(false);
      fetchAuthors();
    } catch (error) {
      console.error('Error creating author:', error);
      alert('Error creating author. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-white mb-2">Authors</label>
      
      {selectedAuthors.map((author, index) => (
        <div key={index} className="flex items-center gap-3 bg-drone-dark p-3 rounded-lg border border-white/10">
          <div className="flex-1">
            <div className="text-white font-medium">{author.name}</div>
            <div className="text-gray-400 text-sm">{author.email}</div>
          </div>
          <button
            type="button"
            onClick={() => handleRemoveAuthor(author.email)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}

      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search existing authors..."
              className="w-full pl-10 pr-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-drone-blue/20 border border-drone-blue/40 text-drone-blue rounded-lg text-sm font-medium hover:bg-drone-blue hover:text-white transition-colors"
          >
            <i className="fas fa-plus mr-1"></i> New
          </button>
        </div>

        {showDropdown && searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-drone-dark border border-white/20 rounded-lg max-h-48 overflow-y-auto shadow-xl">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
                <button
                  key={author._id}
                  type="button"
                  onClick={() => handleAddAuthor(author)}
                  className="w-full text-left px-4 py-2 hover:bg-drone-gray transition-colors"
                >
                  <div className="text-white text-sm font-medium">{author.name}</div>
                  <div className="text-gray-400 text-xs">{author.email}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">No authors found</div>
            )}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="bg-drone-dark p-4 rounded-lg border border-drone-blue/30 space-y-3">
          <h4 className="text-white font-medium text-sm">Add New Author</h4>
          <input
            type="text"
            placeholder="Author Name"
            value={newAuthor.name}
            onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
            className="w-full px-3 py-2 bg-drone-gray border border-white/20 rounded-lg text-white text-sm"
          />
          <input
            type="email"
            placeholder="Author Email"
            value={newAuthor.email}
            onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
            className="w-full px-3 py-2 bg-drone-gray border border-white/20 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            placeholder="Institution (optional)"
            value={newAuthor.institution}
            onChange={(e) => setNewAuthor({ ...newAuthor, institution: e.target.value })}
            className="w-full px-3 py-2 bg-drone-gray border border-white/20 rounded-lg text-white text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreateNewAuthor}
              className="flex-1 py-2 bg-drone-blue text-white rounded-lg text-sm font-medium hover:bg-drone-cyan transition-colors"
            >
              Add Author
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorSelector;