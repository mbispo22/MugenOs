// Sistema de notificações melhorado para MugenOs
class NotificationSystem {
    private container: HTMLElement;
    private notifications: Map<string, HTMLElement> = new Map();

    constructor() {
        this.createContainer();
    }

    private createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notifications-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }

    show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 4000) {
        const id = Date.now().toString();
        const notification = this.createNotification(message, type, id);
        
        this.notifications.set(id, notification);
        this.container.appendChild(notification);

        // Animação de entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remover
        setTimeout(() => {
            this.remove(id);
        }, duration);

        return id;
    }

    private createNotification(message: string, type: string, id: string): HTMLElement {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            background: var(--gradient-primary);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: var(--shadow-large);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
            position: relative;
            cursor: pointer;
            border-left: 4px solid ${this.getTypeColor(type)};
        `;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 18px; opacity: 0.9;">${icons[type]}</span>
                <span style="flex: 1;">${message}</span>
                <button style="background: none; border: none; color: white; opacity: 0.7; cursor: pointer; font-size: 16px;" onclick="window.notifications.remove('${id}')">&times;</button>
            </div>
        `;

        // Remover ao clicar
        notification.addEventListener('click', () => this.remove(id));

        return notification;
    }

    private getTypeColor(type: string): string {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        return colors[type] || colors.info;
    }

    remove(id: string) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications.delete(id);
            }, 300);
        }
    }

    clear() {
        this.notifications.forEach((_, id) => this.remove(id));
    }
}

// Instância global
declare global {
    interface Window {
        notifications: NotificationSystem;
    }
}

window.notifications = new NotificationSystem();

// CSS adicional para as notificações
const notificationStyles = `
.notification.show {
    opacity: 1 !important;
    transform: translateX(0) !important;
}

.notification.success {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;
}

.notification.error {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%) !important;
}

.notification.warning {
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
}

.notification.info {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
}

.notification:hover {
    transform: translateX(-5px) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
