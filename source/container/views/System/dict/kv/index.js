import React, { Component } from 'react';
import fetch from '../../../../fetch/index';
import { getLoginInfo } from '../../../../libs/getUserInfo';
import { tableHeader } from './config';
import NewKv from './newKv';
import {
  Table,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Modal,
} from 'antd';
import { bindLifecycle } from '../../../../es';

const Option = Select.Option;
const Search = Input.Search;

@bindLifecycle
class Kv extends Component {
  constructor(props) {
    super(props);
    const searchList = [];
    const notSearch = ['createdTime', 'updatedTime', 'action'];

    tableHeader.forEach((item) => {
      if (!notSearch.includes(item.key)) {
        searchList.push(item);
      }
      if (item.key === 'action') {
        item.render = (text, record) => (
          <Button
            type="primary"
            size="small"
            style={{
              fontSize: 12
            }}
            onClick={() => this.tableAction(record)}
          >
            编辑
          </Button>
        );
      }
    });

    this.state = {
      pageIndex: 1,
      pageSize: 10,
      tableData: [],
      tableHeader,
      tableBorder: true,
      tableLoading: true,
      totalNum: 0,
      searchList,
      searchKey: searchList[1].key,
      searchText: '',
      isOpenModal: false,
    };

  }

  componentDidMount() {
    this.searchDict();
  }

  componentDidCache = () => {
    console.log('List cached kv')
    this.setState({
      isOpenModal: false,
    });
  }

  componentDidRecover = () => {
    console.log('List recovered kv')
  }

  tableAction = (record) => {

  };


  searchDict = () => {
    const { companyNo } = getLoginInfo();
    const { pageIndex, pageSize, searchKey, searchText } = this.state;
    this.setState({
      tableLoading: true,
    });
    fetch('queryAdminDictionaryToBForShow', {
      companyId: companyNo,
      pageIndex,
      pageSize,
      [searchKey]: searchText,
    })
      .then((data) => {
        if (+data.code === 200) {
          this.setState({
            tableData: data.data.data,
            totalNum: data.data.totalNum
          });
        } else {
          this.setState({
            tableData: []
          });
        }
        this.setState({
          tableLoading: false,
        });
      });
  };


  prefixSelector = () => {
    const { searchList, searchKey } = this.state;
    return (
      <Select
        style={{ width: 100 }}
        value={ searchKey }
        onChange={(value) => {
          this.setState({
            searchKey: value,
          });
        }}
      >
        {
          searchList.map((item) => (
            <Option
              value={item.key}
              key={ item.key }
            >
              {item.title}
            </Option>
          ))
        }
      </Select>
    );
  };

  render() {
    const {
      tableHeader,
      tableData,
      tableLoading,
      totalNum,
      pageIndex,
      tableBorder,
      isOpenModal,
    } = this.state;

    return (
      <div className="kv-container white-container">
        <Row>
          <Col span={8}>
            <Form
              labelCol={
                {
                  xs: { span: 24 },
                  sm: { span: 4 }
                }
              }
              wrapperCol={
                {
                  xs: { span: 10 },
                  sm: { span: 20 }
                }
              }
            >
              <Form.Item
                label="字典搜索:"
              >
                <Search
                  addonBefore={this.prefixSelector()}
                  placeholder="请输入您要搜索的内容"
                  onSearch={value => {
                    this.setState({
                      searchText: value,
                    }, () => {
                      this.searchDict();
                    })
                  }}
                  enterButton
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={14}/>
          <Col span={2}>
            <div className="float-right kv-container__new-btn">
              <Button type="primary">新增字典</Button>
            </div>
          </Col>
        </Row>
        <Table
          className="table-custom"
          size="middle"
          dataSource={tableData}
          columns={tableHeader}
          loading={tableLoading}
          bordered={tableBorder}
          rowKey={record => record.id}
          pagination={{
            current: pageIndex,
            onChange: (page) => {
              this.setState({
                pageIndex: page,
              }, () => {
                this.searchDict();
              });
            },
            total: totalNum,
            size: 'default',
          }}
        />

        <Modal
          wrapClassName="kv-modal"
          title={''}
          visible={isOpenModal}
        >
          <NewKv

          />
        </Modal>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'kv' })(Kv);

export default WrappedRegistrationForm;
