//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
// mongoose.connect("mongodb://localhost:27017/personDB", { useNewUrlParser: true });
const postSchema = {
  title: String,
  content: String,
  comments_email:[String],
  comments:[String],
};
const personSchema = {
  firstName: String,
  lastName: String,
  email: String
};
const Post = mongoose.model("Post", postSchema);
const Person = mongoose.model("Person", personSchema);

class Graph {
  constructor() {
      this.vertices = [];
      this.adjacent = {};
      this.edges = 0;
  }

  addVertex(v) {
      this.vertices.push(v);
      this.adjacent[v] = [];
  }

  addEdge(v, w) {
      this.adjacent[v].push(w);
      this.adjacent[w].push(v);
      this.edges++;
  }

  bfs(goal, root = this.vertices[0]) {
    let adj = this.adjacent;

    const queue = [];
    queue.push(root);

    const discovered = [];
    discovered[root] = true;

    const edges = [];
    edges[root] = 0;

    const predecessors = [];
    predecessors[root] = null;

    const buildPath = (goal, root, predecessors) => {
        const stack = [];
        stack.push(goal);

        let u = predecessors[goal];

        while(u != root) {
            stack.push(u);
            u = predecessors[u];
        }

        stack.push(root);

        let path = stack.reverse().join('-');

        return path;
    }


    while(queue.length) {
        let v = queue.shift();

        if (v === goal) {
            return { 
                distance: edges[goal],
                path: buildPath(goal, root, predecessors)
            };
        }

        for (let i = 0; i < adj[v].length; i++) {
            if (!discovered[adj[v][i]]) {
                discovered[adj[v][i]] = true;
                queue.push(adj[v][i]);
                edges[adj[v][i]] = edges[v] + 1;
                predecessors[adj[v][i]] = v;
            }
        }
    }

    return false;
}
}


g = new Graph();
const allEmails = [];
app.get("/", function (req, res) {
  res.render("signup");
});

app.post("/", function (req,res) {
  // const person = new Person({
  //   firstName: req.body.fname,
  //   lastName: req.body.lname,
  //   email: req.body.email
  // });
  g.addVertex(req.body.email);
  allEmails.push(req.body.email);
  // person.save(function(err){
  //   if (!err){
  //       res.redirect("/home");
  //   }
  // });
  res.redirect("/home");
});

app.get("/home", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/home");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
      PostId: requestedPostId 
    });
  });

});
app.post("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  const addedcomment = req.body.comment;
  const personEmail = req.body.email;
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    post.comments.push(addedcomment),
    post.comments_email.push(personEmail);
  });
  
  res.redirect("/home");
});

app.get("/connection/", function (req, res) {
  const srcemail = allEmails[0];
    Post.find({}, async function(err, posts){
      let sz = posts.length;
      for (var i = 0; i < sz; i++){
        let sz2 = posts[i].comments_email.length;
        for (var j = 0; j < sz2; j++){
          for (var k = j + 1; k < sz2; k++){
            if (posts[i].comments_email[j] != posts.comments_email[k]) {
              console.log
              g.add_edge(posts[i].comments_email[j], posts[i].comments_email[k]);
            }
          }
        }
      }
      const res2 = [];
      for (var i = 0; i < allEmails.length; i++){
        if (srcemail != allEmails[i]) {
          const x = g.bfs(srcemail, allEmails[i]);
          if (x != false) {
            res2.push({
              distance: x.distance,
              goal: allEmails[i]
            })
          }
        }
      }
      // console.log(srcemail);
      res.render("connection", {
        res_arr: res2,
        src: srcemail,
      });

    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
