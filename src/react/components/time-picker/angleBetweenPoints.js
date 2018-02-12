export default (cx, cy, p1x, p1y, p2x, p2y) => {
  const v1x = p1x - cx;
  const v1y = p1y - cy;
  const v2x = p2x - cx;
  const v2y = p2y - cy;

  return Math.atan2( (v2x * v1y) - (v1x * v2y), (v1x * v2x) + (v1y * v2y) );
}