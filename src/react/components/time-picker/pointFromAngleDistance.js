export default (x, y, angle, distance) => ({
  x: distance * Math.cos(angle) + x,
  y: distance * Math.sin(angle) + y
})