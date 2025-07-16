function createSheet(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    return sheet;
}

export const appHeaderSheet = createSheet(`
    .header{background:var(--bg-default);border-bottom:1px solid var(--border-default);position:sticky;top:0;z-index:10;}
    .nav{display:flex;align-items:center;justify-content:space-between;max-width:1280px;margin:0 auto;padding:16px;}
    .nav-brand{font-weight:600;font-size:20px;color:var(--fg-default);background:linear-gradient(135deg, #58a6ff 0%, #79c0ff 50%, #56d364 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
    .nav-brand:hover{text-decoration:none;}
    .nav-links a{margin-left:16px;padding:8px;color:var(--accent-fg);text-decoration:none;}
    .nav-links a:hover{text-decoration:underline;}
`);

export const projectCardSheet = createSheet(`
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
    .step-checkbox:checked::after{content:'✓';position:absolute;color:white;font-weight:bold;top:50%;left:50%;transform:translate(-50%,-50%);}
    .btn{background:#21262d;color:var(--fg-default);border:1px solid var(--border-default);border-radius:6px;padding:8px 16px;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s ease;}
    .btn-danger{background:var(--danger-fg);border-color:var(--danger-fg);color:#fff;}
`);

export const projectsListSheet = createSheet(`
    :host{display:block;}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;}
`);

export const addProjectFormSheet = createSheet(`
    form{display:flex;flex-direction:column;gap:16px;}
    .form-row{display:flex;gap:16px;}
    .form-group{flex:1;display:flex;flex-direction:column;}
    label{margin-bottom:8px;font-weight:500;color:var(--fg-muted);}
    input,select,textarea{padding:8px 12px;border:1px solid var(--border-default);border-radius:6px;font-family:'Fira Code',monospace;font-size:14px;background-color:var(--bg-canvas);color:var(--fg-default);}
    button{background:var(--accent-emphasis);color:#fff;border:1px solid var(--accent-emphasis);border-radius:6px;padding:8px 16px;font-weight:500;cursor:pointer;}
`);

export const projectStatsSheet = createSheet(`
    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;}
    .stat-card{background:var(--bg-default);padding:16px;border-radius:6px;border:1px solid var(--border-default);text-align:center;}
    .stat-number{font-size:24px;font-weight:600;}
`);

export const editProjectModalSheet = createSheet(`
    .modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;align-items:center;justify-content:center;z-index:1000;background:rgba(1,4,9,0.8);backdrop-filter:blur(8px);}
    .modal.visible{display:flex;}
    .modal-content{background:var(--bg-default);padding:24px;border-radius:6px;border:1px solid var(--border-default);box-shadow:var(--shadow-medium);width:90%;max-width:600px;max-height:90vh;overflow-y:auto;position:relative;animation:modalSlideIn 0.3s ease-out;}
    .close-btn{position:absolute;top:16px;right:16px;font-size:24px;cursor:pointer;color:var(--fg-muted);}
    form{display:flex;flex-direction:column;gap:16px;margin-top:20px;}
    .form-row{display:flex;gap:16px;}
    .form-group{flex:1;display:flex;flex-direction:column;}
    label{margin-bottom:8px;font-weight:500;color:var(--fg-muted);}
    input,select,textarea{padding:8px 12px;border:1px solid var(--border-default);border-radius:6px;font-family:'Fira Code',monospace;font-size:14px;background-color:var(--bg-canvas);color:var(--fg-default);}
    button{background:var(--accent-emphasis);color:#fff;border:1px solid var(--accent-emphasis);border-radius:6px;padding:8px 16px;font-weight:500;cursor:pointer;}
    .danger{background:var(--danger-fg);border-color:var(--danger-fg);}
`);

export const notepadWidgetSheet = createSheet(`
    .container{background:var(--bg-default);border-radius:8px;border:1px solid var(--border-default);display:flex;flex-direction:column;height:calc(100vh - 140px);box-shadow:0 4px 6px rgba(0,0,0,0.1);}
    .header{padding:16px;border-bottom:1px solid var(--border-default);display:flex;justify-content:space-between;align-items:center;background:rgba(22,27,34,0.5);}
    .footer{padding:16px;border-top:1px solid var(--border-default);display:flex;justify-content:space-between;background:rgba(22,27,34,0.5);font-size:12px;color:var(--fg-muted);}
    textarea{flex:1;border:1px solid var(--border-default);border-radius:6px;padding:24px;resize:vertical;font-family:'Fira Code',monospace;font-size:16px;background-color:var(--bg-default);color:var(--fg-default);}
    textarea::placeholder{color:var(--fg-muted);opacity:0.5;}
    .status{font-size:12px;color:var(--fg-muted);display:flex;align-items:center;gap:8px;}
    .status.saving::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--accent-fg);animation:pulse 1s infinite;}
    @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1);}}
`);
