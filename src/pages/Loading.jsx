import React from 'react';
import {
    LoadingOutlined
} from '@ant-design/icons';

class Loading extends React.Component {
    render() {
        return <div style={{margin: '0 auto', textAlign: 'center'}}>
            <div style={{maxWidth: '600px', marginTop: '200px', padding: '60px'}} className='box chanting'>
            <LoadingOutlined/><br/>
                {this.props.message ? this.props.message : <div>Với target tổng định giá 100 triệu đô, chúng ta sẽ cần cố gắng không ngừng</div>}
            </div>
        </div>
    }
}

export default Loading;