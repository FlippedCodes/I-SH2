# Inter-Server Hub 2

This app is far from being done. The concept is to make a modular ecosystem in a monorepo to dynamic add or remove difference instant messaging services with the goal to connect channels or groups together.

## Development Notes

### Todo

The current status is to get Discord running again on this new infrastructure with the existing features from [I-SH v1](https://github.com/FlippedCodes/I-SH)

| Task | Status | Note |
|--|--|--|
| Documentation and Legal | 🚧 |  |
| Docker Setup | 🚧 |  |
| API | 🚧 |  |
| Discord | 🚧 |  |
| Telegram | ⏰ |  |
| Guilded | ⏰ |  |

<!-- # Standardizing all apps

## Features a platform should support

- Cache to save on DB calls (Maybe use a Redis DB?)

## Standard RabbitMQ Message that needs to be handled by every Platform

- h -->

### API Docs

#### Register App

Every app that uses the DB needs to regsiter so other apps know what features it supports and identify the Database entries belonging to that service.

### Database

```mermaid
erDiagram
    APP ||--o{ HUB-BRIDGE : uses
    APP ||--o{ HUB : uses
    APP ||--o{ USER-BLOCK : uses
    APP ||--o{ MESSAGE-LINKS : uses
    APP {
      int appID PK
      tinytext name
      json featuresupport
      datetime createdAt
      datetime updatedAt
    }
    HUB-BRIDGE ||--o{ USER-BLOCK : gets
    HUB-BRIDGE ||--o{ MESSAGE-LINKS : gets
    HUB-BRIDGE {
      varchar(255) channelID PK
      longtext additionalData
      int appID FK
      int hubID FK
      datetime createdAt
      datetime updatedAt
    }
    HUB ||--||HUB-SETTING : sets
    HUB ||--o{ USER-BLOCK : sets
    HUB {
      int id PK
      tinytext name
      tinytext ownerID
      int appID FK
      datetime createdAt
      datetime updatedAt
    }
    HUB-SETTING {
      int id PK
      tinyint(1) allowInvites
    }
    MESSAGE-LINKS {
      varchar(255) messageID PK, UK
      varchar(255) channelID FK, UK
      tinytext linkID
      int appID FK
      datetime createdAt
      datetime updatedAt
    }
    USER-BLOCK {
      int blockID PK
      tinytext userID UK
      int appID UK, FK
      varchar(255) channelID UK, FK
      int hubID UK, FK
      tinytext reason
      tinyint acknowledged
      datetime createdAt
      datetime updatedAt
    }
```
