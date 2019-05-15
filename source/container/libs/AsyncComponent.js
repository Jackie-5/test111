import React, { Component } from 'react';
import nprogress from 'nprogress';
import Spin from 'antd/lib/spin';
import { KeepAlive } from '../es';
import Animate from 'rc-animate';

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);
      console.log(props);
      this.state = {
        component: null,
        loading: true
      };
      if (props.location.pathname !== '/login') {
        nprogress.start();
      }

    }

    async componentWillMount() {
      const { default: component } = await importComponent();
      this.setState({
        component
      });
    }

    componentDidMount() {

      if (this.props.location.pathname !== '/login') {
        nprogress.done();
      }
      this.setState({
        loading: false
      });
    }

    render() {
      const { loading } = this.state;
      const C = this.state.component;

      return C ?
        <KeepAlive name={this.props.location.pathname}>
          <Animate
            component=""
            transitionName="fade"
          >
            {
              loading ?
                <div className="layout-loading">
                  <Spin className="layout-loading__spin"/>
                </div> :
                <C {...this.props} />
            }
          </Animate>
        </KeepAlive>
        : null;
    }
  }

  return AsyncComponent;
}
