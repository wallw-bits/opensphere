goog.provide('os.ui.menu.save');

goog.require('os.ui.menu.Menu');
goog.require('os.ui.menu.MenuItem');
goog.require('os.ui.menu.MenuItemType');
goog.require('os.ui.state.action');


/**
 * Application save menu.
 * @type {(os.ui.menu.Menu<undefined>|undefined)}
 */
os.ui.menu.SAVE = new os.ui.menu.Menu(new os.ui.menu.MenuItem({
  type: os.ui.menu.MenuItemType.ROOT,
  children: [{
    label: 'State',
    eventType: os.ui.state.action.EventType.SAVE_STATE,
    tooltip: 'Save the application state',
    icons: ['<i class="fa fa-fw fa-bookmark"></i>'],
    metricKey: os.metrics.keys.Map.SAVE_STATE,
    shortcut: 'Ctrl+S',
    sort: 10
  }]
}));


/**
 * Set up the menu.
 */
os.ui.menu.save.setup = function() {
  var menu = os.ui.menu.SAVE;
  if (menu) {
    menu.listen(os.ui.state.action.EventType.SAVE_STATE, os.ui.menu.save.onSaveState);
  }
};


/**
 * Disposes layer actions
 */
os.ui.menu.save.dispose = function() {
  goog.dispose(os.ui.menu.SAVE);
  os.ui.menu.SAVE = undefined;
};


/**
 * Save the application state.
 */
os.ui.menu.save.onSaveState = function() {
  os.ui.stateManager.startExport();
};
