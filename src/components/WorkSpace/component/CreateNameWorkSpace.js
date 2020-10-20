import React from 'react';
import { Jumbotron, Input } from 'reactstrap';

const CreateNameWorkSpace = props => {
    const { register } = props;
    return (
            <Jumbotron className="container_">
                <div className="wrapper">
                    <h1 className="display-3 text-center text-dark mb-5">STEP 1</h1>
                    <p className="lead">What is your workspace's name?</p>
                    <Input type="text" name="workspaceName" id="workspace" placeholder="Name of your workspace" innerRef={register} />
                </div>
            </Jumbotron>
    );
}

export default CreateNameWorkSpace;