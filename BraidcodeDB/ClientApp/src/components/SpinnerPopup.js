import React, { Component }  from "react";
import Loader from "react-loader-spinner";

export class SpinnerPopup extends React.Component {
    constructor(props) {
        super(props);
    }
    render()
    {
        return <div className="spinner" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <Loader type="Oval"
                    color="#00BFFF"
                    height={100}
                    width={100} />
                <div className="spinnerText">ЗАГРУЗКА</div>
            </div>
        }
}