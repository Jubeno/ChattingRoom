import React from 'react';
import Popup from 'reactjs-popup';

const AddMember = () => {

    return (
        <>
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="add_member_popup"
            >
                add
            </Popup>
        </>
    );
}

export default AddMember;