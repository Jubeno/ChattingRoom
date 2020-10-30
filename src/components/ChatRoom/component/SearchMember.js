import React, { useState } from 'react';
import './SearchMember.scss';
import firebase from 'firebase';
import { Plus } from 'react-feather';
import { Context as ChannelContext, actions as ChannelActions } from '../../../contexts/Channel/ChannelContext';

const SearchMember = props => {
    const { userId, resultSearch } = props;
    // console.log('%c resultSearch: ', 'color: red' , resultSearch);

    return (
        <div className="search_member_modal">
            <div className="result_area">
                {
                    resultSearch.length > 0 && resultSearch.map((item, key) => <ResultSearchItem key={key} data={item} userId={userId} length={resultSearch.length} index={key + 1}/>)
                }
            </div>
        </div>
    );
}

export const ResultSearchItem = props => {
    const { data, index, length, userId } = props;

    const addToChannel = () => {
        ChannelActions.selectMember(data);
    }

    return (
        <>
            <div className="result_search_item">
                <div className="name">
                    { data.displayName }
                </div>
                <div className="add_to_channel" onClick={addToChannel}>
                    {
                        (userId !== data.userID) &&
                            <>
                                <Plus size={18}/>
                                <p>Add to channel</p>
                            </>
                    }
                </div>
            </div>
            { index !== length && <hr />}
        </>
    )
}

export default SearchMember;