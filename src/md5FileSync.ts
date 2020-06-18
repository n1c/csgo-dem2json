
// Copied from js package md5-file
import * as crypto from "crypto";
import * as fs from "fs";

const BUFFER_SIZE = 8192;

export function md5FileSync(filename: string): string {
  const fd = fs.openSync(filename, "r");
  const hash = crypto.createHash("md5");
  const buffer = Buffer.alloc(BUFFER_SIZE);

  try {
    let bytesRead;

    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null);
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
  } finally {
    fs.closeSync(fd);
  }

  return hash.digest("hex");
}
