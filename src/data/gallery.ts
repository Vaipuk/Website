export interface GalleryImage {
    id: string;
    src: string;
    orientation: 'landscape' | 'portrait';
    caption?: string;
}

export interface LocationAlbum {
    id: string;
    name: string;
    coverId: string; // references an image id
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
            { id: 'it-1', src: '/photos/italy.png', orientation: 'landscape', caption: 'Lake Como at sunset' },
            { id: 'it-2', src: '/photos/italy_portrait.png', orientation: 'portrait', caption: 'Varenna Streets' },
            { id: 'it-3', src: '/photos/landscape.png', orientation: 'landscape', caption: 'Varenna View' },
        ]
    },
    {
        id: 'france',
        name: 'France',
        coverId: 'fr-1',
        description: 'Cafe culture and Parisian nights.',
        images: [
            { id: 'fr-1', src: '/photos/france.png', orientation: 'landscape', caption: 'Paris Street' },
            { id: 'fr-2', src: '/photos/italy_portrait.png', orientation: 'portrait', caption: 'Architecture Detail' }, // Reusing for demo
            { id: 'fr-3', src: '/photos/workspace.png', orientation: 'landscape', caption: 'Morning Coffee' },
        ]
    },
    {
        id: 'nyc',
        name: 'New York',
        coverId: 'ny-1',
        description: 'Concrete jungle where dreams are made of.',
        images: [
            { id: 'ny-1', src: '/photos/nyc.png', orientation: 'landscape', caption: 'Brooklyn Bridge' },
            { id: 'ny-2', src: '/photos/nyc_portrait.png', orientation: 'portrait', caption: 'Skyscrapers' },
            { id: 'ny-3', src: '/photos/city.png', orientation: 'landscape', caption: 'Times Square' },
        ]
    },
    {
        id: 'sf',
        name: 'San Francisco',
        coverId: 'sf-1',
        description: 'Foggy mornings and golden sunsets.',
        images: [
            { id: 'sf-1', src: '/photos/sf.png', orientation: 'landscape', caption: 'Golden Gate' },
            { id: 'sf-2', src: '/photos/nyc_portrait.png', orientation: 'portrait', caption: 'Downtown View' }, // Partial reuse
        ]
    },
    {
        id: 'seattle',
        name: 'Seattle',
        coverId: 'sea-1',
        description: 'Emerald City vibes.',
        images: [
            { id: 'sea-1', src: '/photos/seattle.png', orientation: 'portrait', caption: 'Space Needle' }, // Actually square-ish but portrait works well for focus
            { id: 'sea-2', src: '/photos/workspace.png', orientation: 'landscape', caption: 'Coffee Shop Mode' },
        ]
    }
];
