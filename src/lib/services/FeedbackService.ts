import { IFeedback, Feedback } from "../models/Feedback";
import { IUser } from "../models/User";
import { sendEmail } from "../util/email";
import * as EventService from "../services/EventService";

export async function createFeedback(
  message: string,
  requestHistory: string[],
  user: IUser
) {
  console.log(requestHistory);
  Feedback.create({
    userMessage: message,
    requestHistory: requestHistory,
    user: user,
  });

  EventService.createFeedbackEvent(message, user);
  sendEmail(
    "melbourneandrew@gmail.com",
    "Novelbot User Feedback",
    "User deposited message: \n" + message
  );
}
export async function findFeedbackById(feedbackId: string): Promise<IFeedback> {
  return (await Feedback.findById(feedbackId).populate("user")) as IFeedback;
}

export async function findAllFeedback(): Promise<IFeedback[]> {
  return await Feedback.find().populate("user");
}
