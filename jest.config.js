export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          module: 'commonjs',
          moduleResolution: 'node',
          esModuleInterop: true,
          isolatedModules: true,
        },
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.tsx', '!src/**/index.ts', '!src/test/**'],
  coverageThreshold: {
    './src/utils/': { statements: 80, branches: 80, functions: 80, lines: 80 },
    './src/services/': { statements: 80, branches: 80, functions: 80, lines: 80 },
    './src/store/': { statements: 80, branches: 80, functions: 80, lines: 80 },
    './src/hooks/': { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
};
