const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

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

describe("/api/review/:review_id/comments", () => {
  test("GET 200 responds with comments array of specified review_id", () => {
    const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body.review).toBeInstanceOf(Array);
        expect(res.body.review.length).toBeGreaterThan(0);
        res.body.review.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: REVIEW_ID,
          });
        });
      });
  });
  test("400 review_id is not a number", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("review_id is not a number");
      });
  });
  // test("404 review_id is an invalid number", () => {
  //   return request(app)
  //     .get("/api/reviews/10000/comments")
  //     .expect(404)
  //     .then((res) => {
  //       expect(res.body.msg).toBe("review_id is not found");
  //     });
  // });
});
describe("POST /api/reviews/:review_id/comments", () => {
  test("POST 201 responds with posted comment", () => {
    const REVIEW_ID = 2;
    return request(app)
      .post(`/api/reviews/${REVIEW_ID}/comments`)
      .send({ username: "bainesface", body: "hello" })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          review_id: REVIEW_ID,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400 username is invalid", () => {
    const REVIEW_ID = 2;
    return request(app)
      .post(`/api/reviews/${REVIEW_ID}/comments`)
      .send({ username: "robbie", body: "hello" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid username");
      });
  });
  test("400 bad request", () => {
    const REVIEW_ID = 2;
    return request(app)
      .post(`/api/reviews/${REVIEW_ID}/comments`)
      .send({ username: "bainesface" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("400 review_id is not a number", () => {
    return request(app)
      .post("/api/reviews/banana/comments")
      .send({ username: "bainesface", body: "hello" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("review_id is not a number");
      });
  });
  test("404 review_id is an invalid number", () => {
    return request(app)
      .post("/api/reviews/10000/comments")
      .send({ username: "bainesface", body: "hello" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review_id is not found");
      });
  });
  test("400 bad request", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ body: "hello" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
describe("PATCH /api/reviews/review_id", () => {
  test("200 update vote count by 1", () => {
    const REVIEW_ID = 2;
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send({ inc_vote: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
          review_id: REVIEW_ID,
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 6,
        });
      });
  });
  test("200 decrement vote count to negative integer", () => {
    const REVIEW_ID = 2;
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send({ inc_vote: -105 })
      .expect(200)
      .then((res) => {
        expect(res.body.review.votes).toBe(-100);
      });
  });
  test("400 review_id not a number", () => {
    return request(app)
      .patch("/api/reviews/banana")
      .send({ inc_vote: 1 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("review_id is not a number");
      });
  });
  test("400 bad request when sent object with no inc_vote key", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ vote: 1 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("400 bad request when inc_vote value is NaN", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_vote: "banana" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("404 when review_id number is invalid", () => {
    return request(app)
      .patch("/api/reviews/10000")
      .send({ inc_vote: 1 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review_id is not found");
      });
  });
});
