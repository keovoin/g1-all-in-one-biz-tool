import { ApplicationPluginConfig } from '@gauzy/common';
import * as sharp from 'sharp';
/**
 * Retrieves the dimensions of an image file, including SVG files, asynchronously.
 *
 * This function reads the specified image file, determines its dimensions (width and height),
 * and returns them. If an error occurs, it defaults to returning width and height as 0.
 *
 * @param filePath - The path to the image file.
 * @returns A promise resolving to the dimensions of the image as an object containing `width`, `height`, and optionally `type`.
 *          Defaults to `{ width: 0, height: 0 }` if an error occurs.
 */
export declare const getImageDimensions: (filePath: string) => Promise<sharp.Metadata>;
/**
 * Copy assets from the source directory to the destination directory.
 *
 * @param filename The name of the file to copy.
 * @param config The application configuration.
 * @param destDir The destination directory.
 * @returns The destination file path.
 */
export declare function copyAssets(filename: string, config: Partial<ApplicationPluginConfig>, destDir: string): string | undefined;
/**
 * Cleans old seed assets in the specified destination directory.
 * This function removes all files in the target directory except for `rimraf` and `.gitkeep` files.
 *
 * The directory to be cleaned is determined based on whether the application is running
 * in an Electron environment or not.
 *
 * @param config - Partial configuration of the application, including asset options.
 * @param destDir - The destination directory relative to the public assets folder.
 * @returns A Promise that resolves when the cleanup is complete.
 */
export declare function cleanAssets(config: Partial<ApplicationPluginConfig>, destDir: string): Promise<void>;
/**
 * Takes an email string, converts it to lowercase, and appends a postfix "_ever_testing" before the "@" symbol.
 *
 * @param email The email address to modify.
 * @param postfix The postfix to append (default is "_ever_testing").
 * @returns The modified email address with the postfix appended before the "@" symbol.
 */
export declare function getEmailWithPostfix(email: string, postfix?: string): string;
