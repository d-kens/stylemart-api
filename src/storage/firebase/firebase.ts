import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import * as process from "process";

@Injectable()
export class FirebaseProvider {
  bucketName = process.env.BUCKET_NAME;

  private readonly logger = new Logger(FirebaseProvider.name);
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
    const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

    const bucket = this.firebase.storage.bucket(this.bucketName);

    const fileUpload = bucket.file(uniqueFileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      stream.on("error", (error) => {
        this.logger.error(`Failed to upload file: ${error.message}`);
        reject(new Error(`Failed to upload file: ${error.message}`));
      });

      stream.on("finish", async () => {
        try {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
          resolve({ url: publicUrl });
        } catch (err) {
          reject(
            new InternalServerErrorException(
              "Error fetching file metadata",
              err.message,
            ),
          );
        }
      });

      stream.end(file.buffer);
    });
  }

  async delete(url: string): Promise<void> {
    const fileName = this.extractFileNameFromUrl(url);
    const bucket = this.firebase.storage.bucket(this.bucketName);
    const fileToDelete = bucket.file(fileName);

    return new Promise((resolve, reject) => {
      fileToDelete.delete((error) => {
        if (error) {
          this.logger.error(`Failed to delete file: ${error.message}`);
          reject(new Error(`Failed to delete file: ${error.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  async update(
    url: string,
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    await this.delete(url);

    return this.upload(file);
  }

  private extractFileNameFromUrl(url: string): string {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  }
}
