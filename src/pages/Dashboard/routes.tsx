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
                headerRender: false,
                footerRender: false,
                menuRender: false,
            },
            {
                path: '/dashboard/did',
                name: 'Did',
                icon: <IdcardOutlined />,
                component: './Did',
            },
            {
                path: '/dashboard/advertisement',
                name: 'Advertisement',
                icon: <NotificationOutlined />,
                component: './Advertisement',
            },
            {
                path: '/dashboard/bridge',
                name: 'Bridge',
                icon: <DeploymentUnitOutlined />,
                component: './Bridge',
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