// js/app.js

// Importa todos os "moldes" de estilo do novo arquivo css.js
import {
    appHeaderSheet,
    projectCardSheet,
    projectsListSheet,
    addProjectFormSheet,
    projectStatsSheet,
    editProjectModalSheet,
    fileViewerSheet
} from './css.ts';
import { projectsStore, type Project, type Step } from './store.ts';

import './notifications.ts';

/* MugenOs Web Components */

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Aplica o "molde" de estilo ao componente
    this.shadowRoot.adoptedStyleSheets = [appHeaderSheet];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Agora o innerHTML contém apenas o HTML
    this.shadowRoot.innerHTML = `
      <header class="header">
        <nav class="nav">
          <a href="index.html" class="nav-brand">MugenOs</a>
          <div class="nav-links">
            <a href="Editor.html">Editor</a>
            <a href="Project.html">Projetos</a>
          </div>
        </nav>
      </header>`;
  }
}
customElements.define('app-header', AppHeader);

class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [projectCardSheet];
  }

  set project(value) {
    this._project = value;
    if (this.isConnected) this.render();
  }

  get project() {
    return this._project;
  }

  connectedCallback() {
    if (this._project) this.render();
  }

  render() {
    const p = this._project;
    const progress = this.calculateProgress(p.steps);
    const { days, isOverdue } = this.calculateDaysRemaining(p.endDate);
    const dateLabel = isOverdue ? 'Atrasado há' : 'Restam';

    this.shadowRoot.innerHTML = `<div class="card"></div>`;
    const card = this.shadowRoot.querySelector('.card') as HTMLElement;

    const header = document.createElement('div');
    header.className = 'project-header';
    const title = document.createElement('span');
    title.className = 'project-title';
    title.textContent = p.name;
    const type = document.createElement('span');
    type.className = `project-type ${p.type}`;
    type.textContent = p.type;
    header.append(title, type);
    card.appendChild(header);

    const desc = document.createElement('p');
    desc.style.color = 'var(--fg-muted)';
    desc.style.flexGrow = '1';
    desc.textContent = p.description || 'Sem descrição.';
    card.appendChild(desc);

    const dates = document.createElement('div');
    dates.className = 'project-dates';
    const start = document.createElement('div');
    start.innerHTML = '<span class="date-label">Início</span><br>';
    start.appendChild(document.createTextNode(this.formatDate(p.startDate)));
    const end = document.createElement('div');
    end.innerHTML = '<span class="date-label">Fim</span><br>';
    end.appendChild(document.createTextNode(this.formatDate(p.endDate)));
    const remain = document.createElement('div');
    if (isOverdue) remain.style.color = 'var(--danger-fg)';
    remain.innerHTML = `<span class="date-label">${dateLabel}</span><br>`;
    remain.appendChild(document.createTextNode(`${days} dia(s)`));
    dates.append(start, end, remain);
    card.appendChild(dates);

    if (p.steps.length > 0) {
      const progContainer = document.createElement('div');
      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      const fill = document.createElement('div');
      fill.className = 'progress-fill';
      fill.style.width = `${progress}%`;
      bar.appendChild(fill);
      progContainer.appendChild(bar);
      const progText = document.createElement('div');
      progText.style.fontSize = '12px';
      progText.style.color = 'var(--fg-muted)';
      progText.textContent = `${progress}% concluído`;
      progContainer.appendChild(progText);
      card.appendChild(progContainer);

      const list = document.createElement('ul');
      list.className = 'steps-list';
      p.steps.forEach(s => {
        const li = document.createElement('li');
        li.className = `step-item ${s.completed ? 'completed' : ''}`;
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'step-checkbox';
        cb.dataset.id = s.id;
        if (s.completed) cb.checked = true;
        const span = document.createElement('span');
        span.className = 'step-text';
        span.textContent = s.text;
        li.append(cb, span);
        list.appendChild(li);
      });
      card.appendChild(list);
    }

    const actions = document.createElement('div');
    actions.className = 'project-actions';
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-edit';
    editBtn.textContent = 'Editar';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-delete';
    deleteBtn.textContent = 'Apagar';
    actions.append(editBtn, deleteBtn);
    card.appendChild(actions);

    deleteBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-project', { bubbles: true, detail: { projectId: p.id } }));
    });
    editBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('edit-project', { bubbles: true, detail: { projectId: p.id } }));
    });
    card.querySelectorAll('.step-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = (cb as HTMLInputElement).dataset.id!;
        this.dispatchEvent(new CustomEvent('toggle-step', { bubbles: true, detail: { projectId: p.id, stepId: id } }));
      });
    });
  }

  calculateProgress(steps){
    if(!steps||!steps.length)return 0;
    const completed=steps.filter(s=>s.completed).length;
    return Math.round((completed/steps.length)*100);
  }
  formatDate(str){
    if(!str) return 'N/A';
    const d = this.parseDateUTC(str);
    return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(d);
  }
  calculateDaysRemaining(end){
    if(!end) return {days:0,isOverdue:false};
    const today = this.parseDateUTC(new Date().toISOString().slice(0,10));
    const endDate = this.parseDateUTC(end);
    const diff=Math.ceil((endDate.getTime()-today.getTime())/(1000*3600*24));
    return {days:Math.abs(diff),isOverdue:diff<0};
  }
  parseDateUTC(str:string){
    const [y,m,d]=str.split('-').map(Number);
    return new Date(Date.UTC(y,m-1,d));
  }
}
customElements.define('project-card',ProjectCard);

