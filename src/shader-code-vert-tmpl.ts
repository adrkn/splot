export default
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
