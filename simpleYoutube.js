        var SimpleYoutube = (function() {
            'use strict';

            // 글로벌 변수
            var global = {};

            // 글로벌 설정변수
            global.config = {
                version: '1.0.0',
                apiKey: null,
                searchUrl: 'https://www.googleapis.com/youtube/v3/search'
            };

            // 유틸
            var func = {};
            func.ajaxJsonp = function(params) {
                var url = params.url;
                var data = params.data;
                var callback = params.callback;

                // 이름 임의생성
                var callbackFuncName = 'simpleYoutube_' + new Date().getTime() + '_' + Math.ceil(Math.random() * 1000);

                // 콜백함수 등록
                if (callback) {
                    window[callbackFuncName] = params.callback;
                }

                var dataSting = [];
                for (var i in data) {
                    dataSting.push(i + '=' + data[i]);
                }
                url = url + '?callback=' + callbackFuncName + '&' + dataSting.join('&');
                func.callScript(url, callbackFuncName);


                // 호출된 스크립트 삭제
                var deleteElement = document.getElementById(callbackFuncName)
                func.addEvent('load', deleteElement, function() {
                    deleteElement.parentNode.removeChild(deleteElement);
                });

            }
            func.callScript = function(url, callbackName) {
                if (!url) {
                    return;
                }
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = !0;
                s.src = url;
                s.id = callbackName || '';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }
            func.addEvent = function(event, element, callback) {
                if (element.addEventListener) {
                    element.addEventListener(event, callback, false);
                } else {
                    element.attachEvent('on' + event, callback);
                }
            }

            // 실행시 세팅객체
            var setting = {};
            setting.setApiKey = function(key) {
                if (key) {
                    global.config.apiKey = key;
                }
            };
            setting.getApiKey = function(key) {
                return global.config.apiKey;
            };

            // 유튜브 검색
            var search = {};

            search.variable = {
                query: '',
                prevPage: '',
                nextPage: '',
                totalResults: ''
            };

            search.func = {
                settting: function(response) {
                    if (!response.error) {
                        search.variable.prevPage = response.prevPageToken;
                        search.variable.nextPage = response.nextPageToken;
                        search.variable.totalResults = response.pageInfo.totalResults;
                    }
                }
            };

            search.query = function(query, callbackFunc) {
                if (typeof query === 'string' && setting.getApiKey()) {
                    search.variable.query = query;
                    func.ajaxJsonp({
                        url: global.config.searchUrl,
                        data: {
                            q: encodeURI(query),
                            part: "snippet",
                            key: setting.getApiKey(),
                            regionCode: 'kr',
                            safeSearch: 'none',
                            type: 'video',
                            videoDefinition: 'high',
                            videoSyndicated: 'true',
                            maxResults: '50'
                        },
                        callback: function(response) {
                            search.func.settting(response);
                            callbackFunc(response);
                        }
                    });
                }
            }

            /*
                search.query 후 바로 next를 호출할때는 promise 사용해야됩니다. 최소한(setTimeout 500ms)
            */
            search.next = function(callbackFunc) {
                func.ajaxJsonp({
                    url: global.config.searchUrl,
                    data: {
                        q: search.variable.query,
                        pageToken: search.variable.nextPage,
                        part: "snippet",
                        key: setting.getApiKey(),
                        regionCode: 'kr',
                        safeSearch: 'none',
                        type: 'video',
                        videoDefinition: 'high',
                        videoSyndicated: 'true',
                        maxResults: '50'
                    },
                    callback: function(response) {
                        search.func.settting(response);
                        callbackFunc(response);
                    }
                });
            }

            // 비디오 아이디, 제목, 이미지만 리턴한다.
            search.fetchList = function(response) {
                var list = [];
                response.items.forEach(function(item, index) {
                    var video = {
                        id: item.id.videoId,
                        title: item.snippet.title,
                        thumbnails: item.snippet.thumbnails.high.url
                    };
                    list.push(video);
                });

                return list;
            }


            var returnObject = {};
            returnObject.setKey = setting.setApiKey;
            returnObject.query = search.query;
            returnObject.next = search.next;
            returnObject.fetchList = search.fetchList;

            return returnObject;

        })();
