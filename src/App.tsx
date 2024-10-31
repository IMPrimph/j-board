import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Plus, Briefcase } from 'lucide-react';
import { Column } from './components/Column';
import { JobCard } from './components/JobCard';
import { NewJobDialog } from './components/NewJobDialog';
import { useJobStore, type Job, type JobStatus } from './store/jobs';

const columns: JobStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false);
  const jobs = useJobStore((state) => state.jobs);
  const moveJob = useJobStore((state) => state.moveJob);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const status = over.id as JobStatus;
      moveJob(active.id as string, status);
    }

    setActiveId(null);
  };

  const activeJob = activeId ? jobs.find((job) => job.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Job Tracker
              </h1>
            </div>
            <button
              onClick={() => setIsNewJobDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              Add Job
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
            {columns.map((status) => (
              <div key={status} className="snap-center">
                <Column
                  status={status}
                  jobs={jobs.filter((job) => job.status === status)}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeJob ? <JobCard job={activeJob as Job} /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      <NewJobDialog
        isOpen={isNewJobDialogOpen}
        onClose={() => setIsNewJobDialogOpen(false)}
      />
    </div>
  );
}