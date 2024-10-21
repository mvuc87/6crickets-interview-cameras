// Range: [min, max]
type CustomRange = [number, number];

export interface Camera {
  distance: CustomRange;
  lightLevel: CustomRange;
}

/**
 * @param desiredDistance desired range of distances (software camera)
 * @param desiredLightLevel desired range of light levels (software camera)
 * @param hardware list of hardware cameras
 * 
 * @returns `true` if the provided list of hardware cameras is sufficient, `false` otherwise.
 */
export function testCameras(desiredDistance: CustomRange, desiredLightLevel: CustomRange, hardware: Camera[]): boolean {
  // Range for distance (hardware cameras)
  let minHardwareDistance: number | undefined = hardware[0]?.distance[0];
  let maxHardwareDistance: number | undefined = hardware[0]?.distance[1];
  // Range for light level (hardware cameras)
  let minHardwareLightLevel: number | undefined = hardware[0]?.lightLevel[0];
  let maxHardwareLightLevel: number | undefined = hardware[0]?.lightLevel[1];
  // Find min and max for distances and light levels (hardware camera)
  for (let i = 1; i < hardware.length; i++) {
    const current = hardware[i];
    minHardwareDistance = Math.min(minHardwareDistance, current.distance[0]);
    maxHardwareDistance = Math.max(maxHardwareDistance, current.distance[1]);
    minHardwareLightLevel = Math.min(minHardwareLightLevel, current.lightLevel[0]);
    maxHardwareLightLevel = Math.max(maxHardwareLightLevel, current.lightLevel[1]);
  }
  return minHardwareDistance <= desiredDistance[0] && desiredDistance[1] <= maxHardwareDistance &&
    minHardwareLightLevel <= desiredLightLevel[0] && desiredLightLevel[1] <= maxHardwareLightLevel;
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
    desiredDistance: [1, 2],
    desiredLghtLevel: [1, 2],
    hardware: [],
    expected: false,
  },
  { // 1
    desiredDistance:  [1, 2],
    desiredLghtLevel: [1, 2],
    hardware: [
      { distance:   [1, 2], lightLevel: [1, 2], }
    ],
    expected: true,
  },
  { // 2
    desiredDistance:  [1, 4],
    desiredLghtLevel: [1, 4],
    hardware: [
      { distance: [1, 2], lightLevel: [1, 2], },
      { distance: [2, 3], lightLevel: [2, 3], },
      { distance: [3, 4], lightLevel: [3, 4], },
    ],
    expected: true,
  },
  { // 3
    desiredDistance:  [2, 3],
    desiredLghtLevel: [1.5, 3.5],
    hardware: [
      { distance: [1, 2], lightLevel: [1, 2], },
      { distance: [2, 3], lightLevel: [2, 3], },
      { distance: [3, 4], lightLevel: [3, 4], }
    ],
    expected: true,
  },
  { // 4
    desiredDistance:  [0, 3],
    desiredLghtLevel: [1.5, 3.5],
    hardware: [
      { distance: [1, 2], lightLevel: [1, 2], },
      { distance: [2, 3], lightLevel: [2, 3], },
      { distance: [3, 4], lightLevel: [3, 4], },
    ],
    expected: false,
  },
  { // 5
    desiredDistance:  [2, 5],
    desiredLghtLevel: [1.5, 3.5],
    hardware: [
      { distance: [1, 2], lightLevel: [1, 2], },
      { distance: [2, 3], lightLevel: [2, 3], },
      { distance: [3, 4], lightLevel: [3, 4], },
    ],
    expected: false,
  },
  { // 6
    desiredDistance:  [2, 3],
    desiredLghtLevel: [0, 3.5],
    hardware: [
      { distance: [1, 2], lightLevel: [1, 2], },
      { distance: [2, 3], lightLevel: [2, 3], },
      { distance: [3, 4], lightLevel: [3, 4], },
    ],
    expected: false,
  },
  { // 7
    desiredDistance:  [2, 3],
    desiredLghtLevel: [1.5, 5],
    hardware: [
      { distance: [1, 2], lightLevel: [1, 2], },
      { distance: [2, 3], lightLevel: [2, 3], },
      { distance: [3, 4], lightLevel: [3, 4], },
    ],
    expected: false,
  },
  { // 8
    desiredDistance:  [1, 3],
    desiredLghtLevel: [2, 5],
    hardware: [
      { distance: [1, 2], lightLevel: [1, 2], },
      { distance: [4, 5], lightLevel: [4, 5], },
    ],
    expected: true,
  },
];

const results = testCases.map(({ desiredDistance, desiredLghtLevel, hardware, expected }, index) => {
  const actual = testCameras(desiredDistance, desiredLghtLevel, hardware);
  if (actual !== expected) {
    console.log(`Test case with index ${index} failed!`);
    console.log(`   actual: ${actual}`);
    console.log(` expected: ${expected}`);
    return false;
  }
  return true;
});

if (results.every(value => value)) {
  console.log("Tests passed!");
}
