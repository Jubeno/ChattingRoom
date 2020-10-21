import React, { useState } from 'react';
import { Jumbotron, Input, Button } from 'reactstrap';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../../contexts/WorkSpace/WorkSpaceContext';

const CreatePurposeWorkSpace = props => {
    const { register } = props;
    const [purpose, setPurpose] = useState('');

    const handleChange = event => {
        setPurpose(event.target.value);
    }

    const submitPurpose = () => WorkSpaceActions.createPurpose(purpose);

    return (
        <div className="container_">
            <div className="wrapper">
                <h1 className="display-3 text-center font-weight-bold text-white mb-5">STEP 2</h1>
                <p className="lead text-white font-weight-bold">The purpose of your workspace is ...</p>
                <div className="form">
                    <Input 
                        type="text" 
                        name="workspacePurpose" 
                        id="workspace_purpose" 
                        placeholder="Development, Study,..." 
                        innerRef={register} 
                        onChange={handleChange}
                    />
                    <Button onClick={submitPurpose}>Submit</Button>
                </div>
            </div>
        </div>
    );
}

export default CreatePurposeWorkSpace;