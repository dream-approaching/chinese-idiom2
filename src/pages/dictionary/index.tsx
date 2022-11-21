import { Component } from "react";
import { View, Text, Input } from "@tarojs/components";
import pinyin from "pinyin";
import { idiomArr } from "../../config/idiom";
import {debounce} from '../../utils';
import {Radio} from '../../components'
import styles from "./index.less";

const Dictionary = () => {
  const handleInput = (customEvent) => {
    console.log('%c zjs value:', 'color: #fff;background: #b457ff;', customEvent.detail.value);
    const firstLetter = customEvent.detail.value[0]
    console.log('%c zjs firstLetter:', 'color: #fff;background: #b457ff;', firstLetter);
    const filterArr = idiomArr.filter(item => item[0] === firstLetter)
    console.log('%c zjs filterArr:', 'color: #fff;background: #b457ff;', filterArr);
    // pinyin(firstLetter)
    // console.log('%c zjs pinyin(firstLetter):', 'color: #fff;background: #b457ff;', pinyin(firstLetter || ''));
  }
  return (
    <View className='index'>
      <Input onInput={debounce(handleInput)}></Input>
      <Radio />
    </View>
  );
}

export default Dictionary;