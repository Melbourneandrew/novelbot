import {
  ActionRequest,
  ActionResponse,
  SessionTokenInterface,
} from "@/types";
import connectToDB from "./db";
export function createAction(
  authFunction: () => SessionTokenInterface | boolean,
  acitonFunction: (params: ActionRequest) => ActionResponse
): (params: ActionRequest) => Promise<ActionResponse> {
  return async (params: ActionRequest) => {
    await connectToDB();

    //Authenticate user (if needed)
    if (authFunction) {
      params.session = authFunction();
    }
    if (params.session === false) {
      return {
        success: false,
        message: "You are not logged in",
        data: null,
      } as ActionResponse;
    }

    return acitonFunction(params);
  };
}