class ProjectsList extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.adoptedStyleSheets = [projectsListSheet];
    this.projects=[];
  }

  connectedCallback(){
    this.projects = projectsStore.getAll();
    this.render();
    this.addEventListener('delete-project',e=>projectsStore.delete(e.detail.projectId));
    this.addEventListener('edit-project',e=>{this.dispatchEvent(new CustomEvent('edit-project',{bubbles:true,detail:e.detail}));});
    this.addEventListener('toggle-step',e=>projectsStore.toggleStep(e.detail.projectId,e.detail.stepId));
    projectsStore.addEventListener('change',e=>{this.projects=e.detail;this.render();});
  }


  getProjectById(id){
    return projectsStore.getById(id);
  }

  render(){
    this.shadowRoot.innerHTML=`<div class="grid"></div>`;
    const grid=this.shadowRoot.querySelector('.grid');
    if(this.projects.length===0){
      grid.innerHTML='<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--fg-muted);">Nenhum projeto adicionado ainda.</div>';
      return;
    }
    this.projects.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    grid.innerHTML='';
    this.projects.forEach(p=>{
      const card=document.createElement('project-card');
      card.project=p;
      grid.appendChild(card);
    });
    this.dispatchEvent(new CustomEvent('projects-changed',{bubbles:true,detail:this.projects}));
  }
}
customElements.define('projects-list',ProjectsList);

class AddProjectForm extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.adoptedStyleSheets = [addProjectFormSheet];
  }

  connectedCallback(){
    this.render();
  }

  render(){
    this.shadowRoot.innerHTML=`
      <h2 style="margin-bottom:20px;">Adicionar Novo Projeto</h2>
      <form id="form">
        <div class="form-row">
          <div class="form-group"><label for="name">Nome do Projeto</label><input id="name" required></div>
          <div class="form-group"><label for="type">Tipo</label><select id="type" required><option value="">Selecione o tipo</option><option value="pessoal">Pessoal</option><option value="trabalho">Trabalho</option></select></div>
        </div>
        <div class="form-group"><label for="desc">Descrição</label><textarea id="desc" placeholder="Descreva o projeto..."></textarea></div>
        <div class="form-row">
          <div class="form-group"><label for="start">Data de Início</label><input type="date" id="start" required></div>
          <div class="form-group"><label for="end">Data de Conclusão</label><input type="date" id="end" required></div>
        </div>
        <div class="form-group"><label for="steps">Etapas do Projeto (uma por linha)</label><textarea id="steps" placeholder="Etapa 1\nEtapa 2\nEtapa 3"></textarea></div>
        <button type="submit">Adicionar Projeto</button>
      </form>`;

    // Event listener com validações melhoradas
    this.shadowRoot.querySelector('#form').addEventListener('submit',e=>{
      e.preventDefault();
      const name=this.shadowRoot.querySelector('#name').value.trim();
      const type=this.shadowRoot.querySelector('#type').value;
      const description=this.shadowRoot.querySelector('#desc').value.trim();
      const startDate=this.shadowRoot.querySelector('#start').value;
      const endDate=this.shadowRoot.querySelector('#end').value;
      const stepsText=this.shadowRoot.querySelector('#steps').value.trim();
      
      // Validações melhoradas
      if(!name||!type||!startDate||!endDate) {
        window.notifications?.show('Preencha todos os campos obrigatórios', 'error');
        return;
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if(end < start) {
        window.notifications?.show('Data de fim deve ser posterior à data de início', 'error');
        return;
      }
      
      const project: Project={
        id: crypto.randomUUID(),
        name,
        type,
        description,
        startDate,
        endDate,
        steps:stepsText?stepsText.split('\n').map(t=>({id:crypto.randomUUID(),text:t.trim(),completed:false})).filter(s=>s.text):[],
        createdAt:new Date().toISOString()
      };

      projectsStore.add(project);
      this.shadowRoot.querySelector('#form').reset();
      
      // Notificação de sucesso
      window.notifications?.show('Projeto adicionado com sucesso!', 'success');
    });
  }
}
customElements.define('add-project-form',AddProjectForm);

