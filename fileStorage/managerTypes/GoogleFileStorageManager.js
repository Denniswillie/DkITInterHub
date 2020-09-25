"use strict";
// jshint esversion:6
const {
  Storage
} = require('@google-cloud/storage');
const projectId = "dkitinterhub";
const keyFilename = '../../DkitInterHub-18ea7da7837a.json';
const storage = new Storage({
  projectId,
  keyFilename
});

/**
 * This class is responsible for storing file
 */

class GoogleFileStorageManager {
  static STORAGE = {
    FILE_TYPE: {
      IMAGE: ".img"
    },
    DOWNLOAD_OPTIONS: {
      action: "read",
      expires: '12-31-9999'
    },
    BUCKET: {
      USER_PROFILE_IMAGE: storage.bucket('studentinterhub_userprofileimages'),
      ROOM_IMAGE: storage.bucket('studentinterhub_roomimages'),
      CONTENT_IMAGE: storage.bucket('studentinterhub_contentimages')
    },
    UPLOAD_OPTIONS: (destination) => {
      return {
        destination: destination,
        resumable: true,
        validation: 'crc32c'
      }
    }
  }

  // Returns the file that was uploaded..
  static async uploadToBucket(bucket, filePath, destination) {
    const file =
      await bucket.upload(
        filePath,
        this.STORAGE.UPLOAD_OPTIONS(destination)
      );
    return file;
  }

  static async downloadFromBucket(id, fileType, bucket) {
    const file = await bucket.file(String(id).concat(fileType));
    const url = await file.getSignedUrl(this.STORAGE.DOWNLOAD_OPTIONS);
    return url;
  }

}
