import { Client, Collection } from "discord.js";
import DisTube from "distube";
import config from "./config";

declare class MainClient extends Client {
  distube: DisTube;
  config: config;
  /**
   * example: "userid" => {"name1": 2, "name2": 5}
   */
  songHistory: Collection<string, Collection<string, number>>;

  addToSongHistory(userid: string, name: string);
  setSongHistory(userid: string, data: Collection<string, number>);
  getSongHistory(userid: string): Collection<string, number>;
  log(message: string);
  warn(message: string);
  err(message: string);
}

interface config {
  token: string
  leave_empty: boolean,  // leave voice channel when empty
  leave_finish: boolean, // leave voice channel when finished
  leave_stop: boolean,    // leave voice channel when stopped

  OWNER_ID: string,
  color: string
}