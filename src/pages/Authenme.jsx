import React from 'react';
import StandardLayout from '../layouts/StandardLayout'
import {Input, Select} from "antd";
import {Row, Col} from 'antd';
import RemoveUsers from "./components/tools/m10/RemoveUsers";
import {LocalStore} from "../utils/LocalStore";

const {TextArea} = Input;

class Authenme extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: LocalStore.getInstance().read('m10_accessToken')
        }
    }

    functionSelected = (value) => {
        this.setState({currentFunction: value})
    };

    getCurrentComponent = () => {
        switch (this.state.currentFunction) {
            case 'removeUsers':
                return <RemoveUsers token={this.state.token}/>;
            default:
                return null
        }
    };

    accessTokenChanged = (e) => {
        let accessToken = e.target.value;
        LocalStore.getInstance().save('m10_accessToken', accessToken);
        this.setState({token: accessToken})
    };

    render() {
        return <StandardLayout {...this.props} activeMenu={['authenme']}>
            <h1>Heracles</h1>
            <Row className={'hueng'}>
                <Col span={24}>
                    <section className="dashboard">
                        <Row>
                            <Col span={24}>
                                <p>Access token (chưa hỗ trợ lấy token tự động)</p>
                                <TextArea onChange={this.accessTokenChanged} value={this.state.token} rows={1}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <Select style={{width: 300}} onChange={this.functionSelected} placeholder={"Vui lòng chọn tool muốn dùng"}>
                                    <Select.Option value={'removeUsers'}>Bỏ user ra khỏi tất cả role</Select.Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                {this.getCurrentComponent()}
                            </Col>
                        </Row>
                    </section>
                </Col>
            </Row>
        </StandardLayout>
    }
}

export default Authenme