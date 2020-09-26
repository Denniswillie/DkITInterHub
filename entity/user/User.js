"use strict";
//jshint esversion:6

class Content {
   constructor(build) {
      if (arguments.length === 1 && this.validateBuild(build)) {
         const creatorId = build.creatorId;
         const creatorUsername = build.creatorUsername;
         const title = build.title;
         const content = build.content;
         const timestamp = build.timestamp;
         const roomId = build.roomId;
         Object.defineProperties(this, {
            '_specimenId': {
               value: specimenId,
               writable: false
            },
            '_speed': {
               value: speed,
               writable: false
            },
            '_plumage': {
               value: plumage,
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
