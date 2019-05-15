import React, { Component } from 'react';
import fetch from '../../fetch';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  message
} from 'antd';
import Store from 'electron-store';
import { ipcRenderer } from 'electron';
import { getRemember, getLoginInfo } from '../../libs/getUserInfo';

const store = new Store();

const inputConfig = [
  {
    key: 'companyNo',
    placeholder: '公司编号',
    icon: 'notification',
    value: '',
    type: 'text',
  },
  {
    key: 'username',
    placeholder: '员工工号',
    icon: 'user',
    value: '',
    type: 'text',
  },
  {
    key: 'password',
    placeholder: '密码',
    icon: 'lock',
    value: '',
    type: 'password',
  }
];

class NormalLoginForm extends Component {
  constructor(props) {
    super(props);
    const remember = getRemember();
    if (remember) {
      const login = getLoginInfo();
      inputConfig.forEach((item) => {
        item.value = item.key !== 'password' ? login[item.key] : '';
      });
    }
    console.log(inputConfig);
    this.state = {
      loginConfig: inputConfig,
      remember,
    };

  }

  rememberChange =() => {
    // 这里记录一下登录名
    const { remember } = this.state;

    store.set('remember', !remember);

    this.setState({
      remember: !remember,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { remember } = this.state;
    const { validateFields } = this.props.form;

    validateFields((err, values) => {
      if (!err) {
        const form = new FormData();
        form.append('username', values.username);
        form.append('password', values.password);
        form.append('companyNo', values.companyNo);
        fetch('login', form, {
          headers: {
            'content-type': 'text/html;charset=UTF-8',
          },
        })
          .then((data) => {
            if (+data.code === 403) {
              message.error('登录出错，请校验您的 公司编号、员工工号、密码');
            } else {
              // 成功后 塞入 Store
              store.set('userInfo', data.data.userInfo);
              store.set('token', data.data.token);
              store.set('permissions', data.data.permissions);
              // 如果点击了记住密码
              if (remember) {
                store.set('loginInfo', values);
              }
              ipcRenderer.send('closeLogin');
              ipcRenderer.send('openMain');
            }
          });

      }
    });
  };

  inputChange = (value, item) => {
    const { loginConfig } = this.state;
    loginConfig.forEach((it) => {
      if (item.key === it.key) {
        it.value = value;
      }
    });

    this.setState({
      loginConfig,
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { loginConfig, remember } = this.state;
    return (
      <div className="login-container clearfix">
        <div className="login-container__img float-left"/>
        <div className="login-container__height float-left" />
        <div className="login-container__login float-left">
          <div className="login-container__login__title">登录</div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            {
              loginConfig.map((item) => (
                <Form.Item
                  hasFeedback
                  key={item.key}
                >
                  {getFieldDecorator(item.key, {
                    rules: [{
                      required: true,
                      message: `请输入${item.placeholder}`,
                    }],
                    initialValue: item.value,
                  })(
                    <Input
                      prefix={
                        <Icon
                          type={item.icon}
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      onChange={(value) => this.inputChange(value, item)}
                      placeholder={item.placeholder}
                      type={item.type}
                    />
                  )}
                </Form.Item>
              ))
            }
            <Form.Item
              className="remember"
            >
              <Checkbox
                checked={remember}
                onChange={() => this.rememberChange()}
              >
                记住用户名
              </Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
          </Form>

          <div className="login-container__login__tips">
            <p>苏州讯客软件信息科技有限公司</p>
            <p>客服电话: 400-612-8017转0-3</p>
          </div>
        </div>


      </div>
    );
  }
}

export default Form.create({ name: 'normal_login' })(NormalLoginForm);

