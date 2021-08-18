import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";


export const Spinner = (props) => {
    const { promiseInProgress } = usePromiseTracker({ delay: 500 });

    return (
        promiseInProgress && (
            <div className="spinner">
                <Loader type="Oval"
                    color="#17a2b8"
                    height={100}
                    width={100} />
                <div className="spinnerText">ЗАГРУЗКА</div>
            </div>
        )
    );
};