/* eslint-disable */
import * as React from 'react';

const useMountEffect = (fn: () => void) => {
  const mounted = React.useRef(false);

  return React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return fn && fn();
    }
  }, []);
};

export default useMountEffect;
