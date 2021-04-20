/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: []
    },
    {
        id      : 'apps.people',
        title   : 'People',
        type    : 'aside',
        icon    : 'heroicons_outline:user-group',
        children: [
            {
                id      : 'people.new-family',
                title   : 'New Family',
                subtitle: 'Add a new family',
                type    : 'basic',
                icon    : 'heroicons_outline:user-group',
                link    : '/apps/people/new-family',
                exactMatch: true
            },
            {
                id   : 'people.contacts',
                title: 'People',
                subtitle: 'People directory',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/apps/people',
                exactMatch: true
            },
        ] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps.groups',
        title   : 'Groups',
        type    : 'aside',
        icon    : 'heroicons_outline:view-grid',
        children: [
            {
                id      : 'groups.cell-ministry',
                title   : 'Cell Ministry',
                type    : 'collapsable',
                icon    : 'heroicons_outline:view-boards',
                link : '/apps/groups/cell-ministry',
                children: [
                    {
                        id   : 'groups.cell-ministry.dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        link : '/apps/groups/cell-ministry',
                        exactMatch: true,
                    },
                    {
                        id   : 'groups.cell-ministry.attendance-reports',
                        title: 'Cell Attendance Records',
                        type : 'basic',
                        link : '/apps/groups/cell-ministry/attendance-reports',
                        exactMatch: true,
                    }
                ]
            }
        ]
    },
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
