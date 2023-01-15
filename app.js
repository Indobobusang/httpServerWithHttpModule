const http = require("http");

const server = http.createServer();

const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
  {
    id: 3,
    name: "new user 1",
    email: "Cod234@gmail.com",
    password: "paswer",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
  {
    id: 3,
    title: "API의 특성",
    ImageUrl: "http://danwd.com",
    userId: 2,
  },
  {
    id: 4,
    title: "Node.js의 특성",
    content: "ss!!",
    userId: 3,
  },
];

const httpRequestListener = function (request, response) {
  const { url, method } = request;
  if (method === "GET") {
    if (url === "/ping") {
      response.writeHead(200, { "Content-type": "application/json" });
      response.end(JSON.stringify({ message: "pong" }));
    } else if (url === "/users/usersPosts") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const usersPosts = [];
        for (i = 0; i < users.length; i++) {
          for (j = 0; j < posts.length; j++) {
            if (users[i].id === posts[j].userId) {
              usersPosts.push({
                userID: users[i].id,
                userName: users[i].name,
                postingId: posts[j].id,
                postingTitle: posts[j].title,
                postingImageUrl: posts[j].ImageUrl,
                postingContent: posts[j].content,
              });
            }
          }
        }
        response.writeHead(200, { "Content-type": "application/json" });
        response.end(JSON.stringify({ usersPosts: usersPosts }));
      });
    }
  } else if (method === "POST") {
    if (url === "/users/signup") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const user = JSON.parse(body);

        users.push({
          id: Number(user.id),
          name: user.name,
          email: user.email,
          password: user.password,
        });

        response.end(JSON.stringify({ message: "userCreated" }));
      });
    } else if (url === "/users/postup") {
      let body = "";
      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const post = JSON.parse(body);

        posts.push({
          id: parseInt(post.id),
          title: post.title,
          content: post.content,
          userId: parseInt(post.userId),
        });
        response.end(JSON.stringify({ message: "postCreated" }));
      });
    }
  } else if (method === "PATCH") {
    if (url === "/users/postsPatch") {
      console.log("postsPatch");

      let body = "";
      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const patch = JSON.parse(body);
        patch.id = parseInt(patch.id);
        for (i = 0; i < posts.length; i++) {
          if (posts[i].id === patch.id) {
            posts[i].content = patch.content;
          }
        }
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ posts: posts }));
      });
    }
  }
};

server.on("request", httpRequestListener);

server.listen(8000, "127.0.0.1", function () {
  console.log("Listening to requests on port 8000");
});
