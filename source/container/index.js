import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './components/BasisRoot/Root';
import 'dayjs/locale/zh-cn';
import './less/index.global.less';
import './libs/globalConfig';

render(
  <AppContainer>
    <Root/>
  </AppContainer>,
  document.getElementById('root')
);
if (module.hot) {
  module.hot.accept('./components/BasisRoot/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./components/BasisRoot/Root').default;
    render(
      <AppContainer>
        <NextRoot/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
