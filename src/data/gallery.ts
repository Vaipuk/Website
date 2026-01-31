// src/data/gallery.ts
// Gallery data for GalleryPage - fetches from R2 manifest

const R2_BASE_URL = 'https://images.vaipuk.com';

// Format folder name: "Chicago-2026" -> "Chicago 2026"
const formatTripName = (folder: string): string => {
    return folder.replace(/-/g, ' ');
};

export interface GalleryImage {
    id: string;
    src: string;
    orientation: 'landscape' | 'portrait';
}

export interface LocationAlbum {
    id: string;
    name: string;
    folder: string;
    coverImage: string;
    images: GalleryImage[];
}

// Build location from manifest entry
const buildLocation = (entry: { folder: string; photos: string[] }): LocationAlbum => ({
    id: entry.folder.toLowerCase(),
    name: formatTripName(entry.folder),
    folder: entry.folder,
    coverImage: `${R2_BASE_URL}/trips/${entry.folder}/cover.JPG`,
    images: entry.photos.map((photo, idx) => ({
        id: `${entry.folder}-${idx}`,
        src: `${R2_BASE_URL}/trips/${entry.folder}/${photo}`,
        orientation: 'landscape' as const // Default, can be detected client-side if needed
    }))
});

// Fetch gallery data from R2 manifest
export const fetchGalleryData = async (): Promise<LocationAlbum[]> => {
    try {
        const response = await fetch(`${R2_BASE_URL}/manifest.json`);
        const manifest = await response.json();
        return manifest.trips.map(buildLocation);
    } catch (error) {
        console.error('Failed to load gallery:', error);
        return [];
    }
};

// For static/SSR fallback - empty by default, populated by fetch
export let GALLERY_DATA: LocationAlbum[] = [];

// Initialize on module load (for client-side)
if (typeof window !== 'undefined') {
    fetchGalleryData().then(data => {
        GALLERY_DATA = data;
    });
}

// Get all photos with trip name as location
export const getAllPhotosWithTripName = (locations: LocationAlbum[]) => {
    return locations.flatMap(loc =>
        loc.images.map(img => ({
            src: img.src,
            location: loc.name,
            date: ''
        }))
    );
};
