"use client";

/**
 * AgriSentry AI - Multiple Disease Videos Component
 *
 * Displays educational YouTube videos for all detected diseases in batch results
 * with clear dividers and disease labels.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Play,
  ExternalLink,
  X,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@/lib/types/disease";
import {
  cashew,
  cassava,
  maize,
  tomato,
} from "@/lib/constants/disease_youtube_links";

interface MultipleDiseaseVideosProps {
  results: ScanResult[];
}

interface VideoLink {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

interface DiseaseVideoGroup {
  diseaseId: string;
  diseaseName: string;
  videos: VideoLink[];
  count: number; // Number of images with this disease
}

/**
 * Extract YouTube video ID from various URL formats
 */
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/**
 * Convert URL to video data with thumbnail
 */
const getVideoData = (url: string, index: number): VideoLink | null => {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return {
    id: videoId,
    title: `Educational Video ${index + 1}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    url,
  };
};

/**
 * Get videos for a specific disease
 */
const getVideosForDisease = (diseaseId: string): VideoLink[] => {
  let diseaseVideos: string[] = [];

  const id = diseaseId.toLowerCase();

  const mapVideos = (cropPrefix: string, collection: any) => {
    const diseaseKey = id
      .replace(`${cropPrefix}-`, "") // remove crop-
      .replace(`${cropPrefix}_`, "") // or crop_
      .replace(/-/g, "_"); // convert remaining hyphens to underscores
    return (collection as any)[diseaseKey] || [];
  };

  if (id.startsWith("cashew")) {
    diseaseVideos = mapVideos("cashew", cashew);
  } else if (id.startsWith("cassava")) {
    diseaseVideos = mapVideos("cassava", cassava);
  } else if (id.startsWith("maize")) {
    diseaseVideos = mapVideos("maize", maize);
  } else if (id.startsWith("tomato")) {
    diseaseVideos = mapVideos("tomato", tomato);
  }

  return diseaseVideos
    .map((url, index) => getVideoData(url, index))
    .filter((video): video is VideoLink => video !== null);
};

export function MultipleDiseaseVideos({ results }: MultipleDiseaseVideosProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoLink | null>(null);

  // Group results by disease and count occurrences
  const diseaseGroups: DiseaseVideoGroup[] = results.reduce((acc, result) => {
    const existingGroup = acc.find((g) => g.diseaseId === result.disease.id);

    if (existingGroup) {
      existingGroup.count++;
    } else {
      const videos = getVideosForDisease(result.disease.id);
      if (videos.length > 0) {
        acc.push({
          diseaseId: result.disease.id,
          diseaseName: result.disease.name,
          videos,
          count: 1,
        });
      }
    }

    return acc;
  }, [] as DiseaseVideoGroup[]);

  const toggleGroup = (diseaseId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(diseaseId)) {
      newExpanded.delete(diseaseId);
    } else {
      newExpanded.add(diseaseId);
    }
    setExpandedGroups(newExpanded);
  };

  const openVideoModal = (video: VideoLink) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  if (diseaseGroups.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-primary" />
            <span>Educational Videos</span>
            <Badge variant="secondary">
              {diseaseGroups.length} Disease
              {diseaseGroups.length > 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {diseaseGroups.map((group, groupIndex) => (
            <div key={group.diseaseId}>
              {/* Disease Header */}
              <div
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleGroup(group.diseaseId)}
              >
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium">{group.diseaseName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {group.count} image{group.count > 1 ? "s" : ""}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {group.videos.length} video
                    {group.videos.length > 1 ? "s" : ""}
                  </Badge>
                </div>

                {expandedGroups.has(group.diseaseId) ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Videos Grid */}
              <AnimatePresence>
                {expandedGroups.has(group.diseaseId) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 grid gap-4">
                      {group.videos.map((video, videoIndex) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: videoIndex * 0.1 }}
                          className="group"
                        >
                          <Card className="overflow-hidden hover:shadow-md transition-shadow p-0">
                            <div className="flex">
                              {/* Video Thumbnail */}
                              <div
                                className="relative w-32 h-24 flex-shrink-0 cursor-pointer"
                                onClick={() => openVideoModal(video)}
                              >
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://img.youtube.com/vi/${video.id}/default.jpg`;
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity h-full">
                                  <Play className="h-6 w-6 text-white" />
                                </div>
                              </div>

                              {/* Video Info */}
                              <div className="flex-1 p-3 flex flex-col justify-between">
                                <div>
                                  <h4 className="font-medium text-sm line-clamp-2">
                                    {video.title}
                                  </h4>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    YouTube
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      window.open(video.url, "_blank")
                                    }
                                    className="text-xs hover:bg-muted"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Watch
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider between disease groups */}
              {groupIndex < diseaseGroups.length - 1 && (
                <div className="border-t border-border my-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideoModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.title}
                  className="w-full h-64 md:h-96"
                  allowFullScreen
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setShowVideoModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4">
                <h3 className="font-medium mb-2">{selectedVideo.title}</h3>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    Click outside to close
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedVideo.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in YouTube
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
