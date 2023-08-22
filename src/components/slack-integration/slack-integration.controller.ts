import { NextFunction, Request, Response, Router } from "express";
import BaseApi from "../BaseApi";
import * as Slack from "@slack/bolt";
import { Coda } from "coda-js";

/**
 * Status controller
 */
export default class SlackIntegrationController extends BaseApi {
  /**
   *
   */
  public register(): Router {
    this.router.get("/send-message", this.sendMessage);
    this.router.get("/get-coda-doc", this.getCodaDoc);
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
      const slackIntegrationController: SlackIntegrationController =
        new SlackIntegrationController();
      await slackIntegrationController._sendSlackMessage();
      res.locals.data = "Message sent successfully";
      // call base class method
      super.send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  public async _sendSlackMessage(): Promise<void> {
    try {
      const slackApp = new Slack.App({
        signingSecret: process.env.SLACK_SIGNING_SECCRET,
        token: process.env.SLACK_BOT_TOKEN,
      });
      await slackApp.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.SLACK_CHANNEL,
        text: "Updated!",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Hello, Your list has been updated.\n\n *Please Check*`,
            },
          }
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  /*
   * This method is used to get Coda doc
   */
  public async getCodaDoc(
    req?: Request,
    res?: Response,
    next?: NextFunction
  ): Promise<void> {
    try {
      const slackIntegrationController: SlackIntegrationController =
        new SlackIntegrationController();
      const tableData = await slackIntegrationController._getCodaDocument();
      res.locals.data = tableData;
      // call base class method
      super.send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  public async _getCodaDocument() {
    console.log("_getCodaDocument");
    console.log(process.env.CODA_TOKEN);
    try {
      const coda = new Coda(process.env.CODA_TOKEN);
      const tableData = await coda.getTable("M-VBZEx9zP", process.env.TABLE_NAME);
      const rows = await tableData.listRows({
        useColumnNames: true
      });
      return rows;
    } catch (err) {
      console.log(err);
    }
  }
}
