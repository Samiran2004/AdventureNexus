import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NumberCounter = ({
  targetNumber,
  duration = 2.5,
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated.current) return;

    let obj = { val: 0 };

    ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      onEnter: () => {
        if (!hasAnimated.current) {
          hasAnimated.current = true;

          gsap.to(obj, {
            val: targetNumber,
            duration: duration,
            ease: "power2.out",
            onUpdate: function() {
              setCount(Math.round(obj.val));
            }
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [targetNumber, duration]);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <span ref={elementRef} className={className}>
      {formatNumber(count)}{suffix}
    </span>
  );
};

export default NumberCounter;
