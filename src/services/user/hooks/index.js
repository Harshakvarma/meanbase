'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const verifyHooks = require('feathers-service-verify-reset').hooks
const permissionName = 'manageUsers';

function ifFirstUserThenAdmin(hook) {
  return new Promise((resolve, reject) => {
    hook.app.service('/users').find({query: {}}).then(function(found) {
      console.log("Checking if first user", found);
      if(!Array.isArray(found) && found.data) {
        found = found.data
      }

      if(found.length === 0) {
        hook.data.role = 'admin'
        console.log('set role to admin');
      }

      resolve(hook)
    }, function(err) {
      reject(err)
    });
  })
}

function defaultRole(hook) {
  return new Promise(async (resolve, reject) => {
    if(hook.data) {
      try {
        let defaultRole = await hook.app.service('settings').find({name: 'defaultRole'})
        defaultRole = defaultRole[0]

        if(defaultRole && defaultRole.value && defaultRole.value.role) {
          hook.data.role = defaultRole.value.role
        }

        resolve(hook)
      } catch(err) {
        resolve(hook)
      }
    }

  })
}

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.attachPermissions(),
    globalHooks.isEnabled(),
    globalHooks.hasPermission(permissionName)
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.attachPermissions(),
    globalHooks.isEnabled()
    // auth.restrictToOwner({ ownerField: '_id' }),
  ],
  create: [
    auth.hashPassword(),
    defaultRole,
    ifFirstUserThenAdmin,
    verifyHooks.addVerification()
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.attachPermissions(),
    globalHooks.isEnabled(),
    globalHooks.hasPermissionOrRestrictChanges(permissionName, {restrictOn: ['role', 'enabled'] }),
    globalHooks.permitChangePassword(),
    globalHooks.ifPasswordThenHash()
  ],
  patch: [
    globalHooks.allowUpsert(),
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.attachPermissions(),
    globalHooks.isEnabled(),
    globalHooks.hasPermissionOrRestrictChanges(permissionName, {restrictOn: ['role', 'enabled'] }),
    globalHooks.permitChangePassword(),
    globalHooks.ifPasswordThenHash()
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.attachPermissions(),
    globalHooks.isEnabled(),
    globalHooks.hasPermission(permissionName)
  ]
};

exports.after = {
  all: [
    hooks.remove('password')
  ],
  find: [
    verifyHooks.removeVerification(true),
  ],
  get: [
    globalHooks.attachPermissions(),
    verifyHooks.removeVerification(true)
  ],
  create: [
    globalHooks.attachPermissions(),
    globalHooks.sendVerificationEmail(),
    verifyHooks.removeVerification(true)
  ],
  update: [
    verifyHooks.removeVerification(true)
  ],
  patch: [
    verifyHooks.removeVerification()
  ],
  remove: [
    verifyHooks.removeVerification()
  ]
};
