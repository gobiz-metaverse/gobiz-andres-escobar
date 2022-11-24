import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import football from '../styles/football.json'

class Loading extends React.Component {
  render() {
    return (
      <div style={{ margin: "0 auto", textAlign: "center" }}>
        <Player
          autoplay
          src={football}
          style={{ height: "500px", width: "300px" }}
        />
        {this.props.message ? this.props.message : <div className="mt-1 text-orange-400">Với target tổng định giá 100 triệu đô, chúng ta sẽ cần cố gắng không ngừng</div>}
      </div>
    );
  }
}

export default Loading;
