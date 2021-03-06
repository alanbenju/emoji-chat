
# Emoji Project

There are 3 services
- Emoji service (handles socket connections and communication)
- User service
- Team service

All of them are built with NodeJs and Express. Socket.io is the library used for the socket communication

### Installation and Run locally (option 1 - npm)

For each service:
```bash
  npm install
```

Start server

```bash
  npm run start
```

### Installation and Run locally (option 2 - docker)

```bash
  docker-compose up
```
This will create and run images for the three services and nginx as reverse-proxy
(nginx conf file is not finished)

### Ports
Emoji service: 3000

User service: 3001

Team service: 3002

nginx: 81 (*wip*)
    emoji: /emoji
    user: /users
    team: /teams

### Endpoints

For socket connection, connect to emojiservice directly
```bash
Login: POST userservice/login 
Body:
  {
    username: string,
    password: string
  }

Response: 
  {
    token: string
  }
```

Every other request will need Authorization header with Bearer token

Every socket connection needs to attach token to socket.auth before connecting

```bash
Get my teammates: GET userservice/teammates
```

Server accepted socket messages:
```bash

emoji:private: Sends private message. 
Body:
{
  to: nickname: string
  emojiId: id of emoji: number
}
Second param for callback (acknowledgment)

emoji:team: Sends message to user team
Body:
{
  emojiId
}
Second param for callback (acknowledgment)

```

Client accepted socket messages:
```bash

emoji:private: Sends private message. 
Message:
{
  from: nickname: string
  emojiId: id of emoji: number
}

emoji:team: Sends message to user team
Message:
{
  from
  emojiId
}

user:connected: Another teammember is now connected
Message:
{
  username: string, 
  id: string: socket id
}

team:connected: All connected teammates
Message:
{
  teammates: [
    {
      username: string, 
      id: string: socket id
    }
    ...
  ]
}
```

There are more endpoints that are not being used, hence not verified or tested and in consecuence not added to the documentation

## DEMO

Open at least two browsers (incognito and another browser because of localstorage) on localhost:3000 
Use usernames to log in
Team 1: Alan, Kevin, Harriet
Team 2: Jim, Pam, Kelly
Click on any logged user and the emoji with id 1 will be sent.

### Problem

Users aren???t getting into conversations because calling someone feels too ???heavy???.

### Idea

Give users a lightweight way to interact and build social connection without having to get into calls. Hypothesis: lightweight social interactions will be a bridge to getting into conversations.

##

### Proposed solution
Real time chat for emoji sending
- Communication: TCP/Socket
- Library: Socket.io
  - Pros: Lightweight, don't depend that much on third parties
  - Cons: Harder to scale, security concerns
  - Scaling: Redis as pubsub

### Architecture

![App Screenshot](https://i.ibb.co/WpJqhn1/Untitled-Diagram-drawio-drawio.png)

When socket/emoji service needs to scale, Redis is added to handle communication between sockets that live in different servers.
The client handles the emojis and animations on it's own application.

#### Tracked time
Documentation and design thinking: 1.5 hours

Coding: 3+ hours

#### Summary
The first challenge was how the problem should be solved, as a chat or as a typical REST api where the clients receive events when *something* changes. Made the choice of using sockets because I thought of the app as a real-time chat app and the go-to solution to solve something like that is using websockets, keeping the communication as fast and light as possible.

The second challenge found was how to keep the microservices disconnected from each other and to avoid making the communication with the client slower. The jwt token that represents the user has enough information to not make any service calls. If some kind of communication like *something was created/edited* is needed, an event bus would be the solution.

The third challenge was to keep the architecture simple and scalable. This includes the idea of having users and teams service together or not. Considering that user service is/would be also the auth service, it is preferable to keep it separated from any logic/behaviour that could be added to team service in the future. For now teamservice doesn't have any functionality besides retreiving name and emoji for each team (and edit them)

#### Solutions considered
Sockets with in-house solution: Use socket for real time communication built as lightweight as possible to tolerate as much connections as possible, similar would be using sockets with a product like Pusher which uses channels (sockets behind it), this would solve scaling on its own, it may come with its own limitations and costs.
Firebase is another tool that can solve this problem, it's a big platform with a lot of datastore capabilities, in our case we could use Firebase PubSub but that implies accessing the data and handling it directly from the client, not having our backend as an intermediate hence not having validation neither authorization from our side and the blocking issue would be the limitations on topics and suscribers, it's more suited for some kind of streaming ingestion (or even as message ingestion for the chat app). Another possibility could have been Firebase Cloud Messaging but with the track timing, making my own research about the product would have take me a bunch of hours. 
One last solution could be Server-sent events but, it wouldn't be bidirectional, and it has better use cases instead of real time chat apps like feed updating or real time charts. Could have been a solution: client1 makes a request and client2 receives the SSE. But to make the app as fast as possible, websockets were my first approach.

### Others
The code is incomplete, messy, repeated, without logs or real authorization, not all the functionalities were added neither tests and there is no database.