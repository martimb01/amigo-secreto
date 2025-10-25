import { POST } from "./route";

// --- Mocks ---
// Prevent real DB calls, Don’t import the real connectDB (which connects to MongoDB). Use this fake function that just resolves instantly.
jest.mock("../../../../lib/mongoDbAdvanced", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

// Mock the Mongoose model, User.create() just pretends to succeed instantly
jest.mock("@/models/User", () => ({
  User: {
    // Route checks for duplicates first
    exists: jest.fn().mockResolvedValue(null), // no existing email
    // Then creates the user
    create: jest.fn().mockResolvedValue({
      _id: "123",
      name: "John",
      email: "john@example.com",
    }),
  },
}));

describe("POST /api/users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if any field is missing", async () => {
    const req = new Request("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({ email: "john@example.com" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Cannot have empty fields");
  });

  it("returns 400 for invalid email or password", async () => {
    const req = new Request("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({ name: "John", email: "invalid", password: "123" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toHaveProperty("emailError");
    expect(json.error).toHaveProperty("passwordError");
  });

  it("creates a user successfully", async () => {
    const req = new Request("http://localhost/api/users/register", {
      method: "POST",
      body: JSON.stringify({
        name: "John",
        email: "john@example.com",
        password: "abc123",
      }),
    });

    const res = await POST(req);
    const text = await res.text(); // since you return a string, not JSON

    expect(res.status).toBe(201);
    expect(text).toContain("User created");
  });

  it("returns 409 if email already exists", async () => {
    const { User } = require("@/models/User");
    // Make the existence check truthy for this call
    User.exists.mockResolvedValueOnce(true);

    const req = new Request("http://localhost/api/users/register", {
      method: "POST",
      body: JSON.stringify({
        name: "John",
        email: "john@example.com",
        password: "abc123",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.error).toBe("Email already registered");
  });

  it("returns 500 if connectDB throws", async () => {
    // Force connectDB to throw
    const { connectDB } = require("../../../../lib/mongoDbAdvanced");
    connectDB.mockRejectedValueOnce(new Error("DB fail"));

    const req = new Request("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: "John",
        email: "john@example.com",
        password: "abc123",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to connect to mongoDB");
  });
});
