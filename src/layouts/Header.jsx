import React from "react";
import { Avatar, Button, Space, Typography, Layout } from "antd";
import { PicLeftOutlined, UserOutlined } from "@ant-design/icons";
export default function HeaderComponent({ openDraw, width }) {
  return (
    <Layout.Header style={{ background: "#fff", padding: 0 }}>
      <div className="flex justify-between items-center px-3">
        <div>
          {width <= 992 && (
            <Button
              type="link"
              icon={<PicLeftOutlined />}
              onClick={() => openDraw()}
            />
          )}
        </div>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Typography.Text>Username</Typography.Text>
        </Space>
      </div>
    </Layout.Header>
  );
}
