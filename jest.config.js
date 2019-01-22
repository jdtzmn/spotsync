module.exports = {
  "roots": [
    "<rootDir>/pages",
    "<rootDir>/components",
    "<rootDir>/server",
    "<rootDir>/__tests__"
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/__tests__/setupEnzyme.ts" // ignore the setupEnzyme file in the __tests__ directory
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg)$": "<rootDir>/__mocks__/empty-mock.js",
    "\\.(ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|scss|oga)$": "<rootDir>/__mocks__/empty-mock.js"
  },
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupTestFrameworkScriptFile": "<rootDir>/__tests__/setupEnzyme.ts"
}
