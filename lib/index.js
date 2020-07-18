/* Copyright 2020 Drewry Pope
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Twitter from 'twitter-lite' ; //TODO: extend class somehow
const updateStatus = (client , content , id) => {
  return new Promise((resolve , reject) => {
      try {
        resolve(client.post("statuses/update" , {
          status: content || "HELLO WORLD 'AT' " + new Date().toISOString() ,
          in_reply_to_status_id: id || "" ,
          auto_populate_reply_metadata: true
        })) ;
      } catch (err) {
        reject(new Error(err)) ;
      }
    }) ;
}
const tweetThread = async (content , id , params) => {
  return new Promise(async (resolve , reject) => {
    const client = new Twitter(params) ;
    const tweetResult = [] ;
    try {
      for (let i = 0 , len = content.length , in_reply_to_status_id = id ; i < len ; i++) {
        const tweet = await updateStatus(client , content[i] , in_reply_to_status_id) ;
        console.dir(tweet , {depth:null}) ;
        tweetResult.push(tweet) ;
        in_reply_to_status_id = BigInt(tweet.id) ;
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
     return tweetThread([content] , id , params||defaults()) ;
}
export const tweet = { send : send } ;
export default tweet ;
