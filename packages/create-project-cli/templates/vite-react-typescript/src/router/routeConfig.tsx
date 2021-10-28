import { DesktopOutlined } from '@ant-design/icons';

export interface RouteConfigInterface {
  key: string;
  icon?: JSX.Element;
  name: string;
  children?: RouteConfigInterface[];
  showButton?: boolean;
}

export const RouteConfig: RouteConfigInterface[] = [
  {
    key: '/dashboard/home',
    icon: <DesktopOutlined />,
    name: '首页',
  },
];
