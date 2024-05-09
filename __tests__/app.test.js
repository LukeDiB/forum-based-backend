const app = require("../app");
const data = require("../db/data/development-data/index");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with array of topic objects with slug & description objects", () => {
    return request(app)
      .get(`/api/topics`)
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
  test("404: responds with error message not found!", () => {
    return request(app)
      .get(`/api/topicss!?`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("path not found!");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object describing all available endpoints on api", () => {
    return request(app)
      .get(`/api`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an object with all relevant properties", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("404: responds with error message not found!", () => {
    return request(app)
      .get(`/api/articles/1534567456`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("id not found!");
      });
  });
  test("400: responds with error message when passed the incorrect type!", () => {
    return request(app)
      .get(`/api/articles/not-a-number`)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input!");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an articles array of article objects and a new comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(37);
        articles.forEach((column) => {
          expect(typeof column.author).toBe("string");
          expect(typeof column.title).toBe("string");
          expect(typeof column.article_id).toBe("number");
          expect(typeof column.topic).toBe("string");
          expect(typeof column.created_at).toBe("string");
          expect(typeof column.votes).toBe("number");
          expect(typeof column.article_img_url).toBe("string");
          expect(typeof column.comment_count).toBe("string");
        });
      });
  });
  test("200: sorts the data by default by created_at in descending", () => {
    return request(app)
      .get(`/api/articles?sort_by=created_at`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: invalid endpoint", () => {
    return request(app)
      .get(`/api/articlesssss`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("path not found!");
      });
  });
  test("400: responds with error message when passed with a bad query", () => {
    return request(app)
      .get(`/api/articles?sort_by=created_attttt`)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid query type!");
      });
  });
  test("400: responds with error message when passed bad order query", () => {
    return request(app)
      .get(`/api/articles?order=des`)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("bad order!");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200:responds with comments for specific article_id", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({ body }) => {
        body.forEach((column) => {
          expect(typeof column.comment_id).toBe("number");
          expect(typeof column.votes).toBe("number");
          expect(typeof column.created_at).toBe("string");
          expect(typeof column.author).toBe("string");
          expect(typeof column.body).toBe("string");
          expect(typeof column.article_id).toBe("number");
        });
      });
  });
  test("200: sorts by data by default with newest comment first", () => {
    return request(app)
      .get(`/api/articles/1/comments?sort_by=created_at`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: invalid endpoint", () => {
    return request(app)
      .get(`/api/articles/1/commentsss`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("path not found!");
      });
  });
  test("400: responds with error message when passed the incorrect type!", () => {
    return request(app)
      .get(`/api/articles/not-a-number/comments`)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input!");
      });
  });
  test("404: responds with error message not found when article_id not found", () => {
    return request(app)
      .get(`/api/articles/4000/comments`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("id not found!");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    return request(app)
      .post(`/api/articles/1/comments`)
      .send({
        body: "swordfish",
        author: "jessjelly",
        article_id: 1,
      })
      .expect(201)
      .then((comment) => {
        expect(comment.text).toBe("swordfish");
      });
  });
  test("404: responds with username not found if author is not in the db", () => {
    return request(app)
      .post(`/api/articles/1/comments`)
      .send({
        body: "swordfish",
        votes: 0,
        author: "not_butter_bridge",
        article_id: 1,
        created_at: "1995-12-17T03:24:00",
      })
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("user not found!");
      });
  });
  test("400: responds with -body must be filled!- when body is empty", () => {
    return request(app)
      .post(`/api/articles/1/comments`)
      .send({
        body: "",
        author: "jessjelly",
        article_id: 1,
      })
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("body must be filled!");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: responds with the updated article", () => {
    const newVote = 100;
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_img_url:
            "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
          author: "jessjelly",
          body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          comment_count: "8",
          created_at: "2020-11-07T06:03:00.000Z",
          title: "Running a Node App",
          topic: "coding",
          votes: 100,
          article_id: 1
        });
      });
  });
  test("400: sends error when inc_votes is not a number", () => {
    const newVote = "not-a-number";
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: newVote })
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input!");
      });
  });
  test("400: sends error when article_id is not a number", () => {
    const newVote = 100;
    return request(app)
      .patch(`/api/articles/not-a-number`)
      .send({ inc_votes: newVote })
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input!");
      });
  });
  test("404: responds with article not found! when input an incorrect article_id", () => {
    const newVote = 100;
    return request(app)
      .patch(`/api/articles/1000`)
      .send({ inc_votes: newVote })
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found!");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: responds with no content", () => {
    return request(app).delete(`/api/comments/1`).expect(204);
  });
  test("404: responds with error message not found!", () => {
    return request(app)
      .delete(`/api/comments/1500`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("id not found!");
      });
  });
  test("400: responds with error message when passed the incorrect type!", () => {
    return request(app)
      .delete(`/api/comments/not-a-number`)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input!");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with all users username, name, avatar_url", () => {
    return request(app)
      .get(`/api/users`)
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(6);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("404: responds with error message not found!", () => {
    return request(app)
      .get(`/api/usersss`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("path not found!");
      });
  });
});

describe("GET /api/articles?topics=", () => {
  test("200: serves articles with queried topic", () => {
    return request(app)
      .get(`/api/articles?topic=coding`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(typeof article.title).toBe("string"),
            expect(article.topic).toBe("coding"),
            expect(typeof article.author).toBe("string"),
            expect(typeof article.body).toBe("string"),
            expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  test("404: invalid endpoint", () => {
    return request(app)
      .get(`/api/articlesssss?topic=cats`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("path not found!");
      });
  });
  test("404: responds with error message when passed a topic that doesn't have any articles related to it", () => {
    return request(app)
      .get(`/api/articles?topic=catssss`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("data not found!");
      });
  });
  // test("204: responds with no content when passed a valid topic that has no articles related to it", () => {
  //   return request(app).get(`/api/articles?topic=paper`).expect(204);
  // });
});

describe("GET /api/articles/:article_id + comment_count", () => {
  test("200: responds with an article with the related article_id and adds a comment count", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article.comment_count).toBe("string");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with user with related username", () => {
    return request(app)
      .get(`/api/users/jessjelly`)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(typeof user.username).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
        expect(typeof user.name).toBe("string");
      });
  });
  test("404: responds with an error message user not found!", () => {
    return request(app)
      .delete(`/api/users/not-a-real-user`)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("path not found!");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: updates the votes", () => {
    const newVote = 100;
    return request(app)
      .patch(`/api/comments/1`)
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: 1,
          body: "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
          article_id: 18,
          author: "tickle122",
          votes: 99,
          created_at: "2020-05-21T22:19:00.000Z",
        });
      });
  });
  test("400: sends error when inc_votes is not a number", () => {
    const newVote = "not-a-number";
    return request(app)
      .patch(`/api/comments/1`)
      .send({ inc_votes: newVote })
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input!");
      });
  });
  test("400: sends error when comment_id is not a number", () => {
    const newVote = 100;
    return request(app)
      .patch(`/api/comments/not-a-number`)
      .send({ inc_votes: newVote })
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid input!");
      });
  });
  test("404: responds with comment not found! when input an incorrect comment_id", () => {
    const newVote = 100;
    return request(app)
      .patch(`/api/comments/1000`)
      .send({ inc_votes: newVote })
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("comment not found!");
      });
  });
});
