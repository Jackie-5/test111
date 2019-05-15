import React, { Component } from 'react';
import { newKvBasisInfo } from './config';
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  TreeSelect,
} from 'antd';

const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class KvCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basisInfoList: newKvBasisInfo
    };
  }

  componentDidMount() {
    const { type } = this.props;
    if (type === 'edit') {

    }
  }

  formSubmit = () => {

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { basisInfoList } = this.state;
    return (
      <div className="new-kv">
        <div className="new-kv__basis">
          <div className="">基础信息</div>
          <div className="">
            <Form
              onSubmit={this.formSubmit}
              labelCol={
                {
                  xs: { span: 2 },
                  sm: { span: 6 }
                }
              }
              wrapperCol={
                {
                  xs: { span: 3 },
                  sm: { span: 17 }
                }
              }
            >
              <Row gutter={24}>
                {
                  basisInfoList.map((item, i) => {
                    if (item.type === 'text') {
                      return (
                        <Col span={8} key={i}>
                          <Form.Item
                            label={item.name}
                          >
                            {getFieldDecorator(item.key, {
                              rules: [{
                                required: true, message: 'Please input your E-mail!',
                              }],
                            })(
                              <Input />
                            )}
                          </Form.Item>
                        </Col>
                      );
                    }
                    if (item.type === 'select') {
                      return (
                        <Col span={8} key={i}>
                          <Form.Item
                            label={item.name}
                          >
                            {getFieldDecorator(item.key, {
                              rules: [{ required: true, message: 'Please select your gender!' }],
                              initialValue: item.list[0].key,
                            })(
                              <Select>
                                {
                                  item.list.map((it) =>
                                    <Option key={it.key} value={it.key}>{it.name}</Option>
                                  )
                                }
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      );
                    }

                    if (item.type === 'selectTree') {
                      return (
                        <Col span={8} key={i}>
                          <Form.Item
                            label={item.name}
                          >
                            {getFieldDecorator(item.key, {
                              rules: [{ required: true, message: 'Please select your gender!' }],
                              initialValue: '',
                            })(
                              <TreeSelect
                                showSearch
                                style={{ width: 300 }}
                                value={this.state.value}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select"
                                allowClear
                                multiple
                                treeDefaultExpandAll
                              >
                                <TreeNode value="parent 1" title="parent 1" key="0-1">
                                  <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                                    <TreeNode value="leaf1" title="my leaf" key="random" />
                                    <TreeNode value="leaf2" title="your leaf" key="random1" />
                                  </TreeNode>
                                  <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                                    <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
                                  </TreeNode>
                                </TreeNode>
                              </TreeSelect>
                            )}
                          </Form.Item>
                        </Col>
                      );
                    }

                  })
                }
              </Row>
            </Form>

          </div>
        </div>
        <div className="new-kv__kv">
          <div className="">KV值</div>
        </div>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'kv' })(KvCreate);

export default WrappedRegistrationForm;

