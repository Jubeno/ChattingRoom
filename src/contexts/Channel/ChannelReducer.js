import { CREATE_CHANNEL, DELETE_CHANNEL, SELECT_MEMBER, SET_INFOR_CHANNEL, SET_INITIAL_LIST_CHANNEL } from './ChannelActions';

const WorkSpaceReducer = (state, action) => {
    switch (action.type) {
        case SELECT_MEMBER:
            return { ...state, listMember: state.listMember.concat(action.payload) };
        case SET_INITIAL_LIST_CHANNEL:
            return { ...state, listChannel: action.payload };
        case DELETE_CHANNEL:
            const deletedList = state.listChannel.filter(item => item.channelId !== action.payload);
            return { ...state, listChannel: deletedList };
        case CREATE_CHANNEL:
            return { ...state, listChannel: state.listChannel.concat(action.payload) };
        case SET_INFOR_CHANNEL:
            return { 
                    ...state, channelData: 
                    {
                        ...state.channelData, 
                        type: action.payload.type,
                        isActive: true,
                        infor: action.payload.infor,
                        members: action.payload.members,
                        listChat: action.payload.listChat,
                        conversationId: action.payload.conversationId,
                        friendId: action.payload.friendId
                    }
                };
        default:
            return state;
    }
};

export default WorkSpaceReducer;