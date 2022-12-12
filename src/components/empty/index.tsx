import EmptyIcon from '@/assets/images/no-data.png';
import styles from './index.module.less';

export default function Empty() {
  return (
    <div className={styles.emptyWrap}>
      <img className={styles.images} src={EmptyIcon} />
      <div className={styles.tips}>暂无数据</div>
    </div>
  );
}
