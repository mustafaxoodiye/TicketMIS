import React from 'react';
import { FadeLoader } from 'react-spinners';
import BarLoader from 'react-spinners/BarLoader';
import RingLoader from "react-spinners/RingLoader";

interface Props {
    size?: string;
    showText?: boolean;
}

export const MyRingLoader: React.FC<Props> = ({ size = '80vh', showText }) => {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: size }}>
            <RingLoader size={150} color={"#191E3A"} />
            {
                showText && <h5>Fetching Data...</h5>
            }
        </div>
    )
}

export const MyBarLoader: React.FC<Props> = ({ size = '10vh' }) => {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: size }}>
            <BarLoader color={"#2D65A7"} height={6} width={200} />
        </div>
    )
}

export const MyFadeLoader: React.FC<Props> = ({ size = '10vh' }) => {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: size }}>
            <FadeLoader color={"#2D65A7"} height={45} width={7} radius={2} margin={37} />
        </div>
    )
}
