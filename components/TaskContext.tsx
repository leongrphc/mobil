import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Task = {
  id: string;
  title: string;
  date: string;
  description?: string;
  category: string;
};

export type Project = {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type FinishedTask = Task & { finishedAt: number };
export type FinishedProject = Project & { finishedAt: number };
export type FinishedNote = Note & { finishedAt: number };

export type Profile = {
  name: string;
  email: string;
  photoIdx: number;
};

type AppContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updated: Partial<Omit<Task, 'id'>>) => void;
  finishTask: (id: string) => void;
  finishedTasks: FinishedTask[];
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  editProject: (id: string, updated: Partial<Omit<Project, 'id'>>) => void;
  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => void;
  deleteNote: (id: string) => void;
  editNote: (id: string, updated: Partial<Omit<Note, 'id'>>) => void;
  finishProject: (id: string) => void;
  finishedProjects: FinishedProject[];
  finishNote: (id: string) => void;
  finishedNotes: FinishedNote[];
  deleteFinishedTask: (id: string) => void;
  deleteFinishedProject: (id: string) => void;
  deleteFinishedNote: (id: string) => void;
  profile: Profile;
  updateProfile: (profile: Profile) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppData must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<FinishedTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [finishedProjects, setFinishedProjects] = useState<FinishedProject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [finishedNotes, setFinishedNotes] = useState<FinishedNote[]>([]);
  const [profile, setProfile] = useState<Profile>({ name: 'Mustafa', email: 'mustafa@example.com', photoIdx: 0 });

  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [
      { ...task, id: Date.now().toString() },
      ...prev,
    ]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (id: string, updated: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updated } : task));
  };

  const finishTask = (id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (task) setFinishedTasks(finished => [{ ...task, finishedAt: Date.now() }, ...finished]);
      return prev.filter(t => t.id !== id);
    });
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    setProjects(prev => [
      { ...project, id: Date.now().toString() },
      ...prev,
    ]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const editProject = (id: string, updated: Partial<Omit<Project, 'id'>>) => {
    setProjects(prev => prev.map(project => project.id === id ? { ...project, ...updated } : project));
  };

  const addNote = (note: Omit<Note, 'id'>) => {
    setNotes(prev => [
      { ...note, id: Date.now().toString() },
      ...prev,
    ]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const editNote = (id: string, updated: Partial<Omit<Note, 'id'>>) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, ...updated } : note));
  };

  const finishProject = (id: string) => {
    setProjects(prev => {
      const project = prev.find(p => p.id === id);
      if (project) setFinishedProjects(finished => [{ ...project, finishedAt: Date.now() }, ...finished]);
      return prev.filter(p => p.id !== id);
    });
  };

  const finishNote = (id: string) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id);
      if (note) setFinishedNotes(finished => [{ ...note, finishedAt: Date.now() }, ...finished]);
      return prev.filter(n => n.id !== id);
    });
  };

  const deleteFinishedTask = (id: string) => setFinishedTasks(prev => prev.filter(t => t.id !== id));
  const deleteFinishedProject = (id: string) => setFinishedProjects(prev => prev.filter(p => p.id !== id));
  const deleteFinishedNote = (id: string) => setFinishedNotes(prev => prev.filter(n => n.id !== id));

  const filterOldFinished = <T extends { finishedAt: number }>(arr: T[]) => arr.filter(item => Date.now() - item.finishedAt < 3 * 24 * 60 * 60 * 1000);

  const updateProfile = (p: Profile) => setProfile(p);

  return (
    <AppContext.Provider value={{
      tasks,
      addTask,
      deleteTask,
      editTask,
      finishTask,
      finishedTasks: filterOldFinished(finishedTasks),
      projects,
      addProject,
      deleteProject,
      editProject,
      finishProject,
      finishedProjects: filterOldFinished(finishedProjects),
      notes,
      addNote,
      deleteNote,
      editNote,
      finishNote,
      finishedNotes: filterOldFinished(finishedNotes),
      deleteFinishedTask,
      deleteFinishedProject,
      deleteFinishedNote,
      profile,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}; 