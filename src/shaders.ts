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
  {COLOR-SELECTION}
}
`

export const FRAGMENT_TEMPLATE =
`
precision highp float;
varying vec3 v_color;
varying float v_shape;
{SHAPES-FUNCTIONS}
void main() {
  {SHAPE-SELECTION}
  gl_FragColor = vec4(v_color.rgb, 1.0);
}
`

export const SHAPES: string[] = []

SHAPES[0] =  // Квадрат
`
`

SHAPES[1] =  // Круг
`
if (length(gl_PointCoord - 0.5) > 0.5) discard;
`

SHAPES[2] =  // Крест
`
if ((all(lessThan(gl_PointCoord, vec2(0.3)))) ||
  ((gl_PointCoord.x > 0.7) && (gl_PointCoord.y < 0.3)) ||
  (all(greaterThan(gl_PointCoord, vec2(0.7)))) ||
  ((gl_PointCoord.x < 0.3) && (gl_PointCoord.y > 0.7))
  ) discard;
`

SHAPES[3] =  // Треугольник
`
vec2 pos = vec2(gl_PointCoord.x, gl_PointCoord.y - 0.1) - 0.5;
float a = atan(pos.x, pos.y) + 2.09439510239;
if (step(0.285, cos(floor(0.5 + a / 2.09439510239) * 2.09439510239 - a) * length(pos)) > 0.9) discard;
`

SHAPES[4] =  // Шестеренка
`
vec2 pos = vec2(0.5) - gl_PointCoord;
float r = length(pos) * 1.62;
float a = atan(pos.y, pos.x);
float f = cos(a * 3.0);
f = step(0.0, cos(a * 10.0)) * 0.2 + 0.5;
if ( step(f, r) > 0.5 ) discard;
`
