import type { ReactElement } from 'react';
import type { Point, Size } from '../../types/geometry';
import type { NotePattern } from '../../types/notes';
import { ringPoints, starPoints } from '../../utils/patterns';

interface PatternTile {
  size: Size;
  background: string;
  motifs: ReactElement;
}

interface Flower extends Point {
  big: boolean;
  rotation: number;
}

const CELL = 50 / 3;

const grid3 = (jitter: readonly (readonly [number, number])[]): Flower[] =>
  jitter.map(([dx, dy], index) => ({
    x: CELL / 2 + (index % 3) * CELL + dx,
    y: CELL / 2 + Math.floor(index / 3) * CELL + dy,
    big: index % 2 === 0,
    rotation: index * 23,
  }));

const FLOWERS = grid3([
  [0.2, 0.1],
  [0.4, -0.3],
  [-0.3, 0.4],
  [-0.4, 0.2],
  [0.1, -0.2],
  [0.3, 0.3],
  [-0.2, -0.4],
  [0.2, 0.4],
  [-0.1, 0.1],
]);

const flowerPetals = ({ x, y, big, rotation }: Flower, color: string) => {
  const offset = big ? 4.6 : 3.9;
  const radius = big ? 3.2 : 2.7;
  return ringPoints({ x, y }, offset, 5, rotation).map((petal, index) => (
    <circle key={index} cx={petal.x} cy={petal.y} r={radius} fill={color} />
  ));
};

const lilacBlooms = (
  <>
    {FLOWERS.map((flower, index) => (
      <g key={index}>
        {flowerPetals(flower, '#DCCBF0')}
        <circle cx={flower.x} cy={flower.y} r={flower.big ? 1.2 : 1} fill="#E8462F" />
      </g>
    ))}
  </>
);

const sunnyDaisies = (
  <>
    {FLOWERS.map((flower, index) => (
      <g key={index}>
        {flowerPetals(flower, '#FBF1E3')}
        {[flower, ...ringPoints(flower, 1.1, 6, flower.rotation)].map((dot, dotIndex) => (
          <circle key={dotIndex} cx={dot.x} cy={dot.y} r={0.4} fill="#2B1E2F" />
        ))}
      </g>
    ))}
  </>
);

const STARS: readonly (readonly [number, number, number, number])[] = [
  [7, 7, 5.5, -10],
  [24.6, 5.5, 4.3, 15],
  [43.5, 7.5, 5.5, 5],
  [5.5, 25.5, 4.3, -20],
  [44, 26.5, 5, 10],
  [9, 43.5, 5.5, -5],
  [26.5, 44.5, 4.3, 20],
  [43.8, 43.8, 5.2, -15],
  [25.5, 25, 5, 0],
];

const pinkStars = (
  <>
    {STARS.map(([x, y, radius, rotation], index) => (
      <polygon
        key={index}
        points={starPoints({ x, y }, radius, radius * 0.48, rotation)}
        fill="#F7BE1E"
        stroke="#F7BE1E"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    ))}
  </>
);

const checkerCells = (count: number) =>
  Array.from({ length: count * count }, (_, index) => ({
    row: Math.floor(index / count),
    column: index % count,
  }));

const lavenderChecker = (
  <>
    {checkerCells(6)
      .filter(({ row, column }) => (row + column) % 2 === 1)
      .map(({ row, column }) => (
        <rect
          key={`${row}-${column}`}
          x={(column * 50) / 6}
          y={(row * 50) / 6}
          width={50 / 6}
          height={50 / 6}
          fill="#B08EE0"
        />
      ))}
  </>
);

const HEART = 'M0 3C0 3-3.6 1-3.6-1.2A1.8 1.8 0 0 1 0-2A1.8 1.8 0 0 1 3.6-1.2C3.6 1 0 3 0 3Z';

const heartsChecker = (
  <>
    {checkerCells(4).map(({ row, column }) =>
      (row + column) % 2 === 1 ? (
        <rect
          key={`${row}-${column}`}
          x={column * 12.5}
          y={row * 12.5}
          width={12.5}
          height={12.5}
          fill="#F7AFC7"
        />
      ) : (
        <path
          key={`${row}-${column}`}
          d={HEART}
          transform={`translate(${column * 12.5 + 6.25} ${row * 12.5 + 6.5})`}
          fill="#E8462F"
        />
      ),
    )}
  </>
);

const wobblyGrid = (
  <g stroke="#F7AFC7" strokeWidth={7} fill="none">
    {[6.25, 31.25].map((offset) => (
      <g key={offset}>
        <path d={`M${offset} -1C${offset + 3} 16 ${offset - 3} 34 ${offset} 51`} />
        <path d={`M-1 ${offset}C16 ${offset + 3} 34 ${offset - 3} 51 ${offset}`} />
      </g>
    ))}
  </g>
);

const lavenderWaves = (
  <path
    d="M0 17.5C12.5 8 25 8 37.5 17.5S62.5 27 75 17.5"
    stroke="#F7BE1E"
    strokeWidth={14}
    strokeLinecap="round"
    fill="none"
  />
);

const halfMoonPath = (x: number, y: number, sweep: number) => {
  const radius = CELL / 2;
  return `M${x - radius} ${y}A${radius} ${radius} 0 0 ${sweep} ${x + radius} ${y}Z`;
};

const halfMoon = (x: number, y: number, top: string, bottom: string) => (
  <g key={`${x}-${y}`}>
    <path d={halfMoonPath(x, y, 1)} fill={top} />
    <path d={halfMoonPath(x, y, 0)} fill={bottom} />
  </g>
);

const halfMoons = (
  <>
    {Array.from({ length: 6 }, (_, index) => {
      const row = Math.floor(index / 2);
      const column = index % 2;
      const light = (row + column) % 2 === 0;
      return halfMoon(
        12.5 + column * 25,
        CELL / 2 + row * CELL,
        light ? '#FBD9D3' : '#F7AFC7',
        light ? '#F7AFC7' : '#FBD9D3',
      );
    })}
  </>
);

const TILE = { width: 50, height: 50 };

export const PATTERN_TILES: Record<NotePattern, PatternTile> = {
  'lilac-blooms': { size: TILE, background: '#B08EE0', motifs: lilacBlooms },
  'pink-stars': { size: TILE, background: '#F27A9B', motifs: pinkStars },
  'lavender-checker': { size: TILE, background: '#FBF1E3', motifs: lavenderChecker },
  'hearts-checker': { size: TILE, background: '#FBF1E3', motifs: heartsChecker },
  'wobbly-grid': { size: TILE, background: '#F26B2A', motifs: wobblyGrid },
  'lavender-waves': {
    size: { width: 75, height: 35 },
    background: '#DCCBF0',
    motifs: lavenderWaves,
  },
  'half-moons': { size: TILE, background: '#F26B2A', motifs: halfMoons },
  'sunny-daisies': { size: TILE, background: '#F7BE1E', motifs: sunnyDaisies },
};
