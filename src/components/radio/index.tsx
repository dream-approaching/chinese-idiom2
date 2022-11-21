import { Component } from "react";
import { View, Text, Input } from "@tarojs/components";
import "./index.less";

const Radio = () => {
  return (
    <View className='radio-container'>
        <input className='radio-input' id='radio-input-apples' type='radio' name='fruit' />
        <label className='radio' htmlFor='radio-input-apples'>
          Apples
        </label>
        <input className='radio-input' id='radio-input-oranges' type='radio' name='fruit' />
        <label className='radio' htmlFor='radio-input-oranges'>
          Oranges
        </label>
      </View>
  );
}

export default Radio;