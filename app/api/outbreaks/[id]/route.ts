import { NextRequest, NextResponse } from 'next/server';
import { isWithinDeletionRange, isValidCoordinates, isWithinGhanaBounds } from '@/lib/utils/location-helper';

/**
 * AgriSentry AI - Outbreak Deletion API
 *
 * Handles location-based deletion of outbreak reports
 * Users can only delete outbreaks within 5km of their location
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

// Shared mock outbreak database - In production, this would be a real database
// This should be synchronized with the data in predictions/route.ts
let mockOutbreaks = [
  {
    id: "outbreak-1",
    location: { 
      lat: 5.6037, 
      lng: -0.1870, 
      name: "Accra Central",
      region: "Greater Accra" 
    },
    disease: "Cassava Mosaic",
    crop: "Cassava",
    severity: "high" as const,
    reportedDate: "2025-01-15T10:30:00Z",
    reportedBy: "Farmer John Mensah",
    status: "active" as const,
    description: "Widespread mosaic symptoms observed in cassava plantation. Affecting approximately 60% of plants."
  },
  {
    id: "outbreak-2", 
    location: { 
      lat: 6.6885, 
      lng: -1.6244, 
      name: "Kumasi",
      region: "Ashanti" 
    },
    disease: "Maize Streak Virus",
    crop: "Maize",
    severity: "medium" as const,
    reportedDate: "2025-01-14T14:15:00Z",
    reportedBy: "Agricultural Extension Officer",
    status: "contained" as const,
    description: "Streak symptoms in young maize plants. Treatment measures have been applied."
  },
  {
    id: "outbreak-3",
    location: { 
      lat: 5.5500, 
      lng: -0.2167, 
      name: "Tema",
      region: "Greater Accra" 
    },
    disease: "Tomato Leaf Blight",
    crop: "Tomato",
    severity: "critical" as const,
    reportedDate: "2025-01-13T08:45:00Z",
    reportedBy: "Greenhouse Manager",
    status: "active" as const,
    description: "Rapid spread of leaf blight in greenhouse facility. Immediate intervention required."
  },
  {
    id: "outbreak-4",
    location: { 
      lat: 7.9465, 
      lng: -1.0232, 
      name: "Tamale",
      region: "Northern" 
    },
    disease: "Cashew Anthracnose",
    crop: "Cashew",
    severity: "medium" as const,
    reportedDate: "2025-01-12T16:20:00Z",
    reportedBy: "Cashew Farmer Association",
    status: "active" as const,
    description: "Anthracnose symptoms detected in cashew trees. Monitoring ongoing."
  },
  {
    id: "outbreak-5",
    location: { 
      lat: 5.1200, 
      lng: -1.2800, 
      name: "Cape Coast",
      region: "Central" 
    },
    disease: "Cassava Brown Spot",
    crop: "Cassava",
    severity: "low" as const,
    reportedDate: "2025-01-11T11:10:00Z",
    reportedBy: "Community Farmer",
    status: "contained" as const,
    description: "Brown spot disease identified in small cassava plot. Localized treatment applied."
  }
];

/**
 * DELETE /api/outbreaks/[id]
 * Delete an outbreak report with location verification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Outbreak ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userLocation, reason } = body;

    // Validate user location
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return NextResponse.json(
        { error: 'User location is required for deletion' },
        { status: 400 }
      );
    }

    const { latitude: userLat, longitude: userLon } = userLocation;

    // Validate coordinates
    if (!isValidCoordinates(userLat, userLon)) {
      return NextResponse.json(
        { error: 'Invalid coordinates provided' },
        { status: 400 }
      );
    }

    // Check if coordinates are within Ghana bounds
    if (!isWithinGhanaBounds(userLat, userLon)) {
      return NextResponse.json(
        { error: 'Location must be within Ghana' },
        { status: 400 }
      );
    }

    // Find the outbreak
    const outbreakIndex = mockOutbreaks.findIndex(outbreak => outbreak.id === id);
    
    if (outbreakIndex === -1) {
      return NextResponse.json(
        { error: 'Outbreak not found' },
        { status: 404 }
      );
    }

    const outbreak = mockOutbreaks[outbreakIndex];

    // Check if user is within deletion range (5km tolerance)
    const canDelete = isWithinDeletionRange(
      userLat,
      userLon,
      outbreak.location.lat,
      outbreak.location.lng,
      5 // 5km tolerance
    );

    if (!canDelete) {
      return NextResponse.json(
        { 
          error: 'You must be within 5km of the outbreak location to delete it',
          distance: calculateDistance(userLat, userLon, outbreak.location.lat, outbreak.location.lng)
        },
        { status: 403 }
      );
    }

    // Log the deletion for audit purposes (in production, save to database)
    console.log(`Outbreak ${id} deleted by user at ${userLat}, ${userLon}. Reason: ${reason || 'No reason provided'}`);

    // Remove the outbreak from mock database
    mockOutbreaks.splice(outbreakIndex, 1);

    // In production, you would:
    // 1. Log the deletion with user location and timestamp
    // 2. Possibly soft-delete instead of hard delete
    // 3. Send notifications to relevant parties
    // 4. Update any related statistics

    return NextResponse.json(
      { 
        message: 'Outbreak successfully deleted',
        deletedOutbreak: {
          id: outbreak.id,
          disease: outbreak.disease,
          crop: outbreak.crop,
          location: outbreak.location.region
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting outbreak:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/outbreaks/[id]
 * Get specific outbreak details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Outbreak ID is required' },
        { status: 400 }
      );
    }

    const outbreak = mockOutbreaks.find(outbreak => outbreak.id === id);
    
    if (!outbreak) {
      return NextResponse.json(
        { error: 'Outbreak not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(outbreak);

  } catch (error) {
    console.error('Error fetching outbreak:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function for distance calculation (duplicated here for API use)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  
  return Math.round(distance * 100) / 100;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}