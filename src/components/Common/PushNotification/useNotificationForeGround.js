import { messaging } from '../../../firebase';
import { useEffect, useState } from 'react';

export function useNotificationForeGround() {
    const [receivedData, setReceivedData] = useState({});
    useEffect(() => {
        messaging.onMessage((payload) => {
            setReceivedData(payload);
        });
    }, []);
    return receivedData;
}
