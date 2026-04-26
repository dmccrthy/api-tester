import Database from "./controllers/Database.ts";
import EndpointModel from "./models/EndpointModel.ts";

console.log(await EndpointModel.fetchEndpoints());
Database.close();
