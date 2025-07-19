export type SeverityLevelColor =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | string;

/**
 * Get marker color based on severity level.
 * @param severity A severity string such as "low", "medium", "high", or "critical".
 * @returns A hex color string for the marker fill.
 */
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "low":
      return "#22c55e"; // green
    case "medium":
      return "#eab308"; // yellow
    case "high":
      return "#f97316"; // orange
    case "critical":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray
  }
};

/**
 * Compute a reasonable pixel size for a map marker given an affected area in acres/hectares.
 * Mainly useful if we want to visualise outbreak extent by varying marker radii.
 * @param affectedArea Numeric value representing the affected area.
 * @returns Size in pixels for a circular marker.
 */
export const getMarkerSize = (affectedArea: number): number => {
  if (affectedArea < 2) return 8;
  if (affectedArea < 5) return 12;
  if (affectedArea < 10) return 16;
  return 20;
};

export interface DiseaseMarkerInfo {
  color: string;
  icon: string;
  category: string;
}

/**
 * Derive an appropriate marker colour, icon emoji and crop category for a given disease label.
 * The logic is primarily string-matching and kept identical to the previous inline implementation.
 *
 * IMPORTANT: Keep this function in sync with the ML model class names so that newly added
 * diseases receive sensible defaults.
 */
export const getDiseaseMarkerInfo = (disease: string): DiseaseMarkerInfo => {
  const lowerDisease = disease.toLowerCase();

  // Cashew diseases
  if (lowerDisease.includes("cashew")) {
    if (lowerDisease.includes("anthracnose"))
      return { color: "#8B4513", icon: "🍂", category: "Cashew" };
    if (lowerDisease.includes("gummosis"))
      return { color: "#A0522D", icon: "💧", category: "Cashew" };
    if (
      lowerDisease.includes("leaf_miner") ||
      lowerDisease.includes("leaf miner")
    )
      return { color: "#CD853F", icon: "🐛", category: "Cashew" };
    if (lowerDisease.includes("red_rust") || lowerDisease.includes("red rust"))
      return { color: "#B22222", icon: "🦠", category: "Cashew" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Cashew" };
    return { color: "#8B4513", icon: "🌰", category: "Cashew" };
  }

  // Cassava diseases
  if (lowerDisease.includes("cassava")) {
    if (
      lowerDisease.includes("bacterial_blight") ||
      lowerDisease.includes("bacterial blight")
    )
      return { color: "#4169E1", icon: "🦠", category: "Cassava" };
    if (
      lowerDisease.includes("brown_streak") ||
      lowerDisease.includes("brown streak")
    )
      return { color: "#8B4513", icon: "📏", category: "Cassava" };
    if (
      lowerDisease.includes("green_mottle") ||
      lowerDisease.includes("green mottle")
    )
      return { color: "#32CD32", icon: "🟢", category: "Cassava" };
    if (lowerDisease.includes("mosaic"))
      return { color: "#FFD700", icon: "🎨", category: "Cassava" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Cassava" };
    return { color: "#DEB887", icon: "🍠", category: "Cassava" };
  }

  // Maize diseases
  if (lowerDisease.includes("maize")) {
    if (
      lowerDisease.includes("fall_armyworm") ||
      lowerDisease.includes("fall armyworm")
    )
      return { color: "#8B0000", icon: "🐛", category: "Maize" };
    if (lowerDisease.includes("grasshopper"))
      return { color: "#90EE90", icon: "🦗", category: "Maize" };
    if (
      lowerDisease.includes("leaf_beetle") ||
      lowerDisease.includes("leaf beetle")
    )
      return { color: "#FF4500", icon: "🪲", category: "Maize" };
    if (
      lowerDisease.includes("leaf_blight") ||
      lowerDisease.includes("leaf blight")
    )
      return { color: "#8B4513", icon: "🍂", category: "Maize" };
    if (
      lowerDisease.includes("leaf_spot") ||
      lowerDisease.includes("leaf spot")
    )
      return { color: "#A0522D", icon: "🔴", category: "Maize" };
    if (
      lowerDisease.includes("streak_virus") ||
      lowerDisease.includes("streak virus")
    )
      return { color: "#FF69B4", icon: "🦠", category: "Maize" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Maize" };
    return { color: "#FFD700", icon: "🌽", category: "Maize" };
  }

  // Tomato diseases
  if (lowerDisease.includes("tomato")) {
    if (
      lowerDisease.includes("bacterial_spot") ||
      lowerDisease.includes("bacterial spot")
    )
      return { color: "#8B0000", icon: "🦠", category: "Tomato" };
    if (
      lowerDisease.includes("early_blight") ||
      lowerDisease.includes("early blight")
    )
      return { color: "#A0522D", icon: "🍂", category: "Tomato" };
    if (
      lowerDisease.includes("late_blight") ||
      lowerDisease.includes("late blight")
    )
      return { color: "#2F4F4F", icon: "🌫️", category: "Tomato" };
    if (
      lowerDisease.includes("leaf_mold") ||
      lowerDisease.includes("leaf mold")
    )
      return { color: "#556B2F", icon: "🟢", category: "Tomato" };
    if (
      lowerDisease.includes("septoria_leaf_spot") ||
      lowerDisease.includes("septoria leaf spot")
    )
      return { color: "#8B4513", icon: "🔴", category: "Tomato" };
    if (
      lowerDisease.includes("spider_mites") ||
      lowerDisease.includes("spider mites")
    )
      return { color: "#DC143C", icon: "🕷️", category: "Tomato" };
    if (
      lowerDisease.includes("target_spot") ||
      lowerDisease.includes("target spot")
    )
      return { color: "#B22222", icon: "🎯", category: "Tomato" };
    if (
      lowerDisease.includes("yellow_leaf_curl") ||
      lowerDisease.includes("yellow leaf curl")
    )
      return { color: "#FFD700", icon: "🌀", category: "Tomato" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Tomato" };
    return { color: "#FF6347", icon: "🍅", category: "Tomato" };
  }

  // Default
  return { color: "#6b7280", icon: "❓", category: "Unknown" };
};

/**
 * Build HTML string for a circular Leaflet DivIcon marker using the provided colour and emoji/icon.
 * @param color Background colour of the marker circle.
 * @param icon Emoji or HTML string to render inside the circle.
 * @param size Diameter in pixels (defaults to 20).
 */
export function buildCircularMarkerHtml(
  color: string,
  icon: string,
  size = 20
): string {
  return `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: ${Math.round(size * 0.6)}px;
      font-weight: bold;
    ">
      ${icon}
    </div>
  `;
}
