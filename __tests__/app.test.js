const app = require("../app");
const data = require("../db/data/test-data/index");
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
});
describe("Err /api/topics", () => {
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
        body.forEach((column) => {
          expect(typeof column.author).toBe("string");
          expect(typeof column.title).toBe("string");
          expect(typeof column.article_id).toBe("number");
          expect(typeof column.body).toBe("string");
          expect(typeof column.topic).toBe("string");
          expect(typeof column.created_at).toBe("string");
          expect(typeof column.votes).toBe("number");
          expect(typeof column.article_img_url).toBe("string");
        });
      });
  });
});

describe("Err /api/articles/article_id", () => {
  test("404: responds with error message not found!", () => {
    return request(app)
      .get(`/api/articles/15`)
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
        expect(message).toBe("invalid id type!");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an articles array of article objects and a new comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((column) => {
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
        expect(body).toBeSortedBy("created_at", { descending: true });
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
  })
});
