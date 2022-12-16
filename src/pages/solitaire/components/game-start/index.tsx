import { View, Text } from '@tarojs/components';
import { IdiomBelong } from '@/config/constants';
import styles from './index.module.less';

const GameStart = ({ onGameStart }) => {
  return (
    <View className={styles.gameStartCon}>
      <Text className={styles.gameStartTip}>你好，我是机器人小灵。欢迎来到成语接龙，点击下方按钮选择谁先开始</Text>
      <View className={styles.gameStartCon}>
        <View className={styles.gameStartBtn} onClick={() => onGameStart(IdiomBelong.user)}>
          我先
        </View>
        <View className={styles.gameStartBtn} onClick={() => onGameStart(IdiomBelong.robot)}>
          小灵先
        </View>
      </View>
    </View>
  );
};

export default GameStart;
