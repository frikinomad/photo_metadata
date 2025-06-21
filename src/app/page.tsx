"use client";

import React, { useState, useRef } from 'react';
import { Camera, Search, Tag, Mic, FileImage, X, Plus, MessageCircle } from 'lucide-react';

export default function PhotoMemoryApp() {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1577036421869-7c8d388d2123?w=300&h=300&fit=crop',
      tags: ['family', 'kitchen', 'mom'],
      description: 'Mom cooking Sunday dinner',
      date: '2024-06-20',
      aiTags: ['cooking', 'home', 'people']
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=300&fit=crop',
      tags: ['food', 'restaurant'],
      description: 'Amazing pasta at downtown restaurant',
      date: '2024-06-19',
      aiTags: ['food', 'dining', 'pasta']
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
      tags: ['nature', 'hiking'],
      description: 'Mountain hike with friends',
      date: '2024-06-18',
      aiTags: ['landscape', 'outdoor', 'mountains']
    }
  ]);
  
  const [currentView, setCurrentView] = useState('gallery'); // 'gallery', 'camera', 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);

  const filteredPhotos = photos.filter(photo => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      photo.tags.some(tag => tag.toLowerCase().includes(query)) ||
      photo.description.toLowerCase().includes(query) ||
      photo.aiTags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handlePhotoUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewPhotoUrl(url);
      setShowTagModal(true);
    }
  };

  const savePhoto = () => {
    if (newPhotoUrl) {
      const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const aiTags = ['ai-generated', 'auto-tagged']; // Mock AI tags
      
      const newPhoto = {
        id: Date.now(),
        url: newPhotoUrl,
        tags,
        description: newDescription,
        date: new Date().toISOString().split('T')[0],
        aiTags
      };
      
      setPhotos([newPhoto, ...photos]);
      setShowTagModal(false);
      setNewPhotoUrl('');
      setNewTags('');
      setNewDescription('');
      setCurrentView('gallery');
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setNewDescription('Family dinner at home');
      setNewTags('family, dinner, home');
      setIsListening(false);
    }, 2000);
  };

  const handleNaturalLanguageSearch = (query: any) => {
    // Mock natural language processing
    const nlpMappings = {
      'family kitchen': 'family kitchen mom',
      'food photos': 'food restaurant dining',
      'outdoor pictures': 'nature hiking outdoor mountains',
      'with mom': 'mom family',
      'last week': ''
    };
    
    let processedQuery = query.toLowerCase();
    Object.keys(nlpMappings).forEach(key => {
      if (processedQuery.includes(key)) {
        processedQuery = nlpMappings[key] as any;
      }
    });
    
    setSearchQuery(processedQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">PhotoMemory</h1>
          <p className="text-sm text-gray-600 text-center mt-1">AI-powered photo organization</p>
        </div>
      </div>
  
      {/* Navigation */}
      <div className="max-w-md mx-auto bg-white border-b">
        <div className="flex justify-around py-3">
          <button
            onClick={() => setCurrentView('gallery')}
            className={`flex flex-col items-center px-4 py-2 rounded-lg ${
              currentView === 'gallery' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            <FileImage size={20} />
            <span className="text-xs mt-1">Gallery</span>
          </button>
          <button
            onClick={() => fileInputRef.current}
            className="flex flex-col items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Camera size={20} />
            <span className="text-xs mt-1">Add Photo</span>
          </button>
          <button
            onClick={() => setCurrentView('search')}
            className={`flex flex-col items-center px-4 py-2 rounded-lg ${
              currentView === 'search' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">Search</span>
          </button>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {currentView === 'gallery' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.description}
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-200">
                    <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-medium truncate">{photo.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {photo.tags.slice(0, 2).map((tag) => (
                          <span key={photo.id + tag} className="text-xs bg-blue-500 px-1 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {currentView === 'search' && (
          <div className="p-4">
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search your photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Try natural language:</p>
                <div className="flex flex-wrap gap-2">
                  {['family kitchen photos', 'food pictures', 'outdoor photos', 'with mom'].map((query) => (
                    <button
                      key={query}
                      onClick={() => handleNaturalLanguageSearch(query)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-3">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt={photo.description}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 truncate">{photo.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {photo.tags.map((tag) => (
                        <span key={photo.id + tag} className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
  
      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tag Your Photo</h3>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
  
            {newPhotoUrl && (
              <img
                src={newPhotoUrl}
                alt="New photo"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
  
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="What's this photo about?"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={simulateVoiceInput}
                    className={`px-3 py-2 rounded-lg ${
                      isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                </div>
                {isListening && (
                  <p className="text-xs text-red-500 mt-1">Listening... (simulated)</p>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="family, kitchen, mom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
  
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTagModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={savePhoto}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Chat Interface Hint */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );  
}