/* eslint-disable */
import * as React from 'react';

const useUnmountEffect = (fn: () => void) => React.useEffect(() => fn, []);

export default useUnmountEffect;
