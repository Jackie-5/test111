import React, { Component } from 'react';
import { Button } from 'antd';
import bindLifecycle from '../../es/utils/bindLifecycle';

@bindLifecycle
export default class Index extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h2>Home</h2>
        <Button type="primary">
123123
        </Button>
      </div>
    );
  }
}
