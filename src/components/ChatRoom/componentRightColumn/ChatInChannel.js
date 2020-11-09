import React, { useEffect, useRef, useState } from 'react';
import { chatInChannelOnDB, DATABASE, messageOnDB } from '../../../utils/database';
import MessageItem from './MessageItem';
import { INITIAL_MESSAGE_CHAT } from '../../../utils/constant';
import Loading from '../../Common/Loading/Loading';


const ChatInChannel = props => {
    const { data, userId } = props;
    const channelId = data?.infor?.channelId;
    const listChat = data?.listChat && Object.values(data?.listChat);
    const [ listRealTime, setListRealTime ] = useState([]);
    const [ initial, setInitial ] = useState(true);
    const messageListRef = useRef(null);
    const messagesEndRef = useRef(null)
    const [ list, setList ] = useState([]);
    const firstMessage = list[0]?.sendTime;
    const [hasMore, setHasMore] = useState(true);
    const [showContent, setShowContent] = useState(true);


    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }

    useEffect(() => {
        if(initial) {
            setList(listChat)
        } else {
            setList(listRealTime)
        }

        setTimeout(() => {
            scrollToBottom();
        }, 0);

        // hide content until scroll to bottom is done
        setTimeout(() => {
            setShowContent(false)
        }, 750);

        return () => setListRealTime([])
    }, [])

    // // chat real time
    // DATABASE
    // .ref(`/chatInChannel/${channelId}/listChat`)
    // .orderByChild('sendTime')
    // .limitToLast(INITIAL_MESSAGE_CHAT)
    // .on('child_changed', response => {
    //     console.log('%c response: ', 'color: red' , response.val());
    //     setInitial(false);
    //     let value;
    //     if( response.val() ) {
    //         value = Object.values(response.val());
    //     } else {
    //         value = [];
    //     }
    //     console.log('%c value: ', 'color: red' , value);
    //     setListRealTime(value);
        
    //     setList(value);
    // })
    
    const loadMore = () => {
        DATABASE
        .ref(`/chatInChannel/${channelId}/listChat`)
        .orderByChild('sendTime')
        .endAt(firstMessage)
        .limitToLast(INITIAL_MESSAGE_CHAT)
        .once('value', response => {
            if(response.val()) {
                const value = Object.values(response.val());
                console.log('%c value: ', 'color: red' , value.length);
                if(value?.length !== 1 ) {
                    value.pop();
                    setList([...value, ...list])
                } else {
                    setHasMore(false);
                }
            }
        })
    }

    const renderButtonLoadMore = () => {
        let ele = {};
        ele = 
            <div className={`btn_loadmore ${!hasMore && 'no_more_to_load'}`} onClick={loadMore}>
                Loadmore
            </div>
        return ele;
    }
    return (
        <>
            {showContent && 
                <div className="loading_content">
                    <Loading />
                </div>
            }
            <div 
                className="chat_content" 
                ref={messageListRef}
            >
                { renderButtonLoadMore() }
                {
                    list?.map((item, key) => 
                        <MessageItem 
                            key={key} 
                            data={item} 
                            userId={userId}
                        />
                    )
                }
                <div ref={messagesEndRef} />
            </div>
        </>
        
    );
}

export default ChatInChannel;