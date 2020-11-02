import React, { useEffect, useState } from 'react';
import firebase from 'firebase';


const ListChannel = () => {
    const [ listChannel, setListChannel ] = useState([]);
    const channelOnDB = firebase.database().ref('/listChannel');

    useEffect(() => {
        async function getDataFromDB() {
            let listChannel = [];
            await channelOnDB.once('value', response => {
                listChannel = Object.values(response.val());
            })
            setListChannel(listChannel);
        }
        getDataFromDB();
    }, []);

    // // update workspace profile when edit is completed
    // channelOnDB.on('child_changed', response => {
    //     console.log('%c response: ', 'color: red' , response);
    //     setListChannel(Object.values(response.val()));
    // })


    return (
        <>
            <div>
                {
                    listChannel.length > 0 && 
                        listChannel.map((item, key) => 
                            <div className="channel_item" key={key}>
                                <p>{item.name}</p>
                            </div>
                        )
                }
            </div>
        </>
    );
}

export default ListChannel;