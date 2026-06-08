import {
  IconBrandProducthunt,
  IconCategory,
  IconCategory2,
  IconDashboard,
  IconFileText,
  IconIcons,
  IconShoppingBag,
  IconTruck,
  IconUserPlus,
  IconGift
} from '@tabler/icons-react';
import type { SidebarData } from '@/types/navigation';
import { APP_CONFIG } from '@/config/app';

export const SIDEBAR_DATA: SidebarData = {
  // main navigation for all users
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: IconDashboard,
    },
    {
      title: 'Products',
      url: '/products',
      icon: IconTruck,
    },
    {
      title: 'Brands',
      url: '/brand',
      icon: IconIcons,
    },
    {
      title: 'Categories',
      url: '/category',
      icon: IconCategory,
    },
    {
      title: 'Sub-category',
      url: '/subcategory',
      icon: IconCategory2,
    },
    {
      title: 'Orders',
      url: '/order',
      icon: IconShoppingBag,
    },
  ],

  // only admin can see this navigation
  admin: [
    {
      title: 'Products',
      url: '/products',
      icon: IconBrandProducthunt
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconFileText,
      children: [
        {
          title: "Order Report",
          url: "/reports/order-reports",
        },
        {
          title: "Customer Report",
          url: "/reports/customer-reports",
        },
        {
          title: "Lucky Draw Report",
          url: "/reports/lucky-draw-reports",
        },
        {
          title: "Winner Report",
          url: "/reports/winner-reports",
        },
        {
          title: "Sales Report",
          url: "/reports/sales-reports",
        },
        {
          title: "Purchase Report",
          url: "/reports/purchase-reports",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUserPlus,
    },
    {
      title: "Draw Campaigns",
      url: "/draws",
      icon: IconGift,
    },
  ],

};

export const COMPANY_INFO = {
  name: APP_CONFIG.name,
  description: APP_CONFIG.description,
} as const;
