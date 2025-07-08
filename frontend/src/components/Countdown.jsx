import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export default function Countdown({ to }) {

    const [delta, setDelta] = useState('');
    useEffect(() => {
        const tick = () => { //Defines a function that calculates and updates the remaining time
            const diff = dayjs(to).diff(dayjs()); //Calculates the difference in milliseconds between to and current time.
            if (diff <= 0) return setDelta('Started');//if difference is <0 hence will display the contest is started
            const d = dayjs.duration(diff); //convert the diff into duration object
            setDelta(`${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`);
        };
        tick();
        const id = setInterval(tick, 1000);    //Re-run tick every 1 second to update the timer.
        return () => clearInterval(id);
    }, [to]);  // The effect re-runs only when the to prop changes.

    return <span>{delta}</span>;
};
