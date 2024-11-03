import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';
import { ReactComponent as SettingsIcon } from './icons/settings.svg';
import { ReactComponent as VolumeIcon } from './icons/sound-on.svg';
import { ReactComponent as MuteIcon } from './icons/sound-off.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as DeleteIcon } from './icons/delete.svg';
import defaultSound from './assets/default-sound.mp3';


interface TimerProps {
  title: string; //The initial title of the timer, displayed as the name of the current timer.
  endTime: number; //Specifies the duration (in seconds) for the timer. It sets the time limit for counting down.
  elapsedTime?: number; //The amount of time that has already passed in the timer, allowing the timer to start from a partially elapsed state
  savedTimers?: Array<{ //An array of previously saved timers. Each saved timer object includes details such as
                         //the timer ID, title, minutes, seconds, audio file, audio file name, and elapsed time.
                         //This array is displayed in the "Saved Timers" list.
    id: number;
    title: string;
    minutes: number;
    seconds: number;
    audioFile: string;
    audioFileName: string;
    elapsedTime: number;
  }>;
  onSaveTimer?: (timer: SavedTimer) => void; //A callback function that, when provided, will be called whenever a new timer is saved.
                                            //It passes the newly saved timer object as an argument. If onSaveTimer is not provided,
                                            //saved timers are stored in the component’s local state.
}

interface SavedTimer {
  id: number;
  title: string;
  minutes: number;
  seconds: number;
  audioFile: string;
  audioFileName: string;
  elapsedTime: number;
}

