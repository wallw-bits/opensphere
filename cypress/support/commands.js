// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
var core = require('../support/selectors/core.js');
var layers = require('../support/selectors/layers.js');
var index = require('./index.js');
var shared = require('../support/selectors/shared.js');
var addMatchImageSnapshotCommand = require('cypress-image-snapshot/command')
    .addMatchImageSnapshotCommand;

var projection;

// Must add CYPRESS_ prefix to environment variables, but use it here without the prefix
if (Cypress.env('PROJECTION')) {
  projection = Cypress.env('PROJECTION');
} else {
  projection = 3857;
}
var snapshotFolder = 'cypress/comparisons/' + projection;

addMatchImageSnapshotCommand({
  customDiffConfig: {threshold: 0.2},
  failureThreshold: 0.0005,
  failureThresholdType: 'percent',
  customSnapshotsDir: snapshotFolder,
  blackout: [core.Toolbar.PANEL,
    core.statusBar.PANEL,
    '.ol-overviewmap',
    core.Map.ATTRIBUTION,
    layers.Dialog.DIALOG,
    '.ol-zoom',
    core.Map.ROTATION_BUTTON,
    core.Map.MAP_MODE_BUTTON]
});

Cypress.Commands.add('imageComparison', function(name) {
  cy.wait(6000);
  cy.get(layers.layersTab.Tree.LOADING_SPINNER, {timeout: 20000}).should('not.be.visible');
  cy.get(layers.layersTab.Tree.STREET_MAP_TILES)
      .find(shared.Tree.ROW_CHECKBOX)
      .click();
  cy.get(layers.layersTab.Tree.WORLD_IMAGERY_TILES)
      .find(shared.Tree.ROW_CHECKBOX)
      .click();
  cy.wait(200);
  cy.matchImageSnapshot(name);
  cy.get(layers.layersTab.Tree.STREET_MAP_TILES)
      .find(shared.Tree.ROW_CHECKBOX)
      .click();
  cy.get(layers.layersTab.Tree.WORLD_IMAGERY_TILES)
      .find(shared.Tree.ROW_CHECKBOX)
      .click();
});

Cypress.Commands.add('login', function(clearLocalStorage) {
  // allows the tester to toggle reload off temporarily
  clearLocalStorage = clearLocalStorage || true;

  if (clearLocalStorage) {
    indexedDB.deleteDatabase(index.IndexedDB.FILES);
    indexedDB.deleteDatabase(index.IndexedDB.SETTINGS);
  }
  cy.visit('index.html' + index.HIDE_TIPS); // TODO: Windows 10 issue. Remove index.html after fixed: https://github.com/http-party/http-server/issues/525
  cy.get(layers.layersTab.Tree.STREET_MAP_TILES, {timeout: 15000}).should('be.visible');
  cy.get(layers.layersTab.Tree.LOADING_SPINNER, {timeout: 20000}).should('not.be.visible');
});

Cypress.Commands.add('upload', function(fileName) {
  cy.get(core.Application.HIDDEN_FILE_INPUT).then(function(subject) {
    cy.fixture(fileName, 'base64')
        .then(Cypress.Blob.base64StringToBlob)
        .then(function(blob) {
          var el = subject[0];
          var testFile = new File([blob], fileName);
          var dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          return cy.wrap(subject).trigger('change', {force: true});
        });
  });
});

Cypress.Commands.add('rightClick', {prevSubject: 'element'}, function(subject) {
  cy.wrap(subject).trigger('contextmenu');
});
