/**
 * Created by JackieWu on 2018/7/15.
 */
import React from 'react';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {
  Modal,
  LocaleProvider,
  Menu,
  Icon,
  Avatar,
  Tooltip,
  Popover,
  Badge,
  Dropdown,
  Tabs,
  Spin,
  List,
  Row,
  Col,
  Empty,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import menuList from '../../config/router';
import { ipcRenderer } from 'electron';
import { getUserInfo } from '../../libs/getUserInfo';
import config from './config';
import Store from 'electron-store';
import { cloneDeep } from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const store = new Store();
const confirm = Modal.confirm;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

Spin.setDefaultIndicator(<Icon type="loading" style={{ fontSize: 24 }} spin />);

const notLayout = [];
// tab滑动排序
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
// menu 转换
const recursiveMenus = (menus, path) => {
  let menusIndex = 0;
  let openMenus = [];
  const nowLinkItem = [];
  const recursive = (menusList, firstIndex, prevItem) => {
    for (const i in menusList) {
      const item = menusList[i];
      item.sortIndex = `l_${Math.random()}`;
      // 如果不需要layout
      if (item.notLayout) {
        notLayout.push(item.path);
      }
      if (item.path === path) {
        menusIndex = firstIndex;
        nowLinkItem.push(item);
        if (prevItem.openMenus) {
          openMenus = prevItem.openMenus;
        }
        return;
      } else if ( item.routes && item.routes.length > 0 ) {
        if (prevItem.openMenus) {
          item.openMenus = [...prevItem.openMenus, item.path ];
        } else {
          item.openMenus = [ item.path ];
        }
        recursive(item.routes, firstIndex, item);
      }
    }
  };

  menus.forEach((item, index) => {
    item.sortIndex = `l_${Math.random()}`;
    if (item.notLayout) {
      notLayout.push(item.path);
    }
    if (item.path === path) {
      menusIndex = index;
      nowLinkItem.push(item);
    } else {
      if (item.routes && item.routes.length > 0) {
        recursive(item.routes, index, item);
      }
    }
  });

  return {
    menusIndex,
    openMenus,
    nowLinkItem: nowLinkItem[0],
  };
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  background: isDragging ? '#323639' : '',
  ...draggableStyle,
});


class Layout extends React.Component {
  constructor(props) {
    super(props);
    // 寻找当前所选菜单的页面
    const menusObject = recursiveMenus(menuList, props.location.pathname);
    let historyTabs = [];
    if (!notLayout.includes(props.location.pathname)) {
      require('../../libs/waterMark');
    }

    if (store.get('history-links')) {
      historyTabs = store.get('history-links');
    } else {
      menusObject.nowLinkItem.selected = true;
      historyTabs.push(menusObject.nowLinkItem);
    }


    this.state = {
      tabActiveKey: 'system',
      tabActiveName: '系统通知',
      infoData: [],
      info: config.infoConfig,
      infoNumber: 0,
      subMenus: menuList[menusObject.menusIndex].routes || [],
      headerMenuKey: [menuList[menusObject.menusIndex].path],
      openMenus: menusObject.openMenus,
      infoLoading: true,
      locationPath: props.location.pathname,
      subMenuOpen: true,
      windowFunction: config.windowFunction,
      historyTabs,
      maxHistoryTab: 15,
    };

    props.history.listen((location) => {
      const menusObj = recursiveMenus(menuList, location.pathname);
      const { historyTabs, maxHistoryTab } = this.state;
      if (!menusObj.nowLinkItem.redirect) {
        if (menusObj.nowLinkItem.blank) {
          if (!location.hash) {
            historyTabs.forEach((item) => {
              item.selected = false;
            });
            const it = cloneDeep(menusObj.nowLinkItem);
            it.selected = true;

            if (historyTabs.length > maxHistoryTab) {
              historyTabs.shift();
            }

            historyTabs.push(it);
          }
        } else {
          const it = cloneDeep(menusObj.nowLinkItem);
          it.selected = true;
          historyTabs.forEach((item, i) => {
            if (item.selected) {
              historyTabs.splice(i, 1, it);
            }
          });
        }
      }

      this.setState({
        subMenus: menuList[menusObj.menusIndex].routes || [],
        headerMenuKey: [menuList[menusObj.menusIndex].path],
        openMenus: menusObj.openMenus,
        locationPath: location.pathname,
        historyTabs,
      });

    });
  }

