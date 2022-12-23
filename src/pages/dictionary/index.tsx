import { useState, useEffect, useCallback } from 'react';
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { IdiomItem, Empty } from '@/components/index';
import HttpRequest from '@/config/request';
import { pinyin } from 'pinyin-pro';
import { AtSearchBar, AtTag } from 'taro-ui';
import { IdiomApi } from '@/api/index';
import { useDebounce } from 'use-debounce';
import type { IdiomListGetReq, IdiomListGetRes } from '@/types/http-types/idiom-list';
import styles from './index.module.less';

const FilterMap = { blur: 1, firstWord: 2, firstPinyin: 3 };
const DEFAULT_FILTER = [
  { name: '模糊匹配', value: FilterMap.blur },
  { name: '首字匹配', value: FilterMap.firstWord },
  { name: '首音节匹配', value: FilterMap.firstPinyin },
];
const Dictionary = () => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue] = useDebounce<string>(searchValue, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChangeValue = (value: string) => {
    setSearchValue(value.trim().slice(0, 8));
  };

  const handleClearValue = () => {
    setSearchValue('');
  };

  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '成语接龙，试试你可以接几个',
      path: '/pages/index/index',
    };
  });

  useShareTimeline(() => {
    return {
      title: '成语接龙，随便接一个',
      path: '/pages/index/index',
    };
  });

  const [activeFilter, setActiveFilter] = useState(FilterMap.blur);

  const getIdiomList = useCallback(async (params: IdiomListGetReq) => {
    try {
      setLoading(true);
      const res = await HttpRequest<IdiomListGetReq, IdiomListGetRes['data']>({
        url: IdiomApi.getList,
        data: { ...params, pageSize: 10 },
      });
      setTotal(res?.total || 0);
      return res?.list || [];
    } catch (error) {
      console.error('%c IdiomApi.getList error:', 'color: #fff;background: #b457ff;', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索列表
  useEffect(() => {
    if (!debouncedValue) {
      return setShowArr([]);
    }
    const firstLetter = debouncedValue[0];

    const params: IdiomListGetReq = { page: currentPage };
    if (activeFilter === FilterMap.firstPinyin) {
      // 首音节匹配
      const searchValueFirstPinyin = pinyin(debouncedValue, { toneType: 'none', type: 'array' })[0];

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
    getIdiomList(params).then((res) => {
      if (currentPage === 1) {
        setShowArr(res);
        return;
      } else {
        setShowArr((prev) => [...prev, ...res]);
      }
    });
  }, [debouncedValue, getIdiomList, activeFilter, currentPage]);

  const [showArr, setShowArr] = useState<IdiomListGetRes['data']['list']>([]);

  useEffect(() => {
    if (debouncedValue) {
      setCurrentPage(1); // 搜索时重置页码
    }
  }, [debouncedValue]);

  const handleToggleFilter = async (currentItem) => {
    if (currentItem.value === activeFilter) return;
    setCurrentPage(1); // 切换过滤器时重置页码
    setActiveFilter(currentItem.value);
  };

  // 页面滚动到底部
  const onScrollToLower = () => {
    if (loading) return; // 正在加载中
    if (showArr.length >= total) return; // 已加载完所有数据
    setCurrentPage(currentPage + 1); // 页码加1
  };

  const isSearching = !!debouncedValue;
  return (
    <View className={styles.dictionaryCon}>
      <AtSearchBar value={searchValue} fixed maxLength={10} onClear={handleClearValue} onChange={handleChangeValue} />
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
        <ScrollView
          pagingEnabled
          scrollY
          scrollWithAnimation
          lowerThreshold={40}
          upperThreshold={40}
          onScrollToLower={onScrollToLower}
          className={styles.listCon}
        >
          {showArr.length ? (
            <>
              {showArr.map((item, index) => {
                return <IdiomItem key={index} item={item} />;
              })}
              <View className={styles.bottomTips}>{loading ? '加载中...' : showArr.length >= total ? '没有更多了' : ''}</View>
            </>
          ) : (
            <Empty />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Dictionary;
