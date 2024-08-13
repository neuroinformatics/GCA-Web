/**
 * Require JS main configuration
 */
(function (requirejs) {
  'use strict';

  requirejs.config({
    map: {
      'ko.sortable': {
        'jquery-ui/ui/widgets/sortable': 'jquery-ui',
        'jquery-ui/ui/widgets/draggable': 'jquery-ui',
        'jquery-ui/ui/widgets/droppable': 'jquery-ui',
      },
    },
    paths: {
      requirejs: ['../lib/requirejs/require.min'],
      jquery: ['../lib/jquery/jquery.min'],
      'jquery-ui': ['../lib/jquery-ui/jquery-ui.min'],
      knockout: ['../lib/knockout/knockout'],
      'ko.sortable': ['../lib/knockout-sortable/build/knockout-sortable.min'],
      datetimepicker: ['../lib/datetimepicker/build/jquery.datetimepicker.full.min'],
      'jquery-mousewheel': ['../lib/jquery-mousewheel/jquery.mousewheel'],
      sammy: ['../lib/sammy/sammy.min'],
      dayjs: ['../lib/dayjs/dayjs.min'],
      'dayjs.calendar': ['../lib/dayjs/plugin/calendar'],
      leaflet: ['../lib/leaflet/dist/leaflet'],
      dhtmlxscheduler: ['../lib/dhtmlx-scheduler/codebase/dhtmlxscheduler'],
      offline: ['../lib/offline'],
    },
  });

  return requirejs;
})(requirejs);
