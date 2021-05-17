export default
`
attribute vec2 a_position;
attribute float a_color;
attribute float a_polygonsize;
uniform mat3 u_matrix;
varying vec3 v_color;
void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);
  gl_PointSize = a_polygonsize;
  {ADDITIONAL-CODE}
}
`
