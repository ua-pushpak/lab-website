import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import PhotoUpload from '../components/PhotoUpload';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AuthorSelector from '../components/AuthorSelector';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [news, setNews] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [collectionData, setCollectionData] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [databaseStats, setDatabaseStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [versions, setVersions] = useState([]);
  const [liveVersion, setLiveVersion] = useState(null);
  const [versionNotes, setVersionNotes] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [settingsVersions, setSettingsVersions] = useState([]);
  const [activeSettingsId, setActiveSettingsId] = useState(null);
  const { settings, updateSettings, fetchSettings } = useSiteSettings();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [authors, setAuthors] = useState([]);
  const [authorSearchTerm, setAuthorSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importAuthorName, setImportAuthorName] = useState('');
  const [importStartYear, setImportStartYear] = useState(2020);
  const [importLoading, setImportLoading] = useState(false);
  const [backups, setBackups] = useState([]);
  const [backupName, setBackupName] = useState('');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [importScholarUrl, setImportScholarUrl] = useState('');

  useEffect(() => {
    fetchAllData();
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
    if (activeTab === 'site-settings') {
      fetchSettingsVersions();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'database') {
      fetchCollections();
    }
    if (activeTab === 'system') {
      fetchSystemInfo();
    }
    if (activeTab === 'users') {
      fetchUsers();
    }
    if (activeTab === 'authors') {
      fetchAuthors();
    }
    if (activeTab === 'backups') {
      fetchBackups();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, pubsRes, teamRes, newsRes] = await Promise.all([
        apiService.getProjects(),
        apiService.getPublications(),
        apiService.getTeamMembers(),
        apiService.getNews(),
      ]);
      setProjects(projectsRes.data.data);
      setPublications(pubsRes.data.data);
      setTeamMembers(teamRes.data.data);
      setNews(newsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchAllData = async () => {
    try {
      switch (activeTab) {
        case 'projects':
          const projectsRes = await apiService.getProjects();
          setProjects(projectsRes.data.data);
          break;
        case 'publications':
          const pubsRes = await apiService.getPublications();
          setPublications(pubsRes.data.data);
          break;
        case 'team':
          const teamRes = await apiService.getTeamMembers();
          setTeamMembers(teamRes.data.data);
          break;
        case 'news':
          const newsRes = await apiService.getNews();
          setNews(newsRes.data.data);
          break;
        case 'site-settings':
          await fetchSettings();
          fetchSettingsVersions();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSettingsVersions = async () => {
    try {
      if (settings && settings._id) {
        const res = await apiService.getVersions('site-settings', settings._id);
        setSettingsVersions(res.data.data);
        const liveRes = await apiService.getLiveVersion('site-settings', settings._id);
        setActiveSettingsId(liveRes.data?.data?._id || null);
      }
    } catch (error) {
      console.error('Error fetching settings versions:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await apiService.getCollections();
      setCollections(res.data.data);
      const statsRes = await apiService.getDatabaseStats();
      setDatabaseStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchCollectionData = async (name) => {
    try {
      setSelectedCollection(name);
      const res = await apiService.getCollectionData(name);
      setCollectionData(res.data.data);
    } catch (error) {
      console.error('Error fetching collection data:', error);
    }
  };

  const fetchSystemInfo = async () => {
    try {
      const res = await apiService.getSystemInfo();
      setSystemInfo(res.data.data);
      const dbRes = await apiService.getDatabaseInfo();
      setDatabaseStats(dbRes.data.data);
    } catch (error) {
      console.error('Error fetching system info:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiService.getUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await apiService.getAuthors();
      setAuthors(res.data.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await apiService.getBackups();
      setBackups(res.data.data);
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const fetchVersions = async (entityType, entityId) => {
    try {
      setSelectedEntityId(entityId);
      const res = await apiService.getVersions(entityType, entityId);
      setVersions(res.data.data);
      const liveRes = await apiService.getLiveVersion(entityType, entityId);
      setLiveVersion(liveRes.data.data);
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'authors' || name === 'technologies' || name === 'tags' || name === 'researchInterests') {
      setFormData({...formData, [name]: value.split(',').map(a => a.trim())});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handlePhotoUploaded = (url) => {
    setFormData({ ...formData, photoUrl: url, imageUrl: url });
  };

  const handleToggleVisibility = async (id) => {
    try {
      switch (activeTab) {
        case 'projects':
          await apiService.toggleProjectVisibility(id);
          break;
        case 'publications':
          await apiService.togglePublicationVisibility(id);
          break;
        case 'team':
          await apiService.toggleTeamMemberVisibility(id);
          break;
        case 'news':
          await apiService.toggleNewsVisibility(id);
          break;
        case 'authors':
          await apiService.toggleAuthorVisibility(id);
          break;
        default:
          return;
      }
      fetchAllData();
      if (activeTab === 'authors') fetchAuthors();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleSaveVersion = async () => {
    if (!editingId) return;
    
    try {
      const entityType = activeTab === 'projects' ? 'project' : 
                        activeTab === 'publications' ? 'publication' :
                        activeTab === 'team' ? 'team' : 'news';
      
      await apiService.saveVersion({
        entityType,
        entityId: editingId,
        data: formData,
        notes: versionNotes || `Version saved at ${new Date().toLocaleString()}`,
      });
      
      setMessage('Version saved successfully!');
      setVersionNotes('');
      fetchVersions(entityType, editingId);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving version: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSetLive = async (versionId) => {
    try {
      await apiService.setVersionLive(versionId);
      setMessage('Version set as live!');
      const entityType = activeTab === 'projects' ? 'project' : 
                        activeTab === 'publications' ? 'publication' :
                        activeTab === 'team' ? 'team' : 
                        activeTab === 'site-settings' ? 'site-settings' : 'news';
      fetchVersions(entityType, selectedEntityId || settings?._id);
      if (activeTab === 'site-settings') {
        fetchSettingsVersions();
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error setting live version: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteVersion = async (versionId) => {
    if (window.confirm('Are you sure you want to delete this version?')) {
      try {
        await apiService.deleteVersion(versionId);
        setMessage('Version deleted!');
        const entityType = activeTab === 'projects' ? 'project' : 
                          activeTab === 'publications' ? 'publication' :
                          activeTab === 'team' ? 'team' : 'news';
        if (activeTab === 'site-settings') {
          fetchSettingsVersions();
        } else {
          fetchVersions(entityType, selectedEntityId);
        }
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting version: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleSaveSettingsVersion = async () => {
    if (!settings || !settings._id) return;
    
    try {
      await apiService.saveVersion({
        entityType: 'site-settings',
        entityId: settings._id,
        data: formData,
        notes: versionNotes || `Settings saved at ${new Date().toLocaleString()}`,
      });
      
      setMessage('Settings version saved!');
      setVersionNotes('');
      fetchSettingsVersions();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings version: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleExport = async (collection, format) => {
    try {
      const response = await apiService.exportCollection(collection, format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${collection}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'site-settings') {
        const result = await updateSettings(formData);
        if (result.success) {
          setMessage('Site settings updated successfully!');
          fetchSettingsVersions();
        }
      } else if (activeTab === 'users') {
        await apiService.register(formData);
        setMessage('User created successfully!');
      } else if (activeTab === 'authors') {
        if (editingId) {
          await apiService.updateAuthor(editingId, formData);
          setMessage('Author updated successfully!');
        } else {
          await apiService.createAuthor(formData);
          setMessage('Author added successfully!');
        }
        fetchAuthors();
      } else if (editingId) {
        switch (activeTab) {
          case 'projects':
            await apiService.updateProject(editingId, formData);
            break;
          case 'publications':
            await apiService.updatePublication(editingId, formData);
            break;
          case 'team':
            await apiService.updateTeamMember(editingId, formData);
            break;
          case 'news':
            await apiService.updateNewsArticle(editingId, formData);
            break;
          default:
            break;
        }
        setMessage('Content updated successfully!');
      } else {
        switch (activeTab) {
          case 'projects':
            await apiService.createProject(formData);
            break;
          case 'publications':
            await apiService.createPublication(formData);
            break;
          case 'team':
            await apiService.createTeamMember(formData);
            break;
          case 'news':
            await apiService.createNewsArticle(formData);
            break;
          default:
            break;
        }
        setMessage('Content added successfully!');
      }
      setFormData({});
      setEditingId(null);
      fetchAllData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        switch (activeTab) {
          case 'projects':
            await apiService.deleteProject(id);
            break;
          case 'publications':
            await apiService.deletePublication(id);
            break;
          case 'team':
            await apiService.deleteTeamMember(id);
            break;
          case 'news':
            await apiService.deleteNewsArticle(id);
            break;
          case 'users':
            await apiService.deleteUser(id);
            break;
          case 'authors':
            await apiService.deleteAuthor(id);
            break;
          default:
            break;
        }
        setMessage('Deleted successfully!');
        fetchAllData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    const { _id, ...editData } = item;
    setFormData(editData);
    fetchVersions(activeTab === 'projects' ? 'project' : 
                  activeTab === 'publications' ? 'publication' :
                  activeTab === 'team' ? 'team' : 'news', item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await apiService.deleteDocument(selectedCollection, id);
        setMessage('Document deleted!');
        fetchCollectionData(selectedCollection);
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error: ' + error.message);
      }
    }
  };

  const handleDeleteAuthor = async (id) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await apiService.deleteAuthor(id);
        setMessage('Author deleted successfully!');
        fetchAuthors();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting author: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleEditAuthor = (author) => {
    setEditingId(author._id);
    setFormData(author);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImportPublications = async () => {
    if (!importAuthorName.trim()) {
      alert('Please enter a Google Scholar profile URL');
      return;
    }
    
    if (!importAuthorName.includes('scholar.google')) {
      alert('Please enter a valid Google Scholar profile URL');
      return;
    }
    
    setImportLoading(true);
    setMessage('Scraping Google Scholar... This may take a few minutes.');
    
    try {
      const response = await apiService.importPublications({
        scholarUrl: importAuthorName,
        startYear: importStartYear,
      });
      
      setMessage(response.data.message || 'Publications imported successfully!');
      setShowImportModal(false);
      setImportAuthorName('');
      fetchAllData();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Error importing: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setImportLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const response = await apiService.createBackup({ backupName });
      setMessage('Backup created successfully!');
      setBackupName('');
      setShowBackupModal(false);
      fetchBackups();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating backup: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (window.confirm('Are you sure you want to restore this backup? This will REPLACE all current data!')) {
      setRestoreLoading(true);
      try {
        await apiService.restoreBackup(backupId);
        setMessage('Backup restored successfully! Refreshing data...');
        setTimeout(() => {
          fetchAllData();
          fetchAuthors();
          fetchSettings();
          setMessage('');
        }, 2000);
      } catch (error) {
        setMessage('Error restoring backup: ' + error.message);
      } finally {
        setRestoreLoading(false);
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (window.confirm('Are you sure you want to delete this backup?')) {
      try {
        await apiService.deleteBackup(backupId);
        setMessage('Backup deleted!');
        fetchBackups();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting backup: ' + error.message);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const renderVersionControl = () => {
    if (!editingId && activeTab !== 'site-settings') return null;
    
    return (
      <div className="mt-6 bg-drone-dark p-6 rounded-xl">
        <h3 className="text-white font-semibold mb-4">Version Control</h3>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Version notes"
            value={versionNotes}
            onChange={(e) => setVersionNotes(e.target.value)}
            className="flex-1 px-4 py-2 bg-drone-gray border border-white/20 rounded-lg text-white"
          />
          <button
            onClick={activeTab === 'site-settings' ? handleSaveSettingsVersion : handleSaveVersion}
            className="px-6 py-2 bg-drone-blue text-white rounded-lg hover:bg-drone-cyan transition-colors"
          >
            Save Version
          </button>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-gray-400 text-sm font-medium">Version History</h4>
          {versions.length === 0 && settingsVersions.length === 0 && (
            <p className="text-gray-500 text-sm">No versions saved yet</p>
          )}
          
          {(activeTab === 'site-settings' ? settingsVersions : versions).map((version) => (
            <div key={version._id} className={`p-4 rounded-lg border ${version.isLive ? 'border-green-500 bg-green-500/10' : 'border-white/20 bg-drone-gray'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Version {version.version}</span>
                  {version.isLive && (
                    <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">ACTIVE</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!version.isLive && (
                    <button
                      onClick={() => handleSetLive(version._id)}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500 hover:text-white text-sm"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteVersion(version._id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-1">{version.notes}</p>
              <p className="text-gray-500 text-xs mt-1">{new Date(version.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Projects', count: projects.length, icon: 'fa-project-diagram', color: 'text-drone-blue' },
        { title: 'Publications', count: publications.length, icon: 'fa-scroll', color: 'text-green-500' },
        { title: 'Team Members', count: teamMembers.length, icon: 'fa-users', color: 'text-purple-500' },
        { title: 'News Articles', count: news.length, icon: 'fa-newspaper', color: 'text-yellow-500' },
      ].map((item, index) => (
        <div key={index} className="bg-drone-gray p-6 rounded-2xl border border-white/10 hover:border-drone-blue/40 transition-all">
          <i className={`fas ${item.icon} text-3xl ${item.color} mb-3`}></i>
          <div className="text-3xl font-bold text-white">{item.count}</div>
          <div className="text-gray-400 text-sm mt-1">{item.title}</div>
        </div>
      ))}
    </div>
  );

  const renderDatabaseViewer = () => (
    <div className="space-y-6">
      <div className="bg-drone-gray p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Collections</h3>
          <div className="flex gap-2">
            <button onClick={() => handleExport(selectedCollection, 'json')} className="px-4 py-2 bg-drone-blue/20 text-drone-blue rounded hover:bg-drone-blue hover:text-white text-sm">Export JSON</button>
            <button onClick={() => handleExport(selectedCollection, 'csv')} className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500 hover:text-white text-sm">Export CSV</button>
            <button onClick={() => handleExport(selectedCollection, 'xml')} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500 hover:text-white text-sm">Export XML</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {collections.map((collection) => (
            <button
              key={collection}
              onClick={() => fetchCollectionData(collection)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCollection === collection
                  ? 'bg-drone-blue text-white'
                  : 'bg-drone-dark text-gray-300 hover:bg-drone-gray'
              }`}
            >
              {collection}
            </button>
          ))}
        </div>
      </div>

      {selectedCollection && (
        <div className="bg-drone-gray p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">{selectedCollection} Data ({collectionData.length} documents)</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {collectionData.map((doc) => (
              <div key={doc._id} className="bg-drone-dark p-4 rounded-lg">
                <pre className="text-gray-400 text-xs overflow-x-auto">
                  {JSON.stringify(doc, null, 2)}
                </pre>
                <button
                  onClick={() => handleDeleteDocument(doc._id)}
                  className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSystemInfo = () => (
    <div className="space-y-6">
      {systemInfo && (
        <div className="bg-drone-gray p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">System Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(systemInfo).map(([key, value]) => (
              <div key={key} className="bg-drone-dark p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">{key}</div>
                <div className="text-white font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {databaseStats && (
        <div className="bg-drone-gray p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4">Database Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(databaseStats).map(([key, value]) => (
              <div key={key} className="bg-drone-dark p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">{key}</div>
                <div className="text-white font-medium">
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAuthorsForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white mb-2">Author Name</label>
        <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
      </div>
      <div>
        <label className="block text-white mb-2">Email</label>
        <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
      </div>
      <div>
        <label className="block text-white mb-2">Institution (optional)</label>
        <input type="text" name="institution" value={formData.institution || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
      </div>
    </div>
  );

  const renderFullForm = () => {
    switch (activeTab) {
      case 'team':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-white mb-2">Title</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Role</label>
                <select name="role" value={formData.role || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white">
                  <option value="">Select Role</option>
                  <option value="PI">Principal Investigator</option>
                  <option value="Co-PI">Co-Principal Investigator</option>
                  <option value="researcher">Researcher</option>
                  <option value="engineer">Engineer</option>
                  <option value="student">Student</option>
                  <option value="advisor">Advisor</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Photo Upload</label>
              <PhotoUpload onPhotoUploaded={handlePhotoUploaded} currentPhoto={formData.photoUrl} />
              {formData.photoUrl && (
                <input type="hidden" name="photoUrl" value={formData.photoUrl} />
              )}
            </div>
            <div>
              <label className="block text-white mb-2">Bio</label>
              <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-white mb-2">Research Interests (comma-separated)</label>
              <input type="text" name="researchInterests" value={formData.researchInterests?.join(', ') || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">News Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-white mb-2">Content</label>
              <textarea name="content" value={formData.content || ''} onChange={handleInputChange} required rows="5" className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Category</label>
                <select name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white">
                  <option value="">Select Category</option>
                  <option value="announcement">Announcement</option>
                  <option value="achievement">Achievement</option>
                  <option value="event">Event</option>
                  <option value="media">Media</option>
                  <option value="publication">Publication</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">News Image</label>
                <PhotoUpload onPhotoUploaded={handlePhotoUploaded} currentPhoto={formData.imageUrl} />
                {formData.imageUrl && (
                  <input type="hidden" name="imageUrl" value={formData.imageUrl} />
                )}
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Author</label>
              <input type="text" name="author" value={formData.author || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
          </div>
        );
      case 'site-settings':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Lab Name</label>
                <input type="text" name="labName" value={formData.labName || settings?.labName || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-white mb-2">Lab Tagline</label>
                <input type="text" name="labTagline" value={formData.labTagline || settings?.labTagline || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Hero Title</label>
              <input type="text" name="heroTitle" value={formData.heroTitle || settings?.heroTitle || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-white mb-2">Hero Subtitle</label>
              <textarea name="heroSubtitle" value={formData.heroSubtitle || settings?.heroSubtitle || ''} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-white mb-2">About Text</label>
              <textarea name="aboutText" value={formData.aboutText || settings?.aboutText || ''} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-white mb-2">Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail || settings?.contactEmail || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-white mb-2">Contact Phone</label>
                <input type="text" name="contactPhone" value={formData.contactPhone || settings?.contactPhone || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-white mb-2">Contact Address</label>
                <input type="text" name="contactAddress" value={formData.contactAddress || settings?.contactAddress || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
            </div>
          </div>
        );
      case 'publications':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Publication Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            
            <AuthorSelector
              selectedAuthors={formData.authors || []}
              onAuthorsChange={(authors) => setFormData({ ...formData, authors })}
            />
            
            <div>
              <label className="block text-white mb-2">Journal/Conference</label>
              <input type="text" name="journal" value={formData.journal || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Year</label>
                <input type="number" name="year" value={formData.year || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-white mb-2">DOI</label>
                <input type="text" name="doi" value={formData.doi || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Abstract</label>
              <textarea name="abstract" value={formData.abstract || ''} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-white mb-2">Category</label>
              <select name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white">
                <option value="">Select Category</option>
                <option value="journal">Journal</option>
                <option value="conference">Conference</option>
                <option value="preprint">Preprint</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = ['dashboard', 'analytics', 'projects', 'publications', 'authors', 'team', 'news', 'site-settings', 'backups', 'database', 'system', 'users'];

  return (
    <section className="py-20 bg-drone-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <h1 className="font-orbitron text-4xl font-bold text-white flex-1">
            Master <span className="text-gradient">Control Panel</span>
          </h1>
          
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} mr-2`}></i>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            <i className="fas fa-language mr-2"></i>
            {language === 'en' ? 'HI' : 'EN'}
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400">
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFormData({});
                setEditingId(null);
                setVersions([]);
                setLiveVersion(null);
                setAuthorSearchTerm('');
              }}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === tab
                  ? 'bg-drone-blue text-white shadow-lg shadow-drone-blue/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'database' && renderDatabaseViewer()}
        {activeTab === 'system' && renderSystemInfo()}

        {(activeTab === 'projects' || activeTab === 'publications' || activeTab === 'authors' || activeTab === 'team' || activeTab === 'news' || activeTab === 'site-settings' || activeTab === 'users') && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-drone-gray p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4">
                {activeTab === 'site-settings' ? 'Site Settings' : 
                 activeTab === 'users' ? 'Add New User' : 
                 activeTab === 'authors' ? (editingId ? 'Edit Author' : 'Add New Author') : 
                 editingId ? 'Edit Content' : 'Add New Content'}
              </h2>
              {activeTab === 'publications' && !editingId && (
                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  className="mb-4 px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500 hover:text-white transition-all"
                >
                  <i className="fas fa-magic mr-2"></i>
                  Import from Google Scholar
                </button>
              )}
              <form onSubmit={handleSubmit}>
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Project Title</label>
                      <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Description</label>
                      <textarea name="description" value={formData.description || ''} onChange={handleInputChange} required rows="4" className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2">Category</label>
                        <select name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white">
                          <option value="">Select Category</option>
                          <option value="Autonomy">Autonomy</option>
                          <option value="Swarm">Swarm</option>
                          <option value="Vision">Vision</option>
                          <option value="Energy">Energy</option>
                          <option value="Communication">Communication</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white mb-2">Status</label>
                        <select name="status" value={formData.status || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white">
                          <option value="">Select Status</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="planned">Planned</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white mb-2">Project Image</label>
                      <PhotoUpload onPhotoUploaded={handlePhotoUploaded} currentPhoto={formData.imageUrl} />
                      {formData.imageUrl && (
                        <input type="hidden" name="imageUrl" value={formData.imageUrl} />
                      )}
                    </div>
                    <div>
                      <label className="block text-white mb-2">Technologies (comma-separated)</label>
                      <input type="text" name="technologies" value={formData.technologies?.join(', ') || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
                    </div>
                  </div>
                )}
                
                {(activeTab === 'publications' || activeTab === 'team' || activeTab === 'news' || activeTab === 'site-settings') && renderFullForm()}

                {activeTab === 'authors' && renderAuthorsForm()}
                
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Username</label>
                      <input type="text" name="username" value={formData.username || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Email</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Password</label>
                      <input type="password" name="password" value={formData.password || ''} onChange={handleInputChange} required className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Role</label>
                      <select name="role" value={formData.role || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white">
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button type="submit" className="flex-1 py-3 bg-drone-blue text-white rounded-lg hover:bg-drone-cyan transition-colors">
                    {activeTab === 'site-settings' ? 'Save Settings' : 
                     activeTab === 'authors' ? (editingId ? 'Update Author' : 'Add Author') : 
                     editingId ? 'Update' : 'Save'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              
              {renderVersionControl()}
            </div>

            <div className="bg-drone-gray p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4">
                {activeTab === 'users' ? 'Existing Users' : 
                 activeTab === 'site-settings' ? 'Settings History' : 
                 activeTab === 'authors' ? 'Existing Authors' : 
                 'Existing Content'}
              </h2>
              
              {activeTab === 'site-settings' && settings && (
                <div className="bg-drone-dark p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Current Active Settings</h3>
                      <p className="text-gray-400 text-sm">
                        Last Updated: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {activeTab === 'projects' && projects.map((item) => (
                  <div key={item._id} className="bg-drone-dark p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.category} • {item.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleVisibility(item._id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            item.isVisible !== false 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' 
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white'
                          }`}
                          title={item.isVisible !== false ? 'Visible - Click to hide' : 'Hidden - Click to show'}
                        >
                          <i className={`fas ${item.isVisible !== false ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                        <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-drone-blue/20 text-drone-blue rounded hover:bg-drone-blue hover:text-white text-sm">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'publications' && publications.map((item) => (
                  <div key={item._id} className="bg-drone-dark p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.journal} • {item.year}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleVisibility(item._id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            item.isVisible !== false 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' 
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white'
                          }`}
                          title={item.isVisible !== false ? 'Visible - Click to hide' : 'Hidden - Click to show'}
                        >
                          <i className={`fas ${item.isVisible !== false ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                        <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-drone-blue/20 text-drone-blue rounded hover:bg-drone-blue hover:text-white text-sm">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'authors' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Search authors by name or email..."
                      value={authorSearchTerm}
                      onChange={(e) => setAuthorSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white mb-4"
                    />
                    {authors
                      .filter(a => 
                        a.name.toLowerCase().includes(authorSearchTerm.toLowerCase()) ||
                        a.email.toLowerCase().includes(authorSearchTerm.toLowerCase())
                      )
                      .map((author) => (
                        <div key={author._id} className="bg-drone-dark p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-medium">{author.name}</h3>
                              <p className="text-gray-400 text-sm">{author.email}</p>
                              {author.institution && (
                                <p className="text-gray-500 text-xs mt-1">{author.institution}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleVisibility(author._id)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                  author.isVisible !== false 
                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' 
                                    : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white'
                                }`}
                                title={author.isVisible !== false ? 'Visible - Click to hide' : 'Hidden - Click to show'}
                              >
                                <i className={`fas ${author.isVisible !== false ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                              </button>
                              <button
                                onClick={() => handleEditAuthor(author)}
                                className="px-3 py-1 bg-drone-blue/20 text-drone-blue rounded hover:bg-drone-blue hover:text-white transition-colors text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAuthor(author._id)}
                                className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {activeTab === 'team' && teamMembers.map((item) => (
                  <div key={item._id} className="bg-drone-dark p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleVisibility(item._id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            item.isVisible !== false 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' 
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white'
                          }`}
                          title={item.isVisible !== false ? 'Visible - Click to hide' : 'Hidden - Click to show'}
                        >
                          <i className={`fas ${item.isVisible !== false ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                        <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-drone-blue/20 text-drone-blue rounded hover:bg-drone-blue hover:text-white text-sm">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'news' && news.map((item) => (
                  <div key={item._id} className="bg-drone-dark p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleVisibility(item._id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            item.isVisible !== false 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' 
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white'
                          }`}
                          title={item.isVisible !== false ? 'Visible - Click to hide' : 'Hidden - Click to show'}
                        >
                          <i className={`fas ${item.isVisible !== false ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                        <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-drone-blue/20 text-drone-blue rounded hover:bg-drone-blue hover:text-white text-sm">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'users' && users.map((user) => (
                  <div key={user._id} className="bg-drone-dark p-4 rounded-lg">
                    <h3 className="text-white font-medium">{user.username}</h3>
                    <p className="text-gray-400 text-sm">{user.email} • {user.role}</p>
                    <button onClick={() => handleDelete(user._id)} className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-drone-gray rounded-2xl border border-white/20 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Import from Google Scholar</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm">Google Scholar Profile URL (Required)</label>
                <input
                  type="text"
                  value={importAuthorName}
                  onChange={(e) => setImportAuthorName(e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=YOUR_ID"
                  className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm">Start Year</label>
                <input
                  type="number"
                  value={importStartYear}
                  onChange={(e) => setImportStartYear(parseInt(e.target.value))}
                  min="2000"
                  max="2026"
                  className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white"
                />
              </div>
              
              <button
                onClick={handleImportPublications}
                disabled={importLoading}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {importLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    Importing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-download"></i>
                    Import Publications
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Site Backups</h2>
            <button
              onClick={() => setShowBackupModal(true)}
              className="px-6 py-3 bg-drone-blue text-white rounded-lg font-medium hover:bg-drone-cyan transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Create New Backup
            </button>
          </div>

          <div className="grid gap-4">
            {backups.length === 0 ? (
              <div className="bg-drone-gray p-8 rounded-2xl text-center">
                <i className="fas fa-database text-4xl text-gray-500 mb-3"></i>
                <p className="text-gray-400">No backups created yet</p>
              </div>
            ) : (
              backups.map((backup) => (
                <div key={backup._id} className="bg-drone-gray p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{backup.backupName}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(backup.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRestoreBackup(backup._id)}
                        disabled={restoreLoading}
                        className="px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        <i className="fas fa-undo mr-1"></i>
                        Restore
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup._id)}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-drone-gray rounded-2xl border border-white/20 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Create Backup</h3>
              <button onClick={() => setShowBackupModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm">Backup Name (optional)</label>
                <input
                  type="text"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="e.g., Before major update"
                  className="w-full px-4 py-2 bg-drone-dark border border-white/20 rounded-lg text-white"
                />
              </div>
              <button
                onClick={handleCreateBackup}
                className="w-full py-3 bg-drone-blue text-white rounded-lg font-medium hover:bg-drone-cyan transition-colors"
              >
                <i className="fas fa-save mr-2"></i>
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;