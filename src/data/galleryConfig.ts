// src/data/galleryConfig.ts
// UPDATE: Replace with your R2 custom domain once configured
const R2_BASE_URL = ''; // e.g., 'https://images.vaipuk.com'

// Fallback to local images when R2 is not configured
const useLocal = R2_BASE_URL === '';
const baseUrl = useLocal ? '' : R2_BASE_URL;

export interface Trip {
    name: string;
    coverImage: string;
    photoCount: number;
    photos: string[];
}

export interface GalleryImage {
    src: string;
    location: string;
    date: string;
    alt?: string;
}

// Trip-based gallery for the Gallery Page
export const trips: Trip[] = [
    {
        name: "Italy",
        coverImage: useLocal ? "/photos/italy.png" : `${baseUrl}/trips/italy-2024/lake-como.jpg`,
        photoCount: 3,
        photos: useLocal
            ? ["/photos/italy.png", "/photos/italy_portrait.png"]
            : [
                `${baseUrl}/trips/italy-2024/lake-como.jpg`,
                `${baseUrl}/trips/italy-2024/venice.jpg`,
                `${baseUrl}/trips/italy-2024/rome.jpg`,
            ]
    },
    {
        name: "New York",
        coverImage: useLocal ? "/photos/nyc.png" : `${baseUrl}/trips/nyc-2023/times-square.jpg`,
        photoCount: 2,
        photos: useLocal
            ? ["/photos/nyc.png", "/photos/nyc_portrait.png"]
            : [
                `${baseUrl}/trips/nyc-2023/times-square.jpg`,
                `${baseUrl}/trips/nyc-2023/brooklyn-bridge.jpg`,
            ]
    },
    {
        name: "San Francisco",
        coverImage: useLocal ? "/photos/sf.png" : `${baseUrl}/trips/sf-2024/golden-gate.jpg`,
        photoCount: 1,
        photos: useLocal
            ? ["/photos/sf.png"]
            : [`${baseUrl}/trips/sf-2024/golden-gate.jpg`]
    },
];

// Homepage slideshow images (PhotoTile)
export const galleryImages: GalleryImage[] = [
    {
        src: useLocal ? "/gallery-1.png" : `${baseUrl}/gallery/mountain-trek-2025.jpg`,
        location: "Mountain Summit",
        date: "January 2025"
    },
    {
        src: useLocal ? "/gallery-2.png" : `${baseUrl}/gallery/home-studio-2024.jpg`,
        location: "Home Studio",
        date: "December 2024"
    },
    {
        src: useLocal ? "/gallery-3.png" : `${baseUrl}/gallery/city-night-2024.jpg`,
        location: "City Lights",
        date: "November 2024"
    },
];
