import React from 'react';
import ReactDOM from 'react-dom/client';
import Timer from "./TimerProps";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Timer
            title={"my timer"}
            endTime={33}
            elapsedTime={13}
            savedTimers={[
                { id: 3, title: 'Read', minutes: 15, seconds: 0, audioFile: 'default-sound.mp3', audioFileName: 'Default', elapsedTime: 260 }
            ]}
        />
    </React.StrictMode>
);