class ProjectStats extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.adoptedStyleSheets = [projectStatsSheet];
  }
  set projects(arr){this._projects=arr||[];if(this.isConnected)this.render();}
  get projects(){return this._projects||[];}
  connectedCallback(){this.render();}
  render(){
    const total=this.projects.length;
    const completed = this.projects.filter(p => {
        if (!p.steps || p.steps.length === 0) return false;
        const progress = Math.round((p.steps.filter(s => s.completed).length / p.steps.length) * 100);
        return progress === 100;
    }).length;
    const pending=total-completed;
    this.shadowRoot.innerHTML=`
      <div class="stats">
        <div class="stat-card"><div class="stat-number">${total}</div><div class="stat-label">Total de Projetos</div></div>
        <div class="stat-card"><div class="stat-number">${completed}</div><div class="stat-label">Concluídos</div></div>
        <div class="stat-card"><div class="stat-number">${pending}</div><div class="stat-label">Em Andamento</div></div>
      </div>`;
  }
}
customElements.define('project-stats',ProjectStats);

class EditProjectModal extends HTMLElement {
  private currentProject: any = null;

  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.adoptedStyleSheets = [editProjectModalSheet];
  }

  connectedCallback(){
    this.render();
  }

  render(){
    this.shadowRoot.innerHTML=`
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="editTitle">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <h2 id="editTitle">Editar Projeto</h2>
          <form id="form">
            <input type="hidden" id="pid">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Nome do Projeto</label>
                <input id="name" required>
              </div>
              <div class="form-group">
                <label for="type">Tipo</label>
                <select id="type" required>
                  <option value="">Selecione o tipo</option>
                  <option value="pessoal">Pessoal</option>
                  <option value="trabalho">Trabalho</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="desc">Descrição</label>
              <textarea id="desc" placeholder="Descreva o projeto..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="start">Data de Início</label>
                <input type="date" id="start" required>
              </div>
              <div class="form-group">
                <label for="end">Data de Conclusão</label>
                <input type="date" id="end" required>
              </div>
            </div>
            <div class="form-group">
              <label for="steps">Etapas do Projeto (uma por linha)</label>
              <textarea id="steps" placeholder="Etapa 1\nEtapa 2\nEtapa 3"></textarea>
              <small style="color: var(--fg-muted); font-size: 12px; margin-top: 4px;">
                ⚠️ Etapas já concluídas manterão seu status
              </small>
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;">
              <button type="button" class="danger" id="cancel">Cancelar</button>
              <button type="submit">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>`;

    const modal = this.shadowRoot.querySelector('.modal');
    modal.querySelector('.close-btn').addEventListener('click', () => this.hide());
    modal.querySelector('#cancel').addEventListener('click', () => this.hide());
    
    modal.querySelector('#form').addEventListener('submit', e => {
      e.preventDefault();
      
      const name = this.shadowRoot.querySelector('#name').value.trim();
      const type = this.shadowRoot.querySelector('#type').value;
      const description = this.shadowRoot.querySelector('#desc').value.trim();
      const startDate = this.shadowRoot.querySelector('#start').value;
      const endDate = this.shadowRoot.querySelector('#end').value;
      const stepsText = this.shadowRoot.querySelector('#steps').value.trim();
      
      // Validações melhoradas
      if (!name || !type || !startDate || !endDate) {
        window.notifications?.show('Preencha todos os campos obrigatórios', 'error');
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        window.notifications?.show('Data de fim deve ser posterior à data de início', 'error');
        return;
      }

      // CORREÇÃO PRINCIPAL: Preservar status das etapas existentes
      const newSteps: Step[] = stepsText ?
        stepsText.split('\n')
          .map(t=>t.trim())
          .filter(t=>t.length>0)
          .map((text, index) => {
            const existing = this.currentProject?.steps?.[index];
            return {
              id: existing?.id || crypto.randomUUID(),
              text,
              completed: existing?.completed || false
            };
          }) : [];

      const data: Partial<Project> = {
        name,
        type,
        description,
        startDate,
        endDate,
        steps: newSteps,
        updatedAt: new Date().toISOString()
      };

      const id = this.shadowRoot.querySelector('#pid').value;

      projectsStore.update(id, data);
      
      window.notifications?.show('Projeto atualizado com sucesso!', 'success');
      this.hide();
    });
  }

  open(project: any) {
    this.currentProject = project; // Guardar referência do projeto atual
    
    this.shadowRoot.querySelector('.modal').classList.add('visible');
    this.shadowRoot.querySelector('#pid').value = project.id;
    this.shadowRoot.querySelector('#name').value = project.name;
    this.shadowRoot.querySelector('#type').value = project.type;
    this.shadowRoot.querySelector('#desc').value = project.description || '';
    this.shadowRoot.querySelector('#start').value = project.startDate;
    this.shadowRoot.querySelector('#end').value = project.endDate;
    
    // Preencher etapas preservando ordem e status
    const stepsText = project.steps?.map(s => s.text).join('\n') || '';
    this.shadowRoot.querySelector('#steps').value = stepsText;
  }

  hide() {
    this.shadowRoot.querySelector('.modal').classList.remove('visible');
    this.currentProject = null;
  }
}
customElements.define('edit-project-modal',EditProjectModal);

