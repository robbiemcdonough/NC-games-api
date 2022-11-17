const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const { get } = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});
describe("404", () => {
  test("If given bad path returns 404 not found", () => {
    return request(app)
      .get("/12345")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});
describe("/api/categories", () => {
  test("GET:200 responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toBeInstanceOf(Array);
        expect(res.body.categories.length).toBeGreaterThan(0);
        res.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/reviews", () => {
  test("GET:200 responds with an array of review objects added comment_count", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews.length).toBeGreaterThan(0);
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET 200 responds with review object matching specified review_id", () => {
    const REVIEW_ID = 1;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then((res) => {
        expect(res.body.review).toEqual({
          review_id: REVIEW_ID,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("400 review_id is not a number", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("review_id is not a number");
      });
  });
  test("404 review_id is an invalid number", () => {
    return request(app)
      .get("/api/reviews/10000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review_id is not found");
      });
  });
});
