import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useDate } from '../hooks/useDate';
import { Card, ProgressBar } from '../components/Card';
import './Pages.css';

export default function Steps() {

  const { user, refreshProfile } = useAuth();
  const { date } = useDate();

  const [total, setTotal] = useState(0);
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const stepGoal = user?.stepGoal || 10000;

  // LOAD STEP DATA
  const load = async () => {
    try {

      const res = await axios.get(
        `/api/steps/${date}`
      );

      setTotal(res.data.total);
      setLogs(res.data.logs);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

  // AUTO STEP COUNTER
  useEffect(() => {

    let lastMagnitude = 0;
    let cooldown = false;

    const handleMotion = async (event) => {

      const acc =
        event.accelerationIncludingGravity;

      if (!acc) return;
      console.log("motion detected");

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;

      const magnitude = Math.sqrt(
        x * x +
        y * y +
        z * z
      );

      const diff = Math.abs(
        magnitude - lastMagnitude
      );

      // STEP DETECTION
      if (diff > 6 && !cooldown) {

        cooldown = true;

        try {

          await axios.post(
            '/api/steps',
            {
              count: 1,
              date
            }
          );

          setTotal(prev => prev + 1);

          setLogs(prev => [
            ...prev,
            {
              count: 1,
              loggedAt: new Date()
            }
          ]);

        } catch (err) {
          console.log(err);
        }

        setTimeout(() => {
          cooldown = false;
        }, 400);
      }

      lastMagnitude = magnitude;
    };

    // MOBILE SENSOR SUPPORT
    if (
      typeof DeviceMotionEvent !==
      'undefined'
    ) {

      // iPhone support
      if (
        typeof DeviceMotionEvent
          .requestPermission === 'function'
      ) {

        DeviceMotionEvent
          .requestPermission()
          .then(permissionState => {

            if (
              permissionState === 'granted'
            ) {

              window.addEventListener(
                'devicemotion',
                handleMotion
              );
            }
          })
          .catch(console.error);

      } else {

        // Android
        window.addEventListener(
          'devicemotion',
          handleMotion
        );
      }
    }

    return () => {

      window.removeEventListener(
        'devicemotion',
        handleMotion
      );
    };

  }, [date]);

  // MANUAL STEP ADD
  const addSteps = async () => {

    if (
      !input ||
      parseInt(input) <= 0
    ) return;

    try {

      await axios.post(
        '/api/steps',
        {
          count: parseInt(input),
          date
        }
      );

      setInput('');
      load();

    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE GOAL
  const setGoal = async () => {

    if (!goalInput) return;

    try {

      await axios.put(
        '/api/profile',
        {
          ...user,
          stepGoal: parseInt(goalInput)
        }
      );

      setGoalInput('');
      refreshProfile();

    } catch (err) {
      console.log(err);
    }
  };

  const pct = Math.min(
    Math.round(
      (total / stepGoal) * 100
    ),
    100
  );

  return (

    <div className="page">

      <h1 className="page-title">
        Step Counter
      </h1>

      <Card>

        {/* STEP DISPLAY */}
        <div
          style={{
            textAlign: 'center',
            padding: '8px 0 16px'
          }}
        >

          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: 'var(--accent)'
            }}
          >
            {total.toLocaleString()}
          </div>

          <div
            style={{
              color: 'var(--muted)',
              fontSize: 14
            }}
          >
            Goal:
            {' '}
            {stepGoal.toLocaleString()}
            {' '}
            steps
          </div>

        </div>

        {/* PROGRESS */}
        <ProgressBar
          value={total}
          max={stepGoal}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--muted)',
            marginTop: 6
          }}
        >
          <span>0</span>
          <span>{pct}% of goal</span>
          <span>
            {stepGoal.toLocaleString()}
          </span>
        </div>

        {/* MANUAL ADD */}
        <div
          className="input-row"
          style={{ marginTop: 20 }}
        >

          <input
            className="form-input"
            type="number"
            placeholder="Add steps (e.g. 500)"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              addSteps()
            }
          />

          <button
            className="btn-accent"
            onClick={addSteps}
          >
            Add
          </button>

        </div>

        {/* GOAL */}
        <div className="input-row">

          <input
            className="form-input"
            type="number"
            placeholder="Set daily goal"
            value={goalInput}
            onChange={(e) =>
              setGoalInput(e.target.value)
            }
          />

          <button
            className="btn-outline"
            onClick={setGoal}
          >
            Set goal
          </button>

        </div>

        {/* TEST BUTTON */}
        <button
          className="btn-outline"
          style={{ marginTop: 8 }}
          onClick={() => {

            setInput('1000');

            setTimeout(
              addSteps,
              100
            );
          }}
        >
          ⌚ Simulate +1000 steps
        </button>

      </Card>

      {/* LOGS */}
      <Card>

        <h2 className="card-title">
          Today's log
        </h2>

        {
          logs.length === 0
            ? (
              <p className="empty-text">
                No steps logged yet
              </p>
            )
            : (
              logs
                .slice(-10)
                .reverse()
                .map((l, i) => (

                  <div
                    key={i}
                    className="log-row"
                  >

                    <span>
                      {
                        new Date(
                          l.loggedAt
                        ).toLocaleTimeString(
                          'en-IN',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )
                      }
                    </span>

                    <span
                      style={{
                        fontWeight: 600,
                        color: 'var(--accent)'
                      }}
                    >
                      +{
                        l.count.toLocaleString()
                      }
                      {' '}
                      steps
                    </span>

                  </div>
                ))
            )
        }

      </Card>

    </div>
  );
}