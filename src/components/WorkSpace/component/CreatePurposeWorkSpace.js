import React from 'react';
import { Jumbotron, Input } from 'reactstrap';

const CreatePurposeWorkSpace = props => {
    const { register } = props;

    return (
        <Jumbotron className="container_">
            <div className="wrapper">
                <h1 className="display-3 text-center text-dark mb-5">STEP 2</h1>
                <p className="lead">The purpose of your workspace is ...</p>
                <Input type="text" name="workspacePurpose" id="workspace_purpose" placeholder="Development, Study,..." innerRef={register} />
            </div>
        </Jumbotron>
    );
}

export default CreatePurposeWorkSpace;