import React, { useState, useRef } from 'react';
import { Camera, MapPin, Mic, MicOff, Shield } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTranslation } from '../utils/translations';
import { Issue, Language } from '../types';
import { categories } from '../data/mockData';
import toast from 'react-hot-toast';

interface ReportIssueProps {
  language: Language;
  onSubmit: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'publicComments'>) => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ language, onSubmit }) => {
  const t = useTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isAnonymous: false,
    photos: [] as string[],
    location: {
      lat: 0,
      lng: 0,
      address: ''
    }
  });
  
  const { latitude, longitude, error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation();
  const { 
    isListening, 
    transcript, 
    error: speechError, 
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition(language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update location when geolocation data changes
  React.useEffect(() => {
    if (latitude && longitude) {
      // Reverse geocoding simulation (in real app, use Google Maps Geocoding API)
      const simulatedAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Ahmedabad, Gujarat`;
      setFormData(prev => ({
        ...prev,
        location: {
          lat: latitude,
          lng: longitude,
          address: simulatedAddress
        }
      }));
    }
  }, [latitude, longitude]);

  // Update description when speech recognition provides transcript
  React.useEffect(() => {
    if (transcript) {
      setFormData(prev => ({
        ...prev,
        description: prev.description + (prev.description ? ' ' : '') + transcript
      }));
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setFormData(prev => ({
              ...prev,
              photos: [...prev.photos, result]
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.location.lat || !formData.location.lng) {
      toast.error('Please enable location access or manually set your location');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newIssue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'publicComments'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location,
        photos: formData.photos,
        status: 'submitted',
        priority: 'medium', // Default priority
        isAnonymous: formData.isAnonymous,
        reporterId: formData.isAnonymous ? undefined : 'current-user'
      };

      await onSubmit(newIssue);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        isAnonymous: false,
        photos: [],
        location: { lat: 0, lng: 0, address: '' }
      });
      
      toast.success('Issue reported successfully!');
    } catch (error) {
      toast.error('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('report_issue')}</h1>
            <p className="text-gray-600">Help improve your community by reporting civic issues</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('issue_title')} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief title describing the issue"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('category')} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Description with Voice Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('description')} *
              </label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  placeholder="Detailed description of the issue"
                  rows={4}
                  required
                />
                
                {/* Voice Input Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isListening ? 'Stop recording' : t('voice_input')}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
              </div>
              
              {isListening && (
                <p className="text-sm text-red-600 mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                  Listening...
                </p>
              )}
              
              {speechError && (
                <p className="text-sm text-red-600 mt-2">Voice input error: {speechError}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('location')} *
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={geoLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{geoLoading ? 'Getting location...' : 'Auto-detect Location'}</span>
                </button>
                
                {formData.location.address && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {formData.location.address}
                    </p>
                  </div>
                )}
                
                {geoError && (
                  <p className="text-sm text-red-600">Location error: {geoError}</p>
                )}
                
                {/* Manual Location Input */}
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Or enter location manually"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Add Photos</span>
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {/* Photo Preview */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Options */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Privacy Options</h3>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{t('anonymous')}</span>
                </div>
              </label>
              <p className="text-xs text-gray-600 mt-2 ml-7">
                Your personal information will not be displayed publicly
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{isSubmitting ? 'Submitting...' : t('submit')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;