#!/usr/bin/env node
/* Author: Drewry Pope
 * Any copyright is dedicated to the Public Domain.
 * https://creativecommons.org/publicdomain/zero/1.0/ */
import { sleepWithLog } from 'sleep-atomic'
sleepWithLog((process.argv[2] || process.env.SLEEP_SECONDS || 10) * 1000);
