import React from "react";
import { Link } from "react-router-dom";
import { ProfileOutlined, CalendarOutlined, TrophyOutlined } from "@ant-design/icons";
import { Menu } from "antd";
export default function MenuComponent({activeMenu}) {
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
                <Menu.Item icon={<CalendarOutlined />}>
                    <Link to={"/"}>
                        Lịch thi đấu & dự đoán
                    </Link>
                </Menu.Item>
                <Menu.Item icon={<TrophyOutlined />}>
                    <Link to={"/bet/outrights"}>
                        Dự đoán vô địch
                    </Link>
                </Menu.Item>
                <Menu.SubMenu
                    icon={<ProfileOutlined />}
                    title={"Thống kê"}
                    key={"report"}
                >
                    <Menu.Item>
                        <Link to={"/report/bet-history"}>
                            Lịch sử chơi toàn hệ thống
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to={"/report/top-playing"}>
                            Top người chơi tích cực
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        </div>
    </div>
  );
}
