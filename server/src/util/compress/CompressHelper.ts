import { TextFileInfo } from "./model/TextFileInfo";
import * as archiver from "archiver";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { DateUtils } from "ts-commons";

export class CompressHelper {
  public static async compressTextFile(fileInfos: TextFileInfo[]): Promise<string> {
    try {
      const fileName = `${DateUtils.toString(new Date(), "yyyyMMddHHmmss")}.zip`;
      const tempZipFile = path.join(os.tmpdir(), fileName);
      await CompressHelper.compressTextFileToZipFile(tempZipFile, fileInfos);
      return new Promise<string>((resolve, reject) => resolve(tempZipFile));
    } catch (e) {
      return new Promise<string>((resolve, reject) => reject(e));
    }
  }

  public static compressTextFileToZipFile(zipFilePath: string, fileInfos: TextFileInfo[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
      });
      const output = fs.createWriteStream(zipFilePath);
      archive.pipe(output);
      for (const fileInfo of fileInfos) {
        archive.append(fileInfo.content, { name: fileInfo.fileName });
      }

      output.on("close", () => {
        console.log(archive.pointer() + " total bytes");
        console.log("archiver has been finalized and the output file descriptor has closed.");
        resolve();
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on("warning", err => {
        if (err.code === "ENOENT") {
          // log warning
        } else {
          // throw error
          reject(err);
        }
      });

      // good practice to catch this error explicitly
      archive.on("error", err => {
        reject(err);
      });
      archive.finalize();
    });
  }
}
