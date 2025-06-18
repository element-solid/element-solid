/* @refresh reload */
import { render } from 'solid-js/web';
import '@element-solid/theme-chalk/src/index.scss';
import App from './App';
import { attachDevtoolsOverlay } from '@solid-devtools/overlay';

attachDevtoolsOverlay();
render(() => <App />, document.getElementById('root') as HTMLElement);
