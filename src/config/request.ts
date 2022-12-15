import Taro from '@tarojs/taro';
import type TaroType from '@tarojs/taro/types';
import dayjs from 'dayjs';
import { GlobalConfig } from './config';

type TypeHttpRes<T> = {
  code: number;
  data: T;
  message: string;
};

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default <Q, S>(options: TaroType.request.Option<any, Q>) => {
  // 1670+两位随机数
  const prefix = `1670${getRandomNum(10, 99)}`;
  const addonAfter = getRandomNum(111111, 999999);

  return new Promise<TypeHttpRes<S>['data']>((resolve, reject) => {
    Taro.request({
      // url: GlobalConfig.baseUrl + GlobalConfig.apiPrefix + options.url,
      url: GlobalConfig.apiPrefix + options.url,
      method: options.method,
      data: {
        ...options.data,
        sign: `${prefix}${dayjs().valueOf()}${addonAfter}`,
      },
      mode: 'cors',
      header: {
        'Content-Type': 'application/json',
      },
    })
      .then((res: TaroType.request.SuccessCallbackResult<TypeHttpRes<S>>) => {
        const { statusCode, data } = res;
        if (statusCode >= 200 && statusCode < 300) {
          if (data.code !== 200) {
            Taro.showToast({
              title: `${res.data.message}~`,
              icon: 'none',
              mask: true,
            });
            reject();
          }
          resolve(data.data);
        } else {
          reject(`网络请求错误，状态码${statusCode}`);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
