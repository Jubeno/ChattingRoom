import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Emoji = props => {
    const { open } = props;
    const [list, setList] = useState([]);

    useEffect(() => {
        let list = [];
        for (let index = 1; index < 89; index++) {
            list.push(`/img/icon/${index}.png`)
        }
        setList(list);
    }, [])

    return (
        <>
            {
                open ?
                    <Tabs className="emoji_container">
                        <TabList>
                            <Tab><img width="24" height="24" src="/img/icon/22.png" alt="title"/></Tab>
                        </TabList>
                        <TabPanel>
                            <div className="first_tab">
                            {
                                list.map(item =>
                                    <div className="emoji_item">
                                        <img src={item} alt="icon"/>
                                    </div>
                                )
                            }
                            </div>
                        </TabPanel>
                    </Tabs>
                    : <div></div>
            }
            
        </>
    );
}

export default Emoji;