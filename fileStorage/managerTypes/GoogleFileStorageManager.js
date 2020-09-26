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
 * This class is responsible for storing and downloading files from
 * Google Cloud Storage.
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

  const EMPTY = "";

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

  static async downloadMultipleFromBuckets(items) {
    const promises = [];
    for (var i = 0; i < items.length; i++) {
      const fileName = item[i]._id + this.STORAGE.FILE_TYPE.IMAGE;
      const file = await this.STORAGE.BUCKET.CONTENT_IMAGE.file(fileName);
      const fileExists = await file.exists();
      if (fileExists) {
        promises.push(file.getSignedUrl(this.STORAGE.DOWNLOAD_OPTIONS));
      } else {
        promises.push(this.EMPTY);
      }
    }
    const urls = await Promise.all(promises);
    return urls;
  }

}
