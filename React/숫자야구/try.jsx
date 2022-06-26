import React, {Component} from 'react';

class Try extends Component {
    render() {
        const {tryInfo} = this.props; //비구조할당
        <li>
            <div>{tryInfo.try}</div>
            <div>{tryInfo.result}</div>
        </li>
    }
}

export default Try;