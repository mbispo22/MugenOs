import appHeaderStyles from '../css/components/app-header.css?raw';
import projectCardStyles from '../css/components/project-card.css?raw';
import projectsListStyles from '../css/components/projects-list.css?raw';
import addProjectFormStyles from '../css/components/add-project-form.css?raw';
import projectStatsStyles from '../css/components/project-stats.css?raw';
import editProjectModalStyles from '../css/components/edit-project-modal.css?raw';
import fileViewerStyles from '../css/components/file-viewer.css?raw';

function createSheet(css: string): CSSStyleSheet {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
}

export const appHeaderSheet = createSheet(appHeaderStyles);
export const projectCardSheet = createSheet(projectCardStyles);
export const projectsListSheet = createSheet(projectsListStyles);
export const addProjectFormSheet = createSheet(addProjectFormStyles);
export const projectStatsSheet = createSheet(projectStatsStyles);
export const editProjectModalSheet = createSheet(editProjectModalStyles);
export const fileViewerSheet = createSheet(fileViewerStyles);
