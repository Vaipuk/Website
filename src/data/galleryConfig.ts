// src/data/galleryConfig.ts
// 
// DYNAMIC GALLERY SYSTEM
// -----------------------
// The site fetches trips from R2's manifest.json file
// 
// R2 STRUCTURE:
// vaipuk-gallery/
//   manifest.json        ← Lists all trip folders
//   trips/
//     Chicago-2026/
//       cover.jpg        ← Cover image (required)
//       photo1.jpg       ← Other photos (any name)
//       photo2.jpg
//     Italy-2024/
//       cover.jpg
//       ...
//
// MANIFEST.JSON FORMAT:
// {
//   "trips": [
//     { "folder": "Chicago-2026", "photos": ["photo1.jpg", "photo2.jpg"] },
//     { "folder": "Italy-2024", "photos": ["lake-como.jpg", "varenna.jpg"] }
//   ]
// }

const R2_BASE_URL = 'https://images.vaipuk.com';

export interface Trip {
    folder: string;
    name: string;
    coverImage: string;
    photos: string[];
}

export interface GalleryImage {
    src: string;
    location: string;
    date: string;
}

// Format folder name for display: "Chicago-2026" -> "Chicago 2026"
const formatTripName = (folder: string): string => {
    return folder.replace(/-/g, ' ');
};

// Build trip data from manifest entry
const buildTrip = (entry: { folder: string; photos: string[] }): Trip => ({
    folder: entry.folder,
    name: formatTripName(entry.folder),
    coverImage: `${R2_BASE_URL}/trips/${entry.folder}/cover.JPG`,
    photos: entry.photos.map(p => `${R2_BASE_URL}/trips/${entry.folder}/${p}`)
});

// Fetch trips dynamically from R2 manifest
export const fetchTrips = async (): Promise<Trip[]> => {
    try {
        const response = await fetch(`${R2_BASE_URL}/manifest.json`);
        const manifest = await response.json();
        return manifest.trips.map(buildTrip);
    } catch (error) {
        console.error('Failed to load gallery manifest:', error);
        return [];
    }
};

// Get random images for carousel from trips
export const getRandomImages = (trips: Trip[], count: number = 5): GalleryImage[] => {
    const allPhotos = trips.flatMap(trip =>
        trip.photos.map(src => ({
            src,
            location: trip.name,
            date: ''
        }))
    );

    // Shuffle and take first N
    for (let i = allPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPhotos[i], allPhotos[j]] = [allPhotos[j], allPhotos[i]];
    }

    return allPhotos.slice(0, count);
};
