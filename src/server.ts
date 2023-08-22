import Environment from "./environments/environment";
import { setGlobalEnvironment } from "./global";
import App from "./app";
import * as http from "http";
import { AddressInfo } from "net";
import cron from "node-cron";
import fs from "fs";
import SlackIntegrationController from "./components/slack-integration/slack-integration.controller";

const env: Environment = new Environment();
setGlobalEnvironment(env);
const app: App = new App();
let server: http.Server;
import logger from "./lib/logger";

let previousRowContent = [];

cron.schedule("*/10 * * * * *", async () => {
  console.log("In scheduler");
  // cron.schedule("0 */" + process.env.CRON_TIMER + " * * *", async () => {
  let tableData;
  const slackIntegrationController: SlackIntegrationController =
    new SlackIntegrationController();
  readFile();
  const res = await slackIntegrationController._getCodaDocument();
  tableData = { res };
  const docIds = [];
  tableData.res.forEach((element) => {
    docIds.push(element.id);
  });
  if (
    previousRowContent.length !== docIds.length ||
    !arraysEqual(previousRowContent, docIds)
  ) {
    previousRowContent = [];
    tableData.res.forEach((element) => {
      previousRowContent.push(element.id);
    });
    writeFile(previousRowContent);
    await slackIntegrationController._sendSlackMessage();
  }
});

function arraysEqual(array1, array2) {
  return JSON.stringify(array1) === JSON.stringify(array2);
}

function writeFile(data) {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFile("rowCount.json", jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    }
  });
}

function readFile() {
  fs.readFile("rowCount.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
    } else {
      try {
        const jsonData = JSON.parse(data); // Parse the JSON data
        previousRowContent = jsonData;
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
      }
    }
  });
}

function serverError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  // handle specific error codes here.
  throw error;
}

function serverListening(): void {
  const addressInfo: AddressInfo = <AddressInfo>server.address();
  logger.info(`Listening on ${addressInfo.address}:${env.port}`);
}

app
  .init()
  .then(() => {
    app.express.set("port", env.port);

    server = app.httpServer;
    server.on("error", serverError);
    server.on("listening", serverListening);
    server.listen(env.port);
  })
  .catch((err: Error) => {
    logger.info("app.init error");
    logger.error(err.name);
    logger.error(err.message);
    logger.error(err.stack);
  });

process.on("unhandledRejection", (reason: Error) => {
  logger.error("Unhandled Promise Rejection: reason:", reason.message);
  logger.error(reason.stack);
  // application specific logging, throwing an error, or other logic here
});
