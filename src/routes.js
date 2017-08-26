import React from 'react';
import {Redirect} from 'react-router';
import Loadable from 'react-loadable';
import {report} from 'import-inspector';
import path from 'path';

import HomePage from './client/components/pages/HomePage';
import NotFoundPage from './client/components/pages/NotFoundPage';
import WizardShellPage from './client/components/pages/WizardShellPage';
import Page1 from './client/components/pages/WizardShellPage/pages/Page1';
import Page2 from './client/components/pages/WizardShellPage/pages/Page2';


// taken from https://github.com/webpack/webpack/issues/2461
if (typeof System === 'undefined' || typeof System.import !== 'function') {
  global.System = {
    import: (importPath) => {
      return Promise.resolve(require(importPath));
    }
  };
}

const routes = [
  {
    path: '/',
    exact: true,
    component: HomePage
  },
  {
    path: '/about',
    exact: true,
    component: Loadable({
      loader: () => report(
        System.import(/* webpackChunkName: 'AboutPage' */'./client/components/pages/AboutPage/AboutPage'),
        {
          serverSideRequirePath: path.resolve(__dirname, './client/components/pages/AboutPage/AboutPage'),
          webpackRequireWeakId: () => require.resolveWeak('./client/components/pages/AboutPage/AboutPage')
        }
      ),
      loading: <div>Loading...</div>
    })
  },
  {
    path: '/charts',
    exact: true,
    component: Loadable({
      loader: () => report(
        System.import(/* webpackChunkName: 'ChartsPage' */'./client/components/pages/ChartsPage/ChartsPage'),
        {
          serverSideRequirePath: path.resolve(__dirname, './client/components/pages/ChartsPage/ChartsPage'),
          webpackRequireWeakId: () => require.resolveWeak('./client/components/pages/ChartsPage/ChartsPage')
        }
      ),
      loading: <div>Loading...</div>
    })
  },
  {
    path: '/wizard',
    component: WizardShellPage,
    routes: [
      {
        path: '/wizard/page1',
        component: Page1,
        exact: true
      },
      {
        path: '/wizard/page2',
        component: Page2,
        exact: true
      }
    ]
  },
  {
    path: '/404',
    exact: true,
    component: NotFoundPage
  },
  {
    path: '/*',
    redirectTo: '/404', // explicit flag for ssr processing on server.js
    component: () => <Redirect to="/404"/>
  }
];

export default routes;
