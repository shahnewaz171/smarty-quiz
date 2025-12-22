import { useEffect } from 'react';

interface UseClickOutsideProps {
  ref: React.RefObject<HTMLElement>;
  callback: () => void;
}

const useClickOutside = ({ ref, callback }: UseClickOutsideProps) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
