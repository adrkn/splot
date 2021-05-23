export const VERTEX_TEMPLATE =
`
attribute vec2 a_position;
attribute float a_color;
attribute float a_size;
attribute float a_shape;
uniform mat3 u_matrix;
varying vec3 v_color;
varying float v_shape;
void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);
  gl_PointSize = a_size;
  v_shape = a_shape;
  {COLOR-CODE}
}
`
export const FRAGMENT_TEMPLATE =
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
