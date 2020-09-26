"use strict";
//jshint esversion:6

class Content {

  static PROPERTY = {
    CREATOR_ID: 'creatorId',
    CREATOR_USERNAME: 'creatorUsername',
    TITLE: 'title',
    CONTENT: 'content',
    TIMESTAMP: 'timestamp',
    ROOM_ID: 'roomId'
  }

  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const creatorId = build.creatorId;
      const creatorUsername = build.creatorUsername;
      const title = build.title;
      const content = build.content;
      const timestamp = build.timestamp;
      const roomId = build.roomId;
      Object.defineProperties(this, {
        creatorId: {
          value: creatorId,
          writable: false
        },
        creatorUsername: {
          value: creatorUsername,
          writable: false
        },
        title: {
          value: title,
          writable: false
        },
        content: {
          value: content,
          writable: false
        },
        timestamp: {
          value: timestamp,
          writable: false
        },
        roomId: {
          value: roomId,
          writable: false
        }
      });
    }
  }
  validateBuild(build) {
    return (String(build.constructor) === String(Content.Builder));
  }
  static get Builder() {
    class Builder {
      setCreatorId(creatorId) {
        this.creatorId = creatorId;
        return this;
      }
      setCreatorUsername(creatorUsername) {
        this.creatorUsername = creatorUsername;
        return this;
      }
      setTitle(title) {
        this.title = title;
        return this;
      }
      setContent(content) {
        this.content = content;
        return this;
      }
      setTimeStamp(timestamp) {
        this.timestamp = timestamp;
        return this;
      }
      setRoomId(roomId) {
        this.roomId = roomId;
        return this;
      }
      build() {
        return new Content(this);
      }
    }
    return Builder;
  }
}

module.exports = Content;
