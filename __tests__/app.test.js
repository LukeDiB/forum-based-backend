const app = require("../db/app");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");

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
