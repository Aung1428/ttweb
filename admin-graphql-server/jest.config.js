/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['./src'],

  // only look for .ts files in __tests__ or *.test.ts
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(test).ts'],
};
