class MugenMenu extends HTMLElement {
  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    this.innerHTML = `
    <!-- Hamburger Menu -->
    <div class="hamburger-menu" id="hamburgerMenu">
        <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>

    <!-- Sidebar Navigation -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <nav class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo">MugenOs</div>
            <div class="sidebar-subtitle">無限 Sistema</div>
        </div>
        <div class="nav-menu">
            <a href="index.html" class="nav-item" id="nav-home">
                <i>🏠</i> Início
            </a>
            <a href="Notepad.html" class="nav-item" id="nav-notepad">
                <i>📝</i> Anotações
            </a>
            <a href="Project.html" class="nav-item" id="nav-projects">
                <i>📋</i> Projetos
            </a>
            <a href="#" class="nav-item" id="nav-expenses" style="opacity: 0.5; pointer-events: none;">
                <i>💰</i> Despesas <small>(em breve)</small>
            </a>
            <a href="#" class="nav-item" id="nav-calendar" style="opacity: 0.5; pointer-events: none;">
                <i>📅</i> Compromissos <small>(em breve)</small>
            </a>
        </div>
    </nav>`;
    this.cacheDOM();
    this.bindEvents();
    this.setActiveNav();
  }

  cacheDOM() {
    this.hamburgerMenu = this.querySelector('#hamburgerMenu');
    this.hamburger = this.querySelector('#hamburger');
    this.sidebar = this.querySelector('#sidebar');
    this.overlay = this.querySelector('#sidebarOverlay');
    this.navItems = this.querySelectorAll('.nav-item');
  }

  bindEvents() {
    if (!this.hamburgerMenu) return;
    this.hamburgerMenu.addEventListener('click', () => this.toggleSidebar());
    this.overlay.addEventListener('click', () => this.closeSidebar());
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (!item.style.pointerEvents) this.closeSidebar();
      });
    });
    this._handleKeyDown = (e) => {
      if (e.key === 'Escape') this.closeSidebar();
    };
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  toggleSidebar() {
    if (this.sidebar.classList.contains('open')) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.sidebar.classList.add('open');
    this.overlay.classList.add('show');
    this.hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.sidebar.classList.remove('open');
    this.overlay.classList.remove('show');
    this.hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.navItems.forEach(item => item.classList.remove('active'));
    if (currentPage === 'index.html' || currentPage === '') {
      this.querySelector('#nav-home')?.classList.add('active');
    } else if (currentPage === 'Notepad.html') {
      this.querySelector('#nav-notepad')?.classList.add('active');
    } else if (currentPage === 'Project.html') {
      this.querySelector('#nav-projects')?.classList.add('active');
    }
  }
}

customElements.define('mugen-menu', MugenMenu);
