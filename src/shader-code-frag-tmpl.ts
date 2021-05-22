export default
`
precision lowp float;
varying vec3 v_color;
varying float v_shape;
void main() {
  if (v_shape == 0.0) {
    if (length(gl_PointCoord - 0.5) > 0.5) { discard; };
  } else if (v_shape == 1.0) {

  } else if (v_shape == 2.0) {
    if ( ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y < 0.3)) ||
      ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y < 0.3)) ||
      ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y > 0.7)) ||
      ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y > 0.7)) )
      { discard; };
  }
  gl_FragColor = vec4(v_color.rgb, 1.0);
}
`

/*

  &&
  (gl_PointCoord.y >   (0.86602540378 − 1.73205080756 * gl_PointCoord.x)   ) &&
    (gl_PointCoord.y > (1.73205080756 * gl_PointCoord.x - 0.86602540378))

*/

/**
 *
 *
 *   } else if (v_shape == 3.0) {
    if ( (gl_PointCoord.y > 0.86602540378) &&
      (gl_PointCoord.y > (0.86602540378 − (1.73205080756 * gl_PointCoord.x))) )
      { discard; };
  }

 * y = −1.73205080756x + 0.86602540378
 * y =  1.73205080756x − 0.86602540378
 *
 * (gl_PointCoord.y > (−1.73205080756 * gl_PointCoord.x + 0.86602540378))
 * (gl_PointCoord.y > (1.73205080756 * gl_PointCoord.x - 0.86602540378))
 *
 *
 *
export default
  `
precision lowp float;
varying vec3 v_color;
void main() {
  float vSize = 20.0;
  float distance = length(2.0 * gl_PointCoord - 1.0);
  if (distance > 1.0) { discard; }
  gl_FragColor = vec4(v_color.rgb, 1.0);

   vec4 uEdgeColor = vec4(0.5, 0.5, 0.5, 1.0);
 float uEdgeSize = 1.0;

float sEdge = smoothstep(
  vSize - uEdgeSize - 2.0,
  vSize - uEdgeSize,
  distance * (vSize + uEdgeSize)
);
gl_FragColor = (uEdgeColor * sEdge) + ((1.0 - sEdge) * gl_FragColor);

gl_FragColor.a = gl_FragColor.a * (1.0 - smoothstep(
    vSize - 2.0,
    vSize,
    distance * vSize
));

}
`
*/
