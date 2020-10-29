import React, { useState } from 'react';
import './SearchMember.scss';
import firebase from 'firebase';
import { Plus } from 'react-feather';


const SearchMember = props => {
    const { userId, resultSearch } = props;
    console.log('%c resultSearch: ', 'color: red' , resultSearch);

    return (
        <div className="search_member_modal">
            <div className="result_area">
                {
                    resultSearch.length > 0 && resultSearch.map((item, key) => <ResultSearchItem key={key} data={item} length={resultSearch.length} index={key + 1}/>)
                }
            </div>
        </div>
    );
}

export const ResultSearchItem = props => {
    const { data, index, length } = props;
    return (
    <>
        <div className="result_search_item">
            <div className="name">
                { data.displayName }
            </div>
            <div className="add_to_channel">
                <Plus size={18}/>
                <p>Add to channel</p>
            </div>
        </div>
        { index !== length && <hr />}
    </>
    )
}

export default SearchMember;