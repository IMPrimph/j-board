import { create } from 'zustand';

export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  location: string;
  salary?: string;
  notes?: string;
  link?: string;
  dateAdded: string;
  lastUpdated: string;
}

interface JobStore {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  moveJob: (id: string, status: JobStatus) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  addJob: (job) => {
    set((state) => ({
      jobs: [
        ...state.jobs,
        {
          ...job,
          id: crypto.randomUUID(),
          dateAdded: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
      ],
    }));
  },
  updateJob: (id, updatedJob) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id
          ? { ...job, ...updatedJob, lastUpdated: new Date().toISOString() }
          : job
      ),
    }));
  },
  deleteJob: (id) => {
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    }));
  },
  moveJob: (id, newStatus) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id
          ? { ...job, status: newStatus, lastUpdated: new Date().toISOString() }
          : job
      ),
    }));
  },
}));