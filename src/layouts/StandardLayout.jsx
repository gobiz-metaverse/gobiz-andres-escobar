import React, { Component } from "react";
import { Layout, Drawer } from "antd";
import SiteFooter from "../pages/components/SiteFooter";
import "./styles.css";
import HeaderComponent from "./Header";
import MenuComponent from "./Menu";
import { CloseOutlined } from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;

class StandardLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      isDraw: false,
      width: window.innerWidth,
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    if (this.props.title) {
      document.title = this.props.title;
    }
    window.addEventListener(
      "resize",
      this.setState({
        width: window.innerWidth,
        collapsed: window.innerWidth <= 992,
      })
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.forceUpdate();
    }
  }
  render() {
    console.log("width", this.state.width);
    return (
      <Layout style={{ minHeight: "100vh" }}>
        {!this.state.collapsed && (
          <Sider breakpoint="lg" width={240} collapsed={false}>
            <MenuComponent activeMenu={this.props.activeMenu} />
          </Sider>
        )}
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <HeaderComponent
              width={this.state.width}
              openDraw={() => {
                this.setState({ isDraw: !this.state.isDraw });
              }}
            />
          </Header>
          <Content>
            <div className="content--layout">
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <SiteFooter />
          </Footer>
        </Layout>
        {this.state.isDraw && (
          <Drawer
            placement="left"
            height="100vh"
            width={240}
            headerStyle={{
              background: '#000',
              borderBottom: '0'
            }}
            onClose={() =>
              this.setState({
                isDraw: false,
              })
            }
            bodyStyle={{
              padding: 0,
              background: '#000'
            }}
            open={this.state.isDraw}
          >
            <MenuComponent activeMenu={this.state.activeMenu} />
          </Drawer>
        )}
      </Layout>
    );
  }
}

export default StandardLayout;
