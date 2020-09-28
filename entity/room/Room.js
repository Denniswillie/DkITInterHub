"use strict";
//jshint esversion:6

class Room {

  static PROPERTY = {
    CREATOR_ID: 'creatorId',
    NAME: 'name',
    DESCRIPTION: 'description',
    LIST_OF_STUDENTS: 'listOfStudents',
    PRIVACY_TYPE: 'privacyType',
    ACCESS_REQUESTS: 'accessRequests'
  }

  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const creatorId = build.creatorId;
      const name = build.name;
      const description = build.description;
      const listOfStudents = build.listOfStudents;
      const privacyType = build.privacyType;
      const accessRequests = build.accessRequests;
      Object.defineProperties(this, {
        creatorId: {
          value: creatorId,
          writable: false
        },
        name: {
          value: name,
          writable: false
        },
        description: {
          value: description,
          writable: false
        },
        listOfStudents: {
          value: listOfStudents,
          writable: false
        },
        privacyType: {
          value: privacyType,
          writable: false
        },
        accessRequests: {
          value: accessRequests,
          writable: false
        }
      });
    }
  }
  validateBuild(build) {
    return (String(build.constructor) === String(Room.Builder));
  }
  static get Builder() {
    class Builder {
      setCreatorId(creatorId) {
        this.creatorId = creatorId;
        return this;
      }
      setName(name) {
        this.name = name;
        return this;
      }
      setDescription(description) {
        this.description = description;
        return this;
      }
      setListOfStudents(listOfStudents) {
        this.listOfStudents = listOfStudents;
        return this;
      }
      setPrivacyType(privacyType) {
        this.privacyType = privacyType;
        return this;
      }
      setAccessRequests(accessRequests) {
        this.accessRequests = accessRequests;
        return this;
      }
      build() {
        return new Room(this);
      }
    }
    return Builder;
  }
}

module.exports = Room;
