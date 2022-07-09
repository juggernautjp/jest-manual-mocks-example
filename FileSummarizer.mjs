// Copyright 2004-present Facebook. All Rights Reserved.
// modified to ES Module from original

// const fs = require('fs');
import * as fs from 'node:fs';

// function summarizeFilesInDirectorySync(directory) {
export function summarizeFilesInDirectorySync(directory) {
  return fs.readdirSync(directory).map(fileName => ({directory, fileName}));
}

// exports.summarizeFilesInDirectorySync = summarizeFilesInDirectorySync;
