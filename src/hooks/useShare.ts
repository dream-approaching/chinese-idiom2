import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';

const useShare = () => {
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '成语接龙，试试可以接几个',
      path: '/pages/index/index',
    };
  });

  useShareTimeline(() => {
    return {
      title: '成语接龙，试试可以接几个',
      path: '/pages/index/index',
    };
  });
};

export default useShare;
