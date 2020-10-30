import { SELECT_MEMBER } from './ChannelActions';

const WorkSpaceReducer = (state, action) => {
    switch (action.type) {
        case SELECT_MEMBER:
            return { ...state, listMember: state.listMember.concat(action.payload) };
        default:
            return state;
    }
};

export default WorkSpaceReducer;