/**
 * Sonu - Location Helper Utilities
 *
 * Utilities for location-based operations including:
 * - Distance calculations
 * - Geolocation services
 * - Location-based permissions
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

/**
 * User location interface
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

/**
 * Location permission status
 */
export type LocationPermission = 'granted' | 'denied' | 'prompt' | 'unsupported';

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 First point latitude
 * @param lon1 First point longitude
 * @param lat2 Second point latitude
 * @param lon2 Second point longitude
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if user is within deletion tolerance of an outbreak
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param outbreakLat Outbreak latitude
 * @param outbreakLon Outbreak longitude
 * @param toleranceKm Tolerance distance in kilometers (default: 5km)
 * @returns True if user is within tolerance range
 */
export function isWithinDeletionRange(
  userLat: number,
  userLon: number,
  outbreakLat: number,
  outbreakLon: number,
  toleranceKm: number = 5
): boolean {
  const distance = calculateDistance(userLat, userLon, outbreakLat, outbreakLon);
  return distance <= toleranceKm;
}

/**
 * Get user's current location
 * @param options Geolocation options
 * @returns Promise with user location or error
 */
export function getCurrentLocation(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
  }
): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
}

/**
 * Check location permission status
 * @returns Promise with permission status
 */
export async function checkLocationPermission(): Promise<LocationPermission> {
  if (!navigator.permissions) {
    return 'unsupported';
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state as LocationPermission;
  } catch (error) {
    return 'unsupported';
  }
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km away`;
  } else {
    return `${Math.round(distanceKm)}km away`;
  }
}

/**
 * Get location name from coordinates (reverse geocoding)
 * Note: This is a simplified version. In production, you'd use a proper geocoding service
 * @param lat Latitude
 * @param lon Longitude
 * @returns Promise with location name
 */
export async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    // Using OpenStreetMap Nominatim for reverse geocoding (free but rate-limited)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    // Extract meaningful location name
    const address = data.address || {};
    const locationParts = [
      address.village || address.town || address.city,
      address.state_district || address.county,
      address.state || address.region,
    ].filter(Boolean);
    
    return locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location';
  } catch (error) {
    console.warn('Failed to get location name:', error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

/**
 * Validate coordinates
 * @param lat Latitude
 * @param lon Longitude
 * @returns True if coordinates are valid
 */
export function isValidCoordinates(lat: number, lon: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180 &&
    !isNaN(lat) &&
    !isNaN(lon)
  );
}

/**
 * Get Ghana-specific location bounds for validation
 * Ghana is approximately between:
 * Latitude: 4.5° to 11.5° N
 * Longitude: -3.5° to 1.5° E
 */
export function isWithinGhanaBounds(lat: number, lon: number): boolean {
  return lat >= 4.5 && lat <= 11.5 && lon >= -3.5 && lon <= 1.5;
}