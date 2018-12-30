import {commonParams} from './config';
import axios from 'axios';

export function getLyric(mid) {
  const url = '/api/lyric';
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
};

export function getSongVkey(mid) {
  const url = '/api/vkey';
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    uin: 0,
    needNewCode: 0,
    cid: 205361747,
    guid: 1382730696,
    filename: `C400${mid}.m4a`,
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
};
