
export default {
  windowFunction: [
    {
      icon: 'iconguanbi',
      type: 'close',
      color: '#fc5b57',
      left: '3px',
    },{
      icon: 'iconzuixiaohua',
      type: 'minWindow',
      color: '#e5bf3c',
      left: '3px',
    },{
      icon: 'iconjiahao',
      type: 'maxWindow',
      color: '#57c038',
      left: '3px',
    },
  ],
  infoConfig: [
    {
      key: 'system',
      name: '系统通知',
      number: 0,
      data: [],
    },
    {
      key: 'activeInfo',
      name: '活动通知',
      number: 0,
      data: [
        {
          href: 'http://ant.design',
          title: `您创建的红包营销活动“单个字”已经结束，请知晓！`,
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          description: '2019-03-13 23:59:59',
        }
      ],
    }
  ]
}
