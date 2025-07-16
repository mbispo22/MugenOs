/* MugenOs Web Components */

class AppHeader extends HTMLElement {
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
        .header {
          background: var(--bg-default);
          border-bottom: 1px solid var(--border-default);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px;
        }
        .nav-brand {
          font-weight: 600;
          font-size: 20px;
          color: var(--fg-default);
          /* INÍCIO DA ALTERAÇÃO: Efeito de gradiente na logo */
          background: linear-gradient(135deg, #58a6ff 0%, #79c0ff 50%, #56d364 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
           /* FIM DA ALTERAÇÃO */
        }
        .nav-links a {
          margin-left: 16px;
          padding: 8px;
          color: var(--accent-fg);
          text-decoration: none;
        }
        .nav-links a:hover {
          text-decoration: underline;
        }
        /* INÍCIO DA ALTERAÇÃO: Remove o sublinhado da logo */
        .nav-brand:hover {
            text-decoration: none;
        }
        /* FIM DA ALTERAÇÃO */
      </style>
      <header class="header">
        <nav class="nav">
          <a href="index.html" class="nav-brand">MugenOs</a>
          <div class="nav-links">
            <a href="Notepad.html">Anotações</a>
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
    const overdueClass = isOverdue ? 'color: var(--danger-fg);' : '';
    const dateLabel = isOverdue ? 'Atrasado há' : 'Restam';
    this.shadowRoot.innerHTML = `
      <style>
        .card{background:linear-gradient(135deg,var(--bg-default) 0%,rgba(22,27,34,0.8) 100%);border:1px solid transparent;background-clip:padding-box;position:relative;gap:12px;padding:16px;border-radius:6px;display:flex;flex-direction:column;}
        .card::before{content:'';position:absolute;inset:0;border-radius:6px;padding:1px;background:linear-gradient(135deg,var(--border-default),transparent);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;}
        .project-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
        .project-title{font-weight:600;font-size:18px;}
        .project-type{padding:2px 8px;border-radius:12px;font-size:12px;font-weight:500;text-transform:capitalize;border:1px solid;backdrop-filter:blur(10px);box-shadow:0 2px 4px rgba(0,0,0,0.2);}
        .project-type.pessoal{color:#56d364;border-color:#56d364;background-color:rgba(56,139,69,0.15);}
        .project-type.trabalho{color:#79c0ff;border-color:#79c0ff;background-color:rgba(57,133,228,0.15);}
        .project-dates{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;font-size:12px;text-align:center;background:var(--bg-muted);padding:8px;border-radius:6px;}
        .date-label{font-size:10px;color:var(--fg-muted);text-transform:uppercase;letter-spacing:0.5px;}
        .project-actions{display:flex;gap:8px;margin-top:16px;}
        .progress-bar{width:100%;height:8px;background:var(--bg-muted);border-radius:4px;overflow:hidden;margin-bottom:8px;}
        .progress-fill{height:100%;border-radius:4px;transition:width 0.5s cubic-bezier(0.4,0,0.2,1);background:linear-gradient(90deg,var(--accent-fg),#79c0ff);position:relative;overflow:hidden;}
        .steps-list{list-style:none;padding:0;margin:12px 0;}
        .step-item{display:flex;align-items:center;gap:8px;padding:8px 0;transition:all 0.2s ease;}
        .step-item.completed{opacity:0.6;}
        .step-item.completed .step-text{text-decoration:line-through;color:var(--success-fg);}
        .step-checkbox{appearance:none;width:20px;height:20px;border:2px solid var(--border-default);border-radius:4px;cursor:pointer;transition:all 0.2s ease;position:relative;}
        .step-checkbox:checked{background:var(--success-fg);border-color:var(--success-fg);}
        .step-checkbox:checked::after{content:'\u2713';position:absolute;color:white;font-weight:bold;top:50%;left:50%;transform:translate(-50%,-50%);}
        .btn{background:#21262d;color:var(--fg-default);border:1px solid var(--border-default);border-radius:6px;padding:8px 16px;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s ease;}
        .btn-danger{background:var(--danger-fg);border-color:var(--danger-fg);color:#fff;}
      </style>
      <div class="card">
        <div class="project-header">
          <span class="project-title">${p.name}</span>
          <span class="project-type ${p.type}">${p.type}</span>
        </div>
        <p style="color:var(--fg-muted);flex-grow:1;">${p.description || '<i>Sem descrição.</i>'}</p>
        <div class="project-dates">
          <div><span class="date-label">Início</span><br>${this.formatDate(p.startDate)}</div>
          <div><span class="date-label">Fim</span><br>${this.formatDate(p.endDate)}</div>
          <div style="${overdueClass}"><span class="date-label">${dateLabel}</span><br>${days} dia(s)</div>
        </div>
        ${p.steps.length>0?`
        <div>
          <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
          <div style="font-size:12px;color:var(--fg-muted);">${progress}% concluído</div>
        </div>
        <ul class="steps-list">
        ${p.steps.map((s,i)=>`<li class="step-item ${s.completed?'completed':''}"><input type="checkbox" class="step-checkbox" data-index="${i}" ${s.completed?'checked':''}><span class="step-text">${s.text}</span></li>`).join('')}
        </ul>`:''}
        <div class="project-actions">
          <button class="btn btn-edit">Editar</button>
          <button class="btn btn-danger btn-delete">Apagar</button>
        </div>
      </div>`;

    this.shadowRoot.querySelector('.btn-delete').addEventListener('click',()=>{
      this.dispatchEvent(new CustomEvent('delete-project',{bubbles:true,detail:{projectId:p.id}}));
    });
    this.shadowRoot.querySelector('.btn-edit').addEventListener('click',()=>{
      this.dispatchEvent(new CustomEvent('edit-project',{bubbles:true,detail:{projectId:p.id}}));
    });
    this.shadowRoot.querySelectorAll('.step-checkbox').forEach(cb=>{
      cb.addEventListener('change',()=>{
        const index=parseInt(cb.dataset.index);
        this.dispatchEvent(new CustomEvent('toggle-step',{bubbles:true,detail:{projectId:p.id,stepIndex:index}}));
      });
    });
  }

