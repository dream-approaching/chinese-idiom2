import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import pinyin from 'pinyin';

import './index.less';

const Home = () => {
  const handleToDictionary = () => {
    Taro.navigateTo({
      url: 'pages/dictionary/index',
    });
  };

  const handleToSolitaire = () => {
    Taro.navigateTo({
      url: 'pages/solitaire/index',
    });
  };

  return (
    <View className="index">
      <View onClick={handleToDictionary}>
        <Text>查成语</Text>
      </View>
      <View onClick={handleToSolitaire}>
        <Text>玩接龙</Text>
      </View>
    </View>
  );
};

export default Home;
