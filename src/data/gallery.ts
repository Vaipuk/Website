// R2 Configuration - Set your custom domain here once configured
const R2_BASE_URL = ''; // e.g., 'https://images.vaipuk.com'
const useLocal = R2_BASE_URL === '';
const baseUrl = useLocal ? '' : R2_BASE_URL;

// Helper to get image path (local or R2)
const img = (localPath: string, r2Path?: string): string => {
    if (useLocal || !r2Path) return localPath;
    return `${baseUrl}${r2Path}`;
};

export interface GalleryImage {
    id: string;
    src: string;
    orientation: 'landscape' | 'portrait';
    caption?: string;
}

export interface LocationAlbum {
    id: string;
    name: string;
    coverId: string;
    description: string;
    images: GalleryImage[];
}

export const GALLERY_DATA: LocationAlbum[] = [
    {
        id: 'italy',
        name: 'Italy',
        coverId: 'it-1',
        description: 'Summer days in Varenna and Lake Como.',
        images: [
            { id: 'it-1', src: img('/photos/italy.png', '/trips/italy-2024/lake-como.jpg'), orientation: 'landscape', caption: 'Lake Como at sunset' },
            { id: 'it-2', src: img('/photos/italy_portrait.png', '/trips/italy-2024/varenna.jpg'), orientation: 'portrait', caption: 'Varenna Streets' },
            { id: 'it-3', src: img('/photos/landscape.png', '/trips/italy-2024/view.jpg'), orientation: 'landscape', caption: 'Varenna View' },
        ]
    },
    {
        id: 'france',
        name: 'France',
        coverId: 'fr-1',
        description: 'Cafe culture and Parisian nights.',
        images: [
            { id: 'fr-1', src: img('/photos/france.png', '/trips/france-2024/paris.jpg'), orientation: 'landscape', caption: 'Paris Street' },
            { id: 'fr-2', src: img('/photos/italy_portrait.png', '/trips/france-2024/architecture.jpg'), orientation: 'portrait', caption: 'Architecture Detail' },
            { id: 'fr-3', src: img('/photos/workspace.png', '/trips/france-2024/coffee.jpg'), orientation: 'landscape', caption: 'Morning Coffee' },
        ]
    },
    {
        id: 'nyc',
        name: 'New York',
        coverId: 'ny-1',
        description: 'Concrete jungle where dreams are made of.',
        images: [
            { id: 'ny-1', src: img('/photos/nyc.png', '/trips/nyc-2023/brooklyn-bridge.jpg'), orientation: 'landscape', caption: 'Brooklyn Bridge' },
            { id: 'ny-2', src: img('/photos/nyc_portrait.png', '/trips/nyc-2023/skyscrapers.jpg'), orientation: 'portrait', caption: 'Skyscrapers' },
            { id: 'ny-3', src: img('/photos/city.png', '/trips/nyc-2023/times-square.jpg'), orientation: 'landscape', caption: 'Times Square' },
        ]
    },
    {
        id: 'sf',
        name: 'San Francisco',
        coverId: 'sf-1',
        description: 'Foggy mornings and golden sunsets.',
        images: [
            { id: 'sf-1', src: img('/photos/sf.png', '/trips/sf-2024/golden-gate.jpg'), orientation: 'landscape', caption: 'Golden Gate' },
            { id: 'sf-2', src: img('/photos/nyc_portrait.png', '/trips/sf-2024/downtown.jpg'), orientation: 'portrait', caption: 'Downtown View' },
        ]
    },
    {
        id: 'seattle',
        name: 'Seattle',
        coverId: 'sea-1',
        description: 'Emerald City vibes.',
        images: [
            { id: 'sea-1', src: img('/photos/seattle.png', '/trips/seattle-2024/space-needle.jpg'), orientation: 'portrait', caption: 'Space Needle' },
            { id: 'sea-2', src: img('/photos/workspace.png', '/trips/seattle-2024/coffee.jpg'), orientation: 'landscape', caption: 'Coffee Shop Mode' },
        ]
    }
];
