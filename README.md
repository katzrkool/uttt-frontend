# UTTT-Frontend
Ultimate Tic Tac Toe React App with Online Multiplayer.

The backend is located at [uttt-backend](https://github.com/lkellar/uttt-backend).

## Installation
First, clone the repo and install dependencies with `yarn`. 

You'll need a `.env.development` and `.env.production` file, each following this example format:

```
REACT_APP_UTTT_BACKEND_URL=https://uttt.example.com/api
REACT_APP_UTTT_FRONTEND_BASE_URL=https://uttt.example.com
REACT_APP_UTTT_FRONTEND_DSN=OPTIONAL_SENTRY_URL
```

If `REACT_APP_UTTT_FRONTEND_DSN` is provided, errors will be reported to Sentry.

Then, run either `yarn start` to spin up the dev server or `yarn build` to create a production build.

