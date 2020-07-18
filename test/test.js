/* Copyright 2020 Drewry Pope
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Twitter from 'twitter-lite';
import {} from 'dotenv/config.js' ;
const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  ACCESS_TOKEN,
  ACCESS_TOKEN_SECRET,
} = process.env;
function newClient(subdomain = 'api') {
  return new Twitter({
    subdomain,
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    access_token_key: ACCESS_TOKEN,
    access_token_secret: ACCESS_TOKEN_SECRET,
  });
}
const client = newClient();
async function verifyCredentials() {
  client.get("account/verify_credentials")
    .then(results => { console.log("results", results); })
    .catch(console.error);
}
async function tweetThreadReply(lastTweetID, thread) {
    let tweetResult = [];
    try {
        for (let i = 0, len = thread.length, replyToId = lastTweetID; i < len; i++) {
            const tweet = await client.post("statuses/update", {
    	        status: thread[i],
    	        in_reply_to_status_id: replyToId,
    	        auto_populate_reply_metadata: true
    	    });
            tweetResult.push(tweet);
    	    console.dir(tweet, {depth:null});
		    replyToId = BigInt(tweet.id);
        }
    } catch (e) {
        console.dir(e, {depth:null});
        tweetResult.push(e);
    }
    return await tweetResult;
}
async function tweetThread(thread) { tweetThreadReply(client, '', thread); }
const outerResults = (async ()=>{
await verifyCredentials(client);
const tweet = await client.post("statuses/update", {
    status: "HELLO WORLD 'AT' " + new Date().toISOString(),
    in_reply_to_status_id: "",
    auto_populate_reply_metadata: true
});
const response = await client.post('friendships/create', {
  screen_name: 'twetJs',
});
return await {"tweet": tweet, "response":  response};
})().then(
    text => {
        console.dir(text, {depth:null});
    },
    err => {
        console.dir(err, {depth:null});
    }
);
console.dir(outerResults,{depth:null});
