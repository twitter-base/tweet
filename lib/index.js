/* Copyright 2020 Drewry Pope
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Twitter from 'twitter-lite' ; //TODO: extend Twitter class
import chunk from '@dezren39/chunk-text' ; //TODO: mainline package changes
const parseContent = content => [content].flat(Infinity).map(x => chunk(x, 280, 2)).flat(Infinity);
async function tweetThread(client, thread, id) {
  let lastTweetID = id || "";
  for (const status of parseContent(thread)) {
    const tweet = await client.post("statuses/update", {
      status: status.toString(),
      in_reply_to_status_id: lastTweetID,
      auto_populate_reply_metadata: true
    });
    lastTweetID = tweet.id_str;
  }
}
const send = async (thread, id, params) => {
    const thread_default = ["I am [pronouns]", "as you are [pronouns]", "as you are [self]", "and we are all together.", "@twetJs #twetJs \n[" + new Date().toISOString() + "]"];
    const client = new Twitter(params);
    tweetThread(client, parseContent([thread || thread_default]), id).catch(console.error);
};
export const tweet = { send : send } ;
export default tweet ;
