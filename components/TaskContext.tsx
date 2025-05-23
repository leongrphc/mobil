import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Storage keys
  const STORAGE_KEYS = {
    tasks: 'app_tasks',
    finishedTasks: 'app_finished_tasks',
    projects: 'app_projects', 
    finishedProjects: 'app_finished_projects',
    notes: 'app_notes',
    finishedNotes: 'app_finished_notes',
    profile: 'app_profile',
  };

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          storedTasks,
          storedFinishedTasks,
          storedProjects,
          storedFinishedProjects,
          storedNotes,
          storedFinishedNotes,
          storedProfile,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.tasks),
          AsyncStorage.getItem(STORAGE_KEYS.finishedTasks),
          AsyncStorage.getItem(STORAGE_KEYS.projects),
          AsyncStorage.getItem(STORAGE_KEYS.finishedProjects),
          AsyncStorage.getItem(STORAGE_KEYS.notes),
          AsyncStorage.getItem(STORAGE_KEYS.finishedNotes),
          AsyncStorage.getItem(STORAGE_KEYS.profile),
        ]);

        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedFinishedTasks) setFinishedTasks(JSON.parse(storedFinishedTasks));
        if (storedProjects) setProjects(JSON.parse(storedProjects));
        if (storedFinishedProjects) setFinishedProjects(JSON.parse(storedFinishedProjects));
        if (storedNotes) setNotes(JSON.parse(storedNotes));
        if (storedFinishedNotes) setFinishedNotes(JSON.parse(storedFinishedNotes));
        if (storedProfile) setProfile(JSON.parse(storedProfile));

        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save data to AsyncStorage
  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => {
      const newTasks = [{ ...task, id: Date.now().toString() }, ...prev];
      saveToStorage(STORAGE_KEYS.tasks, newTasks);
      return newTasks;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.filter(task => task.id !== id);
      saveToStorage(STORAGE_KEYS.tasks, newTasks);
      return newTasks;
    });
  };

  const editTask = (id: string, updated: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => {
      const newTasks = prev.map(task => task.id === id ? { ...task, ...updated } : task);
      saveToStorage(STORAGE_KEYS.tasks, newTasks);
      return newTasks;
    });
  };

  const finishTask = (id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (task) {
        setFinishedTasks(finished => {
          const newFinished = [{ ...task, finishedAt: Date.now() }, ...finished];
          saveToStorage(STORAGE_KEYS.finishedTasks, newFinished);
          return newFinished;
        });
      }
      const newTasks = prev.filter(t => t.id !== id);
      saveToStorage(STORAGE_KEYS.tasks, newTasks);
      return newTasks;
    });
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    setProjects(prev => {
      const newProjects = [{ ...project, id: Date.now().toString() }, ...prev];
      saveToStorage(STORAGE_KEYS.projects, newProjects);
      return newProjects;
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const newProjects = prev.filter(project => project.id !== id);
      saveToStorage(STORAGE_KEYS.projects, newProjects);
      return newProjects;
    });
  };

  const editProject = (id: string, updated: Partial<Omit<Project, 'id'>>) => {
    setProjects(prev => {
      const newProjects = prev.map(project => project.id === id ? { ...project, ...updated } : project);
      saveToStorage(STORAGE_KEYS.projects, newProjects);
      return newProjects;
    });
  };

  const addNote = (note: Omit<Note, 'id'>) => {
    setNotes(prev => {
      const newNotes = [{ ...note, id: Date.now().toString() }, ...prev];
      saveToStorage(STORAGE_KEYS.notes, newNotes);
      return newNotes;
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const newNotes = prev.filter(note => note.id !== id);
      saveToStorage(STORAGE_KEYS.notes, newNotes);
      return newNotes;
    });
  };

  const editNote = (id: string, updated: Partial<Omit<Note, 'id'>>) => {
    setNotes(prev => {
      const newNotes = prev.map(note => note.id === id ? { ...note, ...updated } : note);
      saveToStorage(STORAGE_KEYS.notes, newNotes);
      return newNotes;
    });
  };

  const finishProject = (id: string) => {
    setProjects(prev => {
      const project = prev.find(p => p.id === id);
      if (project) {
        setFinishedProjects(finished => {
          const newFinished = [{ ...project, finishedAt: Date.now() }, ...finished];
          saveToStorage(STORAGE_KEYS.finishedProjects, newFinished);
          return newFinished;
        });
      }
      const newProjects = prev.filter(p => p.id !== id);
      saveToStorage(STORAGE_KEYS.projects, newProjects);
      return newProjects;
    });
  };

  const finishNote = (id: string) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id);
      if (note) {
        setFinishedNotes(finished => {
          const newFinished = [{ ...note, finishedAt: Date.now() }, ...finished];
          saveToStorage(STORAGE_KEYS.finishedNotes, newFinished);
          return newFinished;
        });
      }
      const newNotes = prev.filter(n => n.id !== id);
      saveToStorage(STORAGE_KEYS.notes, newNotes);
      return newNotes;
    });
  };

  const deleteFinishedTask = (id: string) => {
    setFinishedTasks(prev => {
      const newFinished = prev.filter(t => t.id !== id);
      saveToStorage(STORAGE_KEYS.finishedTasks, newFinished);
      return newFinished;
    });
  };

  const deleteFinishedProject = (id: string) => {
    setFinishedProjects(prev => {
      const newFinished = prev.filter(p => p.id !== id);
      saveToStorage(STORAGE_KEYS.finishedProjects, newFinished);
      return newFinished;
    });
  };

  const deleteFinishedNote = (id: string) => {
    setFinishedNotes(prev => {
      const newFinished = prev.filter(n => n.id !== id);
      saveToStorage(STORAGE_KEYS.finishedNotes, newFinished);
      return newFinished;
    });
  };

  const filterOldFinished = <T extends { finishedAt: number }>(arr: T[]) => arr.filter(item => Date.now() - item.finishedAt < 3 * 24 * 60 * 60 * 1000);

  const updateProfile = (p: Profile) => {
    setProfile(p);
    saveToStorage(STORAGE_KEYS.profile, p);
  };

  // Don't render until data is loaded
  if (!isLoaded) {
    return null; // or a loading spinner
  }

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