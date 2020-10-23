import React, { useContext, useState } from 'react';
import firebase from "firebase";
import { Jumbotron, Input, Button } from 'reactstrap';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../../contexts/WorkSpace/WorkSpaceContext';
import { useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight } from 'react-feather';
import { getKeyByProperty } from '../../../utils/function';

const CreatePurposeWorkSpace = props => {
    const { activePurpose, history } = props;
    const { register, handleSubmit } = useForm();
    const { purpose } = useContext(WorkSpaceContext).state;
    const workspaceOnDB = firebase.database().ref('/workspace/list');

    const submitPurpose = async data => {
        await WorkSpaceActions.createPurpose(data.workspacePurpose);
        WorkSpaceActions.goToNextStep();

        // update on db
        workspaceOnDB.once('value', response => {
            const key = getKeyByProperty(response.val(), 'workspace', history.workspace)
            const setDisplayNameOnDB = workspaceOnDB.child(key);
            setDisplayNameOnDB.update({ "purposeOfWorkspace": data.workspacePurpose });
        })
    };

    const goToPrevStep = () => {
        WorkSpaceActions.goToPrevStep();
    }
    const goToNextStep = () => {
        WorkSpaceActions.goToNextStep();
    }
    
    const isShowNextStep = activePurpose && purpose;
    return (
        <div className="container_">
            {activePurpose && <div className="btn_comeback" onClick={goToPrevStep}><ChevronLeft size="30"/></div>}
            {isShowNextStep && <div className="btn_next" onClick={goToNextStep}><ChevronRight size="30"/></div>}
            <div className="wrapper">
                <h1 className="display-3 text-center font-weight-bold text-white mb-5">STEP 2</h1>
                <p className="lead text-white font-weight-bold">The purpose of your workspace is ...</p>
                <form className="form"  onSubmit={handleSubmit(submitPurpose)}>
                    <Input 
                        type="text" 
                        name="workspacePurpose" 
                        id="workspace_purpose" 
                        placeholder="Development, Study,..." 
                        innerRef={register} 
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </div>
    );
}

export default CreatePurposeWorkSpace;