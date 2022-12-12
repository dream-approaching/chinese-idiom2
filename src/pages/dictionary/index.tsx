import { useState, useEffect, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import { IdiomItem } from '@/components/index';
import HttpRequest from '@/config/request';
import pinyin from 'pinyin';
import { AtSearchBar, AtTag } from 'taro-ui';
import { IdiomApi } from '@/api/index';
import { useDebounce } from '@/hooks/index';
import type { IdiomListGetReq, IdiomListGetRes } from '@/types/http-types/idiom-list';
import styles from './index.module.less';

const FilterMap = { blur: 1, firstWord: 2, firstPinyin: 3 };
const DEFAULT_FILTER = [
  { name: '模糊匹配', value: FilterMap.blur },
  { name: '首字匹配', value: FilterMap.firstWord },
  { name: '首音节匹配', value: FilterMap.firstPinyin },
];
const Dictionary = () => {
  const [searchValue, setSearchValue] = useState('一');
  const debouncedValue = useDebounce<string>(searchValue, 500);

  const handleChange = (value: string) => {
    setSearchValue(value.trim().slice(0, 8));
  };

  const [activeFilter, setActiveFilter] = useState(FilterMap.blur);

  const getIdiomList = useCallback(async (params: IdiomListGetReq) => {
    try {
      const res = await HttpRequest<IdiomListGetReq, IdiomListGetRes['data']>({
        url: IdiomApi.getList,
        data: { ...params, pageSize: 20 },
      });
      return res?.list;
    } catch (error) {
      console.error('%c IdiomApi.getList error:', 'color: #fff;background: #b457ff;', error);
      return [];
    }
  }, []);

  const handleSearchList = useCallback(async () => {
    const firstLetter = debouncedValue[0];

    const params: IdiomListGetReq = {};
    if (activeFilter === FilterMap.firstPinyin) {
      // 首音节匹配
      const searchValueFirstPinyin = pinyin(debouncedValue)[0][0];

      params.pinyin = searchValueFirstPinyin;
      params.isFirst = '1';
    } else if (activeFilter === FilterMap.firstWord) {
      // 首字匹配
      params.word = firstLetter;
      params.isFirst = '1';
    } else {
      // 模糊匹配
      params.word = debouncedValue;
    }
    const res = await getIdiomList(params);
    setShowArr(res);
  }, [debouncedValue, getIdiomList, activeFilter]);

  const [showArr, setShowArr] = useState<IdiomListGetRes['data']['list']>([]);
  useEffect(() => {
    if (debouncedValue) {
      handleSearchList();
    }
  }, [debouncedValue, handleSearchList]);

  const handleToggleFilter = async (currentItem) => {
    if (currentItem.value === activeFilter) return;
    setActiveFilter(currentItem.value);
  };

  const isSearching = !!debouncedValue;
  return (
    <View className="index">
      <AtSearchBar value={searchValue} onChange={handleChange} onActionClick={handleSearchList} />
      <View className={styles.tagCon}>
        {DEFAULT_FILTER.map((item) => {
          return (
            <AtTag circle size="small" key={item.value} active={item.value === activeFilter} className={styles.tag} onClick={() => handleToggleFilter(item)}>
              {item.name}
            </AtTag>
          );
        })}
      </View>
      {isSearching && (
        <View className={styles.showArrCon}>
          {showArr.length ? (
            showArr.map((item, index) => {
              return <IdiomItem key={index} item={item} />;
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
