import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// =======================================================
// Screen 1: Problem Statement with Typing Animation
// =======================================================
const Screen1 = ({ onNext, onAudioUnlock, onProblemSelected }) => {
  const [fullText, setFullText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isRandomizing, setIsRandomizing] = useState(true);
  const [problemCategory, setProblemCategory] = useState('');
  const randomizeAudioRef = useRef(null);
  const revealAudioRef = useRef(null);
  const problemRandomizerInterval = useRef(null);

  useEffect(() => {
    const problemStatements = [
      { statement: 'Develop a scalable solution to address a gap in the sustainable fashion market.', category: 'Innovation & Entrepreneurship' },
      { statement: 'Create an AI-powered platform to personalize learning experiences for students.', category: 'Sustainable Technology' },
      { statement: 'Design a modular and affordable vertical farming system for urban environments.', category: 'Sustainable Technology' },
      { statement: 'Build a decentralized marketplace for digital assets with a focus on security.', category: 'Innovation & Entrepreneurship' },
      { statement: 'Design a gamified mobile app to promote mental health awareness in teenagers.', category: 'Health & Wellness' },
      { statement: 'Build a personalized fitness tracker that uses AI to adjust workout plans in real-time.', category: 'Health & Wellness' },
      { statement: 'Create a platform to connect volunteers with local community projects based on skills and availability.', category: 'Social Impact' },
      { statement: 'Develop a peer-to-peer lending app to empower entrepreneurs in developing countries.', category: 'Social Impact' }
    ];

    let counter = 0;
    const interval = setInterval(() => {
      setDisplayedText(
        'Processing... ' + Array.from({ length: 20 }, () => 
          String.fromCharCode(33 + Math.floor(Math.random() * 94))
        ).join('')
      );
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        setIsRandomizing(false);
        const selectedProblem = problemStatements[Math.floor(Math.random() * problemStatements.length)];
        setFullText(selectedProblem.statement);
        setProblemCategory(selectedProblem.category);
        onProblemSelected(selectedProblem);
        revealAudioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      }
    }, 50);
    problemRandomizerInterval.current = interval;

    return () => clearInterval(problemRandomizerInterval.current);
  }, [onProblemSelected]);

  useEffect(() => {
    if (!isRandomizing && isTyping) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
        if (displayedText.length === fullText.length) {
          setIsTyping(false);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayedText, isTyping, isRandomizing, fullText]);

  const handleNextClick = () => {
    onAudioUnlock();
    randomizeAudioRef.current.play().catch(e => console.log("Audio play prevented:", e));
    onNext();
  };

  return (
    <div className={`screen fade-in ${isRandomizing ? 'screen-shake' : ''}`}>
      <div className="card-content">
        <h1 className="screen-title">Accessing Secure Archives...</h1>
        <p className="problem-statement">
          <span className="problem-label">Decrypting The Challenge:</span> <span className={`typing-text ${isRandomizing ? 'glitch-text' : ''}`}>{displayedText}</span>
          <span className={`typing-cursor ${isTyping && !isRandomizing ? 'blink' : ''}`}>|</span>
        </p>
        <p className="category">
          **Category:** {problemCategory}
        </p>
        <button className="cta-button pulse" onClick={handleNextClick} disabled={isTyping || isRandomizing}>
          Decrypt Challenge <span role="img" aria-label="lock">🔒</span>
        </button>
      </div>
      <div className="bg-elements">
        <div className="bg-element chart-bar bar-1"></div>
        <div className="bg-element chart-bar bar-2"></div>
        <div className="bg-element chart-bar bar-3"></div>
        <div className="bg-element connection-line line-a"></div>
        <div className="bg-element data-point point-a"></div>
        <div className="bg-element data-stream"></div>
        <div className="bg-element network-graph"></div>
      </div>
      <audio ref={randomizeAudioRef} src="/shuffle.mp3" preload="auto" volume="0.4" />
      <audio ref={revealAudioRef} src="/reveal.mp3" preload="auto" volume="0.5" />
    </div>
  );
};

// =======================================================
// Screen 2: Solo or Duo Selection
// =======================================================
const Screen2 = ({ onSelectMode }) => (
  <div className="screen fade-in">
    <div className="card-content">
      <h1 className="screen-title">Assemble Your Team</h1>
      <p className="mode-selection-text">Are you pitching solo or with a team?</p>
      <div className="button-group">
        <button className="mode-button shine" onClick={() => onSelectMode('solo')}>
          Solo Founder (1:30) <span role="img" aria-label="person">👤</span>
        </button>
        <button className="mode-button shine" onClick={() => onSelectMode('duo')}>
          Founding Team (2:00) <span role="img" aria-label="people">👥</span>
        </button>
      </div>
    </div>
    <div className="bg-elements">
        <div className="bg-element chart-bar bar-4"></div>
        <div className="bg-element connection-line line-b"></div>
        <div className="bg-element data-point point-b"></div>
        <div className="bg-element data-stream"></div>
        <div className="bg-element network-graph"></div>
    </div>
  </div>
);

