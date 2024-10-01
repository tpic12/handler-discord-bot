// import { WORLD_ENDPOINT, RISE_ENDPOINT, WILDS_ENDPOINT } from "../../config.js";

export const getApiEndpoint = (game) => {
  switch (game) {
    case "world":
      process.env.WORLD_ENDPOINT;
      break;
    case "rise":
      process.env.RISE_ENDPOINT;
      break;
    case "wilds":
      process.env.WILDS_ENDPOINT;
      break;
    default:
      process.env.WORLD_ENDPOINT;
  }
};
