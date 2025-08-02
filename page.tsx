// src/app/(authenticated)/missions/[id]/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useMissions } from '@/hooks/useMissions';
import { MissionDetailsView } from '@/components/missions/MissionDetailsView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit3, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = typeof params.id === 'string' ? params.id : undefined;
  const { getMissionById, isLoading } = useMissions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  const mission = missionId ? getMissionById(missionId) : undefined;

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Mission Not Found</h1>
        <p className="text-muted-foreground mb-6">The mission you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/missions">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Missions
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {/* Placeholder for edit button if needed
        <Button variant="outline" size="sm" disabled>
          <Edit3 className="mr-2 h-4 w-4" /> Edit Mission
        </Button>
        */}
      </div>
      <MissionDetailsView mission={mission} />
    </div>
  );
}
