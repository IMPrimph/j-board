import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { JobCard } from './JobCard';
import type { Job, JobStatus } from '../store/jobs';
import { cn } from '../lib/utils';

interface ColumnProps {
  status: JobStatus;
  jobs: Job[];
}

const statusConfig: Record<JobStatus, { title: string; color: string; bgColor: string; borderColor: string }> = {
  wishlist: { 
    title: 'Wishlist', 
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100'
  },
  applied: { 
    title: 'Applied', 
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100'
  },
  interview: { 
    title: 'Interview', 
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-100'
  },
  offer: { 
    title: 'Offer', 
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100'
  },
  rejected: { 
    title: 'Rejected', 
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100'
  },
};

export function Column({ status, jobs }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const config = statusConfig[status];

  return (
    <div className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
      <div className={cn(
        'px-4 py-3 rounded-t-xl font-medium flex items-center justify-between',
        config.bgColor,
        config.borderColor,
        'border-b'
      )}>
        <span className={cn('font-semibold', config.color)}>{config.title}</span>
        <span className={cn(
          'px-2.5 py-0.5 rounded-full text-sm font-medium',
          'bg-white/75 backdrop-blur-sm',
          config.color
        )}>
          {jobs.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-2 min-h-[70vh]',
          jobs.length === 0 && 'flex items-center justify-center'
        )}
      >
        <SortableContext
          items={jobs.map(job => job.id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center px-4 py-8 border-2 border-dashed border-gray-200 rounded-lg">
              Drop jobs here
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}