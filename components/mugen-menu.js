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
        <div class="theme-selector">
          <div class="theme-label">Temas</div>
          <div class="theme-options">
            <div class="theme-option active" data-theme="purple">
              <div class="theme-preview theme-purple"></div>
              <span>MugenOs</span>
            </div>
            <div class="theme-option" data-theme="batman">
              <div class="theme-preview theme-batman"></div>
              <span>BatmanOs</span>
            </div>
          </div>
        </div>
      </nav>`;
    this.cacheDOM();
    this.bindEvents();
    this.setActiveNav();
    this.loadTheme();
  }

  cacheDOM() {
    this.hamburgerMenu = this.querySelector('#hamburgerMenu');
    this.hamburger = this.querySelector('#hamburger');
    this.sidebar = this.querySelector('#sidebar');
    this.overlay = this.querySelector('#sidebarOverlay');
    this.navItems = this.querySelectorAll('.nav-item');
    this.themeOptions = this.querySelectorAll('.theme-option');
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
    this.themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.dataset.theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
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

  loadTheme() {
    const savedTheme = localStorage.getItem('mugenThemePreference') || 'purple';
    this.applyTheme(savedTheme);
  }

  applyTheme(themeName) {
    document.body.classList.remove('theme-purple', 'theme-batman');
    document.body.classList.add(`theme-${themeName}`);
    this.updateThemeSelector(themeName);
    this.updateBranding(themeName);
  }

  updateThemeSelector(themeName) {
    this.themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeName);
    });
  }

  updateBranding(themeName) {
    const logo = this.querySelector('.sidebar-logo');
    const subtitle = this.querySelector('.sidebar-subtitle');
    const isBatman = themeName === 'batman';
    logo.textContent = isBatman ? 'BatmanOs' : 'MugenOs';
    subtitle.textContent = isBatman ? '🦇 Sistema' : '無限 Sistema';
    const heroTitle = document.querySelector('.logo .title');
    if (heroTitle) heroTitle.textContent = isBatman ? 'BatmanOs' : 'MugenOs';
    const heroSubtitle = document.querySelector('.logo .subtitle');
    if (heroSubtitle) heroSubtitle.textContent = isBatman ? '🦇 Sistema' : 'Sistema Infinito';
  }

  saveTheme(themeName) {
    localStorage.setItem('mugenThemePreference', themeName);
  }
}

customElements.define('mugen-menu', MugenMenu);
