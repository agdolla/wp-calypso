/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import lists from './lists/reducer';
import feeds from './feeds/reducer';
import follows from './follows/reducer';
import settings from './settings/reducer';
import sites from './sites/reducer';
import posts from './posts/reducer';
import relatedPosts from './related-posts/reducer';
import siteBlocks from './site-blocks/reducer';
import tags from './tags/reducer';
import thumbnails from './thumbnails/reducer';
import teams from './teams/reducer';
import feedSearches from './feed-searches/reducer';

export default combineReducers( {
	feeds,
	follows,
	lists,
	settings,
	sites,
	posts,
	relatedPosts,
	siteBlocks,
	tags,
	thumbnails,
	teams,
	feedSearches,
} );
