import { Apps, FolderPlus, Thread } from '../../ChannelList/Icons';
import { ListRowElement } from '../../ChannelList/TopBar/MenuItems';

export const plusItems: ListRowElement[] = [
  {
    name: 'Upload a File',
    icon: <FolderPlus />,
    bottomBorder: false,
    reverseOrder: true,
  },
  {
    name: 'Create Thread',
    icon: <Thread />,
    bottomBorder: false,
    reverseOrder: true,
  },
  { name: 'Use Apps', icon: <Apps />, bottomBorder: false, reverseOrder: true },
];