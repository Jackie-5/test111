import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import menuList  from '../../config/router';
import Layout from '../Layout';
import Router404 from '../404';
import { Provider } from 'react-keep-alive';
import keepAliveIncludeKey from '../../libs/getAllMenu';

const { menuKeys } = keepAliveIncludeKey();

export default class Root extends Component {

  getRecursiveRouter = () => {
    const rRouters = [];
    const recursive = (routes) => {
      if (routes && Array.isArray(routes)) {
        routes.map((route, rIndex) => {
          const key = `${rIndex}${route.path}`;
          if (route.redirect) {
            rRouters.push(
              <Route
                exact
                key={key}
                path={route.path}
                render={() => (
                  <Redirect to={route.redirect}/>
                )}
              />
            );
          } else {
            rRouters.push(
              <Route
                key={key}
                exact={route.exact || true}
                strict={route.strict || true}
                path={route.path}
                component={route.component}
              />
            );
          }
          if (route.routes && Array.isArray(route.routes) && route.routes.length > 0) {
            recursive(route.routes);
          }
          return route;
        });
      }
    };
    recursive(menuList);

    return rRouters;
  };

  render() {
    return (
      <HashRouter>
        <Provider include={menuKeys}>
          <Layout>
            <Switch>
              {/*<App />*/}
              { this.getRecursiveRouter() }
              <Route component={Router404} />
            </Switch>
          </Layout>
        </Provider>
      </HashRouter>
    );
  }
}
