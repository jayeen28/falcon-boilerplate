/**
 * Module for managing files, including saving, appending, checking existence, and removing.
 * @module FileController
 */
import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';


/**
 * Array of allowed file extensions for downloaded files.
 * @constant {string[]}
 */
export const ALLOWED_EXTENSIONS: string[] = ['png', 'jpg', 'jpeg', 'svg', 'gif', 'avif', 'webp'];

/**
 * Directory where files are stored.
 * @constant {string}
 */
export const fileDir: string = path.join(path.resolve(), 'files');

// Ensure the file directory exists, creating it if necessary.
if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

/**
 * Asynchronous function to download an image from a provided URL, save it to a local directory,
 * and return the generated filename.
 *
 * @param {string} link - The URL of the image to download.
 * @returns {Promise<string|null>} - A Promise that resolves to the generated filename if successful,
 * or null if the provided link is empty or if an error occurs during the process.
 * @throws {Error} - Throws an error if the provided link lacks a file extension, has an invalid file extension,
 * or if any other error occurs during the download and save process.
 */
export function fileUp(link: string): string | null {
  if (!link) {
    return null;
  }

  const extIndex = link.lastIndexOf('.');
  if (extIndex === -1) {
    throw new Error('Link does not contain a file extension.');
  }

  const ext = link.substring(extIndex + 1);
  if (!ALLOWED_EXTENSIONS.includes(ext.toLowerCase())) {
    throw new Error('Invalid file extension.');
  }

  const fileName = randomBytes(16).toString('hex') + '.' + ext;
  const buffer = fs.readFileSync(link);
  const filePath = path.join(fileDir, fileName);
  fs.writeFileSync(filePath, buffer);

  return fileName;
}

/**
 * Asynchronous function to write a chunk of data to a file.
 *
 * @param {object} options - Options for writing the chunk.
 * @param {string} options.fileNametoSave - The name of the file to save the chunk.
 * @param {string} options.chunk - The data chunk to append to the file.
 * @param {string} options.appendFlag - The append flag ('a' for append, 'w' for write).
 * @returns {Promise<boolean>} - A Promise that resolves to true if the chunk is written successfully, or false on error.
 */
export function writeChunk({ fileNametoSave, chunk, appendFlag }: { fileNametoSave: string, chunk: string, appendFlag: string }): Promise<Error | boolean> {
  return new Promise((resolve, reject) => {
    fs.appendFile(path.join(fileDir, fileNametoSave), Buffer.from(chunk, 'base64'), { flag: appendFlag }, (err) => {
      if (err) {
        return reject('Error writing chunk to file');
      }
      return resolve(true);
    });
  });
}

/**
 * Asynchronous function to check the existence of multiple files.
 *
 * @param {object[]} files - An array of file objects to check.
 * @param {string} files[].location - The relative location of each file.
 * @returns {Promise<boolean>} - A Promise that resolves to true if all files exist, or false if any file is missing.
 * @throws {Error} - Throws an error if the files parameter is invalid or empty.
 */
export function allFileExist(files: { location: string }[]): boolean {
  if (!files?.length) {
    throw new Error('Invalid or empty file list.');
  }

  return files.every(f => {
    const filePath = path.join(fileDir, f.location);
    return fs.existsSync(filePath);
  });
}

/**
 * Asynchronous function to remove multiple files.
 *
 * @param {object[]} files - An array of file objects to remove.
 * @param {string} files[].location - The relative location of each file.
 * @returns {Promise<boolean>} - A Promise that resolves to true if all files are removed successfully, or false on error.
 */
export async function rmFiles(files: { location: string }[]): Promise<boolean> {
  try {
    await Promise.all(files.map(async ({ location }) => {
      const filePath = path.join(fileDir, location);
      await fs.promises.unlink(filePath);
      console.log(`File removed: ${path.basename(filePath)}`);
      return;
    }));
    return true;
  } catch (error) {
    console.error('Error removing files:', error);
    return false;
  }
}

export interface FileCtrl {
  rmFiles: (files: { location: string }[]) => Promise<boolean>;
  allFileExist: (files: { location: string }[]) => boolean;
  fileUp: (link: string) => string | null;
  writeChunk: ({ fileNametoSave, chunk, appendFlag }: { fileNametoSave: string, chunk: string, appendFlag: string }) => Promise<Error | boolean>;
  fileDir: string;
  ALLOWED_EXTENSIONS: string[];
}