// components/NotFound.js
import React from 'react';
import StandardLayout from "../layouts/StandardLayout";

class AccessDenied extends React.Component {
    render() {
        return <StandardLayout {...this.props}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <h1>403</h1>
                <p>Xin lỗi, nhưng mà các vị thần trên Olympus không muốn bạn xem nội dung này</p>
            </div>
        </StandardLayout>
    }
}

export default AccessDenied;