import { useState, useEffect, useCallback } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import pinyin from "pinyin";
import { AtSearchBar, AtTag } from "taro-ui";
import HttpRequest from "../../config/request";
import { IdiomApi } from "../../api";
import { AllIdiomList } from "../../config/idiom";
import { useDebounce } from "../../hooks";
import styles from "./index.module.less";
import type {
  IdiomListGetReq,
  IdiomListGetRes,
} from "../../../types/http-types/idiom-list";

const AllIdiomListWithPinyin = AllIdiomList.map((item) => ({
  value: item,
  pinyin: pinyin(item, { style: pinyin.STYLE_NORMAL })[0]?.[0],
}));
const Dictionary = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce<string>(searchValue, 500);

  const handleChange = (value) => {
    setSearchValue(value);
  };

  const [searchArr, setSearchArr] = useState([
    { name: "首音节相同", value: 1, checked: false },
    { name: "首字相同", value: 2, checked: false },
  ]);

  const getResult = useCallback(() => {
    const firstLetter = debouncedValue[0];
    let filterArr: string[] = [];
    const isSameYin = searchArr.find((item) => item.value === 1)?.checked;
    const isSameWord = searchArr.find((item) => item.value === 2)?.checked;
    if (isSameYin) {
      // 搜索框第一个字的拼音
      const searchValueFirstPinyin = pinyin(debouncedValue, {
        style: pinyin.STYLE_NORMAL,
      })[0][0];
      AllIdiomListWithPinyin.forEach((item) => {
        if (item.pinyin === searchValueFirstPinyin) {
          filterArr.push(item.value);
        }
      });
    } else if (isSameWord) {
      filterArr = AllIdiomList.filter((item) => item[0] === firstLetter);
    } else {
      filterArr = AllIdiomList.filter(
        (item) => item.indexOf(debouncedValue) > -1
      );
    }
    setShowArr(filterArr);
  }, [debouncedValue, searchArr]);

  const [showArr, setShowArr] = useState<string[]>([]);
  useEffect(() => {
    if (debouncedValue) {
      getResult();
    }
  }, [debouncedValue, getResult]);

  const handleToggleFilter = async (currentItem) => {
    // const newSearchArr = searchArr.map((item) => {
    //   if (item.value === currentItem.value) {
    //     item.checked = !item.checked;
    //   }
    //   return item;
    // });
    // setSearchArr(newSearchArr);
    const res = await HttpRequest<IdiomListGetReq, IdiomListGetRes["data"]>({
      url: IdiomApi.getList,
      data: {
        word: "一",
      },
    });
    console.log("%c zjs res:", "color: #fff;background: #b457ff;", res);
  };

  const isSearching = !!debouncedValue;
  return (
    <View className="index">
      <AtSearchBar
        value={searchValue}
        onChange={handleChange}
        onActionClick={getResult}
      />
      <View className={styles.tagCon}>
        {searchArr.map((item) => {
          return (
            <AtTag
              circle
              size="small"
              key={item.value}
              active={item.checked}
              className={styles.tag}
              onClick={() => handleToggleFilter(item)}
            >
              {item.name}
            </AtTag>
          );
        })}
      </View>
      {isSearching && showArr.length > 0 && (
        <Text className={styles.title}>搜索结果</Text>
      )}
      {isSearching && (
        <View className={styles.showArrCon}>
          {showArr.length ? (
            showArr.map((item, index) => {
              return (
                <AtTag className={styles.showArrItem} key={index}>
                  {item}
                </AtTag>
              );
            })
          ) : (
            <Text className={styles.noResult}>暂无结果</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Dictionary;
