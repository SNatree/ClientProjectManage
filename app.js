const fs = require("fs");
const path = require("path");
const express = require("express");
const { createServer: createViteServer } = require("vite");
// const mode = process.env.MODE || "development";
// process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
// console.log('process.env. :>> ', process.env);

async function createServer(mode) {
  const app = express();
  app.use(express.static(path.resolve(`./dist/${mode}/dist`)));
  // Create Vite server in middleware mode. This disables Vite's own HTML
  // serving logic and let the parent server take control.
  //
  // In middleware mode, if you want to use Vite's own HTML serving logic
  // use `'html'` as the `middlewareMode` (ref https://vitejs.dev/config/#server-middlewaremode)
  const vite = await createViteServer({
    server: { middlewareMode: "ssr" },
    mode: mode,
  });
  // console.log("vite :>> ", vite.config.env);
  // use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    // serve index.html - we will tackle this next
    const url = req.originalUrl;

    const template = fs.readFileSync(path.resolve(`./dist/${mode}/dist/index.html`), "utf-8");
    // req.setHeader('Content-Type', 'text/javascript')
    res.status(200).set({ "Content-Type": "text/html" }).end(template);
  });

  //   app.listen(3000);
  // console.log("vite.config :>> ", vite.config);
  const env = vite.config.env;
  const HOST = env.VITE_HOST;
  const PORT = +env.VITE_PORT;
  const SHCEMA = env.VITE_USESSL === true ? "https://" : "http://";
  app.listen(PORT, HOST, () => {
    console.log(`Listening on ${SHCEMA}${HOST}:${PORT}`);
  });
}

const argvs = process.argv[process.argv.length - 1].split("--");
const run_mode = argvs[1];
createServer(run_mode);
