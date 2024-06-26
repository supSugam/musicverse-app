const COLORS = {
  background: {
    dense: '#12091d',
    dark: '#1d0f2f',
    light: '#3f2164',
    transparent: (opacity = 0.5) => `rgba(0, 0, 0, ${opacity})`,
  },
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: '#525252',
    light: '#d4d4d4',
    normal: '#737373',
    dark: '#171717',
    dense: '#0a0a0a',
    semidark: '#1f1f1f',
  },
  primary: {
    light: '#7e22ce',
    dark: '#ff3d00',
    purple: '#b11fc8',
    violet: '#6b21a8',
  },
  transparent: 'rgba(0, 0, 0, 0)',
  // 600 and 900
  red: {
    light: '#dc2626',
    dark: '#7f1d1d',
  },
  purple: {
    light: '#9333ea',
    dark: '#581c87',
  },
  gradient: {
    primary: ['#b11fc8', '#5b21b6'],
  },
  green: {
    light: '#22c55e',
    dark: '#14532d',
  },
};

export default COLORS;
