/**
 * Resume preview templates.
 * Register template components here; the preview will use them by name.
 *
 * Usage:
 *   import { getTemplate, templateIds } from '@/templates';
 *   const TemplateComponent = getTemplate('default');
 */

const registry = {};

/**
 * @param {string} id - Template id (e.g. 'default', 'modern')
 * @returns {React.Component|null} Template component or null
 */
export function getTemplate(id) {
  return registry[id] ?? null;
}

/**
 * @returns {string[]} List of registered template ids
 */
export function getTemplateIds() {
  return Object.keys(registry);
}

/**
 * Register a template component.
 * @param {string} id - Unique template id
 * @param {React.Component} component - Component that receives resume data as props
 */
export function registerTemplate(id, component) {
  registry[id] = component;
}

import Template1 from './Template1.jsx';
import Template2 from './Template2.jsx';
import Template3 from './Template3.jsx';
import Template4 from './Template4.jsx';

registerTemplate('template1', Template1);
registerTemplate('template2', Template2);
registerTemplate('template3', Template3);
registerTemplate('template4', Template4);
