import logs from "./log.json"
import React from 'react';
import {LocalStore} from "../../utils/LocalStore";
import {Modal} from "antd";

//TODO: planning dài hơi cho team

//TODO: assign trên modal edit: chưa unassgin được đâu nhé

//TODO: thêm card cho chọn swimlane

//TODO: hiển thị assignee trên card kanban
//TODO: estimate points trên modal

//TODO: report được thành quả của 1 team đã deliver được gì trong 1 khoảng thời gian
//TODO: thể hiện progress của US trên kanban
//TODO: thêm 1 us trên TeamPriority dựa trên Epic
//TODO: thống kê backlog theo team
//TODO: kéo thả sort epic ở giao diện Epics
//TODO: tạo epic mới
//TODO: khi map epic ở giao diện Kanban cho lọc done/not done
//TODO: giao diện backlog
//TODO: cho phép sửa nhanh User Story trên backlog/kanban
//TODO: refactor team manage cho chọn team lên header giống project
//TODO: cho phép chọn project mà team sẽ thực hiện (admin only)
//TODO: sắp xếp bảng Kanban theo backlogs
//TODO: show task luôn ở dashboard chung nếu đã đăng nhập taiga
//TODO: modal link epic có màu epic luôn
//TODO: giao diện quản lý backlog

//TODO: liên kết giữa view SC và Taiga; có menu project
//TODO: view requirement US không tồn tại trên taiga lỗi trắng trang
//TODO: view SC theo sprint: US, số SC, checklist SC;
//TODO: Hiển thị cả project trên file, theo cấu trúc folder...
//TODO: Cải tiến là click lên row tương đương select row examples đó

export default class ChangeLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showChangelog: false,
            changelog: []
        }
    }

    componentDidMount() {
        let version = LocalStore.getInstance().read('version');

        if (version) {
            if (this.isNewerVersionThan(logs[0].version, version)) {
                let changelog = [];
                for (let ii = 0; ii < logs.length; ii++) {
                    if (this.isNewerVersionThan(logs[ii].version, version)) {
                        changelog.push(logs[ii]);
                    } else {
                        break;
                    }
                }

                this.setState({
                    showChangelog: true,
                    changelog: changelog
                })
            }
        }
        else {
            LocalStore.getInstance().save('version', logs[0].version)
        }
    }

    isNewerVersionThan(version, compareTo) {
        let version_args = version.split('.');
        let compareToArgs = compareTo.split('.');
        for (let ii = 0; ii < 4; ii++) {
            if (parseInt(version_args[ii]) > parseInt(compareToArgs[ii])) {
                return true
            }
        }
    }

    markAsRead = () => {
        this.setState({showChangelog: false});
        LocalStore.getInstance().save('version', logs[0].version)
    };

    render() {
        return <Modal title={'Olympus đã được thăng cấp!'} visible={this.state.showChangelog}
                      closable={false}
                      okText={'Tôi đã xem, nhưng màu xanh'}
                      cancelText={'Tôi đã xem'}
                      onOk={this.markAsRead}
                      onCancel={this.markAsRead}>
            {this.state.changelog.map(log => {
                return <div key={log.version}>
                    <h4>{log.version}</h4>
                    {log.new && log.new.length > 0 ? <>
                    <strong>New features:</strong>
                    <ul>{log.new.map(str=><li key={str}>{str}</li>)}</ul>
                    </> : null}

                    {log.improvement && log.improvement.length > 0 ? <>
                        <strong>Improvement:</strong>
                        <ul>{log.improvement.map(str=><li key={str}>{str}</li>)}</ul>
                    </> : null}
                </div>
            })
            }
        </Modal>
    }
}