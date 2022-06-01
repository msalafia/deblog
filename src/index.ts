export * from "./types";

import {createDeblog, getDeblog, getDeblogs, clearDeblogs} from "./create_deblog";

export {createDeblog, getDeblog, getDeblogs, clearDeblogs};

const deblog = {createDeblog, getDeblog, getDeblogs, clearDeblogs};

export default deblog;