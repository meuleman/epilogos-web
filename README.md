# Epilogos

This document serves as a description of development and deployment targets for the Epilogos web application.

## Development

To have webpack watch changes to the `src/client/app` folder during development, run the following command:

```
$ npm run dev
```

This will keep it running and rebuilding a development bundle until you type Cmd-C.

## Production

When ready to deploy:

```
$ npm run build
```

This bundles the compiled `src/client/app/*.jsx` files into a finished `bundle.js` payload.
