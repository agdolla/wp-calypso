/**
 * External Dependencies
 */
import React from 'react';
import page from 'page';
import route from 'lib/route';
import get from 'lodash/get';
import i18n from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import PeopleList from './main';
import EditTeamMember from './edit-team-member-form';
import analytics from 'lib/analytics';
import titlecase from 'to-title-case';
import UsersStore from 'lib/users/store';
import UsersActions from 'lib/users/actions';
import PeopleLogStore from 'lib/people/log-store';
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';
import InvitePeople from './invite-people';
import { renderWithReduxStore } from 'lib/react-helpers';
import { getCurrentLayoutFocus } from 'state/ui/layout-focus/selectors';
import { setNextLayoutFocus } from 'state/ui/layout-focus/actions';
import config from 'config';
import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';

export default {
	redirectToTeam,

	enforceSiteEnding( context, next ) {
		const siteId = route.getSiteFragment( context.path );

		if ( ! siteId ) {
			redirectToTeam( context );
		}

		next();
	},

	people( filter, context ) {
		renderPeopleList( filter, context );
	},

	invitePeople( context ) {
		renderInvitePeople( context );
	},

	person( context ) {
		renderSingleTeamMember( context );
	}
};

function redirectToTeam( context ) {
	if ( context ) {
		// if we are redirecting we need to retain our intended layout-focus
		const currentLayoutFocus = getCurrentLayoutFocus( context.store.getState() );
		context.store.dispatch( setNextLayoutFocus( currentLayoutFocus ) );
	}
	page.redirect( '/people/team' );
}

function renderPeopleList( filter, context ) {
	context.store.dispatch( setTitle( i18n.translate( 'People', { textOnly: true } ) ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.

	renderWithReduxStore(
		React.createElement( PeopleList, {
			peopleLog: PeopleLogStore,
			filter: filter,
			search: context.query.s
		} ),
		document.getElementById( 'primary' ),
		context.store
	);
	analytics.pageView.record( 'people/' + filter + '/:site', 'People > ' + titlecase( filter ) );
}

function renderInvitePeople( context ) {
	const state = context.store.getState();
	const site = getSelectedSite( state );
	const isJetpack = get( site, 'jetpack' );

	if ( isJetpack && ! config.isEnabled( 'jetpack/invites' ) ) {
		const currentLayoutFocus = getCurrentLayoutFocus( state );
		context.store.dispatch( setNextLayoutFocus( currentLayoutFocus ) );
		page.redirect( '/people/team/' + site.slug );
		analytics.tracks.recordEvent( 'calypso_invite_people_controller_redirect_to_team' );
	}

	context.store.dispatch( setTitle( i18n.translate( 'Invite People', { textOnly: true } ) ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.

	renderWithReduxStore(
		React.createElement( InvitePeople, {
			site: site
		} ),
		document.getElementById( 'primary' ),
		context.store
	);
}

function renderSingleTeamMember( context ) {
	const userLogin = context.params.user_login;

	const state = context.store.getState();
	const siteId = getSelectedSiteId( state );
	const site = getSelectedSite( state );

	context.store.dispatch( setTitle( i18n.translate( 'View Team Member', { textOnly: true } ) ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.

	if ( siteId && 0 !== siteId ) {
		const user = UsersStore.getUserByLogin( siteId, userLogin );

		if ( ! user ) {
			UsersActions.fetchUser( { siteId: siteId }, userLogin );
			//TODO: port to redux
			PeopleLogStore.once( 'change', function() {
				let fetchUserError = PeopleLogStore.getErrors(
					log => siteId === log.siteId && 'RECEIVE_USER_FAILED' === log.action && userLogin === log.user
				);
				if ( fetchUserError.length ) {
					const currentLayoutFocus = getCurrentLayoutFocus( state );
					context.store.dispatch( setNextLayoutFocus( currentLayoutFocus ) );
					page.redirect( '/people/team/' + get( site, 'slug', '' ) );
				}
			} );
		} else {
			analytics.pageView.record( 'people/edit/:user_login/:site', 'View Team Member' );
		}
	}

	renderWithReduxStore(
		React.createElement( EditTeamMember, {
			userLogin: userLogin,
			prevPath: context.prevPath
		} ),
		document.getElementById( 'primary' ),
		context.store
	);
}
