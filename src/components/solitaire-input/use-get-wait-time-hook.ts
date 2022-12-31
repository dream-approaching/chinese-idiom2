import { useInterval } from '@/hooks/index';
import { useRef } from 'react';
import { Max_Idiom_Time } from '@/config/constants';

/**
 * 返回已经等待的时间和设置等待时间的方法
 */
export default function useGetWaitTime() {
  // 使用ref来保存waitTime
  const waitTime = useRef(0);
  const setWaitTime = (time: number) => {
    waitTime.current = time;
  };

  useInterval(() => setWaitTime(waitTime.current + 1), waitTime.current >= Max_Idiom_Time ? null : 1000);

  return { waitTime: waitTime.current, setWaitTime };
}