const Timer: React.FC<TimerProps> = ({ title: initialTitle, endTime, elapsedTime = 0, savedTimers = [], onSaveTimer }) => {
  const [title, setTitle] = useState(initialTitle);
  const [timeLeft, setTimeLeft] = useState(endTime - elapsedTime);
  const [timeCounter, setTimeCounter] = useState(elapsedTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(endTime / 60));
  const [seconds, setSeconds] = useState(endTime % 60);
  const [initialElapsedTime, setInitialElapsedTime] = useState(elapsedTime);
  const [updatedTitle, setUpdatedTitle] = useState(initialTitle);
  const [audioFile, setAudioFile] = useState(defaultSound);
  const [audioFileName, setAudioFileName] = useState("Default");
  const [isMuted, setIsMuted] = useState(false);
  const [userEndTime, setUserEndTime] = useState(endTime);
  const [userElapsedTime, setUserElapsedTime] = useState(elapsedTime);
  const audioRef = useRef<HTMLAudioElement>(new Audio(audioFile));
  const [savedTimersState, setSavedTimersState] = useState<SavedTimer[]>(savedTimers);

  useEffect(() => {
    audioRef.current.src = audioFile;
    audioRef.current.load();
  }, [audioFile]);

  useEffect(() => {
    if (endTime > 3599) {
      throw new Error('endTime exceeds maximum value of 59:59');
    }

    let timeLeftInterval: ReturnType<typeof setInterval> | null = null;
    let timeCounterInterval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      if (timeLeft > 0) {
        timeLeftInterval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      } else if (!isEnded) {
        setIsEnded(true);
        if (!isMuted) audioRef.current.play();
      }

      if (timeCounter < userEndTime) {
        timeCounterInterval = setInterval(() => setTimeCounter((prev) => prev + 1), 1000);
      } else {
        setIsEnded(true);
      }
    }

    return () => {
      if (timeLeftInterval) clearInterval(timeLeftInterval);
      if (timeCounterInterval) clearInterval(timeCounterInterval);
    };
  }, [isRunning, timeLeft, timeCounter, userEndTime, isEnded, isMuted, endTime]);

  const startTimer = () => {
    setIsRunning(true);
    setIsEnded(false);
    if (!isPaused) {
      setIsPaused(false);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setTimeLeft(userEndTime - userElapsedTime);
    setTimeCounter(userElapsedTime);
    setIsRunning(false);
    setIsEnded(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleSaveSettings = () => {
    const newEndTime = minutes * 60 + seconds;
    if (initialElapsedTime > newEndTime) {
      alert('Elapsed time cannot exceed end time');
      return;
    }
    setUserEndTime(newEndTime);
    setUserElapsedTime(initialElapsedTime);
    setTimeLeft(newEndTime - initialElapsedTime);
    setTimeCounter(initialElapsedTime);
    setIsRunning(false);
    setIsEnded(false);
    setShowSettings(false);
    setTitle(updatedTitle);
  };

  const handleMinutesChange = (value: string) => {
    const min = Math.min(Number(value), 59);
    setMinutes(min);
  };

  const handleSecondsChange = (value: string) => {
    const sec = Math.min(Number(value), 59);
    setSeconds(sec);
  };

  const handleElapsedTimeChange = (value: string) => {
    const maxElapsedTime = minutes * 60 + seconds;
    const elapsed = Math.min(Number(value), maxElapsedTime);
    setInitialElapsedTime(elapsed);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(URL.createObjectURL(file));
      setAudioFileName(file.name.replace(".mp3", "").slice(0, 7) + "...");
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    audioRef.current.muted = !isMuted;
  };
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  const saveCurrentTimer = () => {
    const newTimer: SavedTimer = {
      id: Date.now(),
      title,
      minutes,
      seconds,
      audioFile,
      audioFileName: audioFileName === "Default" ? "Audio" : audioFileName,
      elapsedTime: timeCounter,
    };
    if (onSaveTimer) {
      onSaveTimer(newTimer);
    } else {
      setSavedTimersState((prev) => [...prev, newTimer]);
    }
  };

  const deleteTimer = (id: number) => {
    setSavedTimersState((prev) => prev.filter((timer) => timer.id !== id));
  };


  const loadSavedTimer = (timer: SavedTimer) => {
    setTitle(timer.title);
    setMinutes(timer.minutes);
    setSeconds(timer.seconds);
    setAudioFile(timer.audioFile);
    setAudioFileName(timer.audioFileName);
    setUserEndTime(timer.minutes * 60 + timer.seconds);
    setTimeLeft(timer.minutes * 60 + timer.seconds);
    setTimeCounter(timer.elapsedTime);
    setIsRunning(false);
    setIsEnded(false);
  };

  const [isPaused, setIsPaused] = useState(false);
  const startButtonText = isPaused ? "Continue" : "Start";

  const radius = 115;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeCounter / userEndTime) * circumference;
  const adjustedProgress = timeCounter >= userEndTime ? 0 : circumference - progress;

  return (
      <div className="app-outer-wrapper">
        <div className="header-bar">
          <span className="header-title">TimeTrack</span>
            <span className="header-slogan">Go with the Flow, Stay on Schedule</span>
        </div>

      <div className="app-container">
        <div className="timer-container">
        <button className="settings-button" onClick={() => setShowSettings(true)}>
            <SettingsIcon className="settings-icon"/>
          </button>
          <button className="mute-button" onClick={toggleMute}>
            {isMuted ? <MuteIcon className="mute-icon"/> : <VolumeIcon className="volume-icon"/>}
          </button>

          {showSettings && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Set Timer</h3>
                  <label>
                    Title:
                    <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        placeholder="Enter timer title"
                    />
                  </label>
                  <label>
                    Minutes:
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes || ""}
                        onChange={(e) => handleMinutesChange(e.target.value)}
                        placeholder="Choose minutes"
                    />
                  </label>
                  <label>
                    Seconds:
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={seconds || ""}
                        onChange={(e) => handleSecondsChange(e.target.value)}
                        placeholder="Choose seconds"
                    />
                  </label>
                  <label>
                    Elapsed Time:
                    <input
                        type="number"
                        min="0"
                        max={minutes * 60 + seconds}
                        value={initialElapsedTime || ""}
                        onChange={(e) => handleElapsedTimeChange(e.target.value)}
                        placeholder="Choose elapsed time"
                    />
                  </label>
                  <label>
                    Audio File:
                    <input type="file" accept="audio/*" onChange={handleAudioUpload}/>
                  </label>
                  <button onClick={handleSaveSettings}>Save</button>
                  <button onClick={() => setShowSettings(false)}>Cancel</button>
                </div>
              </div>
          )}

          <div className="circle-container">
            <svg width="240" height="240">
              <circle cx="120" cy="120" r={radius} fill="transparent" stroke="#545576" strokeWidth="10"/>
              <circle
                  cx="120" cy="120" r={radius} fill="transparent"
                  stroke="#67cb88" strokeWidth="10" strokeDasharray={circumference}
                  strokeDashoffset={adjustedProgress} strokeLinecap="round" transform="rotate(-90 120 120)"
                  style={{transition: 'stroke-dashoffset 0.5s ease'}}
              />
            </svg>
            <div className="text">
              <h2 className="textTitle">{title}</h2>
              <p className="timer">{formatTime(timeCounter)}</p>
              <p className="subtext">{formatTime(timeLeft)} left</p>
            </div>
          </div>

          <div className="buttons">
            <button className="button" onClick={startTimer}>{startButtonText}</button>
            <button className="button" onClick={pauseTimer}>Pause</button>
            <button className="button" onClick={resetTimer}>Reset</button>
          </div>
        </div>

        <div className="saved-timers-panel">
          <div className="saved-timers-panel-header">
            <h3>Saved Timers</h3>
            <button className="add-timer-button" onClick={saveCurrentTimer}>
              <PlusIcon className="plus-icon"/>
            </button>
          </div>
          <ul className="saved-timers-list">
            {savedTimersState.map((timer) => (
                <li className="saved-timer-item" key={timer.id} onClick={() => loadSavedTimer(timer)}>
                  <span>{timer.title}</span>
                  <span>{formatTime(timer.minutes * 60 + timer.seconds)}</span>
                  <span>{timer.audioFileName}</span>
                  <DeleteIcon className="delete-icon" onClick={() => deleteTimer(timer.id)} />
                </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
  );
};

export default Timer;