class RepositorySidebar extends HTMLElement {
  private activeFileId: string | null = null;
  private mockFileSystem = [
    { id: '1', name: 'BoasVindas.md', type: 'file', content: '# MugenOs Editor\n\nSelecione um arquivo para começar.' },
    { 
      id: '2', 
      name: 'Projetos', 
      type: 'folder', 
      children: [
        { id: '3', name: 'Ideias.txt', type: 'file', content: '- Conquistar o mundo\n- Aprender TypeScript\n- Criar o melhor sistema de organização' },
        { 
          id: '4', 
          name: 'Financeiro', 
          type: 'folder', 
          children: [
            { id: '5', name: 'planejamento.md', type: 'file', content: '## Orçamento 2025\n\n### Receitas\n- Salário: R$ 5.000\n- Freelance: R$ 1.500\n\n### Despesas\n- Aluguel: R$ 1.200\n- Alimentação: R$ 800' }
          ]
        }
      ]
    }
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          background: transparent;
          border-right: 1px solid var(--border-default);
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
          color: #cccccc;
        }
        
        .sidebar-header {
          font-weight: 500;
          font-size: 11px;
          color: #cccccc;
          padding: 16px 12px 8px 16px;
          border-bottom: 1px solid #2d2d30;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .new-file-btn {
          font-size: 12px;
          padding: 4px 8px;
          background: #007acc;
          color: white;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s ease;
          text-transform: none;
          letter-spacing: 0;
        }
        
        .new-file-btn:hover {
          background: #1177bb;
        }
        
        .file-tree {
          list-style: none;
          padding: 0;
          margin: 0;
          flex-grow: 1;
          overflow-y: auto;
        }
        
        .file-item {
          padding: 4px 16px;
          margin: 0;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          line-height: 22px;
        }
        
        .file-item:hover {
          background: #2a2d2e;
        }
        
        .file-item.file {
          color: #cccccc;
        }
        
        .file-item.file.active {
          background: #37373d;
          color: #ffffff;
        }
        
        .file-item.folder {
          color: #cccccc;
          font-weight: 400;
        }
        
        .file-icon {
          font-size: 14px;
          width: 16px;
          text-align: center;
          opacity: 0.8;
        }
        
