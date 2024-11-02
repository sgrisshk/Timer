import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Timer from './TimerProps';

type TimerProps = {
    title: string;
    endTime: number;
    elapsedTime?: number;
    isRunning?: boolean;
    savedTimers?: Array<{
        id: number;
        title: string;
        minutes: number;
        seconds: number;
        audioFile: string;
        audioFileName: string;
        elapsedTime: number;
    }>;
};

export default {
    title: 'Components/Timer',
    component: Timer,
    argTypes: {
        title: { control: 'text' },
        endTime: { control: 'number' },
        elapsedTime: { control: 'number' },
        isRunning: { control: 'boolean' },
    },
} as ComponentMeta<typeof Timer>;

const Template: ComponentStory<typeof Timer> = (args: TimerProps) => <Timer {...args} />;

export const DefaultTimer = Template.bind({});
DefaultTimer.args = {
    title: 'My Timer',
    endTime: 300,
    elapsedTime: 0,
};

export const TimerWithSavedTimers = Template.bind({});
TimerWithSavedTimers.args = {
    title: 'Workout',
    endTime: 600,
    elapsedTime: 0,
    savedTimers: [
        { id: 1, title: 'Morning', minutes: 5, seconds: 0, audioFile: 'default-sound.mp3', audioFileName: 'Default', elapsedTime: 0 },
        { id: 2, title: 'Exercise', minutes: 10, seconds: 0, audioFile: 'default-sound.mp3', audioFileName: 'Default', elapsedTime: 0 },
    ],
};


export const TimerWithElapsedTime = Template.bind({});
TimerWithElapsedTime.args = {
    title: 'Break Timer',
    endTime: 900,
    elapsedTime: 0,
    savedTimers: [
        { id: 3, title: 'Focus', minutes: 15, seconds: 0, audioFile: 'default-sound.mp3', audioFileName: 'Default', elapsedTime: 260 },
    ],
};