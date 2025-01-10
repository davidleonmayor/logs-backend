import { createRequest, createResponse } from "node-mocks-http";
import { AuthCnt } from "../AuthCnt";
import Companie from "../../../db/models/Companie";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

jest.mock("../../../db/models/Companie");
jest.mock("../utils/auth");
jest.mock("../utils/token");
jest.mock("../utils/jwt");
jest.mock("../../../emails/AuthEmail");

describe("AuthCnt - create", () => {
  it("should create a new company", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        name: "Test Company",
        email: "test@test.com",
        password: "password",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue(null);
    (Companie.create as jest.Mock).mockResolvedValue({
      save: jest.fn(),
      name: "Test Company",
      email: "test@test.com",
      password: "hashedPassword",
      token: "generatedToken",
    });
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    (generateToken as jest.Mock).mockReturnValue("generatedToken");
    (AuthEmail.sendConfirmationEmail as jest.Mock).mockResolvedValue(true);

    await AuthCnt.create(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { name: "Test Company" },
    });
    expect(Companie.create).toHaveBeenCalledWith({
      name: "Test Company",
      email: "test@test.com",
      password: "password",
    });
    expect(hashPassword).toHaveBeenCalledWith("password");
    expect(generateToken).toHaveBeenCalled();
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
      name: "Test Company",
      email: "test@test.com",
      token: "generatedToken",
    });
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      msg: "Companie created successfully, now verify your! Check your email...",
    });
  });

  it("should return an error if the company name already exists", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        name: "Existing Company",
        email: "existing@test.com",
        password: "password",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue({
      name: "Existing Company",
    });

    await AuthCnt.create(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { name: "Existing Company" },
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Companie name already exists",
    });
  });

  it("should return an error if there is an exception", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        name: "Test Company",
        email: "test@test.com",
        password: "password",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await AuthCnt.create(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { name: "Test Company" },
    });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "There was an error creating the companie",
    });
  });
});

describe("AuthCnt - confirmAccount", () => {
  it("should confirm the account successfully", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/confirm-account",
      body: {
        token: "validToken",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue({
      update: jest.fn().mockResolvedValue(true),
    });

    await AuthCnt.confirmAccount(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { token: "validToken" },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      msg: "Account confirmed successfully",
    });
  });

  it("should return an error if the token is invalid", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/confirm-account",
      body: {
        token: "invalidToken",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue(null);

    await AuthCnt.confirmAccount(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { token: "invalidToken" },
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: "Invalid token" });
  });

  it("should return an error if there is an exception", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/confirm-account",
      body: {
        token: "validToken",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await AuthCnt.confirmAccount(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { token: "validToken" },
    });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "There was an error confirming the account",
    });
  });
});

describe("AuthCnt - login", () => {
  it("should log in the company successfully", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@test.com",
        password: "password",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: "hashedPassword",
      token: "active",
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        email: "test@test.com",
        name: "Test Company",
      }),
    });
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue("generatedJWT");

    await AuthCnt.login(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { email: "test@test.com" },
    });
    expect(checkPassword).toHaveBeenCalledWith("password", "hashedPassword");
    expect(generateJWT).toHaveBeenCalledWith({
      id: 1,
      email: "test@test.com",
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ token: "generatedJWT" });
  });

  it("should return an error if the email is not found", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "notfound@test.com",
        password: "password",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue(null);

    await AuthCnt.login(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { email: "notfound@test.com" },
    });
    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({ error: "E-mail not found" });
  });

  it("should return an error if the account is inactive", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "inactive@test.com",
        password: "password",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue({
      email: "inactive@test.com",
      password: "hashedPassword",
      token: "inactive",
    });

    await AuthCnt.login(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { email: "inactive@test.com" },
    });
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: "Unactive account" });
  });

  it("should return an error if the password is incorrect", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@test.com",
        password: "wrongpassword",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockResolvedValue({
      email: "test@test.com",
      password: "hashedPassword",
      token: "active",
    });
    (checkPassword as jest.Mock).mockResolvedValue(false);

    await AuthCnt.login(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { email: "test@test.com" },
    });
    expect(checkPassword).toHaveBeenCalledWith(
      "wrongpassword",
      "hashedPassword"
    );
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: "Invalid password" });
  });

  it("should return an error if there is an exception", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@test.com",
        password: "password",
      },
    });
    const res = createResponse();

    // Mock the necessary functions
    (Companie.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await AuthCnt.login(req, res);

    expect(Companie.findOne).toHaveBeenCalledWith({
      where: { email: "test@test.com" },
    });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "There was an error logging in the companie",
    });
  });
});
