'use client';

import { useState, useEffect } from 'react';
import { subscribeToProjects, getProjects } from '@/lib/firestore';
import type { Project, ProjectType } from '@/types';

export function useProjects(filters?: { type?: ProjectType; status?: string; limitCount?: number }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (filters) {
      // Use one-time fetch with filters
      getProjects(filters)
        .then(setProjects)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      // Use real-time subscription
      const unsubscribe = subscribeToProjects((data) => {
        setProjects(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [filters?.type, filters?.status, filters?.limitCount]);

  return { projects, loading };
}
