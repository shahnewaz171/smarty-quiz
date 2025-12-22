import { SvgIcon, type SvgIconProps } from '@mui/material';

const Logo = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="rgba(255, 255, 255, 0.95)" />
    <g transform="translate(4, 4)">
      <path
        d="M20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36C23.6968 36 27.0962 34.7428 29.8047 32.6276L34.5858 37.4086C35.3668 38.1897 36.6332 38.1897 37.4142 37.4086C38.1953 36.6276 38.1953 35.3612 37.4142 34.5802L32.6331 29.7991C34.7483 27.0906 36.0055 23.6912 36.0055 19.9945C36.0055 11.1579 28.8421 3.99446 20.0055 3.99446L20 4Z"
        fill="#1976d2"
      />
      <path
        d="M13 20L18 25L27 15"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </SvgIcon>
);

export default Logo;
