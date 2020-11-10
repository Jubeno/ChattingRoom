import React, { useEffect, useRef, useState } from 'react';
import { DATABASE } from '../../../utils/database';
import MessageItem from './MessageItem';
import { HIDE_CONTENT_TIME, INITIAL_MESSAGE_CHAT, MESSAGE_TYPE } from '../../../utils/constant';
import Loading from '../../Common/Loading/Loading';


const ChatInChannel = props => {
    const { data, userId } = props;
    const channelId = data?.infor?.channelId;
    const listChat = data?.listChat && Object.values(data?.listChat);
    const messageListRef = useRef(null);
    const messagesEndRef = useRef(null)
    const [ list, setList ] = useState([]);
    const firstMessage = list[0]?.sendTime;
    const [hasMore, setHasMore] = useState(true);
    const [showContent, setShowContent] = useState(true);


    const scrollToBottom = () => {
        if(messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    useEffect(() => {
        // loading on change channel
        setShowContent(true);
        setList(listChat)

        // scroll to bottom at initial
        setTimeout(() => {
            scrollToBottom();
        }, 0);

        // hide content until scroll to bottom is done
        setTimeout(() => {
            setShowContent(false)
        }, HIDE_CONTENT_TIME);

    }, [channelId])

    // chat real time
    DATABASE
    .ref(`/chatInChannel/${channelId}`)
    .on('child_changed', response => {
        const id = localStorage.getItem('channelId')
        let value = {};
        if( response.val() ) {
            value = Object.values(response.val()).pop();
        }
        if(id === value.receiverId) {
            setList([...list, value]);
            scrollToBottom();
        }
    })
    
    const loadMore = () => {
        DATABASE
        .ref(`/chatInChannel/${channelId}/listChat`)
        .orderByChild('sendTime')
        .endAt(firstMessage)
        .limitToLast(INITIAL_MESSAGE_CHAT)
        .once('value', response => {
            if(response.val()) {
                const value = Object.values(response.val());
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
        if(listChat.length >= INITIAL_MESSAGE_CHAT) {
            ele =  <div className={`btn_loadmore ${!hasMore && 'no_more_to_load'}`} onClick={loadMore}>See older messages</div>
        } else ele = null;
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