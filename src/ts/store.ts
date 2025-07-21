export interface Step {
  id: string;
  text: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  steps: Step[];
  createdAt: string;
  updatedAt?: string;
}

class ProjectsStore extends EventTarget {
  private storageKey = 'mugenProjectsData';
  private projects: Project[] = [];

  constructor() {
    super();
    this.load();
  }

  private load() {
    try {
      this.projects = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      this.projects = [];
    }
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
  }

  getAll(): Project[] {
    return [...this.projects];
  }

  add(project: Project) {
    this.projects.push(project);
    this.save();
    this.emitChange();
  }

  update(id: string, data: Partial<Project>) {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx >= 0) {
      this.projects[idx] = { ...this.projects[idx], ...data };
      this.save();
      this.emitChange();
    }
  }

  delete(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.save();
    this.emitChange();
  }

  toggleStep(projectId: string, stepId: string) {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      const step = project.steps.find(s => s.id === stepId);
      if (step) {
        step.completed = !step.completed;
        this.save();
        this.emitChange();
      }
    }
  }

  getById(id: string) {
    return this.projects.find(p => p.id === id);
  }

  private emitChange() {
    this.dispatchEvent(new CustomEvent('change', { detail: this.getAll() }));
  }
}

export const projectsStore = new ProjectsStore();
