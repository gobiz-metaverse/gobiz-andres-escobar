import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {LocalStore} from "../../utils/LocalStore";
import TodoService from "../../services/todo/TodoService";

export default class Login extends React.Component{
    todo;

    constructor(props) {
        super(props);
        this.todo = TodoService.getDefaultInstance()
    }

    onFinish = (values) => {
        this.todo.login(values.username, values.password).then(
            (response) => {
                if (response.status !== 200) {
                    notification['error']({
                        message: 'Error',
                        description:
                        response.body.error_message,
                        duration: 0
                    });
                } else {
                    LocalStore.getInstance().save('todo_session', response.body);

                    if (this.props.location.state && this.props.location.state.from) {
                        this.props.history.push(this.props.location.state.from.pathname)
                    }
                    else {
                        this.props.history.push('/todos/')
                    }
                }
            }
        )
    };

    render(){
        return <div className={"taiga login-page"}>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>

                <p>Hướng dẫn: có 2 tài khoản dùng để test là demo/password và demo2/passcode</p>
            </Form>
        </div>
    }
}
