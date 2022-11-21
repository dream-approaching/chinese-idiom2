import { Component } from "react";
import { View, Text, Input } from "@tarojs/components";
import pinyin from "pinyin";
import { idiomArr } from "../../config/idiom";

import "./index.less";

export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {
    console.log('%c zjs pinyin:', 'color: #fff;background: #b457ff;', pinyin);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleInput = (customEvent) => {
    console.log('%c zjs value:', 'color: #fff;background: #b457ff;', customEvent.detail.value);
    const firstLetter = customEvent.detail.value[0]
    console.log('%c zjs firstLetter:', 'color: #fff;background: #b457ff;', firstLetter);
    const filterArr = idiomArr.filter(item => item[0] === firstLetter)
    console.log('%c zjs filterArr:', 'color: #fff;background: #b457ff;', filterArr);
    // pinyin(firstLetter)
    // console.log('%c zjs pinyin(firstLetter):', 'color: #fff;background: #b457ff;', pinyin(firstLetter || ''));
  }

  render() {
    return (
      <View className='index'>
        <Text>成语接龙</Text>
        <Input onInput={this.handleInput}></Input>

      </View>
    );
  }
}
