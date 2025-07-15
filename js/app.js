class MugenNotepad {
  constructor() {
    this.STORAGE_KEY = 'mugenNotepadData';
    this.autoSaveTimeout = null;
    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.loadNote();
    this.updateCounters();
  }

  cacheDOM() {
    this.textarea = document.getElementById('notepadTextarea');
    this.charCounter = document.getElementById('charCounter');
    this.wordCounter = document.getElementById('wordCounter');
    this.autoSaveStatus = document.getElementById('autoSaveStatus');
  }

  bindEvents() {
    this.textarea.addEventListener('input', () => {
      this.updateCounters();
      this.scheduleAutoSave();
    });

    this.textarea.addEventListener('paste', () => {
      setTimeout(() => this.updateCounters(), 10);
    });
  }

  loadNote() {
    try {
      const savedNote = localStorage.getItem(this.STORAGE_KEY);
      if (savedNote) {
        this.textarea.value = savedNote;
        this.updateCounters();
      }
    } catch (error) {
      console.error('Erro ao carregar anotação:', error);
    }
  }

  saveNote() {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.textarea.value);
      this.showAutoSaveStatus('saved');
    } catch (error) {
      console.error('Erro ao salvar anotação:', error);
      this.showAutoSaveStatus('error');
    }
  }

  scheduleAutoSave() {
    this.showAutoSaveStatus('saving');
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    this.autoSaveTimeout = setTimeout(() => {
      this.saveNote();
    }, 1000);
  }

  showAutoSaveStatus(status) {
    this.autoSaveStatus.className = 'auto-save-status';
    switch (status) {
      case 'saving':
        this.autoSaveStatus.textContent = 'Salvando...';
        this.autoSaveStatus.classList.add('saving');
        break;
      case 'saved':
        this.autoSaveStatus.textContent = 'Salvo automaticamente';
        this.autoSaveStatus.classList.add('saved');
        setTimeout(() => {
          this.autoSaveStatus.classList.remove('saved');
        }, 2000);
        break;
      case 'error':
        this.autoSaveStatus.textContent = 'Erro ao salvar';
        this.autoSaveStatus.style.color = '#e74c3c';
        setTimeout(() => {
          this.autoSaveStatus.style.color = '';
        }, 3000);
        break;
    }
  }

  updateCounters() {
    const text = this.textarea.value;
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    this.charCounter.textContent = `${charCount.toLocaleString()} caracteres`;
    this.wordCounter.textContent = `${wordCount.toLocaleString()} palavras`;
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 400);
    }, 3000);
  }
}

