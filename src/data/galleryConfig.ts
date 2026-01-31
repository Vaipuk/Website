// src/data/galleryConfig.ts
// Dynamic trip-based gallery configuration
// 
// FOLDER STRUCTURE IN R2:
// trips/
//   Chicago-2026/
//     cover.jpg      <- Always the cover image
//     photo1.jpg     <- Other photos (any name)
//     photo2.jpg
//   Italy-2024/
//     cover.jpg
//     ...

const R2_BASE_URL = 'https://images.vaipuk.com';

export interface Trip {
    folder: string;      // Folder name (e.g., "Chicago-2026")
    name: string;        // Display name extracted from folder
    coverImage: string;  // Always {folder}/cover.jpg
    photos: string[];    // All photos in this trip
}

// Helper to format folder name for display
// "Chicago-2026" -> "Chicago 2026"
const formatTripName = (folder: string): string => {
    return folder.replace(/-/g, ' ');
};

// Define your trips here - just add folder name and photo filenames
// Cover is always cover.jpg, no descriptions needed
export const trips: Trip[] = [
    {
        folder: 'Italy-2024',
        name: formatTripName('Italy-2024'),
        coverImage: `${R2_BASE_URL}/trips/Italy-2024/cover.jpg`,
        photos: [
            `${R2_BASE_URL}/trips/Italy-2024/lake-como.jpg`,
            `${R2_BASE_URL}/trips/Italy-2024/varenna.jpg`,
            `${R2_BASE_URL}/trips/Italy-2024/view.jpg`,
        ]
    },
    {
        folder: 'NYC-2023',
        name: formatTripName('NYC-2023'),
        coverImage: `${R2_BASE_URL}/trips/NYC-2023/cover.jpg`,
        photos: [
            `${R2_BASE_URL}/trips/NYC-2023/brooklyn-bridge.jpg`,
            `${R2_BASE_URL}/trips/NYC-2023/skyline.jpg`,
        ]
    },
    {
        folder: 'SF-2024',
        name: formatTripName('SF-2024'),
        coverImage: `${R2_BASE_URL}/trips/SF-2024/cover.jpg`,
        photos: [
            `${R2_BASE_URL}/trips/SF-2024/golden-gate.jpg`,
        ]
    },
];

// ===== AUTO-GENERATED FOR CAROUSELS =====

// Collect all photos from all trips
const allPhotos = trips.flatMap(trip =>
    trip.photos.map(photo => ({
        src: photo,
        location: trip.name  // Description = trip name
    }))
);

// Shuffle function for random selection
const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Pick 5 random photos for carousels (homepage + gallery hero)
export const getRandomGalleryImages = (count: number = 5) => {
    return shuffle(allPhotos).slice(0, count);
};

// Static export for components that need stable data
export const galleryImages = allPhotos.slice(0, 5).map(p => ({
    src: p.src,
    location: p.location,
    date: ''  // Not used anymore
}));
