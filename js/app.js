/**
 * MugenNotepad: Classe para gerir a funcionalidade do bloco de notas.
 */
class MugenNotepad {
  constructor() {
    this.STORAGE_KEY = 'mugenNotepadData';
    this.autoSaveTimeout = null;
    // A inicialização só ocorre se os elementos necessários existirem.
    if (this.cacheDOM()) {
      this.bindEvents();
      this.loadNote();
      this.updateCounters();
    }
  }

  cacheDOM() {
    this.textarea = document.getElementById('notepadTextarea');
    if (!this.textarea) return false; // Aborta se o elemento principal não for encontrado

    this.charCounter = document.getElementById('charCounter');
    this.wordCounter = document.getElementById('wordCounter');
    this.autoSaveStatus = document.getElementById('autoSaveStatus');
    return true;
  }

  bindEvents() {
    this.textarea.addEventListener('input', () => {
      this.updateCounters();
      this.scheduleAutoSave();
    });
  }

  loadNote() {
    try {
      const savedNote = localStorage.getItem(this.STORAGE_KEY);
      if (savedNote) {
        this.textarea.value = savedNote;
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
    }, 1500); // Aumentado o tempo para 1.5s
  }

  showAutoSaveStatus(status) {
    if (!this.autoSaveStatus) return;
    this.autoSaveStatus.className = 'auto-save-status';
    switch (status) {
      case 'saving':
        this.autoSaveStatus.textContent = 'A guardar...';
        this.autoSaveStatus.classList.add('saving');
        break;
      case 'saved':
        this.autoSaveStatus.textContent = 'Guardado';
        this.autoSaveStatus.classList.add('saved');
        setTimeout(() => {
          this.autoSaveStatus.textContent = 'Auto-save ativo';
          this.autoSaveStatus.classList.remove('saved');
        }, 2000);
        break;
      case 'error':
        this.autoSaveStatus.textContent = 'Erro ao guardar';
        break;
    }
  }

  updateCounters() {
    if (!this.textarea) return;
    const text = this.textarea.value;
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    this.charCounter.textContent = `${charCount.toLocaleString()} caracteres`;
    this.wordCounter.textContent = `${wordCount.toLocaleString()} palavras`;
  }
}

/**
 * ProjectOrganizer: Classe para gerir toda a lógica dos projetos.
 */
class ProjectOrganizer {
  constructor() {
    this.STORAGE_KEY = 'mugenProjectsData';
    // A inicialização só ocorre se a página de projetos estiver ativa.
    if (this.cacheDOM()) {
      this.projects = this.loadFromLocalStorage() || [];
      this.dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC'
      });
      this.bindEvents();
      this.renderAll();
    }
  }

  cacheDOM() {
    this.dom = {};
    this.dom.projectForm = document.getElementById('projectForm');
    if (!this.dom.projectForm) return false; // Aborta se o formulário não existir

    this.dom.projectsGrid = document.getElementById('projectsGrid');
    this.dom.stats = {
      total: document.getElementById('totalProjects'),
      completed: document.getElementById('completedProjects'),
      pending: document.getElementById('pendingProjects'),
    };
    this.dom.editModal = {
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
    };
    return true;
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
      if (!isSilent) this.showNotification('Progresso guardado!', 'success');
    } catch (error) {
      console.error('Erro ao guardar no localStorage:', error);
      if (!isSilent) this.showNotification('Erro ao guardar localmente.', 'error');
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
      this.showNotification('Preencha os campos obrigatórios.', 'error');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      this.showNotification('A data de conclusão não pode ser anterior à de início.', 'error');
      return;
    }

    const project = {
      id: Date.now(),
      name, type, description, startDate, endDate,
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
    this.showNotification('Projeto atualizado!', 'info');
  }

  deleteProject(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (project && confirm(`Tem a certeza que deseja apagar o projeto "${project.name}"?`)) {
      this.projects = this.projects.filter(p => p.id !== projectId);
      this.saveToLocalStorage();
      this.renderAll();
      this.showNotification('Projeto apagado!', 'warning');
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
    this.projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mais recentes primeiro
    this.dom.projectsGrid.innerHTML = this.projects.length > 0
        ? this.projects.map(p => this.createProjectCard(p)).join('')
        : '<div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--fg-muted);">Nenhum projeto adicionado ainda.</div>';
  }

  createProjectCard(project) {
    const progress = this.calculateProgress(project.steps);
    const { days, isOverdue } = this.calculateDaysRemaining(project.endDate);
    const overdueClass = isOverdue ? 'color: var(--danger-fg);' : '';
    const dateLabel = isOverdue ? 'Atrasado há' : 'Restam';

    return `
      <div class="card project-card" data-project-id="${project.id}">
        <div class="project-header">
          <span class="project-title">${project.name}</span>
          <span class="project-type ${project.type}">${project.type}</span>
        </div>
        <p style="color: var(--fg-muted); flex-grow: 1;">${project.description || '<i>Sem descrição.</i>'}</p>
        <div class="project-dates">
          <div><span class="date-label">Início</span><br>${this.formatDate(project.startDate)}</div>
          <div><span class="date-label">Fim</span><br>${this.formatDate(project.endDate)}</div>
          <div style="${overdueClass}"><span class="date-label">${dateLabel}</span><br>${days} dia(s)</div>
        </div>
        ${project.steps.length > 0 ? `
        <div>
          <div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>
          <div style="font-size: 12px; color: var(--fg-muted);">${progress}% concluído</div>
        </div>
        <ul class="steps-list">
          ${project.steps.map((step, index) => `
            <li class="step-item ${step.completed ? 'completed' : ''}">
              <input type="checkbox" class="step-checkbox" data-project-id="${project.id}" data-step-index="${index}" ${step.completed ? 'checked' : ''}>
              <span class="step-text">${step.text}</span>
            </li>`).join('')}
        </ul>` : ''}
        <div class="project-actions">
          <button class="btn btn-edit" data-project-id="${project.id}">Editar</button>
          <button class="btn btn-danger btn-delete" data-project-id="${project.id}">Apagar</button>
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
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.remove('show');
      notification.addEventListener('transitionend', () => notification.remove());
    }, 4000);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T00:00:00'); // Trata a data como local
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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDate = new Date(endDateStr + 'T00:00:00');
    const dayDiff = Math.ceil((endDate - today) / (1000 * 3600 * 24));
    return { days: Math.abs(dayDiff), isOverdue: dayDiff < 0 };
  }
}

/**
 * Ponto de entrada da aplicação.
 * Ouve o evento 'DOMContentLoaded' para garantir que o DOM está pronto.
 * Instancia a classe correta dependendo da página atual.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Tenta inicializar ambas as classes.
  // A lógica interna de cada classe irá garantir que ela só é executada
  // se os seus elementos HTML específicos existirem na página.
  new MugenNotepad();
  new ProjectOrganizer();
});
