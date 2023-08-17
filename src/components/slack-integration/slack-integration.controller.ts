import { NextFunction, Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import ApiError from "../../abstractions/ApiError";
import BaseApi from "../BaseApi";
import * as Slack from "@slack/bolt";
import { Coda } from "coda-js";

/**
 * Status controller
 */
export default class SystemStatusController extends BaseApi {
  /**
   *
   */
  public register(): Router {
    this.router.get("/send-message", this.sendMessage);
    this.router.get("/get-coda-doc", this.getCodaDoc);
    this.router.get("/error", this.getError.bind(this));
    return this.router;
  }

  /*
   * This method is used to send message to slack specific channel
   */
  public async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const slackApp = new Slack.App({
        signingSecret: process.env.SLACK_SIGNING_SECCRET,
        token: process.env.SLACK_BOT_TOKEN,
      });
      await slackApp.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.SLACK_CHANNEL,
        // text: "Message to the channel",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here",
            },
            accessory: {
              type: "image",
              image_url:
                "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
              alt_text: "alt text for image",
            },
          },
          {
            type: "divider",
          },
          {
            type: "context",
            elements: [
              {
                type: "image",
                image_url:
                  "https://i.pinimg.com/236x/75/e4/1c/75e41c683ca8302c88c3b061fdde3f97.jpg",
                alt_text: "Vivek Barot",
              },
              {
                type: "mrkdwn",
                text: "Author: Vivek Barot",
              },
            ],
          },
        ],
      });
      res.locals.data = "Success!";
      // call base class method
      super.send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
   * This method is used to get Coda doc
   */
  public async getCodaDoc(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coda = new Coda(process.env.CODA_TOKEN);
      const tableData = await coda.getTable('M-VBZEx9zP','vvk table');
      res.locals.data = tableData;
      // call base class method
      super.send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public getError(req: Request, res: Response, next: NextFunction): void {
    try {
      throw new ApiError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
    } catch (error) {
      // from here error handler will get call
      next(error);
    }
  }
}