        .nested {
          margin-left: 20px;
        }
      </style>
      <div class="sidebar-header">
        <span>Explorer</span>
        <button class="new-file-btn" id="newFileBtn">+</button>
      </div>
      <ul class="file-tree">
        ${this.renderFileTree(this.mockFileSystem)}
      </ul>
    `;
    
    this.attachEventListeners();
  }

  renderFileTree(items, isNested = false) {
    return items.map(item => {
      if (item.type === 'file') {
        const isActive = this.activeFileId === item.id;
        return `
          <li class="file-item file ${isActive ? 'active' : ''}" data-id="${item.id}">
            <span class="file-icon">📄</span>
            <span>${item.name}</span>
          </li>
        `;
      } else {
        return `
          <li class="file-item folder">
            <span class="file-icon">📁</span>
            <span>${item.name}</span>
          </li>
          ${item.children ? `<ul class="nested">${this.renderFileTree(item.children, true)}</ul>` : ''}
        `;
      }
    }).join('');
  }

  attachEventListeners() {
    // File selection event listeners
    const fileItems = this.shadowRoot.querySelectorAll('.file-item.file');
    fileItems.forEach(item => {
      item.addEventListener('click', () => {
        const fileId = item.dataset.id;
        const file = this.findFileById(fileId, this.mockFileSystem);
        if (file) {
          this.activeFileId = fileId;
          this.render(); // Re-render to update active state
          this.dispatchEvent(new CustomEvent('file-selected', {
            bubbles: true,
            composed: true,
            detail: { file }
          }));
        }
      });
    });

    // New file button event listener
    const newFileBtn = this.shadowRoot.querySelector('#newFileBtn');
    if (newFileBtn) {
      newFileBtn.addEventListener('click', () => {
        this.activeFileId = null;
        this.render(); // Re-render to clear active state
        this.dispatchEvent(new CustomEvent('new-file', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  findFileById(id, items) {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = this.findFileById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }
}
customElements.define('repository-sidebar', RepositorySidebar);

class FileViewer extends HTMLElement {
  private currentFile: any = null;
  private isNewFile: boolean = true;
  private isEditing: boolean = false;

  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.adoptedStyleSheets = [fileViewerSheet];
  }

  connectedCallback() {
    this.render();
    this.updateCounters();
    this.attachTextareaListeners();
    
    // Listen for file selection events
    window.addEventListener('file-selected', (event: CustomEvent) => {
      this.currentFile = event.detail.file;
      this.isNewFile = false;
      this.isEditing = false;
      this.render();
      this.updateCounters();
      this.attachTextareaListeners();
    });

    // Listen for new file events
    window.addEventListener('new-file', () => {
      this.currentFile = null;
      this.isNewFile = true;
      this.isEditing = true;
      this.render();
      this.updateCounters();
      this.attachTextareaListeners();
    });

  }

  attachTextareaListeners() {
    const textarea = this.shadowRoot.querySelector('#text') as HTMLTextAreaElement;
    if (textarea) {
      textarea.addEventListener('input', () => {
        this.updateCounters();
        this.updateLineNumbers();
      });
      
      // Sync scroll between textarea and line numbers
      textarea.addEventListener('scroll', () => {
        const lineNumbers = this.shadowRoot.querySelector('#lineNumbers');
        if (lineNumbers) {
          lineNumbers.scrollTop = textarea.scrollTop;
        }
      });
    }
  }

  updateLineNumbers() {
    const textarea = this.shadowRoot.querySelector('#text') as HTMLTextAreaElement;
    const lineNumbers = this.shadowRoot.querySelector('#lineNumbers');
    
    if (textarea && lineNumbers) {
      const lines = textarea.value.split('\n');
      const numbers = lines.map((_, i) => i + 1).join('\n');
      lineNumbers.textContent = numbers;
    }
  }


  render(){
    const currentFileName = this.currentFile ? this.currentFile.name : 'Novo arquivo';
    const currentContent = this.currentFile ? this.currentFile.content : '';
    
    // Determine what buttons to show
    const showEditButton = !this.isEditing && this.currentFile;
    const showSaveButton = this.isEditing;
    const saveButtonText = this.isNewFile ? 'Salvar Como' : 'Salvar';
    
    this.shadowRoot.innerHTML=`
      <div class="container">
        <div class="header">
          <span class="title">${currentFileName}</span>
          <div class="header-actions">
            ${showEditButton ? '<button class="btn" id="editBtn">Editar</button>' : ''}
            ${showSaveButton ? `<button class="btn btn-primary" id="saveBtn">${saveButtonText}</button>` : ''}
          </div>
        </div>
        ${this.renderContent(currentContent)}
        <div class="footer">
          <div class="stats">
            <div class="chars" id="chars">0 caracteres</div>
            <div class="words" id="words">0 palavras</div>
            <div class="lines" id="lines">0 linhas</div>
          </div>
        </div>
      </div>`;
      
    // Add event listeners
    this.attachButtonEventListeners(saveButtonText);
  }

  renderContent(content: string): string {
    if (!this.currentFile && !this.isEditing) {
      // Empty state - no file selected
      return '<div class="empty-state">Selecione um arquivo no painel à esquerda para visualizá-lo.</div>';
    }
    
    if (this.isEditing) {
      // Edit mode - show textarea with line numbers
      const placeholder = this.isNewFile ? 
        'Digite o conteúdo do novo arquivo...' : 
        'Edite o conteúdo do arquivo...';
      const lines = content.split('\n');
      const lineNumbers = lines.map((_, i) => i + 1).join('\n');
      
      return `<div class="editor-container">
        <div class="line-numbers" id="lineNumbers">${lineNumbers}</div>
        <textarea 
          id="text" 
          placeholder="${placeholder}"
          spellcheck="false"
        >${content}</textarea>
      </div>`;
    } else {
      // Read-only mode - show content display with line numbers
      const lines = (content || 'Arquivo vazio').split('\n');
      const lineNumbers = lines.map((_, i) => i + 1).join('\n');
      
      return `<div class="editor-container">
        <div class="line-numbers">${lineNumbers}</div>
        <div class="content-display" id="content">${content || 'Arquivo vazio'}</div>
      </div>`;
    }
  }

  attachButtonEventListeners(saveButtonText: string) {
    // Edit button event listener
    const editBtn = this.shadowRoot.querySelector('#editBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.isEditing = true;
        this.render();
        this.updateCounters();
        this.attachTextareaListeners();
      });
    }

    // Save button event listener
    const saveBtn = this.shadowRoot.querySelector('#saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const textarea = this.shadowRoot.querySelector('#text') as HTMLTextAreaElement;
        const content = textarea ? textarea.value : '';
        console.log('Action:', saveButtonText, 'File:', this.currentFile, 'Content:', content);
        // Switch back to read-only mode after save
        this.isEditing = false;
        if (this.currentFile) {
          this.currentFile.content = content;
        }
        this.render();
        this.updateCounters();
        this.attachTextareaListeners();
      });
    }
  }


  updateCounters() {
    let text = '';
    
    // Get text from either textarea (edit mode) or content display (read mode)
    const textarea = this.shadowRoot.querySelector('#text') as HTMLTextAreaElement;
    const contentDisplay = this.shadowRoot.querySelector('#content') as HTMLDivElement;
    
    if (textarea) {
      text = textarea.value;
    } else if (contentDisplay) {
      text = contentDisplay.textContent || '';
    }
    
    const chars = text.length;
    const words = this.getWordCount(text);
    const lines = text ? text.split('\n').length : 0;
    
    const charsEl = this.shadowRoot.querySelector('#chars');
    const wordsEl = this.shadowRoot.querySelector('#words');
    const linesEl = this.shadowRoot.querySelector('#lines');
    
    if (charsEl) charsEl.textContent = `${chars.toLocaleString('pt-BR')} caracteres`;
    if (wordsEl) wordsEl.textContent = `${words.toLocaleString('pt-BR')} palavras`;
    if (linesEl) linesEl.textContent = `${lines.toLocaleString('pt-BR')} linhas`;
  }

  private getWordCount(text: string): number {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }

}
customElements.define('file-viewer',FileViewer);

/* Orchestrate components on each page */
document.addEventListener('DOMContentLoaded',()=>{
  const projectsList=document.querySelector('projects-list');
  const stats=document.querySelector('project-stats');
  const modal=document.querySelector('edit-project-modal');
  if(projectsList){
    stats.projects=projectsStore.getAll();
    projectsStore.addEventListener('change',e=>{stats.projects=e.detail;});
    projectsList.addEventListener('edit-project',e=>{
      const project=projectsStore.getById(e.detail.projectId);
      modal.open(project);
    });
  }
});
