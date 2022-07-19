import { createStore, createLogger } from "vuex";
import mTheme from "./modules/mTheme";

const debug = process.env.NODE_ENV !== "production";
// console.log(process.env.NODE_ENV);
export default createStore({
  modules: {
    mTheme,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
