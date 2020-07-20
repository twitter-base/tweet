/* Copyright 2020 Drewry Pope
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Twitter from 'twitter-lite' ; //TODO: extend class somehow
import chunk from '@dezren39/chunk-text';
const updateStatus = async (client , content , id) => {
    return new Promise(async (resolve , reject) => {
        try {
            await resolve(client.post('statuses/update' , {
                status: content || 'HELLO WORLD \'AT\' ' + new Date().toISOString() ,
                in_reply_to_status_id: id || '' ,
                auto_populate_reply_metadata: true
            })) ;
        } catch (err) {
            reject(new Error(err)) ;
        }
    }) ;
};

const parseId = (id) => typeof id === 'undefined' || id === null || id === '' || Number.isNaN(Number.parseInt(id)) ? '' : BigInt(id);

const parseContent = (content) => [content].flat(Infinity).map(x => chunk(x, 234, 2)).flat(Infinity);
1;
const tweetThread = async (content , id , params) => {
    return new Promise(async (resolve , reject) => {
        const client = new Twitter(params) ;
        const tweetResult = [] ;
        const parsedContent = parseContent(content);
        try {
            for (let i = 0 , len = parsedContent.length , in_reply_to_screen_name = '', in_reply_to_status_id = parseId(id) ; i < len ; i++) {
                const tweet = await updateStatus(client , (in_reply_to_screen_name + parsedContent[i]).trim() , in_reply_to_status_id) ;
                console.dir(tweet , {depth:null}) ;
                tweetResult.push(tweet) ;
                in_reply_to_screen_name = '@spongescribe';
                in_reply_to_status_id = parseId(tweet.id) ;
            }
        } catch (e) {
            console.dir(e , {depth:null}) ;
            reject(new Error({tweetResult , e})) ;
        }
        resolve(tweetResult) ;
    }) ;
} ;
const defaults = (inputSubdomain = 'api') => {
    const {
        subdomain ,
        consumer_key ,
        consumer_secret ,
        access_token_key ,
        access_token_secret
    } = process.env ;
    return {
        subdomain : subdomain || inputSubdomain ,
        consumer_key ,
        consumer_secret ,
        access_token_key ,
        access_token_secret
    } ;
} ;
const send = async (content , id , params) => {
    return tweetThread(content, id , params||defaults()) ;
};
export const tweet = { send : send } ;
export default tweet ;
