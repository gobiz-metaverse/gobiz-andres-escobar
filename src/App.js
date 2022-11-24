import React from 'react';
import routes from './Routes'
import './App.css';
import Loading from "./pages/Loading";
// import OpenReplay from '@openreplay/tracker';
//import trackerAssist from '@openreplay/tracker-assist';
// import {LocalStore} from "./utils/LocalStore";

export const BASE_URL = 'https://olympus.gobizdev.com';

// export const REPLAY_TRACKER = new OpenReplay({
//     projectKey: 'RT6kdJLeUkzGnrnVR2vQ',
//     ingestPoint: 'https://replay.gobiz.vn/ingest',
//     __DISABLE_SECURE_MODE: true
// });
// REPLAY_TRACKER.use(trackerAssist({
//     confirmText: 'Bạn có muốn được hỗ trợ trực tiếp?'
// }));
// REPLAY_TRACKER.start();

class AppRootComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initAppStatus: 'loading'
        };

        document.querySelector('#app-loading').style.display = 'none';

        //let session = LocalStore.getInstance().read('taiga_session');

        // if (session)
        //     REPLAY_TRACKER.setUserID(session.email);
    }

    componentDidMount() {
        setTimeout(() => this.setState({
            initAppStatus: 'success'
        }), 1500);
    }

    render() {
        switch (this.state.initAppStatus) {
            case 'success':
                return (routes);

            case 'failure':
                return (
                    <span>Truy cập bị lỗi, vui lòng thử lại</span>
                );

            default:
                // show loading page
                return <Loading/>;
        }
    }
}


export default AppRootComponent;
