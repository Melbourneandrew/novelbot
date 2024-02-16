"use server";
import { auth } from "../lib/auth";
import { createAction } from "../lib/CreateAction";
import { ActionRequest } from "@/types";

export const protectedAction = createAction(
  auth,
  (params: ActionRequest) => {
    console.log("protectedAction", params);
    return {
      success: true,
      message: "",
      data: {
        name: "protectedAction",
      },
    };
  }
);
