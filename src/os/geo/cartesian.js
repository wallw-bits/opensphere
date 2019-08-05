goog.provide('os.geo.cartesian');


/**
 * The following is ported from Cesium
 *
 * We are not able to use this directly from Cesium since we cannot guarantee
 * that Cesium is loaded or used and we do not want to load 2MB of JS just for
 * this. If they start using ES6 modules then we can potentially pick up just
 * this portion from them (and also slim down what we load for the renderer).
 *
 * @see cesium/Source/Core/Cartesian3.js
 * @see cesium/Source/Core/Cartographic.js
 * @see cesium/Source/Core/scaleToGeodeticSurface.js
 */
(function() {
  const wgs84Radii = [6378137.0, 6378137.0, 6356752.3142451793];
  const wgs84RadiiSquared = wgs84Radii.map((x) => x * x);
  const wgs84OneOverRadii = wgs84Radii.map((x) => 1 / x);
  const wgs84OneOverRadiiSquared = wgs84Radii.map((x) => 1 / (x * x));
  const wgs84CenterToleranceSquared = 1E-1;


  /**
   * @param {!ol.Coordinate} left
   * @param {!ol.Coordinate} right
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate}
   */
  const multiplyComponents = function(left, right, result) {
    result[0] = left[0] * right[0];
    result[1] = left[1] * right[1];
    result[2] = left[2] * right[2];
    return result;
  };


  /**
   * @param {!ol.Coordinate} left
   * @param {!ol.Coordinate} right
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate}
   */
  const add = function(left, right, result) {
    result[0] = left[0] + right[0];
    result[1] = left[1] + right[1];
    result[2] = left[2] + right[2];
    return result;
  };


  /**
   * @param {!ol.Coordinate} left
   * @param {!ol.Coordinate} right
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate}
   */
  const subtract = function(left, right, result) {
    result[0] = left[0] - right[0];
    result[1] = left[1] - right[1];
    result[2] = left[2] - right[2];
    return result;
  };


  /**
   * @param {!ol.Coordinate} left
   * @param {!ol.Coordinate} right
   * @return {number}
   */
  const dot = function(left, right) {
    return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
  };


  /**
   * @param {!ol.Coordinate} cartesian
   * @param {number} scalar
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate}
   */
  const multiplyByScalar = function(cartesian, scalar, result) {
    result[0] = cartesian[0] * scalar;
    result[1] = cartesian[1] * scalar;
    result[2] = cartesian[2] * scalar;
    return result;
  };


  /**
   * @param {!ol.Coordinate} cartesian
   * @param {number} scalar
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate}
   */
  const divideByScalar = function(cartesian, scalar, result) {
    result[0] = cartesian[0] / scalar;
    result[1] = cartesian[1] / scalar;
    result[2] = cartesian[2] / scalar;
    return result;
  };


  /**
   * @param {!ol.Coordinate} cartesian
   * @return {number}
   */
  const magnitude = function(cartesian) {
    return Math.sqrt(dot(cartesian, cartesian));
  };


  /**
   * @param {!ol.Coordinate} cartesian
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate}
   */
  const normalize = function(cartesian, result) {
    return divideByScalar(cartesian, magnitude(cartesian), result);
  };


  /**
   * @param {!ol.Coordinate} cartesian
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate}
   */
  const clone = function(cartesian, result) {
    result[0] = cartesian[0];
    result[1] = cartesian[1];
    result[2] = cartesian[2];
    return result;
  };


  /**
   * @param {!ol.Coordinate} left
   * @param {!ol.Coordinate} right
   * @param {number} epsilon
   * @return {boolean}
   */
  const equalsEpsilon = function(left, right, epsilon) {
    return left === right || (left && right &&
      Math.abs(left[0] - right[0]) < epsilon &&
      Math.abs(left[1] - right[1]) < epsilon &&
      Math.abs(left[2] - right[2]) < epsilon);
  };


  const scratchIntersection = [0, 0, 0];
  const scratchGradient = [0, 0, 0];


  /**
   * @param {!ol.Coordinate} cartesian
   * @param {!ol.Coordinate} oneOverRadii
   * @param {!ol.Coordinate} oneOverRadiiSquared
   * @param {number} centerToleranceSquared
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate|undefined}
   */
  const scaleToGeodeticSurface = function(cartesian, oneOverRadii, oneOverRadiiSquared, centerToleranceSquared,
      result) {
    const positionX = cartesian[0];
    const positionY = cartesian[1];
    const positionZ = cartesian[2];

    const oneOverRadiiX = oneOverRadii[0];
    const oneOverRadiiY = oneOverRadii[1];
    const oneOverRadiiZ = oneOverRadii[2];

    const x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
    const y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
    const z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;

    // Compute the squared ellipsoid norm.
    const squaredNorm = x2 + y2 + z2;
    const ratio = Math.sqrt(1.0 / squaredNorm);

    // As an initial approximation, assume that the radial intersection is the projection point.
    const intersection = multiplyByScalar(cartesian, ratio, scratchIntersection);

    // If the position is near the center, the iteration will not converge.
    if (squaredNorm < centerToleranceSquared) {
      return !isFinite(ratio) ? undefined : clone(intersection, result);
    }

    const oneOverRadiiSquaredX = oneOverRadiiSquared[0];
    const oneOverRadiiSquaredY = oneOverRadiiSquared[1];
    const oneOverRadiiSquaredZ = oneOverRadiiSquared[2];

    // Use the gradient at the intersection point in place of the true unit normal.
    // The difference in magnitude will be absorbed in the multiplier.
    const gradient = scratchGradient;
    gradient[0] = intersection[0] * oneOverRadiiSquaredX * 2.0;
    gradient[1] = intersection[1] * oneOverRadiiSquaredY * 2.0;
    gradient[2] = intersection[2] * oneOverRadiiSquaredZ * 2.0;

    // Compute the initial guess at the normal vector multiplier, lambda.
    let lambda = (1.0 - ratio) * magnitude(cartesian) / (0.5 * magnitude(gradient));
    let correction = 0.0;
    let xMultiplier;
    let yMultiplier;
    let zMultiplier;
    let xMultiplier2;
    let yMultiplier2;
    let zMultiplier2;
    let xMultiplier3;
    let yMultiplier3;
    let zMultiplier3;
    let func;
    let denominator;
    let derivative;

    do {
      lambda -= correction;

      xMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredX);
      yMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredY);
      zMultiplier = 1.0 / (1.0 + lambda * oneOverRadiiSquaredZ);

      xMultiplier2 = xMultiplier * xMultiplier;
      yMultiplier2 = yMultiplier * yMultiplier;
      zMultiplier2 = zMultiplier * zMultiplier;

      xMultiplier3 = xMultiplier2 * xMultiplier;
      yMultiplier3 = yMultiplier2 * yMultiplier;
      zMultiplier3 = zMultiplier2 * zMultiplier;

      func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1.0;

      // "denominator" here refers to the use of this expression in the velocity and acceleration
      // computations in the sections to follow.
      denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX +
        y2 * yMultiplier3 * oneOverRadiiSquaredY +
        z2 * zMultiplier3 * oneOverRadiiSquaredZ;

      derivative = -2.0 * denominator;

      correction = func / derivative;
    } while (Math.abs(func) > 1E-12);

    result[0] = positionX * xMultiplier;
    result[1] = positionY * yMultiplier;
    result[2] = positionZ * zMultiplier;
    return result;
  };


  const scratchN = [0, 0, 0];
  const scratchK = [0, 0, 0];


  /**
   * Converts cartographic coordinates to 3D Cartesian coordinates
   * @param {!ol.Coordinate} coord EPSG:4326 Coordinate
   * @param {ol.Coordinate=} opt_result
   * @return {!ol.Coordinate}
   */
  const toCartesian = function(coord, opt_result) {
    const lon = os.geo.D2R * coord[0];
    const lat = os.geo.D2R * coord[1];
    const alt = coord[2];

    const cosLat = Math.cos(lat);
    scratchN[0] = cosLat * Math.cos(lon);
    scratchN[1] = cosLat * Math.sin(lon);
    scratchN[2] = Math.sin(lat);
    normalize(scratchN, scratchN);

    multiplyComponents(wgs84RadiiSquared, scratchN, scratchK);
    const gamma = Math.sqrt(dot(scratchN, scratchK));
    divideByScalar(scratchK, gamma, scratchK);
    multiplyByScalar(scratchN, alt, scratchN);
    return add(scratchK, scratchN, opt_result || []);
  };


  const scratchP = [0, 0, 0];
  const scratchH = [0, 0, 0];


  /**
   * Converts 3D Cartesian coordinates to Cartographic coordinates
   * @param {!ol.Coordinate} coord EPSG:4326 Coordinate
   * @param {ol.Coordinate=} opt_result
   * @return {!ol.Coordinate|undefined}
   */
  const toCartographic = function(coord, opt_result) {
    const p = scaleToGeodeticSurface(coord, wgs84OneOverRadii, wgs84OneOverRadiiSquared,
        wgs84CenterToleranceSquared, scratchP);

    if (!p) {
      return undefined;
    }

    const n = multiplyComponents(p, wgs84OneOverRadiiSquared, scratchN);
    normalize(n, n);

    const h = subtract(coord, p, scratchH);

    opt_result = opt_result || [];
    // the order of these is important if this is called with coord as opt_result
    opt_result[2] = Math.sign(dot(h, coord)) * magnitude(h);
    opt_result[0] = os.geo.R2D * Math.atan2(n[1], n[0]);
    opt_result[1] = os.geo.R2D * Math.asin(n[2]);

    return opt_result;
  };

  os.geo.cartesian.fromLonLat = toCartesian;
  os.geo.cartesian.toLonLat = toCartographic;


  const scratchPlaneDifference = [0, 0, 0];

  /**
   * @param {!ol.Coordinate} s1 one point of the line segment
   * @param {!ol.Coordinate} s2 the other point of the line segment
   * @param {!ol.Coordinate} plane
   * @param {!ol.Coordinate} result
   * @return {!ol.Coordinate|undefined}
   */
  const lineSegmentPlaneIntersection = function(s1, s2, plane, result) {
    var difference = subtract(s2, s1, scratchPlaneDifference);
    var nDotDiff = dot(plane, difference);

    // check if the segment and plane are parallel
    if (Math.abs(nDotDiff) < 1E-6) {
      return undefined;
    }

    var nDotP0 = dot(plane, s1);
    var t = -((plane[3] || 0) + nDotP0) / nDotDiff;

    // intersection only if t is in [0, 1]
    if (t < 0.0 || t > 1.0) {
      return undefined;
    }

    // intersection is s1 + t * (s2 - s1)
    multiplyByScalar(difference, t, result);
    add(s1, result, result);
    return result;
  };

  const XZ_PLANE = [0, 1, 0, -0];
  const intersectionScratch = [0, 0, 0];


  /**
   * @param {Array<ol.Coordinate>} coords
   * @param {boolean} side true for east, false for west
   */
  const splitSide = function(coords, side) {
    if (coords.length < 2) {
      return;
    }

    let p0;
    let p1;
    let intersection;
    let i;
    let n;

    for (i = 1, n = coords.length; i < n; i++) {
      p0 = coords[i - 1];
      p1 = coords[i];

      intersection = lineSegmentPlaneIntersection(p0, p1, XZ_PLANE, intersectionScratch);
      if (intersection && !equalsEpsilon(intersection, p0, 1E-7) && !equalsEpsilon(intersection, p1, 1E-7)) {
        scaleToGeodeticSurface(intersection, wgs84OneOverRadii, wgs84OneOverRadiiSquared,
            wgs84CenterToleranceSquared, intersection);
        if ((p0[1] < 0) === side) {
          clone(intersection, p0);
        } else if ((p1[1] < 0) === side) {
          clone(intersection, p1);
        }
      }
    }

    i = coords.length;
    while (i--) {
      if ((coords[i][1] < 0) === side) {
        coords.splice(i, 1);
      }
    }
  };


  /**
   * @param {Array<ol.Coordinate>} coordinates in EPSG:4326 degrees longitude and latitude
   * @return {Array<Array<ol.Coordinate>>}
   */
  const splitOnMeridianPlane = function(coordinates) {
    // run toCartesian in-place on coords/east while cloning it for west in a single loop
    const west = coordinates.map((c) => clone(toCartesian(c, c), []));
    const east = coordinates;

    splitSide(east, true);
    splitSide(west, false);

    // convert back to cartographic in-place
    east.forEach((c) => toCartographic(c, c));
    west.forEach((c) => toCartographic(c, c));

    return [east, west];
  };


  os.geo.cartesian.splitOnMeridianPlane = splitOnMeridianPlane;
})();
