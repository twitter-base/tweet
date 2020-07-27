/* Copyright 2020 Drewry Pope
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Twitter from 'twitter-lite'; //TODO: extend Twitter class
import TwitterText from 'twitter-text';
import chunk from '../../chunk-text/dist/index.js'; //TODO: mainline package changes
const parse = (content) => typeof content === 'undefined' || content === null || content === '' ? [] :
    [content]
        .flat(Infinity)
        .map((x) => {
            console.dir(
            [x, chunk(x, 280, { 'charLengthMask': 0, 'charLengthType': 'TextEncoder', 'TextEncoder':
            {
                encode : (text) => {
                    TwitterText.parseTweet(text).permillage * .28;
                }
            }
            })]);
            return chunk(x, 280, { 'charLengthMask': 0, 'charLengthType': 'TextEncoder', 'TextEncoder':
            {
                encode : (text) => {
                    TwitterText.parseTweet(text).permillage * .28;
                }
            }
            });
        })
        .flat(Infinity);
const tweetThread = async (client, thread, id, auto_populate_reply_metadata) => {
    let lastTweetID = id || '';
    for (const status of parse(thread)) {
        const tweet = await client.post('statuses/update', {
            status: status.toString(),
            in_reply_to_status_id: lastTweetID,
            auto_populate_reply_metadata: auto_populate_reply_metadata,
        });
        lastTweetID = tweet.id_str;
    }
};
const send = async (params, thread, id, auto_populate_reply_metadata) => {
    const thread_default = [
        'I am [pronouns]',
        'as you are [pronouns]',
        'as you are [self]',
        'and we are all together.',
        '@twetJs #twetJs \n[' + new Date().toISOString() + ']',
    ];
    const client = new Twitter(params);
    tweetThread(client, parse([thread || thread_default]), id, typeof auto_populate_reply_metadata === 'undefined' || auto_populate_reply_metadata === null ? true : auto_populate_reply_metadata).catch(console.error);
};
export const tweet = { send: send, parse: parse };
export default tweet;
