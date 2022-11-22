import React from 'react';
import {Space} from 'antd';
import {
    LoadingOutlined
} from '@ant-design/icons';

class ComponentLoading extends React.Component {
    render() {
        return <div className={'component-loading'}>
            <Space>
                <LoadingOutlined/>
                {this.props.message ? this.props.message : <div>Loading</div>}</Space>
        </div>
    }
}

export default ComponentLoading;