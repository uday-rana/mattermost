// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import type {Dispatch} from 'redux';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {Preferences} from 'mattermost-redux/constants';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {get} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import type {GlobalState} from 'types/store';

import type {OwnProps} from './render_emoticons_as_emojis';
import RenderEmoticonsAsEmojiSection from './render_emoticons_as_emojis';

export function mapStateToProps(state: GlobalState, props: OwnProps) {
    const config = getConfig(state);
    const renderEmoticonsAsEmoji = config.EnableRenderEmoticonsAsEmoji === 'true';
    const userPreference = props.adminMode && props.userPreferences ? props.userPreferences : undefined;

    return {
        userId: props.adminMode ? props.userId : getCurrentUserId(state),
        renderEmoticonsAsEmoji: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.RENDER_EMOTICONS_AS_EMOJI, renderEmoticonsAsEmoji.toString(), userPreference),
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators({
            savePreferences,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RenderEmoticonsAsEmojiSection);