// =======================================================
// Screen 3: Main Competition Timer
// =======================================================
const Screen3 = ({ timeRemaining, isDuo, problemDetails, controls }) => {
  const { isRunning, onPlay, onPause, onReset } = controls;
  
  const totalTime = isDuo ? 120 : 90;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeRemaining / totalTime) * circumference;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerTextColorClass = timeRemaining <= 10 ? 'danger-text-blink' : '';
  const cardBorderClass = timeRemaining <= 10 && timeRemaining > 0 ? 'countdown-border' : '';
  
  const sandFillHeight = 100 - (timeRemaining / totalTime) * 100;
  const sandFlowClass = isRunning ? '' : 'timer-paused';

  return (
    <div className="screen timer-screen fade-in">
      <div className={`card-content timer-card ${cardBorderClass}`}>
        <h2 className="screen-title">Go-to-Market Strategy</h2>
        <div className="timer-info-container">
          <div className="circular-progress">
            <svg className="progress-ring" width="200" height="200">
              <circle
                className="progress-ring-bg"
                strokeWidth="10"
                fill="transparent"
                r={radius}
                cx="100"
                cy="100"
              />
              <circle
                className="progress-ring-fg"
                strokeWidth="10"
                fill="transparent"
                r={radius}
                cx="100"
                cy="100"
                style={{ strokeDasharray: circumference, strokeDashoffset }}
              />
            </svg>
            <div className={`timer-text-overlay ${timerTextColorClass}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="sand-count-container">
              <div className="sand-fill" style={{ height: `${sandFillHeight}%` }}></div>
              {timeRemaining > 0 && <div className={`sand-flow ${sandFlowClass}`}></div>}
          </div>
        </div>
        <div className="problem-info">
          <h3>{problemDetails.category}</h3>
          <p>{problemDetails.statement}</p>
        </div>
        <div className="controls">
          <button onClick={onPlay} disabled={isRunning} className="control-button">Run Model ▶️</button>
          <button onClick={onPause} disabled={!isRunning} className="control-button">Pause Flow ⏸️</button>
          <button onClick={onReset} className="control-button">Reset Plan 🔄</button>
        </div>
      </div>
      <div className="bg-elements">
        <div className="bg-element chart-bar bar-5"></div>
        <div className="bg-element connection-line line-c"></div>
        <div className="bg-element data-point point-c"></div>
        <div className="bg-element chart-bar bar-6"></div>
        <div className="bg-element data-stream"></div>
        <div className="bg-element network-graph"></div>
      </div>
    </div>
  );
};

// =======================================================
// Screen 4: Time's Up
// =======================================================
const PitchFinalizedScreen = () => {
  const lockAudioRef = useRef(null);

  useEffect(() => {
    if (lockAudioRef.current) {
      lockAudioRef.current.play().catch(e => console.log("Audio play prevented:", e));
    }
  }, []);

  return (
    <div className="screen time-up-screen fade-in times-up-effect">
      <div className="shutter-overlay shutter-top"></div>
      <div className="shutter-overlay shutter-bottom"></div>
      <div className="card-content">
        <h1 className="screen-title alert-blink">Pitch Deadline Reached 🚨</h1>
        <p>Your time for presentation has concluded. It's time to Finalize Pitch.</p>
        <button className="cta-button pulse" onClick={() => window.location.reload()}>
          Finalize Pitch
        </button>
      </div>
      <div className="bg-elements static-bg">
        <div className="bg-element chart-bar bar-7"></div>
        <div className="bg-element connection-line line-d"></div>
        <div className="bg-element data-point point-d"></div>
        <div className="bg-element data-stream"></div>
        <div className="bg-element network-graph"></div>
      </div>
      <audio ref={lockAudioRef} src="/start.mp3" preload="auto" volume="0.8" />
    </div>
  );
};

// =======================================================
// Main App Component
// =======================================================
function CompetitionApp() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isDuo, setIsDuo] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [problemDetails, setProblemDetails] = useState({ statement: '', category: '' });
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const [playStartAudio, setPlayStartAudio] = useState(false);

  // Audio Refs
  const startAudioRef = useRef(null);
  const sixtySecondAudioRef = useRef(null);
  const thirtySecondAudioRef = useRef(null);
  const finalCountdownAudioRef = useRef(null);
  const timesUpAudioRef = useRef(null);
  
  // State to track if audio cues have been played
  const audioStateRef = useRef({
    startPlayed: false,
    sixtySecondPlayed: false,
    thirtySecondPlayed: false,
    finalCountdownPlayed: false,
    timesUpPlayed: false
  });
  
  const audioUnlocked = useRef(false);

  const unlockAudioContext = () => {
    if (audioUnlocked.current) return;
    try {
      const audio = new Audio();
      audio.src = 'data:audio/mpeg;base64,TVNnAAAA...';
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audioUnlocked.current = true;
        console.log("Audio context unlocked.");
      }).catch(e => console.error("Audio unlock failed:", e));
    } catch (e) {
      console.error("Audio context unlock attempt failed:", e);
    }
  };

  useEffect(() => {
    let interval = null;
    const initialTotalTime = isDuo ? 120 : 90;
    
    if (timerRunning) {
      const initialElapsedTime = pausedTimeRef.current;
      startTimeRef.current = Date.now() - initialElapsedTime;
      
      interval = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        const newTimeRemaining = initialTotalTime - Math.floor(elapsedTime / 1000);
        
        if (newTimeRemaining === 60 && !audioStateRef.current.sixtySecondPlayed) {
          sixtySecondAudioRef.current.play();
          audioStateRef.current.sixtySecondPlayed = true;
        }
        if (newTimeRemaining === 30 && !audioStateRef.current.thirtySecondPlayed) {
          thirtySecondAudioRef.current.play();
          audioStateRef.current.thirtySecondPlayed = true;
        }
        if (newTimeRemaining <= 10 && !audioStateRef.current.finalCountdownPlayed) {
          finalCountdownAudioRef.current.play();
          audioStateRef.current.finalCountdownPlayed = true;
        }

        if (newTimeRemaining <= 0) {
          setTimeRemaining(0);
          setTimerRunning(false);
          setCurrentScreen(4);
          if (!audioStateRef.current.timesUpPlayed) {
            timesUpAudioRef.current.play();
            audioStateRef.current.timesUpPlayed = true;
          }
        } else {
          setTimeRemaining(newTimeRemaining);
        }
      }, 100);
    } else if (!timerRunning) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [timerRunning, isDuo]);

  const handleSelectMode = (mode) => {
    const initialTime = mode === 'solo' ? 90 : 120;
    setIsDuo(mode === 'duo');
    setTimeRemaining(initialTime);
    setCurrentScreen(3);
  };

  const onPlayTimer = () => {
    setTimerRunning(true);
    setPlayStartAudio(true);
  };
  
  const onPauseTimer = () => {
    setTimerRunning(false);
    const initialTotalTime = isDuo ? 120 : 90;
    const elapsedTime = Date.now() - startTimeRef.current;
    pausedTimeRef.current = elapsedTime;
    setTimeRemaining(initialTotalTime - Math.floor(elapsedTime / 1000));
  };

  const controls = {
    isRunning: timerRunning,
    onPlay: onPlayTimer,
    onPause: onPauseTimer,
    onReset: () => {
      setTimerRunning(false);
      const resetTime = isDuo ? 120 : 90;
      setTimeRemaining(resetTime);
      setCurrentScreen(2);
      pausedTimeRef.current = 0;
      audioStateRef.current = {
        startPlayed: false,
        sixtySecondPlayed: false,
        thirtySecondPlayed: false,
        finalCountdownPlayed: false,
        timesUpPlayed: false
      };
      setPlayStartAudio(false);
    },
  };

  useEffect(() => {
    if (playStartAudio && startAudioRef.current && !audioStateRef.current.startPlayed) {
      startAudioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      audioStateRef.current.startPlayed = true;
      setPlayStartAudio(false);
    }
  }, [playStartAudio]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <Screen1 onNext={() => setCurrentScreen(2)} onAudioUnlock={unlockAudioContext} onProblemSelected={setProblemDetails} />;
      case 2:
        return <Screen2 onSelectMode={handleSelectMode} />;
      case 3:
        return (
          <Screen3
            timeRemaining={timeRemaining}
            isDuo={isDuo}
            problemDetails={problemDetails}
            controls={controls}
          />
        );
      case 4:
        return <PitchFinalizedScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
      <audio ref={startAudioRef} src="/start.mp3" preload="auto" volume="0.5" />
      <audio ref={sixtySecondAudioRef} src="/start.mp3" preload="auto" volume="0.3" />
      <audio ref={thirtySecondAudioRef} src="/start.mp3" preload="auto" volume="0.3" />
      <audio ref={finalCountdownAudioRef} src="/chime.mp3" preload="auto" volume="0.2" />
      <audio ref={timesUpAudioRef} src="/start.mp3" preload="auto" volume="0.5" />
      <div className="background-grid"></div>
    </div>
  );
}

export default CompetitionApp;
