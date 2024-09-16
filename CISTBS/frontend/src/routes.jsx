import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';


export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        path: '/callback?',
        element: lazy(() => import('./store/Callback'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/playbooks',
        element: lazy(() => import('./playbooks/playbookList'))
      },
      {
        exact: 'true',
        path: '/playbooks/:playbookId',
        element: lazy(() => import('./playbooks/playbookDetail'))
      },
      {
        exact: 'true',
        path: '/Incidents',
        element: lazy(() => import('./components/incidents/incidents'))
      },
      {
        exact: 'true',
        path: '/incidents/:incidentId',
        element: lazy(() => import('./components/incidents/IncidentDetail/IncidentDetailPage'))
      },
    ]
  }
];

export default routes;
