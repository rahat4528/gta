import { useState } from 'react';
import { Heart, X, MapPin, Share2 } from 'lucide-react';
import { useOSStore } from '../../stores/useOSStore';

export function GalleryApp() {
  const { photos, activePhotoId, setActivePhotoId, toggleFavoritePhoto } = useOSStore();
  const [filter, setFilter] = useState<'all' | 'favorites' | 'nature' | 'city'>('all');

  const activePhoto = photos.find((p) => p.id === activePhotoId);

  const filteredPhotos = photos.filter((p) => {
    if (filter === 'favorites') return p.isFavorite;
    if (filter === 'nature') return p.category === 'nature';
    if (filter === 'city') return p.category === 'city';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-black text-white select-none overflow-hidden">
      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-between p-4">
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <button
              onClick={() => setActivePhotoId(null)}
              className="p-2 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-xs font-semibold block">{activePhoto.title}</span>
              <span className="text-[10px] text-neutral-400">{activePhoto.date}</span>
            </div>
            <button
              onClick={() => toggleFavoritePhoto(activePhoto.id)}
              className={`p-2 rounded-full bg-neutral-800/80 transition-colors ${
                activePhoto.isFavorite ? 'text-ios-red' : 'text-neutral-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${activePhoto.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Center Image */}
          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden rounded-2xl">
            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Footer Metadata */}
          <div className="bg-neutral-900/80 backdrop-blur rounded-2xl p-3 flex items-center justify-between text-xs text-neutral-300">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-ios-blue" />
              <span>{activePhoto.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Main Gallery Grid */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold tracking-tight">Photos</h1>
          <span className="text-xs text-neutral-400">{filteredPhotos.length} Items</span>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 mb-3 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'favorites', label: 'Favorites' },
            { id: 'city', label: 'City' },
            { id: 'nature', label: 'Nature' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                filter === f.id
                  ? 'bg-white text-black shadow'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 2-column Photo Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 gap-2 content-start">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoId(photo.id)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-neutral-900"
            >
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {photo.isFavorite && (
                <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-ios-red">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                <span className="text-[10px] font-semibold text-white truncate">
                  {photo.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
