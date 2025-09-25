// src/hooks/usePrevious.jsx
import { useRef, useEffect } from 'react';

// This custom hook stores and returns the value of a variable from the previous render
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  return ref.current;
}