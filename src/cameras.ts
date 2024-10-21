// `Range` is a built-in symbol.
export interface CustomRange {
  min: number;
  max: number;
}

export interface Camera {
  distance: CustomRange;
  lightLevel: CustomRange;
}

/**
 * This function determines if a provided list of hardware cameras is sufficient to fulfill desired characteristics of a software camera.
 * 
 * @param desiredDistance desired distance of the software camera
 * @param desiredLightLevel desired light level of the software camera
 * @param hardware list of hardware cameras
 * 
 * @returns `true` if the provided list of hardware cameras is sufficient, `false` otherwise.
 */
export function testCameras(desiredDistance: CustomRange, desiredLightLevel: CustomRange, hardware: Camera[]): boolean {
  // Range for distance (hardware cameras)
  let minHardwareDistance: number | undefined = hardware[0]?.distance.min;
  let maxHardwareDistance: number | undefined = hardware[0]?.distance.max;
  // Range for light level (hardware cameras)
  let minHardwareLightLevel: number | undefined = hardware[0]?.lightLevel.min;
  let maxHardwareLightLevel: number | undefined = hardware[0]?.lightLevel.max;
  // Find min and max for distance and light level (hardware camera)
  for (let i = 1; i < hardware.length; i++) {
    const current = hardware[i];
    minHardwareDistance = Math.min(minHardwareDistance, current.distance.min);
    maxHardwareDistance = Math.max(maxHardwareDistance, current.distance.max);
    minHardwareLightLevel = Math.min(minHardwareLightLevel, current.lightLevel.min);
    maxHardwareLightLevel = Math.max(maxHardwareLightLevel, current.lightLevel.max);
  }
  return minHardwareDistance <= desiredDistance.min && desiredDistance.max <= maxHardwareDistance &&
    minHardwareLightLevel <= desiredLightLevel.min && desiredLightLevel.max <= maxHardwareLightLevel;
}

/***************************
 ********** TESTS **********
 ***************************/

interface TestCase {
  desiredDistance: CustomRange;
  desiredLghtLevel: CustomRange;
  hardware: Camera[];
  expected: boolean;
}

const testCases: TestCase[] = [
  { // 0
    desiredDistance: { min: 1, max: 2 },
    desiredLghtLevel: { min: 1, max: 2 },
    hardware: [],
    expected: false,
  },
  { // 1
    desiredDistance:  { min: 1, max: 2 },
    desiredLghtLevel: { min: 1, max: 2 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }],
    expected: true,
  },
  { // 2
    desiredDistance:  { min: 1, max: 4 },
    desiredLghtLevel: { min: 1, max: 4 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }, {
      distance:   { min: 2, max: 3 },
      lightLevel: { min: 2, max: 3 },
    }, {
      distance:   { min: 3, max: 4 },
      lightLevel: { min: 3, max: 4 },
    }],
    expected: true,
  },
  { // 3
    desiredDistance:  { min: 2,   max: 3 },
    desiredLghtLevel: { min: 1.5, max: 3.5 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }, {
      distance:   { min: 2, max: 3 },
      lightLevel: { min: 2, max: 3 },
    }, {
      distance:   { min: 3, max: 4 },
      lightLevel: { min: 3, max: 4 },
    }],
    expected: true,
  },
  { // 4
    desiredDistance:  { min: 0,   max: 3 },
    desiredLghtLevel: { min: 1.5, max: 3.5 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }, {
      distance:   { min: 2, max: 3 },
      lightLevel: { min: 2, max: 3 },
    }, {
      distance:   { min: 3, max: 4 },
      lightLevel: { min: 3, max: 4 },
    }],
    expected: false,
  },
  { // 5
    desiredDistance:  { min: 2,   max: 5 },
    desiredLghtLevel: { min: 1.5, max: 3.5 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }, {
      distance:   { min: 2, max: 3 },
      lightLevel: { min: 2, max: 3 },
    }, {
      distance:   { min: 3, max: 4 },
      lightLevel: { min: 3, max: 4 },
    }],
    expected: false,
  },
  { // 6
    desiredDistance:  { min: 2,   max: 3 },
    desiredLghtLevel: { min: 0, max: 3.5 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }, {
      distance:   { min: 2, max: 3 },
      lightLevel: { min: 2, max: 3 },
    }, {
      distance:   { min: 3, max: 4 },
      lightLevel: { min: 3, max: 4 },
    }],
    expected: false,
  },
  { // 7
    desiredDistance:  { min: 2,   max: 3 },
    desiredLghtLevel: { min: 1.5, max: 5 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }, {
      distance:   { min: 2, max: 3 },
      lightLevel: { min: 2, max: 3 },
    }, {
      distance:   { min: 3, max: 4 },
      lightLevel: { min: 3, max: 4 },
    }],
    expected: false,
  },
  { // 8
    desiredDistance:  { min: 1, max: 3 },
    desiredLghtLevel: { min: 2, max: 5 },
    hardware: [{
      distance:   { min: 1, max: 2 },
      lightLevel: { min: 1, max: 2 },
    }, {
      distance:   { min: 4, max: 5 },
      lightLevel: { min: 4, max: 5 },
    }],
    expected: true,
  },
];

const results = testCases.map(({ desiredDistance, desiredLghtLevel, hardware, expected }, index) => {
  const actual = testCameras(desiredDistance, desiredLghtLevel, hardware);
  if (actual !== expected) {
    console.error(`Test case with index ${index} failed!`);
    console.log(`   actual: ${actual}`);
    console.log(` expected: ${expected}`);
    return false;
  }
  return true;
});

if (results.every(value => value)) {
  console.log("Tests passed!");
}
