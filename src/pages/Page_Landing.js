import React from 'react';

export default function Page_Landing() {
    return (
        <div className="container" style={{width: '100wh'}}>
            <h1>Electron React Template</h1>
            <p>v.{process.env.REACT_APP_VERSION}</p>
        </div>
    )
}
