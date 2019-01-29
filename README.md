# Data Studio Refresher Lambda

This is a ready-to-deploy lambda that can refresh a Google Data Studio dashboard. By using Cloudwatch events to schedule the lambda, one can achieve auto-refreshing for Google Data Studio.

It is forked from [puppeteer-lambda-starter-kit](https://github.com/sambaiz/puppeteer-lambda-starter-kit).

For details, please refer to my [medium post](https://medium.com/@ymcatar/visualization-on-steroid-using-headless-browser-to-auto-refresh-google-data-studio-dashboards-c195e68f10b).

## Instructions

To add a new lambda for auto-refreshing a Google Data Studio Dashboard, please:

- Create a Google account who is the editor for the dashboard;

- Create a new `serverless.config.<dashboard-name>.yml` (clone from `serverless.config.template.yml`) in this directory. Fill in the dashboard URL, the schedule cron expression and the username, password and recovery email (in case Google rejected the login) for the account.

- Run the following commands:

```bash
yarn
yarn global add serverless
sls deploy --name <dashboard-name> --stage prod
```

- To remove the lambda when it's no longer needed:

```
sls remove --name <dashboard-name> --stage prod
```

- To test the script on your local machine and see the script running in Google Chrome:

```
SLOWMO_MS=50 URL=<dashboard URL> G_USERNAME=<google account email address> G_PASSWORD=<google account password> RECOVERY_EMAIL=<recovery email> npm run local
``` 
