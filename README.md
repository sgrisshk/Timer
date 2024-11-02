# Timer Application

A powerful and customizable timer application built with React and Storybook, allowing users to set, save, load, and manage multiple timers with custom alerts and settings.

## Overview
The Timer Application allows users to set a countdown timer, play custom audio alerts, save multiple timers, and manage them through a simple interface. Built using React and TypeScript, this project serves as a learning example for handling state, props, and event-based programming in React.

## Features
- **Start, Pause, and Reset Timer**: Basic timer functionality to control the countdown.
- **Customizable Settings**: Set timer title, duration (minutes and seconds), and elapsed time.
- **Audio Alerts**: Upload custom audio files to play when the timer ends.
- **Mute/Unmute Option**: Control sound output directly within the timer.
- **Save and Load Multiple Timers**: Save timers with different configurations and load them as needed.
- **Delete Saved Timers**: Remove unwanted timers from the saved list.
- **Storybook Integration**: View and interact with UI components in isolation for development and testing.

## Installation
To get started, ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/timer-app.git
   cd timer-app

2. Install the dependencies:
   ```
   npm install
   ```
 
4.	Start the application in development mode:
    ```
    npm start
    ```
   

5.	Open http://localhost:3000 in your browser to see the app in action.

## Usage

**Starting the Timer**

		Start: Click the “Start” button to begin the countdown.
		Pause: Click “Pause” to temporarily stop the timer.
		Reset: Click “Reset” to set the timer back to the original time.

**Saving and Loading Timers**

	1.	Set the timer with desired title, duration, and other settings.
	2.	Click the “+” (plus) icon to save the current timer.
	3.	View saved timers in the “Saved Timers” panel.
	4.	To load a saved timer, click on the timer in the saved list.
	5.	To delete a timer, click the trash (delete) icon next to the saved timer.

## Component Documentation

**Timer Component** *(TimerProps.tsx)*

The Timer component is the main functional part of the application, handling all timer-related logic, including saving, loading, and deleting timers.

Props:

	•	title (string): The title of the timer.
	•	endTime (number): The total time (in seconds) for the countdown.
	•	elapsedTime (optional, number): The initial elapsed time (in seconds) when the timer starts.
	•	savedTimers (optional, array): Array of saved timer configurations.
	•	onSaveTimer (optional, function): Function to handle saving a timer externally.

**SavedTimer Type**

Defines the structure for saved timers in the application:

	•	id (number): Unique identifier for the timer.
	•	title (string): Title of the saved timer.
	•	minutes (number): Minutes set for the timer.
	•	seconds (number): Seconds set for the timer.
	•	audioFile (string): access to a local audiofile.
	•	audioFileName (string): Display name of the audio file.
	•	elapsedTime (number): The elapsed time in seconds.

## Storybook

This project uses Storybook for isolated component development.

**Running Storybook**

To view the components in Storybook:
```
npm run storybook
```

This will launch Storybook at http://localhost:6006, where you can interact with the Timer component in various states.

*Storybook Stories*

	•	Default Timer: Shows a simple timer with default settings.
	•	Timer with Saved Timers: A timer with a list of pre-configured saved timers.
	•	Timer with Delete Option: Demonstrates loading and deleting saved timers.

## Available Scripts
```
npm start
```
Runs the app in the development mode on http://localhost:3000.
```
npm run build
```
Builds the app for production in the build folder.
```
npm run storybook
```
Runs Storybook for the application, allowing for component testing and development.
```
npm run build-storybook
```
Builds Storybook for deployment.

