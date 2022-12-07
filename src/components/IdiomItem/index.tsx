import { useState } from 'react';
import { AtAccordion, AtList, AtListItem } from 'taro-ui';

export default function IdiomItem(props) {
  const [open, setOpen] = useState(true);
  return <AtAccordion open={open} onClick={() => {}} title="标题一"></AtAccordion>;
}
