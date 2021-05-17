export default
`
attribute vec2 a_position;
attribute float a_color;
uniform mat3 u_matrix;
varying vec3 v_color;
void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0.0, 1.0);
  gl_PointSize = 20.0;
  {ADDITIONAL-CODE}
}
`