  calculateProgress(steps){
    if(!steps||!steps.length)return 0;
    const completed=steps.filter(s=>s.completed).length;
    return Math.round((completed/steps.length)*100);
  }
  formatDate(str){
    if(!str)return 'N/A';
    const date=new Date(str+'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(date);
  }
  calculateDaysRemaining(end){
    if(!end) return {days:0,isOverdue:false};
    const now=new Date();
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const endDate=new Date(end+'T00:00:00');
    const diff=Math.ceil((endDate-today)/(1000*3600*24));
    return {days:Math.abs(diff),isOverdue:diff<0};
  }
}
customElements.define('project-card',ProjectCard);

class ProjectsList extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.projects=[];
  }

  connectedCallback(){
    this.load();
    this.render();
    this.addEventListener('delete-project',e=>{this.deleteProject(e.detail.projectId);});
    this.addEventListener('edit-project',e=>{this.dispatchEvent(new CustomEvent('edit-project',{bubbles:true,detail:e.detail}));});
    this.addEventListener('toggle-step',e=>{this.toggleStep(e.detail.projectId,e.detail.stepIndex);});
  }

  load(){
    try{this.projects=JSON.parse(localStorage.getItem('mugenProjectsData'))||[]}catch(e){this.projects=[];}
  }

  save(){
    localStorage.setItem('mugenProjectsData',JSON.stringify(this.projects));
  }

  addProject(proj){
    this.projects.push(proj);
    this.save();
    this.render();
  }

  updateProject(id,data){
    const idx=this.projects.findIndex(p=>p.id===id);
    if(idx>-1){this.projects[idx]={...this.projects[idx],...data};this.save();this.render();}
  }

  deleteProject(id){
    this.projects=this.projects.filter(p=>p.id!==id);
    this.save();
    this.render();
    this.dispatchEvent(new CustomEvent('projects-changed',{bubbles:true,detail:this.projects}));
  }

  toggleStep(pid,idx){
    const p=this.projects.find(p=>p.id===pid);
    if(p&&p.steps[idx]){p.steps[idx].completed=!p.steps[idx].completed;this.save();this.render();}
  }

  getProjectById(id){
    return this.projects.find(p=>p.id===id);
  }

  render(){
    this.shadowRoot.innerHTML=`
      <style>
        :host{display:block;}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;}
      </style>
      <div class="grid"></div>`;
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
  constructor(){super();this.attachShadow({mode:'open'});}
  connectedCallback(){this.render();}
  render(){
    this.shadowRoot.innerHTML=`
      <style>
        form{display:flex;flex-direction:column;gap:16px;}
        .form-row{display:flex;gap:16px;}
        .form-group{flex:1;display:flex;flex-direction:column;}
        label{margin-bottom:8px;font-weight:500;color:var(--fg-muted);}
        input,select,textarea{padding:8px 12px;border:1px solid var(--border-default);border-radius:6px;font-family:'Fira Code',monospace;font-size:14px;background-color:var(--bg-canvas);color:var(--fg-default);}
        button{background:var(--accent-emphasis);color:#fff;border:1px solid var(--accent-emphasis);border-radius:6px;padding:8px 16px;font-weight:500;cursor:pointer;}
      </style>
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
    this.shadowRoot.querySelector('#form').addEventListener('submit',e=>{
      e.preventDefault();
      const name=this.shadowRoot.querySelector('#name').value.trim();
      const type=this.shadowRoot.querySelector('#type').value;
      const description=this.shadowRoot.querySelector('#desc').value.trim();
      const startDate=this.shadowRoot.querySelector('#start').value;
      const endDate=this.shadowRoot.querySelector('#end').value;
      const stepsText=this.shadowRoot.querySelector('#steps').value.trim();
      if(!name||!type||!startDate||!endDate)return;
      if(new Date(endDate)<new Date(startDate))return;
      const project={name,type,description,startDate,endDate,steps:stepsText?stepsText.split('\n').map(t=>({text:t.trim(),completed:false})).filter(s=>s.text):[]};
      this.dispatchEvent(new CustomEvent('project-added',{bubbles:true,detail:project}));
      this.shadowRoot.querySelector('#form').reset();
    });
  }
}
customElements.define('add-project-form',AddProjectForm);

class ProjectStats extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});}
  set projects(arr){this._projects=arr||[];if(this.isConnected)this.render();}
  get projects(){return this._projects||[];}
  connectedCallback(){this.render();}
  render(){
    const total=this.projects.length;
    const completed=this.projects.filter(p=>p.steps&&p.steps.every(s=>s.completed)).length;
    const pending=total-completed;
    this.shadowRoot.innerHTML=`
      <style>
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;}
        .stat-card{background:var(--bg-default);padding:16px;border-radius:6px;border:1px solid var(--border-default);text-align:center;}
        .stat-number{font-size:24px;font-weight:600;}
      </style>
      <div class="stats">
        <div class="stat-card"><div class="stat-number">${total}</div><div class="stat-label">Total de Projetos</div></div>
        <div class="stat-card"><div class="stat-number">${completed}</div><div class="stat-label">Concluídos</div></div>
        <div class="stat-card"><div class="stat-number">${pending}</div><div class="stat-label">Em Andamento</div></div>
      </div>`;
  }
}
customElements.define('project-stats',ProjectStats);

class EditProjectModal extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._visible=false;}
  connectedCallback(){this.render();}
  render(){
    this.shadowRoot.innerHTML=`
      <style>
        .modal{display:${this._visible?'flex':'none'};position:fixed;top:0;left:0;width:100%;height:100%;align-items:center;justify-content:center;z-index:1000;background:rgba(1,4,9,0.8);backdrop-filter:blur(8px);}
        .modal-content{background:var(--bg-default);padding:24px;border-radius:6px;border:1px solid var(--border-default);box-shadow:var(--shadow-medium);width:90%;max-width:600px;max-height:90vh;overflow-y:auto;position:relative;animation:modalSlideIn 0.3s ease-out;}
        .close-btn{position:absolute;top:16px;right:16px;font-size:24px;cursor:pointer;color:var(--fg-muted);}
        form{display:flex;flex-direction:column;gap:16px;margin-top:20px;}
        .form-row{display:flex;gap:16px;}
        .form-group{flex:1;display:flex;flex-direction:column;}
        label{margin-bottom:8px;font-weight:500;color:var(--fg-muted);}
        input,select,textarea{padding:8px 12px;border:1px solid var(--border-default);border-radius:6px;font-family:'Fira Code',monospace;font-size:14px;background-color:var(--bg-canvas);color:var(--fg-default);}
        button{background:var(--accent-emphasis);color:#fff;border:1px solid var(--accent-emphasis);border-radius:6px;padding:8px 16px;font-weight:500;cursor:pointer;}
        .danger{background:var(--danger-fg);border-color:var(--danger-fg);}
      </style>
      <div class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <h2>Editar Projeto</h2>
          <form id="form">
            <input type="hidden" id="pid">
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
            <div style="display:flex;gap:10px;justify-content:flex-end;">
              <button type="button" class="danger" id="cancel">Cancelar</button>
              <button type="submit">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>`;
    this.shadowRoot.querySelector('.close-btn').addEventListener('click',()=>this.hide());
    this.shadowRoot.querySelector('#cancel').addEventListener('click',()=>this.hide());
    this.shadowRoot.querySelector('#form').addEventListener('submit',e=>{
      e.preventDefault();
      const data={
        name:this.shadowRoot.querySelector('#name').value.trim(),
        type:this.shadowRoot.querySelector('#type').value,
        description:this.shadowRoot.querySelector('#desc').value.trim(),
        startDate:this.shadowRoot.querySelector('#start').value,
        endDate:this.shadowRoot.querySelector('#end').value,
        steps:this.shadowRoot.querySelector('#steps').value.trim()?this.shadowRoot.querySelector('#steps').value.trim().split('\n').map(t=>({text:t.trim(),completed:false})):[]
      };
      const id=parseInt(this.shadowRoot.querySelector('#pid').value);
      if(new Date(data.endDate)<new Date(data.startDate))return;
      this.dispatchEvent(new CustomEvent('project-updated',{bubbles:true,detail:{projectId:id,data}}));
      this.hide();
    });
  }
  open(project){
    this._visible=true;
    this.render();
    this.shadowRoot.querySelector('#pid').value=project.id;
    this.shadowRoot.querySelector('#name').value=project.name;
    this.shadowRoot.querySelector('#type').value=project.type;
    this.shadowRoot.querySelector('#desc').value=project.description;
    this.shadowRoot.querySelector('#start').value=project.startDate;
    this.shadowRoot.querySelector('#end').value=project.endDate;
    this.shadowRoot.querySelector('#steps').value=project.steps.map(s=>s.text).join('\n');
  }
  hide(){
    this._visible=false;
    this.render();
  }
}
customElements.define('edit-project-modal',EditProjectModal);

class NotepadWidget extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this.STORAGE_KEY='mugenNotepadData';this.autoSaveTimeout=null;}
  connectedCallback(){this.render();this.loadNote();this.updateCounters();this.shadowRoot.querySelector('textarea').addEventListener('input',()=>{this.updateCounters();this.scheduleAutoSave();});}
  render(){
    this.shadowRoot.innerHTML=`
      <style>
        .container{background:var(--bg-default);border-radius:8px;border:1px solid var(--border-default);display:flex;flex-direction:column;height:calc(100vh - 140px);box-shadow:0 4px 6px rgba(0,0,0,0.1);}
        .header{padding:16px;border-bottom:1px solid var(--border-default);display:flex;justify-content:space-between;align-items:center;background:rgba(22,27,34,0.5);}
        .footer{padding:16px;border-top:1px solid var(--border-default);display:flex;justify-content:space-between;background:rgba(22,27,34,0.5);font-size:12px;color:var(--fg-muted);}
        textarea{flex:1;border:1px solid var(--border-default);border-radius:6px;padding:24px;resize:vertical;font-family:'Fira Code',monospace;font-size:16px;background-color:var(--bg-default);color:var(--fg-default);}
        textarea::placeholder{color:var(--fg-muted);opacity:0.5;}
        .status{font-size:12px;color:var(--fg-muted);display:flex;align-items:center;gap:8px;}
        .status.saving::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--accent-fg);animation:pulse 1s infinite;}
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1);}}
      </style>
      <div class="container">
        <div class="header">
          <span class="title">Suas Anotações</span>
          <div class="status" id="status">Auto-save ativo</div>
        </div>
        <textarea id="text" placeholder="Comece a escrever suas anotações aqui..."></textarea>
        <div class="footer">
          <div class="chars" id="chars">0 caracteres</div>
          <div class="words" id="words">0 palavras</div>
        </div>
      </div>`;
  }
  loadNote(){try{const saved=localStorage.getItem(this.STORAGE_KEY);if(saved){this.shadowRoot.querySelector('#text').value=saved;}}catch(e){console.error(e);} }
  saveNote(){try{localStorage.setItem(this.STORAGE_KEY,this.shadowRoot.querySelector('#text').value);this.showStatus('saved');}catch(e){console.error(e);this.showStatus('error');}}
  scheduleAutoSave(){this.showStatus('saving');if(this.autoSaveTimeout)clearTimeout(this.autoSaveTimeout);this.autoSaveTimeout=setTimeout(()=>this.saveNote(),1500);}
  showStatus(s){const el=this.shadowRoot.querySelector('#status');el.className='status';switch(s){case'saving':el.textContent='A guardar...';el.classList.add('saving');break;case'saved':el.textContent='Guardado';setTimeout(()=>{el.textContent='Auto-save ativo';el.classList.remove('saved');},2000);break;case'error':el.textContent='Erro ao guardar';break;}}
  updateCounters(){const text=this.shadowRoot.querySelector('#text').value;const chars=text.length;const words=text.trim()?text.trim().split(/\s+/).length:0;this.shadowRoot.querySelector('#chars').textContent=`${chars.toLocaleString()} caracteres`;this.shadowRoot.querySelector('#words').textContent=`${words.toLocaleString()} palavras`;}
}
customElements.define('notepad-widget',NotepadWidget);

/* Orchestrate components on each page */
document.addEventListener('DOMContentLoaded',()=>{
  const projectsList=document.querySelector('projects-list');
  const addForm=document.querySelector('add-project-form');
  const stats=document.querySelector('project-stats');
  const modal=document.querySelector('edit-project-modal');
  if(projectsList){
    stats.projects=projectsList.projects;
    projectsList.addEventListener('projects-changed',e=>{stats.projects=e.detail;});
    addForm.addEventListener('project-added',e=>{
      const project={...e.detail,id:Date.now(),createdAt:new Date().toISOString()};
      projectsList.addProject(project);
      stats.projects=projectsList.projects;
    });
    projectsList.addEventListener('edit-project',e=>{
      const project=projectsList.getProjectById(e.detail.projectId);
      modal.open(project);
    });
    modal.addEventListener('project-updated',e=>{
      projectsList.updateProject(e.detail.projectId,e.detail.data);
      stats.projects=projectsList.projects;
    });
  }
});
