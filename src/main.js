import winlo from 'winlo';

import { App } from './scene/alien/App';

if ( ! winlo.hash && ! winlo.search ) {

	winlo.hash = '#/';
	winlo.search = '';

}

App.init();

