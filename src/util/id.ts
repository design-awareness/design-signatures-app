export const randomID = () =>
  Math.random().toString(36).substr(2, 8) +
  Math.random().toString(36).substr(2, 8);