#!/usr/bin/env node
/* Copyright 2020 Drewry Pope
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {} from 'dotenv/config.js' ;
import { tweet } from 'twitter-tweet' ;
const params = ((inputSubdomain = 'api') => {
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
})() ;
(async () => {
  try {
    await tweet.send(
      process.argv[2] || process.env.TWITTER_CONTENT || "HELLO WORLD, 'AT' " + new Date().toISOString() ,
      process.argv[3] || "" ,
      params
    ) ;
  } catch (error) { throw error }
})().catch(e => {console.error(e)}) ;
