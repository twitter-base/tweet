/* Copyright 2020 Drewry Pope
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Twitter from 'twitter-lite'; //TODO: extend Twitter class
import TwitterText from 'twitter-text';
import chunk from '@dezren39/chunk-text'; //TODO: mainline package changes
// polyfill & 'custom method for standard object' sections
if (!Object.prototype.hasOwnProperty.call(RegExp, 'escape')) {
  RegExp.escape = function(string) {
    // https:// developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    // https:// github.com/benjamingr/RegExp.escape/issues/37
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  };
}
if (!Object.prototype.hasOwnProperty.call(String, 'replaceAll')) {
  String.prototype.replaceAll = function(find, replace) {
    // https:// developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
    // If you pass a RegExp to 'find', you _MUST_ include 'g' as a flag.
    // TypeError: "replaceAll must be called with a global RegExp" not included, will silently cause significant errors. _MUST_ include 'g' as a flag for RegExp.
    // String parameters to 'find' do not require special handling.
    // Does not conform to "special replacement patterns" when "Specifying a string as a parameter" for replace
    // Does not conform to "Specifying a function as a parameter" for replace
    return this.replace(
          Object.prototype.toString.call(find) == '[object RegExp]' ?
            find :
            new RegExp(RegExp.escape(find), 'g'),
          replace
        );
  }
}
const parse = (content) => typeof content === 'undefined' || content === null || content === '' ? [] :
    [content]
        .flat(Infinity)
        .map((x) => {
           console.dir(
                [x, TwitterText.parseTweet(x).permillage * 0.28, chunk(x.replaceAll(/\s\n\s/g, ' \n'), 240, { 'charLengthMask': 0, 'charLengthType': 'TextEncoder', 'textEncoder':
            {
                encode : (text) => {
                    return { length:  TwitterText.parseTweet(text).permillage * 0.28 };
                }
            }
                }).map(y => TwitterText.parseTweet(y).permillage * 0.28 ),
                 chunk(x.replaceAll(/\s\n\s/g, ' \n'), 1, { 'charLengthMask': 0, 'charLengthType': 'TextEncoder', 'textEncoder':
            {
                encode : (text) => {
                    return { length:  TwitterText.parseTweet(text).permillage * 0.28 };
                }
            }
                }).map(y => TwitterText.parseTweet(y).permillage * 0.28 ),
                ], {depth: null});
            return chunk(x.replaceAll(/\s\n\s/g, ' \n'), 240, { 'charLengthMask': 0, 'charLengthType': 'TextEncoder', 'textEncoder':
            {
                encode : (text) => {
                    return { length:  TwitterText.parseTweet(text).permillage * 0.28 };
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
