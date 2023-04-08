# Blog Website  with Comment and Connection Section.

To run the code:
-> npm install
-> node app.js

SignUp: You will be first directed to a signup page where you will enter you personal details to create a user.

Home: After successful signup you will be directed to home page, where you will find all bogs listed there. there is also a navbar with  compose, connection and a home button for routing throught out the website.

Compose: Here you can create a post with title and content.

Post: When you are on home page, you can visit every post in detail, and you can comment on post.

Connections: Here you will get your xth level connection list.

TechStack: Node.js, Express.js, MongoDb, Ejs, etc.

Functioning of Connections:
-> Its a graph based algorithm
-> Every person behaves as a vertice
-> when a person post a comment on a blog, a edge is drawn between every other person who has commented on that post and the person
-> Let's say shortest distance between User A and User B is 'x'. then UserA and UserB are a xth level friend.
-> Shortest distace is calculated by BFS algorithm.
