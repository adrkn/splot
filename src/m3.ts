
/**
 * Takes two Matrix3s, a and b, and computes the product in the order
 * that pre-composes b with a.  In other words, the matrix returned will
 */
export function multiply(a: number[], b: number[]): number[] {
  return [
    b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
    b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
    b[0] * a[2] + b[1] * a[5] + b[2] * a[8],
    b[3] * a[0] + b[4] * a[3] + b[5] * a[6],
    b[3] * a[1] + b[4] * a[4] + b[5] * a[7],
    b[3] * a[2] + b[4] * a[5] + b[5] * a[8],
    b[6] * a[0] + b[7] * a[3] + b[8] * a[6],
    b[6] * a[1] + b[7] * a[4] + b[8] * a[7],
    b[6] * a[2] + b[7] * a[5] + b[8] * a[8]
  ]
}

/**
 * Creates a 3x3 identity matrix
 */
export function identity(): number[] {
  return [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ]
}

/**
 * Creates a 2D projection matrix. Returns a projection matrix that converts from pixels to clipspace with Y = 0 at the
 * top. This matrix flips the Y axis so 0 is at the top.
 */
export function projection(width: number, height: number): number[] {
  return [
    2 / width, 0, 0,
    0, -2 / height, 0,
    -1, 1, 1
  ]
}

/**
 * Creates a 2D translation matrix. Returns a translation matrix that translates by tx and ty.
 */
export function translation(tx: number, ty: number): number[] {
  return [
    1, 0, 0,
    0, 1, 0,
    tx, ty, 1
  ]
}

/**
 * Multiplies by a 2D translation matrix
 */
export function translate(m: number[], tx: number, ty: number): number[] {
  return multiply(m, translation(tx, ty))
}

/**
 * Creates a 2D scaling matrix
 */
export function scaling(sx: number, sy: number): number[] {
  return [
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1
  ]
}

/**
 * Multiplies by a 2D scaling matrix
 */
export function scale(m: number[], sx: number, sy: number): number[] {
  return multiply(m, scaling(sx, sy))
}

export function transformPoint(m: number[], v: number[]): number[] {
  const v0 = v[0]
  const v1 = v[1]
  const d = v0 * m[0 * 3 + 2] + v1 * m[1 * 3 + 2] + m[2 * 3 + 2]
  return [
    (v0 * m[0 * 3 + 0] + v1 * m[1 * 3 + 0] + m[2 * 3 + 0]) / d,
    (v0 * m[0 * 3 + 1] + v1 * m[1 * 3 + 1] + m[2 * 3 + 1]) / d
  ]
}

export function inverse(m: number[]): number[] {
  const t00 = m[1 * 3 + 1] * m[2 * 3 + 2] - m[1 * 3 + 2] * m[2 * 3 + 1]
  const t10 = m[0 * 3 + 1] * m[2 * 3 + 2] - m[0 * 3 + 2] * m[2 * 3 + 1]
  const t20 = m[0 * 3 + 1] * m[1 * 3 + 2] - m[0 * 3 + 2] * m[1 * 3 + 1]
  const d = 1.0 / (m[0 * 3 + 0] * t00 - m[1 * 3 + 0] * t10 + m[2 * 3 + 0] * t20)
  return [
      d * t00, -d * t10, d * t20,
    -d * (m[1 * 3 + 0] * m[2 * 3 + 2] - m[1 * 3 + 2] * m[2 * 3 + 0]),
      d * (m[0 * 3 + 0] * m[2 * 3 + 2] - m[0 * 3 + 2] * m[2 * 3 + 0]),
    -d * (m[0 * 3 + 0] * m[1 * 3 + 2] - m[0 * 3 + 2] * m[1 * 3 + 0]),
      d * (m[1 * 3 + 0] * m[2 * 3 + 1] - m[1 * 3 + 1] * m[2 * 3 + 0]),
    -d * (m[0 * 3 + 0] * m[2 * 3 + 1] - m[0 * 3 + 1] * m[2 * 3 + 0]),
      d * (m[0 * 3 + 0] * m[1 * 3 + 1] - m[0 * 3 + 1] * m[1 * 3 + 0])
  ]
}
