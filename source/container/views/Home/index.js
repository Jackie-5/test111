import React, { Component } from 'react';
import Store from 'electron-store';
import { bindLifecycle } from '../../es';
import { Link } from 'react-router-dom';
const store = new Store();


@bindLifecycle
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '1',
    }
  }
  componentDidMount() {
    console.log('123123');
    // console.log(store.get('unicorn'));
    // fetch('permissionCompanyCategory')
    //   .then((data) => {
    //     console.log(data)
    //   })
  }
  componentWillUnmount() {
    console.log('1231');
    this.setState({
      test: 2,
    })
  }
  render() {
    return (
      <div data-tid="container">
        <div>
          <Link
            to={'/'}
          >
            { this.state.test }
            <div>sdfasfdsa</div>
          </Link>
        </div>
      </div>
    );
  }
}
