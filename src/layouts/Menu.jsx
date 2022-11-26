import React from "react";
import { Link } from "react-router-dom";
import { ProfileOutlined } from "@ant-design/icons";
import { Menu } from "antd";
export default function MenuComponent({activeMenu}) {
  console.log('window', window.location)
  return (
    <div>
      <div className="logo flex justify-center pt-3 mb-3">
        <Link to={"/"}>
          <img
            className="logo--response"
            src={
              "https://gobiz.vn/wp-content/themes/gobiz/fav/favicon-32x32.png"
            }
            alt={"Olympus"}
          />
        </Link>
      </div>
      <div>
        <Menu
          theme="dark"
          selectedKeys={activeMenu}
          defaultSelectedKeys={["1"]}
          mode="inline"
          defaultOpenKeys={["report"]}
        >
          <Menu.SubMenu
            icon={<ProfileOutlined />}
            title={"Thống kê"}
            key="report"
          >
            <Menu.Item key='bet-history'>
              <Link to={"/report/bet-history"}>Lịch sử chơi toàn hệ thống</Link>
            </Menu.Item>
            <Menu.Item key='top-playing'>
              <Link to={"/report/top-playing"}>Top người chơi tích cực</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div>
    </div>
  );
}
