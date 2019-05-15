import React from 'react';
import { Tag } from 'antd';

export const tableHeader = [
  {
    title: '字典编号',
    dataIndex: 'codeNo',
    key: 'codeNo',
    align: 'center',
    width: 160,
  },
  {
    title: '字典名称',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
    width: 200,
  },
  {
    title: '字典内容',
    dataIndex: 'labels',
    key: 'labels',
    align: 'center',
    width: 550,
  },
  {
    title: '适用城市',
    dataIndex: 'cityValue',
    key: 'cityValue',
    align: 'center',
    width: 150,
    render: (text, record) => (
      <div>
        {
          record.cityValue ?
            record.cityValue
            :
            '全部'
        }
      </div>
    )
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    align: 'center',
    width: 150,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
    key: 'updatedTime',
    align: 'center',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'statusDesc',
    key: 'statusDesc',
    align: 'center',
    width: 100,
    render: (text, record) => (
      <Tag
        color={+record.status === 0 ? 'red' : 'green'}
        key={record.id}
      >
        {record.statusDesc}
      </Tag>
    )
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: 100,
  }
];


export const newKvBasisInfo = [
  {
    name: '字典编号',
    key: 'codeNo',
    disabled: false,
    type: 'text',
    validation: true,
    value: '',

  },
  {
    name: '字典名称',
    key: 'description',
    disabled: false,
    type: 'text',
    validation: true,
    value: '',
  },
  {
    name: '状态',
    key: 'status',
    disabled: false,
    type: 'select',
    validation: true,
    list: [
      {
        key: '1',
        name: '启动',
      },
      {
        key: '0',
        name: '禁用',
      }
    ],
    value: '',
  },
  {
    name: '字典城市',
    key: 'city',
    disabled: false,
    type: 'selectTree',
    validation: true,
    list: [],
    value: '',
  },
];
