import { useState, useEffect } from "react";
import { View, Text, Input } from "@tarojs/components";
import pinyin from "pinyin";
import { AtSearchBar } from "taro-ui";
import { idiomArr } from "../../config/idiom";
import { useDebounce } from "../../hooks";
import { Radio } from "../../components";
import styles from "./index.less";

const Dictionary = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce<string>(searchValue, 500);

  const handleChange = (value) => {
    setSearchValue(value);
  };

  useEffect(() => {
    console.log("这里处理请求");
    const firstLetter = debouncedValue[0];
    console.log(
      "%c zjs firstLetter:",
      "color: #fff;background: #b457ff;",
      firstLetter
    );
    const filterArr = idiomArr.filter((item) => item[0] === firstLetter);
    console.log(
      "%c zjs filterArr:",
      "color: #fff;background: #b457ff;",
      filterArr
    );
  }, [debouncedValue]);
  return (
    <View className="index">
      <AtSearchBar
        value={searchValue}
        onChange={handleChange}
        // onActionClick={this.onActionClick.bind(this)}
      />
      <Radio />
    </View>
  );
};

export default Dictionary;
