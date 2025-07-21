function createSheet(css) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    return sheet;
}

export const appHeaderSheet = createSheet(`
    .header {
        background: linear-gradient(135deg, #1A0F2E 0%, rgba(26, 15, 46, 0.95) 100%);
        border-bottom: 1px solid #3D2B52;
        box-shadow: 0 2px 4px rgba(137, 86, 251, 0.1);
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(10px);
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
        background: linear-gradient(90deg, #8956FB 0%, #C49BFF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transition: all 0.3s ease;
    }
    
    .nav-brand:hover {
        text-decoration: none;
        filter: brightness(1.1);
    }
    
    .nav-links a {
        margin-left: 16px;
        padding: 8px 16px;
        border-radius: 8px;
        color: #C49BFF;
        text-decoration: none;
        transition: all 0.2s ease;
        font-weight: 500;
        background: transparent;
        border: 1px solid #3D2B52;
    }
    
    .nav-links a:hover {
        color: white;
        text-decoration: none;
        background: linear-gradient(90deg, #8956FB 0%, #C49BFF 100%);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
        border-color: #8956FB;
    }
`);

export const projectCardSheet = createSheet(`
    .card {
        background: linear-gradient(135deg, #1A0F2E 0%, rgba(26, 15, 46, 0.8) 100%);
        border: 1px solid #3D2B52;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 24px rgba(137, 86, 251, 0.2);
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 12px;
        padding: 1px;
        background: linear-gradient(135deg, #8956FB 0%, #6441A5 50%, #4A2C7A 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 32px rgba(137, 86, 251, 0.3);
    }
    
    .card:hover::before {
        opacity: 1;
    }
    
    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .project-title {
        font-weight: 600;
        font-size: 18px;
        color: #C49BFF;
    }
    
    .project-type {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        text-transform: capitalize;
        border: 1px solid;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 4px rgba(137, 86, 251, 0.1);
    }
    
    .project-type.pessoal {
        color: #A855F7;
        border-color: #A855F7;
        background: rgba(168, 85, 247, 0.2);
    }
    
    .project-type.trabalho {
        color: #C49BFF;
        border-color: #C49BFF;
        background: rgba(196, 155, 255, 0.2);
    }
    
    .project-dates {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        font-size: 12px;
        text-align: center;
        background: #2A1B3D;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #3D2B52;
        color: #E8E3F3;
    }
    
    .date-label {
        font-size: 10px;
        color: #B8A9D1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .project-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
    }
    
    .progress-bar {
        width: 100%;
        height: 10px;
        background: #2A1B3D;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 8px;
        border: 1px solid #3D2B52;
    }
    
    .progress-fill {
        height: 100%;
        border-radius: 5px;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(90deg, #8956FB 0%, #C49BFF 100%);
        position: relative;
        overflow: hidden;
    }
    
    .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: shimmer 2s infinite;
    }
    
    .steps-list {
        list-style: none;
        padding: 0;
        margin: 12px 0;
    }
    
    .step-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
        transition: all 0.2s ease;
        border-radius: 6px;
        margin-bottom: 4px;
        color: #E8E3F3;
    }
    
    .step-item:hover {
        background: rgba(137, 86, 251, 0.1);
        padding-left: 8px;
    }
    
    .step-item.completed {
        opacity: 0.6;
    }
    
    .step-item.completed .step-text {
        text-decoration: line-through;
        color: #7C3AED;
    }
    
    .step-checkbox {
        appearance: none;
        width: 20px;
        height: 20px;
        border: 2px solid #3D2B52;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        background: #1F1329;
    }
    
    .step-checkbox:checked {
        background: linear-gradient(135deg, #8956FB 0%, #6441A5 100%);
        border-color: #8956FB;
        box-shadow: 0 0 20px rgba(137, 86, 251, 0.4);
    }
    
    .step-checkbox:checked::after {
        content: '✓';
        position: absolute;
        color: white;
        font-weight: bold;
        font-size: 14px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .btn {
        background: #2A1B3D;
        color: #E8E3F3;
        border: 1px solid #3D2B52;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
    }
    
    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #8956FB 0%, #C49BFF 100%);
        transition: left 0.3s ease;
        z-index: -1;
    }
    
    .btn:hover {
        border-color: #8956FB;
        color: white;
        box-shadow: 0 0 20px rgba(137, 86, 251, 0.4);
    }
    
    .btn:hover::before {
        left: 0;
    }
    
    .btn-danger {
        background: #E879F9;
        border-color: #E879F9;
        color: #fff;
    }
    
    .btn-danger:hover {
        background: #F472B6;
        border-color: #F472B6;
        box-shadow: 0 0 20px rgba(244, 114, 182, 0.4);
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`);

export const projectsListSheet = createSheet(`
    :host {
        display: block;
    }
    
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
    }
    
    .card {
        background: linear-gradient(135deg, #1A0F2E 0%, rgba(26, 15, 46, 0.8) 100%);
        border: 1px solid #3D2B52;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        color: #B8A9D1;
    }
`);

