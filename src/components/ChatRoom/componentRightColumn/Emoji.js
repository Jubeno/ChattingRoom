// import React, { useEffect, useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import { STORAGE } from '../../../utils/database';

// const Emoji = props => {
//     const { open } = props;
//     const [list, setList] = useState([]);
//     const firstTab = STORAGE.ref('/icons/emotions');

//     useEffect(() => {
//         // let list = [];
//         // for (let index = 1; index < 89; index++) {
//         //     list.push(`/img/icon/${index}.png`)
//         // }
//         // setList(list);
//         // async function getFirstTabEmoji() {
//         //     await firstTab
//         //     .listAll()
//         //     .then(response => {
//         //         console.log('%c response: ', 'color: red' , response);
//         //     })
            

//         // }
//         // getFirstTabEmoji();
//     }, [])

//     return (
//         <>
//             {
//                 open ?
//                     // <Tabs className="emoji_container">
//                     //     <TabList>
//                     //         <Tab><img width="24" height="24" src="/img/icon/22.png" alt="title"/></Tab>
//                     //     </TabList>
//                     //     <TabPanel>
//                     //         <div className="first_tab">
//                     //         {
//                     //             list.map(item =>
//                     //                 <div className="emoji_item">
//                     //                     <img src={item} alt="icon"/>
//                     //                 </div>
//                     //             )
//                     //         }
//                     //         </div>
//                     //     </TabPanel>
//                     // </Tabs>
//                     : <div></div>
//             }
            
//         </>
//     );
// }

// export default Emoji;