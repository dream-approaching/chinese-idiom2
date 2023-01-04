import { Text } from '@tarojs/components';
import { useInterval } from '@/hooks/index';
import { useState, useEffect, memo } from 'react';
import { Max_Idiom_Time } from '@/config/constants';

function SolitaireTime({ onTimeout, className }: { className: string; onTimeout: () => void }) {
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    if (waitTime >= Max_Idiom_Time) {
      onTimeout();
    }
  }, [waitTime, onTimeout]);

  useInterval(() => setWaitTime(waitTime + 1), waitTime >= Max_Idiom_Time ? null : 1000);

  return <Text className={className}>{waitTime} s</Text>;
}

export default memo(SolitaireTime);
