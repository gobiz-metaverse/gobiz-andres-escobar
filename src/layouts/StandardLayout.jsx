import React, {Component} from 'react'
import {Layout, Menu, Breadcrumb} from 'antd';
import SiteFooter from "../pages/components/SiteFooter";
import {Link} from "react-router-dom";
import {SketchOutlined, ToolOutlined, ProfileOutlined, CheckSquareOutlined} from '@ant-design/icons';
import ChangeLog from "../pages/changelog/ChangeLog";

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class StandardLayout extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    };

    componentDidMount() {
        if (this.props.title) {
            document.title = this.props.title
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.title !== this.props.title) {
            this.forceUpdate()
        }
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="40"
                    // collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                    // trigger={null}
                >
                    <div className="logo"><Link to={'/'}><img
                        src={'https://gobiz.vn/wp-content/themes/gobiz/fav/favicon-32x32.png'} alt={'Olympus'}/>
                    </Link></div>
                    <div>
                        <Menu theme="dark"
                              selectedKeys={this.props.activeMenu}
                              defaultSelectedKeys={['1']}
                              mode="inline"
                              defaultOpenKeys={['sub_taiga']}
                        >
                            {/*<SubMenu*/}
                            {/*    icon={<SketchOutlined/>}*/}
                            {/*    key="sub_taiga"*/}
                            {/*    title={<span><span>Taiga</span></span>}*/}
                            {/*>*/}
                            {/*    <Menu.Item key="taiga">*/}
                            {/*        <Link to={'/taiga/'}><span>Dashboard</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="team_sprint">*/}
                            {/*        <Link to={'/taiga/teams/'}><span>Quản lý theo team</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="personal_report">*/}
                            {/*        <Link to={'/taiga/report/me'}><span>Báo cáo cá nhân</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="report">*/}
                            {/*        <Link to={'/taiga/report/all'}><span>Báo cáo tổng hợp</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*</SubMenu>*/}
                            {/*<SubMenu*/}
                            {/*    icon={<CheckSquareOutlined />}*/}
                            {/*    key="jira"*/}
                            {/*    title={<span><span>Jira</span></span>}*/}
                            {/*>*/}
                            {/*    <Menu.Item key="jira_dashboard">*/}
                            {/*        <Link to={'/jira/'}><span>Dashboard</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="jira_team">*/}
                            {/*        <Link to={'/jira/teams/'}><span>Quản lý theo team</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    /!*<Menu.Item key="jira_report">*!/*/}
                            {/*    /!*    <Link to={'/taiga/report/me'}><span>Báo cáo cá nhân</span></Link>*!/*/}
                            {/*    /!*</Menu.Item>*!/*/}
                            {/*    /!*<Menu.Item key="report">*!/*/}
                            {/*    /!*    <Link to={'/taiga/report/all'}><span>Báo cáo tổng hợp</span></Link>*!/*/}
                            {/*    /!*</Menu.Item>*!/*/}
                            {/*</SubMenu>*/}
                            {/*<SubMenu icon={<ToolOutlined/>}*/}
                            {/*         key="sub_tool"*/}
                            {/*         title={<span><span>Công cụ</span></span>}*/}
                            {/*>*/}
                            {/*    <Menu.Item key="json_schema">*/}
                            {/*        <Link to={'/tools/schema'}><span>Json Schema Generator</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="hue">*/}
                            {/*        <Link to={'/hue'}><span>Công cụ xử lý đơn</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="authenme">*/}
                            {/*        <Link to={'/authenme'}><span>Công cụ xử lý user</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*</SubMenu>*/}
                            {/*<SubMenu icon={<ProfileOutlined />}*/}
                            {/*         key="requirements"*/}
                            {/*         title={<span><span>Tài liệu dự án</span></span>}*/}
                            {/*>*/}
                            {/*    <Menu.Item key="m1">*/}
                            {/*        <Link to={'/requirements/m1'}><span>M1: Customer Order Management</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m2">*/}
                            {/*        <Link to={'/requirements/m2'}><span>M2: Admin Order Management</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m3">*/}
                            {/*        <Link to={'/requirements/m3'}><span>M3: Complaints Management</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m5">*/}
                            {/*        <Link to={'/requirements/m5'}><span>M5: Purchasing</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m6">*/}
                            {/*        <Link to={'/requirements/m6'}><span>M6: Warehouse Management</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m19">*/}
                            {/*        <Link to={'/requirements/m19'}><span>M19: Sale & Affiliates Management</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m22">*/}
                            {/*        <Link to={'/requirements/m22'}><span>M22: Ubox - Sàn</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m24">*/}
                            {/*        <Link to={'/requirements/m24'}><span>M24: Ubox - Gobiz Assistant</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m28">*/}
                            {/*        <Link to={'/requirements/m28'}><span>M28: Fulfilment Management</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m29">*/}
                            {/*        <Link to={'/requirements/m29'}><span>M29: Email Sending Service</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*    <Menu.Item key="m32">*/}
                            {/*        <Link to={'/requirements/m32'}><span>M32: Delivery API Service</span></Link>*/}
                            {/*    </Menu.Item>*/}
                            {/*</SubMenu>*/}
                        </Menu>
                    </div>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}>
                        {this.props.header}
                    </Header>
                    <Content style={{margin: '0 16px', position: 'relative'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            {/*<Breadcrumb.Item>User</Breadcrumb.Item>*/}
                            {/*<Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                        </Breadcrumb>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            {this.props.children}
                        </div>
                        {/*<ChangeLog/>*/}
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        <SiteFooter/>
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default StandardLayout;
