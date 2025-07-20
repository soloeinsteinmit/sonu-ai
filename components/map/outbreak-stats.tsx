"use client";

/**
 * Sonu - Outbreak Stats Component
 * 
 * Statistics dashboard for outbreak data
 * Features:
 * - Total outbreak count
 * - Severity distribution
 * - Affected area totals
 * - Trend indicators
 * 
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { TrendingUp, TrendingDown, AlertTriangle, MapPin, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OutbreakData } from "@/app/map/page";

/**
 * Props for OutbreakStats component
 */
interface OutbreakStatsProps {
  outbreaks: OutbreakData[];
}

/**
 * Stat card component
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "default" | "destructive" | "secondary" | "outline";
}

function StatCard({ title, value, icon, description, trend, color = "default" }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend.value)}% from last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Main outbreak stats component
 */

export function OutbreakStats({ outbreaks }: OutbreakStatsProps) {
  // Calculate statistics
  const totalOutbreaks = outbreaks.length;
  const activeOutbreaks = outbreaks.filter(o => o.status === 'active').length;
  const resolvedOutbreaks = outbreaks.filter(o => o.status === 'resolved').length;
  const containedOutbreaks = outbreaks.filter(o => o.status === 'contained').length;
  
  // Severity distribution
  const severityCount = {
    low: outbreaks.filter(o => o.severity === 'low').length,
    medium: outbreaks.filter(o => o.severity === 'medium').length,
    high: outbreaks.filter(o => o.severity === 'high').length,
    critical: outbreaks.filter(o => o.severity === 'critical').length,
  };

  // Recent outbreaks (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentOutbreaks = outbreaks.filter(o => new Date(o.reportedDate) >= oneWeekAgo);

  // Most affected regions
  const regionCounts = outbreaks.reduce((acc, outbreak) => {
    acc[outbreak.location.region] = (acc[outbreak.location.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostAffectedRegion = Object.entries(regionCounts)
    .sort(([,a], [,b]) => b - a)[0];

  // Most common disease
  const diseaseCounts = outbreaks.reduce((acc, outbreak) => {
    acc[outbreak.disease] = (acc[outbreak.disease] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonDisease = Object.entries(diseaseCounts)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-4">
      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Outbreaks"
          value={totalOutbreaks}
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          description="Across all regions"
          trend={{ value: 12, isPositive: false }}
        />
        
        <StatCard
          title="Active Cases"
          value={activeOutbreaks}
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          description="Requiring attention"
          trend={{ value: 8, isPositive: false }}
        />
        
        <StatCard
          title="Recent Reports"
          value={recentOutbreaks.length}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          description="Last 7 days"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Detailed breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs">
                    {activeOutbreaks}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalOutbreaks > 0 ? Math.round((activeOutbreaks / totalOutbreaks) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contained</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {containedOutbreaks}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalOutbreaks > 0 ? Math.round((containedOutbreaks / totalOutbreaks) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Resolved</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {resolvedOutbreaks}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalOutbreaks > 0 ? Math.round((resolvedOutbreaks / totalOutbreaks) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Severity breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Critical</span>
                <div className="flex items-center space-x-2">
                  <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                    {severityCount.critical}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalOutbreaks > 0 ? Math.round((severityCount.critical / totalOutbreaks) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High</span>
                <div className="flex items-center space-x-2">
                  <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                    {severityCount.high}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalOutbreaks > 0 ? Math.round((severityCount.high / totalOutbreaks) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Medium</span>
                <div className="flex items-center space-x-2">
                  <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                    {severityCount.medium}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalOutbreaks > 0 ? Math.round((severityCount.medium / totalOutbreaks) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low</span>
                <div className="flex items-center space-x-2">
                  <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                    {severityCount.low}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalOutbreaks > 0 ? Math.round((severityCount.low / totalOutbreaks) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {mostAffectedRegion && (
              <div>
                <span className="font-medium">Most Affected Region:</span>
                <div className="mt-1">
                  <Badge variant="outline">
                    {mostAffectedRegion[0]} ({mostAffectedRegion[1]} outbreaks)
                  </Badge>
                </div>
              </div>
            )}
            
            {mostCommonDisease && (
              <div>
                <span className="font-medium">Most Common Disease:</span>
                <div className="mt-1">
                  <Badge variant="outline">
                    {mostCommonDisease[0]} ({mostCommonDisease[1]} cases)
                  </Badge>
                </div>
              </div>
            )}
            
            <div>
              <span className="font-medium">Resolution Rate:</span>
              <div className="mt-1">
                <Badge variant="outline">
                  {totalOutbreaks > 0 ? Math.round((resolvedOutbreaks / totalOutbreaks) * 100) : 0}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 