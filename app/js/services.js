'use strict';
/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1');
//
// This is the working indicator
//
angular.module('JobIndicator', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
// todo start the spinner here
            $('.loading').slideDown('slow');
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
// do something on success
// todo hide the spinner
                $('.loading').slideUp('slow');
                return response;
            }, function (response) {
// do something on error
// todo hide the spinner
//$('.warn').slideDown('slow');
//$('.warn span').text('Something not right');
                console.info('services.js -> "JobIndicator" condition went to error.');
                return $q.reject(response);
            });
        };
    });

angular.module('gitHubAPI', [], function ($provide) {
    $provide.factory('ghAPI', function ($http) {
        var api_url = 'https://api.github.com/gists',
            token = localStorage.token;
        var api = {
// POST /authorizations
            login: function (user, pass, callback) {
                $http({
                    method: 'POST',
                    url: 'https://api.github.com/authorizations',
                    data: {"scopes": [
                        "gist"
                    ],
                        "note": "Gisto"
                    },
                    headers: {
                        "Authorization": "Basic " + btoa(user + ":" + pass),
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).success(function (data, status, headers, config) {
                        localStorage.token = token = data.token;
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },
            // GET /gists
            gists: function (callback, pageNumber, updateOnly) {
                var url = pageNumber ? api_url + '?page=' + pageNumber : api_url,
                    headers = {
                        Authorization: 'token ' + token
                    };

                if (updateOnly) {
                    headers['If-Modified-Since'] = localStorage.gistsLastUpdated;
                }

                $http({
                    method: 'GET',
                    url: url,
                    headers: headers
                }).success(function (data, status, headers, config) {
                        callback(data);

                        // check if there are more gists and retrieve them
                        var headers = headers();
                        if (headers.link) {
                            var links = headers.link.split(',');
                            for (var link in links) {
                                link = links[link];
                                if (link.indexOf('rel="next') > -1) {
                                    pageNumber = link.match(/[0-9]+/)[0];
                                    api.gists(callback, pageNumber, null);
                                }
                            }
                        }
                    }).error(function (data, status, headers, config) {
                        callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },
            // GET /gists/:id
            gist: function (id, callback) {
                $http({
                    method: 'GET',
                    url: api_url + '/' + id,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        callback(data);
                    }).error(function (data, status, headers, config) {
                        callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },
            // POST /gists
            create: function (data, callback) {
                $http({
                    method: 'POST',
                    url: api_url,
                    data: data,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },
            // PATCH /gists/:id
            edit: function (id, data, callback) {
                $http({
                    method: 'PATCH',
                    url: api_url + '/' + id,
                    data: data,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },
            // DELETE /gists/:id
            delete: function (id, callback) {
                $http({
                    method: 'DELETE',
                    url: api_url + '/' + id,
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },
            // GET /gists/:id/comments
            comments: function (id, callback) {
                $http({
                    method: 'GET',
                    url: api_url + '/' + id + '/comments',
                    headers: {
                        Authorization: 'token ' + token
                    }
                }).success(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    }).error(function (data, status, headers, config) {
                        return callback({
                            data: data,
                            status: status,
                            headers: headers(),
                            config: config
                        });
                    });
            },
            // GET /gists/starred
            starred: function () {
            },
            // PUT /gists/:id/star
            star: function () {
            },
            // DELETE /gists/:id/star
            unstar: function () {
            },
            // GET /gists/:id/star
            is_starred: function () {
            },
            // POST /gists/:id/forks
            fork: function () {
            }
        };

        return api;
    });
});

angular.module('cacheService', ['gitHubAPI', 'gistData'], function ($provide) {
    $provide.factory('cacheService', function (ghAPI, gistData) {
        var cacheService = {
            generateKey: function (func, params) {
                var key = func + '/';

                if (params.hasOwnProperty('id')) {
                    key += params.id;
                }

                cacheService.set('cachedKeys', [key]);
                return key;
            },
            get: function (func, scope, params, invalidate) {
                params = params || {};
                var key = cacheService.generateKey(func, params);
                var cache = false; // debug
                if (navigator.onLine && !cache) {
                    cacheService[func].call(scope, key, params, invalidate);
                } else {
                    var cachedData = localStorage[key];
                    if (cachedData) {
                        if (Object.prototype.toString.call(scope) === '[object Array]') {
                            scope.push.apply(scope, JSON.parse(cachedData));
                        } else { // json object
                            var parsedData = JSON.parse(cachedData);
                            // modify the existing object so we won't break the model binding
                            for (var item in parsedData) {
                                scope[item] = parsedData[item];
                            }
                        }
                    }
                }
            },
            set: function (key, value, invalidate) {
                if (invalidate) {
                    console.log('invalidate');
                    localStorage[key] = JSON.stringify(value); // overwrite value
                } else {
                    var data = null;
                    try {
                        data = JSON.parse(localStorage[key]);
                    } catch (parseException) {
                        data = [];
                    }
                    if (Object.prototype.toString.call(data) === '[object Array]') {
                        data.push.apply(data, value || []);
                    } else { // json object
                        data = value; // overwrite the data instead of adding it
                    }
                    localStorage[key] = JSON.stringify(data);
                }

            },
            invalidateCache: function () {
                var cachedKeys = localStorage.cachedKeys;
                if (cachedKeys) {
                    cachedKeys = JSON.parse(cachedKeys);
                    for (var key in cachedKeys) {
                        delete localStorage[cachedKeys[key]];
                    }
                    delete localStorage.cachedKeys;
                }
            },
            getGists: function (key, params, invalidate) {
                var that = this;

                ghAPI.gists(function (data) {

                    // process response
                    for (var item in data) {
                        data[item].tags = data[item].description ? data[item].description.match(/(#[A-Za-z0-9\-\_]+)/g) : [];
                        data[item].single = {};
                    }

                    // append data to current scope
                    that.push.apply(that, data);

                    // save local copy
                    cacheService.set(key, data, invalidate);

                });
            },
            getSingleGist: function (key, params, cacheOnly) {

                ghAPI.gist(params.id, function (data) {
                    if (!cacheOnly) {
                        var gist = gistData.getGistReferenceById(params.id);
                        gist.single = data; // update the current viewed gist
                    }

                    cacheService.set(key, data, true);
                });

            }
        };
        return cacheService;
    });
});

angular.module('gistData', [], function ($provide) {
    $provide.factory('gistData', function () {
        var dataService = {
            list: [],
            getGistReferenceById: function (id) {
                for (var gist in dataService.list) {
                    gist = dataService.list[gist];
                    if (gist.id === id) {
                        return gist;
                    }
                }
            }
        };
        return dataService;
    });
});
