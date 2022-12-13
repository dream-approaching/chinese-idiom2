import { useState } from 'react';
import ArrowIcon from '@/assets/images/arrow.png';
import { generalColorByStr } from '@/utils/index';
import type { IdiomListGetRes } from '@/types/http-types/idiom-list';
import styles from './index.module.less';

export default function IdiomItem({ item }: { item: IdiomListGetRes['data']['list'][0] }) {
  const [open, setOpen] = useState(true);

  const contentArr = [
    { key: '拼音', value: item.pinyin },
    { key: '释义', value: item.explanation },
    { key: '出处', value: item.derivation },
    { key: '例子', value: item.example },
  ];

  const handleToggleStatus = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.collapseCon} onClick={handleToggleStatus}>
      <div className={styles.leftCon} style={{ backgroundColor: generalColorByStr(item.pinyin.split(' ')[0]) }}>
        <div className={styles.avatarText}>{item.pinyin.split(' ')[0]}</div>
      </div>
      <div className={styles.rightCon}>
        <div className={styles.titleCon}>
          <span className={styles.titleText}>{item.word}</span>
          <img className={`${styles.icon} ${open ? styles.openIcon : ''}`} src={ArrowIcon} />
        </div>
        <div className={`${styles.contentCon} ${open ? styles.showAll : ''}`}>
          {contentArr.map((contentItem, index) => {
            return (
              <div key={index} className={styles.content}>
                <span className={styles.contextKey}>{contentItem.key}: </span>
                <span className={styles.contextValue}>{contentItem.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
