// src/data/gallery.ts
// Gallery data for GalleryPage - uses same R2 structure

const R2_BASE_URL = 'https://images.vaipuk.com';

// Helper to format folder name for display
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

// Define trips here - folder name determines display name
// Cover is always cover.jpg in each folder
export const GALLERY_DATA: LocationAlbum[] = [
    {
        id: 'italy-2024',
        folder: 'Italy-2024',
        name: formatTripName('Italy-2024'),
        coverImage: `${R2_BASE_URL}/trips/Italy-2024/cover.jpg`,
        images: [
            { id: 'it-1', src: `${R2_BASE_URL}/trips/Italy-2024/lake-como.jpg`, orientation: 'landscape' },
            { id: 'it-2', src: `${R2_BASE_URL}/trips/Italy-2024/varenna.jpg`, orientation: 'portrait' },
            { id: 'it-3', src: `${R2_BASE_URL}/trips/Italy-2024/view.jpg`, orientation: 'landscape' },
        ]
    },
    {
        id: 'nyc-2023',
        folder: 'NYC-2023',
        name: formatTripName('NYC-2023'),
        coverImage: `${R2_BASE_URL}/trips/NYC-2023/cover.jpg`,
        images: [
            { id: 'ny-1', src: `${R2_BASE_URL}/trips/NYC-2023/brooklyn-bridge.jpg`, orientation: 'landscape' },
            { id: 'ny-2', src: `${R2_BASE_URL}/trips/NYC-2023/skyline.jpg`, orientation: 'portrait' },
        ]
    },
    {
        id: 'sf-2024',
        folder: 'SF-2024',
        name: formatTripName('SF-2024'),
        coverImage: `${R2_BASE_URL}/trips/SF-2024/cover.jpg`,
        images: [
            { id: 'sf-1', src: `${R2_BASE_URL}/trips/SF-2024/golden-gate.jpg`, orientation: 'landscape' },
        ]
    },
];

// Helper to get all photos with trip name as description
export const getAllPhotosWithTripName = () => {
    return GALLERY_DATA.flatMap(trip =>
        trip.images.map(img => ({
            src: img.src,
            location: trip.name,
            date: ''
        }))
    );
};
