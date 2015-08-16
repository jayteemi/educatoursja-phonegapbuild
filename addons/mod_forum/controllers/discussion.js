// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.mod_forum')

/**
 * Forum discussion controller.
 *
 * @module mm.addons.mod_forum
 * @ngdoc controller
 * @name mmaModForumDiscussionCtrl
 */
.controller('mmaModForumDiscussionCtrl', function($q, $scope, $stateParams, $mmaModForum, $mmSite, $mmUtil, mmaModForumComponent) {

    var discussionid = $stateParams.discussionid,
        courseid = $stateParams.courseid;

    $scope.component = mmaModForumComponent;
    $scope.courseid = courseid;

    // Convenience function to get forum discussions.
    function fetchPosts() {
        return $mmaModForum.getDiscussionPosts(discussionid).then(function(posts) {
            $scope.discussion = $mmaModForum.extractStartingPost(posts);
            $scope.posts = posts;
        }, function(message) {
            $mmUtil.showErrorModal(message);
            return $q.reject();
        });
    }

    fetchPosts().then(function() {
        // Add log in moodle.
        $mmSite.write('mod_forum_view_forum_discussion', {
            discussionid: discussionid
        });
    }).finally(function() {
        $scope.discussionLoaded = true;
    });

    // Pull to refresh.
    $scope.refreshPosts = function() {
        $mmaModForum.invalidateDiscussionPosts(discussionid).finally(function() {
            fetchPosts().finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        });
    };
});