  logout = () => {
    confirm({
      title: '提示',
      content: '您确定要退出吗？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        ipcRenderer.send('closeMain');
        ipcRenderer.send('openLogin');
      },
    });
  };

  mainWindowFunction = (item) => {
    if (item.type === 'close') {
      this.logout();
    } else if (item.type === 'minWindow') {
      ipcRenderer.send('minMain');
    } else if (item.type === 'maxWindow') {
      ipcRenderer.send('maxMain');
    }
  };

  userDropdown = () => (
    <Menu>
      <Menu.Item>
        <a
          rel="noopener noreferrer"
          href="/"
        >
          <Icon
            type="setting"
            style={{ marginRight: 8 }}
          />
          <span>账户信息</span>
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        onClick={() => this.logout()}
      >
        <Icon type="logout" />
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  );

  tabChange = (activeKey) => {
    const { info } = this.state;
    let infoData = [];
    let tabActiveName = '';

    info.forEach((item) => {
      if (item.key === activeKey) {
        infoData = item.data;
        tabActiveName = item.name;
      }
    });

    this.setState({
      tabActiveKey: activeKey,
      infoData,
      tabActiveName,
    });
  };

  clearInfo = () => {
    const { info, tabActiveKey } = this.state;

    info.forEach((item) => {
      if (item.key === tabActiveKey) {
        item.data = [];
      }
    });

    this.setState({
      info,
      infoData: [],
    });
  };

  informationList = () => {
    const { info, infoData, tabActiveName, infoLoading } = this.state;

    return (
      <div className="info-box">
        {
          infoLoading ?
            <div className="info-box__loading">
              <Spin className="info-box__loading__spin" />
            </div>
            :
            null
        }

        <div className="info-box__tabs">
          <Tabs
            defaultActiveKey="system"
            onChange={(activeKey) => this.tabChange(activeKey)}
          >
            {
              info.map((item) => (
                <TabPane
                  tab={`${item.name}(${item.number})`}
                  key={item.key}
                >
                  {
                    infoData.length > 0 && !infoLoading ?
                      <div className="info-box__tabs__t">
                        <List
                          itemLayout="horizontal"
                          size="small"
                          dataSource={infoData}
                          renderItem={item => (
                            <List.Item
                              key={item.title}
                            >
                              <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={item.title}
                                description={item.description}
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                      :
                      <Empty
                        style={{ marginBottom: 15 }}
                        description={`您已查看所有${tabActiveName}`}
                      />
                  }

                </TabPane>
              ))
            }
          </Tabs>
        </div>
        <div className="info-box__footer">
        {
          infoLoading || infoData.length === 0 ?
            <div className="info-box__footer__item">查看更多</div>
            :
            <Row>
              <Col
                span={12}
                className="info-box__footer__item"
                onClick={this.clearInfo}
              >
                清空 {tabActiveName}
              </Col>
              <Col
                span={12}
                className="info-box__footer__item"
              >
                查看更多
              </Col>
            </Row>
        }
        </div>
      </div>
    )
  };

  subMenus = () => {
    const { subMenus } = this.state;
    const rsSubmenus = (menu) => {
      menu.routes = menu.routes || [];

      if (menu.notShow) {
        return null
      }

      return <SubMenu
        key={menu.path}
        title={
          <span>
            <i className={`iconfont ${menu.icon}`} />
            <span>{menu.title}</span>
          </span>
        }
      >
        {
          menu.routes.map((item) => {
            if (menu.notShow) {
              return null
            }
            if (item.routes && item.routes.length > 0) {
              return rsSubmenus(item);
            } else {
              return (
                <Menu.Item
                  key={item.path}
                >
                  <Link
                    to={ item.path }
                  >
                    <i className={`iconfont ${item.icon}`} />
                    <span>{ item.title }</span>
                  </Link>
                </Menu.Item>
              )
            }
          })
        }
      </SubMenu>
    };
    return subMenus.map((item) => {
      if (item.routes && item.routes.length > 0) {
        return rsSubmenus(item);
      } else {
        return (
          <Menu.Item
            key={item.path}
          >
            <Link
              to={ item.path }
            >
              <Icon type="pie-chart" />
              <span>{ item.title }</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  popverChange = (visible) => {
    if (visible) {
      this.setState({
        infoLoading: true,
      });

      setTimeout(() => {
        this.setState({
          infoLoading: false,
        });
      },5000)
    }
  };

  subMenuOpen = (isOpen) => {
    this.setState({
      subMenuOpen: isOpen || !this.state.subMenuOpen,
    });
  };

  addAndRemoveLinks = (type) => {
    let { historyTabs, maxHistoryTab } = this.state;
    if (type === 'add') {
      const menusObject = recursiveMenus(menuList, '/');

      historyTabs.forEach((item) => {
        item.selected = false;
      });
      const it = cloneDeep(menusObject.nowLinkItem);
      it.selected = true;

      if (historyTabs.length > maxHistoryTab) {
        historyTabs.shift();
      }
      location.href = `${location.href.split('#')[0]}#${it.path}`;

      historyTabs.push(it);
    }

    this.setState({
      historyTabs,
    });
  };

  onDragEnd = (result) =>{
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // console.log(result);
    const historyTabs = reorder(
      this.state.historyTabs,
      result.source.index,
      result.destination.index
    );

    this.setState({
      historyTabs,
    });
  };

  tabClick = (item, index) => {
    const { historyTabs } = this.state;

    historyTabs.forEach((it, i) => {
      it.selected = `${item.sortIndex}_${index}` === `${it.sortIndex}_${i}`;
    });

    this.setState({
      historyTabs,
    });
  };

  closeTabClick = (item, index) => {
    const { historyTabs } = this.state;
    if (historyTabs.length === 1) {
      return;
    }

    historyTabs.forEach((it, i) => {
      if (`${item.sortIndex}_${index}` === `${it.sortIndex}_${i}`) {
        historyTabs.splice(i, 1);
      }
    });

    if (item.selected) {
      historyTabs[historyTabs.length - 1].selected = true;
      location.href = `${location.href.split('#')[0]}#${historyTabs[historyTabs.length - 1].path}`;
    }

    this.setState({
      historyTabs,
    });
  };

  historyTabHeader = () => {
    const {
      historyTabs,
      windowFunction,
    } = this.state;
    return (
      <div className="history-tabs clearfix">
        <div className="float-left history-tabs__close">
          <Row gutter={5}>
            {
              windowFunction.map((item, i) => (
                <Col
                  key={i}
                  span={8}
                  onClick={() => this.mainWindowFunction(item)}
                >
                  <div
                    className="item"
                    style={{
                      backgroundColor: item.color,
                    }}
                  >
                    <i
                      className={`iconfont ${item.icon}`}
                      style={{
                        left: item.left,
                      }}
                    />
                  </div>
                </Col>
              ))
            }

          </Row>
        </div>
        <div>
          <DragDropContext onDragEnd={(r) => this.onDragEnd(r)}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="tabs-link"
                >
                  {historyTabs.map((item, index) => (
                    <Draggable
                      key={`${item.sortIndex}_${index}`}
                      draggableId={`${item.sortIndex}_${index}`}
                      index={index}
                      isDragDisabled={historyTabs.length === 1}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          className="item-box"
                        >
                          <div
                            className={`item ${item.selected ? 'item-active' : ''}`}
                          >
                            <Link
                              className="item__a"
                              to={{
                                pathname: item.path,
                                hash: 'linkClick',
                              }}
                              onClick={() => this.tabClick(item, index)}
                            >
                              <i className="first-icon" />
                              <span className="title">{ item.title }</span>
                            </Link>
                            <div
                              className="close"
                              onClick={() => this.closeTabClick(item, index)}
                            >
                              <i className="iconfont iconguanbi" />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <Draggable
                    key="add"
                    draggableId="add"
                    isDragDisabled={true}
                    index={99999999999}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => this.addAndRemoveLinks('add')}
                      >
                        <div className="tabs-add">
                          <Icon type="plus" />
                        </div>
                      </div>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          </DragDropContext>

        </div>

      </div>
    )
  };

  render() {
    const {
      headerMenuKey,
      openMenus,
      infoNumber,
      locationPath,
      subMenus,
      subMenuOpen,
    } = this.state;

    const { history, children } = this.props;

    return (
      <LocaleProvider locale={zh_CN}>
        {
          notLayout.includes(history.location.pathname) ?
            <React.Fragment>
              { children }
            </React.Fragment>
            :
            <React.Fragment>

              { this.historyTabHeader() }


              <div
                className={`control-layout ${subMenus.length > 0 && subMenuOpen && 'control-layout-left'}`}
              >
                <div className="control-layout__header clearfix">

                  <div className="float-right control-layout__header__info clearfix">
                    <Tooltip placement="bottom" title={'使用文档'}>
                      <div className="item float-left">
                        <Icon
                          type="question-circle"
                          className="icon-size"
                        />
                      </div>
                    </Tooltip>

                    <Popover
                      placement="bottomRight"
                      content={this.informationList()}
                      trigger="click"
                      overlayClassName="header-open-info"
                      onVisibleChange={(visible) => this.popverChange(visible)}
                    >
                      <div className="item float-left">
                        <Badge
                          count={infoNumber}
                        >
                          <div style={{ width: 20 }}>
                            <Icon
                              className="icon-size"
                              type="bell"
                            />
                          </div>
                        </Badge>
                      </div>
                    </Popover>

                    <Dropdown overlay={this.userDropdown} placement="bottomRight">
                      <div className="item clearfix float-left">
                        <Avatar
                          className="user-icon float-left"
                          icon="user"
                          size="small"
                          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                        />
                        <span className="user-name float-left">{ getUserInfo().userName }</span>
                      </div>
                    </Dropdown>

                  </div>

                </div>

                <div className="control-layout__menu">
                  <div className="control-layout__logo">
                    <img src="https://sitemap-qa.oss-cn-hangzhou.aliyuncs.com/common_image/tob-logo.png" />
                  </div>
                  {
                    subMenus.length > 0 && !subMenuOpen ?
                      <div
                        className="open-sub-menu open-sub-menu-hide"
                        onClick={() => this.subMenuOpen()}
                      >
                        <div className="bg" />
                        <Icon type="menu-fold" className="icon open-sub-menu-tra" />
                      </div>
                      :
                      null
                  }


                  <Menu
                    onClick={() => this.subMenuOpen(true)}
                    selectedKeys={headerMenuKey}
                  >
                    {
                      menuList.map((item) => {
                        if (item.notShow) {
                          return null
                        }
                        return (
                          <Menu.Item
                            key={item.path}
                            className="control-layout__menu__link"
                          >
                            <Link
                              to={item.path}
                              className="item"
                            >
                              <i className={`iconfont ${item.icon}`} />
                              <span className="title">{item.title}</span>
                            </Link>
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu>
                </div>

                <div
                  className={`control-layout__menu-sub ${subMenus.length > 0 && subMenuOpen && 'sub-menu-left'}`}
                >
                  {
                    subMenuOpen ?
                      <div
                        className="open-sub-menu open-sub-menu-tra"
                        onClick={() => this.subMenuOpen()}
                      >
                        <div className="bg" />
                        <Icon
                          type="menu-fold"
                          className="icon open-sub-menu-tra"
                        />
                      </div>
                      :
                      null
                  }

                  <div className="control-layout__menu-sub__box">
                    <Menu
                      selectedKeys={[ locationPath ]}
                      defaultOpenKeys={ openMenus }
                      mode="inline"
                    >
                      { this.subMenus() }
                    </Menu>
                  </div>
                </div>

                { children }

              </div>
            </React.Fragment>
        }
      </LocaleProvider>
    )
  }
}

export default withRouter(Layout);
