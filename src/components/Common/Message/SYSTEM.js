import React from 'react';

const SYSTEM = props => {
    const { data } = props;
    return (
        <>
            <p className="system_message">{data.value}</p>
        </>
    );
}

export default SYSTEM;