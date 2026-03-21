import { create } from 'zustand';

// Demo projects for testing
const DEMO_PROJECTS = [
  {
    id: 'demo-1',
    name: 'Welcome Project',
    description: 'Click here to test the editor',
    language: 'javascript',
    template: 'hello-world',
    root: {
      id: 'root',
      name: 'root',
      type: 'folder',
      children: [
        {
          id: 'index.js',
          name: 'index.js',
          type: 'file',
          path: 'index.js',
          content: 'console.log("Welcome to Replit!")',
        },
      ],
    },
    createdAt: new Date().toISOString(),
  },
];

export const useProjectStore = create((set) => ({
  projects: DEMO_PROJECTS,
  isLoading: false,

  createProject: async (projectData) => {
    const newProject = {
      id: `project-${Date.now()}`,
      ...projectData,
      root: projectData.root || {
        id: 'root',
        name: 'root',
        type: 'folder',
        children: [],
      },
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
    
    return newProject;
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  getProjectById: (id) => {
    const state = useProjectStore.getState();
    return state.projects.find((p) => p.id === id);
  },
}));