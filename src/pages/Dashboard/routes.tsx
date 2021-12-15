import { DeploymentUnitOutlined, GoldOutlined, IdcardOutlined, NotificationOutlined } from '@ant-design/icons';

export default {
    route: {
        path: '/dashboard',
        routes: [
            {
                path: '/dashboard',
                name: 'Index',
                component: './Index',
                hideInMenu: true,
                menuRender: false,
            },
            {
                path: '/dashboard/did',
                name: 'Did',
                icon: <IdcardOutlined />,
                component: './Did',
            },
            {
                path: '/dashboard/ads',
                name: 'Ads',
                icon: <NotificationOutlined />,
                component: './Ads',
            },
            {
                path: '/dashboard/bridge',
                name: 'Bridge',
                icon: <DeploymentUnitOutlined />,
                component: './Bridge',
            },
            {
                path: '/dashboard/stake',
                name: 'Stake',
                icon: <GoldOutlined />,
                component: './Stake',
            },
            {
                path: '/dashboard/farm',
                name: 'Farm',
                icon: <GoldOutlined />,
                component: './Farm',
            },
        ],
    },
    location: {
        pathname: '/dashboard',
    },
};