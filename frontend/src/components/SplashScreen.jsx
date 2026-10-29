import React, { useEffect, useState } from 'react';

export const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [statusText, setStatusText] = useState('INITIALIZING INVEST IQ');

  useEffect(() => {
    const totalDuration = 3000; // exactly 3 seconds
    const intervalTime = 25; // update every 25ms for smooth 60fps-like progress
    const stepIncrement = (100 / (totalDuration / intervalTime));

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Dynamic micro-statuses across the 3 seconds
    const t1 = setTimeout(() => setStatusText('CONNECTING MARKET PROTOCOLS...'), 700);
    const t2 = setTimeout(() => setStatusText('ANALYZING ASSET VALUATIONS...'), 1600);
    const t3 = setTimeout(() => setStatusText('LAUNCHING DASHBOARD...'), 2400);

    // Trigger fade-out at 3000ms
    const completeTimer = setTimeout(() => {
      setIsFadingOut(true);
      // Wait for fade-out animation to finish before removing splash
      setTimeout(() => {
        onComplete();
      }, 600);
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isFadingOut ? 'splash-screen--fade' : ''}`}>
      {/* Ambient Radial Spotlight */}
      <div className="splash-ambient-glow" />

      <div className="splash-content">
        {/* Emblem from the reference image (circle with serif initials) */}
        <div className="splash-emblem-wrap">
          <div className="splash-emblem">
            <span className="splash-emblem-text">IQ</span>
          </div>
          <div className="splash-emblem-pulse" />
        </div>

        {/* Brand Title */}
        <div className="splash-brand">
          <h1 className="splash-title">
            Invest<span className="splash-title-accent">IQ</span>
          </h1>
          <p className="splash-tagline">
            Intelligent Capital <span className="splash-dot">•</span> Minimalist Architecture
          </p>
        </div>

        {/* Loading Bar Section */}
        <div className="splash-loader-container">
          <div className="splash-progress-track">
            <div
              className="splash-progress-fill"
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>

          <div className="splash-meta">
            <span className="splash-status">{statusText}</span>
            <span className="splash-percent">{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>

        {/* Editorial Subtitle inspired by the reference image */}
        <div className="splash-quote">
          <em>'Precision is the new wealth.'</em>
        </div>
      </div>
    </div>
  );
};

