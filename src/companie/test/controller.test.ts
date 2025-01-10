import { createRequest, createResponse } from "node-mocks-http";
import { CompanieCnt } from "../CompanieCnt";
import { logger } from "../../common/logger/logger";

jest.mock("../../common/logger/logger");

describe("CompanieCnt - getOne", () => {
  it("should return the company details successfully", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/companie/1",
      authCompanie: {
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          name: "Test Company",
          email: "test@company.com",
          address: "123 Test St",
          phone: "1234567890",
          password: "hashedPassword",
          token: "activeToken",
        }),
      },
    });
    const res = createResponse();

    await CompanieCnt.getOne(req, res);

    expect(req.authCompanie.toJSON).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      companie: {
        id: 1,
        name: "Test Company",
        email: "test@company.com",
        address: "123 Test St",
        phone: "1234567890",
      },
    });
  });

  it("should return an error if there is an exception", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/companie/1",
      authCompanie: {
        toJSON: jest.fn().mockImplementation(() => {
          throw new Error("Database error");
        }),
      },
    });
    const res = createResponse();

    await CompanieCnt.getOne(req, res);

    expect(req.authCompanie.toJSON).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "There was an error getting the companie",
    });
  });
});

describe("CompanieCnt - update", () => {
  it("should update the company details successfully", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/companie/1",
      body: {
        name: "Updated Company",
        email: "updated@company.com",
        address: "456 Updated St",
        phone: "0987654321",
      },
      authCompanie: {
        update: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          name: "Updated Company",
          email: "updated@company.com",
          address: "456 Updated St",
          phone: "0987654321",
        }),
      },
    });
    const res = createResponse();

    await CompanieCnt.update(req, res);

    expect(req.authCompanie.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      msg: "Companie updated successfully",
    });
  });

  it("should return an error if there is an exception", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/companie/1",
      body: {
        name: "Updated Company",
        email: "updated@company.com",
        address: "456 Updated St",
        phone: "0987654321",
      },
      authCompanie: {
        update: jest.fn().mockRejectedValue(new Error("Database error")),
      },
    });
    const res = createResponse();

    await CompanieCnt.update(req, res);

    expect(req.authCompanie.update).toHaveBeenCalledWith(req.body);
    expect(logger.error).toHaveBeenCalledWith("Error updating company", {
      error: "Database error",
    });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "There was an error updating the companie",
    });
  });
});
