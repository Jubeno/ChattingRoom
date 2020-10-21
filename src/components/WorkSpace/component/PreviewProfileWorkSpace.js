import React, { useContext } from 'react';
import { Input } from 'reactstrap';
import DelayImage from '../../Common/DelayImage/DelayImage';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../../contexts/WorkSpace/WorkSpaceContext';

const PreviewProfileWorkSpace = () => {
    const { avatar, name, purpose } = useContext(WorkSpaceContext).state;
    const source = avatar || "/img/avatar_template.svg";
    const nameWorkspace = name || 'Your workspace\'s name';
    const purposeWorkspace = purpose || 'Purpose of your workspace';
    return (
        <div className="preview_profile_workspace">
            <div className="infor">
                <div className="avatar">
                    <DelayImage className="image" src={source}/>
                </div>
                <div className="name">
                    <p className="lead text-muted font-weight-bold">{nameWorkspace}</p>
                </div>
            </div>
            <div className="purpose">
                <p className="lead text-muted font-weight-bold">{`#${purposeWorkspace}`}</p>
            </div>
        </div>
    );
}

export default PreviewProfileWorkSpace;