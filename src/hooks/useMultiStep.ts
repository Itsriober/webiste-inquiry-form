import { useState } from 'react';

export function useMultiStep(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const next = () => {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  };

  const back = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  return { currentStep, direction, next, back, isFirst, isLast };
}
