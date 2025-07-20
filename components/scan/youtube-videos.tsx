"use client";

/**
 * Sonu - YouTube Educational Videos Component
 *
 * Displays educational YouTube videos related to the detected disease
 * with thumbnail previews in an accordion format.
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Play, ExternalLink, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  cashew,
  cassava,
  maize,
  tomato,
} from "@/lib/constants/disease_youtube_links";

interface YouTubeVideosProps {
  diseaseId: string;
}

interface VideoLink {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
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
 * Get video data from YouTube URL
 */
const getVideoData = (url: string, index: number): VideoLink | null => {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return {
    id: videoId,
    title: `Educational Video ${index + 1}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    url: url,
  };
};

/**
 * Get YouTube videos for a specific disease
 */
const getVideosForDisease = (diseaseId: string): VideoLink[] => {
  // Parse disease ID to get crop and disease name
  // e.g., "cashew-anthracnose" -> crop: "cashew", disease: "anthracnose"
  const [crop, ...diseaseParts] = diseaseId.split("-");
  const diseaseName = diseaseParts.join("_");

  let videoUrls: string[] = [];

  switch (crop) {
    case "cashew":
      videoUrls = (cashew as any)[diseaseName] || [];
      break;
    case "cassava":
      videoUrls = (cassava as any)[diseaseName] || [];
      break;
    case "maize":
      videoUrls = (maize as any)[diseaseName] || [];
      break;
    case "tomato":
      videoUrls = (tomato as any)[diseaseName] || [];
      break;
    default:
      videoUrls = [];
  }

  return videoUrls
    .map((url, index) => getVideoData(url, index))
    .filter((video): video is VideoLink => video !== null);
};

/**
 * YouTube Videos Component
 */
export function YouTubeVideos({ diseaseId }: YouTubeVideosProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoLink | null>(null);
  const videos = getVideosForDisease(diseaseId);

  // Don't render if no videos available
  if (videos.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-red-500" />
            <span>Educational Videos</span>
            <Badge variant="secondary">{videos.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Watch these educational videos to learn more about
                identification, treatment, and prevention.
              </p>

              <div className="grid gap-4">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow p-0">
                      <div className="flex">
                        {/* Video Thumbnail */}
                        <div
                          className="relative w-32 h-24 flex-shrink-0 cursor-pointer"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to default YouTube thumbnail
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
                              onClick={() => window.open(video.url, "_blank")}
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

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Videos are sourced from YouTube and may contain ads.
                  Sonu is not responsible for external content.
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              className="relative bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Video Player */}
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {selectedVideo.title}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm">
                    YouTube Video
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
    </Card>
  );
}
