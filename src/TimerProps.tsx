import React, { useState, useEffect } from 'react';

interface TimerProps {
  title: string;
  endTime: number;
  elapsedTime?: number;
}

const Timer: React.FC<TimerProps> = ({ title, endTime, elapsedTime = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(endTime - elapsedTime);
  const [timeCounter, setTimeCounter] = useState(elapsedTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(endTime / 60));
  const [seconds, setSeconds] = useState(endTime % 60);
  const [initialElapsedTime, setInitialElapsedTime] = useState(elapsedTime);

  useEffect(() => {
    if (endTime > 3599) {
      throw new Error('endTime exceeds maximum value of 59:59');
    }

    let timeLeftInterval: ReturnType<typeof setInterval> | null = null;
    let timeCounterInterval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      if (timeLeft > 0) {
        timeLeftInterval = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else {
        setIsEnded(true);
        setIsRunning(false);
      }

      if (timeCounter < endTime) {
        timeCounterInterval = setInterval(() => {
          setTimeCounter((prev) => prev + 1);
        }, 1000);
      } else {
        setIsEnded(true);
        setIsRunning(false);
      }
    }

    return () => {
      if (timeLeftInterval) clearInterval(timeLeftInterval);
      if (timeCounterInterval) clearInterval(timeCounterInterval);
    };
  }, [isRunning, timeLeft, timeCounter, endTime]);

  
  useEffect(() => {
    setTimeLeft(endTime - elapsedTime);
    setTimeCounter(elapsedTime);
  }, [elapsedTime, endTime]);

  const startTimer = () => {
    setIsRunning(true);
    setIsEnded(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(endTime);
    setTimeCounter(0);
    setIsRunning(false);
    setIsEnded(false);
  };

  const handleSaveSettings = () => {
    const newEndTime = minutes * 60 + seconds;
    if (initialElapsedTime > newEndTime) {
      alert('Elapsed time cannot exceed end time');
      return;
    }
    setTimeLeft(newEndTime - initialElapsedTime);
    setTimeCounter(initialElapsedTime);
    setIsRunning(false);
    setIsEnded(false);
    setShowSettings(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };


  const radius = 95;
  const circumference = 2 * Math.PI * radius;


  const progress = (timeCounter / endTime) * circumference;

  return (
      <div style={styles.container}>
        <button style={styles.settingsButton} onClick={() => setShowSettings(true)}>⚙️</button>

        {showSettings && (
            <div style={styles.modal}>
              <div style={styles.modalContent}>
                <h3>Set Timer</h3>
                <label>
                  Minutes:
                  <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                  />
                </label>
                <label>
                  Seconds:
                  <input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(Number(e.target.value))}
                  />
                </label>
                <label>
                  Elapsed Time:
                  <input
                      type="number"
                      min="0"
                      max={minutes * 60 + seconds}
                      value={initialElapsedTime}
                      onChange={(e) => setInitialElapsedTime(Number(e.target.value))}
                  />
                </label>
                <button onClick={handleSaveSettings}>Save</button>
                <button onClick={() => setShowSettings(false)}>Cancel</button>
              </div>
            </div>
        )}

        <div style={styles.circleContainer}>
          <svg width="200" height="200">
            {/* Фон круга */}
            <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#545576"
                strokeWidth="10"
            />

            <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#67cb88"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Текст поверх кругов */}
          <div style={styles.text}>
            <h2>{title}</h2>
            <p style={styles.timer}>{formatTime(timeCounter)}</p>
            <p style={styles.subtext}>{formatTime(timeLeft)} left</p>
          </div>
        </div>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={startTimer}>Start</button>
          <button style={styles.button} onClick={pauseTimer}>Pause</button>
          <button style={styles.button} onClick={resetTimer}>Reset</button>
        </div>
      </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    backgroundColor: '#26273d',
    borderRadius: '25px',
    padding: '20px',
    fontFamily: '"Open Sans", sans-serif',
    color: '#a2a4cb',
    position: 'relative' as 'relative',
  },
  settingsButton: {
    position: 'absolute' as 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#a2a4cb',
    zIndex: 2,
  },
  circleContainer: {
    position: 'relative' as 'relative',
    width: '200px',
    height: '200px',
    zIndex: 0,
  },
  text: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as 'center',
    color: '#ffffff',
    zIndex: 1,
  },
  timer: {
    fontSize: '36px',
    color: '#ffffff',
  },
  subtext: {
    color: '#a2a4cb',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around' as 'space-around',
    marginTop: '20px',
  },
  button: {
    backgroundColor: 'transparent',
    border: '2px solid #606170',
    color: '#a2a4cb',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed' as 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  modalContent: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '10px',
  },
};

export default Timer;
