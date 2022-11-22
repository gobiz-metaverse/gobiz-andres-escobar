// components/NotFound.js
import React from 'react';
import StandardLayout from "../layouts/StandardLayout";

class PageNotFound extends React.Component {
    render() {
        return <StandardLayout {...this.props}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <h1>404</h1>
                <p>Dù cho có 100 triệu cũng không thể mua được page này</p>
            </div>
        </StandardLayout>
    }
}

export default PageNotFound;