class ProjectOrganizer {
  constructor() {
    this.STORAGE_KEY = 'mugenProjectsData';
    this.projects = this.loadFromLocalStorage() || [];
    this.dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'
    });
    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.renderAll();
    setInterval(() => this.saveToLocalStorage(true), 2 * 60 * 1000);
  }

  cacheDOM() {
    this.dom = {
      projectForm: document.getElementById('projectForm'),
      projectsGrid: document.getElementById('projectsGrid'),
      stats: {
        total: document.getElementById('totalProjects'),
        completed: document.getElementById('completedProjects'),
        pending: document.getElementById('pendingProjects'),
      },
      editModal: {
        modal: document.getElementById('editModal'),
        form: document.getElementById('editForm'),
        closeBtn: document.getElementById('closeModalBtn'),
        cancelBtn: document.getElementById('cancelEditBtn'),
        id: document.getElementById('editProjectId'),
        name: document.getElementById('editProjectName'),
        type: document.getElementById('editProjectType'),
        description: document.getElementById('editProjectDescription'),
        startDate: document.getElementById('editStartDate'),
        endDate: document.getElementById('editEndDate'),
        steps: document.getElementById('editProjectSteps'),
      }
    };
  }

  bindEvents() {
    this.dom.projectForm.addEventListener('submit', e => {
      e.preventDefault();
      this.addProject();
    });

    this.dom.projectsGrid.addEventListener('click', e => {
      const target = e.target;
      const editBtn = target.closest('.btn-edit');
      const deleteBtn = target.closest('.btn-delete');

      if (target.matches('.step-checkbox')) {
        this.toggleStep(parseInt(target.dataset.projectId), parseInt(target.dataset.stepIndex));
      } else if (editBtn) {
        this.openEditModal(parseInt(editBtn.dataset.projectId));
      } else if (deleteBtn) {
        this.deleteProject(parseInt(deleteBtn.dataset.projectId));
      }
    });

    this.dom.editModal.form.addEventListener('submit', e => {
      e.preventDefault();
      this.updateProject();
    });
    this.dom.editModal.closeBtn.addEventListener('click', () => this.closeEditModal());
    this.dom.editModal.cancelBtn.addEventListener('click', () => this.closeEditModal());
    this.dom.editModal.modal.addEventListener('click', e => {
      if (e.target === this.dom.editModal.modal) {
        this.closeEditModal();
      }
    });
  }

  renderAll() {
    this.renderProjects();
    this.updateStats();
  }

  saveToLocalStorage(isSilent = false) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
      if (!isSilent) this.showNotification('Progresso salvo automaticamente!', 'success');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      if (!isSilent) this.showNotification('Erro ao salvar localmente.', 'error');
    }
  }

  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return [];
    }
  }

  addProject() {
    const form = this.dom.projectForm;
    const name = form.querySelector('#projectName').value.trim();
    const type = form.querySelector('#projectType').value;
    const description = form.querySelector('#projectDescription').value.trim();
    const startDate = form.querySelector('#startDate').value;
    const endDate = form.querySelector('#endDate').value;
    const stepsText = form.querySelector('#projectSteps').value.trim();

    if (!name || !type || !startDate || !endDate) {
      this.showNotification('Preencha todos os campos obrigatórios.', 'error');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      this.showNotification('A data de conclusão não pode ser anterior à de início.', 'error');
      return;
    }

    const project = {
      id: Date.now(),
      name,
      type,
      description,
      startDate,
      endDate,
      steps: stepsText ? stepsText.split('\n').map(text => ({ text: text.trim(), completed: false })).filter(s => s.text) : [],
      createdAt: new Date().toISOString()
    };

    this.projects.push(project);
    this.saveToLocalStorage();
    this.renderAll();
    form.reset();
    this.showNotification('Projeto adicionado com sucesso!', 'success');
  }

  updateProject() {
    const modal = this.dom.editModal;
    const projectId = parseInt(modal.id.value);
    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const updatedData = {
      name: modal.name.value.trim(),
      type: modal.type.value,
      description: modal.description.value.trim(),
      startDate: modal.startDate.value,
      endDate: modal.endDate.value,
      steps: modal.steps.value.trim() ? modal.steps.value.trim().split('\n').map(text => ({ text: text.trim(), completed: false })) : [],
    };

    if (new Date(updatedData.endDate) < new Date(updatedData.startDate)) {
      this.showNotification('A data de conclusão não pode ser anterior à de início.', 'error');
      return;
    }

    const oldProject = this.projects[projectIndex];
    updatedData.steps.forEach(newStep => {
      const oldStep = oldProject.steps.find(s => s.text === newStep.text);
      if (oldStep) newStep.completed = oldStep.completed;
    });

    this.projects[projectIndex] = { ...oldProject, ...updatedData };
    this.saveToLocalStorage();
    this.renderAll();
    this.closeEditModal();
    this.showNotification('Projeto atualizado com sucesso!', 'info');
  }

  deleteProject(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (project && confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      this.projects = this.projects.filter(p => p.id !== projectId);
      this.saveToLocalStorage();
      this.renderAll();
      this.showNotification('Projeto excluído!', 'warning');
    }
  }

  toggleStep(projectId, stepIndex) {
    const project = this.projects.find(p => p.id === projectId);
    if (project && project.steps[stepIndex]) {
      project.steps[stepIndex].completed = !project.steps[stepIndex].completed;
      this.saveToLocalStorage(true);
      this.renderAll();
    }
  }

  openEditModal(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    const modal = this.dom.editModal;
    modal.id.value = project.id;
    modal.name.value = project.name;
    modal.type.value = project.type;
    modal.description.value = project.description;
    modal.startDate.value = project.startDate;
    modal.endDate.value = project.endDate;
    modal.steps.value = project.steps.map(s => s.text).join('\n');
    modal.modal.style.display = 'flex';
  }

  closeEditModal() {
    this.dom.editModal.modal.style.display = 'none';
  }

  renderProjects() {
    this.projects.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    this.dom.projectsGrid.innerHTML =
      this.projects.length > 0
        ? this.projects.map(p => this.createProjectCard(p)).join('')
        : '<div class="no-projects"><p>Nenhum projeto adicionado ainda.<br>Comece criando seu primeiro projeto!</p></div>';
  }

  createProjectCard(project) {
    const progress = this.calculateProgress(project.steps);
    const { days, isOverdue } = this.calculateDaysRemaining(project.endDate);
    return `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-header">
          <div class="project-title">${project.name}</div>
          <div class="project-type ${project.type}">${project.type}</div>
        </div>
        <div class="project-description">${project.description || '<i>Sem descrição.</i>'}</div>
        <div class="project-dates">
          <div class="date-item">
            <div class="date-label">Início</div>
            <div class="date-value">${this.formatDate(project.startDate)}</div>
          </div>
          <div class="date-item">
            <div class="date-label">Conclusão</div>
            <div class="date-value" style="color: ${isOverdue ? '#e74c3c' : 'var(--ghostwhite)'}">${this.formatDate(project.endDate)}</div>
          </div>
          <div class="date-item">
            <div class="date-label">${isOverdue ? 'Atrasado há' : 'Restam'}</div>
            <div class="date-value" style="color: ${isOverdue ? '#e74c3c' : '#27ae60'}">${days} dia${days !== 1 ? 's' : ''}</div>
          </div>
        </div>
        ${project.steps.length > 0 ? `
        <div class="progress-section">
          <div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>
          <div class="progress-text">${progress}% concluído</div>
        </div>
        <ul class="steps-list">
          ${project.steps.map((step, index) => `
            <li class="step-item ${step.completed ? 'completed' : ''}">
              <input type="checkbox" class="step-checkbox" data-project-id="${project.id}" data-step-index="${index}" ${step.completed ? 'checked' : ''} aria-label="Marcar etapa '${step.text}'">
              <span class="step-text">${step.text}</span>
            </li>`).join('')}
        </ul>` : ''}
        <div class="project-actions">
          <button class="btn btn-edit" data-project-id="${project.id}" aria-label="Editar projeto ${project.name}">Editar</button>
          <button class="btn btn-danger btn-delete" data-project-id="${project.id}" aria-label="Excluir projeto ${project.name}">Excluir</button>
        </div>
      </div>`;
  }

  updateStats() {
    const total = this.projects.length;
    const completed = this.projects.filter(p => this.calculateProgress(p.steps) === 100).length;
    this.dom.stats.total.textContent = total;
    this.dom.stats.completed.textContent = completed;
    this.dom.stats.pending.textContent = total - completed;
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      notification.addEventListener('transitionend', () => notification.remove());
    }, 4000);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T00:00:00');
    return this.dateFormatter.format(date);
  }

  calculateProgress(steps) {
    if (!steps || steps.length === 0) return 0;
    const completed = steps.filter(step => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  }

  calculateDaysRemaining(endDateStr) {
    if (!endDateStr) return { days: 0, isOverdue: false };
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const [year, month, day] = endDateStr.split('-').map(Number);
    const endDateUTC = Date.UTC(year, month - 1, day);
    const dayDiff = Math.round((endDateUTC - todayUTC) / (1000 * 3600 * 24));
    return { days: Math.abs(dayDiff), isOverdue: dayDiff < 0 };
  }
}

function initIndexPage() {
  const projectLink = document.createElement('link');
  projectLink.rel = 'prefetch';
  projectLink.href = 'Project.html';
  document.head.appendChild(projectLink);

  const notepadLink = document.createElement('link');
  notepadLink.rel = 'prefetch';
  notepadLink.href = 'Notepad.html';
  document.head.appendChild(notepadLink);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('notepadTextarea')) {
    window.mugenNotepad = new MugenNotepad();
  }
  if (document.getElementById('projectForm')) {
    window.organizer = new ProjectOrganizer();
  }
  initIndexPage();
});
