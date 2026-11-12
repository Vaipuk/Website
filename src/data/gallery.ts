const R2_BASE_URL = 'https://images.vaipuk.com';

export interface GalleryImage {
    id: string;
    src: string;
    thumbnail?: string;
    orientation: 'landscape' | 'portrait';
}

export interface LocationAlbum {
    id: string;
    name: string;
    folder: string;
    coverImage: string;
    images: GalleryImage[];
}

const LOCAL_TRIPS = [
    { folder: 'Italy-2024', photos: ['DSC00458.JPG', 'DSC00474.JPG', 'DSC00494.JPG'] },
    { folder: 'France-2025', photos: ['DSC00458.JPG', 'DSC00474.JPG', 'DSC00487.JPG'] },
    { folder: 'New York-2025', photos: ['DSC00458.JPG', 'DSC00487.JPG', 'DSC00494.JPG'] },
];

export const LOCAL_GALLERY: LocationAlbum[] = LOCAL_TRIPS.map(({ folder, photos }) => ({
    id: folder.toLowerCase(),
    name: folder.replace(/-/g, ' '),
    folder,
    coverImage: `/thumbnails/trips/${encodeURIComponent(folder)}/cover.webp`,
    images: photos.map((photo, index) => ({
        id: `${folder}-${index}`,
        src: `/trips/${encodeURIComponent(folder)}/${photo}`,
        thumbnail: `/thumbnails/trips/${encodeURIComponent(folder)}/${photo.replace(/\.[^.]+$/, '.webp')}`,
        orientation: 'landscape',
    })),
}));

const isPathSegment = (value: unknown): value is string =>
    typeof value === 'string' && value.length > 0 && value !== '.' && value !== '..' &&
    !/[/\\?#]/.test(value) && Array.from(value).every(character => character.charCodeAt(0) >= 32);

let pending: Promise<LocationAlbum[]> | null = null;

export function fetchGalleryData(): Promise<LocationAlbum[]> {
    if (pending) return pending;
    pending = (async () => {
        try {
            const response = await fetch(`${R2_BASE_URL}/manifest.json`, { signal: AbortSignal.timeout(5000) });
            if (!response.ok) return LOCAL_GALLERY;
            const manifest: unknown = await response.json();
            if (!manifest || typeof manifest !== 'object' || !('trips' in manifest) || !Array.isArray(manifest.trips)) return LOCAL_GALLERY;
            const albums: LocationAlbum[] = [];
            for (const trip of manifest.trips) {
                if (!trip || !isPathSegment(trip.folder) || !Array.isArray(trip.photos) || !trip.photos.length ||
                    !trip.photos.every((photo: unknown) => isPathSegment(photo) && /\.(jpe?g|png|webp|avif)$/i.test(photo))) continue;
                const folder: string = trip.folder;
                const base = `${R2_BASE_URL}/trips/${encodeURIComponent(folder)}`;
                const localAlbum = LOCAL_GALLERY.find(album => album.folder === folder);
                // shortcut: new remote albums use originals until local previews are added.
                albums.push({
                    id: folder.toLowerCase(), name: folder.replace(/-/g, ' '), folder,
                    coverImage: localAlbum?.coverImage ?? `${base}/cover.JPG`,
                    images: trip.photos.map((photo: string, index: number) => {
                        const localImage = localAlbum?.images.find(image => image.src.endsWith(`/${encodeURIComponent(photo)}`));
                        return {
                            id: `${folder}-${index}`, src: localImage?.src ?? `${base}/${encodeURIComponent(photo)}`,
                            thumbnail: localImage?.thumbnail,
                            orientation: 'landscape' as const,
                        };
                    }),
                });
            }
            return albums.length ? albums : LOCAL_GALLERY;
        } catch {
            return LOCAL_GALLERY;
        } finally {
            pending = null;
        }
    })();
    return pending;
}

export const getAllPhotosWithTripName = (locations: LocationAlbum[]) =>
    locations.flatMap(location => location.images.map(image => ({
        src: image.thumbnail ?? image.src,
        location: location.name,
        date: '',
    })));
