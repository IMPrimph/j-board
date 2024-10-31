import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, MapPin, DollarSign, Link, Trash2, GripVertical, Calendar, Clock } from 'lucide-react';
import type { Job } from '../store/jobs';
import { useJobStore } from '../store/jobs';
import { cn } from '../lib/utils';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteJob = useJobStore((state) => state.deleteJob);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group bg-white rounded-lg border transition-all duration-200',
        isDragging ? 'shadow-lg scale-105 rotate-2 border-blue-200' : 'border-gray-200 hover:border-gray-300',
        isExpanded ? 'shadow-md' : 'hover:shadow'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          className="mt-1 opacity-40 hover:opacity-100 transition-opacity touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{job.position}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1.5">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">{job.company}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteJob(job.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all duration-200 -mt-1 -mr-1 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{job.location}</span>
          </div>

          {job.salary && (
            <div className="flex items-center gap-2 text-gray-600 mt-1.5">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{job.salary}</span>
            </div>
          )}

          {isExpanded && (
            <div className="mt-4 space-y-3 border-t pt-3">
              {job.notes && (
                <div className="text-gray-700">
                  <p className="text-sm whitespace-pre-line">{job.notes}</p>
                </div>
              )}
              
              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link className="w-4 h-4" />
                  <span>View Job Posting</span>
                </a>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Added {new Date(job.dateAdded).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated {new Date(job.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}