export const addProjectFormSheet = createSheet(`
    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .form-row {
        display: flex;
        gap: 16px;
    }
    
    .form-group {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    
    label {
        margin-bottom: 8px;
        font-weight: 500;
        color: #C49BFF;
    }
    
    input, select, textarea {
        padding: 12px 16px;
        border: 1px solid #3D2B52;
        border-radius: 8px;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        background-color: #1F1329;
        color: #E8E3F3;
        transition: all 0.2s ease;
    }
    
    /* Tamanho específico para textarea de descrição (1 linha) no modal */
    textarea#desc {
        min-height: 45px;
        max-height: 45px;
        resize: none;
    }
    
    /* Tamanho específico para textarea de etapas (maior) no modal */
    textarea#steps {
        min-height: 120px;
    }
    
    /* Tamanho específico para textarea de etapas */
    textarea {
        min-height: 120px;
    }
    
    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #8956FB;
        box-shadow: 0 0 0 3px rgba(137, 86, 251, 0.3);
        background-color: #1A0F2E;
    }
    
    button {
        background: linear-gradient(135deg, #8956FB 0%, #6441A5 100%);
        color: #fff;
        border: 1px solid #6441A5;
        border-radius: 8px;
        padding: 12px 24px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 8px 24px rgba(137, 86, 251, 0.2);
    }
    
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 32px rgba(137, 86, 251, 0.3);
    }
`);

export const projectStatsSheet = createSheet(`
    .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 24px;
    }
    
    .stat-card {
        background: linear-gradient(135deg, #1A0F2E 0%, rgba(26, 15, 46, 0.8) 100%);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #3D2B52;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-1px);
        border-color: #8956FB;
    }
    
    .stat-number {
        font-size: 28px;
        font-weight: 600;
        background: linear-gradient(90deg, #8956FB 0%, #C49BFF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .stat-label {
        color: #B8A9D1;
        font-size: 14px;
        margin-top: 4px;
    }
`);

export const editProjectModalSheet = createSheet(`
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        background: rgba(10, 5, 17, 0.9);
        backdrop-filter: blur(10px);
    }
    
    .modal.visible {
        display: flex;
    }
    
    .modal-content {
        background: linear-gradient(135deg, #1A0F2E 0%, rgba(26, 15, 46, 0.8) 100%);
        padding: 32px;
        border-radius: 16px;
        border: 1px solid #3D2B52;
        box-shadow: 0 16px 32px rgba(137, 86, 251, 0.3);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: modalSlideIn 0.3s ease-out;
    }
    
    .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        font-size: 24px;
        cursor: pointer;
        color: #B8A9D1;
        transition: all 0.2s ease;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #1F1329;
    }
    
    .close-btn:hover {
        color: #E8E3F3;
        background: #8956FB;
        box-shadow: 0 0 20px rgba(137, 86, 251, 0.4);
    }
    
    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 20px;
    }
    
    .form-row {
        display: flex;
        gap: 16px;
    }
    
    .form-group {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    
    label {
        margin-bottom: 8px;
        font-weight: 500;
        color: #C49BFF;
    }
    
    input, select, textarea {
        padding: 12px 16px;
        border: 1px solid #3D2B52;
        border-radius: 8px;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        background-color: #1F1329;
        color: #E8E3F3;
        transition: all 0.2s ease;
    }
    
    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #8956FB;
        box-shadow: 0 0 0 3px rgba(137, 86, 251, 0.3);
        background-color: #1A0F2E;
    }
    
    button {
        background: linear-gradient(135deg, #8956FB 0%, #6441A5 100%);
        color: #fff;
        border: 1px solid #6441A5;
        border-radius: 8px;
        padding: 12px 24px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 8px 24px rgba(137, 86, 251, 0.2);
    }
    
    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 32px rgba(137, 86, 251, 0.3);
    }
    
    .danger {
        background: #E879F9;
        border-color: #E879F9;
    }
    
    .danger:hover {
        background: #F472B6;
        border-color: #F472B6;
        box-shadow: 0 0 20px rgba(244, 114, 182, 0.4);
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`);

export const notepadWidgetSheet = createSheet(`
    .container {
        background: linear-gradient(135deg, #1A0F2E 0%, rgba(26, 15, 46, 0.8) 100%);
        border-radius: 16px;
        border: 1px solid #3D2B52;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 140px);
        overflow: hidden;
    }
    
    .header {
        padding: 16px;
        border-bottom: 1px solid #3D2B52;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #1F1329;
    }
    
    .footer {
        padding: 16px;
        border-top: 1px solid #3D2B52;
        display: flex;
        justify-content: space-between;
        background: #1F1329;
        font-size: 12px;
        color: #B8A9D1;
    }
    
    .title {
        font-weight: 600;
        font-size: 16px;
        color: #C49BFF;
    }
    
    textarea {
        flex: 1;
        border: none;
        padding: 24px;
        resize: none;
        font-family: 'Fira Code', monospace;
        font-size: 16px;
        background: #1A0F2E;
        color: #E8E3F3;
        outline: none;
        line-height: 1.6;
    }
    
    textarea::placeholder {
        color: #B8A9D1;
        opacity: 0.5;
    }
    
    .status {
        font-size: 12px;
        color: #B8A9D1;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .status.saving::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #8956FB;
        animation: pulse 1s infinite;
    }
    
    .chars, .words {
        color: #9A87B5;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
    }
`);
