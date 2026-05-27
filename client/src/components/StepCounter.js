import React, { useEffect, useState } from "react";
import axios from "axios";

const StepCounter = () => {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let lastMagnitude = 0;
    let stepCount = 0;

    const handleMotion = async (event) => {
      const acc = event.accelerationIncludingGravity;

      if (!acc) return;

      const magnitude = Math.sqrt(
        acc.x * acc.x +
        acc.y * acc.y +
        acc.z * acc.z
      );

      const diff = Math.abs(magnitude - lastMagnitude);

      if (diff > 6) {
        stepCount++;
        setSteps(stepCount);

        const today = new Date().toISOString().split("T")[0];

        try {
          await axios.post(
            "http://localhost:5000/api/steps",
            {
              count: 1,
              date: today
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
        } catch (err) {
          console.log(err);
        }
      }

      lastMagnitude = magnitude;
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleMotion);
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  return (
    <div>
      <h2>Steps Today</h2>
      <h1>{steps}</h1>
    </div>
  );
};

export default StepCounter;